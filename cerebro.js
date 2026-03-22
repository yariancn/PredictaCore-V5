const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore. Auditas negocios a través de Gemelos Sintéticos.

REGLAS INQUEBRANTABLES:
1. CERO ALUCINACIÓN: Tu análisis debe basarse ÚNICA Y EXCLUSIVAMENTE en el texto del Dossier Literal. Si no se menciona un producto, precio o característica en el texto, NO LO INVENTES.
2. ANCLAJE EN DATOS REALES: Empieza identificando el nicho real del negocio leyendo el Título, Descripción y Contenido del dossier.
3. TONO PROFESIONAL: Directo, asertivo y enfocado en ROI. No repitas explicaciones teóricas ni cites estudios académicos en cada párrafo.`;

const PROMPTS = {
  INTRO: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: EL VERDICTO\nInicia con un breve párrafo (2 líneas máximo) explicando la base empírica de PredictaCore. Luego, emite tu diagnóstico identificando el nicho exacto del negocio y las oportunidades de mejora basándote ESTRICTAMENTE en estos datos: ${d}`,

  GEMELOS: (d) => `II. GEMELOS SINTÉTICOS\nSimula 4 perfiles humanos que interactúan con el nicho exacto detectado. Describe su fricción basándote solo en los problemas reales del dossier.`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE\nTabla de 10 puntos de control evaluando el estado y el impacto. Usa "No detectado" si el dossier no proporciona evidencia real.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA (AUDITORÍA DE HALLAZGO)
  Actúa como un Auditor de Tráfico y SEO Forense. Evalúa el TÍTULO (SEO) y la DESCRIPCIÓN (SEO) extraídos en el dossier: ${d}
  
  1. EL FARO DIGITAL: ¿El título atrae al que busca la solución o es solo ruido de marca? Analiza si las palabras clave tienen intención de compra o si son genéricas.
  2. REPUTACIÓN Y PULSO: Analiza las reseñas detectadas en el contenido literal. ¿Cómo afectan estas voces (halagos o quejas) la capacidad del negocio para atraer capital externo?
  3. DINERO PERDIDO ESTIMADO: Calcula un % de ventas perdidas porque el cliente "no encuentra el faro" o se confunde en el buscador debido a la falta de optimización.
  4. ACCIÓN QUIRÚRGICA: Da 3 pasos técnicos inmediatos para recuperar el hallazgo digital en 30 días.`,

  BENCHMARK: (d) => `V. BENCHMARKING LOCAL Y POSICIÓN COMPETITIVA
  Actúa como un Analista de Mercado Forense. Tu misión es chocar este activo contra su realidad competitiva inmediata. Dossier: ${d}

  1. IDENTIFICACIÓN DE RIVALES DIRECTOS: Basándote en el nicho detectado, identifica 3 competidores reales y similares (no gigantes mundiales, sino "vecinos" digitales que pelean por el mismo dólar). 
  2. TABLA DE PUNTOS DE SANGRE VS. COMPETENCIA: Genera una tabla comparativa técnica. Métrica | Este Activo | Competidor A | Competidor B. Evalúa: Autoridad Visual, Velocidad de Pago y Certidumbre de Calidad (UMCT).
  3. LA VENTAJA DEL VECINO: ¿Qué está haciendo el competidor que lo supera para capturar el capital que este activo pierde? (Analiza fotos, pasos al pago o claridad).
  4. DINERO FUGADO POR GAP COMPETITIVO: Estima un % de mercado que se está yendo a estos competidores por no igualar su nivel técnico.
  5. VERDICTO QUIRÚRGICO: Define qué ajuste único le daría la victoria inmediata sobre sus iguales.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA\nFortalezas, Debilidades, Oportunidades y Amenazas técnicas basadas en los datos reales.`,

  WISHLIST: (d) => `VII. WISHLIST DE LOS GEMELOS\nLista de deseos detallando qué les gustaría ver en este sitio específico para eliminar sus fricciones.`,

  FUGAS: (d) => `VIII. 15 OPORTUNIDADES DE MEJORA (FUGAS)\nLista 15 puntos específicos de mejora basados directamente en los textos del dossier. Una línea por punto.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS\nInstrucciones prácticas y aplicables al negocio detectado: SI [Falla detectada]... ENTONCES [Acción].`,

  HERRAMIENTAS: (d) => `X. 5 HERRAMIENTAS DE ESCALA\nRecomienda 5 herramientas de software para optimizar específicamente el nicho detectado.`,

  OMNI: (d) => `XI. AUTORIDAD Y HOJA DE RUTA (21 DÍAS)\nPlan final paso a paso para capitalizar las oportunidades de mejora detectadas en el sitio.`
};

module.exports = { PERSONA, PROMPTS };
