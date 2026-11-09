import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSchemes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load schemes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>📜 Government Schemes Directory</h2>
        <p className="subtitle">
          Official concessional schemes sponsored by the National Scheduled Castes Finance & Development Corporation (NSFDC).
        </p>

        {loading ? (
          <p>Loading schemes...</p>
        ) : (
          <div className="schemes-grid mt-md">
            {schemes.map((s) => (
              <div key={s.id} className="scheme-card eligible-card">
                <div className="scheme-card-header">
                  <h4>{s.name}</h4>
                  <span className="badge badge-accent">{s.code}</span>
                </div>
                <div className="scheme-details">
                  <div className="detail-row">
                    <span>Max Loan Amount:</span>
                    <strong>₹{Number(s.max_loan_amount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Max Project Cost:</span>
                    <strong>₹{Number(s.max_project_cost).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Beneficiary Interest Rate:</span>
                    <strong>{s.interest_rate}% p.a.</strong>
                  </div>
                  <div className="detail-row">
                    <span>Max Repayment Tenor:</span>
                    <strong>{s.max_repayment_years} Years</strong>
                  </div>
                  <div className="detail-row">
                    <span>Moratorium Period:</span>
                    <strong>{s.moratorium_months || 0} Months</strong>
                  </div>
                  <div className="detail-row">
                    <span>Financing Cap:</span>
                    <strong>{s.loan_cap_percent}% of Project Cost</strong>
                  </div>
                </div>

                <div className="scheme-card-actions mt-md">
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => navigate('/questionnaire')}
                  >
                    Check My Eligibility →
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() =>
                      navigate('/EMICalculator', {
                        state: {
                          principal: s.max_loan_amount,
                          rate: s.interest_rate,
                          years: s.max_repayment_years,
                        },
                      })
                    }
                  >
                    Calculate EMI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
