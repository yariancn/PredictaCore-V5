// cerebro.js - NÚCLEO DE INTELIGENCIA FORENSE (DNA TITÁN)

const IDIOMA = "Detecta el idioma del activo analizado y redacta TODO el reporte en ese idioma. USA LENGUAJE DE DUEÑO DE NEGOCIO: Claro, directo y sin tecnicismos técnicos.";

const REGLA_NUCLEAR = "REGLA NUCLEAR: PROHIBIDO mencionar reseñas o testimonios en el reporte, excepto en la Sección IV si muestran un fallo real que ahuyenta al comprador.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: DEBES usar el símbolo de guion (-) al inicio de cada punto, seguido de un espacio. Prohibido usar números.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCTION AND ASSET X-RAY\nRedacta en dos partes:\nPÁRRAFO 1: Explica con autoridad que somos PredictaCore Titán, que usamos "modelos simbiópticos" y hemos corrido "9,000 simulaciones de fricción".\nPÁRRAFO 2: Describe de forma sencilla qué vende este negocio y a quién intenta convencer basándote en lo que un cliente vería al entrar. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. SYNTHETIC TWINS & PURCHASING PSYCHOLOGY\nMapea 4 perfiles de clientes reales. Explica qué buscan conscientemente y en qué parte exacta del diseño o las imágenes sienten una duda o desorden que los hace cerrar la pestaña. ${FORMATO_LISTAS} Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. COMMERCIAL HEALTH SCORECARD\nGenera una TABLA con 10 pilares. Califica del 1 al 10 puntos como: Confianza Visual, Claridad del Objetivo y Facilidad de Compra. EVALUACIÓN UNIVERSAL: Analiza el paso final (Nodo de Cierre); identifica si botones de pago rápido o elementos externos confunden al cliente justo cuando va a concretar la acción. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n### IV. MARKET AUTHORITY & FORENSIC SEO\nAnaliza qué tan invisible o descuidado se siente el activo. Explica si la lentitud de respuesta o el desorden visual proyectan una imagen poco profesional que aleja a la gente. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. STRATEGIC X-RAY (BENCHMARK)\nTabla con 3 competidores. Explica qué ven los clientes en ellos que no ven aquí, y por qué ellos sí logran que el cliente complete su objetivo. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. TACTICAL MATRIX (SWOT)\nAnálisis de Fortalezas, Oportunidades, Debilidades y Amenazas desde el punto de vista del dueño y del cliente. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. ELITE OPTIMIZATION WISH LIST\n10 mejoras tácticas de acomodo y visuales que harían que el cliente se sienta más seguro y motivado a completar el objetivo. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 FRICTION POINTS & CAPITAL LEAKS\nIdentifica 15 puntos donde el cliente se distrae o se desespera. Marca los peores como **[HEMORRAGIA CRÍTICA]**. REGLA UNIVERSAL: Detecta si las pasarelas de pago o pasos extra están bloqueando la vista del botón principal. ${FORMATO_LISTAS} Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 TACTICAL EXECUTION ACTIONS\nLa solución a cada fuga. Usa el título en **negritas** y explica qué mover o cambiar para que el camino del cliente sea fluido. ${FORMATO_LISTAS} Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. TECHNOLOGICAL ARSENAL (SCALING)\n5 herramientas para que el dueño controle su negocio y mejore lo que el cliente ve. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. EXECUTIVE ROADMAP (21 DAYS)\nPlan de 21 días. Acción pura por día para limpiar el activo de obstáculos y recuperar la confianza del cliente. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
