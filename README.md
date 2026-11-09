# SchemeMatcher

**AI‑Driven Scheme Matching for Marginalized Entrepreneurs**

## Problem statement
The Ministry of Social Justice and Empowerment needs a web platform that helps Scheduled‑Caste (SC) entrepreneurs discover eligible loan schemes, calculate EMIs, and locate the nearest eligible Channel Partner. The platform must be:
- **Fully offline** – all data lives in CSV files under `/data`.
- **Portable** – SQLite database with plain SQL migrations, ready to switch to PostgreSQL.
- **Accessible** – multilingual UI, WCAG AA compliant, keyboard operable.
- **Explainable** – show why a scheme was suggested, why a partner was excluded, and affordability calculations.

## Architecture
```mermaid
flowchart TD
    A[Client (React+Vite)] -->|REST| B[Server (Express)]
    B -->|SQL| C[SQLite DB]
    subgraph Shared
        D[emi.js] --> B
        E[eligibility.js] --> B
        F[scoring.js] --> B
        G[geo.js] --> B
    end
    C -->|Migrations| H[001_initial_schema.sql]
```
- **Client** – React 18, React Router, plain CSS with variables.
- **Server** – Node + Express, `better-sqlite3`.
- **Shared** – pure‑JS utilities used by both sides, covered by Vitest.
- **Data** – read‑only CSVs under `data/raw` and `data/simulated`; generated artefacts go to `data/processed`.

## Repository layout
```
SchemeMatcher/
├─ client/                # React app
│   └─ src/
│       ├─ components/
│       ├─ pages/
│       ├─ styles/
│       ├─ App.jsx
│       └─ main.jsx
├─ server/                # Express API
│   ├─ src/
│   │   ├─ index.js
│   │   ├─ db.js
│   │   ├─ middleware/
│   │   └─ routes/
│   └─ db/
│       └─ migrations/001_initial_schema.sql
├─ shared/                # Pure utilities + tests
├─ scripts/               # Import / setup scripts
├─ data/                  # Protected dataset (copied read‑only)
│   ├─ raw/
│   └─ simulated/
├─ data/processed/        # Generated outputs only
├─ package.json
├─ vite.config.js
└─ README.md
```

## Setup & development
```powershell
# Install dependencies
npm install

# Run the one‑time setup (creates DB, runs migration, imports CSVs)
npm run setup

# Start development servers
npm run dev          # Vite dev server (http://localhost:3000)
node server/src/index.js   # Express API (http://localhost:4000)

# Run tests
npm test
```

## Data handling policy
- The `data` folder is **never modified**; it is copied once for study.
- All import scripts read from `data/raw` / `data/simulated` only.
- Generated artefacts (import logs, reports) are written exclusively to `data/processed`.
- Import scripts validate file counts (partners = 91, schemes = 5, districts = 765, geo = 14, simulated status = 91) and abort with a clear error if any mismatch occurs.

## Future work
- Complete multilingual questionnaire UI.
- Implement full eligibility rules and weighted scoring.
- Add partner‑search with radius expansion and fallback logic.
- Persist assistance requests.
- PostgreSQL migration.
- WCAG AA compliance testing.

---
*This repository is intended for educational and demonstration purposes only.*