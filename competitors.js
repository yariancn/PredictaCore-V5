/** Competitor discovery via web search (sin API de pago) — solo URL del cliente */

const BLOCKLIST = new Set([
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'yelp.com', 'wikipedia.org',
    'amazon.com', 'mercadolibre.com', 'google.com', 'apple.com',
    'tripadvisor.com', 'trustpilot.com', 'reddit.com',
]);

async function fetchSearchHtml(query) {
    const q = encodeURIComponent(query);
    const urls = [
        `https://html.duckduckgo.com/html/?q=${q}`,
        `https://www.bing.com/search?q=${q}&count=10`,
    ];
    for (const url of urls) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 10000);
            const res = await fetch(url, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; PredictaCore/1.0; +https://predictacore.ai)',
                    'Accept-Language': 'es,en;q=0.9',
                },
            });
            clearTimeout(timer);
            if (res.ok) return await res.text();
        } catch {
            /* try next */
        }
    }
    return null;
}

function extractDomain(href) {
    try {
        let u = href;
        if (u.startsWith('//duckduckgo.com/l/?')) {
            const m = u.match(/uddg=([^&]+)/);
            if (m) u = decodeURIComponent(m[1]);
        }
        if (u.startsWith('//')) u = `https:${u}`;
        const parsed = new URL(u);
        return parsed.hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

function parseDomainsFromHtml(html, clientDomain) {
    const found = [];
    const seen = new Set([clientDomain]);
    const hrefRe = /href="([^"]+)"/gi;
    let m;
    while ((m = hrefRe.exec(html)) !== null) {
        const domain = extractDomain(m[1]);
        if (!domain || seen.has(domain)) continue;
        if (BLOCKLIST.has(domain) || domain.endsWith('.google.com')) continue;
        if (domain.includes('duckduckgo') || domain.includes('bing.com') || domain.includes('microsoft.com')) continue;
        seen.add(domain);
        found.push(domain);
        if (found.length >= 5) break;
    }
    return found;
}

function buildSearchQuery(onPage, url, isSocial) {
    const title = (onPage?.title || '').replace(/\s*[|\-–—].*$/, '').trim();
    const h1 = (onPage?.h1Text || onPage?.bioSnippet || '').split('|')[0].trim();
    const sample = (onPage?.textSample || onPage?.bioSnippet || '').slice(0, 200);
    let niche = h1 || title || sample.slice(0, 60);
    niche = niche.replace(/[^\w\sáéíóúñÁÉÍÓÚÑ,.-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (niche.length < 8) {
        try {
            const host = new URL(url).hostname.replace(/^www\./, '');
            niche = host.split('.')[0];
        } catch {
            niche = 'negocio local servicios';
        }
    }
    if (isSocial) return `${niche} perfil negocio similar`;
    return `${niche} servicios sitio web`;
}

async function fetchPageTitle(domain) {
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(`https://${domain}`, {
            signal: ctrl.signal,
            headers: { 'User-Agent': 'PredictaCore-Forensics/1.0' },
            redirect: 'follow',
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        const html = (await res.text()).slice(0, 8000);
        const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        return t ? t[1].trim().slice(0, 120) : null;
    } catch {
        return null;
    }
}

async function findCompetitors(url, onPage, isSocial = false) {
    let clientDomain = '';
    try {
        clientDomain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return { competitors: [], block: formatBenchmarkBlock([], 'URL_INVALIDA') };
    }

    const query = buildSearchQuery(onPage, url, isSocial);
    const html = await fetchSearchHtml(query);
    if (!html) {
        return { competitors: [], block: formatBenchmarkBlock([], query) };
    }

    let domains = parseDomainsFromHtml(html, clientDomain);
    domains = domains.filter((d) => d !== clientDomain && !d.endsWith(clientDomain));

    const competitors = [];
    for (const domain of domains.slice(0, 3)) {
        const title = await fetchPageTitle(domain);
        competitors.push({ domain, title: title || 'NO_DETECTADO', source: 'busqueda_web' });
    }

    return {
        competitors,
        query,
        block: formatBenchmarkBlock(competitors, query),
    };
}

function formatBenchmarkBlock(competitors, query) {
    if (!competitors.length) {
        return `
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: SIN_COMPETENCIA_IDENTIFICADA
QUERY_BUSQUEDA: ${query}
MENSAJE_OBLIGATORIO: No se identificó competencia directa con visibilidad considerable en búsqueda web para este nicho. El activo opera con baja señal competitiva indexada o nicho muy local/específico.
REGLA_IA: PROHIBIDO inventar nombres de competidores. Redacta el benchmark explicando la ausencia de competencia verificable y qué implica para posicionamiento.
=== FIN BENCHMARK_VERIFIED ===`;
    }

    const lines = competitors.map((c, i) => `COMP_${i + 1}: ${c.domain} | TITLE: ${c.title}`);
    return `
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: COMPETENCIA_VERIFICADA
QUERY_BUSQUEDA: ${query}
REGLA_IA: Usa ÚNICAMENTE estos competidores en la tabla. PROHIBIDO añadir otros no listados.
${lines.join('\n')}
=== FIN BENCHMARK_VERIFIED ===`;
}

module.exports = { findCompetitors, formatBenchmarkBlock, buildSearchQuery };
