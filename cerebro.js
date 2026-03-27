// cerebro.js - BÚNKER 2: INTRODUCCIÓN DESCRIPTIVA Y SEO NIVEL OXYGEN

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad y SEO).";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RADIOGRAFÍA DEL ACTIVO\nRedacta EXACTAMENTE dos párrafos. Describe ÚNICA Y EXCLUSIVAMENTE qué es el activo, qué vende, a qué mercado apunta y cuál es su modelo de negocio. REGLA INQUEBRANTABLE: TIENES ESTRICTAMENTE PROHIBIDO mencionar hallazgos, errores, fricciones o diagnósticos en esta sección. Los hallazgos van después. Solo describe la empresa de forma ejecutiva. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. PROHIBIDO usar saltos de línea en celdas.\n[INSTRUCCIÓN VITAL]: Esta tabla NO es un resumen de errores visuales. Es una auditoría de NEGOCIO. Evalúa estrictamente puntos macro como: Claridad de la Oferta, Fricción Transaccional (Checkout), Tangibilidad del Producto, Autoridad de Marca, e Incentivos de Cierre. Diagnósticos de 3 líneas. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen) con un tono financiero agresivo. AQUÍ SÍ DEBES USAR LAS RESEÑAS. Escribe con esta estructura:\n1. **Fuga de Cuota de Mercado (Market Share)**: Analiza el impacto financiero de ceder el tráfico orgánico a los líderes del sector por tener una autoridad de dominio débil (3 a 5 líneas).\n2. **Fricción de Autoridad (Reseñas)**: Usa las reseñas del dossier para explicar cómo una reputación frágil aniquila la tasa de conversión del poco tráfico orgánico que logra entrar (3 a 5 líneas).\n3. **Hemorragia de Indexación Técnica**: Critica con jerga técnica avanzada la falta de arquitectura SEO (Crawl Budget, ausencia de silos H1/H2, metadatos) y cómo esto hace al sitio "invisible" para el algoritmo de Google (3 a 5 líneas).\n4. **Brechas Transaccionales (Keywords)**: Nombra 3 "Long-Tail Keywords" transaccionales exactas de altísima intención de compra que el negocio está perdiendo.\n[REGLA: Usa tono de auditor de élite. PROHIBIDO dar consejos básicos]. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones cortas por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). Inicia CADA viñeta con un NÚMERO y un PUNTO. Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1. al 10.). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1., 2., 3. al 15.).\n2. [INSTRUCCIÓN VITAL]: Evalúa ERRORES MICRO. Analiza las fotos y el código para hallar CTAs borrosos, textos duplicados, velocidad de carga, y problemas de usabilidad. PROHIBIDO repetir los conceptos Macro del Scorecard.\nExplica el impacto financiero de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: Inicia cada punto con un NÚMERO y un PUNTO (1., 2., 3. al 15.). Incluye acciones claras de rediseño UX/UI para solucionar los problemas visuales detectados. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). Inicia cada punto con NÚMERO y PUNTO. Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase. Inicia cada paso con NÚMERO y PUNTO. Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
