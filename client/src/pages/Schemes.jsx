import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
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

  const filteredSchemes = schemes.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q);
  });

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <h2>📜 NSFDC Concessional Loan Schemes Catalog</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Official credit schemes funded under the National Scheduled Castes Finance & Development Corporation.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary btn-sm" onClick={() => navigate('/compare')}>
              ⚖️ Side-by-Side Comparison
            </button>
            <button className="btn-primary btn-sm" onClick={() => navigate('/questionnaire')}>
              🎯 Check My Eligibility
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-md" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search schemes by name, code, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="mt-md">Loading schemes catalog...</p>
        ) : (
          <div className="schemes-grid mt-lg">
            {filteredSchemes.map((s) => (
              <div key={s.id} className="scheme-card eligible-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="scheme-card-header">
                  <div>
                    <h4>{s.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Code: {s.code}</span>
                  </div>
                  <span className="badge badge-accent">{s.interest_rate}% p.a.</span>
                </div>

                <div className="scheme-details" style={{ flexGrow: 1 }}>
                  <div className="detail-row">
                    <span>Max Loan Permissible:</span>
                    <strong>₹{Number(s.max_loan_amount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Max Project Cost:</span>
                    <strong>₹{Number(s.max_project_cost).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Repayment Tenor:</span>
                    <strong>{s.max_repayment_years} Years</strong>
                  </div>
                  <div className="detail-row">
                    <span>Moratorium Grace:</span>
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
                    onClick={() => navigate(`/schemes/${s.code}`)}
                  >
                    View Guidelines →
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() =>
                      navigate('/EMICalculator', {
                        state: {
                          principal: s.max_loan_amount,
                          rate: s.interest_rate,
                          years: s.max_repayment_years,
                          moratorium: s.moratorium_months || 0,
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
