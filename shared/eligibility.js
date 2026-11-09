// shared/eligibility.js
/**
 * Simple eligibility checker based on scheme data.
 * Returns an object with flags for each rule.
 */
export function checkEligibility({ income, projectCost, loanAmount, scheme }) {
  const reasons = [];
  const incomeLimit = 500000; // Rs 5,00,000
  if (income > incomeLimit) {
    reasons.push(`Family income Rs ${income.toLocaleString()} exceeds the Rs ${incomeLimit.toLocaleString()} limit`);
  }
  if (projectCost > scheme.max_project_cost) {
    reasons.push(`Project cost Rs ${projectCost.toLocaleString()} exceeds the ${scheme.name} maximum of Rs ${scheme.max_project_cost.toLocaleString()}`);
  }
  const maxLoan = Math.min(scheme.max_loan_amount, Math.floor(projectCost * scheme.loan_cap_percent / 100));
  if (loanAmount > maxLoan) {
    reasons.push(`Requested loan Rs ${loanAmount.toLocaleString()} exceeds the allowed ${scheme.name} cap of Rs ${maxLoan.toLocaleString()}`);
  }
  return { eligible: reasons.length === 0, reasons, maxLoan };
}
