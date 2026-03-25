// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (VERSIÓN ORO MOLIDO + FRANCOTIRADOR)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores. Al final, redacta un breve resumen exclusivo de quién es el activo analizado, qué hace y DEBES identificar explícitamente su PAÍS / MERCADO OBJETIVO (Geografía). 
  ¡ALERTA CRÍTICA!: DETENTE AQUÍ. Tienes ESTRICTAMENTE PROHIBIDO generar Fugas, Acciones o cualquier otra sección. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles de Gemelos Sintéticos basados en el activo. Pon el nombre del perfil en **negritas**. Redacta MÁXIMO 2 ORACIONES FLUIDAS por perfil indicando quién es y qué producto exacto viene a buscar. PROHIBIDO usar el formato "busca X, teme Y". Habla con naturalidad.`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown usando barras (|) de 3 columnas exactas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  Evalúa los 10 puntos de salud comercial. Escribe de 3 a 5 líneas de texto continuo dentro de cada celda de diagnóstico.`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense basado en Google. Imprime DATOS DUROS y respeta el ANCLA GEOGRÁFICA:
  1. Imprime la calificación exacta de estrellas y el número de reseñas en Maps o red.
  2. Nombra el PAÍS/MERCADO del activo. Luego, nombra a 3 competidores REALES DE ESE MISMO PAÍS que acaparan la primera página. PROHIBIDO mezclar países.
  3. Enlista 3 "Palabras Clave Transaccionales" exactas que pierde en su región.
  4. Estima el porcentaje de capital evaporado por esta fricción.`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown usando barras (|) comparando el activo. OBLIGATORIO Y REGLA CRÍTICA: COPIA Y PEGA EXACTAMENTE LOS MISMOS 3 COMPETIDORES que nombraste en la sección IV. Tienes ESTRICTAMENTE PROHIBIDO inventar nombres nuevos o mezclarlos. Evalúa 3 puntos de fricción e incluye de 3 a 5 líneas de texto en cada celda.`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis en formato de lista. OBLIGATORIO: Inicia cada punto con un guion (-) para crear una viñeta Markdown. Divide la lista en 4 bloques: **Fortalezas**, **Debilidades**, **Oportunidades** y **Amenazas**. Redacta de 3 a 5 líneas continuas por punto. PROHIBIDO usar tablas.`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Enumera 10 características de alto valor. OBLIGATORIO: Inicia cada punto con un guion (-) para crear una viñeta limpia. Cada punto debe tener de 3 a 5 líneas continuas. PROHIBIDO usar lenguaje romántico ("yo desearía"). Sé objetivo. PROHIBIDO usar tablas.`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos. REGLA DEL FRANCOTIRADOR: Elige 1 o máximo 2 fugas letales e invisibles (ej. errores técnicos, código, carga) y márcalas como **[HEMORRAGIA CRÍTICA]**. Solo para estas, rompe la regla de longitud y explica a fondo: 1. El Síntoma, 2. La Causa Raíz técnica, 3. El Impacto. Para las 13 fugas restantes, mantenlo rápido y táctico (3 a 5 líneas). OBLIGATORIO: Inicia CADA fuga con un guion (-) para crear viñeta.`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos yendo directo a la solución. OBLIGATORIO: Inicia cada acción con un guion (-) para crear una viñeta, usando este formato: - Acción X (Sella la Fuga X): **[Nombre del Hallazgo]**. Cada acción debe tener de 3 a 5 líneas continuas. PROHIBIDO usar tablas.`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas. OBLIGATORIO: Inicia cada recomendación con un guion (-) para crear una viñeta. Cada punto debe tener de 3 a 5 líneas. PROHIBIDO usar tablas.`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Crea un cronograma táctico de choque de 21 días. REGLA INQUEBRANTABLE: Inicia CADA FASE exactamente con el símbolo de un guion seguido de un espacio (- ) para forzar la creación de una viñeta Markdown. Integra la resolución con redacción fluida. PROHIBIDO usar tablas.`
};

module.exports = { PROMPTS };
