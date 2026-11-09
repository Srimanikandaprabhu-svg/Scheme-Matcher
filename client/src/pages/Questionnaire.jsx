import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [income, setIncome] = useState('300000');
  const [projectCost, setProjectCost] = useState('200000');
  const [loanAmount, setLoanAmount] = useState('150000');
  const [purpose, setPurpose] = useState('business');
  const [category, setCategory] = useState('SC');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load states on mount
  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStates(data);
      })
      .catch((err) => console.error('Failed to load states:', err));
  }, []);

  // Load districts when state changes
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      income: Number(income),
      projectCost: Number(projectCost),
      loanAmount: Number(loanAmount),
      purpose: purpose,
      state_id: selectedState || null,
      district_id: selectedDistrict || null,
      category: category,
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
        <h2>📋 Eligibility & Scheme Matching Questionnaire</h2>
        <p className="subtitle">
          Fill in your details below to get instantly matched with concessional government schemes tailored for Scheduled Caste entrepreneurs, students, and artisans.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="questionnaire-form">
          <div className="form-section">
            <h3>1. Location & Demographics</h3>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="state">State / UT:</label>
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

            <div className="form-group mt-sm">
              <label htmlFor="category">Target Category:</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="SafaiKaramchari">Safai Karamchari / Sanitation Worker</option>
                <option value="DifferentlyAbled">SC Differently Abled</option>
              </select>
            </div>
          </div>

          <div className="form-section mt-md">
            <h3>2. Financial & Project Details</h3>
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
                <span className="helper-text">NSFDC schemes eligibility cap is ₹5,00,000 / year</span>
              </div>

              <div className="form-group">
                <label htmlFor="projectCost">Estimated Project / Course Cost (₹):</label>
                <input
                  id="projectCost"
                  type="number"
                  min="10000"
                  step="10000"
                  required
                  value={projectCost}
                  onChange={(e) => setProjectCost(e.target.value)}
                />
                <span className="helper-text">Total equipment, fee, or setup expenditure</span>
              </div>
            </div>

            <div className="grid-2 mt-sm">
              <div className="form-group">
                <label htmlFor="loanAmount">Desired Loan Amount (₹):</label>
                <input
                  id="loanAmount"
                  type="number"
                  min="5000"
                  step="5000"
                  required
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
                <span className="helper-text">Most schemes finance up to 90% of the project cost</span>
              </div>

              <div className="form-group">
                <label htmlFor="purpose">Primary Purpose / Activity:</label>
                <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option value="business">Business / Trade / Services</option>
                  <option value="microfinance">Small Business / Microfinance</option>
                  <option value="education">Higher Education (Domestic or Abroad)</option>
                  <option value="agriculture">Agriculture / Allied Activities</option>
                  <option value="sanitation">Sanitation / Cleanliness Equipment</option>
                  <option value="all">Any / General Purpose</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions mt-lg">
            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? 'Evaluating Schemes...' : 'Find Matching Schemes →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
