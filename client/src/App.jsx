import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Result from './pages/Result.jsx';
import EMICalculator from './pages/EMICalculator.jsx';
import Schemes from './pages/Schemes.jsx';
import Partners from './pages/Partners.jsx';
import './styles/main.css';

const App = () => {
  return (
    <Router>
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            <span className="logo-emblem">🏛️</span>
            <span className="brand-title">SchemeMatcher</span>
          </Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/questionnaire">Find Schemes</Link>
            <Link to="/EMICalculator">EMI Calculator</Link>
            <Link to="/schemes">Browse Schemes</Link>
            <Link to="/partners">Channel Partners</Link>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/result" element={<Result />} />
          <Route path="/EMICalculator" element={<EMICalculator />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/partners" element={<Partners />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© 2026 SchemeMatcher. Developed for National Scheduled Castes Finance & Development Support.</p>
          <p className="footer-sub">
            Concessional loans, education assistance, and microfinance matching engine.
          </p>
        </div>
      </footer>
    </Router>
  );
};

export default App;
