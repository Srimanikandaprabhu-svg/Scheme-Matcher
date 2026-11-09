import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/states – return all states from DB
router.get('/', (req, res) => {
  try {
    const states = db.prepare('SELECT id, name, code FROM states ORDER BY name ASC').all();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
