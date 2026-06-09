// cerebro_lite.js - TEASER FORENSE CON SEO/IA REAL

const { IDIOMA_LITE } = require('./idioma');

const IDIOMA = IDIOMA_LITE;

const REGLA_NUCLEAR = "REGLA NUCLEAR: PredictaCore Titán, auditor forence. Tono élite, clínico. Prohibido tipografías/colores. Fricción de conversión y abandono. PROHIBIDO $, USD, ROI%.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO: Inicia cada punto con un número. Ejemplo: '1. [Texto]'. PROHIBIDO viñetas • o -.";

const PILARES_11 = "11 Pilares PredictaCore (Titán): Radiografía del Activo, Perfiles Psicológicos, Scorecard de Salud, Visibilidad y SEO, Benchmark Competitivo, Matriz Estratégica, Lista de Deseos, 15 Puntos de Fuga, 15 Acciones Tácticas, Herramientas de Escala, Hoja de Ruta 21 Días.";

const HDR = 'Escribe el encabezado ### en el idioma de IDIOMA_APLICAR del dossier (inglés si la página es inglesa, español latinoamericano si es española).';

const PROMPTS_LITE = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### I. RADIOGRAFÍA FORENSE INICIAL | EN: ### I. INITIAL FORENSIC X-RAY\nMini resumen ejecutivo (tabla): Carga (TIEMPO_CARGA_SEG), SEO (SEO_TECNICO_SCORE), IA (AI_DISCOVERABILITY_SCORE), Veredicto 1 línea.\n2 párrafos: fricción detectada + qué vende el negocio. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### II. SIGNOS VITALES DE CONVERSIÓN | EN: ### II. CONVERSION VITAL SIGNS\nTabla Markdown (1-10) con 5 filas: Fricción Checkout/CTA, Claridad de Oferta, Arquitectura de Confianza, SEO Técnico (dato real), Visibilidad en IAs. 1 línea de impacto cualitativo por fila (sin $). Dossier: ${d}`,

  SEO_IA_LITE: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### III. SNAPSHOT SEO + IA | EN: ### III. SEO + AI SNAPSHOT\nTabla compacta | Señal | Valor | Riesgo | con mínimo 6 filas de SEO_FORENSICS/AI_VISIBILITY. Keywords de KEYWORDS_INFERIDAS (inferidas, sin volumen).\n1 párrafo: evaluación técnica proxy — ¿robots/schema/llms permitirían citación por IAs? NO afirmar prueba en ChatGPT en vivo. Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### IV. LA BRECHA DEL POTENCIAL | EN: ### IV. THE POTENTIAL GAP\n1 párrafo breve + punto numerado 1. **La pieza faltante / Missing piece:** mejora estratégica más valiosa. Dossier: ${d}`,

  FUGAS_LITE: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### V. LAS 3 HEMORRAGIAS CRÍTICAS | EN: ### V. 3 CRITICAL LEAKS\nExactamente 3 puntos numerados 1. 2. 3. de FALLAS_PRIORITARIAS (SIMULATION_RESULTS), alineados al GIRO_DETECTADO. ${FORMATO_LISTAS}. Cita #id. Impacto cualitativo. Dossier: ${d}`,

  UPSELL: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${HDR} Ejemplo ES: ### VI. ACTIVA PROTECCIÓN TITÁN | EN: ### VI. ACTIVATE TITAN PROTECTION\nPárrafo persuasivo: estas 3 fugas son solo el inicio.\nLista exacta (traducida al idioma del activo): ${PILARES_11}\nMenciona Reporte Titán (USD $349): 15 fugas + 15 acciones copy-paste + SEO forense completo + roadmap 21 días.\nCierra sobre fricción de conversión detectada. Dossier: ${d}`,
};

module.exports = { PROMPTS_LITE, IDIOMA, REGLA_NUCLEAR, PILARES_11 };
