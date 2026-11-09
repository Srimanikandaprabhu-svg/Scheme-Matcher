import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SchemeCompare = () => {
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
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <h2>⚖️ Scheme Comparison Matrix</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Compare concessional terms across all NSFDC financing programs for marginalized entrepreneurs.
            </p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => window.print()}>
            🖨️ Print Matrix
          </button>
        </div>

        {loading ? (
          <p className="mt-md">Loading scheme matrix...</p>
        ) : (
          <div className="table-responsive mt-lg">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature / Parameter</th>
                  {schemes.map((s) => (
                    <th key={s.id}>
                      <div style={{ fontSize: '1.05rem', color: '#0d47a1' }}>{s.code}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#555' }}>{s.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Maximum Loan Amount</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>₹{Number(s.max_loan_amount).toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Maximum Project Cost</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>₹{Number(s.max_project_cost).toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Interest Rate (p.a.)</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id} className="text-primary font-weight-bold">{s.interest_rate}%</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Max Repayment Period</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>{s.max_repayment_years} Years</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Moratorium Grace Period</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>{s.moratorium_months || 0} Months</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Financing Cap (% of Cost)</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>{s.loan_cap_percent}%</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Annual Family Income Limit</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>₹{Number(s.income_cap_inr || 500000).toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Target Purpose</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id} style={{ fontSize: '0.85rem' }}>{s.purpose}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Action</strong></td>
                  {schemes.map((s) => (
                    <td key={s.id}>
                      <button
                        className="btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => navigate(`/schemes/${s.code}`)}
                      >
                        View Details
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeCompare;
