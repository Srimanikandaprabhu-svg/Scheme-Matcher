import React, { useState } from 'react';
import { calculateEMI } from '../../../shared/emi.js';

const EMICalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(3);

  const p = Number(principal) || 0;
  const r = Number(rate) || 0;
  const y = Number(years) || 1;

  const emi = p > 0 && r > 0 && y > 0 ? calculateEMI(p, r, y) : 0;
  const totalPayment = +(emi * y * 12).toFixed(2);
  const totalInterest = +(totalPayment - p).toFixed(2);

  const applyPreset = (presetP, presetR, presetY) => {
    setPrincipal(presetP);
    setRate(presetR);
    setYears(presetY);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🧮 Loan EMI Calculator</h2>
        <p className="subtitle">
          Calculate your estimated monthly installment and total repayment for various NSFDC schemes.
        </p>

        <div className="presets-row">
          <span>Quick Scheme Presets:</span>
          <button type="button" className="btn-secondary btn-sm" onClick={() => applyPreset(125000, 6.5, 3)}>
            Micro Finance (₹1.25L @ 6.5%, 3y)
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={() => applyPreset(500000, 8.0, 5)}>
            Term Loan (₹5L @ 8%, 5y)
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={() => applyPreset(1000000, 6.5, 10)}>
            Education Loan (₹10L @ 6.5%, 10y)
          </button>
        </div>

        <div className="calc-grid">
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

            <div className="form-group">
              <label htmlFor="rate">Annual Interest Rate (%):</label>
              <input
                id="rate"
                type="number"
                step="0.1"
                min="1"
                max="25"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="helper-text">Standard government beneficiary rate: 6.5% – 8.0%</span>
            </div>

            <div className="form-group">
              <label htmlFor="years">Repayment Period (Years):</label>
              <input
                id="years"
                type="number"
                min="1"
                max="15"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
              <span className="helper-text">{years * 12} monthly installments</span>
            </div>
          </div>

          <div className="result-column">
            <div className="emi-result-card">
              <span className="result-label">Monthly EMI</span>
              <div className="emi-amount">₹{emi.toLocaleString('en-IN')}</div>

              <div className="emi-breakdown">
                <div className="breakdown-item">
                  <span>Principal Loan Amount:</span>
                  <strong>₹{p.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Total Interest Payable:</span>
                  <strong>₹{totalInterest.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item total">
                  <span>Total Payable (Principal + Interest):</span>
                  <strong>₹{totalPayment.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
