// shared/scoring.js
/**
 * Transparent Multi-Factor Explainable Scheme Scoring Engine.
 *
 * Scoring Factors (Total: 100 points max):
 * 1. Interest Rate Score (0 - 30 pts): Lower interest rates score higher.
 * 2. Loan Amount Coverage Score (0 - 25 pts): Higher score if maxLoan matches or exceeds requested loan.
 * 3. Repayment Tenure Score (0 - 20 pts): Longer repayment tenor provides better cashflow flexibility.
 * 4. Moratorium Period Score (0 - 15 pts): Generous grace periods reduce initial debt burden.
 * 5. Purpose & Special Feature Alignment (0 - 10 pts): Bonus alignment with specific sector.
 *
 * Ineligible schemes are strictly capped at 0 points so they never rank above eligible schemes.
 *
 * @param {Object} scheme - Scheme database record
 * @param {Object} userPreferences
 * @param {number} userPreferences.loanAmount - Requested loan amount
 * @param {number} userPreferences.maxLoan - Max loan allowed for this user under this scheme
 * @param {boolean} userPreferences.eligible - Whether user meets all hard eligibility criteria
 * @param {string} [userPreferences.purpose] - Business / Education / Agriculture / Microfinance
 * @returns {Object} { totalScore, breakdown: { factor, points, maxPoints, explanation } }
 */
export function scoreScheme(scheme, { loanAmount = 0, maxLoan = 0, eligible = true, purpose = '' } = {}) {
  // Hard Rule: Ineligible schemes receive 0 total score
  if (!eligible) {
    return {
      totalScore: 0,
      breakdown: [
        {
          factor: 'Eligibility Status',
          points: 0,
          maxPoints: 100,
          explanation: 'Ineligible schemes receive a score of 0 and cannot be recommended above eligible schemes.',
        },
      ],
    };
  }

  const breakdown = [];

  // Factor 1: Interest Rate (Max 30 pts)
  // NSFDC rates typically range between 6.0% and 15.0%.
  const rate = Number(scheme.interest_rate) || 8.0;
  const minRate = 5.0;
  const maxRate = 16.0;
  const rateFactor = Math.max(0, Math.min(1, (maxRate - rate) / (maxRate - minRate)));
  const interestPoints = Math.round(rateFactor * 30);
  breakdown.push({
    factor: 'Interest Rate Concession',
    points: interestPoints,
    maxPoints: 30,
    explanation: `Low interest rate of ${rate}% p.a. earns ${interestPoints}/30 points for affordable debt servicing.`,
  });

  // Factor 2: Loan Amount Coverage (Max 25 pts)
  const reqLoan = Number(loanAmount) || 1;
  const coverageRatio = Math.min(1, maxLoan / reqLoan);
  const coveragePoints = Math.round(coverageRatio * 25);
  breakdown.push({
    factor: 'Loan Fit & Coverage',
    points: coveragePoints,
    maxPoints: 25,
    explanation: `Scheme provides ₹${maxLoan.toLocaleString('en-IN')} coverage for your ₹${reqLoan.toLocaleString('en-IN')} requested capital (${Math.round(coverageRatio * 100)}% fit).`,
  });

  // Factor 3: Repayment Tenor (Max 20 pts)
  // Repayment years typically range from 3 to 12 years.
  const years = Number(scheme.max_repayment_years) || 3;
  const tenorPoints = Math.min(20, Math.round((years / 10) * 20));
  breakdown.push({
    factor: 'Repayment Tenor',
    points: tenorPoints,
    maxPoints: 20,
    explanation: `Repayment window of ${years} years provides comfortable installment amortization.`,
  });

  // Factor 4: Moratorium Grace Period (Max 15 pts)
  // Moratorium months typically range from 0 to 12 months.
  const moratorium = Number(scheme.moratorium_months) || 0;
  const moratPoints = Math.min(15, Math.round((moratorium / 12) * 15));
  breakdown.push({
    factor: 'Moratorium Grace Period',
    points: moratPoints,
    maxPoints: 15,
    explanation: moratorium > 0
      ? `${moratorium} months repayment moratorium relieves initial financial pressure.`
      : 'Standard repayment terms without extended moratorium.',
  });

  // Factor 5: Sector & Purpose Alignment (Max 10 pts)
  let purposePoints = 5; // Base compatibility
  const normPurpose = (purpose || '').toLowerCase();
  const schemePurpose = (scheme.purpose || '').toLowerCase();
  const schemeName = (scheme.name || '').toLowerCase();

  if (normPurpose && (schemePurpose.includes(normPurpose) || schemeName.includes(normPurpose))) {
    purposePoints = 10;
  }
  breakdown.push({
    factor: 'Purpose Alignment',
    points: purposePoints,
    maxPoints: 10,
    explanation: purposePoints === 10
      ? `Direct domain alignment with your objective (${purpose}).`
      : 'Broad multi-sector scheme applicable to general enterprise activities.',
  });

  const totalScore = interestPoints + coveragePoints + tenorPoints + moratPoints + purposePoints;

  return {
    totalScore,
    breakdown,
  };
}
