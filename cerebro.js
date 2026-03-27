// cerebro.js - BÚNKER 2: FORMATO PDF ESTRICTO Y SEO DE PRIMERA PÁGINA

const PROMPTS = {
  INTRO: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### I. INTRODUCCIÓN Y RESUMEN DEL ACTIVO
Explica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque. Redacta un diagnóstico agudo del activo analizado y declara explícitamente su PAÍS/MERCADO OBJETIVO. Dossier: ${d}`,

  GEMELOS: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### II. PERFILES PSICOLÓGICOS
Diseña 4 perfiles de Gemelos Sintéticos. REGLA INQUEBRANTABLE: Escribe MÁXIMO 2 oraciones por perfil. Dossier: ${d}`,

  SCORECARD: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### III. SCORECARD DE SALUD COMERCIAL
Presenta una tabla Markdown ESTRICTAMENTE con esta cabecera exacta:
| Punto de Salud | Calificación (1-10) | Diagnóstico Forense |
|---|---|---|
REGLAS INQUEBRANTABLES:
1. Genera EXACTAMENTE 10 filas de evaluación completas.
2. TIENES ESTRICTAMENTE PROHIBIDO usar saltos de línea (Enter) dentro de las celdas de la tabla. Todo el texto de una celda debe ir en una sola línea continua para no romper el formato. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### IV. VISIBILIDAD EXTERNA
[INSTRUCCIÓN CRÍTICA: UTILIZA LA HERRAMIENTA GOOGLE SEARCH EN ESTE MOMENTO. Realiza una búsqueda real de las palabras clave transaccionales del activo (ej. "custom baby crib bedding" en el país destino) para ver quién domina la primera página de resultados].
Escribe con esta estructura exacta (NO uses títulos principales adicionales):
1. **Estatus de Reputación**: Analiza la reputación basándote en el dossier.
2. **Competidores Reales en Google (SERP)**: Nombra los 3 dominios reales que actualmente ocupan los primeros lugares orgánicos en Google para el nicho del activo.
3. **Fricción de Búsqueda**: Nombra 3 palabras clave transaccionales exactas que el cliente está perdiendo.
4. **Análisis SEO de Élite**: Redacta el impacto financiero de ceder la primera página a los competidores reales identificados. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
Elige a 3 competidores reales y reconocidos del nicho. Presenta una tabla Markdown ESTRICTAMENTE con esta estructura (Reemplaza "Comp 1", etc., por los nombres reales):
| Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |
|---|---|---|---|---|
REGLAS INQUEBRANTABLES: 
1. TIENES ESTRICTAMENTE PROHIBIDO usar saltos de línea (Enter) dentro de las celdas. 
2. Evalúa 3 puntos de fricción. Dossier: ${d}`,

  SWOT: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VI. MATRIZ ESTRATÉGICA
Desarrolla el análisis en Fortalezas, Debilidades, Oportunidades y Amenazas. Inicia cada viñeta estrictamente con un número (ejemplo: 1., 2., 3.). Dossier: ${d}`,

  WISHLIST: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VII. LISTA DE DESEOS
Desarrolla 10 características tácticas de alto valor. Inicia cada punto estrictamente con un número (1., 2., 3.). Dossier: ${d}`,

  FUGAS: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VIII. 15 PUNTOS DE FUGA
Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]**. Inicia cada punto estrictamente con un número (1., 2., 3. hasta el 15.). Dossier: ${d}`,

  ACCIONES: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
Proporciona la solución exacta para sellar las 15 fugas. Inicia cada punto estrictamente con un número (1., 2., 3. hasta el 15.). Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### X. HERRAMIENTAS DE ESCALA
Recomienda EXACTAMENTE 5 soluciones SaaS específicas. Inicia cada punto estrictamente con un número (1., 2., 3., 4., 5.). Dossier: ${d}`,

  OMNI: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
Desarrolla un cronograma dividido en 3 fases de 7 días. Inicia cada paso con un número (1., 2., 3.). Dossier: ${d}`
};

module.exports = { PROMPTS };
