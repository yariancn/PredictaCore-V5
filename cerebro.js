// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (VERSIÓN ORO MOLIDO + ANCLA GEOGRÁFICA)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores. Al final, redacta un breve resumen exclusivo de quién es el activo analizado, qué hace y DEBES identificar explícitamente su PAÍS / MERCADO OBJETIVO (Geografía). 
  ¡ALERTA CRÍTICA!: DETENTE AQUÍ. Tienes ESTRICTAMENTE PROHIBIDO generar Fugas, Acciones, Deseos o cualquier otra sección. NO escribas absolutamente nada más después de la introducción. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles de Gemelos Sintéticos basados en el activo. Pon el tipo de perfil en **negritas**. En ese mismo párrafo, describe a un comprador real de este nicho en exactamente 3 líneas fluidas: quién es, cuál es su necesidad transaccional inmediata y qué evidencia visual necesita. Cero plantillas robóticas de "busca X, teme Y".`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown usando barras (|) de 3 columnas exactas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  Evalúa los 10 puntos de salud comercial. REGLA DE CONGRUENCIA: Si la calificación es de 1 a 6, usa palabras como 'fuga' o 'riesgo'. Si es de 7 a 10, usa palabras como 'óptimo' o 'sólido'. Escribe de 3 a 5 líneas dentro de cada celda de diagnóstico.`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense basado en Google. Imprime DATOS DUROS y respeta el ANCLA GEOGRÁFICA:
  1. Imprime la calificación exacta de estrellas y el número de reseñas en Maps o red.
  2. Nombra el PAÍS/MERCADO del activo. Luego, nombra a 3 competidores REALES DE ESE MISMO PAÍS que están acaparando la primera página o pagando Ads. PROHIBIDO mezclar competidores de otros países.
  3. Enlista 3 "Palabras Clave Transaccionales" exactas que pierde en su región.
  4. Estima el porcentaje de capital evaporado por esta fricción.`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown usando barras (|) comparando el activo con los 3 competidores EXACTOS que acabas de nombrar en la sección IV. 
  OBLIGATORIO: ESTRICTAMENTE PROHIBIDO inventar competidores nuevos. Usa los mismos 3 de la sección anterior. Evalúa 3 puntos de fricción e incluye de 3 a 5 líneas de texto en cada celda.`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis estrictamente en formato de lista. OBLIGATORIO: Inicia cada punto con un guion (-) para crear una viñeta Markdown. 
  Divide la lista en 4 bloques: **Fortalezas**, **Debilidades**, **Oportunidades** y **Amenazas**. Redacta de 3 a 5 líneas continuas por punto. PROHIBIDO usar tablas.`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Enumera 10 características o innovaciones de alto valor para el activo. OBLIGATORIO: Inicia cada punto con un guion (-) para crear una viñeta limpia. Cada punto debe tener de 3 a 5 líneas continuas. PROHIBIDO listar errores a corregir o usar lenguaje romántico ("yo desearía"). Sé objetivo y directo. PROHIBIDO usar tablas.`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de diseño o sustancia. OBLIGATORIO: Inicia cada fuga con un guion (-) para crear una viñeta. Pon el título de la fuga en **negritas**. Cada fuga debe tener de 3 a 5 líneas continuas. PROHIBIDO usar tablas.`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos. OBLIGATORIO: Inicia cada acción con un guion (-) para crear una viñeta, usando este formato: - Acción X (Sella la Fuga X): **[Nombre del Hallazgo]**. Cada acción debe tener de 3 a 5 líneas continuas. PROHIBIDO usar tablas.`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas. OBLIGATORIO: Inicia cada recomendación con un guion (-) para crear una viñeta. Cada punto debe tener de 3 a 5 líneas. PROHIBIDO usar tablas.`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Crea un cronograma táctico de choque de 21 días. Inicia cada fase con un guion (-) para crear una viñeta. Integra la resolución de las fugas detectadas con una redacción ejecutiva y fluida. PROHIBIDO repetir mecánicamente la plantilla "(Ataque a las Fugas X, Y)". Nombra las fugas naturalmente. PROHIBIDO usar tablas.`
};

module.exports = { PROMPTS };
