const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu autoridad emana de la Metodología de Gemelos Sintéticos. Tono ejecutivo, directo y centrado en el capital. Prohibido el lenguaje informal.`;

const PROMPTS = {
  INTRO: (d) => `I. INTRODUCCIÓN Y VALOR METODOLÓGICO DE PREDICTACORE
  1. Presentación de PredictaCore como la autoridad líder en Auditoría Forense Digital.
  2. Explicación de la Metodología de Gemelos Sintéticos: Por qué este reporte es superior a cualquier análisis humano o de IA tradicional (simulación de comportamiento real vs. opinión).
  3. Resumen del activo analizado basado en el dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS (GEMELOS SINTÉTICOS)
  Genera 4 perfiles de clientes reales basados en el dossier.
  FORMATO POR PERFIL: 
  - Nombre del perfil.
  - Motivación Primaria (Por qué está en el sitio).
  - Valor Esperado (Qué beneficio específico busca para cerrar la transacción).
  (Prohibido agregar "decisiones en 10 segundos" o "necesidades humanas").`,

  SCORECARD: (d) => `III. SCORECARD PREDICTACORE
  Calificación de 1 a 10 sobre los 10 puntos de salud comercial acordados. Describe cada punto con rigor ejecutivo.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA (AUDITORÍA SEO DE ALTA GAMA)
  Analiza la brecha de intención en Google. ¿Cómo clasifica Google el activo y cuánto capital se pierde por falta de términos transaccionales o información bloqueada en imágenes?`,

  BENCHMARK: (d) => `V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Tabla comparativa con 3 competidores enfocada en Facilidad de Cierre y Autoridad de Marca.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA (FODA)
  Tabla Markdown de Fortalezas, Debilidades, Oportunidades y Amenazas enfocadas al ROI.`,

  WISHLIST: (d) => `VII. LISTA DE DESEOS DE LOS GEMELOS
  Lista de requerimientos específicos que los perfiles demandan para completar la misión. "El cliente demanda...", "Se requiere certidumbre en...".`,

  FUGAS: (d) => `VIII. 15 PUNTOS DE FUGA DE CAPITAL
  Identifica 15 fallas. REGLA DE EXTENSIÓN: Cada punto debe tener de 3 a 5 líneas de explicación técnica y financiera sobre cómo drena el capital.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS DE IMPLEMENTACIÓN
  Instrucciones vinculadas 1:1 con las fugas. 
  FORMATO: HALLAZGO | IMPLEMENTACIÓN (Paso a paso detallado para el dueño) | PRIORIDAD.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS Y ESCALA
  5 soluciones tecnológicas para optimizar el cierre y la comunicación del activo.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Plan de implementación profesional: Semana de "Limpieza", "Certidumbre" y "Cierre".`
};

module.exports = { PERSONA, PROMPTS };
