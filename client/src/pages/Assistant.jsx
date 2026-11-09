import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_MESSAGES = [
  {
    sender: 'bot',
    text: 'Namaste! I am the SchemeMatcher Knowledge Assistant. I can help you understand NSFDC concessional loans, eligibility rules, interest rates, required documents, and channel partner procedures.',
    time: 'Just now',
  },
];

const SUGGESTIONS = [
  'What are the interest rates for NSFDC loans?',
  'What is the maximum loan under Micro Finance Scheme (MFS)?',
  'How does the moratorium period work?',
  'What documents do I need to apply?',
  'How can I find a channel partner bank near me?',
  'What is the maximum project cost for a Term Loan?',
];

const Assistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSchemes(data);
      })
      .catch((err) => console.error('Failed to load schemes for chatbot:', err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (query) => {
    const q = query.toLowerCase();

    // 1. Interest rates
    if (q.includes('interest') || q.includes('rate') || q.includes('vatti') || q.includes('byaj')) {
      if (q.includes('education') || q.includes('els')) {
        return 'Educational Loan Scheme (ELS) offers concessional interest at 6.5% p.a. to beneficiaries for studies in India and abroad (capped at ₹40,00,000).';
      }
      if (q.includes('micro finance') || q.includes('mfs')) {
        return 'Micro Finance Scheme (MFS) charges an interest rate of 6.5% p.a. to the beneficiary for loans up to ₹1,25,000.';
      }
      if (q.includes('term loan') || q.includes('tl')) {
        return 'Term Loan (TL) offers concessional financing at 8.0% p.a. for project costs up to ₹50,00,000.';
      }
      return 'NSFDC schemes offer highly concessional interest rates ranging from 6.5% to 8.0% p.a. for SC entrepreneurs and students. For instance, Micro Finance is 6.5%, Educational Loans are 6.5%, and Term Loans are 8.0%.';
    }

    // 2. Maximum loan amounts & project costs
    if (q.includes('max') || q.includes('limit') || q.includes('amount') || q.includes('how much') || q.includes('cost')) {
      if (q.includes('education') || q.includes('els')) {
        return 'Under the Educational Loan Scheme (ELS), the maximum loan is up to ₹40,00,000 (or 90% of the course fee, whichever is lower) with repayment extending up to 12 years.';
      }
      if (q.includes('micro') || q.includes('mfs') || q.includes('amy')) {
        return 'For Micro Finance Schemes (MFS & AMY), the maximum project cost is ₹1,40,000 and the maximum loan amount is ₹1,25,000 (up to 90% of project cost).';
      }
      if (q.includes('term') || q.includes('tl')) {
        return 'Under the Term Loan (TL) scheme, projects up to ₹50,00,000 can be financed with a maximum loan amount of ₹45,00,000 (90% loan cap).';
      }
      return 'Loan limits vary by scheme:\n• Micro Finance (MFS): Up to ₹1.25 Lakh (Cost ₹1.4 Lakh)\n• Term Loan (TL): Up to ₹45 Lakh (Cost ₹50 Lakh)\n• Educational Loan (ELS): Up to ₹40 Lakh\n• Udyam Nidhi Yojana (UNY): Up to ₹45 Lakh.';
    }

    // 3. Moratorium
    if (q.includes('moratorium') || q.includes('grace') || q.includes('holiday')) {
      return 'A moratorium is a repayment holiday where principal installment repayment is suspended. NSFDC schemes provide:\n• Micro Finance: 3 months moratorium\n• Term Loan: 6 months moratorium (extended to 12 months for plantation and construction)\n• Education Loan: Course duration + 1 year (or 6 months after starting employment).';
    }

    // 4. Documents
    if (q.includes('document') || q.includes('certificate') || q.includes('proof') || q.includes('paper')) {
      return 'Standard required documents for NSFDC schemes include:\n1. Proof of Identity & Address (Aadhaar Card, Voter ID)\n2. Scheduled Caste (SC) Community Certificate issued by revenue authority\n3. Annual Family Income Certificate (NSFDC eligibility ceiling is ₹5,00,000)\n4. Detailed Project Report / Machinery Quotation (for business loans)\n5. Admission Letter & Fee Structure (for education loans)\n6. Bank Account Passbook (active savings account).';
    }

    // 5. Partners / Banks
    if (q.includes('partner') || q.includes('bank') || q.includes('where to apply') || q.includes('office') || q.includes('branch')) {
      return 'NSFDC does not disburse loans directly to citizens. Loans are processed through authorized Channel Partners: State Channelising Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs). You can use our Partner Locator page to find authorized branches and SCAs by entering your PIN code or selecting your state.';
    }

    // 6. Eligibility / Income
    if (q.includes('eligible') || q.includes('income') || q.includes('who can apply') || q.includes('criteria')) {
      return 'General eligibility criteria for NSFDC assistance:\n• The applicant must belong to the Scheduled Caste (SC) community or Safai Karamchari category.\n• Annual family income should not exceed ₹5,00,000.\n• Applicant should have adequate skill/experience in the proposed enterprise.\n• You can use our "Find My Scheme" questionnaire for an automated multi-factor eligibility assessment.';
    }

    // Default Fallback
    return 'I can provide verified facts about NSFDC schemes (MFS, Term Loan, Educational Loan), eligibility caps (₹5 Lakh income ceiling), interest rates (6.5% - 8%), required documents, and channel partner procedures. Could you please specify which scheme or topic you would like to explore?';
  };

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(text);
      const botMsg = {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="container">
      <div className="card chat-page-card">
        <div className="chat-header">
          <div className="chat-title-group">
            <h2>💬 Scheme Knowledge Assistant</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Deterministic guidance powered by official NSFDC scheme guidelines and channel partner rules.
            </p>
          </div>
          <div className="badge badge-accent">Verified Policy Facts</div>
        </div>

        {/* Suggestion Chips */}
        <div className="chips-container mt-sm">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginRight: '6px' }}>Quick Topics:</span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn"
              onClick={() => handleSend(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Messages Box */}
        <div className="chat-box mt-md">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-message ${m.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
              <div className="msg-avatar">{m.sender === 'user' ? '👤' : '🏛️'}</div>
              <div className="msg-bubble">
                <div className="msg-text" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message msg-bot">
              <div className="msg-avatar">🏛️</div>
              <div className="msg-bubble typing-bubble">
                <span>Checking scheme guidelines...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-input-bar mt-md"
        >
          <input
            type="text"
            placeholder="Ask about interest rates, loan limits, documents, or channel partners..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={!input.trim()}>
            Send Question
          </button>
        </form>

        <div className="chat-disclaimer mt-sm">
          <span>* Responses are deterministic and derived from NSFDC official guidelines. This is a student prototype for SIH26092.</span>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
