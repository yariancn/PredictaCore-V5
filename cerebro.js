// cerebro.js - BÚNKER 2: FORMATO PDF 100% ESTRICTO Y SEO REAL

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
1. Genera EXACTAMENTE 10 filas.
2. TIENES ESTRICTAMENTE PROHIBIDO usar saltos de línea (Enter) dentro de las celdas, o romperás el código de la tabla. Todo el texto de una celda debe ir en una sola línea continua. Dossier: ${d}`,

  VISIBILIDAD: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### IV. VISIBILIDAD EXTERNA
[INSTRUCCIÓN CRÍTICA: DEBES UTILIZAR LA HERRAMIENTA DE BÚSQUEDA DE GOOGLE AHORA MISMO para investigar el dominio y extraer su Autoridad de Dominio (DA) y Tráfico Orgánico estimado].
Escribe con esta estructura exacta:
1. **Estatus de Reputación**: Indica estrellas y reseñas.
2. **Competidores Directos**: Nombra al país y a 3 competidores reales obtenidos de Google.
3. **Métricas SEO Duras**: Imprime la Autoridad de Dominio (DA) o el nivel de tráfico estimado.
4. **Análisis SEO de Élite**: Redacta el impacto de la fricción de mercado. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
Presenta una tabla Markdown ESTRICTAMENTE con esta cabecera exacta:
| Criterio de Análisis | Activo Analizado | Competidor 1 | Competidor 2 | Competidor 3 |
|---|---|---|---|---|
REGLA INQUEBRANTABLE: TIENES ESTRICTAMENTE PROHIBIDO usar saltos de línea (Enter) dentro de las celdas de la tabla. Escribe el análisis en una sola línea continua por celda. Evalúa 3 puntos de fricción. Dossier: ${d}`,

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
