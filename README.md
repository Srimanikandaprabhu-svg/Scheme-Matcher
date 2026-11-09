# SchemeMatcher (SIH26092)

**AI-Driven Concessional Scheme Matching Platform for Marginalized Entrepreneurs**

> **Student Prototype Notice:** This software is an academic prototype developed for the Smart India Hackathon (SIH26092). It is not an official website of the Government of India, the Ministry of Social Justice and Empowerment, or the National Scheduled Castes Finance & Development Corporation (NSFDC).

---

## 🏛️ Project Overview

SchemeMatcher is a full-stack, transparent welfare discovery and advisory platform designed to connect Scheduled Caste (SC) entrepreneurs, artisans, and students with concessional credit schemes funded through NSFDC.

The platform provides:
1. **Deterministic Eligibility & Multi-Factor Scoring Engine:** Rule-based evaluation that transparently scores schemes (0-100 pts) across interest rate, loan coverage ratio, repayment tenor, moratorium, and sector alignment.
2. **Geospatial Partner Locator:** Interactive Leaflet map with OpenStreetMap tiles powered by over 19,000 postal PIN code centroids to locate nearby State Channelising Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs).
3. **Comprehensive Financial Calculator:** Simulates monthly installments (EMI), moratorium grace periods, and full amortization schedules.
4. **Indicative Document Checklist Generator:** Prepares customized document checklists for business, microfinance, and education loans with an interactive readiness meter.
5. **Scheme Knowledge Assistant:** Interactive chatbot providing instant answers on lending policies and requirements using verified scheme facts.
6. **Multi-Lingual & Accessible:** Native support for English, Tamil (தமிழ்), and Hindi (हिन्दी), text resizing controls (A- / A / A+), skip-to-content links, and keyboard accessibility.
7. **Complete Data Governance & Transparency:** Public registry detailing provenance, licensing, reference periods, and disclosures for all 8 underlying datasets.

---

## 🏗️ Architecture

```
SchemeMatcher/
├── client/                     # React 18 SPA (Vite + React Router)
│   ├── src/
│   │   ├── components/         # Leaflet Map (PartnerMap.jsx)
│   │   ├── context/            # LanguageContext.jsx (EN / TA / HI i18n & Font Sizing)
│   │   ├── i18n/               # translations.js (Multi-language dictionary)
│   │   ├── pages/              # 19 Fully-Functional Pages
│   │   │   ├── Home.jsx
│   │   │   ├── Schemes.jsx
│   │   │   ├── SchemeDetails.jsx
│   │   │   ├── Questionnaire.jsx
│   │   │   ├── Result.jsx
│   │   │   ├── SchemeCompare.jsx
│   │   │   ├── EMICalculator.jsx
│   │   │   ├── Partners.jsx
│   │   │   ├── ApplicationGuide.jsx
│   │   │   ├── DocumentChecklist.jsx
│   │   │   ├── Assistant.jsx
│   │   │   ├── Transparency.jsx
│   │   │   ├── About.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Privacy.jsx
│   │   │   ├── Accessibility.jsx
│   │   │   ├── Disclaimer.jsx
│   │   │   └── NotFound.jsx
│   │   └── styles/main.css     # Clean civic public-service stylesheet
│   └── index.html
├── server/                     # Node.js + Express API Backend
│   ├── src/
│   │   ├── db.js               # Central better-sqlite3 database connection
│   │   ├── index.js            # Unified server (API + Production SPA static host)
│   │   ├── middleware/         # errorHandler.js
│   │   └── routes/             # REST endpoints (match, schemes, partners, pincode, etc.)
│   └── db/migrations/          # 001_initial_schema.sql (SQLite DDL)
├── shared/                     # Pure JS isomorphic calculation modules
│   ├── eligibility.js          # Rule-based eligibility engine
│   ├── scoring.js              # Explainable 5-factor weighted recommendation engine
│   ├── emi.js                  # Financial amortization & moratorium calculator
│   └── geo.js                  # Haversine distance calculator
├── scripts/                    # Ingestion & Data Processing Scripts
│   ├── setup.js                # One-step database migration & seeding
│   └── processDatasets.js      # Streaming sanitization of Geo & RBI CSVs
├── data/
│   ├── raw/                    # Read-only protected source datasets
│   ├── simulated/              # Simulated algorithmic test data
│   └── processed/              # Sanitized outputs & validation reports
├── tests/                      # Automated Vitest test suites (19 unit/integration tests)
├── package.json
├── vite.config.js
└── vitest.config.js
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher; v20/v24 recommended)
- npm (v9 or higher)

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/Srimanikandaprabhu-svg/Scheme-Matcher.git
cd SchemeMatcher

# Install dependencies
npm install
```

### 3. Data Processing & Database Setup
```powershell
# Process raw geo and banking CSVs into clean data
npm run process

# Setup SQLite database schema and seed all tables
npm run setup
```

### 4. Running the Application

#### Option A: Unified Server (Recommended)
Build the frontend and run the Express server, which serves both the API and the web interface on a single port:
```powershell
npm run build
npm run server
```
👉 **Open your browser at:** [http://localhost:4000](http://localhost:4000)

#### Option B: Development Mode (Vite Hot-Reload)
Run Vite dev server and Express concurrently:
```powershell
npm run dev
```
👉 **Vite Client:** [http://localhost:3000](http://localhost:3000)  
👉 **Express API:** [http://localhost:4000](http://localhost:4000)

---

## 🧪 Testing & Validation

Run the automated test suite covering eligibility rules, explainable scoring, EMI schedules, Haversine calculations, and dataset integrity:
```powershell
npm test
```
Run syntax and lint verification:
```powershell
npm run lint
```

---

## 📊 Dataset Provenance & Disclosures

| Dataset | Source | Records | Nature | Disclosure |
|---|---|---|---|---|
| **NSFDC Schemes** | NSFDC Lending Guidelines | 5 | Official Norms | Concessional lending terms (6.5% - 8.0%). |
| **Channel Partners** | NSFDC Partner Directory | 91 | Official | Accredited SCAs, PSBs, and RRBs. |
| **Partner Geocodes** | Verified Locality Centroids | 14 | Approximate | Locality centroids for map visualization. |
| **Simulated Status** | `partner_status.csv` | 91 | **Simulated** | Synthetic data for routing algorithms; not audited live banking metrics. |
| **LGD Districts** | Ministry of Panchayati Raj | 765 | Official | Standard administrative identifiers. |
| **All India PIN Codes** | India Post / data.gov.in | 19,586 | Approximate | Extracted postal centroids for proximity radius calculation. |
| **RBI Bank Outlets** | Reserve Bank of India | 15,000 | Official Sample | Domestic banking branches for credit outreach. |
| **Census 2011 SC Demographics** | Registrar General of India | 881 | Historical | 2011 decennial census baseline for demographic equity. |

---

## ⚖️ License & Ethical Declaration
Developed for academic presentation at Smart India Hackathon (SIH26092). All code is licensed under the MIT License. Data access complies with the National Data Sharing and Accessibility Policy (NDSAP) and Open Data licenses.
