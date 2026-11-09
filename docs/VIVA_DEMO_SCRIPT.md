# SchemeMatcher (SIH26092) – Live Project Demonstration & Viva Script

**Audience:** Project Guide / Evaluators / Technical Review Committee  
**Presenter:** Project Lead / Developer  
**Estimated Demo Time:** 8–10 Minutes  

---

## 🎤 Presentation Opening Script (Say This First)

> *"Good morning / afternoon respected guide and evaluators.  
> Today, I am presenting **SchemeMatcher (SIH26092)**, an AI-driven, accessible scheme matching platform built for marginalized entrepreneurs under the National Scheduled Castes Finance & Development Corporation (NSFDC).  
> 
> Many aspiring entrepreneurs and students struggle because government guidelines have rigid caps, complex moratorium rules, and confusing application routes through State Channelising Agencies (SCAs).  
> 
> Instead of a black-box machine learning model where no one knows why a decision was made, we engineered a **transparent, deterministic multi-factor matching engine**, paired with **geospatial postal PIN-code intelligence** and **full financial amortization**.  
> 
> Let me walk you through our live system with real test cases."*

---

## 🎯 Test Case 1: Small Artisan / Retailer (Micro Finance Scheme Match)

### 1. The Scenario
A rural artisan or micro-entrepreneur seeking small capital to buy raw materials and tools for a handicraft stall.

### 2. Exact Inputs to Enter in `/questionnaire`:
- **State / District:** Karnataka / Bengaluru Urban *(or enter PIN: `560001`)*
- **Applicant Category:** `Scheduled Caste (SC) Beneficiary`
- **Annual Family Income:** `₹1,80,000` *(Well below the ₹5,00,000 ceiling)*
- **Estimated Project Cost:** `₹1,20,000` *(Within ₹1,40,000 MFS ceiling)*
- **Desired Loan Amount:** `₹1,00,000` *(Within 90% cap = ₹1,08,000)*
- **Purpose:** `Small Microenterprise / Retail Stall / Microfinance`

### 3. What to Say When Clicking "Find Matching Schemes":
> *"Notice what happens when I submit this profile. The backend evaluates the rules in sub-10 milliseconds.  
> At the top of the Results page, the system recommends **Micro Finance Scheme (MFS)** and **Aajeevika Microfinance Yojana (AMY)** with top fit scores (around 85+ points).  
> If we inspect the explainable breakdown, we see:  
> - **Interest Concession:** 26/30 points (low 6.5% interest rate).  
> - **Loan Coverage:** 25/25 points (full ₹1,00,000 capital can be financed).  
> - **Moratorium:** 15/15 points (3-month grace period before principal starts).  
> And down below, high-capital schemes like Term Loan are ranked lower or flagged because this project is specifically tailored for microfinance."*

---

## 🎯 Test Case 2: Ambitious Manufacturing / Heavy Enterprise (Term Loan Match)

### 1. The Scenario
An entrepreneur setting up a garment unit, fabrication shop, or agro-processing plant requiring substantial capital.

### 2. Exact Inputs to Enter in `/questionnaire`:
- **State / District:** Tamil Nadu / Chennai *(or enter PIN: `600001`)*
- **Applicant Category:** `Scheduled Caste (SC) Beneficiary`
- **Annual Family Income:** `₹3,50,000` *(Complies with ₹5 Lakh ceiling)*
- **Estimated Project Cost:** `₹25,00,000` *(Exceeds microfinance, but within ₹50 Lakh Term Loan limit)*
- **Desired Loan Amount:** `₹20,00,000` *(Within 90% cap = ₹22,50,000)*
- **Purpose:** `Commercial Business / Trade / Industry / Services`

### 3. What to Say When Results Appear:
> *"Here, the applicant needs ₹20 Lakhs.  
> Notice that **Micro Finance Scheme is immediately rejected** with an explicit reason:  
> `'Project cost of ₹25,00,000 exceeds the Micro Finance maximum of ₹1,40,000'`.  
> Meanwhile, **Term Loan (TL)** is recommended at Rank 1.  
> It finances up to ₹22,50,000 (90% of ₹25 Lakhs), charges a concessional 8% interest rate, and provides a **6 to 12-month moratorium** to complete machine installation before principal repayment begins."*

---

## 🎯 Test Case 3: Higher Professional Education Loan (ELS Match)

### 1. The Scenario
An SC student admitted to an engineering, medical, or overseas master's program needing tuition fee assistance.

### 2. Exact Inputs in `/questionnaire`:
- **Applicant Category:** `Scheduled Caste (SC) Beneficiary`
- **Annual Family Income:** `₹2,50,000`
- **Estimated Project Cost (Course Fee):** `₹15,00,000`
- **Desired Loan Amount:** `₹13,50,000`
- **Purpose:** `Higher Professional Education (Domestic or Abroad)`

### 3. What to Say:
> *"The engine matches **Educational Loan Scheme (ELS)**.  
> Look at the unique parameters:  
> - Concessional rate of only **6.5% p.a.**  
> - Repayment duration extending up to **10 to 12 years**.  
> - Moratorium covers the **entire course duration plus 1 year** (or 6 months after starting employment).  
> Clicking 'Calculate Monthly EMI' automatically passes these parameters directly into our financial amortizer."*

---

## 🎯 Test Case 4: Boundary & Rejection Demonstration (Integrity Test)

### 1. The Scenario
An applicant who exceeds the government income threshold.

