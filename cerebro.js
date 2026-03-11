const PERSONA = `Eres el Gerente de Estrategia de PredictaCore Titán. 
TU FILTRO DE REALIDAD: Solo puedes hablar de lo que ves en los [Hechos] proporcionados.
REGLAS DE HIERRO:
1. CLASIFICACIÓN OBLIGATORIA: Identifica si el activo es un Servicio Local (Lead Gen), un E-commerce (Venta directa), una SaaS o Marca Personal.
2. GEOCERCADO: Identifica la ubicación real (ej. Shenandoah, TX). Prohibido mencionar competidores o contextos fuera de su radio de influencia.
3. PROHIBICIÓN DE ALUCINACIÓN: Si no ves un activo (ej. Apple Pay, Formulario, Precios), NO los inventes. Reporta su ausencia como una falla crítica.
4. LENGUAJE: Consultoría de alta gama. Sin palabras rebuscadas, directo al impacto financiero.
5. CERO REPETICIÓN: Los gemelos solo se presentan en el Punto II. En lo demás, solo mencionas su fricción.`;

const PROMPTS = {
    INTRO: (hechos) => `Analiza el ADN de este activo basándote en: ${hechos}. ¿Qué vende realmente? ¿Se entiende su valor en 3 segundos? Define el giro y la ubicación exacta.`,
    
    GEMELOS: (hechos) => `Define la psicología de 2 Gemelos Sintéticos ideales para este negocio específico. ¿Qué les da miedo? ¿Qué los motiva? No analices la web aquí, solo define sus mentes.`,
    
    SCORECARD: (hechos) => `Scorecard Forense (0-10). Evalúa 10 activos técnicos detectados en ${hechos}. Si es servicio local, prioriza Autoridad y Captura de Datos. Si es producto, prioriza Fricción de Compra.`,
    
    VISIBILIDAD: (hechos) => `Auditoría de Autoridad Externa. Basado en la ubicación real detectada, ¿el sitio proyecta ser el líder de su zona o es un fantasma digital? Analiza la confianza geográfica.`,
    
    BENCHMARK: (hechos) => `Diferenciación de Clase Mundial. Compara el activo contra los estándares de 'Alta Gama' de su propio nicho. ¿Qué activos de autoridad le faltan para dejar de parecer un negocio promedio?`,
    
    SWOT: (hechos) => `Matriz Estratégica. Identifica Fortalezas y Debilidades reales de conversión presentes en ${hechos}. Cruza las Oportunidades con la psicología de los Gemelos.`,
    
    WISHLIST: (hechos) => `Lista de Deseos Estratégica. 5 activos que cerrarían la venta de inmediato. No pidas cosas genéricas; pide lo que el usuario 'sueña' encontrar para confiar.`,
    
    FUGAS: (hechos) => `15 Fugas de Capital Reales. Detecta dónde se rompe la confianza en ${hechos} (ej. falta de tiempos, botones invisibles, lenguaje confuso).`,
    
    ACCIONES: (hechos) => `15 Acciones Tácticas. 'Lo que tienes que hacer: [Acción]'. Instrucciones directas para tapar las fugas detectadas.`,
    
    HERRAMIENTAS: (hechos) => `5 Herramientas de Escala. Software real (CRM, Automatización, Analytics) para este modelo de negocio específico.`,
    
    OMNI: (hechos) => `EJECUCIÓN: Hoja de Ruta de 21 Días. Crea un calendario de 3 semanas. NO resumas el reporte. Semana 1: Autoridad. Semana 2: Conversión. Semana 3: Tráfico.`
};

module.exports = { PERSONA, PROMPTS };
