const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore. Auditas negocios a través de Gemelos Sintéticos.

REGLAS INQUEBRANTABLES:
1. CERO ALUCINACIÓN: Tu análisis debe basarse ÚNICA Y EXCLUSIVAMENTE en el texto del Dossier Literal. Si no se menciona un producto, precio o característica en el texto, NO LO INVENTES.
2. ANCLAJE EN DATOS REALES: Empieza identificando el nicho real del negocio leyendo el Título, Descripción y Contenido del dossier.
3. TONO PROFESIONAL: Directo, asertivo y enfocado en ROI. No repitas explicaciones teóricas ni cites estudios académicos en cada párrafo.`;

const PROMPTS = {
  INTRO: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: EL VERDICTO\nInicia con un breve párrafo (2 líneas máximo) explicando la base empírica de PredictaCore. Luego, emite tu diagnóstico identificando el nicho exacto del negocio y las oportunidades de mejora basándote ESTRICTAMENTE en estos datos: ${d}`,

  GEMELOS: (d) => `II. GEMELOS SINTÉTICOS\nSimula 4 perfiles humanos que interactúan con el nicho exacto detectado. Describe su fricción basándote solo en los problemas reales del dossier.`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE\nTabla de 10 puntos de control evaluando el estado y el impacto. Usa "No detectado" si el dossier no proporciona evidencia real.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA\nAnaliza la presencia basándote en los datos del dossier. Si no hay datos, indica "No detectado" y explica el impacto de esta ceguera orgánica.`,

  BENCHMARK: (d) => `V. BENCHMARKING LOCAL\nCompara el nicho real extraído con líderes de esa industria específica.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA\nFortalezas, Debilidades, Oportunidades y Amenazas técnicas basadas en los datos reales.`,

  WISHLIST: (d) => `VII. WISHLIST DE LOS GEMELOS\nLista de deseos detallando qué les gustaría ver en este sitio específico para eliminar sus fricciones.`,

  FUGAS: (d) => `VIII. 15 OPORTUNIDADES DE MEJORA (FUGAS)\nLista 15 puntos específicos de mejora basados directamente en los textos del dossier. Una línea por punto.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS\nInstrucciones prácticas y aplicables al negocio detectado: SI [Falla detectada]... ENTONCES [Acción].`,

  HERRAMIENTAS: (d) => `X. 5 HERRAMIENTAS DE ESCALA\nRecomienda 5 herramientas de software para optimizar específicamente el nicho detectado.`,

  OMNI: (d) => `XI. AUTORIDAD Y HOJA DE RUTA (21 DÍAS)\nPlan final paso a paso para capitalizar las oportunidades de mejora detectadas en el sitio.`
};

module.exports = { PERSONA, PROMPTS };
