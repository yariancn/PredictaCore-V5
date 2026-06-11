/** Competencia universal: qué hace el activo, dónde, quién más lo hace */

const { extractGeoContext, formatGeoBlock, geoMatchesMarket } = require('./geo-context');
const { brandTokensFrom } = require('./keywords');

const MIN_COMPETITORS = 3;

const BLOCKLIST = new Set([
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'yelp.com', 'wikipedia.org',
    'amazon.com', 'amazon.com.mx', 'mercadolibre.com', 'mercadolibre.com.mx',
    'google.com', 'bing.com', 'duckduckgo.com', 'microsoft.com', 'yahoo.com',
    'shopify.com', 'myshopify.com', 'wix.com', 'wixsite.com', 'squarespace.com',
    'wordpress.com', 'ecwid.com', 'tiendeo.mx', 'shopfully.mx',
    'target.com', 'walmart.com', 'costco.com', 'liverpool.com.mx', 'coppel.com',
    'sanborns.com.mx', 'sears.com.mx', 'delsol.com.mx', 'mywed.com',
]);

const PLATFORM_RE = /^(shopify|myshopify|wix|wixsite|squarespace|weebly|godaddy|ecwid|bigcommerce)\./i;
const MEGA_RE = /\b(amazon|walmart|mercadolibre|liverpool|coppel|soriana|target|costco)\b/i;
const JUNK_RE = /\b(wikipedia|directorio|directory|website builder|saas platform|plataforma ecommerce)\b/i;
const LISTICLE_RE = /\b(los \d+ mejores|top \d+|listado de|ranking de|blog)\b/i;

const STOP = new Set([
    'para', 'the', 'and', 'con', 'por', 'your', 'our', 'home', 'official', 'website',
    'tienda', 'online', 'comprar', 'shop', 'store', 'best', 'mejor', 'site', 'page',
    'productos', 'product', 'servicios', 'service', 'handcrafted', 'unique', 'quality',
    'high', 'made', 'with', 'love', 'create', 'magical', 'moments', 'little', 'ones',
]);

function decodeEntities(s) {
    return String(s || '')
        .replace(/&amp;/g, '&')
        .replace(/&ndash;|&#8211;/g, '–')
        .replace(/&#039;|&apos;/g, "'")
        .replace(/&quot;/g, '"');
}

function cleanText(s) {
    return decodeEntities(s)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function stripBrandFromText(text, url, clientTitle) {
    let t = cleanText(text);
    t = t.split(/\s*[–—]\s*/)[0].trim();
    const brand = brandTokensFrom(url, clientTitle);
    for (const b of brand) {
        if (b.length >= 4) t = t.replace(new RegExp(`\\b${b}\\b`, 'gi'), ' ');
    }
    return t.replace(/\s+/g, ' ').trim();
}

function toOfferingPhrase(c) {
    const lower = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lower.length <= 80) return lower;
    const cut = lower.slice(0, 80);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
}

/** 1. Qué hace — meta description primero (más limpia que el title) */
function extractWhat(onPage, clientTitle, clientDesc, url) {
    const metaRaw = cleanText(clientDesc || onPage?.metaDescription);
    const shopFor = metaRaw.match(/^shop\s+.+?\s+for\s+(.+)/i);
    const meta = stripBrandFromText(shopFor ? shopFor[1] : metaRaw, url, clientTitle);
    const h1 = onPage?.h1Text && !/AUSENTE|ABSENT/i.test(onPage.h1Text)
        ? stripBrandFromText(onPage.h1Text, url, clientTitle) : '';
    const title = clientTitle || onPage?.title || '';
    const afterBar = stripBrandFromText(title.split(/\s*[|]\s*/).slice(1).join(' '), url, clientTitle);

    const candidates = [meta, h1, afterBar].filter((c) => c.length >= 10);

    for (const c of candidates) {
        if (c.split(/\s+/).length >= 3) return toOfferingPhrase(c);
    }
    for (const c of candidates) {
        if (c.split(/\s+/).length >= 2) return toOfferingPhrase(c);
    }
    return toOfferingPhrase(candidates[0] || 'products and services');
}

/** Palabras clave del offering para validar competidores */
function keyWords(what) {
    return what
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !STOP.has(w));
}

function isSpanish(locale, geo, onPage) {
    if (locale?.code?.startsWith('es')) return true;
    if (geo?.marketCountry === 'MX' || geo?.country === 'MX') return true;
    return String(onPage?.htmlLang || '').toLowerCase().startsWith('es');
}

function marketSearchTerm(geo) {
    const map = { US: 'USA', MX: 'Mexico', CA: 'Canada', GB: 'UK', ES: 'Spain', AU: 'Australia' };
    return map[geo?.marketCountry] || map[geo?.country] || 'USA';
}

/** 2. Búsqueda: qué + país (corto, no el label largo del geo) */
function buildQueries(what, geo, locale, onPage) {
    const where = marketSearchTerm(geo);
    const es = isSpanish(locale, geo, onPage);
    if (es) {
        return [`${what} ${where}`, `empresas ${what} ${where}`];
    }
    return [`${what} ${where}`, `${what} companies ${where}`];
}

function extractDomain(href) {
    try {
        let u = href;
        if (u.includes('uddg=')) {
            const m = u.match(/uddg=([^&]+)/);
            if (m) u = decodeURIComponent(m[1]);
        }
        if (u.startsWith('//')) u = `https:${u}`;
        return new URL(u).hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

function parseDomains(html, clientDomain) {
    const found = [];
    const seen = new Set([clientDomain]);
    const re = /href="([^"]+)"/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        const domain = extractDomain(m[1]);
        if (!domain || seen.has(domain)) continue;
        if (BLOCKLIST.has(domain) || PLATFORM_RE.test(domain)) continue;
        if (/duckduckgo|bing\.|microsoft\.|google\./.test(domain)) continue;
        if (domain === clientDomain) continue;
        seen.add(domain);
        found.push(domain);
        if (found.length >= 25) break;
    }
    return found;
}

