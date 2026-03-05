const PERSONA = `Eres el Director de Estrategia Forense de PredictaCore. Tu lenguaje es de alta gama: sobrio, clínico y pragmático. 
Prohibido el lenguaje informal. No uses presentaciones. 
MÉTODO: Identifica la "Misión Real de Compra" del cliente. 
REGLA DE ORO: Mínimo 3 líneas por cada punto en Scorecard, Visibilidad, Fugas, Acciones y Wishlist. 
JERARQUÍA: Si un activo existe pero no es obvio, diagnostícalo como FALLA DE JERARQUÍA VISUAL.`;

const PROMPTS = {
    // FASE 1: EL TEASER (LO QUE SE VE EN PANTALLA)
    INTRO: (dna) => `DNA: ${dna}. Realiza un escaneo de visibilidad externa (Google/Maps). Redacta el Diagnóstico de Ingeniería de Conversión. Explica la posición actual vs. potencial y la recuperación proyectada del 25% de ventas mediante la eliminación de la fatiga de decisión.`,
    
    GEMELOS: (dna) => `Simulación de 9,000 gemelos para ${dna}. Perfiles Ana (Emocional), Roberto (Ejecutivo) y Elena (Validador). 3 líneas cada uno. Define quiénes son y qué problema vital quieren resolver. Sin menciones técnicas.`,

    // FASE 2: EL CUERPO ESTRATÉGICO
    SCORECARD: (dna) => `Scorecard de 10 puntos para ${dna}. Por cada punto: Calificación y Diagnóstico de MÍNIMO 3 LÍNEAS. Enfócate en cómo la jerarquía visual afecta la percepción de valor y la misión de compra.`,

    VISIBILIDAD: (dna) => `Análisis de visibilidad externa para ${dna}. 1. Posicionamiento en Google/Maps. 2. Reputación percibida por los gemelos. 3. Estrategia de Redes (Lógica condicional: Si giro es X, red es Y). Mínimo 3 líneas por punto.`,

    BENCHMARK: (dna) => `Benchmarking de 4 competidores locales de igual nivel para ${dna}. Analiza activos y vulnerabilidades. Identifica la "Oportunidad de Oro" para dominancia en 30 días.`,

    // FASE 3: DISECCIÓN DE CAPITAL (DENSIDAD MÁXIMA)
    FUGAS: (dna) => `Detecta 15 FUGAS DE DINERO en ${dna}. MÍNIMO 3 LÍNEAS por cada una. Explica el impacto financiero y la desconexión semiótica que espanta el capital. No resumas.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. MÍNIMO 3 LÍNEAS por acción. Formato: 'Lo que tienes que hacer'. Usa lógica condicional (Si busca X, haz Y).`,

    // FASE 4: CIERRE Y ESCALA
    WISHLIST: (dna) => `Lista de Deseos de los Gemelos para ${dna}. 5 puntos de MÍNIMO 3 LÍNEAS. ¿Qué anhela encontrar el cliente para sentir seguridad total y pagar ahora mismo?`,
    
    HERRAMIENTAS: (dna) => `4 Herramientas de Escala para ${dna}. MÍNIMO 3 LÍNEAS. Explica el beneficio financiero real y cómo detienen las fugas detectadas.`,

    OMNI: (dna) => `3 Bloques de Autoridad para ${dna} (Mínimo 5 líneas cada uno). Convierte el servicio en una necesidad emocional. Cierra con la Hoja de Ruta de 3 semanas.`,
};

module.exports = { PERSONA, PROMPTS };
