// cerebro_delta.js — Reporte mensual comparativo (seguimiento)

const IDIOMA = 'INSTRUCCIÓN CRÍTICA: Detecta el idioma principal del sitio web. Redacta TODO el reporte en ese idioma.';

const REGLA_NUCLEAR = 'REGLA NUCLEAR: PredictaCore Titán en modo SEGUIMIENTO MENSUAL. Comparas reporte inicial vs estado actual. Concreto y ejecutivo. Máximo 2 párrafos por sección. PROHIBIDO $, USD, ROI%.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

const PROMPTS_DELTA = {
    RESUMEN: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. RESUMEN EJECUTIVO DEL MES\nCompara estado actual vs reporte Titán inicial.\nIncluye diff de scores si aparecen en dossier (SEO_TECNICO_SCORE, AI_DISCOVERABILITY_SCORE, TIEMPO_CARGA_SEG).\n2 párrafos: (1) progreso — ¿mejoró, estancó o empeoró? (2) acción #1 más urgente.\n\nREPORTE INICIAL:\n${inicial}\n\nESTADO ACTUAL:\n${d}`,

    IMPLEMENTADAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. ACCIONES IMPLEMENTADAS\nDel reporte Titán, acciones YA aplicadas (evidencia en dossier actual).\n${FORMATO_LISTAS}\nMáximo 5 puntos. Si no hay evidencia, indícalo.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. ACCIONES PENDIENTES (ALTA PRIORIDAD)\nRecomendaciones críticas AÚN NO implementadas.\n${FORMATO_LISTAS}\nMáximo 7 puntos. Por cada una, 1 línea de impacto cualitativo en conversión (sin $).\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IV. NUEVAS FRICCIONES DETECTADAS\nHasta 5 problemas NUEVOS o empeorados. Usa SIMULATION_RESULTS y SEO_FORENSICS.\n${FORMATO_LISTAS}\nEvidencia del dossier actual.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    ROADMAP: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. PLAN DE ACCIÓN — PRÓXIMOS 30 DÍAS (ASISTIDO POR IA)\n3 acciones concretas priorizadas.\n${FORMATO_LISTAS}\nExactamente 3 puntos. Copy-paste cuando aplique.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,
};

function extractInitialSummary(seccionesJson) {
    if (!seccionesJson || typeof seccionesJson !== 'object') return 'Sin reporte inicial disponible.';
    const keys = ['FUGAS', 'ACCIONES', 'SCORECARD', 'INTRO', 'FUGAS_LITE'];
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
    extractInitialSummary,
    extractScoreSnapshot,
    formatScoreDiffBlock,
    IDIOMA,
    REGLA_NUCLEAR,
};
