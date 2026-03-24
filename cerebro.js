// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (VERSIÓN ORO MOLIDO + FORMATO PREMIUM)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores. Al final, redacta un breve resumen exclusivo de quién es y qué hace el activo analizado (ya sea web, red social o idea). NO escribas nada más. NO incluyas valores financieros. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles basados en el activo. Pon el tipo de perfil en **negritas**. En ese mismo párrafo, redacta una breve descripción de lo que buscan. Prohibido usar nombres propios, 'Motivación Primaria' o 'Valor Esperado'.`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown usando barras (|) de 4 columnas exactas: | Punto de Salud | Calificación (1-10) | Estado | Justificación Forense |. 
  Evalúa los 10 puntos de salud comercial del activo (diseño, estrategia o viabilidad). En la columna "Justificación Forense", escribe de 3 a 5 líneas sobre por qué le diste esa calificación, forzando al texto a vivir dentro de la tabla. Usa colores (Verde, Amarillo, Rojo) en la columna Estado.`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense crudo basado en los datos reales de tu búsqueda en Google sobre este activo, nicho o idea. 
  1. Detalla su posición actual y reputación (ej. reseñas en Maps, o presencia general en la red).
  2. Identifica a los depredadores reales: Nombra a 2 o 3 competidores específicos que están acaparando la primera página o pagando Ads.
  3. Menciona qué "Términos de Búsqueda Transaccional" exactos se están perdiendo y estima el porcentaje de capital o tráfico que se evapora por esta fricción de hallazgo. Cero teoría, puros datos tácticos.`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown usando barras (|) comparando el activo con 3 competidores DIRECTOS Y DEL MISMO NIVEL encontrados en Google (otras marcas independientes, clínicas locales o negocios de nicho similares a la idea). 
  ESTRICTAMENTE PROHIBIDO usar gigantes corporativos (Amazon, Etsy, Walmart, etc.). La tabla debe evaluar 3 puntos clave de fricción de cierre e incluir de 3 a 5 líneas de texto explicativo en cada celda con indicadores de colores.`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis estrictamente en formato de lista con viñetas limpias y elegantes. Divide la lista en 4 bloques: **Fortalezas**, **Debilidades**, **Oportunidades** y **Amenazas**. 
  Redacta de 3 a 5 líneas de explicación forense continua por cada punto. ESTRICTAMENTE PROHIBIDO usar tablas en esta sección para evitar la saturación visual.`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Enumera exactamente 10 deseos que faciliten la transacción o el éxito del activo. Cada deseo debe tener estrictamente entre 3 y 5 líneas de texto continuo. No menciones quién los pide ni uses 'demandas'.`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de diseño, estrategia o viabilidad del negocio. Cada fuga debe tener estrictamente entre 3 y 5 líneas de texto continuo, explicando a fondo el hallazgo y el capital que drena.`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos anteriores. Tienes ESTRICTAMENTE PROHIBIDO desconectar la acción de la fuga. 
  Inicia cada punto exactamente con este formato: Acción X (Sella la Fuga X): **[Nombre de la Fuga o Hallazgo]**. 
  Cada acción táctica debe tener estrictamente entre 3 y 5 líneas de texto continuo. Cero tecnicismos.`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas para optimizar el cierre, la gestión o la comunicación del activo.`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Crea un cronograma táctico de choque de 21 días. PROHIBIDO hacer resúmenes vagos de "Semana 1, Semana 2". 
  Debes agrupar la resolución de las fugas detectadas en bloques de días precisos y mencionar EXPLÍCITAMENTE qué números de fugas se están tapando en cada fase. 
  Ejemplo de formato obligatorio: Días 1-4: Sellado de Fugas Críticas (Ataque a las Fugas 3, 7 y 9) - [Explicación de 3 a 5 líneas]. Mantén una tensión operativa implacable.`
};

module.exports = { PROMPTS };
