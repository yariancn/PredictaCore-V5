const PERSONA = `Eres el Director Senior de Consultoría Forense en PredictaCore. Tu lenguaje es de alta gama, directo, emprendedor y sin tecnicismos vacíos. 
Tu misión es diseccionar activos para encontrar dinero tirado. 
Prohibido ser breve. Prohibido usar introducciones de cortesía. 
Si un análisis no tiene "carne" estratégica, no sirve. 
Metodología obligatoria: JTBD (Jobs To Be Done) y Auditoría de Semiótica Visual.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. Escribe el "Manifiesto de Ingeniería de Conversión". Explica por qué PredictaCore es superior a consultoras de miles de dólares (que dan teoría lenta) y a IAs genéricas (que dan adornos poéticos). Menciona explícitamente la recuperación proyectada del 25% de ventas basada en la reducción de fatiga de decisión y la optimización de la carga cognitiva. Debe ser un golpe de autoridad para un reporte de $500 USD.`,
    
    GEMELOS: (dna) => `Analiza ${dna} y simula el consenso de 9,000 gemelos sintéticos. Humanízalos en estos tres perfiles exactos adaptados al giro: 
    1. El Perfil Emocional (como "Sarah": busca nido seguro, conexión y calidez). 
    2. El Perfil Ejecutivo (como "Mark": busca estatus, eficiencia y solución "One-Click"). 
    3. El Perfil Validador (como "Elena": busca pruebas, tablas de tallas/medidas y veracidad técnica). 
    Para cada uno describe: Contexto humano real, su "Job" (qué trabajo quiere resolver) y la fricción específica que lo hace abandonar este activo.`,
    
    SCORECARD: (dna) => `Genera el Scorecard PredictaCore de 10 puntos universales adaptados a ${dna}: Hook, Visibilidad de Atributos, Jerarquía de Paquetes/Bundles, Semiótica de Confianza, Prueba Social, UX de Conversión, Navegación Temática, Autoridad de Marca, Simplicidad de Cierre y Fotografía Lifestyle. Para cada punto, entrega calificación (1-10) y un Diagnóstico Forense detallado que explique la falla real detectada y su impacto.`,
    
    BENCHMARK: (dna) => `Identifica 4 competidores de EXACTAMENTE EL MISMO NIVEL y nicho que ${dna}. Realiza el análisis comparativo de Ventajas (Pros), Vulnerabilidades (Cons) y la Oportunidad Crítica para que el activo los supere en 30 días. Prohibido comparar con gigantes fuera de liga.`,

    SWOT: (dna) => `Genera un análisis SWOT (FODA) forense e independiente para ${dna}. Cada Fortaleza, Debilidad, Oportunidad y Amenaza debe incluir: Análisis bajo metodología JTBD y el [Impacto Financiero] proyectado en % de probabilidad de incremento en ventas si se ejecuta el cambio.`,
    
    WISHLIST: (dna) => `Genera los 5 puntos del Wishlist de los gemelos para ${dna}. Cada punto debe tener MÍNIMO 3 LÍNEAS. Explica qué es exactamente lo que quieren ver y por qué ese cambio específico detonaría la decisión de compra inmediata al eliminar la barrera psicológica actual.`,
    
    FUGAS: (dna) => `Detecta las 15 FUGAS DE CAPITAL en ${dna}. Cada fuga debe tener MÍNIMO 3 LÍNEAS. Explica el impacto financiero, la desconexión semiótica con el cliente y por qué esa falla es una hemorragia de dinero activa que el dueño no está viendo. No resumas.`,
    
    ACCIONES: (dna) => `Genera las 15 ACCIONES TÁCTICAS para ${dna}. Cada acción debe tener MÍNIMO 3 LÍNEAS. Usa lógica condicional (Si el cliente es X, entonces haz Y). Deben ser instrucciones de ejecución inmediata para el dueño del negocio, sin palabras rebuscadas.`,
    
    HERRAMIENTAS: (dna) => `Recomienda las 4 herramientas (como Vitals, Loox, Lucky Orange, etc.) ideales para escalar ${dna}. Explica detalladamente el beneficio real de cada una (mínimo 3 líneas por herramienta) y cómo ayuda específicamente a tapar las fugas detectadas.`,
    
    OMNI: (dna) => `Genera los 3 Bloques de Autoridad bajo metodología JTBD para ${dna}. Cada bloque debe ser denso (mínimo 5 líneas) y diseñado para transformar el producto o servicio en un activo emocional de alto valor. Cierra con la Hoja de Ruta de 3 semanas para la dominancia del mercado.`,

    TEASER_PUNTO: (dna, punto) => `Resumen ejecutivo de impacto para ${punto} en ${dna}. Calidad Titán.`
};

module.exports = { PERSONA, PROMPTS };
