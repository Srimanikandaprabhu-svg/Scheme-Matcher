import express from 'express';
import db from '../db.js';
import { haversine } from '../../../shared/geo.js';

const router = express.Router();

/**
 * GET /api/partners
 * Returns list of partners with optional filters (state_id, type_id)
 */
router.get('/', (req, res) => {
  const { state_id, type_id, limit = 100 } = req.query;
  try {
    let query = `
      SELECT p.id, p.name, pt.name AS type, s.name AS state_name, pg.latitude, pg.longitude
      FROM partners p
      JOIN partner_types pt ON p.type_id = pt.id
      LEFT JOIN states s ON p.state_id = s.id
      LEFT JOIN partner_geo pg ON p.id = pg.partner_id
      WHERE 1=1
    `;
    const params = [];
    if (state_id) {
      query += ' AND p.state_id = ?';
      params.push(state_id);
    }
    if (type_id) {
      query += ' AND p.type_id = ?';
      params.push(type_id);
    }
    query += ' ORDER BY p.name ASC LIMIT ?';
    params.push(Number(limit));

    const partners = db.prepare(query).all(...params);
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/partners/nearby
 * Query params: lat, lng, scheme (code or id), radius (km)
 * Returns list of partners within radius that are eligible for the given scheme.
 */
router.get('/nearby', (req, res) => {
  const { lat, lng, scheme, radius = 50 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required query parameters' });
  }
  const latNum = Number(lat);
  const lngNum = Number(lng);
  const radNum = Number(radius);

  try {
    let allowedTypeIds = [];
    if (scheme) {
      allowedTypeIds = db.prepare(`
        SELECT pt.id FROM partner_types pt
        JOIN scheme_partner_types spt ON pt.id = spt.partner_type_id
        JOIN schemes s ON s.id = spt.scheme_id
        WHERE s.code = ? OR s.id = ?
      `).all(scheme, scheme).map(r => r.id);
    }

    let partners;
    if (allowedTypeIds.length > 0) {
      const placeholders = allowedTypeIds.map(() => '?').join(',');
      partners = db.prepare(`
        SELECT p.id, p.name, pt.name AS type, s.name as state_name, pg.latitude, pg.longitude, pg.is_approximate
        FROM partners p
        JOIN partner_types pt ON p.type_id = pt.id
        LEFT JOIN states s ON p.state_id = s.id
        JOIN partner_geo pg ON p.id = pg.partner_id
        WHERE p.type_id IN (${placeholders})
      `).all(...allowedTypeIds);
    } else {
      partners = db.prepare(`
        SELECT p.id, p.name, pt.name AS type, s.name as state_name, pg.latitude, pg.longitude, pg.is_approximate
        FROM partners p
        JOIN partner_types pt ON p.type_id = pt.id
        LEFT JOIN states s ON p.state_id = s.id
        JOIN partner_geo pg ON p.id = pg.partner_id
      `).all();
    }

    const within = partners
      .map(p => {
        const dist = haversine(latNum, lngNum, p.latitude, p.longitude);
        return { ...p, distance_km: Math.round(dist * 10) / 10 };
      })
      .filter(p => p.distance_km <= radNum);

    // Sort by distance ascending
    within.sort((a, b) => a.distance_km - b.distance_km);

    res.json(within);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
