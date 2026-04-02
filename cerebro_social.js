// cerebro_social.js - CEREBRO EXCLUSIVO PARA REDES SOCIALES
const IDIOMA = "INSTRUCCIÓN CRÍTICA: Detecta el idioma de la biografía del negocio. Escribe TODO el reporte estrictamente en ese idioma.";
const REGLA_NUCLEAR = "REGLA NUCLEAR: Audita ÚNICAMENTE el perfil del cliente. Ignora textos genéricos de la plataforma.";
const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: DEBES iniciar cada punto con un NÚMERO seguido de un PUNTO y un ESPACIO.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. INTRODUCCIÓN Y RADIOGRAFÍA DEL PERFIL\n${d}`,
  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. AUDIENCIAS Y PSICOLOGÍA DE CONSUMO\n${d}`,
  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. SCORECARD DE IMPACTO SOCIAL\n${d}`,
  VISIBILIDAD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IV. RELEVANCIA Y ALGORITMO\n${d}`,
  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. COMPETENCIA DIRECTA\n${d}`,
  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VI. FODA DE CONTENIDO\n${d}`,
  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VII. LISTA DE DESEOS\n${d}`,
  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### VIII. 15 PUNTOS DE FUGA\n${d}`,
  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IX. 15 ACCIONES TÁCTICAS\n${d}`,
  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### X. HERRAMIENTAS DE CRECIMIENTO\n${d}`,
  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### XI. ESTRATEGIA DE 21 DÍAS\n${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
