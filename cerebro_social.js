// cerebro_social.js - CEREBRO EXCLUSIVO PARA REDES SOCIALES + VISIBILIDAD IA

const { IDIOMA_SOCIAL } = require('./idioma');

const IDIOMA = IDIOMA_SOCIAL;

const REGLA_NUCLEAR = "REGLA NUCLEAR DE REDES SOCIALES: Auditas ÚNICAMENTE el perfil del cliente. Ignora muros de registro de Meta. PROHIBIDO $, USD, ROI% en diagnóstico.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: PROHIBIDO bullets (• o -). Cada punto inicia con NÚMERO + PUNTO + ESPACIO. Ejemplo: '1. [Texto]'.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### I. INTRODUCCIÓN, RESUMEN EJECUTIVO Y RADIOGRAFÍA DEL PERFIL\nPARTE A — Tabla: Plataforma, Giro (GIRO_DETECTADO), AI Score, Tiempo de carga, Veredicto (1 frase: por qué este perfil pierde clientes/seguidores).\nPARTE B — Para el emprendedor (1 párrafo): PREDICTACORE_MISION — solo lo público del perfil, sin datos internos; objetivo = convertir visitas del feed en acción. OBJETIVO_SIMULACIONES.\nPARTE C — Radiografía (bio + contenido). Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### II. PERFILES PSICOLÓGICOS DE AUDIENCIA (POR GIRO)\nUsa GIRO_CLIENTE y PERFIL_*. 4 perfiles. 2 oraciones c/u ligadas a FALLAS #id de SIMULATION_RESULTS. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### III. SCORECARD DE CONVERSIÓN SOCIAL\nTabla | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 10 filas. Incluye: Claridad de Bio, Link-in-Bio, Visibilidad en IAs, Cohesión Visual. Impacto cualitativo. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IV. AUTORIDAD SOCIAL, EMBUDO Y DESCUBRIMIENTO POR IA\nUsa bloque AI_VISIBILITY (datos reales). Evaluación técnica proxy — NO prueba en vivo en ChatGPT.\n\nSUBSECCIÓN A — Embudo social: retención, link-in-bio, arrendamiento algorítmico.\n\nSUBSECCIÓN B — Tabla | Motor IA | ¿Recomendaría? | Evidencia (bio, links, NAP) | Brecha |.\n\nSUBSECCIÓN C — Señales de entidad pública: nombre, categoría, ubicación, CTA, enlace externo.\nDossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### V. BENCHMARK COMPETITIVO SOCIAL\nOBLIGATORIO: BENCHMARK_VERIFIED, UBICACION_MERCADO y PERFIL_NEGOCIO. Mismo nicho + mismo mercado geográfico. Si PYME_BOUTIQUE, PROHIBIDO mega-retailers. Si SIN_COMPETENCIA_IDENTIFICADA, sin tabla. Si COMP_1..3, tabla SOLO con esos dominios. PROHIBIDO dominios no listados. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VI. MATRIZ ESTRATÉGICA (ASISTIDA POR IA)\nSWOT del perfil. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VII. DESEOS DE LA AUDIENCIA\n10 deseos de seguidores/visitantes del perfil. ${FORMATO_LISTAS}. Formato: 1. **Deseo:** "Ojalá…" / "I wish…". PROHIBIDO SEO técnico. Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nPrioridad: 1-3 **[Critical]**, 4-8 **[High]**, 9-12 **[Medium]**, 13-15 **[Low]**. PROHIBIDO P1/P2.\nEscribe este encabezado traducido: ### VIII. 15 PUNTOS DE FUGA\nEXACTAMENTE 15 líneas numeradas 1. al 15. Formato: 1. **[Critical]** [hallazgo] (evaluación #id). ${FORMATO_LISTAS}. Impacto cualitativo. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IX. 15 ACCIONES TÁCTICAS\nEXACTAMENTE 15 líneas numeradas del 1. al 15. — acción N resuelve fuga N. ${FORMATO_LISTAS}.\nOBLIGATORIO — Acción 1 o 2 **Visibilidad en IAs para perfil social**: web propia, Schema sameAs, bio citables, llms.txt en web vinculada. **[COPIAR Y PEGAR]:** bio mejorada.\nDossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### X. HERRAMIENTAS DE CRECIMIENTO\n5 SaaS (link-in-bio, programación, analytics, GEO). Sin ROI numérico. ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### XI. HOJA DE RUTA (21 DÍAS — ASISTIDA POR IA)\n3 fases × 3 pasos. ${FORMATO_LISTAS} Dossier: ${d}`,
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
