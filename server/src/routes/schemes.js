import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/schemes – return all schemes from DB
router.get('/', (req, res) => {
  try {
    const schemes = db.prepare('SELECT * FROM schemes ORDER BY id ASC').all();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
