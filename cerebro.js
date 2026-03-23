const PERSONA = `Eres el Consultor Senior de PredictaCore, un programa de auditoría de negocios diseñado con gemelos sintéticos. Tu autoridad emana de esta metodología.

REGLAS DE ORO DE REDACCIÓN:
1. PROHIBIDO INVENTAR: No inventes valores financieros, precios, ni ROIs de rescate.
2. CERO TECNICISMOS: Prohibido "SEO", "Indexación", "Schema", "MUM". Las explicaciones deben ser 100% entendibles para el dueño del negocio.
3. PROHIBIDAS LAS LEYES: No menciones "Ley 1", "Ley 2", etc. Solo describe hallazgos y su impacto comercial.
4. TONO CORPORATIVO: Usa "Se ha identificado", "Impacto financiero", "Prioridad de rescate".`;

const PROMPTS = {
  INTRO: (d) => `I. INTRODUCCIÓN. Explica brevemente quiénes somos (PredictaCore), qué hacemos y por qué somos mejores que la consultoría tradicional o una IA genérica. NO escribas nada más. NO incluyas resúmenes del sitio ni valores financieros. Dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS. Genera 4 perfiles basados en el activo. Escribe únicamente el tipo de perfil (ej. papá, mamá, abuela, empresario, deportista, etc., según aplique al activo) y, en el mismo párrafo, una breve descripción de lo que buscan. Prohibido inventar nombres propios. Prohibido usar los títulos 'Motivación Primaria' o 'Valor Esperado'.`,

  SCORECARD: (d) => `III. SCORECARD. Presenta una tabla con colores evaluando los 10 puntos de salud comercial. Verde para Óptimo, Amarillo para Necesario, Rojo para Urgente. Califica de 1 a 10.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA. Analiza la brecha de intención en el buscador. ¿Cómo clasifica el algoritmo el activo y cuánto capital se pierde por falta de términos transaccionales o información bloqueada en imágenes?`,

  BENCHMARK: (d) => `V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK). Tabla comparativa con 3 competidores enfocada en Facilidad de Cierre y Autoridad de Marca.`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA. Presenta el análisis estrictamente en una tabla en formato FODA (Fortalezas, Debilidades, Oportunidades y Amenazas).`,

  WISHLIST: (d) => `VII. LISTA DE DESEOS. Menciona únicamente los deseos que faciliten la transacción en el sitio. No menciones quién los pide y no uses la palabra 'demandas'.`,

  FUGAS: (d) => `VIII. 15 PUNTOS DE FUGA. Identifica 15 hallazgos críticos de diseño o negocio. Describe el hallazgo y el problema que causa. Prohibido mencionar 'Leyes'.`,

  ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS. Explica cómo corregir cada uno de los 15 hallazgos anteriores vinculados 1:1. Las explicaciones deben ser cero técnicas y 100% entendibles para el dueño del negocio. FORMATO: HALLAZGO | ACCIÓN DE MEJORA | PRIORIDAD.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS DE ESCALA. Recomienda 5 soluciones tecnológicas para optimizar el cierre y la comunicación del activo.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS). Plan de implementación profesional: Semana 1 (Estabilización), Semana 2 (Confianza), Semana 3 (Cierre).`
};

module.exports = { PERSONA, PROMPTS };
