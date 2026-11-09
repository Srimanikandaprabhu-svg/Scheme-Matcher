import express from 'express';
const router = express.Router();

// Placeholder admin routes (e.g., gaps, sources)
router.get('/gaps', (req, res) => {
  res.json({ message: 'Admin gaps endpoint not implemented yet.' });
});
router.get('/sources', (req, res) => {
  res.json({ message: 'Admin sources endpoint not implemented yet.' });
});

export default router;
