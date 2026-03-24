// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (Aislado de las reglas de formato)

const PROMPTS = {
  INTRO: (d) => `### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores que la consultoría tradicional o una IA genérica. Al final de la introducción, redacta un breve resumen exclusivo de quién es y qué hace el activo analizado. NO escribas nada más. NO incluyas valores financieros. Dossier: ${d}`,

  GEMELOS: (d) => `### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles basados en el activo. Pon el título del perfil en **negritas** (ej. **Madre de familia**, **Deportista de alto rendimiento**). En ese mismo párrafo y de forma seguida, redacta una breve descripción de lo que buscan. Prohibido usar nombres propios. Prohibido usar los títulos 'Motivación Primaria' o 'Valor Esperado'.`,

  SCORECARD: (d) => `### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla con colores evaluando los 10 puntos de salud comercial. Verde para Óptimo, Amarillo para Necesario, Rojo para Urgente. Califica de 1 a 10.`,

  VISIBILIDAD: (d) => `### IV. VISIBILIDAD EXTERNA
  Realiza un análisis profundo y detallado de la brecha de intención en el buscador. Explica exhaustivamente cómo clasifica el algoritmo al activo, qué información vital está bloqueada (detalla el problema de las imágenes sin descripción) y explica la pérdida de capital por la falta de términos transaccionales.`,

  BENCHMARK: (d) => `### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla comparativa con 3 competidores. Debes evaluar 3 puntos clave para cada uno e incluir indicadores de colores para mostrar visualmente quién domina la Facilidad de Cierre.`,

  SWOT: (d) => `### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis estrictamente en una tabla Markdown de 4 columnas exactas: | Fortalezas | Debilidades | Oportunidades | Amenazas |.`,

  WISHLIST: (d) => `### VII. LISTA DE DESEOS
  Enumera exactamente 10 deseos que faciliten la transacción en el sitio. Cada uno de los 10 deseos debe estar desarrollado en un mínimo de 3 líneas y un máximo de 5 líneas de texto. No menciones quién los pide y no uses la palabra 'demandas'.`,

  FUGAS: (d) => `### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de diseño o negocio. ¡MUY IMPORTANTE!: Prohibido iniciar los puntos con "Se ha identificado". Cada fuga debe tener estrictamente entre 3 y 5 líneas de texto de longitud, explicando a fondo el hallazgo y el problema real que causa.`,

  ACCIONES: (d) => `### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos anteriores vinculados 1:1. 
  ¡MUY IMPORTANTE!: Dale un formato decente, limpio y humano (usa viñetas o negritas para separar la falla de la acción, pero PROHIBIDO usar el formato feo de "HALLAZGO: | ACCIÓN: | PRIORIDAD:"). 
  Cada acción táctica debe tener estrictamente entre 3 y 5 líneas de texto explicativo. Las explicaciones deben ser cero técnicas y 100% entendibles para el dueño del negocio.`,

  HERRAMIENTAS: (d) => `### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas para optimizar el cierre y la comunicación del activo.`,

  OMNI: (d) => `### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Plan de implementación profesional: Semana 1 (Estabilización), Semana 2 (Confianza), Semana 3 (Cierre).`
};

module.exports = { PROMPTS };
