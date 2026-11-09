import { describe, it, expect } from 'vitest';
import { scoreScheme } from '../shared/scoring.js';

describe('Explainable Scoring Engine Tests', () => {
  const schemeA = {
    code: 'MFS',
    name: 'Micro Finance Scheme',
    interest_rate: 6.5,
    max_repayment_years: 3,
    moratorium_months: 3,
    purpose: 'micro finance small business',
  };

  const schemeB = {
    code: 'TL',
    name: 'Term Loan',
    interest_rate: 8.0,
    max_repayment_years: 7,
    moratorium_months: 6,
    purpose: 'term loan business industry',
  };

  it('assigns 0 points to ineligible schemes', () => {
    const res = scoreScheme(schemeA, { loanAmount: 100000, maxLoan: 90000, eligible: false });
    expect(res.totalScore).toBe(0);
    expect(res.breakdown[0].factor).toBe('Eligibility Status');
  });

  it('assigns higher interest score to lower interest rates', () => {
    const resA = scoreScheme(schemeA, { loanAmount: 100000, maxLoan: 100000, eligible: true });
    const resB = scoreScheme(schemeB, { loanAmount: 100000, maxLoan: 100000, eligible: true });

    const interestA = resA.breakdown.find((b) => b.factor.includes('Interest Rate')).points;
    const interestB = resB.breakdown.find((b) => b.factor.includes('Interest Rate')).points;

    expect(interestA).toBeGreaterThan(interestB);
  });

  it('evaluates loan coverage ratio accurately', () => {
    const fullFit = scoreScheme(schemeA, { loanAmount: 50000, maxLoan: 50000, eligible: true });
    const partialFit = scoreScheme(schemeA, { loanAmount: 100000, maxLoan: 50000, eligible: true });

    const fitFull = fullFit.breakdown.find((b) => b.factor.includes('Loan Fit')).points;
    const fitPartial = partialFit.breakdown.find((b) => b.factor.includes('Loan Fit')).points;

    expect(fitFull).toBeGreaterThan(fitPartial);
  });

  it('provides detailed explainability for every score factor', () => {
    const res = scoreScheme(schemeA, { loanAmount: 50000, maxLoan: 50000, eligible: true, purpose: 'microfinance' });
    expect(res.breakdown.length).toBe(5);
    res.breakdown.forEach((f) => {
      expect(f.points).toBeGreaterThanOrEqual(0);
      expect(f.maxPoints).toBeGreaterThan(0);
      expect(f.explanation).toBeTruthy();
    });
  });
});
