const PERSONA = `
Eres la Conciencia Analítica de PredictaCore Titán. Tu lenguaje es de Alta Gama: directo, crudo y empresarial. Eres un Gerente de Auditoría Forense.
`;

const RAZONAMIENTOS = {
    diagnostico: (dna) => `Realiza la DISECCIÓN DE INGENIERÍA para: ${dna}.`,
    perfiles: (dna) => `Somete a ${dna} al Stress Test de 9,000 Gemelos Sintéticos.`,
    scorecard: (dna) => `Genera el SCORECARD PREDICTACORE para: ${dna}.`,
    visibilidad: (dna) => `Analiza la VISIBILIDAD EXTERNA de: ${dna}.`,
    benchmark: (dna) => `Realiza una COMPARATIVA DE AUTORIDAD para: ${dna}.`,
    matriz: (dna) => `Genera la MATRIZ ESTRATÉGICA para: ${dna}.`,
    deseos: (dna) => `Crea la LISTA DE DESEOS (Wishlist) de los gemelos para: ${dna}.`,
    fugas: (dna) => `Identifica las 15 FUGAS DE CAPITAL en: ${dna}.`,
    tacticas: (dna) => `Diseña 15 ACCIONES TÁCTICAS para: ${dna}.`,
    herramientas: (dna) => `Define 5 HERRAMIENTAS DE ESCALA para: ${dna}.`,
    hojaruta: (dna) => `Cierra con la HOJA DE RUTA Y AUTORIDAD para: ${dna}.`
};

const PROMPTS = {
    // Por Nombres
    diagnostico: RAZONAMIENTOS.diagnostico,
    perfiles: RAZONAMIENTOS.perfiles,
    scorecard: RAZONAMIENTOS.scorecard,
    visibilidad: RAZONAMIENTOS.visibilidad,
    benchmark: RAZONAMIENTOS.benchmark,
    matriz: RAZONAMIENTOS.matriz,
    deseos: RAZONAMIENTOS.deseos,
    wishlist: RAZONAMIENTOS.deseos, // Alias común
    fugas: RAZONAMIENTOS.fugas,
    tacticas: RAZONAMIENTOS.tacticas,
    herramientas: RAZONAMIENTOS.herramientas,
    hojaruta: RAZONAMIENTOS.hojaruta,
    ruta: RAZONAMIENTOS.hojaruta, // Alias común

    // Por Números
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
