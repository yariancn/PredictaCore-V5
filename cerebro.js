// cerebro.js - BÚNKER 2: MULTILINGÜE ESTRICTO Y VISIÓN 360 (DNA NIVEL 6)

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado. DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes o quejas en NINGUNA PARTE del reporte, EXCEPTO en la Sección IV (Visibilidad y SEO) si revelan defectos del activo.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio. Prohibido usar números.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta en dos partes:\nPÁRRAFO 1: Explica que somos PredictaCore Titán, usamos "modelos simbiópticos" y hemos ejecutado "9,000 simulaciones de fricción".\nPÁRRAFO 2: Describe profundamente el activo analizado (negocio, mercado y modelo). Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles mentales (Gemelos Sintéticos). Identifica su motivación y el punto exacto de fricción donde deciden retirar su capital. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA MARKDOWN con 10 pilares. Califica de 1 a 10. EVALUACIÓN ESPECIAL: Analiza la integridad del "Nodo de Cierre". Identifica si elementos de pago rápido o pasarelas externas están canibalizando la intención de compra o creando una ruptura en el ecosistema visual. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza la "Hemorragia de Autoridad". Explica cómo el desorden técnico es un impuesto a la conversión. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nGenera una TABLA MARKDOWN comparando el activo contra 3 competidores reales. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 funciones tácticas de alto valor para transmutar el activo en oro. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 hallazgos críticos. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLA UNIVERSAL: Identifica si el proceso de pago rápido o elementos externos están bloqueando la visibilidad del botón principal o forzando saltos de ecosistema innecesarios. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución exacta a las 15 fugas. Usa el título del hallazgo en **negritas** y luego tu explicación. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 soluciones SaaS justificando el ROI estratégico. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 3 fases (7 días c/u). Acción pura día por día para recuperar la rentabilidad. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
