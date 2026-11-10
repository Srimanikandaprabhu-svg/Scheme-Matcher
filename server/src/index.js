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
if (!process.env.VERCEL && fs.existsSync(distPath)) {
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

const DEFAULT_PORT = process.env.PORT || 4000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️ Port ${port} is already in use. Automatically falling back to http://localhost:${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });

  // Graceful shutdown on Ctrl+C / SIGINT
  process.on('SIGINT', () => {
    console.log('\n🛑 Gracefully stopping server and releasing port...');
    server.close(() => {
      console.log('✅ Port released. Exited cleanly.');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

if (!process.env.VERCEL) {
  startServer(DEFAULT_PORT);
}

export default app;
