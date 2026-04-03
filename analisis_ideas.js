// analisis_ideas.js - VALIDACIÓN DE MODELOS DE NEGOCIO
const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS_IDEAS = {
  VALIDACION: (idea) => `${REGLAS_NUCLEARES}\n### ANÁLISIS DE VIABILIDAD\n¿Por qué esta idea va a fallar si no se cambia la estructura? Analiza la demanda real. Idea: ${idea}`,
  ESTRUCTURA: (idea) => `### ARQUITECTURA DEL MODELO\nPasos para que el negocio nazca sin fricción y genere capital desde el día 1. Idea: ${idea}`
};
module.exports = { PROMPTS_IDEAS };
