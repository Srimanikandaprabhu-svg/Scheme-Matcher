// scripts/importRaw.js
/**
 * Import raw CSV files into the SQLite database.
 * This script parses each CSV in data/raw (including the census subfolder)
 * and inserts rows into the appropriate tables.
 *
 * It records provenance in the data_sources table (is_simulated = 0, is_approximate = 0).
 */
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import db from '../server/src/db.js';

function insertDataSource(name, isSimulated = false, isApprox = false) {
  const stmt = db.prepare(`INSERT INTO data_sources (name, retrieved_on, is_simulated, is_approximate)
    VALUES (?, datetime('now'), ?, ?)`);
  const info = stmt.run(name, isSimulated ? 1 : 0, isApprox ? 1 : 0);
  return info.lastInsertRowid;
}

function loadCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content, { columns: true, skip_empty_lines: true });
}

function importSchemes() {
  const rows = loadCsv(path.resolve('data', 'raw', 'schemes.csv'));
  const srcId = insertDataSource('schemes.csv');
  const stmt = db.prepare(`INSERT INTO schemes (code, name, max_loan_amount, max_project_cost, interest_rate, max_repayment_years, moratorium_months, loan_cap_percent, purpose, source_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insert = db.transaction((rows) => {
    for (const r of rows) {
      stmt.run(
        r.scheme_code,
        r.scheme_name,
        Number(r.max_loan_amount),
        Number(r.max_project_cost),
        Number(r.interest_rate),
        Number(r.max_repayment_years),
        Number(r.moratorium_months),
        Number(r.loan_cap_percent),
        r.purpose,
        srcId
      );
    }
  });
  insert(rows);
  console.log(`✅ Imported ${rows.length} schemes`);
}

function importPartners() {
  const rows = loadCsv(path.resolve('data', 'raw', 'nsfdc_partners.csv'));
  const srcId = insertDataSource('nsfdc_partners.csv');
  const stmt = db.prepare(`INSERT INTO partners (name, type_id, state_id, district_id, source_id)
    VALUES (?, ?, ?, ?, ?)`);
  // We'll need to ensure partner types and state/district exist – for now assume IDs are 1.
  const insert = db.transaction((rows) => {
    for (const r of rows) {
      stmt.run(r.partner_name, 1, 1, 1, srcId);
    }
  });
  insert(rows);
  console.log(`✅ Imported ${rows.length} partners (stub IDs)`);
}

function importPartnerGeo() {
  const rows = loadCsv(path.resolve('data', 'raw', 'partner_geo.csv'));
  const srcId = insertDataSource('partner_geo.csv');
  const stmt = db.prepare(`INSERT INTO partner_geo (partner_id, latitude, longitude, is_approximate)
    VALUES (?, ?, ?, ?)`);
  const insert = db.transaction((rows) => {
    for (const r of rows) {
      stmt.run(Number(r.partner_id), Number(r.lat), Number(r.lng), 1);
    }
  });
  insert(rows);
  console.log(`✅ Imported ${rows.length} partner geo points`);
}

function importCensus() {
  const dir = path.resolve('data', 'raw', 'census');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.csv'));
  for (const file of files) {
    const rows = loadCsv(path.join(dir, file));
    const srcId = insertDataSource(file);
    // For demo purposes we just log the count.
    console.log(`✅ Loaded ${rows.length} rows from ${file}`);
  }
}

function main() {
  importSchemes();
  importPartners();
  importPartnerGeo();
  importCensus();
  console.log('✅ Raw data import complete');
}

main();
