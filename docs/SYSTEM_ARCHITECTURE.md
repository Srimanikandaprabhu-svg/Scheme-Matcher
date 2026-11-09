# SchemeMatcher (SIH26092) – System Architecture Specification

---

## 1. High-Level Component & Tier Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Presentation & Client Layer (React 18 + Vite SPA)"]
        direction TB
        UI["19 Modular View Pages<br/>(Home, Questionnaire, Result, Calculator, Partners, etc.)"]
        i18nCtx["Language & Accessibility Context<br/>(English, Tamil, Hindi, A-/A/A+)"]
        LeafletCanvas["Geospatial Map Renderer<br/>(Leaflet + OpenStreetMap ODbL)"]
        SessionStore["Stateless Session Storage<br/>(SessionStorage for temporary query state)"]
        
        UI --> i18nCtx
        UI --> LeafletCanvas
        UI --> SessionStore
    end

    subgraph IsomorphicCore["Isomorphic Business Logic Layer (/shared)"]
        direction TB
        ELIG["eligibility.js<br/>• Dynamic scheme income ceiling checks<br/>• Project cost & 90% loan cap enforcement<br/>• Community category verification"]
        SCORE["scoring.js<br/>• 5-factor weighted explainable scoring<br/>• 0-100 normalized score generation<br/>• Ineligible scheme suppression (score = 0)"]
        EMI["emi.js<br/>• Monthly compounding amortization<br/>• Moratorium interest-only calculation<br/>• Month-by-month repayment schedule"]
        GEO["geo.js<br/>• Great-circle Haversine distance engine<br/>• Sub-millisecond geographic proximity"]
    end

    subgraph ServerLayer["Backend API & Application Server (Node.js + Express)"]
        direction TB
        Router["Express REST Router (/api/*)"]
        M_Route["POST /api/match<br/>(Evaluates eligibility & computes ranked score)"]
        P_Route["GET /api/partners/nearby<br/>(Proximity search & automatic radius expansion)"]
        PIN_Route["GET /api/pincode/:code<br/>(Resolves postal PIN to lat/lng centroid)"]
        S_Route["GET /api/schemes & /api/schemes/:code<br/>(Returns catalog & partner mappings)"]
        T_Route["GET /api/transparency<br/>(Exposes dataset provenance & audit report)"]
        StaticServer["Static SPA File Server<br/>(Serves bundled production assets from /dist)"]
        
        Router --> M_Route
        Router --> P_Route
        Router --> PIN_Route
        Router --> S_Route
        Router --> T_Route
    end

    subgraph DatabaseLayer["Relational Persistence Layer (SQLite + better-sqlite3)"]
        direction TB
        DB[(schemeMatcher.db)]
        T1["schemes (5 Verified Programs)"]
        T2["partners (91 Institutional Partners)"]
        T3["pincodes (19,586 Cleaned Postal Centroids)"]
        T4["partner_branches (15,000 Filtered Banking Outlets)"]
        T5["partner_geo (14 Verified Locality Coordinates)"]
        T6["partner_status (91 Simulated Health Metrics)"]
        T7["states & districts (36 States, 765 LGD Districts)"]
        T8["sc_population & sc_population_by_caste (Census 2011)"]
        
        DB --- T1
        DB --- T2
        DB --- T3
        DB --- T4
        DB --- T5
        DB --- T6
        DB --- T7
        DB --- T8
    end

    %% Inter-tier connections
    ClientLayer -->|"HTTP / REST API Calls (Port 4000 or Vite Proxy)"| ServerLayer
    ClientLayer -.->|"Isomorphic Import (Direct Client Execution)"| IsomorphicCore
    ServerLayer -.->|"Isomorphic Import (Backend Execution)"| IsomorphicCore
    ServerLayer -->|"Synchronous Prepared SQL Statements"| DatabaseLayer
