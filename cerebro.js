const PROMPTS = {
    intro: (d) => `I. DIAGNÓSTICO DE INGENIERÍA: Emite una sentencia de capital en 3 párrafos de prosa densa. Analiza autoridad y riesgo. Dossier: ${d}`,
    gemelos: (d) => `II. PERFILES PSICOLÓGICOS: Crea 4 bocetos humanos de 3 líneas. Define quiénes son y qué buscan.`,
    scorecard: (d) => `III. SCORECARD PREDICTACORE: Tabla de Obstáculo, Diagnóstico, Dinero Perdido e Impacto.`,
    visibilidad: (d) => `IV. VISIBILIDAD EXTERNA: Diagnóstico de SEO y redes. ¿Líder o fantasma digital?`,
    benchmark: (d) => `V. BENCHMARKING LOCAL: El dato de seguridad que el líder entrega y tú callas.`,
    swot: (d) => `VI. MATRIZ ESTRATÉGICA: Fortalezas de producto vs. Bloqueos de plataforma.`,
    wishlist: (d) => `VII. LISTA DE DESEOS: 5 aceleradores técnicos para que el precio no importe.`,
    fugas: (d) => `VIII. 15 FUGAS DE CAPITAL: Identifica los 15 puntos exactos donde el dinero se escapa.`,
    acciones: (d) => `IX. 15 ACCIONES TÁCTICAS: Instrucciones directas (SI... ENTONCES...).`,
    herramientas: (d) => `X. 5 HERRAMIENTAS DE ESCALA: Tecnología para automatizar la confianza.`,
    omni: (d) => `XI. AUTORIDAD Y HOJA DE RUTA: Plan de 21 días y cierre de Socio Senior.`
};
module.exports = { PROMPTS };
