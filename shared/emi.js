// shared/emi.js
/**
 * Financial Amortization & EMI Calculator for Concessional Government Loans.
 * Supports standard monthly compounding, moratorium deferrals, and repayment schedules.
 */

/**
 * Calculate the monthly EMI for a standard loan.
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 *
 * @param {number} principal - Loan amount in INR
 * @param {number} annualRate - Annual interest rate in % (e.g. 6.5)
 * @param {number} years - Loan tenure in years
 * @returns {number} Monthly EMI rounded to 2 decimals
 */
export function calculateEMI(principal, annualRate, years) {
  const p = Number(principal);
  const r = Number(annualRate);
  const y = Number(years);
  if (!p || !r || !y || p <= 0 || r <= 0 || y <= 0) return 0;

  const monthlyRate = r / 100 / 12;
  const n = Math.round(y * 12);
  if (monthlyRate === 0) return +(p / n).toFixed(2);

  const factor = Math.pow(1 + monthlyRate, n);
  const emi = (p * monthlyRate * factor) / (factor - 1);
  return +emi.toFixed(2);
}

/**
 * Generate a complete repayment schedule including moratorium deferment and principal/interest breakdown.
 *
 * Assumption Disclosures:
 * - Simple interest during moratorium period is accrued or serviced without penal compounding.
 * - Post-moratorium principal is amortized evenly across the remaining (Tenure - Moratorium) period.
 *
 * @param {Object} params
 * @param {number} params.principal - Principal loan in INR
 * @param {number} params.annualRate - Annual interest rate in %
 * @param {number} params.years - Tenure in years
 * @param {number} [params.moratoriumMonths=0] - Moratorium months
 * @returns {Object} Complete breakdown and schedule
 */
export function calculateDetailedLoan({ principal, annualRate, years, moratoriumMonths = 0 }) {
  const p = Number(principal) || 0;
  const r = Number(annualRate) || 0;
  const totalMonths = Math.round((Number(years) || 1) * 12);
  const morat = Math.min(Math.max(0, Number(moratoriumMonths) || 0), totalMonths - 1);
  const repaymentMonths = totalMonths - morat;

  const monthlyRate = r / 100 / 12;
  let balance = p;
  const schedule = [];
  let totalInterest = 0;
  let totalRepayment = 0;

  // Moratorium Phase (Interest accrual / grace)
  for (let m = 1; m <= morat; m++) {
    const interestDuringMorat = +(balance * monthlyRate).toFixed(2);
    totalInterest += interestDuringMorat;
    totalRepayment += interestDuringMorat;

    schedule.push({
      month: m,
      phase: 'Moratorium',
      openingBalance: balance,
      payment: interestDuringMorat,
      principalPaid: 0,
      interestPaid: interestDuringMorat,
      closingBalance: balance,
    });
  }

  // Post-Moratorium Amortization
  let emi = 0;
  if (repaymentMonths > 0 && monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    emi = +((balance * monthlyRate * factor) / (factor - 1)).toFixed(2);
  } else if (repaymentMonths > 0) {
    emi = +(balance / repaymentMonths).toFixed(2);
  }

  for (let m = morat + 1; m <= totalMonths; m++) {
    const interestPart = +(balance * monthlyRate).toFixed(2);
    let principalPart = +(emi - interestPart).toFixed(2);

    if (m === totalMonths || principalPart > balance) {
      principalPart = balance;
      emi = +(principalPart + interestPart).toFixed(2);
    }

    balance = Math.max(0, +(balance - principalPart).toFixed(2));
    totalInterest += interestPart;
    totalRepayment += emi;

    schedule.push({
      month: m,
      phase: 'Repayment',
      openingBalance: +(balance + principalPart).toFixed(2),
      payment: emi,
      principalPaid: principalPart,
      interestPaid: interestPart,
      closingBalance: balance,
    });
  }

  return {
    principal: p,
    annualRate: r,
    tenureYears: Number(years),
    moratoriumMonths: morat,
    repaymentMonths,
    monthlyEMI: emi,
    totalInterest: +totalInterest.toFixed(2),
    totalRepayment: +totalRepayment.toFixed(2),
    schedule,
    assumptions: [
      'Interest calculation uses 30/360 day-count convention.',
      morat > 0
        ? `During the ${morat}-month moratorium, principal repayment is suspended; monthly interest is serviced.`
        : 'Repayment begins immediately in month 1 without moratorium.',
      'Repayment is in equal monthly installments over the active repayment period.',
    ],
  };
}
