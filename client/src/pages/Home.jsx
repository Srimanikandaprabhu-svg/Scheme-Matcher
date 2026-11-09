import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ schemesCount: 5, partnersCount: 91, statesCount: 36 });

  useEffect(() => {
    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStats((prev) => ({ ...prev, schemesCount: data.length }));
      })
      .catch(() => {});

    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total) setStats((prev) => ({ ...prev, partnersCount: data.total }));
      })
      .catch(() => {});

    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStats((prev) => ({ ...prev, statesCount: data.length }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge badge-accent" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}>
            {t('heroBadge')}
          </span>
          <h1 className="hero-title">{t('heroTitle')}</h1>
          <p className="hero-description">{t('heroSubtitle')}</p>

          <div className="hero-cta-group">
            <button className="btn-primary btn-large" onClick={() => navigate('/questionnaire')}>
              {t('btnFindScheme')}
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/EMICalculator')}>
              {t('btnCalculator')}
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/partners')}>
              {t('btnLocatePartners')}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{stats.schemesCount}</span>
          <span className="stat-label">{t('statSchemes')}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">6.5%</span>
          <span className="stat-label">{t('statConcession')}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">{stats.partnersCount}+</span>
          <span className="stat-label">{t('statPartners')}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">{stats.statesCount}</span>
          <span className="stat-label">{t('statCoverage')}</span>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="container mt-xl">
        <h2 className="section-title text-center">Comprehensive Public Service Tools</h2>
        <p className="section-subtitle text-center">
          Evaluate eligibility, calculate repayments, locate regional partners, and generate documentation.
        </p>

        <div className="features-grid mt-lg">
          <div className="feature-card" onClick={() => navigate('/questionnaire')}>
            <div className="feature-icon">🎯</div>
            <h3>Intelligent Scheme Matching</h3>
            <p>
              Complete a 3-step assessment of your income, project budget, and loan requirements to receive ranked, explainable recommendations.
            </p>
            <span className="card-link">Check Eligibility →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/compare')}>
            <div className="feature-icon">⚖️</div>
            <h3>Scheme Comparison Matrix</h3>
            <p>
              Compare interest rates, financing caps, moratorium periods, and tenor terms across all 5 NSFDC credit programs side-by-side.
            </p>
            <span className="card-link">Compare Schemes →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/EMICalculator')}>
            <div className="feature-icon">🧮</div>
            <h3>Financial & Moratorium Calculator</h3>
            <p>
              Simulate monthly EMIs with grace periods, view total interest amortization, and inspect month-by-month repayment schedules.
            </p>
            <span className="card-link">Simulate Loan EMI →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/partners')}>
            <div className="feature-icon">📍</div>
            <h3>Geospatial Partner Locator</h3>
            <p>
              Interactive Leaflet map powered by over 19,000 PIN codes to locate nearby State Channelising Agencies (SCAs) and banks.
            </p>
            <span className="card-link">Find Nearest Branches →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/documents')}>
            <div className="feature-icon">📑</div>
            <h3>Document Checklist Generator</h3>
            <p>
              Generate an interactive, printable checklist of required certificates and project reports for business or education loans.
            </p>
            <span className="card-link">Generate Checklist →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/assistant')}>
            <div className="feature-icon">💬</div>
            <h3>Scheme Knowledge Assistant</h3>
            <p>
              Ask questions about lending norms, interest concessions, documents, and application steps answered with verified policy facts.
            </p>
            <span className="card-link">Chat with Assistant →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/guide')}>
            <div className="feature-icon">📘</div>
            <h3>Citizen Application Roadmap</h3>
            <p>
              Step-by-step guidance on self-assessment, document preparation, approaching channel partners, and loan sanctioning.
            </p>
            <span className="card-link">Read Application Guide →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/transparency')}>
            <div className="feature-icon">📊</div>
            <h3>Data Transparency Registry</h3>
            <p>
              Complete provenance, license terms, dataset metrics, and ethical disclosures regarding simulated and historical baseline data.
            </p>
            <span className="card-link">Review Transparency →</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
