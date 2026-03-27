// cerebro.js - BÚNKER 2: MULTILINGÜE, VISIÓN ESTRICTA Y SEO OXYGEN

const IDIOMA = "INSTRUCCIÓN CRÍTICA Y ABSOLUTA: Detecta el idioma principal del sitio web analizado (basado en el Dossier y las Imágenes). DEBES redactar tu respuesta COMPLETA (incluyendo el encabezado, el análisis, las tablas y las viñetas) ESTRICTAMENTE en ese idioma detectado. Cero mezclas.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO\nExplica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque. Redacta un diagnóstico agudo (3 a 5 líneas por idea). [OBLIGATORIO VISIÓN: Analiza las capturas de pantalla adjuntas. Critica severamente la interfaz visual: señala botones que no son claros, espacios en negro horribles, mal contraste o desorden]. Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### II. PERFILES PSICOLÓGICOS\nDiseña 4 perfiles de Gemelos Sintéticos. Redacta de 3 a 5 líneas fluidas por perfil, profundizando en sus dolores y motivaciones de compra. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### III. SCORECARD DE SALUD COMERCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS INQUEBRANTABLES:\n1. EXACTAMENTE 10 filas.\n2. PROHIBIDO usar saltos de línea (Enter) dentro de las celdas.\n3. Diagnóstico de 3 a 5 líneas. [OBLIGATORIO VISIÓN: Al menos 3 puntos de salud deben criticar fallos visuales reales vistos en las imágenes, como botones ilegibles o espacios vacíos]. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IV. VISIBILIDAD EXTERNA Y SEO\nRealiza una Auditoría SEO Forense (Nivel Oxygen). Escribe con esta estructura (traduce los títulos):\n1. **Fricción de Autoridad**: Analiza la reputación y cómo las reseñas impactan la conversión orgánica (3 a 5 líneas).\n2. **Riesgo y Vulnerabilidad**: Evalúa el impacto financiero de depender de terceros (marketplaces, redes) en lugar de dominar la búsqueda orgánica propia (3 a 5 líneas).\n3. **Brechas de Palabras Clave (Keywords)**: Nombra 3 "Long-Tail Keywords" transaccionales exactas (en el idioma de la página) que el negocio está perdiendo.\n4. **Estrategia de Dominancia SERP**: Propón un plan de contenido agresivo para robarle tráfico orgánico a los líderes del nicho (3 a 5 líneas). Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho. Presenta una tabla Markdown. Traduce esta cabecera: | Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |\nREGLAS: NO usar saltos de línea (Enter) en celdas. Evalúa 3 puntos de fricción profundos (3 a 5 líneas por celda). Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas (3 a 5 líneas cada una). REGLA: Inicia CADA viñeta con un NÚMERO y un PUNTO (ejemplo: 1., 2.). Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VII. LISTA DE DESEOS\n10 características tácticas de alto valor (3 a 5 líneas). REGLA: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2. al 10.). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 hallazgos críticos de fricción. Marca las peores como **[HEMORRAGIA CRÍTICA]** (traduce la etiqueta). REGLA: Inicia cada punto con un NÚMERO y un PUNTO (1., 2. al 15.). [OBLIGATORIO VISIÓN: Identifica como fugas los defectos visuales de las fotos: botones poco claros, textos encimados, bloques negros]. Explica el impacto financiero de cada fuga (3 a 5 líneas). Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: Inicia cada punto con un NÚMERO y un PUNTO (1., 2. al 15.). [OBLIGATORIO: Incluye acciones claras de rediseño para los espacios negros o botones defectuosos]. (3 a 5 líneas por punto). Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### X. HERRAMIENTAS DE ESCALA\n5 soluciones SaaS (3 a 5 líneas justificando ROI). REGLA: Inicia cada punto con NÚMERO y PUNTO (1. al 5.). Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\nEscribe este encabezado traducido al idioma detectado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. REGLA: Inicia cada paso con NÚMERO y PUNTO (1., 2., 3.). Explica la ejecución en 3 a 5 líneas. Dossier: ${d}`
};

module.exports = { PROMPTS };
