const PERSONA = `Eres el Gerente Senior de PredictaCore. Tu lenguaje es de alta gama, emprendedor y directo. 
Prohibido usar introducciones genéricas. Tu misión es entregar una Auditoría Forense 360. 
Cero tolerancia a la paja: ve directo al valor financiero. 
Metodología: JTBD, Auditoría de Semiótica Visual y Psicología del Consumidor para reportes de alta densidad.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. Escribe el "Manifiesto PredictaCore". Explica por qué somos superiores a una consultoría de miles de dólares, a una AI genérica y a un estudio de mercado. Menciona la recuperación proyectada del 25% de ventas por reducción de fatiga de decisión (Ingeniería de Conversión). Debe sonar como un reporte de $500 USD.`,
    
    GEMELOS: (dna) => `Analiza ${dna} y simula el consenso de 9,000 gemelos sintéticos. Humanízalos en tres perfiles: 
    1. El Emocional (busca conexión/vibe), 
    2. El Ejecutivo (busca eficiencia/estatus), 
    3. El Validador (busca pruebas/datos). 
    Para cada uno describe su contexto humano real, su "Job" específico y la fricción que lo detiene en este activo.`,
    
    SCORECARD: (dna) => `Genera un Scorecard de 10 puntos universales adaptados al giro de ${dna} (Ej: Hook, Visibilidad de Atributos, Jerarquía de Paquetes/Bundles, Semiótica de Confianza, Prueba Social, UX de Conversión, Navegación, Autoridad de Marca, Simplicidad de Cierre, Retención Visual). Para cada punto da calificación y diagnóstico detallado de la falla real detectada.`,
    
    BENCHMARK: (dna) => `Identifica a los 4 competidores de EXACTAMENTE EL MISMO NIVEL y nicho que ${dna}. No compares con gigantes si el activo es local, ni con locales si es global. Realiza un análisis comparativo de Ventajas, Vulnerabilidades y la Oportunidad Crítica para ganarles terreno.`,

    SWOT: (dna) => `Genera un análisis SWOT (FODA) forense e independiente para ${dna}. Para cada Fortaleza, Debilidad, Oportunidad y Amenaza, incluye un análisis bajo metodología JTBD y el [Impacto Financiero] proyectado en % de probabilidad de incremento en ventas.`,
    
    WISHLIST: (dna) => `Genera los 5 puntos del Wishlist de los gemelos para ${dna}. Explica en al menos 3 líneas por cada punto qué es exactamente lo que quieren ver y por qué ese cambio detonaría su decisión de compra inmediata.`,
    
    FUGAS: (dna) => `Detecta las 15 fugas de capital en ${dna}. Cada fuga debe tener al menos 3 líneas explicando el impacto financiero, la desconexión semiótica con el cliente y por qué es una hemorragia de revenue activa en este momento.`,
    
    ACCIONES: (dna) => `Genera 15 Acciones Tácticas para ${dna}. Cada acción debe tener al menos 3 líneas. Usa lógica condicional (Si X, entonces Y). Prohibidos tecnicismos; deben ser instrucciones de ejecución inmediata.`,
    
    HERRAMIENTAS: (dna) => `Recomienda las 4 herramientas tecnológicas o de gestión ideales para escalar ${dna}. Explica en al menos 3 líneas el beneficio real de cada una y cómo ayuda específicamente a eliminar las fricciones detectadas.`,
    
    OMNI: (dna) => `Genera 3 Bloques de Autoridad bajo metodología JTBD específicos para ${dna} (Diseñados para transformar el producto o servicio en activo emocional) y define la Hoja de Ruta de 3 semanas para la dominancia del mercado.`,

    TEASER_PUNTO: (dna, punto) => `Análisis de impacto rápido para ${punto} en ${dna}. Calidad Titán.`
};

module.exports = { PERSONA, PROMPTS };
