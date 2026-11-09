// shared/scoring.js
/**
 * Very simple weighted scoring for scheme matching.
 * Higher weight for lower interest rate and longer moratorium.
 * Returns a score between 0 and 100 (higher = better).
 */
export function scoreScheme(scheme) {
  // Normalise parameters (example values based on known schemes)
  const maxRate = 15; // highest interest among schemes
  const maxMoratorium = 12; // months
  const rateScore = ((maxRate - scheme.interest_rate) / maxRate) * 60; // 60% weight
  const moratoriumScore = (scheme.moratorium_months / maxMoratorium) * 40; // 40% weight
  const total = rateScore + moratoriumScore;
  return Math.round(total);
}
