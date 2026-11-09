import React from 'react';

const Disclaimer = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>⚖️ Legal Terms & Academic Prototype Disclaimer</h2>
        <p className="subtitle">
          Important disclosures governing the usage of the SchemeMatcher platform.
        </p>

        <div style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
          <div className="alert alert-warning">
            <strong>CRITICAL NOTICE:</strong> SchemeMatcher is a student prototype developed strictly for academic evaluation at the Smart India Hackathon (SIH26092). It is NOT an official portal of the Government of India, the Ministry of Social Justice and Empowerment, or NSFDC.
          </div>

          <h3>1. Non-Official Status</h3>
          <p>
            This website does not issue sanctions, disburse loans, or guarantee loan approval. Sanctioning power resides exclusively with designated State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks following due appraisal.
          </p>

          <h3 className="mt-md">2. Simulated Data Disclosures</h3>
          <p>
            Certain performance indicators (such as Channel Partner NPA levels, overdue rates, and fund utilization metrics) are simulated synthetic values provided for algorithm design and testing. They must not be interpreted as audited financial statements of any banking institution.
          </p>

          <h3 className="mt-md">3. Historical Census Data</h3>
          <p>
            Demographic statistics and caste distribution benchmarks reference the Census of India 2011 baseline. Current demographic totals may differ.
          </p>

          <h3 className="mt-md">4. Verification Obligation</h3>
          <p>
            While every effort has been made to reflect official NSFDC guidelines accurately, policy terms, interest rates, and loan caps are subject to periodic administrative circulars. Borrowers must confirm all terms with their local channel partner prior to executing formal financial contracts.
          </p>

          <h3 className="mt-md">5. Limitation of Liability</h3>
          <p>
            The student developers, mentors, and academic institution assume no liability for financial decisions, third-party disputes, or procedural changes enacted by lending institutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
