const PERSONA = `Eres el Director de Estrategia Forense de PredictaCore. Tu lenguaje es el de un consultor de alto nivel: directo, sobrio, emprendedor y clínico. 
Prohibido el lenguaje informal, amistoso o de "coach". Prohibido el uso de la palabra "Job"; sustitúyela por "Misión de Compra" o "Problema Real a Resolver". 
Tu misión es diseccionar el activo para encontrar fugas de capital. 
Antes de redactar, utiliza tu capacidad de búsqueda para verificar la visibilidad real del activo en Google y Maps en su ciudad específica. 
Cada observación en las secciones de Fugas, Acciones y Wishlist debe tener MÍNIMO 3 LÍNEAS.`;

const PROMPTS = {
    INTRO: (dna) => `DNA del Activo: ${dna}. Escribe el "Diagnóstico de Ingeniería de Conversión". Define la posición actual del activo frente al mercado local tras tu escaneo de visibilidad. Explica por qué PredictaCore es superior a consultoras tradicionales (lentas) e IAs genéricas (vagas). Menciona la recuperación proyectada del 25% de ventas mediante la optimización de la carga cognitiva y la visibilidad de activos ya existentes.`,
    
    GEMELOS: (dna) => `Analiza ${dna} y simula el consenso de 9,000 gemelos sintéticos. Humanízalos en tres perfiles psicológicos de MÁXIMO 3 LÍNEAS cada uno: 
    1. El Perfil Emocional (Ana): Motivaciones de seguridad y refugio. 
    2. El Perfil Ejecutivo (Roberto): Motivaciones de estatus y rapidez. 
    3. El Perfil Validador (Elena): Motivaciones de veracidad técnica y pruebas. 
    Describe quiénes son y qué problema vital quieren resolver, no qué botones buscan.`,
    
    SCORECARD: (dna) => `Realiza un barrido visual y de búsqueda para ${dna}. Genera el Scorecard de 10 puntos: Gancho, Visibilidad de Precios, Segmentación de Problemas, Confianza Visual, Prueba Social Local, Facilidad de Contacto, Reputación en Google Maps, Fotografía Lifestyle, Rapidez de Cierre y Autoridad Técnica. Para cada punto, da calificación y un diagnóstico de MÍNIMO 3 LÍNEAS. Si un elemento existe pero está mal ubicado, el diagnóstico debe ser sobre su JERARQUÍA VISUAL.`,
    
    BENCHMARK: (dna) => `Busca en Google los 4 competidores de EXACTAMENTE EL MISMO NIVEL en la ciudad de ${dna}. Realiza un análisis comparativo de sus puntos fuertes, debilidades y la oportunidad de oro para superarlos en 30 días basándose en su visibilidad actual.`,

    SWOT: (dna) => `Genera un análisis FODA forense para ${dna} integrando su estado interno y su posición externa en Google. Cada punto debe incluir el análisis de la motivación del cliente y el [Impacto Financiero] proyectado en % de probabilidad de incremento en ventas.`,
    
    WISHLIST: (dna) => `Genera la "Lista de Deseos" de los gemelos para ${dna}. 5 puntos de MÍNIMO 3 LÍNEAS cada uno. Explica qué anhela encontrar el cliente psicológicamente para sentir la seguridad de realizar la transacción en este momento.`,
    
    FUGAS: (dna) => `Detecta las 15 FUGAS DE DINERO en ${dna} (incluye fugas por visibilidad en Google y fallas de jerarquía visual en la web). Cada fuga debe tener MÍNIMO 3 LÍNEAS. Explica por qué ese detalle está espantando al capital y cuánto se pierde por no corregirlo.`,
    
    ACCIONES: (dna) => `Genera las 15 ACCIONES TÁCTICAS para ${dna}. Cada acción debe tener MÍNIMO 3 LÍNEAS. Usa lógica condicional (Si el cliente busca X, entonces haz Y). Instrucciones de ejecución inmediata para el dueño del negocio, centradas en visibilidad y cierre rápido.`,
    
    HERRAMIENTAS: (dna) => `Recomienda las 4 herramientas ideales para escalar ${dna} (focadas en captura de leads, reputación y conversión). Explica el beneficio financiero real de cada una en MÍNIMO 3 LÍNEAS.`,
    
    OMNI: (dna) => `Genera los 3 Bloques de Autoridad para ${dna}. Cada bloque debe ser denso (MÍNIMO 5 LÍNEAS) y diseñado para convertir el servicio en una necesidad emocional de alto valor. Cierra con la Hoja de Ruta de 3 semanas para dominar el mercado local.`,

    TEASER_PUNTO: (dna, punto) => `Resumen ejecutivo de visibilidad e impacto para ${punto} en ${dna}.`
};

module.exports = { PERSONA, PROMPTS };
