// cerebro_omni.js - EL MOTOR DE OMNISCIENCIAS (45 PUNTOS / 3 DIMENSIONES)

const IDIOMA = "INSTRUCTION: Detect the main language of the analyzed website. You MUST write the ENTIRE report strictly in that detected language.";

const REGLA_NUCLEAR = "NUCLEAR RULE: You are the OMNISCIENCIAS Engine by PredictaCore. This is a $399 USD Premium B2B Forensic Report. You must be brutal, clinical, and hyper-analytical. Do not use generic marketing advice like 'improve your SEO'. Instead, use terms like 'asymmetric information', 'cognitive friction', 'trust-deficit patterns', and 'capital evaporation points'.";

const PROMPTS_OMNI = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### I. OMNISCIENCIAS EXECUTIVE SUMMARY\nWrite a 3-paragraph forensic summary. Paragraph 1: Analyze the business model and the 'Synthetic Twin' simulation results. Paragraph 2: Identify the most dangerous invisible leak that is siphoning revenue right now. Paragraph 3: State clearly the financial growth potential if the following 45 points are addressed. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### II. THE 11-PILLAR FORENSIC MATRIX\nCreate a strict Markdown table evaluating all 11 Pillars (0-100 scale). For each pillar, provide a surgical 1-sentence diagnosis of why the score is not 100. Pillars: 1. UX Friction, 2. Pricing Psychology, 3. Authority Architecture, 4. Offer Clarity, 5. Checkout Leaks, 6. Competitive Benchmark, 7. Conversion Copywriting, 8. Visibility & Capture, 9. User Retention, 10. SWOT Matrix, 11. Mobile Heuristics. Dossier: ${d}`,

  FUGAS_OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### III. DEEP ARCHITECTURE: THE 45 CRITICAL FAILURES\n\nINSTRUCTION: You must provide EXACTLY 15 points for each of the following 3 categories. Each point must state the ERROR and the FINANCIAL CONSEQUENCE.\n\n` + 
  `**GROUP A: PSYCHOLOGICAL TRIGGERS & CONVERSION COPYWRITING (15 POINTS)**\n` +
  `Focus on: Trust killers, weak headlines, lack of social proof, choice paralysis, and emotional disconnect.\n\n` +
  `**GROUP B: TECHNICAL FRICTION & UX FORENSICS (15 POINTS)**\n` +
  `Focus on: Navigation traps, mobile-specific failures, layout instability, load-to-value ratio, and conversion-path obstacles.\n\n` +
  `**GROUP C: OFFER STRATEGY & CHECKOUT EVAPORATION (15 POINTS)**\n` +
  `Focus on: Price anchoring flaws, shipping friction, micro-commitments, payment gateway anxiety, and cart abandonment triggers.\n\n` +
  `Dossier: ${d}`,

  ROADMAP: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### IV. THE 90-DAY RECOVERY PROTOCOL\nProvide a precise action plan divided into: \n- **Phase 1 (The 24h Hotfix):** Immediate tactical changes to stop the bleeding. \n- **Phase 2 (The 30-Day Structural Shift):** Changes to the core offer and architecture. \n- **Phase 3 (The 90-Day Scale):** Long-term optimization strategy. \nClose with a powerful statement about PredictaCore's mathematical certainty. Dossier: ${d}`
};

module.exports = { PROMPTS_OMNI, IDIOMA, REGLA_NUCLEAR };
