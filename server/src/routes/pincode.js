import express from 'express';
import db from '../db.js';

const router = express.Router();

/**
 * GET /api/pincode/:code
 * Returns district, state, and approximate centroid coordinates for a 6-digit Indian PIN code.
 */
router.get('/:code', (req, res) => {
  const pin = req.params.code ? req.params.code.trim() : '';
  if (!pin || pin.length !== 6 || isNaN(Number(pin))) {
    return res.status(400).json({ error: 'Please provide a valid 6-digit Indian PIN code.' });
  }

  try {
    const row = db.prepare('SELECT pincode, district, state, latitude, longitude, office_count FROM pincodes WHERE pincode = ?').get(pin);
    if (!row) {
      return res.status(404).json({ error: `PIN code ${pin} not found in all-India postal directory.` });
    }

    res.json({
      pincode: row.pincode,
      district: row.district,
      state: row.state,
      latitude: row.latitude,
      longitude: row.longitude,
      has_coordinates: row.latitude !== null && row.longitude !== null,
      office_count: row.office_count,
      disclaimer: 'Coordinates derived from India Post directory and boundary centroids. Approximate for navigation/radius mapping.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/pincode/search?q=...
 * Search pincodes by prefix or district name
 */
router.get('/search/suggest', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json([]);
  }

  try {
    const queryTerm = q.trim();
    let rows;
    if (!isNaN(Number(queryTerm))) {
      rows = db.prepare('SELECT pincode, district, state, latitude, longitude FROM pincodes WHERE pincode LIKE ? LIMIT 10').all(`${queryTerm}%`);
    } else {
      rows = db.prepare('SELECT pincode, district, state, latitude, longitude FROM pincodes WHERE LOWER(district) LIKE ? OR LOWER(state) LIKE ? LIMIT 10').all(`%${queryTerm.toLowerCase()}%`, `%${queryTerm.toLowerCase()}%`);
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
