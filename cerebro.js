// cerebro.js - BÚNKER 2: SEO OXYGEN, INTRODUCCIÓN ROBUSTA Y REGLA ANTI-REPETICIÓN

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const REGLA_ANTI_LORO = "REGLA DE VARIEDAD EXTREMA: Tienes estrictamente prohibido usar el mismo hallazgo (ej. una oferta caducada específica o una reseña específica) en más de dos secciones del reporte. Oblígate a auditar todos los ángulos: código, jerarquía visual, usabilidad, arquitectura de información y propuesta de valor.";

const PROMPTS = {
  INTRO: (d) => `Escribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO\nExplica con autoridad de consultor de élite nuestra metodología en PredictaCore: auditar Fricción Cognitiva, Fricción Transaccional y Fugas de Autoridad para proteger el capital. Luego, redacta un diagnóstico agudo del activo (3 a 5 líneas por idea). [OBLIGATORIO VISIÓN: Analiza las capturas adjuntas. Critica la estética funcional y UX/UI: botones poco claros, falta de jerarquía o problemas de usabilidad]. Dossier: ${d}`,

  GEMELOS: (d) => `Escribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos enfocados en sus motivaciones de compra. REGLA INQUEBRANTABLE: Escribe EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `Escribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. PROHIBIDO usar saltos de línea en celdas. Diagnósticos de 3 líneas. [OBLIGATORIO VISIÓN: 3 puntos deben criticar usabilidad vista en las imágenes]. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Escribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen). REGLA DE ORO: TIENES ESTRICTAMENTE PROHIBIDO MENCIONAR RESEÑAS, TESTIMONIOS O MARKETPLACES (como Etsy) EN ESTA SECCIÓN. Escribe con esta estructura:\n1. **Cuota de Mercado Orgánico**: Analiza la pérdida de tráfico frente a competidores gigantes que acaparan el nicho.\n2. **Arquitectura de Indexación**: Critica la falta de estructura técnica SEO (ausencia de H1/H2 optimizados, descripciones pobres) y su impacto en el rastreo de Google.\n3. **Brechas de Palabras Clave (Keywords)**: Nombra 3 "Long-Tail Keywords" transaccionales exactas que el negocio está perdiendo.\n4. **Costo de Invisibilidad**: Redacta el impacto financiero de ceder la primera página de búsqueda a la competencia y depender de canales pagados o directos. Dossier: ${d}`,

  BENCHMARK: (d) => `Escribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones cortas por celda. Dossier: ${d}`,

  SWOT: (d) => `Escribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). Inicia CADA viñeta con un NÚMERO y un PUNTO. Dossier: ${d}`,

  WISHLIST: (d) => `Escribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1. al 10.). Dossier: ${d}`,

  FUGAS: (d) => `Escribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1. al 15.).\n2. [OBLIGATORIO VISIÓN]: Identifica fugas estéticas y de usabilidad de las fotos adjuntas (botones que no invitan a la acción, mala jerarquía).\nExplica el impacto financiero de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `Escribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLAS:\n1. Inicia cada punto con un NÚMERO y un PUNTO (1. al 15.).\n2. [OBLIGATORIO VISIÓN]: Incluye acciones claras de rediseño UX/UI para arreglar la estética y usabilidad vista en las capturas.\nDossier: ${d}`,

  HERRAMIENTAS: (d) => `Escribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). Inicia cada punto con NÚMERO y PUNTO (1. al 5.). Dossier: ${d}`,

  OMNI: (d) => `Escribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase. Inicia cada paso con NÚMERO y PUNTO. Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_ANTI_LORO };
