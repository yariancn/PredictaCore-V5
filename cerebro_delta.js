// cerebro_delta.js — Seguimiento mensual (web + redes sociales)
// Independiente de cerebro.js y cerebro_social.js — no modificar esos archivos para DELTA.

const { IDIOMA_DELTA } = require('./idioma');

const IDIOMA = IDIOMA_DELTA;

const REGLA_NUCLEAR = 'REGLA NUCLEAR: PredictaCore en modo SEGUIMIENTO MENSUAL. Comparas el reporte Titán inicial vs el estado actual del mismo activo (sitio web o perfil social). Concreto y ejecutivo. Máximo 2 párrafos por sección. PDF total: 2-3 páginas. PROHIBIDO $, USD, ROI%.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

function tipoActivo(isSocial) {
    return isSocial
        ? 'perfil social (Instagram, Facebook, TikTok, etc.)'
        : 'sitio web';
}

function bloqueEvidencia(isSocial) {
    if (isSocial) {
        return 'Usa SIMULATION_RESULTS, SEO_FORENSICS/AI_VISIBILITY del dossier y señales del perfil (bio, enlaces externos, contacto, CTAs).';
    }
    return 'Usa SIMULATION_RESULTS, SEO_FORENSICS y señales técnicas del sitio (H1, meta, Schema, contacto, velocidad).';
}

function buildPromptsDelta(isSocial = false) {
    const activo = tipoActivo(isSocial);
    const evidencia = bloqueEvidencia(isSocial);

    return {
        RESUMEN: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### I. RESUMEN EJECUTIVO DEL MES\nCompara estado actual vs reporte Titán inicial del mismo ${activo}.\nIncluye diff de scores si aparecen (SEO_TECNICO_SCORE, AI_DISCOVERABILITY_SCORE, TIEMPO_CARGA_SEG).\n2 párrafos: (1) progreso — ¿mejoró, estancó o empeoró? (2) acción #1 más urgente.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nESTADO ACTUAL (dossier):\n${d}`,

        IMPLEMENTADAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### II. ACCIONES IMPLEMENTADAS\nDel Titán inicial (sección ACCIONES y FUGAS), qué ya se aplicó — evidencia en el dossier actual.\n${FORMATO_LISTAS}\nMáximo 5 puntos. Si no hay evidencia clara, escribe: "Sin evidencia de implementación."\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### III. ACCIONES PENDIENTES (ALTA PRIORIDAD)\nRecomendaciones del Titán AÚN NO implementadas.\n${FORMATO_LISTAS}\nMáximo 7 puntos. Por cada una, 1 línea de impacto cualitativo (sin $).\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### IV. NUEVAS FRICCIONES DETECTADAS\nProblemas NUEVOS o claramente EMPEORADOS respecto al Titán — no repetir fugas ya listadas sin cambio.\n${evidencia}\n${FORMATO_LISTAS}\nOBLIGATORIO: mínimo 3 puntos numerados (máximo 5). Si hay menos de 3 nuevas, incluye las que empeoraron vs el Titán.\nFormato cada punto: 1. **[Critical]** o **[High]** o **[Medium]** — [fricción en 1-2 frases] (evidencia: evaluación #id o dato del dossier).\nPROHIBIDO inventar fricciones sin evidencia en el dossier actual.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        ACCIONES_NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### V. ACCIONES NUEVAS — CÓMO RESOLVER LAS FRICCIONES\nAcciones concretas para resolver las fricciones de la sección IV (misma numeración: acción 1 resuelve fricción 1, etc.).\n${FORMATO_LISTAS}\nOBLIGATORIO: mínimo 3 acciones numeradas (una por cada fricción nueva de la sección IV).\nFormato cada punto: 1. **Resolver [fricción #1]:** qué hacer paso a paso (2-3 líneas). **[COPIAR Y PEGAR]:** texto listo para bio, title, meta, CTA o copy visible — cuando aplique.\nPrioriza las de mayor impacto en conversión. PROHIBIDO $, USD, ROI%.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,
    };
}

/** Prompts web (default export para compatibilidad) */
const PROMPTS_DELTA = buildPromptsDelta(false);

function extractInitialSummary(seccionesJson) {
    if (!seccionesJson || typeof seccionesJson !== 'object') return 'Sin reporte Titán inicial disponible.';
    const keys = ['FUGAS', 'ACCIONES', 'SCORECARD', 'INTRO', 'GEMELOS', 'VISIBILIDAD', 'FUGAS_LITE'];
    const parts = [];
    for (const k of keys) {
        if (seccionesJson[k]) parts.push(`[${k}]\n${seccionesJson[k]}`);
    }
    if (parts.length === 0) {
        for (const k in seccionesJson) {
            parts.push(`[${k}]\n${seccionesJson[k]}`);
            if (parts.join('').length > 12000) break;
        }
    }
    return parts.join('\n\n').substring(0, 15000);
}

function extractScoreSnapshot(dossier) {
    const pick = (re) => {
        const m = (dossier || '').match(re);
        return m ? m[1] : null;
    };
    return {
        seo: pick(/SEO_TECNICO_SCORE:\s*(\d+)/),
        ai: pick(/AI_DISCOVERABILITY_SCORE:\s*(\d+)/),
        load: pick(/TIEMPO_CARGA_SEG:\s*([\d.]+)/),
    };
}

function formatScoreDiffBlock(prevDossier, currentDossier) {
    const prev = extractScoreSnapshot(prevDossier);
    const cur = extractScoreSnapshot(currentDossier);
    const diff = (a, b) => {
        if (a == null || b == null) return 'N/A';
        const d = Number(b) - Number(a);
        return d > 0 ? `+${d}` : String(d);
    };
    return `
=== SCORE_DIFF_MENSUAL (DATOS REALES) ===
SEO_TECNICO: ${prev.seo ?? '?'} → ${cur.seo ?? '?'} (${diff(prev.seo, cur.seo)})
AI_VISIBILITY: ${prev.ai ?? '?'} → ${cur.ai ?? '?'} (${diff(prev.ai, cur.ai)})
TIEMPO_CARGA_SEG: ${prev.load ?? '?'} → ${cur.load ?? '?'} (${diff(prev.load, cur.load)})
=== FIN SCORE_DIFF_MENSUAL ===`;
}

module.exports = {
    PROMPTS_DELTA,
    buildPromptsDelta,
    extractInitialSummary,
    extractScoreSnapshot,
    formatScoreDiffBlock,
    IDIOMA,
    REGLA_NUCLEAR,
};
