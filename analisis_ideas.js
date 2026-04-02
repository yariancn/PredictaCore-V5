// analisis_ideas.js - AUDITORÍA DE CONCEPTOS
const PROMPTS_IDEAS = {
  VALIDACION: (idea) => `### ANÁLISIS DE VIABILIDAD\nActúa como un tiburón financiero. ¿Por qué esta idea de negocio podría fallar mañana mismo? Analiza la demanda usando gemelos sintéticos. Idea: ${idea}`,
  ESTRUCTURA: (idea) => `### ARQUITECTURA DEL MODELO\nCómo debería estructurarse este negocio para que no tenga fricción desde el día 1. Idea: ${idea}`
};
module.exports = { PROMPTS_IDEAS };
