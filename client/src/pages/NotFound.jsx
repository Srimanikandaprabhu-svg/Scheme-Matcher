import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '4rem', color: '#0d47a1', margin: 0 }}>404</h1>
        <h2 className="mt-sm">Page Not Found</h2>
        <p className="subtitle" style={{ maxWidth: '500px', margin: '0.8rem auto 1.5rem' }}>
          The welfare page or resource you requested could not be located. Please verify the URL or return to the main portal navigation.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/')}>
            ← Return to Home
          </button>
          <button className="btn-secondary" onClick={() => navigate('/questionnaire')}>
            Start Eligibility Check
          </button>
          <button className="btn-secondary" onClick={() => navigate('/schemes')}>
            Browse Schemes Catalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
