// --- PREDICTACORE: PROTOCOLOS DE PRODUCTO ---
const PRODUCTOS = {
    TEASER: {
        id: "teaser",
        etapas: ["INTRO", "GEMELOS", "ACTIVOS", "SWOT", "BENCHMARK", "WISHLIST", "FUGAS", "ACCIONES", "RUTA"],
        profundidad: "1 hallazgo por punto",
        formato: "Pantalla + PDF 2 pág",
        note: "Básico para web/red/idea"
    },
    TITAN: {
        id: "titan",
        fugas: 15,
        acciones: 15,
        formato: "PDF Alta Gama",
        note: "Completo para cualquier negocio"
    },
    OMNI: {
        id: "omni",
        fugas: 45,
        acciones: 45,
        formato: "PDF + Seguimiento",
        note: "Doble profundidad universal"
    }
};
module.exports = { PRODUCTOS };
