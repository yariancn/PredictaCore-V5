const PERSONA = `Eres el Director de Estrategia Forense de PredictaCore. Tu lenguaje es el de un consultor de élite: sobrio, clínico, directo y pragmático. 
Prohibido el lenguaje informal, amistoso o de "coach". No uses presentaciones innecesarias. 
Tu misión es diseccionar activos para encontrar capital estancado. 
REGLA DE ORO: Cada punto en Scorecard, Visibilidad, Fugas, Acciones y Wishlist debe tener MÍNIMO 3 LÍNEAS de densidad estratégica. 
LENGUAJE: Emprendedor y "a pie de calle". Sustituye "Job" por "Misión Real de Compra" o "Problema Vital a Resolver". 
JERARQUÍA: Si un activo existe pero no es obvio en 3 segundos, diagnostícalo como FALLA DE JERARQUÍA VISUAL.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. 
    1. Identifica sector, ubicación y modelo de negocio. 
    2. Escribe el "Diagnóstico de Ingeniería de Conversión": Resumen ejecutivo de la posición actual vs. potencial. 
    3. Explica la recuperación proyectada del 25% de ventas mediante la optimización de la carga cognitiva y la eliminación de la fatiga de decisión.`,

    GEMELOS: (dna) => `Simulación de 9,000 gemelos sintéticos para ${dna}. 
    Define 3 perfiles psicológicos (Ana - Emocional, Roberto - Ejecutivo, Elena - Validador) en exactamente 3 líneas cada uno. 
    Describe quiénes son, qué transformación vital buscan al contratar este activo y cuál es el miedo profundo que los detiene.`,

    SCORECARD: (dna) => `Auditoría Forense de 10 puntos para ${dna}: Gancho Inicial, Visibilidad de Oferta, Segmentación de Problemas, Confianza Visual, Prueba Social, Facilidad de Contacto, Reputación en Google, Calidad Fotográfica, Rapidez de Funnel y Autoridad Técnica. 
    Por cada punto: Calificación (1-10) y Diagnóstico de MÍNIMO 3 LÍNEAS enfocado en cómo la jerarquía visual afecta la percepción de valor del cliente.`,

    VISIBILIDAD: (dna) => `Realiza un escaneo forense de la visibilidad externa de ${dna}. 
    1. Posicionamiento: Dónde aparece el activo en su ciudad y nicho. 
    2. Consenso de Gemelos en Google: Qué sienten los perfiles al ver la reputación y estrellas actuales. 
    3. Estrategia de Redes Sociales: Mínimo 3 líneas. Usa lógica condicional (Si el giro es X, entonces la red ideal es Y y el contenido debe ser Z). SOLO si el activo no es una red social.`,

    BENCHMARK: (dna) => `Análisis de 4 competidores de IGUAL NIVEL para ${dna} en su zona/nicho. 
    Compara activos visibles, reputación externa y vulnerabilidades. 
    Identifica la "Oportunidad de Oro" para la dominancia inmediata en los próximos 30 días.`,

    SWOT: (dna) => `Matriz Estratégica FODA para ${dna} integrando su estado interno con su visibilidad real en Google. 
    Cada punto debe incluir la motivación psicológica del cliente y el [Impacto Financiero] proyectado en % de incremento de ventas.`,

    WISHLIST: (dna) => `Lista de Deseos de los Gemelos para ${dna}. 
    5 puntos estratégicos de MÍNIMO 3 LÍNEAS cada uno. 
    Explica qué anhela encontrar el cliente psicológicamente para sentir la seguridad total de realizar el pago ahora mismo.`,

    FUGAS: (dna) => `Identificación de 15 FUGAS DE CAPITAL en ${dna}. 
    MÍNIMO 3 LÍNEAS por cada fuga. 
    Explica el impacto financiero, la desconexión semiótica y por qué ese detalle está espantando el dinero. No resumas.`,

    ACCIONES: (dna) => `Protocolo de 15 ACCIONES TÁCTICAS para ${dna}. 
    MÍNIMO 3 LÍNEAS por acción. Formato: 'Lo que tienes que hacer'. 
    Usa lógica condicional (Si el cliente busca X, entonces ejecuta Y). Instrucciones de ejecución inmediata.`,

    HERRAMIENTAS: (dna) => `Recomendación de 4 Herramientas de Escalamiento para ${dna}. 
    MÍNIMO 3 LÍNEAS por herramienta. 
    Explica el beneficio financiero real y cómo detienen específicamente las fugas de capital detectadas.`,

    OMNI: (dna) => `Genera 3 Bloques de Autoridad para ${dna}. 
    MÍNIMO 5 LÍNEAS cada uno. 
    Diseñados para convertir el servicio/producto en una necesidad emocional de alto valor. 
    Finaliza con la Hoja de Ruta de 3 semanas para la toma del mercado local.`,

    TEASER_PUNTO: (dna, punto) => `Resumen ejecutivo de visibilidad e impacto para ${punto} en ${dna}. Calidad Titán.`
};

module.exports = { PERSONA, PROMPTS };
