import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', district: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📞 Contact & Grievance Guidance</h2>
        <p className="subtitle">
          Connect with state nodal representatives, submit inquiries, or request assistance for project documentation.
        </p>

        <div className="grid-2 mt-lg">
          <div>
            <h3>Submit an Inquiry / Callback Request</h3>
            {submitted ? (
              <div className="alert alert-success mt-md">
                ✅ Thank you! Your inquiry has been logged. An academic team member or district partner representative will respond.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-md">
                <div className="form-group">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group mt-sm">
                  <label htmlFor="phone">Mobile / WhatsApp Number:</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group mt-sm">
                  <label htmlFor="email">Email Address (Optional):</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group mt-sm">
                  <label htmlFor="district">District & State:</label>
                  <input
                    id="district"
                    type="text"
                    required
                    placeholder="e.g. Madurai, Tamil Nadu"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                <div className="form-group mt-sm">
                  <label htmlFor="msg">Your Requirement / Question:</label>
                  <textarea
                    id="msg"
                    rows="4"
                    required
                    placeholder="Describe your enterprise, preferred loan amount, or questions regarding documentation..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary mt-md" disabled={loading}>
                  {loading ? 'Submitting...' : 'Send Inquiry →'}
                </button>
              </form>
            )}
          </div>

          <div style={{ paddingLeft: '1rem', borderLeft: '1px solid #eee' }}>
            <h3>Nodal Channel Agencies</h3>
            <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px' }}>
              For formal loan submission and physical verification, contact your respective State Channelising Agency:
            </p>

            <div className="card mt-sm" style={{ background: '#f8fafc', padding: '14px' }}>
              <strong style={{ color: '#0d47a1' }}>National Scheduled Castes Finance and Development Corporation (NSFDC)</strong>
              <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0 0 0' }}>
                Scope Complex, Core-VIII, 1st & 2nd Floor, 7, Lodhi Road, New Delhi - 110 003<br />
                Toll Free Helpline: 1800 11 0244 | Website: nsfdc.nic.in
              </p>
            </div>

            <div className="card mt-sm" style={{ background: '#f8fafc', padding: '14px' }}>
              <strong style={{ color: '#0d47a1' }}>Academic Prototype Desk (SIH26092)</strong>
              <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0 0 0' }}>
                Developed for Smart India Hackathon 2026.<br />
                Student Development Team: SchemeMatcher Project Lab
              </p>
            </div>

            <div className="alert alert-warning mt-md" style={{ fontSize: '0.85rem' }}>
              <strong>Caution:</strong> NSFDC or its channel partners never ask for cash processing fees, OTPs, or upfront commissions. Report any fraudulent solicitations to your district magistrate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
