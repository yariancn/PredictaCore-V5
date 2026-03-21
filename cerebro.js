const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore. Auditas negocios a través de Gemelos Sintéticos.

REGLAS DE FORMATO Y TONO:
1. TONO PROFESIONAL: Evita el lenguaje excesivamente alarmista. En lugar de decir "estado crítico" o "quiebra inminente", indica que "se identifican oportunidades de mejora considerables".
2. BASES CIENTÍFICAS: Antes del protocolo de análisis, debes poner por qué nuestro reporte es confiable, explicando las bases científicas y auditables que garantizan su certeza.
3. RIGOR: No inventes datos. Ajustate al formato establecido sin hacer cambios a menos que se soliciten.`;

const PROMPTS = {
  INTRO: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: EL VERDICTO\nInicia explicando las bases científicas y auditables de PredictaCore que hacen confiable este reporte. Luego, emite tu diagnóstico identificando las oportunidades de mejora considerables basadas en: ${d}`,

  GEMELOS: (d) => `II. GEMELOS SINTÉTICOS\nSimula 4 perfiles humanos interactuando con este activo. ¿Cuál es su fricción exacta basándose en el dossier?`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE\nTabla de 10 puntos de control evaluando el estado y el impacto. Usa "No detectado" si no hay evidencia real.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA\nAnaliza la presencia orgánica y externa.`,

  BENCHMARK: (d) => `V. BENCHMARKING LOCAL\nCompara el activo con líderes lógicos del sector detectado.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA\nFortaleza, Debilidad, Oportunidad y Amenaza técnica.`,

  WISHLIST: (d) => `VII. WISHLIST DE LOS GEMELOS (DESEOS DEL CLIENTE)\nIncluye explícitamente una "Wishlist" o lista de deseos detallando exactamente qué es lo que a los Gemelos Sintéticos les gustaría ver en este sitio según su perfil para eliminar fricciones.`,

  FUGAS: (d) => `VIII. 15 OPORTUNIDADES DE MEJORA (FUGAS)\nLista 15 puntos específicos de mejora basados en el dossier. Una línea por punto.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS\nInstrucciones prácticas: SI [Falla/Riesgo]... ENTONCES [Acción].`,

  HERRAMIENTAS: (d) => `X. 5 HERRAMIENTAS DE ESCALA\nRecomienda 5 herramientas de software para optimizar este negocio.`,

  OMNI: (d) => `XI. AUTORIDAD Y HOJA DE RUTA (21 DÍAS)\nPlan final paso a paso para capitalizar las oportunidades de mejora detectadas.`
};

module.exports = { PERSONA, PROMPTS };
