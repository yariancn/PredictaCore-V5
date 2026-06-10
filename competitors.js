/** Competitor discovery — solo rivales del mismo giro (cero invenciones) */

const BLOCKLIST = new Set([
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'yelp.com', 'wikipedia.org',
    'amazon.com', 'mercadolibre.com', 'google.com', 'apple.com',
    'tripadvisor.com', 'trustpilot.com', 'reddit.com', 'ebay.com', 'etsy.com',
    'shopify.com', 'myshopify.com', 'wix.com', 'wixsite.com', 'squarespace.com',
    'wordpress.com', 'webflow.com', 'godaddy.com', 'weebly.com', 'blackbell.com',
    'bing.com', 'duckduckgo.com', 'microsoft.com', 'yahoo.com',
]);

const NON_COMPETITOR_RE = /\b(bank|banco|santander|chase|wells fargo|bbva|financial institution|website builder|web platform|software platform|create your (own )?website|service businesses to create|technology provider|not a (direct )?competitor|saas platform|hosting provider|domain registrar)\b/i;

const GIRO_QUERIES = {
    ecommerce: (kw) => [`${kw} online store`, `${kw} shop buy`, `personalized ${kw} store`],
    salud: (kw) => [`${kw} clinic`, `${kw} medical services`, `${kw} wellness center`],
    servicios: (kw) => [`${kw} agency`, `${kw} consulting services`, `${kw} professional services`],
    restaurante: (kw) => [`${kw} restaurant`, `${kw} menu reservations`, `${kw} food delivery`],
    educacion: (kw) => [`${kw} course online`, `${kw} training academy`, `${kw} certification`],
    inmobiliario: (kw) => [`${kw} real estate`, `${kw} properties for sale`, `${kw} realtor`],
    general: (kw) => [`${kw} business services`, `${kw} local company`, `${kw} official website`],
    general_social: (kw) => [`${kw} business instagram`, `${kw} brand profile`],
};

function extractProductKeywords(onPage, clientTitle, clientDesc) {
    const title = (clientTitle || onPage?.title || '').replace(/\s*[|\-–—].*$/, '').trim();
    const desc = (clientDesc || onPage?.metaDescription || onPage?.textSample || '').slice(0, 200);
    const raw = `${title} ${desc}`.toLowerCase()
        .replace(/[^\w\sáéíóúñ-]/g, ' ')
        .replace(/\b(shop|store|home|welcome|official|website|online|the|and|for|your|our|llc|inc)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const words = raw.split(' ').filter((w) => w.length > 3).slice(0, 6);
    const phrase = words.join(' ').trim();
    if (phrase.length >= 10) return phrase;
    if (title.length >= 8) return title.toLowerCase().replace(/[^\w\s-]/g, ' ').trim();
    return 'local business services';
}

function buildSearchQueries(onPage, url, isSocial, giro, clientTitle, clientDesc) {
    const kw = extractProductKeywords(onPage, clientTitle, clientDesc);
    const giroId = giro?.id || (isSocial ? 'general_social' : 'general');
    const builder = GIRO_QUERIES[giroId] || GIRO_QUERIES.general;
    const queries = builder(kw).filter(Boolean);
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
        if (host.length > 4 && !queries.some((q) => q.includes(host))) {
            queries.push(`${kw} ${host} alternative`);
        }
    } catch { /* skip */ }
    return [...new Set(queries)].slice(0, 4);
}

async function fetchSearchHtml(query) {
    const q = encodeURIComponent(query);
    const urls = [
        `https://html.duckduckgo.com/html/?q=${q}`,
        `https://www.bing.com/search?q=${q}&count=12`,
    ];
    for (const url of urls) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 10000);
            const res = await fetch(url, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; PredictaCore/1.0; +https://predictacore.ai)',
                    'Accept-Language': 'en-US,en;q=0.9',
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
        if (BLOCKLIST.has(domain)) continue;
        if (domain.endsWith('.google.com') || domain.includes('duckduckgo') || domain.includes('bing.com')) continue;
        if (domain.includes('microsoft.com') || domain.includes('apple.com')) continue;
        seen.add(domain);
        found.push(domain);
        if (found.length >= 12) break;
    }
    return found;
}

async function fetchPageSnapshot(domain) {
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 7000);
        const res = await fetch(`https://${domain}`, {
            signal: ctrl.signal,
            headers: { 'User-Agent': 'PredictaCore-Forensics/1.0' },
            redirect: 'follow',
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        const html = (await res.text()).slice(0, 12000);
        const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim().slice(0, 150) || '';
        const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]
            || '';
        const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 600);
        return { title, description: meta.slice(0, 250), bodyText };
    } catch {
        return null;
    }
}

function tokenSet(text) {
    return new Set(
        String(text || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 3 && !['shop', 'store', 'home', 'online', 'website', 'official', 'welcome'].includes(w))
    );
}

