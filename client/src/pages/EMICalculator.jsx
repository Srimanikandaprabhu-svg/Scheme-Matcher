import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateDetailedLoan } from '../../../shared/emi.js';

const EMICalculator = () => {
  const location = useLocation();
  const initialPrincipal = location.state?.principal || 100000;
  const initialRate = location.state?.rate || 6.5;
  const initialYears = location.state?.years || 3;
  const initialMorat = location.state?.moratorium || 3;

  const [principal, setPrincipal] = useState(initialPrincipal);
  const [rate, setRate] = useState(initialRate);
  const [years, setYears] = useState(initialYears);
  const [moratorium, setMoratorium] = useState(initialMorat);
  const [showSchedule, setShowSchedule] = useState(false);

  const loanDetails = calculateDetailedLoan({
    principal: Number(principal) || 0,
    annualRate: Number(rate) || 0,
    years: Number(years) || 1,
    moratoriumMonths: Number(moratorium) || 0,
  });

  const p = loanDetails.principal;
  const totalInterest = loanDetails.totalInterest;
  const totalRepayment = loanDetails.totalRepayment;
  const principalPercent = totalRepayment > 0 ? Math.round((p / totalRepayment) * 100) : 100;
  const interestPercent = 100 - principalPercent;

  const applyPreset = (presetP, presetR, presetY, presetM) => {
    setPrincipal(presetP);
    setRate(presetR);
    setYears(presetY);
    setMoratorium(presetM);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <h2>🧮 Concessional Loan & Moratorium Calculator</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Simulate monthly EMIs, moratorium deferments, and repayment amortization for NSFDC credit programs.
            </p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => window.print()}>
            🖨️ Print Report
          </button>
        </div>

        {/* Quick Scheme Presets */}
        <div className="presets-row mt-md">
          <span>Official Scheme Presets:</span>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => applyPreset(125000, 6.5, 3, 3)}
          >
            Micro Finance (₹1.25L @ 6.5%, 3y, 3m morat)
          </button>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => applyPreset(500000, 8.0, 5, 6)}
          >
            Term Loan (₹5L @ 8%, 5y, 6m morat)
          </button>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => applyPreset(1000000, 6.5, 10, 12)}
          >
            Education Loan (₹10L @ 6.5%, 10y, 12m morat)
          </button>
        </div>

        <div className="calc-grid mt-lg">
          {/* Inputs Column */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="principal">Loan Amount (₹):</label>
              <input
                id="principal"
                type="number"
                min="5000"
                max="5000000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
              <span className="helper-text">₹{Number(principal || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="form-group mt-sm">
              <label htmlFor="rate">Annual Interest Rate (%):</label>
              <input
                id="rate"
                type="number"
                step="0.1"
                min="1"
                max="20"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="helper-text">Standard NSFDC beneficiary range: 6.5% – 8.0%</span>
            </div>

            <div className="form-group mt-sm">
              <label htmlFor="years">Total Loan Tenure (Years):</label>
              <input
                id="years"
                type="number"
                min="1"
                max="15"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
              <span className="helper-text">{years * 12} total calendar months</span>
            </div>

            <div className="form-group mt-sm">
              <label htmlFor="morat">Moratorium Grace Period (Months):</label>
              <input
                id="morat"
                type="number"
                min="0"
                max="24"
                value={moratorium}
                onChange={(e) => setMoratorium(e.target.value)}
              />
              <span className="helper-text">Principal repayment suspended during moratorium</span>
            </div>
          </div>

          {/* Results Column */}
          <div className="result-column">
            <div className="emi-result-card">
              <span className="result-label">Monthly EMI (Post-Moratorium)</span>
              <div className="emi-amount">₹{loanDetails.monthlyEMI.toLocaleString('en-IN')}</div>

              <div className="emi-breakdown">
                <div className="breakdown-item">
                  <span>Principal Loan:</span>
                  <strong>₹{p.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Total Interest Payable:</span>
                  <strong>₹{totalInterest.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Moratorium Grace:</span>
                  <strong>{loanDetails.moratoriumMonths} Months</strong>
                </div>
                <div className="breakdown-item total">
                  <span>Total Repayment (Principal + Interest):</span>
                  <strong>₹{totalRepayment.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Principal: {principalPercent}%</span>
                  <span>Interest: {interestPercent}%</span>
                </div>
                <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${principalPercent}%`, background: '#64b5f6' }} />
                  <div style={{ width: `${interestPercent}%`, background: '#ffb74d' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions */}
        <div className="card mt-lg" style={{ background: '#f8fafc', padding: '16px' }}>
          <h4 style={{ color: '#0d47a1', marginBottom: '6px' }}>Calculation Assumptions & Disclosure:</h4>
          <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#555', lineHeight: 1.6 }}>
            {loanDetails.assumptions.map((asm, idx) => (
              <li key={idx}>{asm}</li>
            ))}
          </ul>
        </div>

        {/* Repayment Schedule Toggle */}
        <div className="mt-lg">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setShowSchedule(!showSchedule)}
          >
            {showSchedule ? '▲ Hide Full Amortization Schedule' : '▼ View Full Month-by-Month Amortization Schedule'}
          </button>

          {showSchedule && (
            <div className="table-responsive mt-md" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="comparison-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Phase</th>
                    <th>Opening Balance</th>
                    <th>Installment</th>
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loanDetails.schedule.map((row) => (
                    <tr key={row.month} style={{ background: row.phase === 'Moratorium' ? '#fffde7' : '#ffffff' }}>
                      <td>{row.month}</td>
                      <td>
                        <span className={`badge ${row.phase === 'Moratorium' ? 'badge-accent' : 'badge-success'}`}>
                          {row.phase}
                        </span>
                      </td>
                      <td>₹{row.openingBalance.toLocaleString('en-IN')}</td>
                      <td>₹{row.payment.toLocaleString('en-IN')}</td>
                      <td>₹{row.principalPaid.toLocaleString('en-IN')}</td>
                      <td>₹{row.interestPaid.toLocaleString('en-IN')}</td>
                      <td>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
