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
        <div className="card text-center">
          <h2>No matching results found</h2>
          <p>Please complete the eligibility questionnaire first.</p>
          <button className="btn-primary mt-md" onClick={() => navigate('/questionnaire')}>
            Start Questionnaire
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
          <h2>🎯 Scheme Matching Results</h2>
          <div className="header-actions">
            <button className="btn-secondary btn-sm" onClick={() => navigate('/questionnaire')}>
              ← Edit Answers
            </button>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/EMICalculator')}>
              🧮 EMI Calculator
            </button>
          </div>
        </div>

        {/* ELIGIBLE SCHEMES */}
        <div className="section mt-lg">
          <h3>
            ✅ Eligible Schemes ({eligible.length})
          </h3>
          {eligible.length === 0 ? (
            <div className="alert alert-warning">
              No schemes currently match all your parameters. Review the ineligible schemes below or try adjusting your loan amount or project cost.
            </div>
          ) : (
            <div className="schemes-grid mt-md">
              {eligible.map((item, idx) => (
                <div key={idx} className="scheme-card eligible-card">
                  <div className="scheme-card-header">
                    <h4>{item.scheme.name} ({item.scheme.code})</h4>
                    <span className="badge badge-success">Match Score: {item.score}/100</span>
                  </div>

                  <div className="scheme-details">
                    <div className="detail-row">
                      <span>Interest Rate:</span>
                      <strong>{item.scheme.interest_rate}% p.a.</strong>
                    </div>
                    <div className="detail-row">
                      <span>Max Loan Allowable for You:</span>
                      <strong>₹{Number(item.maxLoan).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Max Repayment Tenor:</span>
                      <strong>{item.scheme.max_repayment_years} Years</strong>
                    </div>
                    <div className="detail-row">
                      <span>Moratorium Period:</span>
                      <strong>{item.scheme.moratorium_months || 0} Months</strong>
                    </div>
                  </div>

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
                      Find Nearby Channel Partners
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
            <h3>❌ Ineligible Schemes ({ineligible.length})</h3>
            <p className="subtitle">These schemes could not be matched due to the following specific constraints:</p>
            <div className="schemes-grid mt-md">
              {ineligible.map((item, idx) => (
                <div key={idx} className="scheme-card ineligible-card">
                  <div className="scheme-card-header">
                    <h4>{item.scheme.name} ({item.scheme.code})</h4>
                    <span className="badge badge-danger">Not Eligible</span>
                  </div>
                  <ul className="reasons-list">
                    {item.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSISTANCE SECTION */}
        <div className="card assistance-box mt-xl">
          <h3>🤝 Need Personalized Guidance?</h3>
          <p>
            Our nodal channel partners (State Channelising Agencies & PSBs) can assist you in preparing documentation, project reports, and loan applications.
          </p>

          {assistanceSent ? (
            <div className="alert alert-success mt-md">
              ✅ Thank you! Your request has been recorded. A local representative or nodal agency will reach out to you.
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
                    placeholder="e.g. Need assistance with project cost estimation in Bangalore"
                    value={assistanceNote}
                    onChange={(e) => setAssistanceNote(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-sm" disabled={isSubmitting}>
                {isSubmitting ? 'Sending Request...' : 'Request Channel Partner Callback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
