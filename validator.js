const { MEGA_RETAILER_RE, BLOCKLIST } = require('./competitors');
const { hasPlaceholderLeaks } = require('./fugas-builder');

const MEGA_RETAILER_DOMAINS = [
    'target.com', 'walmart.com', 'amazon.com', 'costco.com', 'bestbuy.com',
    'homedepot.com', 'lowes.com', 'macys.com', 'kohls.com', 'wayfair.com',
    'ebay.com', 'etsy.com', 'samsclub.com',
];

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

function validateSection(etapaId, content, dossier, locale, opts = {}) {
    const issues = [];
    const text = content || '';
    const countNumbered = (t) => ((t || '').match(/^\s*\d+\.\s+/gm) || []).length;

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
        if (/\b(blackbell|santander|wix\.com|shopify\.com|squarespace|godaddy)\b/i.test(text)) {
            issues.push('Inventó competidores no verificados — dossier indica SIN_COMPETENCIA_IDENTIFICADA');
        }
        for (const mega of MEGA_RETAILER_DOMAINS) {
            const short = mega.split('.')[0];
            if (text.toLowerCase().includes(short)) {
                issues.push(`PROHIBIDO mega-retailer ${mega} — no hay competencia verificada en dossier`);
            }
        }
        if (/\|\s*criterio\s*\|/i.test(text) && /comp\s*[123]/i.test(text)) {
            issues.push('PROHIBIDO tabla comparativa cuando no hay competidores verificados');
        }
    }

    if (etapaId === 'BENCHMARK' && dossierHas(dossier, 'COMP_1:')) {
        const compDomains = [...dossier.matchAll(/COMP_\d+:\s*([\w.-]+)/g)].map((m) => m[1]);
        const mentioned = compDomains.filter((d) => text.toLowerCase().includes(d.toLowerCase()));
        if (compDomains.length && mentioned.length === 0) {
            issues.push(`Debe usar competidores verificados: ${compDomains.join(', ')}`);
        }
        if (compDomains.length < 3) {
            issues.push(`Se requieren al menos 3 competidores verificados en dossier — encontrados: ${compDomains.length}`);
        }
        for (const d of compDomains) {
            if (BLOCKLIST.has(d) || /^(ecwid|shopify|wix|squarespace|bigcommerce|tiendanube)\./i.test(d)) {
                issues.push(`PROHIBIDO plataforma/SaaS como competidor: ${d}`);
            }
        }
        const allowed = new Set(compDomains.map((d) => d.toLowerCase()));
        const clientDomain = (dossier.match(/URL:\s*(https?:\/\/)?([\w.-]+)/i) || [])[2];
        if (clientDomain) allowed.add(clientDomain.toLowerCase());

        for (const mega of MEGA_RETAILER_DOMAINS) {
            const short = mega.split('.')[0];
            if (text.toLowerCase().includes(short) && !allowed.has(mega)) {
                issues.push(`PROHIBIDO mega-retailer ${mega} — el activo es boutique/PYME del nicho; solo competidores verificados en COMP_*`);
            }
        }
        if (MEGA_RETAILER_RE.test(text) && dossierHas(dossier, 'PYME_BOUTIQUE')) {
            const hasUnauthorizedMega = MEGA_RETAILER_DOMAINS.some((mega) => {
                const short = mega.split('.')[0];
                return text.toLowerCase().includes(short) && !allowed.has(mega);
            });
            if (hasUnauthorizedMega) {
                issues.push('PROHIBIDO comparar con big-box/mass-market — PERFIL_NEGOCIO indica PYME boutique');
            }
        }

        const extraDomain = text.match(/\b([a-z0-9-]+\.(com|net|org|io|shop|store))\b/gi) || [];
        const invented = extraDomain.filter((d) => !allowed.has(d.toLowerCase()) && !['predictacore.ai'].includes(d.toLowerCase()));
        if (invented.length > 0) {
            issues.push(`Dominios no autorizados en benchmark: ${[...new Set(invented)].slice(0, 4).join(', ')} — solo COMP_* del dossier`);
        }
        if (!/qu[eé] hacen|what they do/i.test(text)) {
            issues.push('La tabla debe incluir fila "Qué hacen / What they do" con QUE_HACE del dossier');
        }
        if (/NO_DETECTADO/i.test(text) && compDomains.length > 0) {
            issues.push('PROHIBIDO NO_DETECTADO en celdas de competidores — copia literal QUE_HACE de COMP_N');
        }
    }

    if (etapaId === 'SWOT' && dossierHas(dossier, 'PYME_BOUTIQUE')) {
        for (const mega of MEGA_RETAILER_DOMAINS) {
            const short = mega.split('.')[0];
            if (text.toLowerCase().includes(short)) {
                issues.push(`SWOT no debe citar mega-retailers (${mega}) — compara solo con rivales del nicho verificados`);
            }
        }
    }

    if (etapaId === 'WISHLIST') {
        const techWish = /\b(h1 tag|schema\.org|json-ld|alt text|robots\.txt|meta description|canonical|sitemap)\b/i.test(text);
        if (techWish) {
            issues.push('Wishlist debe ser deseos del CLIENTE visitante — PROHIBIDO fixes técnicos SEO (van en Acciones/Fugas)');
        }
        if (!/\b(wish|ojal[aá]|desear[ií]a|gustar[ií]a|me gustar[ií]a|i wish)\b/i.test(text)) {
            issues.push('Cada deseo debe expresarse como deseo del visitante (Wish / Ojalá pudiera / I wish I could)');
        }
    }

    if (NUMBERED_SECTIONS[etapaId]) {
        const expected = NUMBERED_SECTIONS[etapaId];
        const count = ((text || '').match(/^\s*\d+\.\s+/gm) || []).length;
        if (count < expected - 1) {
            issues.push(`Debe listar exactamente ${expected} puntos numerados (1. 2. 3. …). Encontrados: ${count}. PROHIBIDO viñetas • o -`);
        }
    }

    if (etapaId === 'FUGAS' && hasPlaceholderLeaks(text)) {
        issues.push('PROHIBIDO texto placeholder ("not detected from available data") — usa TODAS las FALLAS_PRIORITARIAS del dossier SIMULATION_RESULTS');
    }

    if (etapaId === 'FUGAS' && /(?:evaluaci[oó]n|evaluation)\s*#?(?:1[6-9]|[2-9]\d)/i.test(text)) {
        issues.push('PROHIBIDO citar evaluación #16 o superior — máximo 15 fugas');
    }

    if (etapaId === 'FUGAS' && (text.match(/\*\*\[P1\s*[—-]/gi) || []).length > 4) {
        issues.push('PROHIBIDO usar códigos P1/P2 — usa Critical/High/Medium/Low');
    }

    if (etapaId === 'FUGAS' && /\bP[1-4]\s+(?:CRITICAL|SEVERE|MODERATE|MINOR|HEMORRHAGE|LEAK)\b/i.test(text)) {
        issues.push('PROHIBIDO códigos P1/P2/P3/P4 — usa **[Critical]**, **[High]**, **[Medium]**, **[Low]**');
    }

    if (opts.modo === 'DELTA' && dossierHas(dossier, 'CAMBIOS_VERIFICADOS')) {
        if (etapaId === 'IMPLEMENTADAS') {
            const ninguna = /MEJORAS_IMPLEMENTACION:\s*NINGUNA/i.test(dossier);
            const hasList = countNumbered(text) > 0;
            const hasEmptyPhrase = /sin evidencia de implementaci[oó]n|no verifiable implementation/i.test(text);
            if (ninguna && hasList && !hasEmptyPhrase) {
                issues.push('IMPLEMENTADAS inventó cambios — CAMBIOS_VERIFICADOS indica MEJORAS_IMPLEMENTACION: NINGUNA');
            }
            if (!ninguna && hasList) {
                const mejoras = (dossier.match(/MEJORAS_IMPLEMENTACION:\s*([^\n]+)/i) || [])[1] || '';
                const claimed = /\b(title|meta|contact|email|correo|t[ií]tulo|contacto|seo score|seo t[eé]cnico)\b/i.test(text);
                if (claimed && !/\b(TITLE|META|H1|JSON_LD|SITEMAP)\b/i.test(mejoras)) {
                    issues.push('IMPLEMENTADAS cita campos no listados en MEJORAS_IMPLEMENTACION del dossier');
                }
            }
            if (/\b(meta description|contact email|descriptive meta)\b/i.test(text) && /MEJORAS_IMPLEMENTACION:\s*NINGUNA/i.test(dossier)) {
                issues.push('PROHIBIDO afirmar meta/contacto implementado — MEJORAS_IMPLEMENTACION: NINGUNA');
            }
        }
        if (etapaId === 'NUEVAS') {
            const count = countNumbered(text);
            if (count > 0 && count < 1) {
                issues.push(`Sección IV requiere fricciones numeradas. Encontradas: ${count}`);
            }
        }
        if (etapaId === 'ACCIONES_NUEVAS') {
            const ivCount = countNumbered(opts.nuevasSection || '');
            const actionCount = countNumbered(text);
            const expected = ivCount > 0 ? ivCount : 2;
            if (actionCount < expected) {
                issues.push(`Sección V debe tener ${expected} acciones. Encontradas: ${actionCount}`);
            }
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
