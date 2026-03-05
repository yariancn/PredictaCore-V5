const PERSONA = `Eres la Unidad de Inteligencia PredictaCore. Tu tono es clínico, sofisticado y de altísima gama. 
No te presentes. No uses frases de relleno. Ve directo al hallazgo financiero y psicológico.
REGLA DE ORO: Cada diagnóstico en todas las secciones debe tener un mínimo de 3 y un MÁXIMO de 5 líneas.
LENGUAJE: Emprendedor y pragmático. Sustituye "Job" por "Misión Real de Compra".
JERARQUÍA: Si un activo existe pero no es obvio, diagnostícalo como FALLA DE JERARQUÍA VISUAL.`;

const PROMPTS = {
    INTRO: (dna) => `DNA: ${dna}. Identifica sector, ubicación y modelo. Realiza un escaneo de visibilidad externa. Redacta el Manifiesto de Ingeniería de Conversión: Posición actual vs. Potencial de mercado. Explica la recuperación proyectada del 25% de ventas mediante la eliminación de la fatiga de decisión. (3-5 líneas).`,
    
    GEMELOS: (dna) => `Simulación de 9,000 gemelos para ${dna}. Perfiles Ana (Emocional), Roberto (Ejecutivo) y Elena (Validador). Define quiénes son, su problema vital y el miedo que los frena. (3-5 líneas por perfil).`,

    SCORECARD: (dna) => `Auditoría de 10 puntos para ${dna}. Por cada punto: Calificación (1-10) y Diagnóstico de 3 a 5 líneas. Enfócate en cómo la jerarquía visual afecta la percepción de valor y la misión de compra.`,

    VISIBILIDAD: (dna) => `Escaneo de visibilidad externa para ${dna}. 1. Posicionamiento en Google/Maps. 2. Reputación percibida por gemelos (Sentimiento). 3. Estrategia de Redes (Lógica condicional: Si giro es X, red es Y). (3-5 líneas por punto).`,

    BENCHMARK: (dna) => `Usa datos de Google para comparar ${dna} con 4 competidores de su nivel. Analiza: Estrellas/Reseñas, Keywords de dominio y UX de conversión. Identifica la "Oportunidad de Oro" para dominancia inmediata. (3-5 líneas por punto).`,

    SWOT: (dna) => `Matriz FODA para ${dna}. Cada punto debe incluir la motivación del cliente y el [Impacto Financiero] proyectado en %. (3-5 líneas por punto).`,

    WISHLIST: (dna) => `Lista de Deseos de los Gemelos para ${dna}. 5 puntos estratégicos de 3 a 5 líneas. ¿Qué anhela encontrar el cliente psicológicamente para pagar ahora mismo?`,

    FUGAS: (dna) => `Detecta 15 FUGAS DE CAPITAL en ${dna}. 3 a 5 líneas por fuga. Explica el impacto financiero y la desconexión semiótica que espanta el dinero.`,

    ACCIONES: (dna) => `15 ACCIONES TÁCTICAS para ${dna}. 3 a 5 líneas por acción. Formato: 'Lo que tienes que hacer'. Lógica condicional: 'Si el cliente busca X, entonces haz Y'.`,

    HERRAMIENTAS: (dna) => `5 Herramientas de Escalamiento para ${dna}. 3 a 5 líneas por herramienta. Explica el beneficio financiero real y qué fuga específica detectada en el punto VII detiene cada una.`,

    OMNI: (dna) => `Genera 3 Bloques de Autoridad para ${dna}. Mínimo 5 líneas por bloque. Convierte el servicio en una necesidad emocional de alto valor. Finaliza con la Hoja de Ruta de 3 semanas para la toma del mercado local.`,
};

module.exports = { PERSONA, PROMPTS };
