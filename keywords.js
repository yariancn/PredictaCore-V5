/** Long-tail keywords inferidas del HTML scrapeado (sin API de volumen) — solo producto/servicio, sin marca */

const STOP = new Set([
    'the', 'and', 'for', 'with', 'your', 'our', 'de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'del', 'un', 'una',
    'home', 'inicio', 'welcome', 'bienvenido', 'menu', 'contact', 'contacto', 'about', 'nosotros',
    'privacy', 'policy', 'cookie', 'cookies', 'terms', 'conditions', 'consent', 'gdpr', 'legal',
    'politica', 'privacidad', 'datos', 'personales', 'value', 'valores',
    'shop', 'store', 'official', 'website', 'online', 'buy', 'best',
]);

const LEGAL_PHRASE = /\b(privacy|policy|cookie|gdpr|terms|conditions|consent|legal|política|privacidad|datos personales)\b/i;

function normalizeToken(w) {
    return String(w || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w]/g, '');
}

/** Marca = primer segmento del title (antes de | - —) + hostname; NO la parte producto/servicio */
function brandTokensFrom(url, clientTitle) {
    const tokens = new Set();
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0].toLowerCase();
        if (host.length >= 3) tokens.add(host);
        const brandSegment = (clientTitle || '').split(/\s*[|\-–—]\s*/)[0] || '';
        brandSegment.toLowerCase().split(/\s+/).forEach((w) => {
            const clean = normalizeToken(w);
            if (clean.length >= 3) {
                tokens.add(clean);
                if (host.includes(clean) && clean.length >= 4) tokens.add(clean);
            }
        });
        brandSegment.toLowerCase().split(/\s+/).forEach((w) => {
            const clean = normalizeToken(w);
            if (clean.length >= 4 && host.includes(clean)) tokens.add(clean);
        });
    } catch { /* skip */ }
    return tokens;
}

function tokenize(text, brandTokens) {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w)
            && ![...(brandTokens || [])].some((bt) => bt.length >= 3 && w.includes(bt)));
}

function productTitleCore(onPage, brandTokens) {
    const title = (onPage?.title || onPage?.metaTitle || '').replace(/&/g, ' ').trim();
    const parts = title.split(/\s*[|\-–—]\s*/).map((p) => p.trim()).filter(Boolean);
    const productPart = parts.slice(1).find((p) => {
        const lower = normalizeToken(p);
        return lower.length > 8 && ![...(brandTokens || [])].some((bt) => bt.length >= 4 && lower.includes(bt));
    }) || parts.find((p) => {
        const lower = p.toLowerCase();
        return ![...(brandTokens || [])].some((bt) => bt.length >= 4 && lower.includes(bt));
    });
    return productPart || parts[parts.length - 1] || title;
}

function inferKeywords(onPage, locale, url = '', clientTitle = '') {
    const es = locale?.code?.startsWith('es');
    const brandTokens = brandTokensFrom(url, clientTitle || onPage?.title);
    const titleCore = productTitleCore(onPage, brandTokens);
    const metaCore = (onPage?.metaDescription || '').split(/[.!?|,;]/)[0].trim();
    const h1 = onPage?.h1Text && onPage.h1Text !== 'AUSENTE' && onPage.h1Text !== 'ABSENT'
        ? onPage.h1Text : '';
    const h2 = onPage?.h2Sample && !/privacy|policy|cookie|privacidad/i.test(onPage.h2Sample)
        ? onPage.h2Sample : '';

    const tokens = [...new Set([
        ...tokenize(titleCore, brandTokens),
        ...tokenize(metaCore, brandTokens),
        ...tokenize(h1, brandTokens),
        ...tokenize(h2, brandTokens),
    ])].slice(0, 8);
    const core = tokens.slice(0, 5).join(' ') || titleCore.toLowerCase().replace(/[^\w\s-]/g, ' ').trim()
        || (es ? 'servicio local' : 'local service');

    const sample = onPage?.textSample || onPage?.bioSnippet || '';
    const locationMatch = !LEGAL_PHRASE.test(sample) && (
        sample.match(/\b(?:en|in|cdmx|guadalajara|monterrey|mexico|méxico|gdl|mx|usa|spain|españa|texas|california)\s+[\w\s]{3,25}/i)
        || sample.match(/\b[\w\s]{2,20},\s*(?:MX|México|Mexico|USA|ES|España|TX|CA|FL|NY)\b/i)
    );
    const location = locationMatch ? locationMatch[0].trim().slice(0, 40) : '';

    const phrases = es
        ? [
            titleCore.trim(),
            core,
            `${core}${location ? ` ${location}` : ''}`.trim(),
            `mejor ${core}`.trim(),
            `${core} precio`.trim(),
            `comprar ${core}`.trim(),
        ]
        : [
            titleCore.trim(),
            core,
            `${core}${location ? ` ${location}` : ''}`.trim(),
            `best ${core}`.trim(),
            `${core} price`.trim(),
            `buy ${core}`.trim(),
        ];

    return phrases
        .filter((p, i, arr) => p.length > 8 && !LEGAL_PHRASE.test(p) && arr.indexOf(p) === i)
        .slice(0, 5);
}

function formatKeywordsBlock(onPage, locale, url = '', clientTitle = '') {
    const phrases = inferKeywords(onPage, locale, url, clientTitle);
    const es = locale?.code?.startsWith('es');
    const rule = es
        ? 'Presenta como "keywords transaccionales inferidas". PROHIBIDO afirmar volumen de búsqueda o posición SERP. PROHIBIDO keywords de políticas legales/privacidad. PROHIBIDO incluir nombre comercial/marca del activo — solo productos o servicios.'
        : 'Present as "inferred transactional keywords". PROHIBITED to claim search volume or SERP rank. PROHIBITED legal/privacy policy keywords. PROHIBITED brand/business name tokens — products or services only.';

    return `
=== KEYWORDS_INFERIDAS (NO VERIFICADAS — USAR EN SECCIÓN IV) ===
FUENTE: title (parte producto), H1, H2 — excluye nombre comercial/marca y footer legal
VOLUMEN_MERCADO: NO_DISPONIBLE (cliente solo proporcionó URL)
REGLA_IA: ${rule}
${phrases.length ? phrases.map((p, i) => `KW_${i + 1}: ${p}`).join('\n') : 'KW_1: (sin keywords inferidas — usar title/H1 del dossier)'}
=== FIN KEYWORDS_INFERIDAS ===`;
}

module.exports = { inferKeywords, formatKeywordsBlock, brandTokensFrom, productTitleCore };
