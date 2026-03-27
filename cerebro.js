// cerebro.js - BÚNKER 2: FORMATO PDF ESTRICTO, TABLAS COMPACTAS Y SEO CONSULTIVO

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
[INSTRUCCIÓN CRÍTICA: Eres un consultor SEO de Élite. Analiza la situación del mercado basándote en la información del dossier y tu conocimiento del nicho de este negocio].
Escribe con esta estructura exacta, EN ESPAÑOL y sin títulos principales adicionales:
1. **Estatus de Reputación**: Analiza la percepción de la marca basándote estrictamente en las reseñas y datos de plataformas (como Etsy) presentes en el dossier.
2. **Amenaza Competitiva**: Identifica y nombra a 3 competidores dominantes reales de este nicho en su mercado objetivo, explicando brevemente por qué son una amenaza.
3. **Fuga de Tráfico (Palabras Clave)**: Nombra 3 términos de búsqueda transaccionales EN ESPAÑOL (ej. "mantas de bebé personalizadas") por los que el negocio debería estar compitiendo.
4. **Impacto de la Fricción de Búsqueda**: Redacta un párrafo profundo analizando el impacto financiero de depender de plataformas de terceros y la pérdida de autoridad orgánica al no dominar las búsquedas de su nicho. Dossier: ${d}`,

  BENCHMARK: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
Elige a 3 competidores reales y reconocidos del nicho. Presenta una tabla Markdown ESTRICTAMENTE con esta estructura (Reemplaza "Comp 1", etc., por los NOMBRES REALES de los competidores que elegiste):
| Criterio de Análisis | Activo Analizado | [Nombre Comp 1] | [Nombre Comp 2] | [Nombre Comp 3] |
|---|---|---|---|---|
REGLAS INQUEBRANTABLES PARA NO ROMPER LA TABLA:
1. TIENES ESTRICTAMENTE PROHIBIDO usar saltos de línea (Enter) dentro de las celdas.
2. TIENES ESTRICTAMENTE PROHIBIDO escribir párrafos largos. Usa MÁXIMO 3 ORACIONES CORTAS por celda. Sé conciso y directo.
3. Evalúa 3 puntos de fricción. Dossier: ${d}`,

  SWOT: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VI. MATRIZ ESTRATÉGICA
Desarrolla el análisis en Fortalezas, Debilidades, Oportunidades y Amenazas. REGLA INQUEBRANTABLE: Inicia CADA viñeta de TODAS las secciones con un número (ejemplo: 1., 2., 3., 4.). Dossier: ${d}`,

  WISHLIST: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VII. LISTA DE DESEOS
Desarrolla 10 características tácticas de alto valor. REGLA INQUEBRANTABLE: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2., 3. hasta el 10.). NO uses guiones ni viñetas. Dossier: ${d}`,

  FUGAS: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### VIII. 15 PUNTOS DE FUGA
Identifica 15 hallazgos críticos de fricción. Marca las más destructivas como **[HEMORRAGIA CRÍTICA]**. REGLA INQUEBRANTABLE: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2., 3. hasta el 15.). NO uses bloques de texto largos, sé directo. Dossier: ${d}`,

  ACCIONES: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### IX. 15 ACCIONES TÁCTICAS
Proporciona la solución exacta para sellar las 15 fugas. REGLA INQUEBRANTABLE: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2., 3. hasta el 15.). Explica la solución de forma clara y accionable. Dossier: ${d}`,

  HERRAMIENTAS: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### X. HERRAMIENTAS DE ESCALA
Recomienda EXACTAMENTE 5 soluciones SaaS específicas. REGLA INQUEBRANTABLE: Inicia cada punto estrictamente con un NÚMERO y un PUNTO (1., 2., 3., 4., 5.). Dossier: ${d}`,

  OMNI: (d) => `Inicia tu respuesta EXACTAMENTE con este encabezado: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
Desarrolla un cronograma dividido en 3 fases de 7 días. REGLA INQUEBRANTABLE: Inicia cada paso de cada fase con un NÚMERO y un PUNTO (1., 2., 3.). Dossier: ${d}`
};

module.exports = { PROMPTS };
