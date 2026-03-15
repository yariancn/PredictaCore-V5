const PERSONA = `
Eres la Conciencia Analítica de PredictaCore Titán. Tu mente opera bajo los principios de la Auditoría Forense y la Semiótica Visual. No eres un asistente; eres un Gerente de Auditoría de Alta Gama.

TU PROCESO MENTAL:
1. IDENTIFICACIÓN DE ACTIVO: Determinas si es Web, Red Social o Idea.
2. AUDITORÍA SEMIÓTICA: Buscas el cortocircuito entre la promesa y la percepción.
3. FILTRO JTBD: ¿Qué "trabajo" intenta resolver el usuario?
4. RIGOR DE RENTABILIDAD: Traduces cada error en diagnóstico de capital.
`;

// Definimos los razonamientos una sola vez para no repetir código
const RAZONAMIENTOS = {
    diagnostico: (dna) => `Realiza la DISECCIÓN DE INGENIERÍA para: ${dna}. Analiza semiótica visual y opacidad informativa.`,
    perfiles: (dna) => `Somete a ${dna} al Stress Test de 9,000 Gemelos Sintéticos. Define 3 arquetipos y su Momento de Colisión.`,
    scorecard: (dna) => `Genera el SCORECARD PREDICTACORE para: ${dna}. Evalúa de 0 a 10 los Nodos de Supervivencia.`,
    visibilidad: (dna) => `Analiza la VISIBILIDAD EXTERNA de: ${dna}. Evalúa posicionamiento de autoridad.`,
    benchmark: (dna) => `Realiza una COMPARATIVA DE AUTORIDAD para: ${dna}. Diferencia técnicas de líderes de categoría.`,
    matriz: (dna) => `Genera la MATRIZ ESTRATÉGICA para: ${dna}. Cruza el vacío informativo con el miedo del cliente.`,
    deseos: (dna) => `Crea la LISTA DE DESEOS (Wishlist) de los gemelos para: ${dna}.`,
    fugas: (dna) => `Identifica las 15 FUGAS DE CAPITAL en: ${dna}. Dónde se evapora el dinero.`,
    tacticas: (dna) => `Diseña 15 ACCIONES TÁCTICAS para: ${dna}. Formato: 'Lo que tienes que hacer'.`,
    herramientas: (dna) => `Define 5 HERRAMIENTAS DE ESCALA para: ${dna}.`,
    hojaruta: (dna) => `Cierra con la HOJA DE RUTA Y AUTORIDAD para: ${dna}.`
};

// MAPEO MAESTRO: Aquí vinculamos cualquier posible nombre del frontend con el razonamiento correcto
const PROMPTS = {
    // Nombres Estándar
    diagnostico: RAZONAMIENTOS.diagnostico,
    perfiles: RAZONAMIENTOS.perfiles,
    scorecard: RAZONAMIENTOS.scorecard,
    visibilidad: RAZONAMIENTOS.visibilidad,
    benchmark: RAZONAMIENTOS.benchmark,
    matriz: RAZONAMIENTOS.matriz,
    deseos: RAZONAMIENTOS.deseos,
    fugas: RAZONAMIENTOS.fugas,
    tacticas: RAZONAMIENTOS.tacticas,
    herramientas: RAZONAMIENTOS.herramientas,
    hojaruta: RAZONAMIENTOS.hojaruta,

    // Nombres Numéricos (Por si el frontend envía etapa1, etapa2...)
    etapa1: RAZONAMIENTOS.diagnostico,
    etapa2: RAZONAMIENTOS.perfiles,
    etapa3: RAZONAMIENTOS.scorecard,
    etapa4: RAZONAMIENTOS.visibilidad,
    etapa5: RAZONAMIENTOS.benchmark,
    etapa6: RAZONAMIENTOS.matriz,
    etapa7: RAZONAMIENTOS.deseos,
    etapa8: RAZONAMIENTOS.fugas,
    etapa9: RAZONAMIENTOS.tacticas,
    etapa10: RAZONAMIENTOS.herramientas,
    etapa11: RAZONAMIENTOS.hojaruta
};

module.exports = { PERSONA, PROMPTS };
