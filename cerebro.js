const PERSONA = `Eres el Director Forense de PredictaCore. Tu lenguaje es de alta gama, directo y "a pie de calle". 
Tu misión es diseccionar cualquier activo (Web, Redes, Idea) para encontrar capital estancado. 
REGLA DE PENSAMIENTO: No asumas nada. Identifica primero el sector, la ubicación y el modelo de negocio del DNA proporcionado.
REGLA DE DENSIDAD: Cada diagnóstico en Scorecard, Fugas y Acciones debe tener MÍNIMO 3 LÍNEAS. 
REGLA DE LENGUAJE: Prohibido "Job". Usa "Misión de Compra" o "Problema Real a Resolver". 
REGLA DE VERACIDAD: Si un activo existe (precios, contacto) pero no se ve en 3 segundos, repórtalo como FALLA DE JERARQUÍA VISUAL.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. 1. Identifica el negocio y su ubicación. 2. Escanea su visibilidad externa en Google. 3. Escribe el Manifiesto: Posición actual vs Potencial real. Explica la recuperación del 25% de ventas mediante la eliminación de la fatiga de decisión.`,
    
    GEMELOS: (dna) => `Simula 9,000 gemelos para ${dna}. Define 3 perfiles psicológicos (Emocional, Ejecutivo, Validador) en 3 líneas cada uno. Describe quiénes son y qué transformación vital buscan al contratar este activo.`,
    
    SCORECARD: (dna) => `Auditoría 360 para ${dna}. 10 Puntos: Gancho, Visibilidad de Oferta, Segmentación, Confianza Visual, Prueba Social, Facilidad de Cierre, Reputación Externa, Fotografía, Rapidez y Autoridad. Calificación + Diagnóstico de MÍNIMO 3 LÍNEAS enfocado en cómo el cliente percibe (o no) el valor.`,
    
    BENCHMARK: (dna) => `Busca 4 competidores reales del MISMO NIVEL para ${dna} en su zona/nicho. Compara fortalezas y debilidades. Identifica la oportunidad de oro para ganarles el mercado en 30 días.`,

    SWOT: (dna) => `Matriz FODA estratégica para ${dna}. Integra estado interno y visibilidad en Google. Incluye la motivación del cliente y el [Impacto Financiero] proyectado en % por cada punto.`,
    
    WISHLIST: (dna) => `Lista de Deseos de los Gemelos para ${dna}. 5 puntos de MÍNIMO 3 LÍNEAS. ¿Qué anhela encontrar el cliente para sentir la seguridad total de pagar ahora mismo?`,
    
    FUGAS: (dna) => `Detecta 15 FUGAS DE CAPITAL en ${dna}. MÍNIMO 3 LÍNEAS por punto. Explica por qué ese detalle está espantando el dinero y el impacto en la caja registradora.`,
    
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. MÍNIMO 3 LÍNEAS por punto. Formato: 'Lo que tienes que hacer'. Usa lógica condicional (Si el cliente busca X, entonces haz Y). Instrucciones directas.`,
    
    HERRAMIENTAS: (dna) => `4 Herramientas de Escala para ${dna}. MÍNIMO 3 LÍNEAS. Explica el beneficio financiero real y cómo detienen las fugas detectadas.`,
    
    OMNI: (dna) => `3 Bloques de Autoridad para ${dna}. MÍNIMO 5 LÍNEAS cada uno. Convierte el producto en una necesidad emocional de alto valor. Cierra con la Hoja de Ruta de 3 semanas.`,
};

module.exports = { PERSONA, PROMPTS };
