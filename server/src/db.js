// server/src/db.js
/**
 * Centralised SQLite database connection used by routes.
 * Uses better-sqlite3 (synchronous API) for simplicity.
 * Supports both local filesystem and Vercel serverless (/tmp) execution.
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDbPath = fs.existsSync(path.resolve('schemeMatcher.db'))
  ? path.resolve('schemeMatcher.db')
  : path.resolve(__dirname, '../../schemeMatcher.db');

let db;

if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/schemeMatcher.db';
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
    }
    db = new Database(tmpDbPath);
  } catch {
    db = new Database(sourceDbPath, { readonly: true });
  }
} else {
  db = new Database(sourceDbPath);
}

export default db;
