import { describe, it, expect } from 'vitest';
import { calculateEMI, calculateDetailedLoan } from '../shared/emi.js';

describe('Financial EMI & Amortization Calculator Tests', () => {
  it('calculates standard monthly EMI accurately', () => {
    // 100,000 at 6.5% for 3 years
    const emi = calculateEMI(100000, 6.5, 3);
    expect(emi).toBeGreaterThan(3000);
    expect(emi).toBeLessThan(3100);
  });

  it('handles invalid or zero inputs safely', () => {
    expect(calculateEMI(0, 6.5, 3)).toBe(0);
    expect(calculateEMI(100000, 0, 3)).toBe(0);
    expect(calculateEMI(100000, 6.5, 0)).toBe(0);
    expect(calculateEMI(-50000, 6.5, 3)).toBe(0);
  });

  it('suspends principal payment during moratorium period', () => {
    const res = calculateDetailedLoan({
      principal: 125000,
      annualRate: 6.5,
      years: 3,
      moratoriumMonths: 3,
    });

    expect(res.moratoriumMonths).toBe(3);
    const moratMonths = res.schedule.slice(0, 3);
    moratMonths.forEach((m) => {
      expect(m.phase).toBe('Moratorium');
      expect(m.principalPaid).toBe(0);
      expect(m.interestPaid).toBeGreaterThan(0);
    });

    const repaymentMonths = res.schedule.slice(3);
    expect(repaymentMonths.length).toBe(33);
    expect(repaymentMonths[0].principalPaid).toBeGreaterThan(0);
  });

  it('ensures closing balance is zero at end of tenure', () => {
    const res = calculateDetailedLoan({
      principal: 500000,
      annualRate: 8.0,
      years: 5,
      moratoriumMonths: 6,
    });

    const lastMonth = res.schedule[res.schedule.length - 1];
    expect(lastMonth.closingBalance).toBe(0);
    expect(res.totalRepayment).toBeGreaterThan(res.principal);
  });
});
