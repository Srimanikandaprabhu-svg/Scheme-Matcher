// shared/emi.js
/**
 * Calculate the monthly EMI for a loan.
 * @param {number} principal - loan amount
 * @param {number} annualRate - interest rate in percent (e.g., 6.5)
 * @param {number} years - repayment period in years
 * @returns {number} monthly EMI (rounded to 2 decimals)
 */
export function calculateEMI(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return +(principal / n).toFixed(2);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  return +emi.toFixed(2);
}
