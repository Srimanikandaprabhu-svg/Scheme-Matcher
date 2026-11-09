import React, { useState, useEffect } from 'react';

const Transparency = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transparency')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
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
            <span className="badge badge-accent">Phase 8 Open Governance</span>
            <h2 className="mt-sm">📊 Data Sources & Algorithmic Transparency</h2>
            <p className="subtitle" style={{ margin: '4px 0 0 0' }}>
              Complete provenance, licensing, dataset metrics, and ethics disclosures for the SchemeMatcher platform.
            </p>
          </div>
        </div>

        <div className="alert alert-info mt-md">
          <strong>Transparency Declaration:</strong> SchemeMatcher uses transparent, explainable deterministic algorithms. No black-box machine learning or proprietary models are used to determine citizen scheme eligibility.
        </div>

        {loading ? (
          <p className="mt-md">Loading transparency registry...</p>
        ) : (
          <div>
            <div className="datasets-grid mt-lg">
              {data?.datasets?.map((ds) => (
                <div key={ds.id} className="dataset-card" style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '16px', background: '#fff', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#0d47a1', margin: 0 }}>{ds.name}</h3>
                    <span className="badge badge-success">{ds.records_count} Records</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '8px' }}>
                    <strong>Official Title:</strong> {ds.official_title}
                  </p>

                  <div className="detail-row">
                    <span>Source:</span>
                    <strong>{ds.source}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Data Nature / Verification:</span>
                    <strong style={{ color: ds.nature.includes('Simulated') ? '#c62828' : '#2e7d32' }}>
                      {ds.nature}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>License:</span>
                    <strong>{ds.license}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Reference Period:</span>
                    <strong>{ds.reference_date}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Platform Purpose:</span>
                    <span style={{ fontSize: '0.85rem' }}>{ds.purpose}</span>
                  </div>

                  {ds.important_disclosure && (
                    <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '4px', padding: '8px 12px', marginTop: '10px', fontSize: '0.85rem', color: '#795548' }}>
                      <strong>Disclosure:</strong> {ds.important_disclosure}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Validation & Processing Metrics */}
            {data?.validation_report?.datasets && (
              <div className="section mt-xl">
                <h3>🛠️ Data Ingestion & Sanitization Metrics</h3>
                <div className="card mt-sm" style={{ background: '#f8fafc' }}>
                  <div className="grid-3">
                    <div className="metric-box">
                      <span className="metric-val">19,586</span>
                      <span className="metric-lbl">Clean Pincodes Processed</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-val">15,000</span>
                      <span className="metric-lbl">Domestic Bank Outlets Screened</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-val">19,312</span>
                      <span className="metric-lbl">Pincode Centroids Computed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card mt-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <h4 style={{ color: '#991b1b' }}>Ethical & Academic Disclosures</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#7f1d1d', marginTop: '8px', lineHeight: 1.6 }}>
                <li><strong>Student Prototype:</strong> This platform is a demonstration prototype developed for Smart India Hackathon (SIH26092) and is not an official portal of the Ministry of Social Justice or NSFDC.</li>
                <li><strong>Simulated Data:</strong> Channel partner NPA, overdue percentages, and fund utilization metrics are simulated benchmarks for algorithm evaluation.</li>
                <li><strong>Historical Census:</strong> Scheduled Caste demographic distributions represent the Census of India 2011 baseline.</li>
                <li><strong>No Commercial Use:</strong> All data access adheres to open government licenses and public welfare domain policies.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transparency;
