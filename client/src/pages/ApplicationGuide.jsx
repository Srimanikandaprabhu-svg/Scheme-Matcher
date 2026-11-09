import React from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationGuide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '1',
      title: 'Self-Assessment & Scheme Matching',
      desc: 'Use the SchemeMatcher interactive questionnaire to evaluate your family income, target project cost, and required loan. Review your personalized match scores and maximum financing cap.',
      action: 'Start Matching Questionnaire',
      link: '/questionnaire',
    },
    {
      step: '2',
      title: 'Document Assembly & Preparation',
      desc: 'Prepare essential certificates: Scheduled Caste (SC) Community Certificate from the Tahsildar/SDM, Family Income Certificate (< ₹5,00,000), Aadhaar, Bank Passbook, and quotation/project estimate.',
      action: 'View Document Checklist',
      link: '/documents',
    },
    {
      step: '3',
      title: 'Identify Your Channel Partner',
      desc: 'NSFDC does not accept applications directly at head office. Applications must be submitted through your State Channelising Agency (SCA), designated Public Sector Bank (PSB), or Regional Rural Bank (RRB).',
      action: 'Locate Nearby Channel Partners',
      link: '/partners',
    },
    {
      step: '4',
      title: 'Application Submission & Preliminary Scrutiny',
      desc: 'Submit the completed application form along with self-attested documents to the district/zonal office of the SCA or bank branch. Receive an acknowledgment slip with your application tracking number.',
    },
    {
      step: '5',
      title: 'Appraisal, Sanction & Moratorium',
      desc: 'The channel partner assesses project feasibility. Upon approval, sanction letters are issued and funds are disbursed directly into your bank account or machinery vendor account. Enjoy moratorium grace period before principal repayments begin.',
    },
    {
      step: '6',
      title: 'Timely Repayment & Future Credit Escalation',
      desc: 'Make regular monthly or quarterly repayments via your channel partner. Maintaining a spotless repayment history qualifies you for higher-tier credit programs and technology upgradation loans.',
      action: 'Simulate Repayment in EMI Calculator',
      link: '/EMICalculator',
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <h2>📘 Public Service Application Roadmap</h2>
        <p className="subtitle">
          Official procedure for marginalized entrepreneurs and students to access concessional NSFDC credit facilities.
        </p>

        <div className="steps-container mt-lg">
          {steps.map((s, idx) => (
            <div key={idx} className="step-card">
              <div className="step-badge">{s.step}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {s.action && (
                  <button
                    className="btn-primary btn-sm mt-sm"
                    onClick={() => navigate(s.link)}
                  >
                    {s.action} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="alert alert-info mt-xl">
          <strong>Need Assistance or Clarification?</strong><br />
          If you encounter issues locating your nodal agency or need guidance on preparing a project report, visit our{' '}
          <a href="/assistant">Scheme Knowledge Assistant</a> or use the callback request form on the results page.
        </div>
      </div>
    </div>
  );
};

export default ApplicationGuide;
