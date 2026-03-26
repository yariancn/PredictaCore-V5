// cerebro.js - BÚNKER 2: HEURÍSTICA Y CONTROL DE EJECUCIÓN ESTRICTA

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque en la economía del comportamiento y conversión. Redacta un diagnóstico agudo del activo analizado y declara explícitamente su PAÍS/MERCADO OBJETIVO. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Diseña 4 perfiles de Gemelos Sintéticos. 
  REGLA INQUEBRANTABLE: Tienes ESTRICTAMENTE PROHIBIDO escribir más de 2 oraciones por perfil. Sé extremadamente conciso y directo, indicando quién es el gemelo y qué producto exacto busca. Dossier: ${d}`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown de 3 columnas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  REGLAS INQUEBRANTABLES:
  1. DEBES generar EXACTAMENTE 10 filas de evaluación, ni una menos.
  2. En la columna de Diagnóstico, usa MÁXIMO 3 líneas de texto fluido por celda. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  [INSTRUCCIÓN CRÍTICA: DEBES UTILIZAR LA HERRAMIENTA DE BÚSQUEDA DE GOOGLE AHORA MISMO para investigar el dominio y sus competidores reales en su país].
  Combina los DATOS DUROS de tu búsqueda con PROSA DE CONSULTOR usando esta estructura exacta:
  1. **Estatus de Reputación**: Indica la calificación de estrellas y reseñas.
  2. **Competidores Directos**: Nombra al país del activo y a 3 competidores reales.
  3. **Palabras Clave Transaccionales Perdidas**: Nombra 3 términos de búsqueda exactos.
  4. **Análisis SEO de Élite**: Redacta un párrafo profundo analizando el impacto de la fricción de mercado. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown comparando al activo con los 3 competidores dominantes de la sección IV. 
  REGLA INQUEBRANTABLE PARA NO ROMPER EL PDF: Tienes ESTRICTAMENTE PROHIBIDO escribir párrafos largos en la tabla. Evalúa cada punto de fricción usando MÁXIMO 3 líneas de texto por celda. Dossier: ${d}`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Desarrolla el análisis estructurado en Fortalezas, Debilidades, Oportunidades y Amenazas. Numera cada punto (1., 2., 3.). Dossier: ${d}`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Desarrolla 10 características tácticas de alto valor. Numera cada recomendación del 1 al 10. Dossier: ${d}`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]**. Numera estrictamente del 1 al 15. Dossier: ${d}`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Proporciona la solución exacta para sellar las 15 fugas. Numera estrictamente del 1 al 15. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda EXACTAMENTE 5 soluciones SaaS específicas. Numera del 1 al 5. Dossier: ${d}`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Desarrolla un cronograma dividido en 3 fases de 7 días. Numera los pasos de cada fase (1., 2., 3.) sin usar palabras como "Directiva". Dossier: ${d}`
};

module.exports = { PROMPTS };
