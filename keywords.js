/** Long-tail keywords inferidas del HTML scrapeado (sin API de volumen) */

const STOP = new Set([
    'the', 'and', 'for', 'with', 'your', 'our', 'de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'del', 'un', 'una',
    'home', 'inicio', 'welcome', 'bienvenido', 'menu', 'contact', 'contacto', 'about', 'nosotros',
    'privacy', 'policy', 'cookie', 'cookies', 'terms', 'conditions', 'consent', 'gdpr', 'legal',
    'politica', 'privacidad', 'datos', 'personales', 'value', 'valores',
]);

const LEGAL_PHRASE = /\b(privacy|policy|cookie|gdpr|terms|conditions|consent|legal|política|privacidad|datos personales)\b/i;

function tokenize(text) {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w));
}

function inferKeywords(onPage, locale) {
    const es = locale?.code?.startsWith('es');
    const title = (onPage?.title || '').replace(/&/g, ' ');
    const h1 = onPage?.h1Text && onPage.h1Text !== 'AUSENTE' && onPage.h1Text !== 'ABSENT'
        ? onPage.h1Text : '';
    const h2 = onPage?.h2Sample && !/privacy|policy|cookie|privacidad/i.test(onPage.h2Sample)
        ? onPage.h2Sample : '';

    const titleCore = title.split(/\s*[|\-–—]\s*/)[0].trim();
    const tokens = [...new Set([...tokenize(titleCore), ...tokenize(title), ...tokenize(h1), ...tokenize(h2)])].slice(0, 12);
    const core = tokens.slice(0, 5).join(' ') || (es ? 'servicio local' : 'local service');

    const sample = onPage?.textSample || onPage?.bioSnippet || '';
    const locationMatch = !LEGAL_PHRASE.test(sample) && (
        sample.match(/\b(?:en|in|cdmx|guadalajara|monterrey|mexico|méxico|gdl|mx|usa|spain|españa|texas|california)\s+[\w\s]{3,25}/i)
        || sample.match(/\b[\w\s]{2,20},\s*(?:MX|México|Mexico|USA|ES|España|TX|CA|FL|NY)\b/i)
    );
    const location = locationMatch ? locationMatch[0].trim().slice(0, 40) : '';

    const phrases = es
        ? [
            titleCore || `${core}`.trim(),
            `${core}${location ? ` ${location}` : ''}`.trim(),
            `mejor ${core}`.trim(),
            `${core} precio`.trim(),
            `contratar ${core}`.trim(),
        ]
        : [
            titleCore || `${core}`.trim(),
            `${core}${location ? ` ${location}` : ''}`.trim(),
            `best ${core}`.trim(),
            `${core} price`.trim(),
            `buy ${core}`.trim(),
        ];

    return phrases
        .filter((p, i, arr) => p.length > 8 && !LEGAL_PHRASE.test(p) && arr.indexOf(p) === i)
        .slice(0, 5);
}

function formatKeywordsBlock(onPage, locale) {
    const phrases = inferKeywords(onPage, locale);
    const es = locale?.code?.startsWith('es');
    const rule = es
        ? 'Presenta como "keywords transaccionales inferidas". PROHIBIDO afirmar volumen de búsqueda o posición SERP. PROHIBIDO keywords de políticas legales/privacidad.'
        : 'Present as "inferred transactional keywords". PROHIBITED to claim search volume or SERP rank. PROHIBITED legal/privacy policy keywords.';

    return `
=== KEYWORDS_INFERIDAS (NO VERIFICADAS — USAR EN SECCIÓN IV) ===
FUENTE: title, H1, H2 (excluye footer legal/privacidad)
VOLUMEN_MERCADO: NO_DISPONIBLE (cliente solo proporcionó URL)
REGLA_IA: ${rule}
${phrases.length ? phrases.map((p, i) => `KW_${i + 1}: ${p}`).join('\n') : 'KW_1: (sin keywords inferidas — usar title/H1 del dossier)'}
=== FIN KEYWORDS_INFERIDAS ===`;
}

module.exports = { inferKeywords, formatKeywordsBlock };
