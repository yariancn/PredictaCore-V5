// cerebro.js - ELITE CORE V.30
const IDIOMA = "Detecta el idioma principal del activo y redacta TODO el reporte (encabezados, tablas, listas) estrictamente en ese idioma. Cero mezclas.";
const REGLA_NUCLEAR = "REGLA NUCLEAR: Prohibido mencionar testimonios o quejas, excepto en la Sección IV para probar fallas de autoridad.";
const FORMATO_ELITE = "INSTRUCCIÓN DE FORMATO FATAL: DEBES usar OBLIGATORIAMENTE numeración (1., 2., 3.). Prohibido usar guiones o bullets.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n### I. INTRODUCTION AND ASSET RADIOGRAPHY\nPÁRRAFO 1: Preséntanos como PredictaCore Titán, la máquina definitiva de auditoría forense. Menciona que simulamos 9,000 interacciones de fricción para cuantificar el derrame de capital. PÁRRAFO 2: Disecciona el activo. ¿Qué venden? ¿Cuál es su modelo? Dossier: ${d}`,
  
  GEMELOS: (d) => `${IDIOMA}\n### II. PSYCHOLOGICAL PROFILES & BUYER ARCHETYPES\nDiseña 4 perfiles de Gemelos Sintéticos. Identifica su motivación visceral y su barrera técnica de compra. Sé letal en la descripción. Dossier: ${d}`,
  
  SCORECARD: (d) => `${IDIOMA}\n### III. COMMERCIAL HEALTH SCORECARD\nTabla de 10 pilares. Calificación 1-10. Diagnóstico Forense de 3 líneas. Evalúa Fricción, Tangibilidad y Autoridad. Dossier: ${d}`,
  
  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. EXTERNAL VISIBILITY & FORENSIC SEO\nEnsayo agresivo sobre:\n- Market Share Leakage (entrega de capital a la competencia).\n- Authority Friction: Usa las reseñas de fallos (ej. manchas en productos) para probar la erosión de confianza.\n- Technical Hemorrhage: Explica Crawl Budget, Canibalización y falta de Silos H1/H2 con metáforas financieras. Dossier: ${d}`,
  
  BENCHMARK: (d) => `${IDIOMA}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla comparativa con 3 rivales reales. Máximo 2 oraciones por celda. Dossier: ${d}`,
  
  SWOT: (d) => `${IDIOMA}\n### VI. STRATEGIC MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas. ${FORMATO_ELITE} Analiza riesgos de IP y saturación. Dossier: ${d}`,
  
  WISHLIST: (d) => `${IDIOMA}\n### VII. OPTIMIZATION WISH LIST\n10 funciones de élite (3 a 5 líneas cada una). ${FORMATO_ELITE} Enfócate en AR, personalización en vivo y bundles. Dossier: ${d}`,
  
  FUGAS: (d) => `${IDIOMA}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[CRITICAL HEMORRHAGE]**. ${FORMATO_ELITE} Evalúa errores micro en botones y carga. Dossier: ${d}`,
  
  ACCIONES: (d) => `${IDIOMA}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nSolución exacta a las 15 fugas. ${FORMATO_ELITE} Veredictos claros de rediseño UX/UI. Dossier: ${d}`,
  
  HERRAMIENTAS: (d) => `${IDIOMA}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 soluciones SaaS justificando el ROI estratégico. ${FORMATO_ELITE} Dossier: ${d}`,
  
  OMNI: (d) => `${IDIOMA}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de cirugía de 3 fases (7 días c/u). Acción pura día por día para sellar las fugas. ${FORMATO_ELITE} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
