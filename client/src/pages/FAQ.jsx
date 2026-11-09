import React, { useState } from 'react';

const FAQS = [
  {
    q: 'What is the annual family income ceiling to qualify for NSFDC schemes?',
    a: 'Under standard NSFDC guidelines, the annual family income limit is ₹5,00,000 for both rural and urban areas. Applicants with family income up to this ceiling are eligible for concessional financial assistance.',
  },
  {
    q: 'What are the interest rates charged on NSFDC loans?',
    a: 'NSFDC loans feature highly subsidized, concessional interest rates. For instance, Micro Finance Scheme (MFS) and Educational Loan Scheme (ELS) carry a nominal rate of 6.5% p.a., while Term Loans (TL) are available at 8.0% p.a.',
  },
  {
    q: 'Is collateral security required for small loans?',
    a: 'For microfinance and small loans (typically up to ₹1,25,000 to ₹1,60,000), channel partners usually do not insist on collateral security, relying instead on personal hypothecation of assets created from the loan and SHG/JLG group guarantees. For higher-value term loans, security requirements are governed by RBI and channel partner lending guidelines.',
  },
  {
    q: 'What is a repayment moratorium and how does it benefit me?',
    a: 'A moratorium (repayment holiday) allows borrowers to pause principal installment repayments during the gestation phase of their business or while completing education. For example, Term Loans offer a 6 to 12-month moratorium, while Education Loans provide a moratorium for the entire course duration plus up to one year.',
  },
  {
    q: 'Can I apply for an NSFDC loan online directly on this portal?',
    a: 'SchemeMatcher is a public advisory, matching, and estimation engine. NSFDC distributes funds through accredited institutional channel partners (State Channelising Agencies, Public Sector Banks, and Regional Rural Banks). You can use our Partner Locator to find your district SCA office or bank branch to submit your formal application.',
  },
  {
    q: 'Which documents are indispensable for starting my loan application?',
    a: 'The core mandatory documents are: 1) Scheduled Caste (SC) Community Certificate from a competent revenue authority, 2) Annual Family Income Certificate, 3) Aadhaar Card, 4) Bank Passbook, and 5) Project cost estimate or machinery quotation.',
  },
  {
    q: 'Does SchemeMatcher store my sensitive personal data?',
    a: 'No. SchemeMatcher performs in-browser and stateless API evaluations. We do not store citizen identification numbers, PAN details, or banking credentials.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>❓ Frequently Asked Questions (FAQ)</h2>
        <p className="subtitle">
          Authoritative answers to common questions regarding NSFDC welfare credit, eligibility, and procedures.
        </p>

        <div className="faq-list mt-lg">
          {FAQS.map((item, idx) => (
            <div
              key={idx}
              className="faq-item"
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '12px',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: openIdx === idx ? '#e3f2fd' : '#ffffff',
                  color: openIdx === idx ? '#0d47a1' : '#212121',
                  padding: '14px 18px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>{item.q}</span>
                <span style={{ fontSize: '1.2rem' }}>{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div style={{ padding: '14px 18px', background: '#fafafa', fontSize: '0.95rem', color: '#444', lineHeight: 1.6, borderTop: '1px solid #e0e0e0' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="alert alert-info mt-xl">
          <strong>Have an unlisted question?</strong> Visit our <a href="/assistant">Scheme Knowledge Assistant</a> for instant interactive answers based on official scheme rules.
        </div>
      </div>
    </div>
  );
};

export default FAQ;
