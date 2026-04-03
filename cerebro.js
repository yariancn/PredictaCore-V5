// cerebro.js - BÚNKER 2: MULTILINGÜE ESTRICTO Y LENGUAJE DE NEGOCIO

const IDIOMA = "INSTRUCCIÓN CRÍTICA: Detecta el idioma del sitio analizado. Redacta el reporte COMPLETO en ese idioma. USA LENGUAJE DE DUEÑO DE NEGOCIO: Evita tecnicismos como 'LCP' o 'fricción UX'. Si el sitio tarda en cargar, di 'Tu sitio es lento y el cliente se va'. Si el diseño es confuso, di 'Tu tienda está desordenada'.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: PROHIBIDO mencionar reseñas o quejas en ninguna parte, excepto en la Sección IV si afectan la confianza.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio. Prohibido numerar.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta en dos partes:\nPÁRRAFO 1: Explica que somos PredictaCore Titán, que usamos "modelos simbiópticos" y corremos "más de 9,000 simulaciones de fricción".\nPÁRRAFO 2: Describe qué vende el negocio y a quién intenta convencer. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles de clientes. Explica qué buscan y en qué parte exacta del sitio pierden la paciencia y deciden no comprar. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA con 10 pilares. Califica del 1 al 10. EVALUACIÓN UNIVERSAL: Analiza la integridad del paso final de pago; identifica si elementos externos o botones de pago rápido están estorbando o confundiendo al cliente justo antes de pagar. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza qué tan invisible es la marca. Explica si el desorden o la lentitud alejan a la gente. Aquí puedes usar las reseñas para mostrar fallas de calidad. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla con 3 competidores. Explica por qué ellos sí se están quedando con el dinero que este negocio pierde. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas del negocio. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 mejoras que harían que la tienda venda mucho más. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 puntos donde el dinero se escapa. Marca los peores como **[HEMORRAGIA CRÍTICA]**. REGLA UNIVERSAL: Detecta si las pasarelas externas o el proceso de pago rápido están bloqueando la vista del botón principal o forzando al cliente a pasos extra innecesarios. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución a cada fuga. Usa el título en **negritas** y explica qué cambiar para que el dinero fluya. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 herramientas que harían el trabajo más rentable para el dueño. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 21 días. Acción por día para recuperar el control de la rentabilidad. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
