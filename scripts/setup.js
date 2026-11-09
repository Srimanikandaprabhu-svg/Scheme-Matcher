import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { parse } from 'csv-parse/sync';

const dbPath = path.resolve('schemeMatcher.db');
const db = new Database(dbPath);

console.log('🚀 Setting up SchemeMatcher Database at:', dbPath);

// 1. Run migrations
const schemaPath = path.resolve('server', 'db', 'migrations', '001_initial_schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Execute initial schema
db.exec(schemaSql);
console.log('✅ Initial database schema created.');

function insertDataSource(name, isSimulated = false, isApprox = false) {
  const existing = db.prepare('SELECT id FROM data_sources WHERE name = ?').get(name);
  if (existing) return existing.id;
  const stmt = db.prepare(`
    INSERT INTO data_sources (name, retrieved_on, is_simulated, is_approximate)
    VALUES (?, datetime('now'), ?, ?)
  `);
  const info = stmt.run(name, isSimulated ? 1 : 0, isApprox ? 1 : 0);
  return info.lastInsertRowid;
}

function loadCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content, { columns: true, skip_empty_lines: true, trim: true });
}

// 2. Insert Partner Types
const partnerTypes = ['SCA', 'PSB', 'RRB', 'NBFC-MFI', 'Cooperative'];
const insertPt = db.prepare('INSERT OR IGNORE INTO partner_types (name) VALUES (?)');
partnerTypes.forEach(pt => insertPt.run(pt));
console.log('✅ Partner types seeded.');

// 3. Import States & Districts from lgd_districts.csv
const lgdRows = loadCsv(path.resolve('data', 'raw', 'lgd_districts.csv'));
if (lgdRows.length > 0) {
  const insertState = db.prepare('INSERT OR IGNORE INTO states (name, code) VALUES (?, ?)');
  const insertDistrict = db.prepare('INSERT OR IGNORE INTO districts (state_id, name, lgd_code, census_2011_code) VALUES (?, ?, ?, ?)');
  const getState = db.prepare('SELECT id FROM states WHERE code = ?');

  const txn = db.transaction(() => {
    for (const row of lgdRows) {
      if (row.state_name && row.state_code) {
        insertState.run(row.state_name.trim(), row.state_code.trim());
        const s = getState.get(row.state_code.trim());
        if (s && row.district_name && row.district_code) {
          insertDistrict.run(s.id, row.district_name.trim(), row.district_code.trim(), row.census_2011_district_code || null);
        }
      }
    }
  });
  txn();
  console.log(`✅ States and Districts imported (${lgdRows.length} entries processed).`);
}

