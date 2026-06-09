/** Post-validación de secciones Gemini — anti-alucinación y anti-$ */

const MONEY_RE = /(?:USD|\$|€|£|MXN|\+\d{1,3}%|\d{1,3}%\s*(?:ROI|retorno|incremento|aumento))/i;
const GENERIC_RE = /(?:en general|muchas empresas|la mayoría de sitios|podría ser que|quizás|probablemente|it is common|many businesses)/i;

const REQUIRED_MARKERS = {
    VISIBILIDAD: ['SEO_FORENSICS', 'SEO_TECNICO_SCORE', 'AI_DISCOVERABILITY_SCORE', 'AI_VISIBILITY'],
    SEO_IA_LITE: ['SEO_FORENSICS', 'AI_VISIBILITY', 'SEO_TECNICO_SCORE', 'AI_DISCOVERABILITY_SCORE'],
    BENCHMARK: ['BENCHMARK_VERIFIED'],
    FUGAS: ['SIMULATION_RESULTS'],
    FUGAS_LITE: ['SIMULATION_RESULTS'],
    GEMELOS: ['GIRO_CLIENTE', 'SIMULATION_RESULTS'],
    SCORECARD: ['SEO_TECNICO_SCORE', 'AI_DISCOVERABILITY_SCORE', 'TIEMPO_CARGA_SEG'],
};

function hasAnyMarker(text, markers) {
    const lower = (text + '').toLowerCase();
    return markers.some((m) => lower.includes(m.toLowerCase()) || lower.includes(String(m).toLowerCase()));
}

function dossierHas(dossier, key) {
    return (dossier || '').includes(key);
}

const SKIP_MONEY_CHECK = new Set(['UPSELL', 'HERRAMIENTAS']);

const NUMBERED_SECTIONS = {
    FUGAS: 15,
    ACCIONES: 15,
    WISHLIST: 10,
    FUGAS_LITE: 3,
    OMNI: 9,
};

function validateSection(etapaId, content, dossier, locale) {
    const issues = [];
    const text = content || '';

    if (!SKIP_MONEY_CHECK.has(etapaId) && MONEY_RE.test(text)) {
        issues.push('Contiene cifras monetarias o ROI — prohibido sin datos del cliente');
    }
    if (GENERIC_RE.test(text)) {
        issues.push('Lenguaje genérico detectado — exige evidencia del dossier');
    }
    if (/\b9,?000\b|miles de simulaciones|thousands of simulations|9000\+/i.test(text)) {
        issues.push('PROHIBIDO citar cantidad de simulaciones — describe objetivos y giro');
    }

    const required = REQUIRED_MARKERS[etapaId];
    if (required && dossierHas(dossier, required[0])) {
        const dossierOk = required.some((m) => dossierHas(dossier, m));
        if (dossierOk) {
            const contentOk = required.some((m) => text.includes(m) || hasDossierValueInContent(text, dossier, m));
            if (!contentOk && ['VISIBILIDAD', 'SEO_IA_LITE', 'SCORECARD'].includes(etapaId)) {
                issues.push(`Debe citar datos reales del dossier (${required.join(' o ')})`);
            }
        }
    }

    if (etapaId === 'BENCHMARK' && dossierHas(dossier, 'SIN_COMPETENCIA_IDENTIFICADA')) {
        if (/comp\s*[123]|competidor\s*[123]|vs\.?\s*\w+\.com/i.test(text) && !text.includes('SIN_COMPETENCIA') && !text.includes('No se identificó')) {
            issues.push('Inventó competidores — dossier indica SIN_COMPETENCIA_IDENTIFICADA');
        }
    }

    if (etapaId === 'BENCHMARK' && dossierHas(dossier, 'COMP_1:')) {
        const compDomains = [...dossier.matchAll(/COMP_\d+:\s*([\w.-]+)/g)].map((m) => m[1]);
        const mentioned = compDomains.filter((d) => text.toLowerCase().includes(d.toLowerCase()));
        if (compDomains.length && mentioned.length === 0) {
            issues.push(`Debe usar competidores verificados: ${compDomains.join(', ')}`);
        }
    }

    if (NUMBERED_SECTIONS[etapaId]) {
        const expected = NUMBERED_SECTIONS[etapaId];
        const count = ((text || '').match(/^\s*\d+\.\s+/gm) || []).length;
        if (count < expected - 1) {
            issues.push(`Debe listar exactamente ${expected} puntos numerados (1. 2. 3. …). Encontrados: ${count}. PROHIBIDO viñetas • o -`);
        }
    }

    if (locale) {
        const { detectMixedLanguage } = require('./report-format');
        const mix = detectMixedLanguage(text, locale);
        if (mix) issues.push(mix);
    }

    return {
        ok: issues.length === 0,
        issues,
        retrySuffix: issues.length
            ? `\n\nCORRECCIÓN OBLIGATORIA: ${issues.join('; ')}. Reescribe cumpliendo reglas. Cita evidencia del dossier. PROHIBIDO $, ROI% y competidores no verificados.`
            : '',
    };
}

function hasDossierValueInContent(content, dossier, marker) {
    if (marker.includes('SCORE')) {
        const m = dossier.match(new RegExp(`${marker}:\\s*(\\d+)`, 'i'));
        if (m && content.includes(m[1])) return true;
    }
    if (marker === 'TIEMPO_CARGA_SEG') {
        const m = dossier.match(/TIEMPO_CARGA_SEG:\s*([\d.]+)/);
        if (m && content.includes(m[1])) return true;
    }
    return content.includes(marker);
}

function stripFinancialClaims(text) {
    return text
        .replace(/\*\*Impacto financiero[^*]*\*\*/gi, '**Impacto en conversión:**')
        .replace(/Impacto financiero[^.\n]*/gi, 'Impacto en conversión (cualitativo)')
        .replace(/(?:USD|\$|€|£|MXN)\s*[\d,.]+/g, '[impacto cualitativo — sin cifras]')
        .replace(/\+\d{1,3}%\s*(?:ROI|retorno)?/gi, 'riesgo elevado de abandono');
}

module.exports = { validateSection, stripFinancialClaims, MONEY_RE, SKIP_MONEY_CHECK };
