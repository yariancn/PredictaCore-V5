// analisis_social.js - DISECCIÓN DE PERFILES SOCIALES
const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS_SOCIAL = {
  INTRO: (d) => `${REGLAS_NUCLEARES}\n### I. RADIOGRAFÍA DEL PERFIL\nAnaliza la biografía y contenido. ¿Es una marca de autoridad o un pasivo digital? Dossier: ${d}`,
  FUGAS: (d) => `### VIII. 15 PUNTOS DE FUGA SOCIAL\nIdentifica por qué el seguidor no se convierte en comprador. Usa [HEMORRAGIA CRÍTICA]. Dossier: ${d}`,
  ACCIONES: (d) => `### IX. 15 MOVIMIENTOS TÁCTICOS\nCambios exactos para forzar la transacción desde el perfil. Dossier: ${d}`
};
module.exports = { PROMPTS_SOCIAL };
