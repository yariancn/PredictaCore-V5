// cerebro.js - BÚNKER 2: LENGUAJE DE EMPRENDEDOR (DNA CLASE MUNDIAL)

const IDIOMA = "Detecta el idioma del sitio y redacta TODO el reporte en ese idioma. Cero tecnicismos, solo claridad para un dueño de negocio.";

const REGLA_NUCLEAR = "REGLA NUCLEAR: PROHIBIDO mencionar reseñas o quejas en cualquier parte, excepto en la Sección IV si afectan la confianza del comprador.";

const FORMATO_LISTAS = "REGLA DE FORMATO: Usa ÚNICAMENTE el símbolo de guion (-) al inicio de cada punto. No uses números.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta en dos partes:\nPÁRRAFO 1: Explica con autoridad que somos PredictaCore Titán y que usamos simulaciones de comportamiento real para ver dónde se pierde el dinero.\nPÁRRAFO 2: Describe de forma sencilla qué vende este negocio y a quién intenta convencer. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles de clientes reales. Explica qué buscan y en qué parte exacta del sitio se desesperan y deciden no comprar. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA con 10 pilares. Califica del 1 al 10 puntos clave como: Confianza, Facilidad de Compra y Claridad. AUDITORÍA UNIVERSAL: Identifica si el paso final de pago estorba o confunde al cliente justo cuando va a soltar el dinero. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza qué tan invisible es la marca. Explica si el desorden o la lentitud son obstáculos que alejan a la gente. Aquí puedes usar las reseñas para mostrar por qué los clientes dudan de la calidad. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla comparativa con 3 competidores. Explica por qué ellos sí se están quedando con el dinero que este negocio pierde. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nFortalezas, Oportunidades, Debilidades y Amenazas del negocio. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 mejoras que harían que la tienda venda mucho más. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 puntos donde el dinero se escapa. Marca los peores como **[HEMORRAGIA CRÍTICA]**. REGLA: Detecta si las opciones de pago rápido están estorbando o si el cliente se siente forzado a registrarse cuando solo quiere pagar. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución a cada fuga. Usa el título en **negritas** y explica qué cambiar para que el dinero fluya. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 herramientas que harían el trabajo más fácil y rentable para el dueño. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 21 días. Acción por día para dejar de perder dinero y empezar a crecer. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
