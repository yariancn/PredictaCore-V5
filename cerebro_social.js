// cerebro_social.js - CEREBRO EXCLUSIVO PARA REDES SOCIALES + VISIBILIDAD IA

const IDIOMA = "INSTRUCCIÓN CRÍTICA: Detecta el idioma de la biografía del negocio. IGNORA textos genéricos de la plataforma ('Iniciar sesión', 'Log in', 'Publicaciones'). Escribe TODO el reporte en el idioma del negocio.";

const REGLA_NUCLEAR = "REGLA NUCLEAR DE REDES SOCIALES: Tienes PROHIBIDO auditar a la plataforma (Instagram, Facebook, TikTok). Auditas ÚNICAMENTE el perfil del cliente. Ignora muros de registro de Meta.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: PROHIBIDO bullets (• o -). Cada punto inicia con NÚMERO + PUNTO + ESPACIO. Ejemplo: '1. [Texto]'.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### I. INTRODUCCIÓN, RESUMEN EJECUTIVO Y RADIOGRAFÍA DEL PERFIL\nPARTE A — RESUMEN EJECUTIVO: Tabla con Plataforma, AI Discoverability Score (del dossier), Tiempo de carga, Veredicto (1 frase).\nPARTE B — PredictaCore: simulaciones de fricción transaccional en perfiles sociales.\nPARTE C — Radiografía del negocio (bio + contenido). Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### II. PERFILES PSICOLÓGICOS DE AUDIENCIA\n4 perfiles de seguidores. 2 oraciones cada uno. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### III. SCORECARD DE CONVERSIÓN SOCIAL\nTabla | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |. 10 filas. Incluye: Claridad de Bio, Link-in-Bio, Visibilidad en IAs, Cohesión Visual. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IV. AUTORIDAD SOCIAL, EMBUDO Y DESCUBRIMIENTO POR IA\nUsa bloque AI_VISIBILITY del dossier (datos reales).\n\nSUBSECCIÓN A — Embudo social: retención, link-in-bio, arrendamiento algorítmico.\n\nSUBSECCIÓN B — ¿Cómo describirían las IAs este perfil?: Tabla | Motor IA | ¿Recomendaría este negocio? | Evidencia (bio, links, NAP) | Brecha |. Si no hay web propia, diagnostica invisibilidad fuera de la plataforma.\n\nSUBSECCIÓN C — Señales de entidad pública: nombre, categoría, ubicación, CTA, enlace externo verificable.\nDossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### V. BENCHMARK COMPETITIVO SOCIAL\n3 competidores reales. Tabla comparativa. Fila "Descubrimiento IA". Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VI. MATRIZ ESTRATÉGICA\nSWOT del perfil. ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VII. LISTA DE DESEOS\n10 tácticas de alto valor. ${FORMATO_LISTAS} Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### VIII. 15 PUNTOS DE FUGA\n15 errores en bio, link, CTAs, contenido. **[HEMORRAGIA CRÍTICA]** en los peores. ${FORMATO_LISTAS}. Usa capturas adjuntas. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### IX. 15 ACCIONES TÁCTICAS\nSoluciones a las 15 fugas. ${FORMATO_LISTAS}.\nOBLIGATORIO — Acción #1 o #2 **Visibilidad en IAs para perfil social**: web propia con Schema sameAs, bio optimizada para citación, link-in-bio con datos estructurados, consistencia NAP, llms.txt en web vinculada. **[COPIAR Y PEGAR]:** bio mejorada y ejemplo de enlace.\nDossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### X. HERRAMIENTAS DE CRECIMIENTO\n5 SaaS (link-in-bio, programación, DM automation, analytics, GEO monitoring). ${FORMATO_LISTAS} Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_NUCLEAR}\nEscribe este encabezado traducido: ### XI. HOJA DE RUTA (21 DÍAS)\n3 fases × 3 pasos para optimizar perfil + visibilidad IA. ${FORMATO_LISTAS} Dossier: ${d}`,
};

module.exports = { PROMPTS, IDIOMA, REGLA_NUCLEAR };
