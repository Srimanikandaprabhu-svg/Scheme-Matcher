import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import matchRouter from './routes/match.js';
import statesRouter from './routes/states.js';
import districtsRouter from './routes/districts.js';
import schemesRouter from './routes/schemes.js';
import partnersRouter from './routes/partners.js';
import pincodeRouter from './routes/pincode.js';
import assistanceRouter from './routes/assistanceRequests.js';
import adminRouter from './routes/admin.js';
import censusRouter from './routes/census.js';
import transparencyRouter from './routes/transparency.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API routes
app.use('/api/match', matchRouter);
app.use('/api/states', statesRouter);
app.use('/api/districts', districtsRouter);
app.use('/api/schemes', schemesRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/pincode', pincodeRouter);
app.use('/api/assistance', assistanceRouter);
app.use('/api/admin', adminRouter);
app.use('/api/census', censusRouter);
app.use('/api/transparency', transparencyRouter);

// Serve frontend static files if built
const distPath = path.resolve(__dirname, '../../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
