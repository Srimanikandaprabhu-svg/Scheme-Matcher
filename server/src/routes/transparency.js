import express from 'express';
import db from '../db.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * GET /api/transparency
 * Returns full provenance, data licensing, methodology, and disclosures.
 */
router.get('/', (req, res) => {
  try {
    let validationReport = {};
    const reportPath = path.resolve('data', 'processed', 'validation_report.json');
    if (fs.existsSync(reportPath)) {
      validationReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    }

    // Query live record counts from database
    const schemeCount = db.prepare('SELECT COUNT(*) AS c FROM schemes').get().c;
    const partnerCount = db.prepare('SELECT COUNT(*) AS c FROM partners').get().c;
    const geoCount = db.prepare('SELECT COUNT(*) AS c FROM partner_geo').get().c;
    const pincodeCount = db.prepare('SELECT COUNT(*) AS c FROM pincodes').get().c;
    const branchCount = db.prepare('SELECT COUNT(*) AS c FROM partner_branches').get().c;
    const stateCount = db.prepare('SELECT COUNT(*) AS c FROM states').get().c;
    const districtCount = db.prepare('SELECT COUNT(*) AS c FROM districts').get().c;

    const datasets = [
      {
        id: 'schemes',
        name: 'NSFDC Concessional Loan Schemes',
        official_title: 'National Scheduled Castes Finance and Development Corporation Lending Guidelines',
        source: 'NSFDC Official Lending Norms & Scheme Annexures',
        reference_date: '2026-02-28',
        nature: 'Official / Concessional Policy Rules',
        license: 'Government of India Open Access / Public Welfare Domain',
        records_count: schemeCount,
        purpose: 'Provides loan caps, interest rates (6.5% - 8.0%), repayment tenors, and moratorium rules for eligibility evaluation.',
        important_disclosure: 'Scheme guidelines should be verified against the latest circulars from nodal channel agencies before formal application.',
      },
      {
        id: 'partners',
        name: 'Channel Partners Directory',
        official_title: 'State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks Directory',
        source: 'NSFDC Partner Directory & Ministry of Social Justice and Empowerment',
        reference_date: '2026-11-09',
        nature: 'Official Partner Records',
        license: 'Public Service Domain',
        records_count: partnerCount,
        purpose: 'Identifies authorized institutional channel partners who disburse funds to eligible marginalized entrepreneurs.',
        important_disclosure: 'Locations without verified coordinates are displayed in state/district lists rather than invented on maps.',
      },
      {
        id: 'partner_geo',
        name: 'Partner Geospatial Coordinates',
        official_title: 'Manually verified and locality-mapped partner coordinates',
        source: 'Public office listings and city-center geocoding',
        reference_date: '2026-11-09',
        nature: 'Approximate Locality Coordinates',
        license: 'OpenStreetMap Derived Data (ODbL)',
        records_count: geoCount,
        purpose: 'Renders map markers and powers radius-based nearby partner search.',
        important_disclosure: 'Partner coordinates represent administrative/city locality centroids. Always verify office working hours and addresses.',
      },
      {
        id: 'partner_status',
        name: 'Simulated Partner Performance Indicators',
        official_title: 'Simulated Non-Performing Asset (NPA) and Fund Utilization Metrics',
        source: 'Synthetic demonstration dataset (data/simulated/partner_status.csv)',
        reference_date: '2026-11-09',
        nature: 'Simulated Data – NOT Live Government Information',
        license: 'Educational / SIH Hackathon Demonstration Use',
        records_count: 91,
        purpose: 'Demonstrates intelligent routing algorithms that prioritize liquid, active channel partners with low overdue rates.',
        important_disclosure: 'STRICT NOTICE: These metrics are simulated for algorithm demonstration only and do NOT reflect actual audited banking health.',
      },
      {
        id: 'lgd_districts',
        name: 'Local Government Directory (LGD) Administrative Units',
        official_title: 'LGD State and District Standard Codes',
        source: 'Ministry of Panchayati Raj, Government of India (lgd.gov.in)',
        reference_date: '2021-2026',
        nature: 'Official Administrative Identifiers',
        license: 'National Data Sharing and Accessibility Policy (NDSAP)',
        records_count: districtCount,
        purpose: 'Provides standardized names and administrative codes mapping states to districts.',
        important_disclosure: 'Administrative boundaries may undergo reorganization as new districts are notified by respective state governments.',
      },
      {
        id: 'pincodes',
        name: 'All India PIN Code Directory & Centroids',
        official_title: 'Department of Posts Pincode Directory & Boundary GeoJSON',
        source: 'India Post & data.gov.in',
        reference_date: '2024-2026',
        nature: 'Approximate Geographic Centroids',
        license: 'Government Open Data License (GODL) India',
        records_count: pincodeCount,
        purpose: 'Enables instant citizen lookup by 6-digit postal code to calculate proximity without requiring precise GPS device permissions.',
        important_disclosure: 'Centroids are derived from polygon geometries and postal office clusters; they represent approximate postal zones.',
      },
      {
        id: 'rbi_branches',
        name: 'RBI Banking Outlets Sample',
        official_title: 'Reserve Bank of India Master Office Banking Branches',
        source: 'Reserve Bank of India Database on Indian Economy (rbi.org.in)',
        reference_date: '2024-2026',
        nature: 'Official Banking Outlets Directory (Filtered)',
        license: 'Public Banking Registry',
        records_count: branchCount,
        purpose: 'Surfaces nearby public sector and regional rural banking branch infrastructure.',
        important_disclosure: 'Inclusion in RBI banking data does not automatically imply that an individual branch is an active NSFDC disbursement counter.',
      },
      {
        id: 'census',
        name: 'Census 2011 Scheduled Caste Demographics',
        official_title: 'Primary Census Abstract for Scheduled Castes (PCA-SC 2011)',
        source: 'Office of the Registrar General & Census Commissioner, India',
        reference_date: '2011 (Historical Census)',
        nature: 'Official Historical Census Data',
        license: 'Census of India Public Domain',
        records_count: 881,
        purpose: 'Provides state-level SC population benchmarks and sub-caste distribution for equitable welfare planning.',
        important_disclosure: 'This dataset reflects the 2011 decennial census and serves as a historical baseline. 2026 demographic projections are estimated.',
      },
    ];

    res.json({
      platform: 'SchemeMatcher (SIH26092)',
      project_role: 'Student Prototype – Not an Official Government Website',
      developer_team: 'SIH26092 Prototype Team',
      total_datasets: datasets.length,
      datasets,
      validation_report: validationReport,
      ethics_statement: 'SchemeMatcher operates with transparent, deterministic rule-based algorithms. No proprietary models or hidden weights are used in public eligibility evaluations.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
