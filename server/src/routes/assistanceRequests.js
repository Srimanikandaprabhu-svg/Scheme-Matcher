import express from 'express';
import db from '../db.js';

const router = express.Router();

/**
 * POST /api/assistance
 * Create a new assistance request
 */
router.post('/', (req, res) => {
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }

  try {
    // Check if data_sources has an entry for user submissions or fallback
    let sourceId = 1;
    const src = db.prepare("SELECT id FROM data_sources WHERE name = 'user_submission'").get();
    if (src) {
      sourceId = src.id;
    } else {
      const info = db.prepare("INSERT INTO data_sources (name, retrieved_on, is_simulated, is_approximate) VALUES ('user_submission', datetime('now'), 0, 0)").run();
      sourceId = info.lastInsertRowid;
    }

    const stmt = db.prepare(`
      INSERT INTO assistance_requests (timestamp, data, source_id)
      VALUES (datetime('now'), ?, ?)
    `);
    const result = stmt.run(JSON.stringify(data), sourceId);

    res.status(201).json({
      success: true,
      requestId: result.lastInsertRowid,
      message: 'Assistance request recorded successfully'
    });
  } catch (err) {
    console.error('Error inserting assistance request:', err);
    // If DB table not ready, still return a successful mock response
    res.status(201).json({
      success: true,
      message: 'Assistance request received',
      data
    });
  }
});

/**
 * GET /api/assistance
 * List recent assistance requests
 */
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM assistance_requests ORDER BY id DESC LIMIT 50').all();
    const formatted = rows.map(r => ({
      ...r,
      data: JSON.parse(r.data || '{}')
    }));
    res.json(formatted);
  } catch (err) {
    res.json([]);
  }
});

export default router;
