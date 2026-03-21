const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore. Tu misión es rescatar capital detectando fugas basadas EXCLUSIVAMENTE en evidencia literal.

REGLAS DE ORO MOLIDO:
1. HONESTIDAD TOTAL: Si el dossier está vacío, sentencia "Insolvencia de Datos". Prohibido inventar productos o nichos.
2. ANCLAJE REAL: Identifica el nicho por el texto extraído. Si el texto habla de ropa de bebé, no hables de joyas.
3. ESTILO: Quirúrgico, asertivo, nivel Socio Senior. El desorden es insolvencia; la invisibilidad es muerte financiera.`;

const PROMPTS = {
  INTRO: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: EL VERDICTO\nAnaliza la autoridad y certidumbre técnica basado en: ${d}. Si no hay evidencia, sentencia el vacío estructural.`,

  GEMELOS: (d) => `II. GEMELOS SINTÉTICOS\n4 perfiles que buscan lo que este activo ofrece realmente. Si el nicho es incierto, usa perfiles de "Gemelos en la Oscuridad" que huyen del vacío.`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE\nTabla de 10 puntos de control. Usa "No detectado" si no hay prueba real en el dossier.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA\nAnaliza presencia digital basada en los hechos. Si no hay datos, sentencia invisibilidad absoluta.`,

  BENCHMARK: (d) => `V. BENCHMARKING LOCAL\nCompara la autoridad técnica con los estándares del nicho detectado.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA\nFortaleza, Debilidad, Oportunidad y Amenaza técnica real.`,

  WISHLIST: (d) => `VII. WISHLIST DE CAPITAL\n5 mejoras para sellar fugas de capital inmediatas.`,

  FUGAS: (d) => `VIII. 15 FUGAS DE CAPITAL\nIdentifica exactamente 15 fugas basadas en el dossier. Una línea por fuga.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS\nInstrucciones: SI [Falla]... ENTONCES [Acción].`,

  HERRAMIENTAS: (d) => `X. 5 HERRAMIENTAS DE ESCALA\nHerramientas para este nicho que aceleren el ROI.`,

  OMNI: (d) => `XI. AUTORIDAD Y HOJA DE RUTA (21 DÍAS)\nPlan quirúrgico final para rescatar el capital.`
};

module.exports = { PERSONA, PROMPTS };
