// cerebro.js - NÚCLEO DE INTELIGENCIA FORENSE (DNA TITÁN)

const IDIOMA = "INSTRUCCIÓN CRÍTICA: Detecta el idioma del sitio analizado y redacta el reporte COMPLETO en ese idioma. USA LENGUAJE DE EMPRENDEDOR: Claro, directo y entendible. Si el sitio es lento, di 'Tu sitio es lento y el cliente se harta de esperar'. Si el diseño es confuso, di 'Tu tienda se ve desordenada'.";

const REGLA_NUCLEAR = "REGLA NUCLEAR: PROHIBIDO mencionar reseñas o testimonios en cualquier parte, excepto en la Sección IV si revelan un fallo real que ahuyenta al comprador.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio. Prohibido usar números.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta en dos partes:\nPÁRRAFO 1: Identidad Titán. Explica quiénes somos (PredictaCore), menciona que usamos "modelos simbiópticos" y hemos corrido "9,000 simulaciones de fricción".\nPÁRRAFO 2: Radiografía del Negocio. Describe qué vende el activo y qué busca lograr (venta, reserva, regalo) basándote en lo que un cliente vería al entrar. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles de clientes reales. Explica qué buscan conscientemente y en qué parte exacta del diseño, colores o acomodo sienten una duda inconsciente que los hace abandonar el activo. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA con 10 pilares. Califica del 1 al 10 puntos como: Confianza Visual, Claridad de Pasos y Facilidad de Compra. EVALUACIÓN UNIVERSAL: Analiza el Nodo de Cierre; identifica si botones de pago rápido o elementos externos confunden al cliente justo antes de concretar su objetivo. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza qué tan invisible es la marca. Explica si el desorden visual o la lentitud de respuesta proyectan una compañía descuidada. Aquí puedes usar las reseñas para mostrar fallas de calidad que el cliente percibe como un riesgo. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla con 3 competidores. Explica qué ven los clientes en ellos que no ven aquí, y por qué les entregan su dinero a ellos. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nAnálisis de Fortalezas, Oportunidades, Debilidades y Amenazas desde la perspectiva del cliente y el negocio. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 mejoras visuales y de acomodo que harían que el cliente se sienta más seguro y motivado a completar el objetivo. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 puntos donde el cliente se distrae o se desespera. Marca los peores como **[HEMORRAGIA CRÍTICA]**. REGLA UNIVERSAL: Detecta si las opciones de pago o pasos extra están bloqueando la vista del botón principal. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución a cada fuga. Usa el título en **negritas** y explica qué mover o cambiar para que el camino del cliente sea fluido y sin dudas. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 herramientas sencillas para que el dueño controle su negocio sin errores y mejore la experiencia del usuario. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 21 días. Acción pura por día para limpiar el activo de obstáculos y recuperar la confianza del cliente. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
