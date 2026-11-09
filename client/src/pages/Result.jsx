import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [assistanceSent, setAssistanceSent] = useState(false);
  const [assistanceNote, setAssistanceNote] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('matchResult');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse matchResult', e);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
          <h2>No matching evaluation available</h2>
          <p className="subtitle">Please complete the eligibility questionnaire to evaluate tailored schemes.</p>
          <button className="btn-primary mt-md" onClick={() => navigate('/questionnaire')}>
            Start Questionnaire →
          </button>
        </div>
      </div>
    );
  }

  const { eligible = [], ineligible = [] } = data;

  const handleEMIJump = (scheme, maxLoan) => {
    navigate('/EMICalculator', {
      state: {
        principal: maxLoan,
        rate: scheme.interest_rate,
        years: scheme.max_repayment_years,
        moratorium: scheme.moratorium_months || 0,
      },
    });
  };

  const handleAssistanceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const lastQuery = sessionStorage.getItem('lastQuery');
      const payload = {
        contact: contactPhone,
        notes: assistanceNote,
        queryData: lastQuery ? JSON.parse(lastQuery) : {},
      };
      const res = await fetch('/api/assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setAssistanceSent(true);
      }
    } catch (err) {
      console.error('Error submitting assistance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <span className="badge badge-accent">Transparent Recommendation Engine</span>
            <h2 className="mt-sm">🎯 Scheme Evaluation & Matching Results</h2>
            <p className="subtitle" style={{ margin: '4px 0 0 0' }}>
              Deterministic eligibility results ranked by multi-factor weighted scoring.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary btn-sm" onClick={() => navigate('/questionnaire')}>
              ← Edit Answers
            </button>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/compare')}>
              ⚖️ Compare All Schemes
            </button>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/EMICalculator')}>
              🧮 EMI Calculator
            </button>
          </div>
        </div>

        {/* ELIGIBLE SCHEMES */}
        <div className="section mt-lg">
          <h3 style={{ color: '#2e7d32' }}>
            ✅ Eligible Schemes Ranked by Fit ({eligible.length})
          </h3>
          {eligible.length === 0 ? (
            <div className="alert alert-warning mt-sm">
              No schemes currently match all constraints. Review the ineligible schemes below to understand which parameters exceeded scheme ceilings.
            </div>
          ) : (
            <div className="schemes-grid mt-md">
              {eligible.map((item, idx) => (
                <div key={idx} className="scheme-card eligible-card" style={{ borderLeft: '4px solid #2e7d32' }}>
                  <div className="scheme-card-header">
                    <div>
                      <h4>{item.scheme.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>Code: {item.scheme.code}</span>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>
                      Fit Score: {item.score} / 100
                    </span>
                  </div>

                  <div className="scheme-details">
                    <div className="detail-row">
                      <span>Concessional Rate:</span>
                      <strong className="text-primary">{item.scheme.interest_rate}% p.a.</strong>
                    </div>
                    <div className="detail-row">
                      <span>Max Loan Permissible:</span>
                      <strong>₹{Number(item.maxLoan).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Repayment Tenor:</span>
                      <strong>{item.scheme.max_repayment_years} Years</strong>
                    </div>
                    <div className="detail-row">
                      <span>Moratorium Grace:</span>
                      <strong>{item.scheme.moratorium_months || 0} Months</strong>
                    </div>
                  </div>

                  {/* Explainable Score Breakdown */}
                  {item.scoreBreakdown && item.scoreBreakdown.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', margin: '10px 0', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#0d47a1', display: 'block', marginBottom: '4px' }}>
                        📊 Explainable Score Breakdown:
                      </strong>
                      {item.scoreBreakdown.map((f, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                          <span style={{ color: '#555' }}>{f.factor}:</span>
                          <span><strong>{f.points}</strong>/{f.maxPoints} pts</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="scheme-card-actions mt-md">
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => handleEMIJump(item.scheme, item.maxLoan)}
                    >
                      Calculate Monthly EMI →
                    </button>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => navigate('/partners', { state: { schemeCode: item.scheme.code } })}
                    >
                      Locate Channel Partners
                    </button>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => navigate(`/schemes/${item.scheme.code}`)}
                    >
                      Scheme Guidelines
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INELIGIBLE SCHEMES */}
        {ineligible.length > 0 && (
          <div className="section mt-xl">
            <h3 style={{ color: '#c62828' }}>❌ Ineligible Schemes ({ineligible.length})</h3>
            <p className="subtitle" style={{ margin: '4px 0 12px 0' }}>
              These schemes do not match your current parameters due to specific policy criteria:
            </p>
            <div className="schemes-grid">
              {ineligible.map((item, idx) => (
                <div key={idx} className="scheme-card ineligible-card" style={{ borderLeft: '4px solid #c62828' }}>
                  <div className="scheme-card-header">
                    <h4>{item.scheme.name} ({item.scheme.code})</h4>
                    <span className="badge badge-danger">Score: 0 (Ineligible)</span>
                  </div>
                  <ul className="reasons-list" style={{ marginTop: '8px' }}>
                    {item.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSISTANCE CALLBACK BOX */}
        <div className="card assistance-box mt-xl" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <h3>🤝 Request Nodal Partner Guidance</h3>
          <p style={{ fontSize: '0.92rem', color: '#555' }}>
            Need help preparing a project report or obtaining income/caste certificates? Submit your contact details below to log a callback request with local channel agencies.
          </p>

          {assistanceSent ? (
            <div className="alert alert-success mt-md">
              ✅ Thank you! Your guidance request has been logged. An academic nodal coordinator will contact you.
            </div>
          ) : (
            <form onSubmit={handleAssistanceSubmit} className="mt-md">
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="contactPhone">Your Phone Number / WhatsApp:</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="assistanceNote">Specific Questions / Requirements:</label>
                  <input
                    id="assistanceNote"
                    type="text"
                    placeholder="e.g. Need assistance with project estimate or bank branch submission"
                    value={assistanceNote}
                    onChange={(e) => setAssistanceNote(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-sm" disabled={isSubmitting}>
                {isSubmitting ? 'Sending Request...' : 'Log Partner Guidance Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
