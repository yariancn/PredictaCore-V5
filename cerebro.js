const PERSONA = `Eres el Gerente de Estrategia de PredictaCore Titán. 
TU MANDATO: Realizar una auditoría forense de conversión sobre el activo proporcionado.
REGLAS DE HIERRO:
1. IDENTIFICACIÓN DINÁMICA: Antes de cada respuesta, identifica el GIRO (Salud, Retail, SaaS, etc.), el MODELO (E-commerce, Local, Marca) y la UBICACIÓN. 
2. GROUNDING ESTRICTO: Solo usa datos presentes en los [Hechos]. Si un dato no existe, denúncialo como 'Activo Omitido'. PROHIBIDO inventar formularios o pasarelas de pago si no las ves.
3. TONO: Emprendedor, consultoría de alta gama, directo y sin palabras rebuscadas.
4. CERO REPETICIÓN: Cada punto es un hallazgo nuevo. No resumas puntos anteriores.`;

const PROMPTS = {
    INTRO: (hechos) => `Analiza el ADN del activo basado en: ${hechos}. Define: 1. Qué vende. 2. A quién le habla. 3. Qué 'trabajo' (JTBD) intenta resolver el usuario. Evalúa si la Propuesta de Valor se entiende en 3 segundos.`,
    
    GEMELOS: (hechos) => `Identifica a los 2 Gemelos Sintéticos ideales para este giro específico basándote en la oferta de: ${hechos}. Define su perfil psicológico, miedos y motivaciones de compra. No analices la web aquí, solo define a los compradores.`,
    
    SCORECARD: (hechos) => `Scorecard PredictaCore (0-10). Evalúa 10 activos críticos detectados en ${hechos}. Ajusta los criterios al modelo de negocio (ej. si es local, evalúa confianza y contacto; si es e-commerce, evalúa fricción de carrito).`,
    
    VISIBILIDAD: (hechos) => `Auditoría de Autoridad Externa. Basado en la ubicación y giro detectado en ${hechos}, analiza si el activo proyecta la autoridad necesaria para dominar su mercado geográfico o digital.`,
    
    BENCHMARK: (hechos) => `Diferenciación Forense. Compara la comunicación visual y técnica de este activo contra los estándares de alta gama de su propio nicho. ¿Qué activos de 'primera clase' le faltan para dejar de parecer un negocio promedio?`,
    
    SWOT: (hechos) => `Matriz Estratégica. Identifica Fortalezas y Debilidades reales de conversión presentes en ${hechos}. Cruza las Oportunidades con los miedos de los Gemelos definidos en el punto II.`,
    
    WISHLIST: (hechos) => `Lista de Deseos Estratégica. Enumera 5 activos que cerrarían la venta o el lead de inmediato. Deben ser específicos al giro (ej. si es servicios, pide un agendador; si es producto, pide guías de tallas o uso).`,
    
    FUGAS: (hechos) => `15 Fugas de Capital. Identifica puntos de fricción reales donde el dinero se está escapando (ej. falta de prueba social, tiempos de carga percibidos, lenguaje confuso, falta de llamado a la acción claro).`,
    
    ACCIONES: (hechos) => `15 Acciones Tácticas. Formato: 'Lo que tienes que hacer: [Acción]'. Deben ser ejecuciones inmediatas para tapar las fugas del punto anterior.`,
    
    HERRAMIENTAS: (hechos) => `5 Herramientas de Escala. Recomienda software real que automatice el crecimiento de este modelo de negocio específico (CRM, automatización de citas, o analytics avanzado).`,
    
    OMNI: (hechos) => `Hoja de Ruta de 21 Días. Crea un calendario de ejecución táctica dividido en 3 semanas. Semana 1: Ajustes Críticos. Semana 2: Autoridad y Confianza. Semana 3: Escala y Tráfico. NO resumas el reporte.`
};

module.exports = { PERSONA, PROMPTS };
