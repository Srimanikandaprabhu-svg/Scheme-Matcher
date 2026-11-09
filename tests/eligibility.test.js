import { describe, it, expect } from 'vitest';
import { checkEligibility } from '../shared/eligibility.js';

describe('Eligibility Engine Tests', () => {
  const sampleScheme = {
    id: 1,
    code: 'MFS',
    name: 'Micro Finance Scheme',
    max_loan_amount: 125000,
    max_project_cost: 140000,
    interest_rate: 6.5,
    max_repayment_years: 3,
    moratorium_months: 3,
    loan_cap_percent: 90,
    income_cap_inr: 500000,
    target_group: 'SC',
    purpose: 'micro finance scheme',
  };

  it('approves an applicant within all parameters', () => {
    const result = checkEligibility({
      income: 250000,
      projectCost: 100000,
      loanAmount: 80000,
      scheme: sampleScheme,
      category: 'SC',
    });
    expect(result.eligible).toBe(true);
    expect(result.reasons.length).toBe(0);
    expect(result.eligibleReasons.length).toBeGreaterThan(0);
    expect(result.maxLoan).toBe(90000); // 90% of 100,000
  });

  it('rejects an applicant whose income exceeds the scheme cap', () => {
    const result = checkEligibility({
      income: 600000,
      projectCost: 100000,
      loanAmount: 80000,
      scheme: sampleScheme,
      category: 'SC',
    });
    expect(result.eligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('income'))).toBe(true);
  });

  it('rejects project cost exceeding maximum project cost', () => {
    const result = checkEligibility({
      income: 200000,
      projectCost: 200000, // exceeds 140,000
      loanAmount: 80000,
      scheme: sampleScheme,
      category: 'SC',
    });
    expect(result.eligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('Project cost'))).toBe(true);
  });

  it('rejects loan amount exceeding permissible loan cap', () => {
    const result = checkEligibility({
      income: 200000,
      projectCost: 100000,
      loanAmount: 95000, // exceeds 90% of 100,000 (90,000)
      scheme: sampleScheme,
      category: 'SC',
    });
    expect(result.eligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('exceeds the maximum permissible loan'))).toBe(true);
  });

  it('rejects non-target category for SC reserved schemes', () => {
    const result = checkEligibility({
      income: 200000,
      projectCost: 100000,
      loanAmount: 80000,
      scheme: sampleScheme,
      category: 'GENERAL',
    });
    expect(result.eligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('reserved specifically for Scheduled Caste'))).toBe(true);
  });

  it('handles zero or missing values gracefully without throwing', () => {
    const result = checkEligibility({
      income: null,
      projectCost: undefined,
      loanAmount: 0,
      scheme: sampleScheme,
    });
    expect(result).toBeDefined();
    expect(typeof result.eligible).toBe('boolean');
  });
});
