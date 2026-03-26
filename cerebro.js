// cerebro.js - BÚNKER 2: HEURÍSTICA PURA (SIN RESTRICCIONES DE FORMATO)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque en la economía del comportamiento y conversión. Redacta un diagnóstico agudo del activo analizado, su modelo de negocio y declara explícitamente su PAÍS/MERCADO OBJETIVO basándote en la evidencia. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Diseña 4 perfiles de Gemelos Sintéticos. Redacta párrafos fluidos y persuasivos indicando quiénes son, su dolor principal y qué producto exacto vienen a buscar para aliviar la fricción. Habla con precisión psicológica forense. Dossier: ${d}`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown de 3 columnas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  Evalúa los 10 puntos críticos de conversión. En la columna de diagnóstico, redacta el hallazgo con profundidad analítica, justificando severamente cada calificación baja con la evidencia encontrada. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense avanzado de SEO y huella digital en Google, respetando el mercado local del activo.
  INSTRUCCIÓN CRÍTICA DE CALIDAD: Redacta con extrema profundidad analítica, evaluando la fricción de mercado, la pérdida de autoridad frente a competidores directos y la fuga de palabras clave transaccionales de alta intención. No uses listas telegráficas; escribe prosa de consultor estratégico.
  REGLA DE AISLAMIENTO: Este análisis técnico de SEO debe vivir ÚNICAMENTE en esta sección. Tienes estrictamente prohibido repetir esta información de posicionamiento en el resto del reporte. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown comparando al activo con los 3 competidores dominantes de su nicho. Evalúa 3 puntos de fricción estratégica (Ej. Tangibilidad de Oferta, Autoridad, Navegación) redactando un análisis comparativo profundo y fluido en cada celda. Dossier: ${d}`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Desarrolla el análisis transversal estructurado en Fortalezas, Debilidades, Oportunidades y Amenazas. Redacta cada punto con inteligencia de negocios, explicando el impacto directo en la rentabilidad y conversión del activo. Dossier: ${d}`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Desarrolla 10 características tácticas de alto valor que revolucionarían la conversión del activo. Explica el "por qué" psicológico y técnico detrás de cada recomendación y cómo impactaría directamente en el nodo de cierre. Dossier: ${d}`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]** y profundiza en su síntoma, causa raíz e impacto. Mantén un tono implacable, señalando exactamente dónde y por qué el activo está perdiendo capital. Dossier: ${d}`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Proporciona la solución de ingeniería, diseño o negocio exacta para sellar cada una de las 15 fugas encontradas. Sé directivo, claro y proporciona la ruta de ejecución sin rodeos. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones SaaS específicas y avanzadas para este modelo de negocio. Justifica cada herramienta explicando qué cuello de botella operativo o de conversión viene a resolver. Dossier: ${d}`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Desarrolla un cronograma táctico de choque dividido en 3 fases de 7 días. Redacta las directivas con tono ejecutivo, priorizando la contención de daños inmediatos en la primera fase y la optimización estructural en las siguientes. Dossier: ${d}`
};

module.exports = { PROMPTS };
