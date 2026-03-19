// --- CONFIGURACIÓN DE PRODUCTOS (Para el servidor y el frontend) ---
const PRODUCTOS = {
    TEASER: { id: "teaser", etapas: ["INTRO", "GEMELOS", "ACTIVOS", "SWOT", "BENCHMARK", "WISHLIST", "FUGAS", "ACCIONES", "RUTA"], profundidad: "1 hallazgo", formato: "PDF 2 pág" },
    TITAN: { id: "titan", fugas: 15, acciones: 15, formato: "PDF Alta Gama" },
    OMNI: { id: "omni", fugas: 45, acciones: 45, formato: "PDF + Seguimiento" }
};

// --- METODOLOGÍA DE ANÁLISIS (Para la IA) ---
const PROTOCOLOS_IA = `
### METODOLOGÍA DE DISECCIÓN FORENSE:
1. PROTOCOLO DE ESTORBOS: Identifica elementos (chats, pop-ups, banners) que bloqueen el camino de compra.
2. PROTOCOLO DE TEXTURA: Evalúa si las imágenes transmiten la calidad y sensación del material (tocar con los ojos).
3. PROTOCOLO DE COHERENCIA LÓGICA: Busca precios contradictorios o promesas que chocan con la realidad técnica.
4. PROTOCOLO DE AUTORIDAD VISUAL: Analiza si el diseño proyecta un negocio de estatus o uno amateur.
`;

module.exports = { PRODUCTOS, PROTOCOLOS_IA };
