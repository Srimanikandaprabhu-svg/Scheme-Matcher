import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/districts – return districts, optionally filtered by state or state_id
router.get('/', (req, res) => {
  const { state_id, state } = req.query;
  try {
    let districts;
    if (state_id) {
      districts = db.prepare('SELECT id, state_id, name, lgd_code, census_2011_code FROM districts WHERE state_id = ? ORDER BY name ASC').all(state_id);
    } else if (state) {
      districts = db.prepare(`
        SELECT d.id, d.state_id, d.name, d.lgd_code, d.census_2011_code 
        FROM districts d
        JOIN states s ON d.state_id = s.id
        WHERE s.code = ? OR LOWER(s.name) = LOWER(?)
        ORDER BY d.name ASC
      `).all(state, state);
    } else {
      districts = db.prepare('SELECT id, state_id, name, lgd_code, census_2011_code FROM districts ORDER BY name ASC LIMIT 200').all();
    }
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
