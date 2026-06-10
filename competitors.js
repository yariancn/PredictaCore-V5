/** Competitor discovery — rivales reales del mismo nicho (búsqueda por producto/servicio, no por marca) */

const BLOCKLIST = new Set([
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'yelp.com', 'wikipedia.org',
    'amazon.com', 'mercadolibre.com', 'google.com', 'apple.com',
    'tripadvisor.com', 'trustpilot.com', 'reddit.com', 'ebay.com', 'etsy.com',
    'shopify.com', 'myshopify.com', 'wix.com', 'wixsite.com', 'squarespace.com',
    'wordpress.com', 'webflow.com', 'godaddy.com', 'weebly.com', 'blackbell.com',
    'bing.com', 'duckduckgo.com', 'microsoft.com', 'yahoo.com',
    'target.com', 'walmart.com', 'costco.com', 'bestbuy.com', 'homedepot.com',
    'lowes.com', 'macys.com', 'kohls.com', 'wayfair.com', 'overstock.com',
    'samsclub.com', 'cvs.com', 'walgreens.com', 'alibaba.com', 'aliexpress.com',
]);

const MEGA_RETAILER_RE = /\b(amazon|walmart|target|costco|best buy|home depot|lowe'?s|macys|kohl'?s|wayfair|sam'?s club|cvs|walgreens|alibaba|aliexpress|big-box|mass-market retailer|major retailer|mega-?retailer)\b/i;

const NON_COMPETITOR_RE = /\b(bank|banco|santander|chase|wells fargo|bbva|financial institution|website builder|web platform|software platform|create your (own )?website|service businesses to create|technology provider|not a (direct )?competitor|saas platform|hosting provider|domain registrar|department store|grocery chain|supermarket chain|general merchandise|wikipedia|dictionary|news article|how to start)\b/i;

const ECOMMERCE_SIGNALS = /\b(add to cart|shop now|buy now|checkout|collection|product|products|shipping|free shipping|\$\d|price|cart|store|shop\b)/i;

const GIRO_QUERIES = {
    ecommerce: (niche) => [
        `${niche} online shop`,
        `buy ${niche}`,
        `best ${niche} store`,
        `${niche} boutique`,
    ],
    salud: (niche) => [`${niche} clinic near me`, `${niche} medical center`, `${niche} appointment`],
    servicios: (niche) => [`${niche} agency`, `${niche} services company`, `hire ${niche}`],
    restaurante: (niche) => [`${niche} restaurant`, `${niche} menu`, `${niche} reservations`],
    educacion: (niche) => [`${niche} course`, `${niche} online training`, `${niche} academy`],
    inmobiliario: (niche) => [`${niche} real estate`, `${niche} homes for sale`, `${niche} realtor`],
    general: (niche) => [`${niche} business`, `${niche} company`, `${niche} services`],
    general_social: (niche) => [`${niche} instagram`, `${niche} brand`],
};

const STOPWORDS = new Set([
    'shop', 'store', 'home', 'welcome', 'official', 'website', 'online', 'the', 'and', 'for',
    'your', 'our', 'llc', 'inc', 'page', 'site', 'best', 'custom', 'personalized', 'buy',
]);

function clientBrandToken(url, clientTitle) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0].toLowerCase();
        if (host.length >= 4) return host;
    } catch { /* skip */ }
    const title = (clientTitle || '').replace(/\s*[|\-–—].*$/, '').trim().toLowerCase();
    return title.split(/\s+/)[0] || '';
}

function extractNicheTerms(onPage, giro, clientTitle, clientDesc, url) {
    const brand = clientBrandToken(url, clientTitle);
    const corpus = `${onPage?.textSample || ''} ${clientDesc || ''} ${onPage?.metaDescription || ''} ${onPage?.h1Text || ''}`.toLowerCase();
    const titleTail = (clientTitle || onPage?.title || '').replace(/^[^|\-–—]+[|\-–—]\s*/i, '').toLowerCase();

    const productHits = [];
    const productRe = /\b(?:custom|personalized|personaliz\w*|handmade|artisan|luxury|organic|professional)\s+[a-z\s]{3,40}?(?:blanket|bedding|swaddle|nursery|milestone|gift|gifts|jewelry|shirt|mug|portrait|cake|dress|hat|print|decor|furniture|supplement|therapy|clinic|course|menu|property|home)\w*/gi;
    let pm;
    while ((pm = productRe.exec(`${corpus} ${titleTail}`)) !== null) {
        productHits.push(pm[0].replace(/\s+/g, ' ').trim());
    }

    const tokens = `${corpus} ${titleTail}`
        .replace(/[^\w\sáéíóúñ-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w) && (!brand || !w.includes(brand)));

    const freq = {};
    tokens.forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([w]) => w).slice(0, 6);

    if (productHits.length) return productHits[0].slice(0, 80);
    if (top.length >= 2) return top.slice(0, 5).join(' ');
    if (giro?.label) return giro.label.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
    return 'online business services';
}

function buildSearchQueries(onPage, url, isSocial, giro, clientTitle, clientDesc) {
    const niche = extractNicheTerms(onPage, giro, clientTitle, clientDesc, url);
    const giroId = giro?.id || (isSocial ? 'general_social' : 'general');
    const builder = GIRO_QUERIES[giroId] || GIRO_QUERIES.general;
    return [...new Set(builder(niche).filter(Boolean))].slice(0, 5);
}

