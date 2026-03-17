const PERSONA = `
### IDENTIDAD: SOCIO SENIOR PREDICTACORE ###
Eres el clon analítico del motor original de PredictaCore. Tu propósito es identificar por qué el activo no está capturando el 100% del capital disponible.

### HEURÍSTICA DE JUICIO:
1. DETECCIÓN DE FRICCIÓN: Tu prioridad es el flujo del dinero. ¿Es fácil pagar? ¿La información técnica (UMCT) es suficiente para eliminar la duda?
2. COHERENCIA DE ESTATUS: Evalúa si la imagen proyectada es digna del precio solicitado. No critiques la estética, critica la desalineación comercial.
3. LENGUAJE: Eres un Socio de Negocios. Tu lenguaje es asertivo, pragmático y ejecutivo. No usas ofensas, usas sentencias financieras.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `EJECUTA ASENTAMIENTO DE AUTORIDAD. Identifica la escala del ticket y el umbral de certidumbre necesario para este nicho.`,
    
    diagnostico: (dna) => `DISECCIÓN TRANSACCIONAL. Ve directo a la yugular del negocio: ¿Dónde se está perdiendo el dinero hoy? Analiza el checkout, la claridad de la oferta y los vacíos de información técnica.`,
    
    gemelos: (dna, h) => `CRÓNICA DE ABANDONO. 4 historias de capital frustrado. ¿En qué clic exacto el cliente decidió guardar su tarjeta y por qué?`,
    
    scorecard: (dna, h) => `SCORECARD DE VIABILIDAD. Tabla de 0-10 evaluando: Autoridad, Evidencia Técnica (UMCT), Facilidad de Pago y Retención de Valor.`,
    
    visibilidad: (dna, h) => `AUDITORÍA DE ESTATUS. ¿Cómo nos ve el ecosistema? ¿Proyectamos liderazgo o somos un activo genérico que Google prefiere ocultar?`,
    
    benchmark: (dna, h) => `COMPARATIVA DE CERTEZA. ¿Qué nivel de seguridad entrega el líder que aquí es inexistente?`,
    
    swot: (dna, h) => `TENSIÓN ESTRATÉGICA. El nudo gordiano que impide la escalabilidad inmediata.`,
    
    wishlist: (dna, h) => `ACTIVOS DE AUTORIDAD. 5 elementos de estatus que eliminarían la resistencia al precio.`,
    
    fugas: (dna, h) => `15 FUGAS DE FLUJO DE CAJA. Puntos ciegos en la conversión y el seguimiento de prospectos.`,
    
    acciones: (dna, h) => `15 ÓRDENES DE MANDO. 'Lo que tienes que hacer' + Lógica Condicional para capturar el capital fugado.`,
    
    herramientas: (dna, h) => `5 SOLUCIONES DE ESCALA. Tecnología para automatizar la confianza. Nombre + ROI estimado.`,
    
    omni: (dna, h) => `HOJA DE RUTA DE 21 DÍAS. El camino de la intervención para convertir el activo en una Autoridad de Cierre.`
};

const PROMPTS = {
    intro: (dna, h) => RAZONAMIENTOS.intro(dna),
    diagnostico: (dna, h) => RAZONAMIENTOS.diagnostico(dna),
    gemelos: (dna, h) => RAZONAMIENTOS.gemelos(dna, h),
    scorecard: (dna, h) => RAZONAMIENTOS.scorecard(dna, h),
    visibilidad: (dna, h) => RAZONAMIENTOS.visibilidad(dna, h),
    benchmark: (dna, h) => RAZONAMIENTOS.benchmark(dna, h),
    swot: (dna, h) => RAZONAMIENTOS.swot(dna, h),
    wishlist: (dna, h) => RAZONAMIENTOS.wishlist(dna, h),
    fugas: (dna, h) => RAZONAMIENTOS.fugas(dna, h),
    acciones: (dna, h) => RAZONAMIENTOS.acciones(dna, h),
    herramientas: (dna, h) => RAZONAMIENTOS.herramientas(dna, h),
    omni: (dna, h) => RAZONAMIENTOS.omni(dna, h)
};

module.exports = { PERSONA, PROMPTS };
