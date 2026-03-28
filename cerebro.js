// cerebro.js - BÚNKER 2: FORMATO EXTREMO Y SEO TRADUCIDO

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (como manchas o defectos) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad y SEO).";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO INQUEBRANTABLE: DEBES poner un PUNTO seguido de un ESPACIO después de cada número en las listas, incluso si usas corchetes. Ejemplo CORRECTO: '1. [HEMORRAGIA CRÍTICA] Texto'. Ejemplo INCORRECTO: '1 [HEMORRAGIA CRÍTICA] Texto'.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RADIOGRAFÍA DEL ACTIVO\nRedacta esta sección estructurada estrictamente en dos partes:\nPÁRRAFO 1 (Nuestra Identidad): Explica con autoridad, agresividad y un tono de élite quiénes somos (PredictaCore). DEBES mencionar OBLIGATORIAMENTE que utilizamos "modelos simbiópticos" y que corremos "más de 9,000 simulaciones de fricción transaccional". Explica claramente por qué este reporte es infinitamente superior a lo que entregaría una IA genérica o un despacho de consultoría tradicional.\nPÁRRAFOS 2 y 3 (Radiografía): Describe profundamente el activo analizado: qué venden, a qué mercado apuntan y cuál es su modelo de negocio. PROHIBIDO mencionar hallazgos, errores o diagnósticos aquí. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. PROHIBIDO usar saltos de línea en celdas. Evalúa estrictamente puntos MACRO de negocio (Claridad de Oferta, Fricción Transaccional, Autoridad, Tangibilidad). Diagnósticos de 3 líneas. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen) con un tono financiero y agresivo. NO TE LIMITES A UNA LISTA. Redacta un ensayo profundo y fluido evaluando:\n- La Fuga de Cuota de Mercado (Market Share) y el costo de ser invisible orgánicamente.\n- La Fricción de Autoridad: AQUÍ SÍ DEBES USAR LAS RESEÑAS para explicar cómo los defectos destruyen la conversión.\n- Hemorragia de Indexación Técnica: Critica la falta de arquitectura SEO, pero DEBES EXPLICAR los tecnicismos en español de forma ejecutiva (ej. explica qué es el Presupuesto de Rastreo o Crawl Budget, la Canibalización de Palabras Clave y la falta de silos H1/H2).\n- Vulnerabilidad de depender de marketplaces externos (Arrendamiento Digital o Sharecropping).\n[OBLIGATORIO]: Integra en tu redacción 3 "Long-Tail Keywords" transaccionales exactas que están perdiendo. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones cortas por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. ${FORMATO_LISTAS}\n2. Evalúa ERRORES MICRO (botones, usabilidad, contraste, carga) basándote en las imágenes y el dossier. Explica el impacto financiero de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: ${FORMATO_LISTAS}. Incluye acciones claras de rediseño UX/UI. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
