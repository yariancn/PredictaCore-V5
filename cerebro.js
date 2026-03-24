// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (Actualizado)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores. Al final, redacta un breve resumen exclusivo de quién es y qué hace el activo analizado. NO escribas nada más. NO incluyas valores financieros. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles basados en el activo. Pon el tipo de perfil en **negritas**. En ese mismo párrafo, redacta una breve descripción de lo que buscan. Prohibido usar nombres propios, 'Motivación Primaria' o 'Valor Esperado'.`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown usando barras (|) de 4 columnas exactas: | Punto de Salud | Calificación (1-10) | Estado | Justificación Forense |. 
  Evalúa los 10 puntos de salud comercial. En la columna "Justificación Forense", debes escribir una explicación detallada de 3 a 5 líneas sobre por qué le diste esa calificación, para que el texto viva dentro de la tabla. Usa colores (Verde, Amarillo, Rojo) en la columna Estado.`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un análisis profundo y crudo de cómo el robot de Google rastrea este sitio. 
  Debes mencionar exactamente qué "Términos de Búsqueda Transaccional" (palabras clave de alta intención de compra) está perdiendo el activo frente a su competencia directa. 
  Explica cómo la falta de optimización (imágenes vacías, títulos genéricos) causa ceguera al buscador y cómo esto se traduce directamente en capital regalado a otros negocios locales o de nicho.`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown usando barras (|) comparando el activo con 3 competidores DIRECTOS Y DEL MISMO NIVEL (otras tiendas Shopify independientes, clínicas locales o negocios de nicho). 
  TIENES ESTRICTAMENTE PROHIBIDO usar gigantes corporativos (como Amazon, Etsy, Walmart, Target, Pottery Barn, etc.). 
  La tabla debe evaluar 3 puntos clave de fricción de cierre e incluir texto explicativo detallado en cada celda con indicadores de colores.`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis estrictamente en una tabla Markdown de 4 columnas exactas usando barras (|): | Fortalezas | Debilidades | Oportunidades | Amenazas |.`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Enumera exactamente 10 deseos que faciliten la transacción. Cada deseo debe tener estrictamente entre 3 y 5 líneas de texto continuo. No menciones quién los pide ni uses 'demandas'.`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos. Cada fuga debe tener estrictamente entre 3 y 5 líneas de texto continuo, explicando a fondo el hallazgo y el problema real que causa.`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos. Cada acción debe tener estrictamente entre 3 y 5 líneas de texto continuo. Usa el nombre del hallazgo en **negritas** seguido de la explicación. Cero tecnicismos.`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas para optimizar el cierre y la comunicación del activo.`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Plan de implementación profesional: Semana 1 (Estabilización), Semana 2 (Confianza), Semana 3 (Cierre).`
};

module.exports = { PROMPTS };
