const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS = {
  INTRO: (d) => `${REGLAS_NUCLEARES}\n### I. INTRODUCTION AND ASSET X-RAY\nDi: "Somos PredictaCore Titán. No ofrecemos opiniones; entregamos auditorías de grado forense basadas en modelos simbiópticos que ejecutan 9,000 simulaciones de fricción". Dossier: ${d}`,
  GEMELOS: (d) => `### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles mentales (Gemelos Sintéticos) y el punto exacto donde este sitio les roba la intención de compra. Dossier: ${d}`,
  SCORECARD: (d) => `### III. COMMERCIAL HEALTH SCORECARD\nTabla de 10 pilares (Confianza, Fricción, etc.). Califica y justifica la insolvencia comercial. Dossier: ${d}`,
  VISIBILIDAD: (d) => `### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza la hemorragia de autoridad. Explica el desorden técnico como un "impuesto a la conversión". Dossier: ${d}`,
  BENCHMARK: (d) => `### V. STRATEGIC X-RAY (BENCHMARK)\nTabla con 3 competidores reales que capturan el capital que este activo pierde. Dossier: ${d}`,
  SWOT: (d) => `### VI. TACTICAL MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas. Usa numeración (1.). Dossier: ${d}`,
  WISHLIST: (d) => `### VII. ELITE OPTIMIZATION WISH LIST\n10 funciones tácticas para dejar de ser un pasivo. Dossier: ${d}`,
  FUGAS: (d) => `### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\n15 hallazgos. Inicia con **[HEMORRAGIA CRÍTICA]**. Explica por qué es un robo al dueño. Dossier: ${d}`,
  ACCIONES: (d) => `### IX. 15 TACTICAL EXECUTION ACTIONS\nSolución exacta a las 15 fugas. Instrucciones de rediseño UX/UI. Dossier: ${d}`,
  HERRAMIENTAS: (d) => `### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 soluciones SaaS justificando el ROI estratégico. Dossier: ${d}`,
  OMNI: (d) => `### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 3 fases (7 días c/u). Acción día por día para transmutar el activo en oro. Dossier: ${d}`
};
module.exports = { PROMPTS };
