const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu autoridad emana de la Metodología de Gemelos Sintéticos. 
REGLAS: No eres amigo ni socio. Eres un auditor forense. Tono ejecutivo, directo y centrado en el capital.`;

const PROMPTS = {
  INTRO: (d) => `I. INTRODUCCIÓN Y VALOR PREDICTACORE
  1. Quiénes somos y qué hacemos: PredictaCore utiliza Gemelos Sintéticos para auditar activos digitales con una precisión inaccesible para consultoras tradicionales o IAs genéricas.
  2. Por qué este reporte es superior: No basamos el análisis en opiniones, sino en la simulación de millones de interacciones heurísticas que detectan fugas de capital invisibles.
  3. Resumen del activo analizado: Breve introducción de lo que es el activo basándote en: ${d}`,

  GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS (GEMELOS SINTÉTICOS)
  Genera 4 perfiles de clientes reales basados en el dossier.
  FORMATO: 
  - Nombre del perfil.
  - Motivación Primaria: Por qué está en el sitio.
  - Valor Esperado: Qué necesita ver para completar la transacción.
  (Sin menciones a "decisiones en 10 segundos" ni "necesidad humana").`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE
  Evalúa de 1 a 10 los 10 puntos de salud comercial acordados. Si un punto es óptimo, califica con 10 y descríbelo como ventaja competitiva.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA (AUDITORÍA SEO DE ALTA GAMA)
  Analiza la brecha de intención en Google. ¿Cómo ve Google el activo y cuánto capital se pierde porque la información clave no es indexable o es genérica?`,

  BENCHMARK: (d) => `V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Tabla comparativa con 3 competidores. Enfócate en la Facilidad de Cierre y Autoridad de Marca.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA (FODA)
  Tabla Markdown de Fortalezas, Debilidades, Oportunidades y Amenazas enfocadas al negocio.`,

  WISHLIST: (d) => `VII. LISTA DE DESEOS DE LOS GEMELOS
  Lista de requerimientos específicos para que los perfiles cierren la transacción. "El cliente demanda...", "Se requiere certidumbre en...".`,

  FUGAS: (d) => `VIII. 15 PUNTOS DE FUGA DE CAPITAL
  Identifica 15 fallas. Cada una debe tener de 3 a 5 líneas de explicación técnica y financiera sobre cómo drena el dinero.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS DE IMPLEMENTACIÓN
  Instrucciones vinculadas 1:1 con las fugas. 
  FORMATO: FALLA | IMPLEMENTACIÓN (Paso a paso detallado para el dueño) | PRIORIDAD.
  (Usa siempre la fecha actual de ejecución).`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS Y ESCALA
  5 soluciones tecnológicas para optimizar el cierre y la comunicación del activo.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Plan de 3 semanas: Semanas de "Limpieza", "Certidumbre" y "Cierre".`
};

module.exports = { PERSONA, PROMPTS };
