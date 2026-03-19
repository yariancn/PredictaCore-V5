const PROMPTS = {
    intro: (d, h, t) => `SENTENCIA DE INGENIERÍA. Analiza el dossier: ${d}. Dictamina la salud del capital, autoridad y fallas lógicas. 3 párrafos de prosa densa.`,
    gemelos: (d, h, t) => `CRÓNICA DE ABANDONO. Crea 4 bocetos humanos (3 líneas c/u) basados en el dossier: ${d}. Quiénes son y qué buscan.`,
    scorecard: (d, h, t) => `SCORECARD DE RIESGO. Tabla con: Obstáculo, Diagnóstico, Impacto Financiero y Acción de Socio.`,
    visibilidad: (d, h, t) => `VISIBILIDAD EXTERNA. Analiza SEO y autoridad digital. ¿Líder o fantasma?`,
    benchmark: (d, h, t) => `EL ABISMO DE CERTEZA. Qué seguridad entrega el líder que nosotros ocultamos.`,
    swot: (d, h, t) => `MATRIZ DE TENSIÓN. Cruce de fortalezas de producto vs bloqueos de plataforma.`,
    wishlist: (d, h, t) => `ACELERADORES DE ESTATUS. 5 elementos técnicos para anular la resistencia al precio.`,
    fugas: (d, h, t) => `15 FUGAS DE CAPITAL. Identifica los 15 puntos exactos donde el dinero se escapa.`,
    acciones: (d, h, t) => `15 ÓRDENES DE MANDO. Instrucciones SI/ENTONCES para arreglar el flujo hoy.`,
    herramientas: (d, h, t) => `MAQUINARIA DE ESCALA. 5 herramientas para automatizar la confianza.`,
    omni: (d, h, t) => `HOJA DE RUTA DE 21 DÍAS. Plan de éxito y cierre de autoridad.`
};

module.exports = { PROMPTS };
