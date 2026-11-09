import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <span className="badge badge-accent">SIH26092</span>
        <h2 className="mt-sm">About SchemeMatcher</h2>
        <p className="subtitle">
          AI-Driven Scheme Matching Platform for Marginalized Entrepreneurs and Youth.
        </p>

        <div className="about-content" style={{ lineHeight: 1.8, fontSize: '0.98rem' }}>
          <h3>Problem Statement Background</h3>
          <p>
            Millions of aspiring Scheduled Caste (SC) entrepreneurs, artisans, and students in India qualify for concessional credit under schemes established by the National Scheduled Castes Finance and Development Corporation (NSFDC) and the Ministry of Social Justice and Empowerment. However, many remain underserved due to lack of awareness, difficulty identifying authorized channel partners, confusion over eligibility thresholds, and fear of high commercial interest rates.
          </p>

          <h3 className="mt-md">Our Mission</h3>
          <p>
            SchemeMatcher bridges this gap by deploying transparent, deterministic multi-factor matching algorithms and geospatial channel partner locator tools. By simply answering a few basic questions about project cost, annual family income, and required capital, citizens receive ranked recommendations with clear score explanations, loan financing limits, and proximity mapping to local bank branches and State Channelising Agencies.
          </p>

          <h3 className="mt-md">Core Architectural Pillars</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>Deterministic & Explainable Scoring:</strong> Eliminates algorithmic bias. Every recommendation displays exact score breakdowns based on interest rates, loan caps, moratorium periods, and tenor.</li>
            <li><strong>Geospatial Intelligence:</strong> Over 19,000 postal PIN codes and locality centroids enable citizens to locate accredited bank branches and SCAs without requiring invasive GPS device permissions.</li>
            <li><strong>Accessibility & Inclusivity:</strong> Multi-lingual support in English, Tamil, and Hindi, font size controls, and responsive design across desktop, tablet, and mobile browsers.</li>
            <li><strong>Complete Data Provenance:</strong> Uncompromising data governance with clear disclaimers distinguishing official scheme norms, historical Census 2011 statistics, and simulated algorithmic test data.</li>
          </ul>

          <div className="alert alert-info mt-lg">
            <strong>Academic Disclosure:</strong> SchemeMatcher is an academic student innovation developed for the Smart India Hackathon (SIH 2026). It is not an official portal of the Government of India or NSFDC.
          </div>

          <div className="mt-lg">
            <button className="btn-primary" onClick={() => navigate('/questionnaire')}>
              Experience the Scheme Matcher →
            </button>{' '}
            <button className="btn-secondary" onClick={() => navigate('/transparency')}>
              View Data Transparency Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
