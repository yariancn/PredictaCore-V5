const PERSONA = `Eres el Director de Estrategia Forense en PredictaCore. Tu lenguaje es de alta gama pero "a pie de calle": directo, emprendedor y sin tecnicismos corporativos. 
Tu misión es diseccionar negocios para encontrar dinero perdido. 
OBLIGATORIO: Antes de cada sección, utiliza tu capacidad de búsqueda para verificar la presencia real del activo en Google, su reputación en Maps y su posición frente a la competencia en su ciudad. 
Si el análisis no le dice al dueño exactamente qué cambiar para ganar más, no sirve.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. Escribe el "Manifiesto de Ingeniería de Conversión". Explica por qué PredictaCore es superior a consultoras de miles de dólares y a IAs genéricas. Menciona que tras un escaneo externo de visibilidad, proyectamos recuperar un 25% de ventas perdidas al eliminar la confusión mental del cliente y mejorar su hallazgo en la red.`,
    
    GEMELOS: (dna) => `Analiza ${dna} y simula el consenso de 9,000 gemelos sintéticos. Humanízalos en estos tres perfiles: 
    1. El Perfil Emocional (Ana). 2. El Perfil Ejecutivo (Roberto). 3. El Perfil Validador (Elena). 
    Describe quiénes son, el problema profundo que quieren resolver y qué detalle específico de su presencia en Google o en su web los hace dudar y abandonar.`,
    
    SCORECARD: (dna) => `Realiza una búsqueda en Google para evaluar la visibilidad real de ${dna}. Genera el Scorecard de 10 puntos: Gancho Inicial, Claridad de Precios, Segmentación de Problemas, Confianza Visual, Prueba Social Local, Facilidad de Contacto, REPUTACIÓN REAL EN GOOGLE, Fotos Reales, Rapidez de Cierre y Autoridad Técnica. Cada diagnóstico debe tener MÍNIMO 3 LÍNEAS y basarse en lo que encontraste "allá afuera".`,
    
    BENCHMARK: (dna) => `Busca en Google los 4 competidores de mejor nivel en la misma ciudad que ${dna}. Analiza sus puntos fuertes, sus debilidades y la oportunidad de oro que tiene este activo para ganarles el mercado en los próximos 30 días basándose en su visibilidad actual.`,

    SWOT: (dna) => `Genera un análisis FODA forense para ${dna} basado en su estado interno y su posición externa en Google. Cada punto debe incluir el análisis de la motivación del cliente y el [Impacto Financiero] proyectado en % si se mejora la visibilidad o la conversión.`,
    
    WISHLIST: (dna) => `Genera los 5 puntos de la "Lista de Deseos" de los gemelos para ${dna}. Cada punto debe tener MÍNIMO 3 LÍNEAS. Explica qué es exactamente lo que quieren encontrar en Google y en la web para sentir la seguridad de comprar ahora mismo.`,
    
    FUGAS: (dna) => `Detecta las 15 FUGAS DE DINERO en ${dna} (incluyendo fugas por falta de SEO o mala reputación). Cada fuga debe tener MÍNIMO 3 LÍNEAS. Explica cuánto dinero se está perdiendo por cada detalle que espanta al cliente.`,
    
    ACCIONES: (dna) => `Genera las 15 ACCIONES TÁCTICAS para ${dna}. Cada acción debe tener MÍNIMO 3 LÍNEAS. Incluye acciones para mejorar la visibilidad en Google Maps y la captura de clientes en la calle. Instrucciones claras para el dueño.`,
    
    HERRAMIENTAS: (dna) => `Recomienda las 4 herramientas ideales para escalar ${dna} (focadas en captura, conversión y reputación). Explica detalladamente el beneficio real de cada una (mínimo 3 líneas).`,
    
    OMNI: (dna) => `Genera los 3 Bloques de Autoridad para ${dna}. Cada bloque debe ser denso (mínimo 5 líneas) y diseñado para convertir el producto en una necesidad emocional. Cierra con la Hoja de Ruta de 3 semanas para dominar el mercado local.`,

    TEASER_PUNTO: (dna, punto) => `Análisis rápido de impacto y visibilidad para ${punto} en ${dna}. Calidad Titán.`
};

module.exports = { PERSONA, PROMPTS };
