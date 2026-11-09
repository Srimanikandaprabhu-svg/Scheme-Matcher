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

// POST /api/match – evaluate eligibility and calculate transparent scores
router.post('/', (req, res) => {
  const { income, projectCost, loanAmount, purpose, category } = req.body;
  if (
    income == null ||
    projectCost == null ||
    loanAmount == null
  ) {
    return res.status(400).json({ error: 'Missing required parameters: income, projectCost, loanAmount' });
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
    // If user specified an explicit category, filter out schemes not relevant to purpose
    if (allowedCodes && !allowedCodes.includes(scheme.code)) {
      continue;
    }

    const eligibility = checkEligibility({
      income: numIncome,
      projectCost: numProjectCost,
      loanAmount: numLoanAmount,
      scheme,
      category: category || 'SC',
      purpose: normalizedPurpose,
    });

    const scoringResult = scoreScheme(scheme, {
      loanAmount: numLoanAmount,
      maxLoan: eligibility.maxLoan,
      eligible: eligibility.eligible,
      purpose: normalizedPurpose,
    });

    results.push({
      scheme,
      maxLoan: eligibility.maxLoan,
      score: scoringResult.totalScore,
      scoreBreakdown: scoringResult.breakdown,
      reasons: eligibility.reasons,
      eligibleReasons: eligibility.eligibleReasons,
    });
  }

  // Sort eligible schemes strictly by descending score
  const eligible = results
    .filter((r) => r.reasons.length === 0)
    .sort((a, b) => b.score - a.score);

  const ineligible = results.filter((r) => r.reasons.length > 0);

  res.json({ eligible, ineligible });
});

export default router;
