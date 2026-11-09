// server/src/db.js
/**
 * Centralised SQLite database connection used by routes.
 * Uses better-sqlite3 (synchronous API) for simplicity.
 */
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('schemeMatcher.db');
const db = new Database(dbPath);

export default db;
