// cerebro_omni.js - EL CEREBRO DE LAS 3 DIMENSIONES (45 PUNTOS TOTALES)

const IDIOMA = "INSTRUCTION: Detect the main language of the analyzed website. You MUST write the ENTIRE report strictly in that detected language.";
const REGLA_NUCLEAR = "NUCLEAR RULE: You are the OMNISCIENCIAS Engine. This is a $399 USD Premium Report. You must identify exactly 45 specific leakage points, no more, no less.";

const PROMPTS_OMNI = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. OMNISCIENCIAS EXECUTIVE SUMMARY\nWrite a surgical 3-paragraph summary. Dossier: ${d}`,
  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. THE 11-PILLAR FORENSIC MATRIX\nCreate a Markdown table evaluating the 11 pillars (0-100). Dossier: ${d}`,
  FUGAS_OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. TOTAL FORENSIC AUDIT: THE 45 LEAKAGE POINTS\nProvide exactly 15 points for each category:\n**BLOQUE A: SALES PSYCHOLOGY (15)**\n**BLOQUE B: UX/UI FRICTION (15)**\n**BLOQUE C: CHECKOUT EVAPORATION (15)**\nDossier: ${d}`,
  ROADMAP: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IV. RECOVERY ROADMAP\nProvide the 90-day action plan. Dossier: ${d}`
};

module.exports = { PROMPTS_OMNI, IDIOMA, REGLA_NUCLEAR };
