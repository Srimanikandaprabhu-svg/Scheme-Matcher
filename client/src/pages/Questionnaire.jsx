import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');

  const [income, setIncome] = useState('300000');
  const [projectCost, setProjectCost] = useState('200000');
  const [loanAmount, setLoanAmount] = useState('150000');
  const [purpose, setPurpose] = useState('business');
  const [category, setCategory] = useState('SC');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStates(data);
      })
      .catch((err) => console.error('Failed to load states:', err));
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }
    fetch(`/api/districts?state_id=${selectedState}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch((err) => console.error('Failed to load districts:', err));
  }, [selectedState]);

  // Handle PIN code lookup to automatically set state and district
  const handlePincodeBlur = async () => {
    const pin = pincode.trim();
    if (pin.length === 6 && !isNaN(Number(pin))) {
      try {
        const res = await fetch(`/api/pincode/${pin}`);
        if (res.ok) {
          const pinData = await res.json();
          setPincodeMsg(`✓ Located in ${pinData.district}, ${pinData.state}`);
          // Find state in dropdown
          const matchedState = states.find(
            (s) => s.name.toLowerCase() === pinData.state.toLowerCase()
          );
          if (matchedState) {
            setSelectedState(matchedState.id);
          }
        } else {
          setPincodeMsg('PIN code not found in postal directory.');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setPincodeMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      income: Number(income),
      projectCost: Number(projectCost),
      loanAmount: Number(loanAmount),
      purpose: purpose,
      category: category,
      state_id: selectedState || null,
      district_id: selectedDistrict || null,
      pincode: pincode.trim() || null,
    };

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      sessionStorage.setItem('matchResult', JSON.stringify(result));
      sessionStorage.setItem('lastQuery', JSON.stringify(payload));
      navigate('/result');
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setError('Failed to evaluate schemes. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <span className="badge badge-accent">Interactive Multi-Factor Assessment</span>
            <h2 className="mt-sm">📋 Scheme Eligibility & Recommendation Questionnaire</h2>
            <p className="subtitle" style={{ margin: '4px 0 0 0' }}>
              Step {step} of 3 – Answer key parameters to discover subsidized NSFDC credit programs.
            </p>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="wizard-progress mt-md" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: step >= 1 ? '#1565c0' : '#e0e0e0' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: step >= 2 ? '#1565c0' : '#e0e0e0' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: step >= 3 ? '#1565c0' : '#e0e0e0' }} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: DEMOGRAPHICS & LOCATION */}
          {step === 1 && (
            <div className="form-step">
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>Step 1: Location & Beneficiary Category</h3>

              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="pincode">Postal PIN Code (Optional):</label>
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    onBlur={handlePincodeBlur}
                  />
                  {pincodeMsg && (
                    <span className="helper-text" style={{ color: pincodeMsg.startsWith('✓') ? '#2e7d32' : '#c62828' }}>
                      {pincodeMsg}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State / Union Territory:</label>
                  <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="">Select State</option>
                    {states.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="district">District:</label>
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-md">
                <label htmlFor="category">Target Category / Community:</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="SC">Scheduled Caste (SC) Beneficiary</option>
                  <option value="SafaiKaramchari">Safai Karamchari / Sanitation Worker & Dependents</option>
                  <option value="DifferentlyAbled">SC Differently Abled Entrepreneur</option>
                </select>
                <span className="helper-text">
                  Schemes are funded under the National Scheduled Castes Finance & Development Corporation (NSFDC).
                </span>
              </div>

              <div className="form-actions mt-lg" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                  Next Step: Financial Profile →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIAL CAPABILITY & PROJECT BUDGET */}
          {step === 2 && (
            <div className="form-step">
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>Step 2: Financial Profile & Project Budget</h3>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="income">Annual Family Income (₹):</label>
                  <input
                    id="income"
                    type="number"
                    min="0"
                    step="10000"
                    required
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                  <span className="helper-text">
                    Current family income: ₹{Number(income || 0).toLocaleString('en-IN')} (NSFDC ceiling: ₹5,00,000 / year)
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="projectCost">Total Estimated Project / Course Cost (₹):</label>
                  <input
                    id="projectCost"
                    type="number"
                    min="10000"
                    step="10000"
                    required
                    value={projectCost}
                    onChange={(e) => setProjectCost(e.target.value)}
                  />
                  <span className="helper-text">
                    Total capital required for machinery, stock, or university course fee.
                  </span>
                </div>
              </div>

              <div className="form-actions mt-lg" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                  ← Back to Location
                </button>
                <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                  Next Step: Loan & Purpose →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOAN AMOUNT & PURPOSE */}
          {step === 3 && (
            <div className="form-step">
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>Step 3: Loan Requirement & Primary Objective</h3>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="loanAmount">Desired Concessional Loan Amount (₹):</label>
                  <input
                    id="loanAmount"
                    type="number"
                    min="5000"
                    step="5000"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                  <span className="helper-text">
                    Requested: ₹{Number(loanAmount || 0).toLocaleString('en-IN')} (NSFDC schemes fund up to 90% of cost)
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="purpose">Intended Enterprise Sector / Purpose:</label>
                  <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                    <option value="business">Commercial Business / Trade / Industry / Services</option>
                    <option value="microfinance">Small Microenterprise / Retail Stall / Microfinance</option>
                    <option value="education">Higher Professional Education (Domestic or Abroad)</option>
                    <option value="agriculture">Agriculture, Dairy, Poultry & Allied Activities</option>
                    <option value="sanitation">Sanitation, Cleanliness & Waste Handling Equipment</option>
                    <option value="all">Any / Multi-Sector Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="form-actions mt-lg" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                  ← Back to Financials
                </button>
                <button type="submit" className="btn-primary btn-large" disabled={loading}>
                  {loading ? 'Evaluating Schemes...' : 'Find Matching Schemes →'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
