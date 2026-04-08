// cerebro_omni.js - EL CEREBRO DE LAS 3 DIMENSIONES (45 PUNTOS TOTALES)

const IDIOMA = "INSTRUCTION: Detect the main language of the analyzed website. You MUST write the ENTIRE report strictly in that detected language.";

const REGLA_NUCLEAR = "NUCLEAR RULE: You are the OMNISCIENCIAS Engine. This is a $399 USD Premium Report. You must identify exactly 45 specific leakage points, no more, no less. Your tone is clinical, high-stakes, and elite.";

const PROMPTS_OMNI = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### I. OMNISCIENCIAS EXECUTIVE SUMMARY\nWrite a surgical 3-paragraph summary. Paragraph 1: The current state of their conversion engine. Paragraph 2: How their business model is being undermined by invisible leaks. Paragraph 3: The financial upside of sealing these 45 points. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### II. THE 11-PILLAR FORENSIC MATRIX\nCreate a Markdown table evaluating the 11 pillars (0-100). Next to each, a 1-sentence diagnostic of the capital drain. Pillars: UX Friction, Pricing Psychology, Authority, Offer Clarity, Checkout Leaks, Competitive Benchmark, Copywriting, Visibility, Retention, SWOT, Mobile Heuristics. Dossier: ${d}`,

  // AQUÍ ESTÁ LA ESTRUCTURA DE LOS 45 PUNTOS DIVIDIDOS EN 3 BLOQUES DE 15
  FUGAS_OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### III. TOTAL FORENSIC AUDIT: THE 45 LEAKAGE POINTS\n\nYou must provide exactly 15 points for each of the following 3 categories. Each point must include the ERROR and the FINANCIAL IMPACT.\n\n` + 
  `**BLOQUE A: PSICOLOGÍA DE VENTA Y COPYWRITING (15 Puntos)**\n` +
  `Focus on: Emotional triggers, authority, urgency, cognitive load, and micro-copy that kills trust.\n\n` +
  `**BLOQUE B: ARQUITECTURA TÉCNICA Y FRICCIÓN UX/UI (15 Puntos)**\n` +
  `Focus on: Navigation traps, mobile failures, speed-to-value, visual hierarchy, and redundant elements.\n\n` +
  `**BLOQUE C: ESTRATEGIA DE OFERTA Y EVAPORACIÓN EN CHECKOUT (15 Puntos)**\n` +
  `Focus on: Price perception, shipping friction, trust seals, cart recovery flaws, and post-purchase leaks.\n\n` +
  `Dossier: ${d}`,

  ROADMAP: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nWrite Header: ### IV. RECOVERY ROADMAP (90-DAY PROTOCOL)\nProvide the 3-step action plan: 24-hour emergency fixes, 30-day structural changes, and 90-day scaling strategy. Dossier: ${d}`
};

module.exports = { PROMPTS_OMNI, IDIOMA, REGLA_NUCLEAR };
