import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/schemes – list all schemes with full metadata
router.get('/', (req, res) => {
  try {
    const schemes = db.prepare('SELECT * FROM schemes ORDER BY id ASC').all();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/schemes/:code – get single scheme with associated partner types
router.get('/:code', (req, res) => {
  const code = req.params.code ? req.params.code.trim().toUpperCase() : '';
  try {
    const scheme = db.prepare('SELECT * FROM schemes WHERE UPPER(code) = ?').get(code);
    if (!scheme) {
      return res.status(404).json({ error: `Scheme with code '${code}' not found.` });
    }

    const partnerTypes = db.prepare(`
      SELECT pt.name
      FROM partner_types pt
      JOIN scheme_partner_types spt ON pt.id = spt.partner_type_id
      WHERE spt.scheme_id = ?
    `).all(scheme.id).map(r => r.name);

    res.json({
      ...scheme,
      allowed_partner_types: partnerTypes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
