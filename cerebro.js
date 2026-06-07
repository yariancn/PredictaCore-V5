// cerebro.js - BÚNKER 2: MULTILINGÜE ESTRICTO, SEO REAL Y VISIBILIDAD IA

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (como manchas o defectos) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad, SEO y Descubrimiento IA).";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: TIENES ESTRICTAMENTE PROHIBIDO usar viñetas simples (bullets como • o -). DEBES iniciar cada punto OBLIGATORIAMENTE con un NÚMERO seguido de un PUNTO y un ESPACIO. Ejemplo CORRECTO: '1. [Texto]'. Ejemplo INCORRECTO: '• [Texto]'.";

const PILARES_11 = "Los 11 Pilares PredictaCore: 1. Radiografía del Activo, 2. Perfiles Psicológicos, 3. Scorecard de Salud, 4. Visibilidad y SEO, 5. Benchmark Competitivo, 6. Matriz Estratégica, 7. Lista de Deseos, 8. 15 Puntos de Fuga, 9. 15 Acciones Tácticas, 10. Herramientas de Escala, 11. Hoja de Ruta 21 Días.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${PILARES_11}\nEscribe este encabezado traducido: ### I. INTRODUCCIÓN, RESUMEN EJECUTIVO Y RADIOGRAFÍA\nPARTE A — RESUMEN EJECUTIVO (OBLIGATORIO PRIMERO): Tabla Markdown con filas: Tiempo de carga (usa TIEMPO_CARGA_SEG del dossier), SEO técnico (usa SEO_TECNICO_SCORE), Visibilidad IA (usa AI_DISCOVERABILITY_SCORE), Veredicto forense (1 frase letal). Debajo, 3 bullets de hallazgos críticos sin repetir secciones posteriores.\nPARTE B — Identidad PredictaCore: modelos simbiópticos, 9,000+ simulaciones de fricción transaccional, superior a IA genérica.\nPARTE C — Radiografía del negocio (2 párrafos): qué venden, mercado, modelo. PROHIBIDO diagnosticar aquí. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. Incluye OBLIGATORIAMENTE filas para: SEO Técnico, Visibilidad en IAs (GEO/AIO), Velocidad percibida. Usa scores del dossier como base. Diagnósticos de 3 líneas. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido: ### IV. VISIBILIDAD, SEO FORENSE Y DESCUBRIMIENTO POR IA\nOBLIGATORIO: Usa EXCLUSIVAMENTE los bloques SEO_FORENSICS y AI_VISIBILITY del dossier (datos reales). NO inventes métricas.\n\nSUBSECCIÓN A — Tabla SEO técnica real: | Señal | Valor detectado | Estado (OK/Riesgo/Crítico) | Impacto financiero |. Incluye: Title, Meta Description, H1, Canonical, Sitemap, robots.txt, % Alt en imágenes, JSON-LD, tiempo de carga.\n\nSUBSECCIÓN B — Análisis narrativo SEO (Nivel Oxygen): indexación, arquitectura H1/H2, long-tail keywords transaccionales (3 exactas inferidas del negocio), Digital Sharecropping si aplica.\n\nSUBSECCIÓN C — ¿Cómo ven las IAs este activo?: Tabla | Motor IA (GPT, Claude, Perplexity, Google AI) | ¿Puede citar/recomendar? | Evidencia del dossier | Riesgo |. Evalúa robots.txt vs bots IA, llms.txt, Schema.org, extractabilidad del texto, meta noindex.\n\nSUBSECCIÓN D — Veredicto GEO/AIO en 1 párrafo agresivo para el CEO. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige 3 competidores reales del nicho. Tabla: | Criterio | Activo Analizado | Comp 1 | Comp 2 | Comp 3 |. Incluye fila "Visibilidad en IAs". Máximo 2 oraciones por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VI. MATRIZ ESTRATÉGICA\nFortalezas, Debilidades, Oportunidades, Amenazas (3-5 líneas). ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3-5 líneas). ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VIII. 15 PUNTOS DE FUGA\n15 hallazgos críticos. Marca peores como **[HEMORRAGIA CRÍTICA]**. ${FORMATO_LISTAS}. Usa IMÁGENES adjuntas + dossier. Impacto financiero en cada punto. Regla Shop Pay vs carrito según contexto. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IX. 15 ACCIONES TÁCTICAS\nSolución exacta a las 15 fugas. ${FORMATO_LISTAS}. **[COPIAR Y PEGAR]:** cuando aplique.\nOBLIGATORIO — Acción #1 o #2 titulada **Visibilidad en IAs (GEO/AIO)**: pasos concretos según AI_VISIBILITY (llms.txt, Schema LocalBusiness/Organization, desbloquear GPTBot/PerplexityBot en robots.txt, meta descripción citables, FAQ schema). Incluye texto listo para robots.txt o llms.txt si faltan.\nDossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### X. HERRAMIENTAS DE ESCALA\n5 SaaS con ROI (incluye 1 herramienta SEO y 1 para monitoreo GEO/AIO). ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases × 3 pasos. Fase 1 debe incluir quick-win SEO/IA. ${FORMATO_LISTAS} Dossier: ${d}`,
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR, PILARES_11 };
