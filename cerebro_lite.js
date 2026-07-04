// cerebro_lite.js - Lite PDF: sales teaser (intro + 3 leaks). Titan upsell is deterministic in report-format.

const { IDIOMA_LITE } = require('./idioma');

const IDIOMA = IDIOMA_LITE;

const REGLA_NUCLEAR =
  'REGLA NUCLEAR: PredictaCore, análisis de conversión para dueños de tienda. Tono claro (no jerga de laboratorio). PROHIBIDO $, USD, ROI%. PROHIBIDO referencias internas (#12, Evidence #N, evaluation #N). PROHIBIDO tablas largas — la tabla SEO+IA y el upsell Titán se inyectan aparte. UN SOLO IDIOMA en toda la sección. PROHIBIDO dar el plan de corrección completo (eso es Titán).';

const FORMATO_LISTAS =
  "INSTRUCCIÓN DE FORMATO: Inicia cada fuga con un número. Ejemplo: '1. [Texto]'. PROHIBIDO viñetas • o -.";

const HDR =
  'Escribe el encabezado ### en el idioma de IDIOMA_APLICAR del dossier (inglés si la página es inglesa, español latinoamericano si es española).';

const FORMATO_FUGA =
  'Formato OBLIGATORIO por fuga (3 líneas dentro del mismo punto numerado): **What we found:** (dato concreto del dossier) · **Why it costs sales:** (impacto en comprador) · **Evidence:** (métrica medible). En español: **Qué encontramos:** · **Por qué cuesta ventas:** · **Evidencia:**. PROHIBIDO escribir cómo arreglarlo paso a paso — solo el problema. Cierra cada fuga con 1 frase: "How to fix this is in the Titan Report." / "Cómo resolverlo está en el Reporte Titán."';

/** LLM sections only — SEO_IA_LITE + UPSELL are deterministic sales blocks */
const PROMPTS_LITE = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### I. RESUMEN EJECUTIVO | EN: ### I. EXECUTIVE SUMMARY\nMáximo 2 párrafos + 1 frase de veredicto: (1) qué vende el negocio y a quién, (2) la fricción #1 medida hoy. Cierra el veredicto con: estas son solo 3 de 15 fugas prioritarias — **12 más** (algunas críticas) quedan fuera de este Lite. PROHIBIDO tablas. Dossier: ${d}`,

  FUGAS_LITE: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### III. LAS 3 FUGAS CRÍTICAS | EN: ### III. 3 CRITICAL LEAKS\nExactamente 3 puntos numerados de FALLAS_PRIORITARIAS. ${FORMATO_FUGA} ${FORMATO_LISTAS}. Tras el punto 3, una línea en negrita: **These are 3 of 15 priority flaws — 12 more remain locked.** / **Estas son 3 de 15 fugas prioritarias — quedan 12 bloqueadas.** PROHIBIDO citar #id. Dossier: ${d}`,
};

module.exports = { PROMPTS_LITE, IDIOMA, REGLA_NUCLEAR };
