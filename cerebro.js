// cerebro.js - BÚNKER 2: MULTILINGÜE ESTRICTO, SEO REAL Y VISIBILIDAD IA

const { IDIOMA_REPORTE } = require('./idioma');

const IDIOMA = IDIOMA_REPORTE;

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (como manchas o defectos) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad, SEO y Descubrimiento IA). PROHIBIDO cifras monetarias ($, USD, ROI%). Impacto solo cualitativo.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: TIENES ESTRICTAMENTE PROHIBIDO usar viñetas simples (bullets como • o -). DEBES iniciar cada punto OBLIGATORIAMENTE con un NÚMERO seguido de un PUNTO y un ESPACIO. Ejemplo CORRECTO: '1. [Texto]'. Ejemplo INCORRECTO: '• [Texto]'.";

const PRIORIDAD_FUGAS = `PRIORIDAD DE FUGAS (15 puntos — usa palabras claras, NO códigos P1/P2):
- Puntos 1-3: etiqueta **[Critical]** (ES: **[Crítico]**) — bloquean conversión hoy.
- Puntos 4-8: etiqueta **[High]** (ES: **[Alto]**) — abandono probable.
- Puntos 9-12: etiqueta **[Medium]** (ES: **[Medio]**) — corregir en 30 días.
- Puntos 13-15: etiqueta **[Low]** (ES: **[Bajo]**) — pulido y detalle.
Formato OBLIGATORIO cada línea: 1. **[Critical]** Descripción del hallazgo. (evidence: evaluation #id)`;

const PILARES_11 = "Los 11 Pilares PredictaCore: 1. Radiografía del Activo, 2. Perfiles Psicológicos, 3. Scorecard de Salud, 4. Visibilidad y SEO, 5. Benchmark Competitivo, 6. Matriz Estratégica, 7. Lista de Deseos, 8. 15 Puntos de Fuga, 9. 15 Acciones Tácticas, 10. Herramientas de Escala, 11. Hoja de Ruta 21 Días.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${PILARES_11}\nEscribe este encabezado traducido: ### I. INTRODUCCIÓN, RESUMEN EJECUTIVO Y RADIOGRAFÍA\nPARTE A — RESUMEN EJECUTIVO (OBLIGATORIO PRIMERO): Tabla Markdown con filas: Tiempo de carga (TIEMPO_CARGA_SEG), SEO técnico (SEO_TECNICO_SCORE), Visibilidad IA (AI_DISCOVERABILITY_SCORE), Giro detectado (GIRO_DETECTADO), Veredicto forense (1 frase orientada a emprendedor: por qué pierde clientes en esta página). Luego 3 puntos numerados (1. 2. 3.) de hallazgos críticos — PROHIBIDO viñetas.\nPARTE B — Para el emprendedor (1 párrafo): usa PREDICTACORE_MISION. Deja claro: auditamos SOLO lo público (lo que ve el cliente), no datos internos; objetivo = dejar de perder visitantes; perfiles simulados según giro (OBJETIVO_SIMULACIONES). PROHIBIDO cantidad de simulaciones.\nPARTE C — Radiografía del negocio (2 párrafos): qué venden, a quién, modelo. PROHIBIDO diagnosticar aquí. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### II. PERFILES PSICOLÓGICOS (CLIENTES SIMULADOS POR GIRO)\nUsa GIRO_CLIENTE y PERFIL_* del dossier. 4 perfiles (escéptico, apurado, mobile, comparador). EXACTAMENTE 2 oraciones c/u: quién es en este giro + qué fricción de SIMULATION_RESULTS (#id) los haría abandonar. PROHIBIDO perfiles genéricos. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. Incluye OBLIGATORIAMENTE filas para: SEO Técnico, Visibilidad en IAs (GEO/AIO), Velocidad percibida. Usa scores del dossier como base. Diagnósticos de 3 líneas. Impacto cualitativo, sin $. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido: ### IV. VISIBILIDAD, SEO FORENSE Y DESCUBRIMIENTO POR IA\nOBLIGATORIO: Usa EXCLUSIVAMENTE SEO_FORENSICS, AI_VISIBILITY y KEYWORDS_INFERIDAS. NO inventes métricas ni volumen de búsqueda. Traduce etiquetas del dossier al idioma del reporte (ABSENT/FOUND/PRESENT en inglés; AUSENTE/ENCONTRADO/PRESENTE en español).\n\nSUBSECCIÓN A — Tabla SEO técnica real: | Señal | Valor detectado | Estado (OK/Riesgo/Crítico) | Impacto en conversión |. Incluye: Title, Meta Description, H1, Canonical, Sitemap, robots.txt, % Alt, JSON-LD, tiempo de carga.\n\nSUBSECCIÓN B — Keywords transaccionales inferidas (bloque KEYWORDS_INFERIDAS): lista las KW_1..N etiquetando "inferidas — sin volumen de mercado". PROHIBIDO incluir keywords de políticas legales/privacidad. Arquitectura H1/H2. Digital Sharecropping si aplica.\n\nSUBSECCIÓN C — ¿Cómo ven las IAs este activo? (evaluación técnica proxy, NO prueba en vivo): Tabla | Motor IA (GPT, Claude, Perplexity, Google AI) | ¿Puede citar/recomendar? | Evidencia del dossier | Riesgo |. Basado en robots.txt, llms.txt, Schema, extractabilidad.\n\nSUBSECCIÓN D — Veredicto GEO/AIO en 1 párrafo para el CEO. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### V. BENCHMARK COMPETITIVO\nOBLIGATORIO: Lee BENCHMARK_VERIFIED, UBICACION_MERCADO y PERFIL_NEGOCIO.\n- Competidores = mismo nicho comercial (categoría de producto/servicio del activo) Y mismo mercado geográfico (ciudad/región si LOCAL, mismo país si NATIONAL). PROHIBIDO competidores de otro país o región.\n- Si ESCALA=PYME_BOUTIQUE: PROHIBIDO Amazon, Walmart, Target, Costco u otros mega-retailers.\n- Si ESTADO=SIN_COMPETENCIA_IDENTIFICADA: NO uses tabla. Escribe 2-3 párrafos con MENSAJE_OBLIGATORIO.\n- Si COMP_1..3 existen: Tabla SOLO con esos dominios:\n| Criterio | Activo analizado | [COMP_1] | [COMP_2 si existe] | [COMP_3 si existe] |\n| **Qué hacen / What they do** | (1 frase) | (QUE_HACE COMP_1) | (COMP_2) | (COMP_3) |\n| Claridad de oferta | ... | ... | ... | ... |\n| Señales de confianza | ... | ... | ... | ... |\n| Visibilidad en IAs | ... | ... | ... | ... |\nPROHIBIDO dominios fuera del dossier. Máximo 2 frases por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VI. MATRIZ ESTRATÉGICA (ASISTIDA POR IA)\nFortalezas, Debilidades, Oportunidades, Amenazas (3-5 líneas cada una). Basada en dossier + SIMULATION_RESULTS. Si PERFIL_NEGOCIO=PYME_BOUTIQUE, amenazas/oportunidades solo vs competidores del nicho (COMP_*), PROHIBIDO citar Amazon/Walmart/Target. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VII. LISTA DE DESEOS DEL CLIENTE\nSimula 10 deseos de visitantes que entran por primera vez a esta página/perfil. ${FORMATO_LISTAS}\nFormato: 1. **Deseo:** "Ojalá pudiera…" / "I wish I could…" — qué les gustaría encontrar, ver o tener al llegar.\nPROHIBIDO: fixes técnicos (H1, Schema, alt text, robots.txt, SEO) — eso va en Acciones/Fugas.\nSÍ incluir: preview de personalización, tiempos de envío visibles, guía de tallas, fotos reales de clientes, filtros por tema, quiz de regalo, comparar productos, ver materiales seguros para bebé, etc.\nBasado en GIRO_DETECTADO y lo que vende el negocio. Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${PRIORIDAD_FUGAS}\nEscribe este encabezado traducido: ### VIII. 15 PUNTOS DE FUGA\nEXACTAMENTE 15 líneas numeradas 1. al 15. — PROHIBIDO viñetas • o -. PROHIBIDO códigos P1/P2/P3/P4. OBLIGATORIO: usa TODAS las líneas FALLAS_PRIORITARIAS de SIMULATION_RESULTS (#1..#15 máximo). PROHIBIDO evaluación #16+. PROHIBIDO texto placeholder tipo "Additional conversion leak not detected" o "not detected from available data". Si hay menos de 15 fallas, expande con evidencia forense del dossier (SEO_FORENSICS, capturas). ${FORMATO_LISTAS}. Impacto cualitativo — PROHIBIDO $. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IX. 15 ACCIONES TÁCTICAS\nEXACTAMENTE 15 líneas numeradas del 1. al 15. — PROHIBIDO viñetas • o -. La acción 1 resuelve la fuga 1, la 2 la fuga 2, etc. Formato: 1. **[Título breve]:** pasos concretos. ${FORMATO_LISTAS}. **[COPIAR Y PEGAR]:** cuando aplique.\nOBLIGATORIO — Acción 1 o 2 titulada **Visibilidad en IAs (GEO/AIO)**: pasos según AI_VISIBILITY (llms.txt, Schema, robots.txt bots, FAQ schema). Incluye texto listo para robots.txt o llms.txt si faltan.\nDossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### X. HERRAMIENTAS DE ESCALA\n5 SaaS con utilidad concreta (1 SEO, 1 GEO/AIO). Sin prometer ROI numérico. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS — ASISTIDA POR IA)\n3 fases × 3 pasos numerados (9 puntos total: 1. a 9.) basados en fugas y acciones anteriores. Fase 1: victorias rápidas SEO/IA. ${FORMATO_LISTAS} Dossier: ${d}`,
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR, PILARES_11 };
