// cerebro.js - BÚNKER 2: MULTILINGÜE ESTRICTO Y LISTAS BLINDADAS (DNA NIVEL 6)

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (como manchas o defectos) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad y SEO).";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO INQUEBRANTABLE: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio. Prohibido numerar.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta esta sección estructurada estrictamente en dos partes:\nPÁRRAFO 1 (Nuestra Identidad): Explica con autoridad, agresividad y un tono de élite quiénes somos (PredictaCore). DEBES mencionar OBLIGATORIAMENTE que utilizamos "modelos simbiópticos" y que hemos ejecutado "más de 9,000 simulaciones de fricción transaccional".\nPÁRRAFO 2 (El Activo): Describe el negocio basado en el dossier. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles mentales (Gemelos Sintéticos) que visitarían este activo. Identifica su motivación visceral y el punto exacto de fricción donde deciden retirar su capital. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA MARKDOWN con 10 pilares (Confianza, Fricción, Navegación, etc.). Califica de 1 a 10. EVALUACIÓN ESPECIAL: Analiza la integridad del "Nodo de Cierre" (pasarelas y botones de pago rápido); identifica si estos elementos externos canibalizan la intención de compra o crean una ruptura en el ecosistema visual del cliente. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza la "Hemorragia de Autoridad". Explica cómo el desorden técnico es un impuesto a la conversión. En esta sección SÍ puedes mencionar la voz del cliente si revela defectos estructurales. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nGenera una TABLA MARKDOWN comparando el activo contra 3 competidores reales. Identifica por qué los rivales están capturando el capital que este activo pierde. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nAnaliza Fortalezas, Oportunidades, Debilidades y Amenazas (3 a 5 líneas cada una). ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 funciones tácticas de alto valor para transmutar el activo en oro. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. ${FORMATO_LISTAS}\n2. AUDITORÍA UNIVERSAL DE CIERRE: Identifica si el proceso de pago rápido o las pasarelas externas están bloqueando la visibilidad del botón principal o forzando al usuario a un login/salto de ecosistema innecesario que detiene la venta. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nProporciona la solución exacta a las 15 fugas. REGLA: ${FORMATO_LISTAS}. Usa el título del hallazgo en **negritas** y luego tu explicación. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 soluciones SaaS justificando el ROI estratégico de cada una para eliminar el error humano. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de choque de 3 fases (7 días c/u). Acción pura día por día para recuperar el control de la rentabilidad. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA };
