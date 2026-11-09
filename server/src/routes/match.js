import express from 'express';
import db from '../db.js';
import { checkEligibility } from '../../../shared/eligibility.js';
import { scoreScheme } from '../../../shared/scoring.js';

const router = express.Router();

// Purpose category mapping to scheme codes
const PURPOSE_SCHEME_MAP = {
  education: ['ELS'],
  microfinance: ['MFS', 'AMY'],
  business: ['TL', 'UNY', 'MFS', 'AMY'],
  agriculture: ['TL', 'MFS'],
  sanitation: ['MFS', 'AMY', 'TL'],
};

// POST /api/match – receive questionnaire payload, evaluate all schemes
router.post('/', (req, res) => {
  const { income, projectCost, loanAmount, purpose } = req.body;
  if (
    income == null ||
    projectCost == null ||
    loanAmount == null
  ) {
    return res.status(400).json({ error: 'Missing required fields: income, projectCost, loanAmount' });
  }

  const numIncome = Number(income);
  const numProjectCost = Number(projectCost);
  const numLoanAmount = Number(loanAmount);

  // Load all schemes from DB
  const schemes = db.prepare('SELECT * FROM schemes').all();

  const results = [];
  const normalizedPurpose = (purpose || '').trim().toLowerCase();
  const allowedCodes = PURPOSE_SCHEME_MAP[normalizedPurpose];

  for (const scheme of schemes) {
    // If user specified an explicit category, check if this scheme is applicable
    if (allowedCodes && !allowedCodes.includes(scheme.code)) {
      continue;
    }

    const eligibility = checkEligibility({
      income: numIncome,
      projectCost: numProjectCost,
      loanAmount: numLoanAmount,
      scheme
    });

    if (eligibility.eligible) {
      const score = scoreScheme(scheme);
      results.push({
        scheme,
        maxLoan: eligibility.maxLoan,
        score,
        reasons: []
      });
    } else {
      results.push({
        scheme,
        maxLoan: eligibility.maxLoan,
        score: 0,
        reasons: eligibility.reasons
      });
    }
  }

  // Sort eligible schemes by descending score
  const eligible = results
    .filter((r) => r.reasons.length === 0)
    .sort((a, b) => b.score - a.score);

  const ineligible = results.filter((r) => r.reasons.length > 0);

  res.json({ eligible, ineligible });
});

export default router;
