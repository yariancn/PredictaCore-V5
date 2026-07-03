// cerebro_lite.js - Lite PDF: substantive teaser (~4-5 pages) that sells Titan

const { IDIOMA_LITE } = require('./idioma');

const IDIOMA = IDIOMA_LITE;

const REGLA_NUCLEAR =
  'REGLA NUCLEAR: PredictaCore, análisis de conversión para dueños de tienda. Tono claro (no jerga de laboratorio). PROHIBIDO $, USD, ROI%. PROHIBIDO referencias internas (#12, Evidence #N, evaluation #N). PROHIBIDO tablas largas en INTRO/FUGAS/UPSELL — la tabla SEO+IA ya va en sección II automática. UN SOLO IDIOMA en toda la sección (no mezclar español e inglés).';

const FORMATO_LISTAS =
  "INSTRUCCIÓN DE FORMATO: Inicia cada fuga con un número. Ejemplo: '1. [Texto]'. PROHIBIDO viñetas • o -.";

const HDR =
  'Escribe el encabezado ### en el idioma de IDIOMA_APLICAR del dossier (inglés si la página es inglesa, español latinoamericano si es española).';

const FORMATO_FUGA =
  'Formato OBLIGATORIO por fuga (3 líneas dentro del mismo punto numerado): **What we found:** (dato concreto del dossier) · **Why it costs sales:** (impacto en comprador) · **Evidence:** (métrica medible: H1 ausente, 5.3s carga, 0 Schema, 6% alt, SEO 61/100, etc.). En español usa: **Qué encontramos:** · **Por qué cuesta ventas:** · **Evidencia:**';

/** LLM sections — SEO_IA_LITE is injected deterministically in server.js */
const PROMPTS_LITE = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### I. RESUMEN EJECUTIVO | EN: ### I. EXECUTIVE SUMMARY\nMáximo 2 párrafos + 1 frase de veredicto: (1) qué vende el negocio y a quién — sé específico con el giro del dossier, (2) la fricción #1 medida hoy (cita carga, H1, Schema, SEO score en lenguaje humano). PROHIBIDO tablas. Dossier: ${d}`,

  FUGAS_LITE: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### III. LAS 3 FUGAS CRÍTICAS | EN: ### III. 3 CRITICAL LEAKS\nExactamente 3 puntos numerados de FALLAS_PRIORITARIAS. ${FORMATO_FUGA} ${FORMATO_LISTAS}. Cada fuga debe citar al menos 1 métrica del dossier en Evidence/Evidencia. PROHIBIDO citar #id, HEMORRHAGE, FORENSIC. Dossier: ${d}`,

  UPSELL: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### IV. SIGUIENTE PASO — REPORTE TITÁN | EN: ### IV. NEXT STEP — TITAN REPORT\n2 párrafos cortos: estas 3 fugas son la punta del iceberg — **12 más ocultas**. Titán = 15 fugas rankeadas + 15 recomendaciones concretas + benchmark vs categoría + plan 21 días. Cierra con intriga específica (qué más podría estar frenando checkout, prueba social, móvil). PROHIBIDO precios. Dossier: ${d}`,
};

module.exports = { PROMPTS_LITE, IDIOMA, REGLA_NUCLEAR };
