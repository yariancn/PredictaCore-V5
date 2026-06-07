// cerebro_omni.js - EL SCANNER FORENSE DEFINITIVO (45 PUNTOS CRÍTICOS)

const { IDIOMA_REPORTE } = require('./idioma');

const IDIOMA = IDIOMA_REPORTE;

const REGLA_NUCLEAR = "REGLA NUCLEAR: Inteligencia OMNI de PredictaCore. Tono quirúrgico y ejecutivo. Dictas sentencias sobre fricción de conversión. PROHIBIDO $, USD, ROI%.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: Cada punto numerado del 1 al 15 dentro de su grupo. Ejemplo: '1. [Punto de Fuga]'.";

const PROMPTS_OMNI = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. PROTOCOLO OMNI: ESCANEO FORENSE TOTAL\n3 párrafos:\nPÁRRAFO 1: Nivel máximo PredictaCore — evaluaciones de SIMULATION_RESULTS contra la interfaz.\nPÁRRAFO 2: Modelo de negocio del cliente con precisión.\nPÁRRAFO 3: Cada punto detectado es fricción de conversión medible. Dossier: ${d}`,

  GRUPO_A: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. MATRIZ DE FRICCIÓN PSICOLÓGICA Y UX (15 PUNTOS)\n15 errores (01-15) basados en SIMULATION_RESULTS + capturas. Impacto cualitativo — PROHIBIDO costo en $. ${FORMATO_LISTAS} Dossier: ${d}`,

  GRUPO_B: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. MATRIZ DE AUTORIDAD Y CONVERSIÓN (15 PUNTOS)\n15 errores (16-30). **[HEMORRAGIA DE CONFIANZA]** en los 3 peores. ${FORMATO_LISTAS} Dossier: ${d}`,

  GRUPO_C: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IV. MATRIZ ESTRATÉGICA Y MERCADO (15 PUNTOS)\n15 errores (31-45). Usa BENCHMARK_VERIFIED si existe. ${FORMATO_LISTAS} Dossier: ${d}`,

  ROADMAP: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. HOJA DE RUTA: CIERRE DE BRECHAS (21 DÍAS — ASISTIDA POR IA)\n3 fases con acciones técnicas concretas. Dossier: ${d}`,
};

module.exports = { PROMPTS_OMNI };
