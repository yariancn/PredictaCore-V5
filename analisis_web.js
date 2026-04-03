// analisis_web.js - NÚCLEO DE INTELIGENCIA FORENSE (11 ETAPAS)
const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS = {
  INTRO: (d) => `${REGLAS_NUCLEARES}
### I. INTRODUCTION AND ASSET X-RAY
PÁRRAFO 1: Identidad Titán. Di: "Somos PredictaCore Titán. No ofrecemos opiniones; entregamos auditorías de grado forense basadas en modelos simbiópticos que ejecutan 9,000 simulaciones de fricción transaccional".
PÁRRAFO 2: Veredicto de Insolvencia. Disecciona la integridad estructural de este negocio. ¿Qué venden y por qué su arquitectura actual es una fractura que fuga ingresos? Dossier: ${d}`,

  GEMELOS: (d) => `### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY
Mapea 4 perfiles mentales (Gemelos Sintéticos). No los describas, diséctalos. Identifica el "punto de dolor" exacto donde el Gemelo Sintético decide retirar su capital debido a la fricción o desorden del sitio. Dossier: ${d}`,

  SCORECARD: (d) => `### III. COMMERCIAL HEALTH SCORECARD
Crea una tabla con 10 pilares (Confianza, Fricción, Tangibilidad, Cierre, etc.). Califica de 1 a 10 y emite un veredicto de 2 líneas por pilar sobre por qué el activo es comercialmente insolvente. Dossier: ${d}`,

  VISIBILIDAD: (d) => `### IV. MARKET AUTHORITY & FORENSIC SEO
Analiza la "Hemorragia de Autoridad". Explica el desorden técnico como un "impuesto directo a la conversión". Si el sitio es lento o irrelevante, di por qué el capital prefiere fluir hacia la competencia. Dossier: ${d}`,

  BENCHMARK: (d) => `### V. STRATEGIC X-RAY (BENCHMARK)
Crea una tabla comparativa con 3 rivales reales. Identifica qué están haciendo ellos para capturar el capital que este activo está perdiendo por su arquitectura deficiente. Dossier: ${d}`,

  SWOT: (d) => `### VI. TACTICAL MATRIX (SWOT)
Analiza Fortalezas, Oportunidades, Debilidades y Amenazas. Usa numeración (1.). Enfócate en riesgos de saturación de mercado y debilidades de la oferta física. Dossier: ${d}`,

  WISHLIST: (d) => `### VII. ELITE OPTIMIZATION WISH LIST
Enumera 10 funciones tácticas de alto valor (AR, personalización instantánea, bundles) que transformarían este pasivo en una máquina de guerra comercial. Numera del 1 al 10. Dossier: ${d}`,

  FUGAS: (d) => `### VIII. 15 FRICTION POINTS & CAPITAL LEAKS
Identifica 15 hallazgos quirúrgicos de fricción. Inicia cada punto con **[HEMORRAGIA CRÍTICA]**. Explica POR QUÉ cada error es un robo directo al dueño del negocio. Dossier: ${d}`,

  ACCIONES: (d) => `### IX. 15 TACTICAL EXECUTION ACTIONS
La solución exacta a las 15 fugas anteriores. Instrucciones directas de rediseño UX/UI para sellar el flujo de capital. Numera del 1 al 15. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `### X. TECHNOLOGICAL ARSENAL (SCALING)
Recomienda 5 soluciones SaaS justificando el ROI estratégico de cada una. Cómo automatizar para eliminar el error humano en la venta. Dossier: ${d}`,

  OMNI: (d) => `### XI. EXECUTIVE ROADMAP (21 DAYS)
Plan de choque de 3 fases (7 días cada una). Acción pura día por día para transmutar el activo en oro. Numera del 1 al 21. Dossier: ${d}`
};

module.exports = { PROMPTS };
