import React from 'react';

const Accessibility = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>♿ Accessibility Statement</h2>
        <p className="subtitle">
          Our commitment to digital accessibility, universal design, and WCAG-aligned standards.
        </p>

        <div style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h3>Universal Digital Inclusivity</h3>
          <p>
            SchemeMatcher is engineered to ensure that marginalized citizens, including persons with visual impairments, low literacy, or limited digital connectivity, can access critical welfare scheme information easily.
          </p>

          <h3 className="mt-md">Implemented Accessibility Features</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>Multi-Lingual Interface:</strong> Seamless one-click toggling between English, Tamil (தமிழ்), and Hindi (हिन्दी).</li>
            <li><strong>Text Sizing Controls:</strong> Dynamic font size buttons (A- / A / A+) allowing citizens to enlarge typography without breaking UI layouts.</li>
            <li><strong>Keyboard Navigation & Focus Indicators:</strong> High-contrast focus rings for full navigation via keyboard (Tab, Shift+Tab, Enter, Space).</li>
            <li><strong>Semantic HTML5 Structure:</strong> Proper landmark tags (`&lt;header&gt;`, `&lt;main&gt;`, `&lt;nav&gt;`, `&lt;footer&gt;`, `&lt;section&gt;`) for screen readers.</li>
            <li><strong>Accessible Color Contrast:</strong> Deep blue (#0d47a1) and dark text (#212529) providing strong contrast ratios against white and neutral surfaces.</li>
            <li><strong>Non-Map List Fallback:</strong> Full list-based directory alternative for users whose devices do not support WebGL or Leaflet map tiles.</li>
            <li><strong>Print-Friendly Styles:</strong> Clean, uncluttered layouts when printing scheme comparison matrices or document checklists.</li>
          </ul>

          <div className="alert alert-info mt-lg">
            We continuously refine our accessibility implementations. Feedback regarding screen-reader compatibility or visual clarity can be shared via our Contact page.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
