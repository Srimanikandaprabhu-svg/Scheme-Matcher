import React, { useState } from 'react';

const DocumentChecklist = () => {
  const [schemeType, setSchemeType] = useState('business');
  const [checkedDocs, setCheckedDocs] = useState({});

  const documentRules = {
    business: {
      mandatory: [
        { id: 'caste', name: 'Scheduled Caste (SC) Caste Certificate', authority: 'Competent Revenue Authority (Tahsildar / SDM / District Magistrate)' },
        { id: 'income', name: 'Annual Family Income Certificate (< ₹5,00,000)', authority: 'Revenue Authority / Employer Form 16 / ITR' },
        { id: 'aadhaar', name: 'Aadhaar Card (UIDAI Verified)', authority: 'Government of India' },
        { id: 'residence', name: 'Proof of Residence (Voter ID / Ration Card / Electricity Bill)', authority: 'State Government Utility' },
        { id: 'project_report', name: 'Detailed Project Report (DPR) / Cost Estimate', authority: 'Self-Prepared or District Industries Centre (DIC)' },
        { id: 'quotation', name: 'Proforma Invoice / Machinery Quotation', authority: 'Authorized Equipment Vendor / Supplier' },
        { id: 'bank_passbook', name: 'Bank Account Passbook / Cancelled Cheque', authority: 'Scheduled Commercial / Regional Rural Bank' },
      ],
      optional: [
        { id: 'udyam', name: 'Udyam MSME Registration Certificate', authority: 'Ministry of MSME' },
        { id: 'training', name: 'Skill Training Certificate (EDP / ITI / Skill India)', authority: 'NSDC / Government Training Institute' },
        { id: 'pan', name: 'PAN Card', authority: 'Income Tax Department' },
      ],
    },
    microfinance: {
      mandatory: [
        { id: 'caste', name: 'SC Caste Certificate / Community Proof', authority: 'Tahsildar or SDM' },
        { id: 'income', name: 'Self-Declaration / Income Proof (< ₹5,00,000)', authority: 'Revenue Authority / Self-Help Group (SHG) Attestation' },
        { id: 'aadhaar', name: 'Aadhaar Card with linked Mobile Number', authority: 'UIDAI' },
        { id: 'bank_passbook', name: 'Savings Bank Account Details', authority: 'Bank / Microfinance Institution' },
      ],
      optional: [
        { id: 'shg', name: 'SHG / Joint Liability Group (JLG) Membership Proof', authority: 'NRLM / Channel Partner' },
        { id: 'ration', name: 'Ration Card (BPL/AAY Card if applicable)', authority: 'Department of Food & Civil Supplies' },
      ],
    },
    education: {
      mandatory: [
        { id: 'caste', name: 'SC Community Certificate', authority: 'Competent Revenue Officer' },
        { id: 'income', name: 'Family Income Certificate (< ₹5,00,000)', authority: 'Tahsildar / Competent Authority' },
        { id: 'aadhaar', name: 'Student & Co-Applicant Aadhaar Cards', authority: 'UIDAI' },
        { id: 'admission', name: 'Admission Confirmation Letter / Entrance Scorecard', authority: 'Recognized College / University' },
        { id: 'fee_schedule', name: 'Official Institutional Fee Schedule', authority: 'Educational Institution Registrar' },
        { id: 'marksheets', name: '10th, 12th & Degree Marksheets', authority: 'Recognized Education Board / University' },
        { id: 'coapplicant', name: 'Co-Obligant / Parent Guarantor KYC Documents', authority: 'Parent / Legal Guardian' },
      ],
      optional: [
        { id: 'visa', name: 'Passport & Student Visa (For Studies Abroad)', authority: 'Passport Seva / Foreign Embassy' },
        { id: 'scholarship', name: 'Scholarship / Fee Waiver Award Letter', authority: 'Sponsoring Body' },
      ],
    },
  };

  const currentDocs = documentRules[schemeType] || documentRules.business;

  const toggleCheck = (id) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalMandatory = currentDocs.mandatory.length;
  const checkedMandatory = currentDocs.mandatory.filter((d) => checkedDocs[d.id]).length;
  const progressPercent = Math.round((checkedMandatory / totalMandatory) * 100);

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <h2>📑 Indicative Document Checklist Generator</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Assemble the required documentation for swift appraisal by State Channelising Agencies (SCAs) and banks.
            </p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => window.print()}>
            🖨️ Print Checklist
          </button>
        </div>

        {/* Scheme Type Selector Tabs */}
        <div className="tab-buttons mt-md">
          <button
            type="button"
            className={schemeType === 'business' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
            onClick={() => setSchemeType('business')}
          >
            🏢 Business & Term Loans (TL / UNY)
          </button>
          <button
            type="button"
            className={schemeType === 'microfinance' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
            onClick={() => setSchemeType('microfinance')}
          >
            🌱 Microfinance (MFS / AMY)
          </button>
          <button
            type="button"
            className={schemeType === 'education' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
            onClick={() => setSchemeType('education')}
          >
            🎓 Educational Loan Scheme (ELS)
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="readiness-bar mt-md" style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600 }}>Application Readiness:</span>
            <span style={{ fontWeight: 700, color: progressPercent === 100 ? '#2e7d32' : '#1565c0' }}>
              {checkedMandatory} of {totalMandatory} Mandatory Documents Ready ({progressPercent}%)
            </span>
          </div>
          <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: progressPercent === 100 ? '#2e7d32' : '#1565c0',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Mandatory Documents */}
        <div className="section mt-lg">
          <h3 style={{ color: '#0d47a1' }}>Mandatory Verification Documents</h3>
          <div className="checklist-items mt-sm">
            {currentDocs.mandatory.map((doc) => (
              <label key={doc.id} className="checklist-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', marginTop: '3px' }}
                  checked={!!checkedDocs[doc.id]}
                  onChange={() => toggleCheck(doc.id)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Issuing Authority: {doc.authority}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Optional Documents */}
        <div className="section mt-md">
          <h3 style={{ color: '#555' }}>Recommended Supporting Documents</h3>
          <div className="checklist-items mt-sm">
            {currentDocs.optional.map((doc) => (
              <label key={doc.id} className="checklist-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', marginTop: '3px' }}
                  checked={!!checkedDocs[doc.id]}
                  onChange={() => toggleCheck(doc.id)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Issuing Authority: {doc.authority}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="alert alert-warning mt-lg">
          <strong>Important Citizen Notice:</strong> This checklist is indicative. Final document specifications, stamp paper requirements, and notary attestations must be confirmed with your local State Channelising Agency (SCA) or participating bank branch.
        </div>
      </div>
    </div>
  );
};

export default DocumentChecklist;
