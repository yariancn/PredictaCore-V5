// cerebro.js - BÚNKER 2: ESTRUCTURA DEL REPORTE (UNIVERSALIDAD SUPREMA + FORMATO ESTRICTO)

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
  Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores. Al final, redacta un breve resumen exclusivo de quién es el activo analizado, qué hace y DEBES identificar explícitamente su PAÍS / MERCADO OBJETIVO (Geografía). 
  ¡ALERTA CRÍTICA!: DETENTE AQUÍ. Tienes ESTRICTAMENTE PROHIBIDO generar secciones adicionales. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta con este encabezado: ### II. PERFILES PSICOLÓGICOS
  Genera 4 perfiles de Gemelos Sintéticos basados en el activo. 
  REGLA DE FORMATO ESTRICTA: Debes usar EXACTAMENTE esta estructura para los 4 perfiles:
  - **[Nombre del Perfil]**: [Máximo 2 oraciones fluidas indicando quién es y qué producto o servicio exacto viene a buscar].
  Habla con naturalidad y precisión forense.`,

  SCORECARD: (d) => `Inicia tu respuesta con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
  Presenta una tabla Markdown usando barras (|) de 3 columnas exactas: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 
  Evalúa los 10 puntos de salud comercial con profundidad analítica. 
  REGLA DE FORMATO ESTRICTA: Escribe de 3 a 5 líneas de texto continuo dentro de cada celda. Tienes ESTRICTAMENTE PROHIBIDO escribir tus diagnósticos en letras MAYÚSCULAS SOSTENIDAS. Usa mayúsculas y minúsculas de forma normal.`,

  VISIBILIDAD: (d) => `Inicia tu respuesta con este encabezado: ### IV. VISIBILIDAD EXTERNA
  Realiza un diagnóstico forense basado en Google. Imprime DATOS DUROS y respeta el ANCLA GEOGRÁFICA:
  HEURÍSTICA DE BÚSQUEDA UNIVERSAL: Antes de usar la herramienta de búsqueda, identifica la industria, el nicho exacto y el mercado del activo basándote en el dossier. Integra este contexto en tu búsqueda de Google para asegurar resultados precisos y relevantes al sector comercial, evitando coincidencias nominales irrelevantes.
  1. Imprime la calificación exacta de estrellas y el número de reseñas en Maps, redes o la plataforma correspondiente.
  2. Nombra el PAÍS/MERCADO del activo. Luego, nombra a 3 competidores REALES Y DIRECTOS DE ESE MISMO PAÍS que acaparan la primera página en ese nicho exacto.
  3. Enlista 3 "Palabras Clave Transaccionales" exactas que pierde en su región.
  4. Estima el porcentaje de capital evaporado por esta fricción.`,

  BENCHMARK: (d) => `Inicia tu respuesta con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Presenta una tabla Markdown usando barras (|) comparando el activo. OBLIGATORIO Y REGLA CRÍTICA: COPIA Y PEGA EXACTAMENTE LOS MISMOS 3 COMPETIDORES que nombraste en la sección IV. Evalúa 3 puntos de fricción estratégica e incluye de 3 a 5 líneas de análisis profundo en cada celda. PROHIBIDO usar MAYÚSCULAS SOSTENIDAS en la tabla.`,

  SWOT: (d) => `Inicia tu respuesta con este encabezado: ### VI. MATRIZ ESTRATÉGICA
  Presenta el análisis estratégico transversal. OBLIGATORIO: Enumera cada punto usando números (1., 2., 3.). Divide la lista en 4 bloques: **Fortalezas**, **Debilidades**, **Oportunidades** y **Amenazas**. Redacta de 3 a 5 líneas continuas por punto. PROHIBIDO usar tablas.`,

  WISHLIST: (d) => `Inicia tu respuesta con este encabezado: ### VII. LISTA DE DESEOS
  Enumera 10 características de alto valor que revolucionarían el activo. OBLIGATORIO: Enumera cada punto con un número (1., 2., 3., etc.). Cada punto debe tener de 3 a 5 líneas continuas de análisis táctico. PROHIBIDO usar tablas.`,

  FUGAS: (d) => `Inicia tu respuesta con este encabezado: ### VIII. 15 PUNTOS DE FUGA
  Identifica 15 hallazgos críticos de fricción. REGLA DEL FRANCOTIRADOR: Elige 1 o máximo 2 fugas letales e invisibles (ej. errores técnicos, código, carga) y márcalas como **[HEMORRAGIA CRÍTICA]**. Solo para estas, explica a fondo: Síntoma, Causa Raíz e Impacto en el usuario. Para las restantes, mantenlo agudo y rápido (3 a 5 líneas). OBLIGATORIO: Enumera las 15 fugas usando números (1., 2., 3., etc.). Pon el título de la fuga en **negritas**.`,

  ACCIONES: (d) => `Inicia tu respuesta con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
  Explica cómo corregir cada uno de los 15 hallazgos yendo directo a la solución de ingeniería o negocio. OBLIGATORIO: Enumera las 15 acciones usando números (1., 2., 3., etc.). Cada acción debe tener de 3 a 5 líneas continuas. PROHIBIDO usar tablas.`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta con este encabezado: ### X. HERRAMIENTAS DE ESCALA
  Recomienda 5 soluciones tecnológicas (SaaS) específicas para escalar este modelo de negocio en particular. OBLIGATORIO: Enumera cada recomendación con un número (1., 2., 3., 4., 5.). Cada punto debe tener de 3 a 5 líneas. PROHIBIDO usar tablas.`,

  OMNI: (d) => `Inicia tu respuesta con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Crea un cronograma táctico de choque de 21 días. REGLA INQUEBRANTABLE: Enumera cada fase con un número (1., 2., 3.) para forzar una lista numerada en formato HTML. Integra la resolución de las fugas con redacción ejecutiva. PROHIBIDO usar tablas.`
};

module.exports = { PROMPTS };
