const PROMPTS = {
    intro: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: 3 párrafos de prosa densa y juicio puro sobre Autoridad, Flujo y Contrato Técnico. Sin guiones. Dossier: ${d}`,
    gemelos: (d) => `II. PERFILES PSICOLÓGICOS: 4 bocetos humanos de 3 líneas. Identidad, emoción y objetivo inmediato.`,
    scorecard: (d) => `III. SCORECARD PREDICTACORE: Tabla con Obstáculo, Diagnóstico Visual, Impacto Financiero y Acción de Socio.`,
    visibilidad: (d) => `IV. VISIBILIDAD EXTERNA: Diagnóstico de autoridad en Google y redes. ¿Líder o fantasma digital?`,
    benchmark: (d) => `V. BENCHMARKING LOCAL: El dato de seguridad que el líder entrega y nosotros ocultamos.`,
    swot: (d) => `VI. MATRIZ ESTRATÉGICA: Fortalezas de producto vs. Bloqueos de plataforma.`,
    wishlist: (d) => `VII. LISTA DE DESEOS: 5 elementos técnicos para que el precio no sea un problema.`,
    fugas: (d) => `VIII. 15 FUGAS DE CAPITAL: Identifica los 15 puntos exactos donde el dinero se escapa.`,
    acciones: (d) => `IX. 15 ACCIONES TÁCTICAS: Instrucciones directas (SI pasa esto... ENTONCES haz aquello).`,
    herramientas: (d) => `X. 5 HERRAMIENTAS DE ESCALA: Tecnología para automatizar la confianza.`,
    omni: (d) => `XI. AUTORIDAD Y HOJA DE RUTA: Plan de 21 días y cierre de Socio Senior.`
};

module.exports = { PROMPTS };
