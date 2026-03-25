// cerebro.js - BÚNKER 2: ESTRUCTURA JSON (DATOS PUROS Y CONTROL ABSOLUTO)

const PROMPTS = {
  INTRO: (d) => `Eres PredictaCore. Basado en este dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "parrafos": ["Párrafo 1 explicando qué es PredictaCore y por qué somos mejores en conversión.", "Párrafo 2 resumiendo de qué trata el activo analizado y declarando explícitamente su PAÍS/MERCADO OBJETIVO."] }`,

  GEMELOS: (d) => `Basado en el dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "gemelos": [ { "nombre": "Nombre del Perfil 1", "descripcion": "Máximo 2 oraciones indicando quién es y qué producto busca." }, ... (genera 4 perfiles) ] }`,

  SCORECARD: (d) => `Evalúa 10 puntos de salud comercial con máxima profundidad. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "scorecard": [ { "punto": "Nombre del punto", "calificacion": "X/10", "diagnostico": "Análisis forense de 3 a 5 líneas." }, ... (genera 10 puntos) ] }`,

  VISIBILIDAD: (d) => `Haz un análisis de visibilidad y competidores en Google. Respeta el país del activo. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "datos": [ { "titulo": "Estrellas y Reseñas", "texto": "..." }, { "titulo": "Mercado y 3 Competidores Directos", "texto": "..." }, { "titulo": "Palabras Clave Transaccionales Perdidas", "texto": "..." }, { "titulo": "Capital Evaporado", "texto": "..." } ] }`,

  BENCHMARK: (d) => `Compara el activo con los 3 competidores exactos de la sección de Visibilidad. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "competidores": ["Comp1", "Comp2", "Comp3"], "fricciones": [ { "nombre": "Fricción Estratégica 1", "activo": "Diagnóstico del activo...", "comp1": "Diagnóstico comp1...", "comp2": "...", "comp3": "..." }, ... (genera 3 fricciones) ] }`,

  SWOT: (d) => `Genera una matriz estratégica. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "fortalezas": ["Punto 1...", "Punto 2...", "Punto 3..."], "debilidades": ["..."], "oportunidades": ["..."], "amenazas": ["..."] }`,

  WISHLIST: (d) => `Identifica 10 características de alto valor. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "deseos": ["Deseo táctico 1...", "Deseo táctico 2...", ... (hasta 10)] }`,

  FUGAS: (d) => `Identifica 15 fugas criticas. Marca 1 o 2 como [HEMORRAGIA CRÍTICA]. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "fugas": [ { "titulo": "Nombre de la fuga", "descripcion": "Análisis y causa raíz..." }, ... (hasta 15)] }`,

  ACCIONES: (d) => `Identifica 15 acciones tácticas directas para sellar las fugas. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "acciones": [ { "titulo": "Acción para fuga 1", "descripcion": "Cómo solucionarlo..." }, ... (hasta 15)] }`,

  HERRAMIENTAS: (d) => `Recomienda 5 herramientas SaaS. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "herramientas": [ { "nombre": "Nombre del Software", "descripcion": "Por qué usarlo..." }, ... (hasta 5)] }`,

  OMNI: (d) => `Crea la hoja de ruta ejecutiva. Dossier: ${d}
  Responde ÚNICAMENTE con un objeto JSON válido con este formato exacto:
  { "fases": [ { "fase": "Fase 1 (Días 1-7)", "descripcion": "..." }, { "fase": "Fase 2 (Días 8-14)", "descripcion": "..." }, { "fase": "Fase 3 (Días 15-21)", "descripcion": "..." } ] }`
};

module.exports = { PROMPTS };
