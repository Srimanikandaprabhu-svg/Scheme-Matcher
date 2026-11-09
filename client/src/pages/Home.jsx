import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ schemesCount: 5, partnersCount: 91, statesCount: 36 });

  useEffect(() => {
    // Attempt to load live counts from backend
    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStats((prev) => ({ ...prev, schemesCount: data.length }));
      })
      .catch(() => {});

    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStats((prev) => ({ ...prev, partnersCount: data.length }));
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
          <span className="badge badge-accent">National Welfare Portal</span>
          <h1 className="hero-title">AI‑Driven Scheme Matcher</h1>
          <p className="hero-description">
            Empowering Scheduled Caste entrepreneurs, youth, and artisans by matching your profile with subsidized government credit, educational loans, and microfinance schemes.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary btn-large" onClick={() => navigate('/questionnaire')}>
              🚀 Find Matching Schemes
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/EMICalculator')}>
              🧮 Loan EMI Calculator
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{stats.schemesCount}+</span>
          <span className="stat-label">Government Schemes</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">6.5%</span>
          <span className="stat-label">Concessional Rates From</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">{stats.partnersCount}+</span>
          <span className="stat-label">Channel Partners & Banks</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">{stats.statesCount}</span>
          <span className="stat-label">States & UTs Covered</span>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="container mt-xl">
        <h2 className="section-title text-center">Platform Capabilities</h2>
        <p className="section-subtitle text-center">
          Comprehensive tools to evaluate eligibility, estimate monthly payments, and locate implementation agencies.
        </p>

        <div className="features-grid mt-lg">
          <div className="feature-card" onClick={() => navigate('/questionnaire')}>
            <div className="feature-icon">🎯</div>
            <h3>Intelligent Eligibility Engine</h3>
            <p>
              Answer a few questions about your business or study requirements, project cost, and annual income to receive an instant, ranked list of applicable schemes.
            </p>
            <span className="card-link">Check Eligibility →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/EMICalculator')}>
            <div className="feature-icon">🧮</div>
            <h3>Financial EMI Calculator</h3>
            <p>
              Simulate monthly EMIs, moratorium benefits, and total interest obligations with customized interest rates and repayment tenors.
            </p>
            <span className="card-link">Calculate EMI →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/partners')}>
            <div className="feature-icon">📍</div>
            <h3>Channel Partner Locator</h3>
            <p>
              Locate nearby State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks authorized to disburse funds.
            </p>
            <span className="card-link">Explore Partners →</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/schemes')}>
            <div className="feature-icon">📜</div>
            <h3>Browse Schemes Catalog</h3>
            <p>
              Explore detailed parameters including Micro Finance Scheme (MFS), Term Loans (TL), Educational Loan Schemes (ELS), and Aajeevika Microfinance.
            </p>
            <span className="card-link">View Catalog →</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
