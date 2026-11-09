import React from 'react';

const Privacy = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>🔒 Privacy Policy & Data Protection</h2>
        <p className="subtitle">
          How SchemeMatcher safeguards citizen privacy and ensures responsible information processing.
        </p>

        <div style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h3>1. Zero Sensitive Data Storage</h3>
          <p>
            SchemeMatcher does not collect or store sensitive personal identifiers such as biometric records, Aadhaar numbers, PAN cards, or banking passwords. Eligibility assessments and loan EMI simulations are executed statelessly or stored strictly in temporary in-browser session storage.
          </p>

          <h3 className="mt-md">2. Locality-Level Geographic Queries</h3>
          <p>
            When utilizing postal PIN code or proximity search, the platform uses postal circle centroids and public administrative boundary identifiers. We do not track continuous device GPS telemetry or store user travel histories.
          </p>

          <h3 className="mt-md">3. Voluntary Inquiries</h3>
          <p>
            Information provided voluntarily via the callback/assistance request form (e.g. phone number and district) is used exclusively for routing guidance to accredited public channel partners and academic project review.
          </p>

          <h3 className="mt-md">4. No Commercial Monetization or Advertising</h3>
          <p>
            This portal is an educational prototype developed for the Smart India Hackathon (SIH26092). It contains zero commercial advertisements, third-party tracking pixels, or monetization trackers.
          </p>

          <div className="alert alert-info mt-lg">
            For questions regarding privacy practices or to request deletion of any submitted callback request, contact the academic development desk via our Contact page.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
