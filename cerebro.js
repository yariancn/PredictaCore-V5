// cerebro.js - BÚNKER 2: HEURÍSTICA Y CONTROL ESTRICTO DE LONGITUD PDF

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque en la economía del comportamiento y conversión. Redacta un diagnóstico agudo del activo analizado y declara explícitamente su PAÍS/MERCADO OBJETIVO. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Diseña 4 perfiles de Gemelos Sintéticos. 
  REGLA INQUEBRANTABLE: Tienes ESTRICTAMENTE PROHIBIDO escribir más de 2 oraciones por perfil. Sé extremadamente conciso y directo, indicando quién es el gemelo y qué producto exacto busca. Dossier: ${d}`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown de 3 columnas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  REGLA INQUEBRANTABLE PARA NO ROMPER EL PDF: En la columna de Diagnóstico, tienes ESTRICTAMENTE PROHIBIDO escribir párrafos largos. Usa MÁXIMO 3 líneas de texto fluido por celda. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense avanzado en Google. 
  DEBES combinar DATOS DUROS con PROSA DE CONSULTOR usando esta estructura exacta:
  1. **Estatus de Reputación**: Indica la calificación de estrellas y reseñas.
  2. **Competidores Directos**: Nombra al país del activo y luego a 3 competidores EXACTOS y reales de ese nicho.
  3. **Palabras Clave Transaccionales Perdidas**: Nombra 3 términos de búsqueda exactos.
  4. **Análisis SEO de Élite**: Redacta un párrafo profundo analizando el impacto de la fricción y estimando el porcentaje de capital evaporado por no capitalizar estas búsquedas. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown comparando al activo con los 3 competidores dominantes de la sección IV. 
  REGLA INQUEBRANTABLE PARA NO ROMPER EL PDF: Tienes ESTRICTAMENTE PROHIBIDO escribir párrafos largos en la tabla. Evalúa cada punto de fricción usando MÁXIMO 3 líneas de texto por celda. Dossier: ${d}`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Desarrolla el análisis estructurado en Fortalezas, Debilidades, Oportunidades y Amenazas. Redacta cada punto con inteligencia de negocios. Dossier: ${d}`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Desarrolla 10 características tácticas de alto valor que revolucionarían la conversión del activo. Explica el "por qué" psicológico y técnico detrás de cada recomendación. Dossier: ${d}`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]**. Mantén un tono implacable, señalando exactamente dónde y por qué el activo está perdiendo capital. Dossier: ${d}`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Proporciona la solución de ingeniería, diseño o negocio exacta para sellar cada una de las 15 fugas encontradas. Sé directivo, claro y proporciona la ruta de ejecución sin rodeos. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones SaaS específicas y avanzadas para este modelo de negocio. Justifica cada herramienta explicando qué cuello de botella operativo o de conversión viene a resolver. Dossier: ${d}`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Desarrolla un cronograma táctico de choque dividido en 3 fases de 7 días. Redacta las directivas con tono ejecutivo, priorizando la contención de daños. Dossier: ${d}`
};

module.exports = { PROMPTS };
