// cerebro.js - BÚNKER 2: ESTÁNDAR ORO (MULTILINGÜE, VISIÓN UX/UI, VARIEDAD ANALÍTICA)

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO\nExplica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque. Redacta un diagnóstico agudo (3 a 5 líneas por idea). [OBLIGATORIO VISIÓN: Analiza las capturas de pantalla adjuntas. Evalúa la estética funcional y UX/UI: critica si los botones (CTAs) no son claros, la falta de jerarquía visual o si el diseño general perjudica la usabilidad]. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos. Redacta de 3 a 5 líneas fluidas por perfil, profundizando en sus dolores y motivaciones de compra. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS INQUEBRANTABLES:\n1. EXACTAMENTE 10 filas.\n2. PROHIBIDO usar saltos de línea (Enter) dentro de las celdas.\n3. Diagnóstico de 3 a 5 líneas. [REGLA DE VARIEDAD: Menciona problemas de reseñas en máximo 1 punto. Usa el resto para criticar UX, botones, velocidad y diseño]. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense. Escribe con esta estructura (traduce los títulos):\n1. **Fricción de Autoridad**: Analiza la reputación de la marca (reseñas) y cómo impactan la conversión orgánica (3 a 5 líneas).\n2. **Riesgo y Vulnerabilidad**: Evalúa el impacto financiero de depender de terceros (marketplaces) frente a la búsqueda orgánica propia (3 a 5 líneas).\n3. **Brechas de Palabras Clave (Keywords)**: Nombra 3 "Long-Tail Keywords" transaccionales exactas que el negocio está perdiendo.\n4. **Estrategia de Dominancia SERP**: Propón un plan SEO TÉCNICO para la arquitectura del sitio (H1/H2, colecciones). (3 a 5 líneas). Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce esta cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea (Enter) en celdas. Sé conciso (máximo 2 oraciones por celda). Evalúa 3 puntos de fricción. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). REGLA: Inicia CADA viñeta con un NÚMERO y un PUNTO (ejemplo: 1., 2.). Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). REGLA: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2. al 10.). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]** (traduce la etiqueta). REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1., 2. al 15.).\n2. [REGLA DE VARIEDAD]: Menciona problemas de reseñas o testimonios en un MÁXIMO de 1 o 2 puntos. Destina el resto de los puntos a fallos de usabilidad, botones (CTAs) invisibles, problemas estéticos vistos en las fotos y fricción técnica.\nExplica el impacto financiero de cada fuga (3 a 5 líneas). Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1., 2. al 15.).\n2. [REGLA DE VARIEDAD]: Mismas reglas de variedad que en Fugas. Incluye acciones claras de rediseño UX/UI para arreglar la estética y hacer los botones funcionales.\n(3 a 5 líneas por punto). Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). REGLA: Inicia cada punto con NÚMERO y PUNTO (1. al 5.). Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. REGLA: DEBES generar EXACTAMENTE 3 pasos por cada fase. Inicia cada paso con NÚMERO y PUNTO (1., 2., 3.). Explica la ejecución en 3 a 5 líneas. Dossier: ${d}`
};

module.exports = { PROMPTS };
