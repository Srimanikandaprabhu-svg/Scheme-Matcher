-- 001_initial_schema.sql
-- SQLite (portable to PostgreSQL) schema for SchemeMatcher

-- States table (derived from LGD districts)
CREATE TABLE states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- Districts table
CREATE TABLE districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    lgd_code TEXT NOT NULL UNIQUE,
    census_2011_code TEXT
);

-- Data sources provenance table
CREATE TABLE data_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    retrieved_on TEXT NOT NULL,
    is_simulated BOOLEAN NOT NULL,
    is_approximate BOOLEAN NOT NULL
);

-- Schemes table
CREATE TABLE schemes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    max_loan_amount INTEGER NOT NULL,
    max_project_cost INTEGER NOT NULL,
    interest_rate REAL NOT NULL,
    max_repayment_years INTEGER NOT NULL,
    moratorium_months INTEGER NOT NULL,
    loan_cap_percent REAL NOT NULL,
    purpose TEXT NOT NULL
);

-- Partner types table (SCA, PSB, RRB, NBFC-MFI, Cooperative)
CREATE TABLE partner_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Mapping which scheme can go to which partner type
CREATE TABLE scheme_partner_types (
    scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    partner_type_id INTEGER NOT NULL REFERENCES partner_types(id) ON DELETE CASCADE,
    PRIMARY KEY (scheme_id, partner_type_id)
);

-- Partners table
CREATE TABLE partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type_id INTEGER NOT NULL REFERENCES partner_types(id),
    state_id INTEGER NOT NULL REFERENCES states(id),
    district_id INTEGER REFERENCES districts(id),
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- Partner geo (approximate coordinates)
CREATE TABLE partner_geo (
    partner_id INTEGER PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    is_approximate BOOLEAN NOT NULL
);

-- Partner status (simulated)
CREATE TABLE partner_status (
    partner_id INTEGER PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
    npa BOOLEAN,
    overdue BOOLEAN,
    fund_utilisation_percent REAL,
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- SC population totals (state level)
CREATE TABLE sc_population (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id INTEGER NOT NULL REFERENCES states(id),
    area_level TEXT NOT NULL,
    total INTEGER,
    rural INTEGER,
    urban INTEGER,
    male INTEGER,
    female INTEGER,
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- SC population by caste (state level)
CREATE TABLE sc_population_by_caste (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id INTEGER NOT NULL REFERENCES states(id),
    caste TEXT NOT NULL,
    total INTEGER,
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- Assistance requests (user‑submitted)
CREATE TABLE assistance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    data TEXT NOT NULL,
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- Unmatched searches (when no partner found)
CREATE TABLE unmatched_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    query TEXT NOT NULL,
    source_id INTEGER NOT NULL REFERENCES data_sources(id)
);

-- Indexes for fast lookup
CREATE INDEX idx_district_state ON districts(state_id);
CREATE INDEX idx_partner_state ON partners(state_id);
CREATE INDEX idx_partner_type ON partners(type_id);
CREATE INDEX idx_geo_partner ON partner_geo(partner_id);
