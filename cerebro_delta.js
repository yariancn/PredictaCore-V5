// cerebro_delta.js — Seguimiento mensual (web + redes sociales)
// Independiente de cerebro.js y cerebro_social.js — no modificar esos archivos para DELTA.

const { IDIOMA_DELTA } = require('./idioma');

const IDIOMA = IDIOMA_DELTA;

const REGLA_NUCLEAR = 'REGLA NUCLEAR: PredictaCore en modo SEGUIMIENTO MENSUAL. Comparas el reporte Titán inicial vs el estado actual del mismo activo (sitio web o perfil social). Concreto y ejecutivo. Máximo 2 párrafos por sección. PDF total: 2-3 páginas. PROHIBIDO $, USD, ROI%.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

const REGLA_DIFF = `REGLA CAMBIOS VERIFICADOS: Usa el bloque === CAMBIOS_VERIFICADOS === del dossier como fuente de verdad.
- SIN_CAMBIO = NO hubo cambio real entre scrapes — PROHIBIDO decir que se implementó o empeoró.
- MEJORA = cambio verificable a mejor — solo entonces puede ir en IMPLEMENTADAS.
- EMPEORA = regresión verificable — solo entonces puede ir en NUEVAS FRICCIONES.
- Si el Titán recomendó algo pero CAMBIOS_VERIFICADOS dice SIN_CAMBIO, sigue PENDIENTE (no implementado).`;

function deltaHeaders(locale) {
    const es = locale?.code?.startsWith('es');
    if (es) {
        return {
            scorecard: '### SCORECARD DE SEGUIMIENTO',
            resumen: '### I. RESUMEN EJECUTIVO DEL MES',
            implementadas: '### II. ACCIONES IMPLEMENTADAS',
            pendientes: '### III. ACCIONES PENDIENTES (ALTA PRIORIDAD)',
            nuevas: '### IV. NUEVAS FRICCIONES DETECTADAS',
            acciones: '### V. ACCIONES NUEVAS — CÓMO RESOLVER LAS FRICCIONES',
            sinImplementacion: 'Sin evidencia de implementación verificable.',
            sinPendientes: 'Sin pendientes críticos adicionales identificados.',
        };
    }
    return {
        scorecard: '### MONTHLY SCORECARD',
        resumen: '### I. MONTHLY EXECUTIVE SUMMARY',
        implementadas: '### II. IMPLEMENTED ACTIONS',
        pendientes: '### III. PENDING ACTIONS (HIGH PRIORITY)',
        nuevas: '### IV. NEW FRICTIONS DETECTED',
        acciones: '### V. NEW ACTIONS — HOW TO RESOLVE THE FRICTIONS',
        sinImplementacion: 'No verifiable implementation evidence.',
        sinPendientes: 'No additional critical pending items identified.',
    };
}

function tipoActivo(isSocial, locale) {
    const es = locale?.code?.startsWith('es');
    if (isSocial) return es ? 'perfil social (Instagram, Facebook, TikTok, etc.)' : 'social profile (Instagram, Facebook, TikTok, etc.)';
    return es ? 'sitio web' : 'website';
}

function bloqueEvidencia(isSocial) {
    if (isSocial) {
        return 'Usa SIMULATION_RESULTS, SEO_FORENSICS/AI_VISIBILITY del dossier y señales del perfil (bio, enlaces externos, contacto, CTAs).';
    }
    return 'Usa SIMULATION_RESULTS, SEO_FORENSICS y señales técnicas del sitio (H1, meta, Schema, contacto, velocidad).';
}

