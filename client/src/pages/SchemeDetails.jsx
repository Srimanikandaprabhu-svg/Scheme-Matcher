import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SchemeDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/schemes/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error('Scheme not found');
        return res.json();
      })
      .then((data) => {
        setScheme(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [code]);

  if (loading) return <div className="container"><div className="card"><p>Loading scheme details...</p></div></div>;
  if (error || !scheme) return <div className="container"><div className="card alert-error"><p>{error || 'Scheme not found.'}</p><button className="btn-secondary mt-sm" onClick={() => navigate('/schemes')}>Back to Schemes</button></div></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <span className="badge badge-accent">{scheme.code}</span>
            <h2 className="mt-sm">{scheme.name}</h2>
            <p className="subtitle" style={{ margin: '4px 0 0 0' }}>Official Concessional Lending Scheme under NSFDC</p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => navigate('/schemes')}>← Back to Directory</button>
        </div>

        <div className="grid-2 mt-lg">
          <div className="scheme-details-box">
            <h3>Key Financial Parameters</h3>
            <div className="detail-row">
              <span>Maximum Loan Amount:</span>
              <strong>₹{Number(scheme.max_loan_amount).toLocaleString('en-IN')}</strong>
            </div>
            <div className="detail-row">
              <span>Maximum Project Cost:</span>
              <strong>₹{Number(scheme.max_project_cost).toLocaleString('en-IN')}</strong>
            </div>
            <div className="detail-row">
              <span>Beneficiary Interest Rate:</span>
              <strong className="text-primary">{scheme.interest_rate}% p.a.</strong>
            </div>
            <div className="detail-row">
              <span>Maximum Repayment Tenor:</span>
              <strong>{scheme.max_repayment_years} Years</strong>
            </div>
            <div className="detail-row">
              <span>Moratorium Period:</span>
              <strong>{scheme.moratorium_months || 0} Months</strong>
            </div>
            <div className="detail-row">
              <span>Financing Percentage:</span>
              <strong>{scheme.loan_cap_percent}% of Project Cost</strong>
            </div>
            <div className="detail-row">
              <span>Annual Family Income Ceiling:</span>
              <strong>₹{Number(scheme.income_cap_inr || 500000).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="scheme-details-box">
            <h3>Implementation & Channeling</h3>
            <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1rem' }}>
              <strong>Channel Partner Types:</strong><br />
              {scheme.allowed_partner_types && scheme.allowed_partner_types.length > 0
                ? scheme.allowed_partner_types.map((t, idx) => (
                    <span key={idx} className="badge badge-success" style={{ marginRight: '6px', marginTop: '4px' }}>
                      {t}
                    </span>
                  ))
                : scheme.implemented_through || 'State Channelising Agencies (SCAs) / Public Sector Banks'}
            </p>

            {scheme.moratorium_note && (
              <div className="alert alert-info mt-sm">
                <strong>Moratorium Guidelines:</strong><br />
                {scheme.moratorium_note}
              </div>
            )}

            <div className="scheme-card-actions mt-lg">
              <button
                className="btn-primary"
                onClick={() => navigate('/questionnaire')}
              >
                Check My Eligibility For This Scheme →
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  navigate('/EMICalculator', {
                    state: {
                      principal: scheme.max_loan_amount,
                      rate: scheme.interest_rate,
                      years: scheme.max_repayment_years,
                    },
                  })
                }
              >
                Simulate Monthly EMI
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/partners', { state: { schemeCode: scheme.code } })}
              >
                Find Channel Partners
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
