// shared/eligibility.js
/**
 * Dynamic Rule-Based Eligibility Checker for NSFDC & Marginalized Welfare Schemes.
 * Evaluates individual scheme parameters, income ceilings, project cost caps,
 * requested loan amounts, and applicant categories.
 *
 * @param {Object} params
 * @param {number} params.income - Annual family income in INR
 * @param {number} params.projectCost - Total project / education cost in INR
 * @param {number} params.loanAmount - Requested loan amount in INR
 * @param {Object} params.scheme - Scheme database record
 * @param {string} [params.category] - Applicant category (e.g. 'SC', 'SafaiKaramchari')
 * @param {string} [params.purpose] - Desired purpose / activity
 * @returns {Object} { eligible, reasons, eligibleReasons, maxLoan }
 */
export function checkEligibility({ income, projectCost, loanAmount, scheme, category = 'SC', purpose = '' }) {
  const reasons = [];
  const eligibleReasons = [];

  const numIncome = Number(income) || 0;
  const numProjectCost = Number(projectCost) || 0;
  const numLoanAmount = Number(loanAmount) || 0;

  // 1. Dynamic Scheme-Specific Income Cap
  const incomeLimit = Number(scheme.income_cap_inr) || 500000;
  if (numIncome > incomeLimit) {
    reasons.push(
      `Annual family income of ₹${numIncome.toLocaleString('en-IN')} exceeds the ₹${incomeLimit.toLocaleString('en-IN')} ceiling for ${scheme.name}.`
    );
  } else {
    eligibleReasons.push(
      `Family income ₹${numIncome.toLocaleString('en-IN')} is within the scheme ceiling of ₹${incomeLimit.toLocaleString('en-IN')}.`
    );
  }

  // 2. Project Cost Ceiling
  const maxProjectCost = Number(scheme.max_project_cost) || 5000000;
  if (numProjectCost > maxProjectCost) {
    reasons.push(
      `Project cost of ₹${numProjectCost.toLocaleString('en-IN')} exceeds the maximum allowed project cost of ₹${maxProjectCost.toLocaleString('en-IN')} under ${scheme.name}.`
    );
  } else {
    eligibleReasons.push(
      `Project cost ₹${numProjectCost.toLocaleString('en-IN')} complies with the maximum limit of ₹${maxProjectCost.toLocaleString('en-IN')}.`
    );
  }

  // 3. Maximum Loan Calculation (Loan Cap % and Absolute Max Loan)
  const capPercent = Number(scheme.loan_cap_percent) || 90;
  const absoluteMax = Number(scheme.max_loan_amount) || 5000000;
  const maxAllowableByCost = Math.floor((numProjectCost * capPercent) / 100);
  const maxLoan = Math.min(absoluteMax, maxAllowableByCost);

  if (numLoanAmount > maxLoan) {
    reasons.push(
      `Requested loan of ₹${numLoanAmount.toLocaleString('en-IN')} exceeds the maximum permissible loan of ₹${maxLoan.toLocaleString('en-IN')} (${capPercent}% of project cost, capped at ₹${absoluteMax.toLocaleString('en-IN')}).`
    );
  } else {
    eligibleReasons.push(
      `Requested loan of ₹${numLoanAmount.toLocaleString('en-IN')} is within the permissible financing cap of ₹${maxLoan.toLocaleString('en-IN')}.`
    );
  }

  // 4. Category Check
  const targetGroup = (scheme.target_group || 'SC').toUpperCase();
  const applicantCat = (category || 'SC').toUpperCase();
  if (targetGroup === 'SC' && applicantCat !== 'SC' && applicantCat !== 'SAFAIKARAMCHARI') {
    reasons.push(`${scheme.name} is reserved specifically for Scheduled Caste beneficiaries.`);
  }

  const eligible = reasons.length === 0;

  return {
    eligible,
    reasons,
    eligibleReasons,
    maxLoan,
  };
}
