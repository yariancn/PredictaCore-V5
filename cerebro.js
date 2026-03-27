// cerebro.js - BÚNKER 2: SEO LIBERADO, INTRODUCCIÓN HÍBRIDA Y FORMATO ESTRICTO

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (como manchas o defectos) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad y SEO).";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RADIOGRAFÍA DEL ACTIVO\nRedacta esta sección estructurada estrictamente en dos partes:\nPÁRRAFO 1: Explica con autoridad quiénes somos (PredictaCore) y nuestra metodología (auditar Fricción Cognitiva, Fricción Transaccional y Fugas de Autoridad para proteger el capital).\nPÁRRAFO 2 y 3: Describe profundamente el activo analizado: qué venden, a qué mercado apuntan y cuál es su modelo de negocio. PROHIBIDO mencionar hallazgos o errores aquí. Solo describe la empresa y nuestra firma. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. PROHIBIDO usar saltos de línea en celdas. Evalúa estrictamente puntos MACRO de negocio (Claridad de Oferta, Fricción Transaccional, Autoridad, Tangibilidad). Diagnósticos de 3 líneas. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen) con un tono financiero y agresivo. NO TE LIMITES A UNA LISTA. Redacta un ensayo profundo y fluido evaluando:\n- La Fuga de Cuota de Mercado (Market Share) y el costo de ser invisible orgánicamente.\n- La Fricción de Autoridad: AQUÍ SÍ DEBES USAR LAS RESEÑAS para explicar cómo los defectos destruyen la conversión.\n- Hemorragia de Indexación Técnica: Usa jerga técnica (Crawl Budget, ausencia de silos H1/H2, canibalización).\n- Vulnerabilidad de depender de Etsy.\n[OBLIGATORIO]: Integra en tu redacción 3 "Long-Tail Keywords" transaccionales exactas que están perdiendo. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones cortas por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). INSTRUCCIÓN DE FORMATO: Inicia CADA viñeta estrictamente con un NÚMERO, un PUNTO y un ESPACIO (ejemplo: "1. ", "2. "). Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). INSTRUCCIÓN DE FORMATO: Inicia cada punto estrictamente con un NÚMERO, un PUNTO y un ESPACIO (ejemplo: "1. ", "2. " al "10. "). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. INSTRUCCIÓN DE FORMATO: Inicia cada punto estrictamente con un NÚMERO, un PUNTO y un ESPACIO (ejemplo: "1. ", "2. " al "15. ").\n2. Evalúa ERRORES MICRO (botones, usabilidad, contraste, carga) basándote en las imágenes y el dossier. Explica el impacto financiero de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: INSTRUCCIÓN DE FORMATO: Inicia cada punto estrictamente con un NÚMERO, un PUNTO y un ESPACIO (ejemplo: "1. ", "2. " al "15. "). Incluye acciones claras de rediseño UX/UI. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). INSTRUCCIÓN DE FORMATO: Inicia cada punto con NÚMERO, PUNTO y ESPACIO ("1. ", "2. " al "5. "). Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase. INSTRUCCIÓN DE FORMATO: Inicia cada paso con NÚMERO, PUNTO y ESPACIO ("1. ", "2. ", "3. "). Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