async function searchDomains(query, clientDomain, acceptLanguage, geo) {
    const q = encodeURIComponent(query);
    const cc = geo?.marketCountry === 'MX' ? 'MX&setlang=es' : geo?.marketCountry === 'US' ? 'US&setlang=en' : '';
    const urls = [
        `https://html.duckduckgo.com/html/?q=${q}`,
        `https://www.bing.com/search?q=${q}&count=15${cc ? `&cc=${cc}` : ''}`,
    ];
    const domains = [];
    const seen = new Set();

    for (const searchUrl of urls) {
        try {
            const res = await fetch(searchUrl, {
                signal: AbortSignal.timeout(12000),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                    'Accept-Language': acceptLanguage,
                },
            });
            if (!res.ok) continue;
            const html = await res.text();
            for (const d of parseDomains(html, clientDomain)) {
                if (!seen.has(d)) { seen.add(d); domains.push(d); }
            }
        } catch { /* next */ }
    }
    return domains;
}

async function fetchSnapshot(domain, acceptLanguage) {
    for (const host of [domain, domain.startsWith('www.') ? domain.slice(4) : `www.${domain}`]) {
        try {
            const res = await fetch(`https://${host}`, {
                signal: AbortSignal.timeout(10000),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                    Accept: 'text/html',
                    'Accept-Language': acceptLanguage || 'en-US,en;q=0.9',
                },
                redirect: 'follow',
            });
            if (!res.ok) continue;
            const html = (await res.text()).slice(0, 15000);
            const title = cleanText(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]).slice(0, 150);
            const desc = cleanText(
                html.match(/name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
                || html.match(/content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]
            ).slice(0, 250);
            const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800);
            if (title) return { title, description: desc, bodyText };
        } catch { /* next */ }
    }
    return null;
}

function isJunk(domain, snap, clientBrand) {
    if (BLOCKLIST.has(domain) || PLATFORM_RE.test(domain)) return true;
    if (/\.(gov|edu)$/.test(domain)) return true;
    const blob = `${domain} ${snap.title} ${snap.description}`.toLowerCase();
    if (MEGA_RE.test(blob) || JUNK_RE.test(blob) || LISTICLE_RE.test(blob)) return true;
    for (const b of clientBrand || []) {
        if (b.length >= 5 && domain.replace(/\W/g, '').includes(b)) return true;
    }
    return false;
}

function wordInText(word, blob) {
    if (blob.includes(word)) return true;
    const stem = word.slice(0, Math.max(4, word.length - 1));
    return stem.length >= 4 && blob.includes(stem);
}

