const RAZONAMIENTOS = {
    // PUNTO I: SENTENCIA ESTRATÉGICA (UNIVERSAL)
    intro: (dna, h, today) => `FECHA: ${today}. ACTIVO: ${dna}. 
    Emite una SENTENCIA DE CAPITAL profesional. Analiza la Arquitectura de Autoridad (diseño y estatus), la Hemorragia de Flujo (estorbos y navegación) y el Contrato Técnico (evidencias reales). 
    REGLA: Escribe 3 párrafos densos de juicio puro. Enfócate en el riesgo del dinero y la experiencia del cliente. Prohibido usar listas.`,

    // PUNTO II: RETRATO HUMANO (CONCISO)
    gemelos: (dna, h, today) => `CRÓNICA DE ABANDONO (4 PERFILES) AL ${today}.
    Identifica 4 personas reales (clientes ideales) que entrarían a este activo. Describe en 3 líneas: quién es, su estado emocional (prisa, duda, emoción) y su objetivo inmediato. 
    REGLA: Sin etiquetas técnicas. Solo la esencia humana del comprador.`,
    
    // PUNTO III: SCORECARD DE SALUD
    scorecard: (dna, h, today) => `SCORECARD DE RIESGO AL ${today}. 
    Crea una tabla: "Obstáculo (Lo que estorba)", "Diagnóstico (Lo que el ojo ve)", "Impacto Financiero" y "Acción de Socio". Aplica las 6 leyes de oro.`,

    // PUNTO IX: 15 ÓRDENES DE MANDO
    acciones: (dna, h, today) => `15 ACCIONES TÁCTICAS AL ${today}. 
    Instrucciones directas usando la lógica "SI [falla detectada]... ENTONCES [acción inmediata]". Enfócate en diseño, visibilidad de botones, limpieza de estorbos y claridad de precios.`,

    // PUNTO XI: RUTA DE ÉXITO
    omni: (dna, h, today) => `HOJA DE RUTA DE 21 DÍAS AL ${today}. 
    Plan de 3 fases: 1. Limpieza de Estorbos, 2. Blindaje de Confianza, 3. Escala. Termina con un cierre motivador y profesional que comande a la acción.`
};

module.exports = { PROMPTS: RAZONAMIENTOS };