```

---

## 2. End-to-End Evaluation Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / Entrepreneur
    participant UI as React Questionnaire
    participant API as Express API (/api/match)
    participant DB as SQLite DB
    participant Engine as Isomorphic Core (eligibility & scoring)

    User->>UI: Enters Income, Project Cost, Loan, Category, Purpose & PIN
    opt Optional PIN Lookup
        UI->>API: GET /api/pincode/560001
        API->>DB: SELECT * FROM pincodes WHERE pincode = ?
        DB-->>API: Returns District, State, Lat, Lng
        API-->>UI: Pre-fills State & District Dropdowns
    end

    User->>UI: Clicks "Find Matching Schemes"
    UI->>API: POST /api/match { income, projectCost, loanAmount, purpose, category }
    API->>DB: SELECT * FROM schemes
    DB-->>API: Returns all 5 NSFDC scheme definitions
    
    loop For Every Scheme
        API->>Engine: checkEligibility(income, projectCost, loanAmount, scheme, category)
        Engine-->>API: { eligible: true/false, reasons: [], maxLoan: 180000 }
        
        API->>Engine: scoreScheme(scheme, { loanAmount, maxLoan, eligible, purpose })
        Engine-->>API: { totalScore: 84, breakdown: [Interest, LoanFit, Tenor, Moratorium, Purpose] }
    end

    API-->>UI: 200 OK { eligible: [Ranked Schemes], ineligible: [Rejected Schemes] }
    UI->>UI: Stores result in sessionStorage & navigates to /result
    UI-->>User: Renders Ranked Recommendations, Fit Badges & Reason Explanations
```

---

## 3. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    states ||--o{ districts : contains
    states ||--o{ partners : located_in
    states ||--o{ sc_population : records
    states ||--o{ sc_population_by_caste : records
    
    districts ||--o{ partners : assigns
    
    partner_types ||--o{ partners : categorizes
    partner_types ||--o{ scheme_partner_types : enables
    
    schemes ||--o{ scheme_partner_types : channels_through
    
    partners ||--o| partner_geo : mapped_to
    partners ||--o| partner_status : evaluated_by
    
    data_sources ||--o{ partners : verifies
    data_sources ||--o{ partner_status : sources
    data_sources ||--o{ sc_population : sources

    states {
        INTEGER id PK
        TEXT name
        TEXT code UK
    }

    districts {
        INTEGER id PK
        INTEGER state_id FK
        TEXT name
        TEXT lgd_code UK
        TEXT census_2011_code
    }

    schemes {
        INTEGER id PK
        TEXT code UK
        TEXT name
        INTEGER max_loan_amount
        INTEGER max_project_cost
        REAL interest_rate
        INTEGER max_repayment_years
        INTEGER moratorium_months
        REAL loan_cap_percent
        TEXT purpose
        INTEGER income_cap_inr
        TEXT target_group
    }

    partner_types {
        INTEGER id PK
        TEXT name UK
    }

    partners {
        INTEGER id PK
        TEXT code UK
        TEXT name
        INTEGER type_id FK
        INTEGER state_id FK
        INTEGER district_id FK
        TEXT address
        INTEGER source_id FK
    }

    partner_geo {
        INTEGER partner_id PK,FK
        REAL latitude
        REAL longitude
        BOOLEAN is_approximate
    }

    partner_status {
        INTEGER partner_id PK,FK
        TEXT npa_level
        REAL overdue_pct
        REAL fund_utilisation_pct
        TEXT as_on_date
        BOOLEAN is_simulated
        INTEGER source_id FK
    }

    pincodes {
        TEXT pincode PK
        TEXT district
        TEXT state
        REAL latitude
        REAL longitude
        INTEGER office_count
    }

    partner_branches {
        TEXT id PK
        TEXT bank
        TEXT branch
        TEXT address
        TEXT bank_group
        TEXT state_name
        TEXT district_name
        REAL latitude
        REAL longitude
        BOOLEAN is_channel_partner_eligible
    }
```
