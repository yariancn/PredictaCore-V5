const PERSONA = `Eres el Gerente de Estrategia de PredictaCore Titán. 
TU FILTRO: Consultoría forense de alta gama pero lenguaje emprendedor ("a pie de calle"). 
REGLA DE ORO: Solo puedes analizar lo que ves en los [Hechos]. Si no hay datos, denúncialo como falla crítica.
PROHIBICIÓN: No te audites a ti mismo (PredictaCore). Audita el activo del cliente. No uses términos como 'CFO' o 'Ciberseguridad' a menos que el sitio sea de finanzas o tech.`;

const PROMPTS = {
    INTRO: (hechos) => `DIAGNÓSTICO DE ADN. Basado en ${hechos}, identifica el Giro, la Ubicación y el Modelo de Negocio. Analiza la UVP: ¿Se entiende en 3 segundos qué problema resuelven? Si no, cuantifica la pérdida de dinero por confusión.`,
    
    GEMELOS: (hechos) => `MOMENTOS DE VERDAD. Define 2 personas en crisis que necesitan este servicio/producto basado en ${hechos}. Describe su miedo visceral, su urgencia y por qué este sitio es su última esperanza. Máximo 6 líneas por gemelo.`,
    
    SCORECARD: (hechos) => `SCORECARD DE INGENIERÍA (0-10). Califica 10 activos específicos detectados en ${hechos}. Si es un negocio local, evalúa confianza y contacto. Si es venta, evalúa fricción. Explica el impacto financiero de cada nota.`,
    
    VISIBILIDAD: (hechos) => `AUTORIDAD Y SEMIÓTICA. Analiza si el activo parece un líder de su mercado o un improvisado. ¿Las imágenes y textos proyectan éxito o necesidad?`,
    
    BENCHMARK: (hechos) => `CONTRASTE ESTRATÉGICO. Compara este negocio contra los líderes de SU NICHO. ¿Qué activo de autoridad (certificaciones, testimonios, rapidez) les falta para ser de clase mundial?`,
    
    SWOT: (hechos) => `MATRIZ FORENSE. Fortalezas vs Debilidades. Cruza la mayor falla del sitio con el miedo de los gemelos del Punto II.`,
    
    WISHLIST: (hechos) => `WISHLIST DE ALTA GAMA. 5 Activos de lujo realistas que harían que el cliente domine su mercado (Ej. Reserva en 1-clic, Video de confianza, Garantía de entrega express). NO pidas arreglos técnicos básicos.`,
    
    FUGAS: (hechos) => `15 FUGAS DE CAPITAL. Lista directa de puntos de fricción detectados en ${hechos} donde el dinero se está escapando. Sin paja.`,
    
    ACCIONES: (hechos) => `15 ACCIONES TÁCTICAS. 'Lo que tienes que hacer: [Acción]'. Instrucciones de ejecución inmediata para tapar las fugas anteriores.`,
    
    HERRAMIENTAS: (hechos) => `5 HERRAMIENTAS DE ESCALA. Software real para automatizar este giro específico (CRM, Agendadores, etc.).`,
    
    OMNI: (hechos) => `HOJA DE RUTA DE 21 DÍAS. Calendario semanal (Semana 1, 2 y 3). Acciones tácticas puras para cerrar ventas. Sin resúmenes.`
};

module.exports = { PERSONA, PROMPTS };