### 2. Exact Inputs:
- **Annual Family Income:** `₹7,50,000` *(Exceeds ₹5,00,000 limit)*
- **Project Cost:** `₹3,00,000`
- **Loan Amount:** `₹2,50,000`

### 3. What to Say to Guide:
> *"A crucial feature of an honest welfare engine is handling ineligibility without crashing or providing false hope.  
> Look at the screen: all schemes are classified under **Ineligible Schemes** with a score of 0.  
> The exact reason is rendered:  
> `'Annual family income of ₹7,50,000 exceeds the ₹5,00,000 ceiling for NSFDC schemes'`.  
> This ensures that public funds are strictly directed to genuinely marginalized families."*

---

## 🎯 Test Case 5: Geospatial Partner Locator & Radius Expansion

Navigate to the **Partner Locator (`/partners`)** page.

### 1. Demo A: Instant PIN Code Centroid Resolution
- Enter PIN Code: `560001` (Bengaluru GPO) and click **Search**.
- **What to say:**  
  > *"Instead of asking citizens for GPS permissions—which many rural users deny—we integrated the Department of Posts directory containing **19,586 unique postal centroids**.  
  > Entering `560001` immediately resolves to Latitude 12.98, Longitude 77.59.  
  > The Leaflet map instantly plots the citizen's location with a red pin and renders the accredited State Channelising Agencies (SCAs) and Public Sector Banks in blue and green."*

### 2. Demo B: Automatic Radius Expansion
- Change the radius slider to `25 km` for a location with no immediate partner within 25 km, or explain the feature:
- **What to say:**  
  > *"If no branch exists within 25 km, our backend does NOT say 'No results found'.  
  > It triggers **Automatic Radius Expansion**, widening the search to 250 km or 500 km and alerting the user:  
  > `'Expanded radius to 250 km to find regional nodal offices'`.  
  > And below the map, any institutions whose precise GPS coordinates are unmapped are displayed in an **Administrative Office Fallback List**, ensuring no citizen is left without an address."*

---

## 🎯 Test Case 6: Financial Amortization with Moratorium

Navigate to the **EMI Calculator (`/EMICalculator`)**.

### 1. Steps to Demonstrate:
- Click the preset button: **"Term Loan (₹5L @ 8%, 5y, 6m morat)"**.
- Click **"▼ View Full Month-by-Month Amortization Schedule"**.

### 2. What to Say:
> *"Notice the difference between a standard commercial bank calculator and our public welfare calculator.  
> During the first 6 months—highlighted in light yellow—principal repayment is strictly ₹0. The borrower only services simple interest.  
> From Month 7 onwards, the remaining balance is amortized over the active 54 months.  
> The schedule table proves that in Month 60, the closing balance reaches exactly ₹0.00."*

---

## 🎯 Test Case 7: Verified Policy Knowledge Assistant

Navigate to the **Assistant (`/assistant`)** page.

### 1. Action:
- Click the suggestion chip: **"What is the maximum loan under Micro Finance Scheme (MFS)?"**
- Next, ask: **"What documents do I need to apply?"**

### 2. What to Say:
> *"Our assistant is deterministic and factual. It draws exclusively from official NSFDC lending annexures.  
> It does not hallucinate government policy or make unauthorized promises. It clearly states the ₹1.25 Lakh loan cap and lists the exact revenue certificates needed."*

---

## 🎯 Test Case 8: Multi-Lingual & Accessibility Demonstration

1. Click the Language dropdown in the top header and switch to **தமிழ் (Tamil)** or **हिन्दी (Hindi)**.
2. Click the Font Sizing buttons: `A-`, `A`, `A+`.
3. **What to say:**  
   > *"True social inclusion requires digital accessibility. With one click, the entire interface—navigation, buttons, and disclaimers—switches to Tamil or Hindi. Citizens with low vision can enlarge text dynamically using our A+ controls."*

---

## 💡 Quick Viva Q&A Cheat Sheet (Guide's Likely Questions)

### Q1: "Why didn't you use Deep Learning or Random Forest for scheme matching?"
**Your Answer:**  
> *"In public welfare distribution, government eligibility rules (income limits, loan caps) are statutory and non-negotiable legal constraints. A neural network can suffer from hallucination or unexplainable bias, which is unacceptable for loan approvals. We used a **deterministic rule engine paired with a 5-factor weighted scoring model**. It is 100% explainable, mathematically verifiable, and auditable."*

### Q2: "How did you handle the large 516 MB RBI dataset?"
**Your Answer:**  
> *"Loading a 516 MB file into memory or the browser would crash consumer devices. We engineered `scripts/processDatasets.js`, which streams the file line-by-line using Node.js readline streams. We filtered for active domestic branches of public sector and regional rural banks with valid Indian bounding coordinates, producing a compact 15,000-branch dataset that seeds directly into indexed SQLite tables."*

### Q3: "What happens if a partner bank has no geographic coordinates?"
**Your Answer:**  
> *"We strictly adhere to ethical data principles: we **never invent fake coordinates**. If coordinates are missing, the partner is presented in our state-level Administrative Office Fallback List with its registered postal address."*

### Q4: "Is this connected to the live government database?"
**Your Answer:**  
> *"No. As clearly stated in our top prototype banner and Data Transparency page, this is an **academic student prototype for SIH26092**. Institutional health metrics (like NPA and fund utilization) are simulated test datasets, which we prominently disclose on every relevant card."*

---

## 🏆 Closing Statement
> *"To summarize: SchemeMatcher combines rigorous data engineering, verifiable mathematical models, and human-centric design to make government welfare accessible to every citizen. Thank you! I welcome any questions."*
