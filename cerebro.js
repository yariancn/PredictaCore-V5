const PROMPTS = {
    intro: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: 3 párrafos de prosa densa sobre autoridad y riesgo. Sin listas. Dossier: ${d}`,
    gemelos: (d) => `II. PERFILES PSICOLÓGICOS: 4 bocetos humanos de 3 líneas. Identidad, emoción y objetivo inmediato. Dossier: ${d}`,
    scorecard: (d) => `III. SCORECARD PREDICTACORE: Tabla de Obstáculo, Diagnóstico, Dinero Perdido e Impacto. Dossier: ${d}`,
    visibilidad: (d) => `IV. VISIBILIDAD EXTERNA: ¿Líder o fantasma digital? Dossier: ${d}`,
    benchmark: (d) => `V. BENCHMARKING LOCAL: El dato de seguridad que el líder entrega y tú callas. Dossier: ${d}`,
    swot: (d) => `VI. MATRIZ ESTRATÉGICA: Fortalezas de producto vs. Bloqueos de plataforma. Dossier: ${d}`,
    wishlist: (d) => `VII. LISTA DE DESEOS: 5 elementos técnicos para que el precio no sea un problema. Dossier: ${d}`,
    fugas: (d) => `VIII. 15 FUGAS DE CAPITAL: Identifica los 15 puntos exactos de fuga. Dossier: ${d}`,
    acciones: (d) => `IX. 15 ACCIONES TÁCTICAS: Instrucciones directas (SI... ENTONCES...). Dossier: ${d}`,
    herramientas: (d) => `X. 5 HERRAMIENTAS DE ESCALA: Tecnología para automatizar la confianza. Dossier: ${d}`,
    omni: (d) => `XI. AUTORIDAD Y HOJA DE RUTA: Plan de 21 días y cierre de Socio Senior. Dossier: ${d}`
};

module.exports = { PROMPTS };
