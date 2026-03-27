// cerebro.js - BÚNKER 2: REGLA NUCLEAR DE RESEÑAS, SCORECARD MACRO Y FUGAS MICRO

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE AUDITORÍA: TIENES ESTRICTAMENTE PROHIBIDO mencionar reseñas de clientes, testimonios, o quejas (ej. manchas, problemas de envío) en NINGUNA PARTE del reporte, CON EXCEPCIÓN ÚNICA de la Sección IV (Visibilidad y SEO). Si usas reseñas en la Introducción, Scorecard, Fugas, Acciones o Roadmap, el reporte será un fracaso.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO\nExplica con autoridad de consultor de élite nuestra metodología en PredictaCore: auditar Fricción Cognitiva, Fricción Transaccional y Fugas de Autoridad para proteger el capital. Redacta un diagnóstico agudo del activo (3 a 5 líneas por idea). [OBLIGATORIO VISIÓN: Analiza las capturas adjuntas para criticar el diseño general]. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. PROHIBIDO usar saltos de línea en celdas.\n[INSTRUCCIÓN VITAL]: Este scorecard evalúa VALORES MACRO DEL NEGOCIO. Usa puntos como: Relevancia de la Oferta, Fricción en Nodo de Cierre, Tangibilidad del Producto, Jerarquía Cognitiva, Confianza de Marca. PROHIBIDO listar errores visuales pequeños aquí (eso es para las Fugas). Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen). AQUÍ SÍ DEBES USAR LAS RESEÑAS. Escribe con esta estructura:\n1. **Fricción de Autoridad**: Analiza las reseñas del dossier (quejas, defectos) y explica cómo esta mala reputación impacta y destruye la conversión orgánica (3 a 5 líneas).\n2. **Arquitectura de Indexación**: Critica la falta de estructura técnica SEO (H1/H2) y descripciones pobres.\n3. **Brechas de Palabras Clave (Keywords)**: Nombra 3 "Long-Tail Keywords" transaccionales exactas que el negocio está perdiendo.\n4. **Costo de Invisibilidad**: Redacta el impacto financiero de depender de terceros (Etsy) y ceder la búsqueda a la competencia. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones cortas por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). Inicia CADA viñeta con un NÚMERO y un PUNTO. Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1. al 10.). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1., 2., 3. al 15.).\n2. [INSTRUCCIÓN VITAL]: Evalúa ERRORES MICRO. Analiza las fotos y el código para hallar CTAs borrosos, textos duplicados, velocidad de carga, y problemas de usabilidad. PROHIBIDO repetir los conceptos Macro del Scorecard.\nExplica el impacto financiero de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: Inicia cada punto con un NÚMERO y un PUNTO (1., 2., 3. al 15.). Incluye acciones claras de rediseño UX/UI. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). Inicia cada punto con NÚMERO y PUNTO. Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase. Inicia cada paso con NÚMERO y PUNTO. Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