function buildPromptsDelta(isSocial = false, locale = { code: 'en-US' }) {
    const activo = tipoActivo(isSocial, locale);
    const evidencia = bloqueEvidencia(isSocial);
    const H = deltaHeaders(locale);
    const copyPaste = locale?.code?.startsWith('es') ? '**[COPIAR Y PEGAR]:**' : '**[COPY & PASTE]:**';

    return {
        RESUMEN: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.resumen}\nCompara estado actual vs reporte Titán inicial del mismo ${activo}.\nUsa SCORECARD y CAMBIOS_VERIFICADOS — no inventes progreso.\n2 párrafos: (1) progreso real (mejoró, estancó o empeoró según datos) (2) acción #1 más urgente.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nESTADO ACTUAL (dossier):\n${d}`,

        IMPLEMENTADAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.implementadas}\nLista SOLO acciones del Titán cuyo campo en CAMBIOS_VERIFICADOS sea MEJORA.\n${FORMATO_LISTAS}\nMáximo 5 puntos. Si ningún campo es MEJORA, escribe exactamente: "${H.sinImplementacion}"\nPROHIBIDO listar title, meta, contacto o H1 si CAMBIOS_VERIFICADOS dice SIN_CAMBIO.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.pendientes}\nRecomendaciones del Titán AÚN NO implementadas (CAMBIOS_VERIFICADOS = SIN_CAMBIO o EMPEORA en ese campo).\n${FORMATO_LISTAS}\nMáximo 7 puntos. Por cada una, 1 línea de impacto cualitativo (sin $).\nNo repitas como pendiente algo ya listado en IMPLEMENTADAS.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.nuevas}\nLista SOLO fricciones con CAMBIOS_VERIFICADOS = EMPEORA o hallazgos nuevos en SIMULATION_RESULTS no presentes en el Titán.\n${evidencia}\n${FORMATO_LISTAS}\nOBLIGATORIO: exactamente 3 puntos numerados (máximo 5).\nFormato: 1. **[Critical|High|Medium]** — [fricción] (evidencia: campo CAMBIOS_VERIFICADOS o SIMULATION_RESULTS).\nPROHIBIDO listar como nueva una fricción que el Titán ya reportó y sigue SIN_CAMBIO.\nPROHIBIDO listar MEJORA aquí.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        ACCIONES_NUEVAS: (d, inicial, nuevasIv = '') => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n${H.acciones}\nResuelve EXACTAMENTE las fricciones de la sección IV — misma numeración (acción 1 → fricción 1, etc.).\n${FORMATO_LISTAS}\nOBLIGATORIO: mismo número de acciones que puntos en sección IV (${Math.max(3, (nuevasIv.match(/^\s*\d+\.\s+/gm) || []).length) || 3} acciones).\nFormato: 1. **Resolver fricción #1:** pasos concretos (2-3 líneas). ${copyPaste} texto listo cuando aplique.\nPROHIBIDO proponer acciones para fugas del Titán que no estén en la sección IV.\n\nSECCIÓN IV (fricciones a resolver):\n${nuevasIv || '(generar después de IV)'}\n\nDOSSIER ACTUAL:\n${d}`,
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

function extractForensicSnapshot(dossier) {
    const pick = (re) => {
        const m = (dossier || '').match(re);
        return m ? m[1].trim() : null;
    };
    const text = dossier || '';
    const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    return {
        seo: pick(/SEO_TECNICO_SCORE:\s*(\d+)/),
        ai: pick(/AI_DISCOVERABILITY_SCORE:\s*(\d+)/),
        load: pick(/TIEMPO_CARGA_SEG:\s*([\d.]+)/),
        title: pick(/TITLE \(\d+ chars\): (.+)/),
        meta: pick(/META_DESCRIPTION \(\d+ chars\): (.+)/),
        h1Count: pick(/H1_COUNT:\s*(\d+)/),
        h1Text: pick(/H1_TEXT:\s*(.+)/),
        altPct: pick(/IMAGENES_ALT_COVERAGE:\s*(\d+)/),
        jsonLd: pick(/JSON_LD:\s*(\d+)/),
        sitemap: pick(/SITEMAP_XML:\s*(\S+)/),
        email: emailMatch ? emailMatch[0] : null,
    };
}