function overlapScore(a, b) {
    const ta = tokenSet(a);
    const tb = tokenSet(b);
    if (!ta.size || !tb.size) return 0;
    let shared = 0;
    ta.forEach((t) => { if (tb.has(t)) shared += 1; });
    return shared;
}

function isNonCompetitorDomain(domain, snapshot) {
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    if (NON_COMPETITOR_RE.test(blob)) return true;
    if (/\.(gov|edu)$/.test(domain)) return true;
    if (BLOCKLIST.has(domain)) return true;
    return false;
}

function summarizeWhatTheyDo(snapshot, giroLabel) {
    const parts = [snapshot?.title, snapshot?.description].filter(Boolean);
    if (!parts.length) return 'NO_DETECTADO';
    const summary = parts.join(' — ').slice(0, 200);
    if (NON_COMPETITOR_RE.test(summary)) return 'RECHAZADO_NO_COMPETIDOR';
    return summary;
}

async function validateCompetitor(domain, clientCorpus, giroLabel) {
    const snapshot = await fetchPageSnapshot(domain);
    if (!snapshot || !snapshot.title) return null;
    if (isNonCompetitorDomain(domain, snapshot)) return null;

    const score = overlapScore(clientCorpus, `${snapshot.title} ${snapshot.description} ${snapshot.bodyText}`);
    const minScore = 2;
    if (score < minScore) return null;

    const queHace = summarizeWhatTheyDo(snapshot, giroLabel);
    if (queHace === 'RECHAZADO_NO_COMPETIDOR') return null;

    return {
        domain,
        title: snapshot.title,
        queHace,
        relevanceScore: score,
        source: 'busqueda_web_validada',
    };
}

async function findCompetitors(url, onPage, isSocial = false, ctx = {}) {
    let clientDomain = '';
    try {
        clientDomain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return { competitors: [], block: formatBenchmarkBlock([], '', ctx.giro?.label) };
    }

    const giro = ctx.giro || { id: 'general', label: 'Negocio local' };
    const clientCorpus = [
        ctx.clientTitle,
        ctx.clientDesc,
        onPage?.title,
        onPage?.metaDescription,
        onPage?.textSample,
        giro.label,
    ].filter(Boolean).join(' ');

    const queries = buildSearchQueries(onPage, url, isSocial, giro, ctx.clientTitle, ctx.clientDesc);
    const candidates = new Set();

    for (const query of queries) {
        const html = await fetchSearchHtml(query);
        if (!html) continue;
        parseDomainsFromHtml(html, clientDomain).forEach((d) => {
            if (d !== clientDomain && !d.endsWith(clientDomain)) candidates.add(d);
        });
        if (candidates.size >= 8) break;
    }

    const competitors = [];
    for (const domain of candidates) {
        if (competitors.length >= 3) break;
        const validated = await validateCompetitor(domain, clientCorpus, giro.label);
        if (validated) competitors.push(validated);
    }

    const usedQuery = queries[0] || 'N/A';
    return {
        competitors,
        query: usedQuery,
        queries,
        block: formatBenchmarkBlock(competitors, usedQuery, giro.label),
    };
}

function formatBenchmarkBlock(competitors, query, giroLabel) {
    if (!competitors.length) {
        return `
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: SIN_COMPETENCIA_IDENTIFICADA
GIRO: ${giroLabel || 'NO_DETECTADO'}
QUERY_BUSQUEDA: ${query}
MENSAJE_OBLIGATORIO: No se identificó competencia directa verificable en el mismo giro (${giroLabel || 'negocio'}). Los resultados de búsqueda no arrojaron tiendas/servicios comparables con solapamiento de oferta. PROHIBIDO inventar competidores ni usar bancos, plataformas SaaS o constructores web (Wix, Shopify.com, Santander, etc.).
REGLA_IA: NO uses tabla comparativa. Escribe 2-3 párrafos sobre implicaciones de posicionamiento y confusión de marca si aplica. CERO dominios inventados.
=== FIN BENCHMARK_VERIFIED ===`;
    }

    const lines = competitors.map((c, i) => (
        `COMP_${i + 1}: ${c.domain} | TITLE: ${c.title} | QUE_HACE: ${c.queHace} | RELEVANCIA: ${c.relevanceScore}/10`
    ));

    return `
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: COMPETENCIA_VERIFICADA
GIRO: ${giroLabel || 'NO_DETECTADO'}
QUERY_BUSQUEDA: ${query}
REGLA_IA: Usa ÚNICAMENTE estos competidores verificados del mismo giro. PROHIBIDO añadir otros. Tabla OBLIGATORIA con fila "Qué hacen / What they do" usando texto QUE_HACE de cada COMP_N. PROHIBIDO incluir dominios que no estén listados abajo.
${lines.join('\n')}
=== FIN BENCHMARK_VERIFIED ===`;
}

module.exports = { findCompetitors, formatBenchmarkBlock, buildSearchQueries };