/** ¿Ofrece lo mismo? Las palabras clave del activo deben aparecer en su página */
function sameOffering(what, snap) {
    const keys = keyWords(what);
    if (!keys.length) return true;
    const blob = `${snap.title} ${snap.description}`.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const hits = keys.filter((k) => wordInText(k, blob));
    const need = keys.length <= 2 ? keys.length : Math.ceil(keys.length / 2);
    return hits.length >= need;
}

async function findCompetitors(url, onPage, isSocial = false, ctx = {}) {
    let clientDomain = '';
    try {
        clientDomain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return { competitors: [], block: formatBenchmarkBlock([], '', null, null, '') };
    }

    const giro = ctx.giro || { id: 'general', label: 'Negocio' };
    const geo = extractGeoContext(onPage, url, giro);
    const what = extractWhat(onPage, ctx.clientTitle, ctx.clientDesc, url);
    const clientBrand = brandTokensFrom(url, ctx.clientTitle);
    const acceptLanguage = isSpanish(ctx.locale, geo, onPage) ? 'es-MX,es;q=0.9' : 'en-US,en;q=0.9';
    const queries = buildQueries(what, geo, ctx.locale, onPage);

    const candidates = [];
    const seen = new Set();
    for (const q of queries) {
        for (const d of await searchDomains(q, clientDomain, acceptLanguage, geo)) {
            if (!seen.has(d)) { seen.add(d); candidates.push(d); }
        }
    }

    const picked = [];
    for (const domain of candidates) {
        if (picked.length >= MIN_COMPETITORS) break;
        const snap = await fetchSnapshot(domain, acceptLanguage);
        if (!snap) continue;
        if (isJunk(domain, snap, clientBrand)) continue;
        if (!geoMatchesMarket(geo, snap, domain)) continue;
        if (!sameOffering(what, snap)) continue;

        picked.push({
            domain,
            title: snap.title,
            queHace: [snap.title, snap.description].filter(Boolean).join(' — ').slice(0, 200),
            relevanceScore: 7,
            source: 'busqueda',
        });
    }

    const competitors = picked.length >= MIN_COMPETITORS ? picked : [];

    return {
        competitors,
        query: queries[0],
        queries,
        niche: what,
        geo,
        block: formatBenchmarkBlock(competitors, queries.join(' | '), geo, what),
    };
}

function formatBenchmarkBlock(competitors, query, geo, what) {
    const geoBlock = geo ? formatGeoBlock(geo, { id: geo.giroId || 'general', label: geo.label }) : '';
    const where = geo?.marketLabel || geo?.label || 'NO_DETECTADO';
    const whereShort = marketSearchTerm(geo);

    if (competitors.length < MIN_COMPETITORS) {
        return `${geoBlock}
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: SIN_COMPETENCIA_IDENTIFICADA
QUE_HACE: ${what || 'NO_DETECTADO'}
DONDE: ${whereShort} (${where})
QUERY_BUSQUEDA: ${query}
MENSAJE_OBLIGATORIO: No se verificaron 3 negocios que hagan lo mismo (${what}) en ${where}. PROHIBIDO inventar dominios.
REGLA_IA: Sin tabla comparativa. Posicionamiento en 2-3 párrafos. Cero dominios inventados.
=== FIN BENCHMARK_VERIFIED ===`;
    }

    const lines = competitors.map((c, i) => (
        `COMP_${i + 1}: ${c.domain} | TITLE: ${c.title} | QUE_HACE: ${c.queHace} | RELEVANCIA: ${c.relevanceScore}/10`
    ));

    return `${geoBlock}
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: COMPETENCIA_VERIFICADA
QUE_HACE: ${what || 'NO_DETECTADO'}
DONDE: ${whereShort} (${where})
QUERY_BUSQUEDA: ${query}
REGLA_IA: Usa SOLO estos ${competitors.length} competidores — mismo producto/servicio (${what}), mismo mercado (${where}). Tabla con fila "Qué hacen" (copiar QUE_HACE).
${lines.join('\n')}
=== FIN BENCHMARK_VERIFIED ===`;
}

module.exports = {
    findCompetitors,
    formatBenchmarkBlock,
    extractAssetOffering: extractWhat,
    extractProductNiche: extractWhat,
    buildUniversalQueries: buildQueries,
    buildSearchQueries: buildQueries,
    MEGA_RETAILER_RE: MEGA_RE,
    BLOCKLIST,
    MIN_COMPETITORS,
};
