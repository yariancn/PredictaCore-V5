// cerebro.js - BÚNKER 2: LENGUAJE DE EMPRENDEDOR (CLASE MUNDIAL)

const IDIOMA = "Detecta el idioma del sitio y redacta TODO el reporte en ese idioma. PROHIBIDO usar tecnicismos; habla claro para un dueño de negocio.";

const REGLA_NUCLEAR = "REGLA NUCLEAR: PROHIBIDO mencionar reseñas o quejas en cualquier parte, excepto en la Sección IV si afectan la confianza del comprador.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nExplica quiénes somos (PredictaCore Titán), menciona que usamos "modelos simbiópticos" y "9,000 simulaciones de fricción". Describe qué vende el negocio y a quién quiere convencer. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 tipos de clientes. Explica qué buscan y en qué parte exacta del sitio pierden la paciencia y se van sin comprar. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA con 10 pilares. Califica del 1 al 10 puntos como Confianza y Facilidad de Compra. AUDITORÍA UNIVERSAL: Revisa si el paso final de pago confunde al cliente o lo interrumpe justo cuando va a pagar. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza qué tan invisible es la marca. Explica si el desorden o la lentitud de la tienda alejan a la gente. Usa las reseñas si revelan que el producto no convence. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla con 3 competidores. Explica por qué ellos sí se quedan con el dinero que este negocio pierde. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas del negocio. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 mejoras que harían que la tienda venda mucho más. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 puntos donde el dinero se escapa. Marca los peores como **[HEMORRAGIA CRÍTICA]**. REGLA UNIVERSAL: Detecta si las opciones de pago rápido están estorbando o si el cliente se siente forzado a pasos extra en el último momento. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución a las 15 fugas. Usa el título en **negritas** y explica qué cambiar para que el dinero fluya. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 herramientas para que el dueño escale la operación sin errores. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 21 días. Acción pura por día para recuperar el control de la rentabilidad. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
