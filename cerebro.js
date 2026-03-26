// cerebro.js - BÚNKER 2: ESTRUCTURA BLINDADA Y ANTI-ECO

const PROMPTS = {
  INTRO: (d) => `Explica con prosa de consultor de élite quiénes somos (PredictaCore) y nuestro enfoque en la economía del comportamiento y conversión. Redacta un diagnóstico agudo del activo analizado y declara explícitamente su PAÍS/MERCADO OBJETIVO. (NO uses encabezados ni títulos principales, ve directo a la redacción). Dossier: ${d}`,

  GEMELOS: (d) => `Diseña 4 perfiles de Gemelos Sintéticos. 
  REGLA INQUEBRANTABLE: Tienes ESTRICTAMENTE PROHIBIDO escribir más de 2 oraciones por perfil. Sé extremadamente conciso y directo, indicando quién es el gemelo y qué producto exacto busca. (NO uses encabezados ni títulos principales). Dossier: ${d}`,

  SCORECARD: (d) => `Presenta una tabla Markdown ESTRICTAMENTE con esta cabecera exacta (incluyendo los guiones separadores obligatorios para no romper el formato):
| Punto de Salud | Calificación (1-10) | Diagnóstico Forense |
|---|---|---|
REGLAS INQUEBRANTABLES:
1. DEBES generar EXACTAMENTE 10 filas de evaluación, ni una menos.
2. En la columna de Diagnóstico, usa MÁXIMO 3 líneas de texto fluido por celda. (NO uses encabezados ni títulos adicionales). Dossier: ${d}`,

  VISIBILIDAD: (d) => `[INSTRUCCIÓN CRÍTICA: DEBES UTILIZAR LA HERRAMIENTA DE BÚSQUEDA DE GOOGLE AHORA MISMO para investigar el dominio y sus competidores reales en su país].
Combina los DATOS DUROS de tu búsqueda con PROSA DE CONSULTOR usando esta estructura exacta (NO uses títulos principales):
1. **Estatus de Reputación**: Indica la calificación de estrellas y reseñas encontradas.
2. **Competidores Directos**: Nombra al país del activo y a 3 competidores reales.
3. **Palabras Clave Transaccionales Perdidas**: Nombra 3 términos de búsqueda exactos.
4. **Análisis SEO de Élite**: Redacta un párrafo profundo analizando el impacto de la fricción de mercado. Dossier: ${d}`,

  BENCHMARK: (d) => `Presenta una tabla Markdown ESTRICTAMENTE con esta cabecera exacta (incluyendo los guiones separadores obligatorios):
| Criterio de Análisis | Activo Analizado | Competidor 1 | Competidor 2 | Competidor 3 |
|---|---|---|---|---|
REGLA INQUEBRANTABLE PARA NO ROMPER EL PDF: Tienes ESTRICTAMENTE PROHIBIDO escribir párrafos largos en la tabla. Evalúa 3 puntos de fricción usando MÁXIMO 3 líneas de texto por celda. (NO uses encabezados ni títulos). Dossier: ${d}`,

  SWOT: (d) => `Desarrolla el análisis estructurado en Fortalezas, Debilidades, Oportunidades y Amenazas. Numera cada punto (1., 2., 3.). (NO uses encabezados principales). Dossier: ${d}`,

  WISHLIST: (d) => `Desarrolla 10 características tácticas de alto valor. Numera cada recomendación estrictamente del 1 al 10. (NO uses encabezados principales). Dossier: ${d}`,

  FUGAS: (d) => `Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]**. Numera cada punto estrictamente del 1 al 15. (NO uses encabezados principales). Dossier: ${d}`,

  ACCIONES: (d) => `Proporciona la solución exacta para sellar las 15 fugas. Numera cada punto estrictamente del 1 al 15. (NO uses encabezados principales). Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Recomienda EXACTAMENTE 5 soluciones SaaS específicas. Numera estrictamente del 1 al 5. (NO uses encabezados principales). Dossier: ${d}`,

  OMNI: (d) => `Desarrolla un cronograma dividido en 3 fases de 7 días. Numera los pasos de cada fase (1., 2., 3.) sin usar palabras corporativas como "Directiva". (NO uses encabezados principales). Dossier: ${d}`
};

module.exports = { PROMPTS };