// 4. Import Schemes from schemes.csv
const schemeRows = loadCsv(path.resolve('data', 'raw', 'schemes.csv'));
if (schemeRows.length > 0) {
  const insertScheme = db.prepare(`
    INSERT OR REPLACE INTO schemes (code, name, max_loan_amount, max_project_cost, interest_rate, max_repayment_years, moratorium_months, loan_cap_percent, purpose)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSchemePartnerType = db.prepare(`
    INSERT OR IGNORE INTO scheme_partner_types (scheme_id, partner_type_id) VALUES (?, ?)
  `);
  const getPt = db.prepare('SELECT id FROM partner_types WHERE name = ?');

  const txn = db.transaction(() => {
    for (const r of schemeRows) {
      const code = r.scheme_id || r.scheme_code;
      const name = r.name || r.scheme_name;
      const maxLoan = Number(r.max_loan_amount_inr || r.max_loan_amount) || 0;
      const maxCost = Number(r.project_cost_max_inr || r.max_project_cost) || maxLoan || 5000000;
      const rate = Number(r.interest_to_beneficiary_pct || r.interest_rate) || 6.5;
      const years = Number(r.max_repayment_years) || 5;
      const moratorium = Number(r.moratorium_months) || 0;
      const capPct = Number(r.max_loan_pct_of_cost || r.loan_cap_percent) || 90;
      const purpose = (name + ' ' + (r.moratorium_note || '')).toLowerCase();

      const res = insertScheme.run(code, name, maxLoan, maxCost, rate, years, moratorium, capPct, purpose);
      const schemeId = res.lastInsertRowid;

      // Link partner types
      const implThrough = r.implemented_through || '';
      for (const pt of partnerTypes) {
        if (implThrough.includes(pt)) {
          const ptRow = getPt.get(pt);
          if (ptRow) {
            insertSchemePartnerType.run(schemeId, ptRow.id);
          }
        }
      }
    }
  });
  txn();
  console.log(`✅ Schemes imported (${schemeRows.length} schemes).`);
}

// 5. Import Partners from nsfdc_partners.csv
const partnerRows = loadCsv(path.resolve('data', 'raw', 'nsfdc_partners.csv'));
const partnerSrcId = insertDataSource('nsfdc_partners.csv');
const partnerIdMap = new Map(); // maps CSV partner_id (e.g. SCA01) to db partner ID

if (partnerRows.length > 0) {
  const insertPartner = db.prepare(`
    INSERT INTO partners (name, type_id, state_id, district_id, source_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const getPt = db.prepare('SELECT id FROM partner_types WHERE name = ?');
  const getStateByName = db.prepare('SELECT id FROM states WHERE LOWER(name) LIKE ?');

  const defaultState = db.prepare('SELECT id FROM states LIMIT 1').get() || { id: 1 };
  const defaultPt = db.prepare('SELECT id FROM partner_types LIMIT 1').get() || { id: 1 };

  const txn = db.transaction(() => {
    for (const r of partnerRows) {
      const pt = getPt.get(r.type) || defaultPt;
      const st = r.state ? getStateByName.get(`%${r.state.trim().toLowerCase()}%`) : null;
      const stateId = st ? st.id : defaultState.id;
      const res = insertPartner.run(r.name || r.abbreviation, pt.id, stateId, null, partnerSrcId);
      if (r.partner_id) {
        partnerIdMap.set(r.partner_id.trim(), res.lastInsertRowid);
      }
    }
  });
  txn();
  console.log(`✅ Partners imported (${partnerRows.length} partners).`);
}

// 6. Import Partner Geo from partner_geo.csv
const geoRows = loadCsv(path.resolve('data', 'raw', 'partner_geo.csv'));
if (geoRows.length > 0) {
  const insertGeo = db.prepare(`
    INSERT OR REPLACE INTO partner_geo (partner_id, latitude, longitude, is_approximate)
    VALUES (?, ?, ?, ?)
  `);

  const txn = db.transaction(() => {
    for (const r of geoRows) {
      const code = r.partner_id ? r.partner_id.trim() : '';
      const partnerDbId = partnerIdMap.get(code) || (parseInt(code.replace(/\D/g, ''), 10) || null);
      if (partnerDbId) {
        insertGeo.run(partnerDbId, Number(r.lat), Number(r.lng), r.is_approximate === '0' ? 0 : 1);
      }
    }
  });
  txn();
  console.log(`✅ Partner Geo imported (${geoRows.length} coordinates).`);
}

// 7. Import Census data
const popRows = loadCsv(path.resolve('data', 'raw', 'census', 'census_sc_population_2011.csv'));
if (popRows.length > 0) {
  const popSrcId = insertDataSource('census_sc_population_2011.csv');
  const insertPop = db.prepare(`
    INSERT INTO sc_population (state_id, area_level, total, rural, urban, male, female, source_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const getStateByCode = db.prepare('SELECT id FROM states WHERE code = ?');
  const defaultState = db.prepare('SELECT id FROM states LIMIT 1').get() || { id: 1 };

  const txn = db.transaction(() => {
    for (const r of popRows) {
      const st = getStateByCode.get(String(r.state_code).trim()) || defaultState;
      insertPop.run(
        st.id,
        r.area_level || 'state',
        Number(r.sc_total) || 0,
        Number(r.sc_rural) || 0,
        Number(r.sc_urban) || 0,
        Number(r.sc_male) || 0,
        Number(r.sc_female) || 0,
        popSrcId
      );
    }
  });
  txn();
  console.log(`✅ Census Population imported (${popRows.length} rows).`);
}

const casteRows = loadCsv(path.resolve('data', 'raw', 'census', 'census_sc_by_caste_state_2011.csv'));
if (casteRows.length > 0) {
  const casteSrcId = insertDataSource('census_sc_by_caste_state_2011.csv');
  const insertCaste = db.prepare(`
    INSERT INTO sc_population_by_caste (state_id, caste, total, source_id)
    VALUES (?, ?, ?, ?)
  `);
  const getStateByCode = db.prepare('SELECT id FROM states WHERE code = ?');
  const defaultState = db.prepare('SELECT id FROM states LIMIT 1').get() || { id: 1 };

  const txn = db.transaction(() => {
    for (const r of casteRows) {
      if (r.residence === 'Total') {
        const st = getStateByCode.get(String(r.state_code).trim()) || defaultState;
        insertCaste.run(st.id, r.sc_name || 'Unknown', Number(r.persons) || 0, casteSrcId);
      }
    }
  });
  txn();
  console.log(`✅ Census Caste breakdown imported (${casteRows.length} rows).`);
}

db.close();
console.log('🎉 Setup complete! SchemeMatcher DB is fully seeded.');