async function fetchSearchHtml(query) {
    const q = encodeURIComponent(query);
    const urls = [
        `https://html.duckduckgo.com/html/?q=${q}`,
        `https://www.bing.com/search?q=${q}&count=15`,
    ];
    for (const url of urls) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 12000);
            const res = await fetch(url, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
        if (domain.includes(clientDomain.split('.')[0]) && domain !== clientDomain) continue;
        seen.add(domain);
        found.push(domain);
        if (found.length >= 15) break;
    }
    return found;
}

async function fetchPageSnapshot(domain) {
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(`https://${domain}`, {
            signal: ctrl.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PredictaCore/1.0)' },
            redirect: 'follow',
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        const html = (await res.text()).slice(0, 15000);
        const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim().slice(0, 150) || '';
        const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]
            || '';
        const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 800);
        return { title, description: meta.slice(0, 250), bodyText, html: html.slice(0, 4000) };
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
            .filter((w) => w.length > 3 && !STOPWORDS.has(w))
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

function isMegaRetailer(domain, snapshot) {
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`.toLowerCase();
    if (/^(target|walmart|amazon|costco|bestbuy|homedepot|lowes|macys|kohls|wayfair)\./i.test(domain)) return true;
    if (MEGA_RETAILER_RE.test(domain)) return true;
    if (MEGA_RETAILER_RE.test(blob) && /\b(millions of products|everyday low prices|groceries|electronics|department store|supercenter|big box)\b/i.test(blob)) {
        return true;
    }
    return false;
}

function isNonCompetitorDomain(domain, snapshot, clientBrand) {
    if (isMegaRetailer(domain, snapshot)) return true;
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    if (NON_COMPETITOR_RE.test(blob)) return true;
    if (/\.(gov|edu)$/.test(domain)) return true;
    if (BLOCKLIST.has(domain)) return true;
    if (clientBrand && clientBrand.length >= 4 && domain.replace(/\W/g, '').includes(clientBrand.replace(/\W/g, ''))) return true;
    return false;
}

function hasCommercialSignals(snapshot, giroId) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''} ${snapshot?.html || ''}`;
    if (giroId === 'ecommerce') return ECOMMERCE_SIGNALS.test(blob);
    return blob.length > 80;
}

function summarizeWhatTheyDo(snapshot) {
    const parts = [snapshot?.title, snapshot?.description].filter(Boolean);
    if (!parts.length) return null;
    const summary = parts.join(' — ').slice(0, 200);
    if (NON_COMPETITOR_RE.test(summary)) return null;
    return summary;
}

async function validateCompetitor(domain, nicheCorpus, giro, clientBrand) {
    const snapshot = await fetchPageSnapshot(domain);
    if (!snapshot || !snapshot.title) return null;
    if (isNonCompetitorDomain(domain, snapshot, clientBrand)) return null;
    if (!hasCommercialSignals(snapshot, giro?.id)) return null;

    const compText = `${snapshot.title} ${snapshot.description} ${snapshot.bodyText}`;
    const score = overlapScore(nicheCorpus, compText);
    if (score < 1) return null;

    const queHace = summarizeWhatTheyDo(snapshot);
    if (!queHace) return null;

    return {
        domain,
        title: snapshot.title,
        queHace,
        relevanceScore: Math.min(10, score + 2),
        source: 'busqueda_nicho_validada',
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
    const clientBrand = clientBrandToken(url, ctx.clientTitle);
    const nicheCorpus = [
        extractNicheTerms(onPage, giro, ctx.clientTitle, ctx.clientDesc, url),
        giro.label,
        onPage?.metaDescription,
        onPage?.textSample?.slice(0, 500),
    ].filter(Boolean).join(' ');

    const queries = buildSearchQueries(onPage, url, isSocial, giro, ctx.clientTitle, ctx.clientDesc);
    const candidates = new Set();

    for (const query of queries) {
        const html = await fetchSearchHtml(query);
        if (!html) continue;
        parseDomainsFromHtml(html, clientDomain).forEach((d) => {
            if (d !== clientDomain && !d.endsWith(clientDomain)) candidates.add(d);
        });
        if (candidates.size >= 12) break;
    }

    const competitors = [];
    for (const domain of candidates) {
        if (competitors.length >= 3) break;
        const validated = await validateCompetitor(domain, nicheCorpus, giro, clientBrand);
        if (validated) competitors.push(validated);
    }

    const usedQuery = queries.join(' | ') || 'N/A';
    return {
        competitors,
        query: queries[0] || 'N/A',
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
MENSAJE_OBLIGATORIO: No se identificó competencia directa verificable en el mismo nicho y escala (${giroLabel || 'negocio boutique/PYME'}). Los resultados de búsqueda no arrojaron tiendas/servicios comparables con solapamiento de oferta. PROHIBIDO inventar competidores ni usar mega-retailers (Amazon, Walmart, Target, Costco), bancos, plataformas SaaS o constructores web (Wix, Shopify.com, Santander, etc.).
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
REGLA_IA: Usa ÚNICAMENTE estos competidores verificados del mismo nicho comercial (misma categoría de producto/servicio, escala boutique/PYME). PROHIBIDO añadir Amazon, Walmart, Target, Costco u otros mega-retailers. PROHIBIDO añadir dominios no listados. Tabla OBLIGATORIA con fila "Qué hacen / What they do" usando texto QUE_HACE de cada COMP_N (copiar literal, PROHIBIDO NO_DETECTADO).
${lines.join('\n')}
=== FIN BENCHMARK_VERIFIED ===`;
}

module.exports = {
    findCompetitors,
    formatBenchmarkBlock,
    buildSearchQueries,
    extractNicheTerms,
    MEGA_RETAILER_RE,
    BLOCKLIST,
};
