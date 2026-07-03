// cerebro_lite.js - Lite PDF: short sales-focused teaser (cover + 3 leaks + Titan CTA)

const { IDIOMA_LITE } = require('./idioma');

const IDIOMA = IDIOMA_LITE;

const REGLA_NUCLEAR =
  'REGLA NUCLEAR: PredictaCore, auditor forense. Tono claro para dueño de negocio (no jerga de laboratorio). PROHIBIDO $, USD, ROI%. PROHIBIDO referencias internas (#12, Evidence #N, evaluation #N). PROHIBIDO tablas largas — las métricas ya están en la portada del PDF.';

const FORMATO_LISTAS =
  "INSTRUCCIÓN DE FORMATO: Inicia cada punto con un número. Ejemplo: '1. [Texto]'. PROHIBIDO viñetas • o -.";

const HDR =
  'Escribe el encabezado ### en el idioma de IDIOMA_APLICAR del dossier (inglés si la página es inglesa, español latinoamericano si es española).';

/** Only 3 LLM sections — ~4 PDF pages with cover screenshots + Titan CTA block */
const PROMPTS_LITE = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### I. RESUMEN EJECUTIVO | EN: ### I. EXECUTIVE SUMMARY\nMáximo 2 párrafos cortos (no tabla): (1) qué vende el negocio y a quién, (2) la fricción #1 que hace perder visitantes hoy. 1 frase de veredicto. Cita datos del dossier en lenguaje humano (ej. "sin titular principal", no "H1_COUNT: 0"). Dossier: ${d}`,

  FUGAS_LITE: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### II. LAS 3 FUGAS CRÍTICAS | EN: ### II. 3 CRITICAL LEAKS\nExactamente 3 puntos numerados de FALLAS_PRIORITARIAS. Formato: 1. **[Critical]** título corto — 2-3 frases: qué pasa, por qué el comprador se va, impacto en ventas. 2. **[High]** … 3. **[Medium]** … ${FORMATO_LISTAS}. PROHIBIDO citar #id, Evidence, HEMORRHAGE, FORENSIC. Dossier: ${d}`,

  UPSELL: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### III. SIGUIENTE PASO — REPORTE TITÁN | EN: ### III. NEXT STEP — TITAN REPORT\n2 párrafos persuasivos (sin lista de 11 pilares): estas 3 fugas son la punta del iceberg; Titán entrega las 15 principales + 15 recomendaciones concretas para resolver cada una + benchmark + plan 21 días. Cierra invitando a desbloquear el mapa completo. PROHIBIDO precios en esta sección. Dossier: ${d}`,
};

module.exports = { PROMPTS_LITE, IDIOMA, REGLA_NUCLEAR };
