import express from 'express';
import db from '../db.js';
import { haversine } from '../../../shared/geo.js';

const router = express.Router();

const SIMULATED_DISCLAIMER = 'Simulated data – not live government information';

/**
 * GET /api/partners
 * List all channel partners with category, state, district, coordinates, and simulated health metrics.
 */
router.get('/', (req, res) => {
  const { state_id, district_id, type_id, npa_level, limit = 200 } = req.query;

  try {
    let query = `
      SELECT 
        p.id, p.code, p.name, p.address,
        pt.name AS type,
        s.id AS state_id, s.name AS state_name,
        d.id AS district_id, d.name AS district_name,
        pg.latitude, pg.longitude, pg.is_approximate,
        ps.npa_level, ps.overdue_pct, ps.fund_utilisation_pct, ps.as_on_date, ps.is_simulated
      FROM partners p
      JOIN partner_types pt ON p.type_id = pt.id
      LEFT JOIN states s ON p.state_id = s.id
      LEFT JOIN districts d ON p.district_id = d.id
      LEFT JOIN partner_geo pg ON p.id = pg.partner_id
      LEFT JOIN partner_status ps ON p.id = ps.partner_id
      WHERE 1=1
    `;

    const params = [];
    if (state_id) {
      query += ' AND p.state_id = ?';
      params.push(state_id);
    }
    if (district_id) {
      query += ' AND p.district_id = ?';
      params.push(district_id);
    }
    if (type_id) {
      query += ' AND p.type_id = ?';
      params.push(type_id);
    }
    if (npa_level) {
      query += ' AND ps.npa_level = ?';
      params.push(npa_level.toUpperCase());
    }

    query += ' ORDER BY p.name ASC LIMIT ?';
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);

    const withCoords = [];
    const withoutCoords = [];

    for (const r of rows) {
      const partner = {
        id: r.id,
        code: r.code,
        name: r.name,
        type: r.type,
        address: r.address,
        state: r.state_name,
        district: r.district_name,
        has_coordinates: r.latitude !== null && r.longitude !== null,
        latitude: r.latitude,
        longitude: r.longitude,
        is_approximate: r.is_approximate === 1,
        status: {
          npa_level: r.npa_level || 'LOW',
          overdue_pct: r.overdue_pct || 0,
          fund_utilisation_pct: r.fund_utilisation_pct || 75.0,
          as_on_date: r.as_on_date || '2026-11-09',
          is_simulated: true,
          disclaimer: SIMULATED_DISCLAIMER,
        },
      };

      if (partner.has_coordinates) {
        withCoords.push(partner);
      } else {
        withoutCoords.push(partner);
      }
    }

    res.json({
      total: rows.length,
      with_coordinates: withCoords,
      without_coordinates: withoutCoords,
      disclaimer: SIMULATED_DISCLAIMER,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/partners/nearby
 * Proximity search with automatic radius expansion and state/district fallback.
 */
router.get('/nearby', (req, res) => {
  let { lat, lng, pincode, scheme, radius = 50, state_id } = req.query;

  try {
    // If PIN code provided, resolve coordinates from pincodes table
    let locationSource = 'coordinates';
    let pinMeta = null;
    if (pincode) {
      const pinRow = db.prepare('SELECT pincode, district, state, latitude, longitude FROM pincodes WHERE pincode = ?').get(pincode.trim());
      if (pinRow && pinRow.latitude && pinRow.longitude) {
        lat = pinRow.latitude;
        lng = pinRow.longitude;
        locationSource = `pincode_centroid (${pincode})`;
        pinMeta = pinRow;
      }
    }

    if (!lat || !lng) {
      // Fallback: If no lat/lng could be resolved, return state-level list
      const fallbackRows = db.prepare(`
        SELECT p.id, p.code, p.name, p.address, pt.name AS type, s.name AS state_name,
               ps.npa_level, ps.overdue_pct, ps.fund_utilisation_pct
        FROM partners p
        JOIN partner_types pt ON p.type_id = pt.id
        LEFT JOIN states s ON p.state_id = s.id
        LEFT JOIN partner_status ps ON p.id = ps.partner_id
        ${state_id ? 'WHERE p.state_id = ?' : ''}
        LIMIT 25
      `).all(...(state_id ? [state_id] : []));

      return res.json({
        searched_radius_km: 0,
        expanded: false,
        location_source: 'none',
        results: [],
        fallback_partners: fallbackRows.map((r) => ({
          ...r,
          status: {
            npa_level: r.npa_level,
            overdue_pct: r.overdue_pct,
            fund_utilisation_pct: r.fund_utilisation_pct,
            is_simulated: true,
            disclaimer: SIMULATED_DISCLAIMER,
          },
        })),
        message: 'No coordinates provided or PIN code coordinates unavailable. Showing fallback state channel partners.',
      });
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);
    let radNum = Number(radius);

    // Get allowed partner types for the scheme if scheme specified
    let allowedTypeIds = [];
    if (scheme) {
      allowedTypeIds = db.prepare(`
        SELECT pt.id FROM partner_types pt
        JOIN scheme_partner_types spt ON pt.id = spt.partner_type_id
        JOIN schemes s ON s.id = spt.scheme_id
        WHERE s.code = ? OR s.id = ?
      `).all(scheme, scheme).map((r) => r.id);
    }

    let partnersQuery = `
      SELECT p.id, p.code, p.name, p.address, pt.name AS type, s.id AS state_id, s.name AS state_name,
             pg.latitude, pg.longitude, pg.is_approximate,
             ps.npa_level, ps.overdue_pct, ps.fund_utilisation_pct
      FROM partners p
      JOIN partner_types pt ON p.type_id = pt.id
      LEFT JOIN states s ON p.state_id = s.id
      JOIN partner_geo pg ON p.id = pg.partner_id
      LEFT JOIN partner_status ps ON p.id = ps.partner_id
      WHERE pg.latitude IS NOT NULL AND pg.longitude IS NOT NULL
    `;

    if (allowedTypeIds.length > 0) {
      partnersQuery += ` AND p.type_id IN (${allowedTypeIds.map(() => '?').join(',')})`;
    }

    const geoPartners = db.prepare(partnersQuery).all(...allowedTypeIds);

    let within = geoPartners
      .map((p) => {
        const dist = haversine(latNum, lngNum, p.latitude, p.longitude);
        return {
          id: p.id,
          code: p.code,
          name: p.name,
          address: p.address,
          type: p.type,
          state: p.state_name,
          latitude: p.latitude,
          longitude: p.longitude,
          is_approximate: p.is_approximate === 1,
          distance_km: Math.round(dist * 10) / 10,
          status: {
            npa_level: p.npa_level || 'LOW',
            overdue_pct: p.overdue_pct || 0,
            fund_utilisation_pct: p.fund_utilisation_pct || 75.0,
            is_simulated: true,
            disclaimer: SIMULATED_DISCLAIMER,
          },
        };
      })
      .filter((p) => p.distance_km <= radNum)
      .sort((a, b) => a.distance_km - b.distance_km);

    let expanded = false;
    let originalRadius = radNum;

    // Automatic Radius Expansion: If no partner within default radius, expand to 200km and 500km
    if (within.length === 0 && radNum < 500) {
      expanded = true;
      const expandedRad = radNum <= 100 ? 250 : 500;
      within = geoPartners
        .map((p) => {
          const dist = haversine(latNum, lngNum, p.latitude, p.longitude);
          return {
            id: p.id,
            code: p.code,
            name: p.name,
            address: p.address,
            type: p.type,
            state: p.state_name,
            latitude: p.latitude,
            longitude: p.longitude,
            is_approximate: p.is_approximate === 1,
            distance_km: Math.round(dist * 10) / 10,
            status: {
              npa_level: p.npa_level || 'LOW',
              overdue_pct: p.overdue_pct || 0,
              fund_utilisation_pct: p.fund_utilisation_pct || 75.0,
              is_simulated: true,
              disclaimer: SIMULATED_DISCLAIMER,
            },
          };
        })
        .filter((p) => p.distance_km <= expandedRad)
        .sort((a, b) => a.distance_km - b.distance_km);

      radNum = expandedRad;
    }

    // Also fetch partners without coordinates in same state for fallback display
    const unmappedPartners = db.prepare(`
      SELECT p.id, p.code, p.name, p.address, pt.name AS type, s.name AS state_name,
             ps.npa_level, ps.overdue_pct, ps.fund_utilisation_pct
      FROM partners p
      JOIN partner_types pt ON p.type_id = pt.id
      LEFT JOIN states s ON p.state_id = s.id
      LEFT JOIN partner_geo pg ON p.id = pg.partner_id
      LEFT JOIN partner_status ps ON p.id = ps.partner_id
      WHERE pg.latitude IS NULL
      LIMIT 10
    `).all();

    res.json({
      location_source: locationSource,
      pin_meta: pinMeta,
      searched_radius_km: radNum,
      original_radius_km: originalRadius,
      expanded,
      total_found: within.length,
      results: within,
      unmapped_state_partners: unmappedPartners.map((u) => ({
        ...u,
        has_coordinates: false,
        status: {
          npa_level: u.npa_level,
          overdue_pct: u.overdue_pct,
          fund_utilisation_pct: u.fund_utilisation_pct,
          is_simulated: true,
          disclaimer: SIMULATED_DISCLAIMER,
        },
      })),
      disclaimer: SIMULATED_DISCLAIMER,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
