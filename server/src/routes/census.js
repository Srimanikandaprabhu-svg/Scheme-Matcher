import express from 'express';
import db from '../db.js';

const router = express.Router();

/**
 * GET /api/census/population
 * Returns population statistics, optionally filtered by state_id
 */
router.get('/population', (req, res) => {
  const { state_id } = req.query;
  try {
    let rows;
    if (state_id) {
      rows = db.prepare('SELECT * FROM sc_population WHERE state_id = ?').all(state_id);
    } else {
      rows = db.prepare('SELECT * FROM sc_population LIMIT 100').all();
    }
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/**
 * GET /api/census/caste
 * Returns SC population by caste, optionally filtered by state_id
 */
router.get('/caste', (req, res) => {
  const { state_id } = req.query;
  try {
    let rows;
    if (state_id) {
      rows = db.prepare('SELECT * FROM sc_population_by_caste WHERE state_id = ?').all(state_id);
    } else {
      rows = db.prepare('SELECT * FROM sc_population_by_caste LIMIT 100').all();
    }
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

export default router;
