// analisis_social.js - INTELIGENCIA DE IMPACTO SOCIAL
const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS_SOCIAL = {
  INTRO: (d) => `${REGLAS_NUCLEARES}\n### I. RADIOGRAFÍA DEL PERFIL\nAnaliza la biografía y el contenido visual. ¿Qué imagen proyecta el negocio? ¿Es una marca de autoridad o un perfil abandonado? Dossier: ${d}`,
  FUGAS: (d) => `### VIII. 15 PUNTOS DE FUGA EN REDES\nIdentifica por qué el tráfico se detiene en el perfil y no va al link de compra. 1. Usa numeración (1.). 2. Explica el error como una pérdida de confianza. Dossier: ${d}`,
  ACCIONES: (d) => `### IX. 15 MOVIMIENTOS TÁCTICOS\nCambios exactos en la biografía, los destacados y el tipo de contenido para forzar la venta. Dossier: ${d}`
};
module.exports = { PROMPTS_SOCIAL };
