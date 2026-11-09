import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';

import Home from './pages/Home.jsx';
import Schemes from './pages/Schemes.jsx';
import SchemeDetails from './pages/SchemeDetails.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Result from './pages/Result.jsx';
import SchemeCompare from './pages/SchemeCompare.jsx';
import EMICalculator from './pages/EMICalculator.jsx';
import Partners from './pages/Partners.jsx';
import ApplicationGuide from './pages/ApplicationGuide.jsx';
import DocumentChecklist from './pages/DocumentChecklist.jsx';
import Assistant from './pages/Assistant.jsx';
import Transparency from './pages/Transparency.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Accessibility from './pages/Accessibility.jsx';
import Disclaimer from './pages/Disclaimer.jsx';
import NotFound from './pages/NotFound.jsx';

import './styles/main.css';

const Header = () => {
  const { lang, setLang, fontSize, setFontSize, t } = useLanguage();

  return (
    <header className="navbar">
      {/* Top Banner: Mandatory Prototype Disclaimer & Accessibility Controls */}
      <div className="top-prototype-bar">
        <div className="top-bar-container">
          <span className="prototype-badge">
            ⚠️ {t('prototypeBanner')}
          </span>
          <div className="top-bar-controls">
            {/* Font Size Controls */}
            <div className="font-controls" aria-label="Adjust font size">
              <span className="font-label">{t('fontSize')}:</span>
              <button
                type="button"
                className={`font-btn ${fontSize === 'sm' ? 'active' : ''}`}
                onClick={() => setFontSize('sm')}
                title="Small text"
              >
                A-
              </button>
              <button
                type="button"
                className={`font-btn ${fontSize === 'md' ? 'active' : ''}`}
                onClick={() => setFontSize('md')}
                title="Normal text"
              >
                A
              </button>
              <button
                type="button"
                className={`font-btn ${fontSize === 'lg' ? 'active' : ''}`}
                onClick={() => setFontSize('lg')}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Language Selector */}
            <div className="language-selector">
              <label htmlFor="langSelect" className="sr-only">Select language</label>
              <select
                id="langSelect"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="lang-select"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="nav-container">
        <Link to="/" className="brand-logo" title="SchemeMatcher Home">
          {/* Professional Civic SVG Emblem */}
          <svg className="civic-emblem" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 6H3l9-6z" />
          </svg>
          <div className="brand-text">
            <span className="brand-title">{t('brandTitle')}</span>
            <span className="brand-subtitle">SIH26092</span>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Main Navigation">
          <Link to="/">{t('navHome')}</Link>
          <Link to="/schemes">{t('navSchemes')}</Link>
          <Link to="/questionnaire">{t('navQuestionnaire')}</Link>
          <Link to="/compare">{t('navCompare')}</Link>
          <Link to="/EMICalculator">{t('navCalculator')}</Link>
          <Link to="/partners">{t('navPartners')}</Link>
          <Link to="/documents">{t('navDocuments')}</Link>
          <Link to="/guide">{t('navGuide')}</Link>
          <Link to="/assistant">{t('navAssistant')}</Link>
          <Link to="/transparency">{t('navTransparency')}</Link>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-links-row">
          <Link to="/about">{t('navAbout')}</Link>
          <Link to="/faq">{t('navFaq')}</Link>
          <Link to="/contact">{t('navContact')}</Link>
          <Link to="/transparency">{t('navTransparency')}</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/disclaimer">Terms & Disclaimer</Link>
        </div>

        <p className="mt-md" style={{ fontWeight: 600 }}>{t('footerCopyright')}</p>
        <p className="footer-sub">{t('footerDisclaimer')}</p>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        {/* Skip to Content for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Header />

        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:code" element={<SchemeDetails />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/result" element={<Result />} />
            <Route path="/compare" element={<SchemeCompare />} />
            <Route path="/calculator" element={<EMICalculator />} />
            <Route path="/EMICalculator" element={<EMICalculator />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/guide" element={<ApplicationGuide />} />
            <Route path="/documents" element={<DocumentChecklist />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </LanguageProvider>
  );
};

export default App;
