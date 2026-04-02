// analisis_web.js - INTELIGENCIA WEB RESTAURADA
const { REGLAS_NUCLEARES } = require('./directrices');

const PROMPTS = {
  INTRO: (d) => `${REGLAS_NUCLEARES}\n### I. INTRODUCCIÓN Y RADIOGRAFÍA\nPreséntanos como PredictaCore Titán. Explica qué vende este activo y por qué su arquitectura actual está fallando en convertir visitas en dinero. Dossier: ${d}`,
  GEMELOS: (d) => `### II. GEMELOS SINTÉTICOS\nDefine 4 perfiles mentales que visitan este sitio y la barrera exacta que les impide comprar. Dossier: ${d}`,
  FUGAS: (d) => `### VIII. 15 PUNTOS DE HEMORRAGIA\nIdentifica 15 errores de fricción. Usa el término [HEMORRAGIA CRÍTICA] para los peores. Explica el porqué de cada uno en lenguaje de negocio. Dossier: ${d}`,
  ACCIONES: (d) => `### IX. 15 ACCIONES DE RESCATE\nLa solución inmediata a las 15 fugas. Qué cambiar hoy para sellar el flujo de capital. Dossier: ${d}`
  // ... (Aquí se completan las 11 etapas con los prompts del Reporte 6)
};
module.exports = { PROMPTS };