function normVal(val) {
    return String(val || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function isAbsent(val) {
    const v = normVal(val);
    return !v
        || v === 'ausente'
        || v === 'absent'
        || v === 'no_encontrado'
        || v === 'not found'
        || v === 'ninguno'
        || v === 'none';
}

function h1Effective(snap) {
    const count = Number(snap.h1Count || 0);
    const text = normVal(snap.h1Text);
    if (count === 0) return 'missing';
    if (isAbsent(snap.h1Text) || text.length < 3) return 'empty';
    return 'ok';
}

function compareNumeric(label, prev, cur, { higherIsBetter = true, tolerance = 0 } = {}) {
    const p = Number(prev);
    const c = Number(cur);
    if (Number.isNaN(p) || Number.isNaN(c)) {
        return { label, status: 'N/A', prev, cur };
    }
    if (Math.abs(c - p) <= tolerance) {
        return { label, status: 'SIN_CAMBIO', prev, cur };
    }
    if (c === p) return { label, status: 'SIN_CAMBIO', prev, cur };
    const improved = higherIsBetter ? c > p : c < p;
    return { label, status: improved ? 'MEJORA' : 'EMPEORA', prev, cur };
}

function compareTextField(label, prev, cur) {
    if (normVal(prev) === normVal(cur)) {
        return { label, status: 'SIN_CAMBIO', prev, cur };
    }
    if (isAbsent(prev) && !isAbsent(cur)) {
        return { label, status: 'MEJORA', prev, cur };
    }
    if (!isAbsent(prev) && isAbsent(cur)) {
        return { label, status: 'EMPEORA', prev, cur };
    }
    return { label, status: 'CAMBIO', prev, cur };
}

function compareH1(prevSnap, curSnap) {
    const prev = h1Effective(prevSnap);
    const cur = h1Effective(curSnap);
    if (prev === cur) {
        return {
            label: 'H1',
            status: prev === 'ok' ? 'SIN_CAMBIO' : 'SIN_CAMBIO',
            prev: `${prevSnap.h1Count ?? '?'} (${prevSnap.h1Text || 'AUSENTE'})`,
            cur: `${curSnap.h1Count ?? '?'} (${curSnap.h1Text || 'AUSENTE'})`,
        };
    }
    if (prev !== 'ok' && cur === 'ok') {
        return { label: 'H1', status: 'MEJORA', prev: prevSnap.h1Text, cur: curSnap.h1Text };
    }
    if (prev === 'ok' && cur !== 'ok') {
        return { label: 'H1', status: 'EMPEORA', prev: prevSnap.h1Text, cur: curSnap.h1Text };
    }
    return { label: 'H1', status: 'SIN_CAMBIO', prev: prevSnap.h1Text, cur: curSnap.h1Text };
}

function buildStructuralDiff(prevDossier, currentDossier) {
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const rows = [
        compareNumeric('SEO_TECNICO', prev.seo, cur.seo, { higherIsBetter: true }),
        compareNumeric('AI_VISIBILITY', prev.ai, cur.ai, { higherIsBetter: true }),
        compareNumeric('TIEMPO_CARGA_SEG', prev.load, cur.load, { higherIsBetter: false, tolerance: 0.25 }),
        compareTextField('TITLE', prev.title, cur.title),
        compareTextField('META_DESCRIPTION', prev.meta, cur.meta),
        compareH1(prev, cur),
        compareNumeric('ALT_TEXT_PCT', prev.altPct, cur.altPct, { higherIsBetter: true }),
        compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd, { higherIsBetter: true }),
        compareTextField('SITEMAP', prev.sitemap, cur.sitemap),
        compareTextField('CONTACT_EMAIL', prev.email, cur.email),
    ];

    const lines = rows.map((r) => `${r.label}: ${r.prev ?? '?'} → ${r.cur ?? '?'} | ${r.status}`);
    const mejoras = rows.filter((r) => r.status === 'MEJORA').map((r) => r.label);
    const empeoras = rows.filter((r) => r.status === 'EMPEORA').map((r) => r.label);

    return {
        rows,
        mejoras,
        empeoras,
        block: `
=== CAMBIOS_VERIFICADOS (DIFF REAL ENTRE SCRAPES — OBLIGATORIO) ===
${lines.join('\n')}
MEJORAS_VERIFICADAS: ${mejoras.length ? mejoras.join(', ') : 'NINGUNA'}
REGRESIONES_VERIFICADAS: ${empeoras.length ? empeoras.join(', ') : 'NINGUNA'}
REGLA: SIN_CAMBIO = no afirmes implementación ni nueva fricción por ese campo.
=== FIN CAMBIOS_VERIFICADOS ===`,
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

function trendLabel(delta, locale, invert = false) {
    const es = locale?.code?.startsWith('es');
    const d = Number(delta);
    if (Number.isNaN(d) || delta === 'N/A') return es ? 'N/D' : 'N/A';
    if (Math.abs(d) < 0.01) return es ? 'Sin cambio' : 'No change';
    const up = invert ? d < 0 : d > 0;
    if (up) return es ? 'Mejora' : 'Improved';
    return es ? 'Empeora' : 'Declined';
}

function buildDeltaScorecard(prevDossier, currentDossier, locale = { code: 'en-US' }) {
    const H = deltaHeaders(locale);
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const es = locale?.code?.startsWith('es');

    const row = (label, p, c, delta, invert = false) => {
        const trend = trendLabel(delta, locale, invert);
        return `| ${label} | ${p ?? '—'} | ${c ?? '—'} | ${delta ?? '—'} | ${trend} |`;
    };

    const seoD = prev.seo != null && cur.seo != null ? Number(cur.seo) - Number(prev.seo) : 'N/A';
    const aiD = prev.ai != null && cur.ai != null ? Number(cur.ai) - Number(prev.ai) : 'N/A';
    const loadD = prev.load != null && cur.load != null
        ? (Number(cur.load) - Number(prev.load)).toFixed(2)
        : 'N/A';
    const altD = prev.altPct != null && cur.altPct != null ? Number(cur.altPct) - Number(prev.altPct) : 'N/A';

    const h1Prev = h1Effective(prev) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');
    const h1Cur = h1Effective(cur) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');
    const h1Trend = h1Effective(prev) === h1Effective(cur)
        ? (es ? 'Sin cambio' : 'No change')
        : (h1Effective(cur) === 'ok' ? (es ? 'Mejora' : 'Improved') : (es ? 'Empeora' : 'Declined'));

    const header = es
        ? '| Métrica | Titán (baseline) | Actual | Δ | Tendencia |'
        : '| Metric | Titan (baseline) | Current | Δ | Trend |';
    const sep = '| --- | --- | --- | --- | --- |';

    const diff = buildStructuralDiff(prevDossier, currentDossier);
    const summary = es
        ? `**Resumen:** ${diff.mejoras.length} mejora(s) verificada(s); ${diff.empeoras.length} regresión(es).`
        : `**Summary:** ${diff.mejoras.length} verified improvement(s); ${diff.empeoras.length} regression(s).`;

    return `${H.scorecard}
${summary}

${header}
${sep}
${row(es ? 'SEO técnico' : 'Technical SEO', `${prev.seo ?? '—'}/100`, `${cur.seo ?? '—'}/100`, typeof seoD === 'number' ? (seoD > 0 ? `+${seoD}` : String(seoD)) : seoD)}
${row(es ? 'Visibilidad IA' : 'AI visibility', `${prev.ai ?? '—'}/100`, `${cur.ai ?? '—'}/100`, typeof aiD === 'number' ? (aiD > 0 ? `+${aiD}` : String(aiD)) : aiD)}
${row(es ? 'Carga (seg)' : 'Load (sec)', prev.load ?? '—', cur.load ?? '—', loadD, true)}
${row(es ? 'Alt text (%)' : 'Alt text (%)', prev.altPct != null ? `${prev.altPct}%` : '—', cur.altPct != null ? `${cur.altPct}%` : '—', typeof altD === 'number' ? (altD > 0 ? `+${altD}` : String(altD)) : altD)}
| H1 | ${h1Prev} | ${h1Cur} | — | ${h1Trend} |
| JSON-LD | ${prev.jsonLd ?? '0'} | ${cur.jsonLd ?? '0'} | — | ${compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd).status === 'SIN_CAMBIO' ? (es ? 'Sin cambio' : 'No change') : compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd).status} |`;
}

const DELTA_SECTION_ORDER = ['SCORECARD', 'RESUMEN', 'IMPLEMENTADAS', 'PENDIENTES', 'NUEVAS', 'ACCIONES_NUEVAS'];

module.exports = {
    PROMPTS_DELTA,
    buildPromptsDelta,
    extractInitialSummary,
    extractScoreSnapshot,
    extractForensicSnapshot,
    buildStructuralDiff,
    buildDeltaScorecard,
    formatScoreDiffBlock,
    deltaHeaders,
    DELTA_SECTION_ORDER,
    IDIOMA,
    REGLA_NUCLEAR,
};
