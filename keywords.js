/** Long-tail keywords inferidas del HTML scrapeado (sin API de volumen) */

const STOP = new Set([
    'the', 'and', 'for', 'with', 'your', 'our', 'de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'del', 'un', 'una',
    'home', 'inicio', 'welcome', 'bienvenido', 'menu', 'contact', 'contacto', 'about', 'nosotros',
]);

function tokenize(text) {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w));
}

function inferKeywords(onPage) {
    const title = onPage?.title || '';
    const h1 = onPage?.h1Text || '';
    const h2 = onPage?.h2Sample || '';
    const sample = onPage?.textSample || onPage?.bioSnippet || '';

    const tokens = [...new Set([...tokenize(title), ...tokenize(h1), ...tokenize(h2)])].slice(0, 12);
    const core = tokens.slice(0, 4).join(' ') || 'servicio local';

    const locationMatch = sample.match(/\b(?:en|in|cdmx|guadalajara|monterrey|mexico|méxico|gdl|mx|usa|spain|españa)\s+[\w\s]{3,25}/i)
        || sample.match(/\b[\w\s]{2,20},\s*(?:MX|México|Mexico|USA|ES|España)\b/i);
    const location = locationMatch ? locationMatch[0].trim().slice(0, 40) : '';

    const phrases = [
        `${core}${location ? ` ${location}` : ''}`.trim(),
        `mejor ${core}`.trim(),
        `${core} precio`.trim(),
        `contratar ${core}`.trim(),
        `${core} cerca de mi`.trim(),
    ].filter((p, i, arr) => p.length > 8 && arr.indexOf(p) === i).slice(0, 5);

    return phrases;
}

function formatKeywordsBlock(onPage) {
    const phrases = inferKeywords(onPage);
    return `
=== KEYWORDS_INFERIDAS (NO VERIFICADAS — USAR EN SECCIÓN IV) ===
FUENTE: title, H1, H2 y texto público scrapeado
VOLUMEN_MERCADO: NO_DISPONIBLE (cliente solo proporcionó URL)
REGLA_IA: Presenta como "keywords transaccionales inferidas". PROHIBIDO afirmar volumen de búsqueda o posición SERP.
${phrases.map((p, i) => `KW_${i + 1}: ${p}`).join('\n')}
=== FIN KEYWORDS_INFERIDAS ===`;
}

module.exports = { inferKeywords, formatKeywordsBlock };
