/** Competitor discovery — mismo nicho de producto/servicio + mercado de venta/envío */

const { extractGeoContext, formatGeoBlock, geoMatchesMarket } = require('./geo-context');
const { brandTokensFrom, productTitleCore, inferKeywords } = require('./keywords');

const MIN_COMPETITORS = 3;

const BLOCKLIST = new Set([
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'yelp.com', 'wikipedia.org',
    'amazon.com', 'amazon.com.mx', 'mercadolibre.com', 'mercadolibre.com.mx', 'mercadolivre.com', 'google.com', 'apple.com',
    'tripadvisor.com', 'trustpilot.com', 'reddit.com', 'ebay.com', 'etsy.com',
    'shopify.com', 'myshopify.com', 'wix.com', 'wixsite.com', 'squarespace.com',
    'wordpress.com', 'webflow.com', 'godaddy.com', 'weebly.com', 'blackbell.com',
    'bing.com', 'duckduckgo.com', 'microsoft.com', 'yahoo.com',
    'target.com', 'walmart.com', 'costco.com', 'bestbuy.com', 'homedepot.com',
    'lowes.com', 'macys.com', 'kohls.com', 'wayfair.com', 'overstock.com',
    'samsclub.com', 'cvs.com', 'walgreens.com', 'alibaba.com', 'aliexpress.com',
    'ecwid.com', 'bigcommerce.com', 'volusion.com', 'shift4shop.com', 'sellfy.com',
    'tiendanube.com', 'nuvemshop.com.br', 'mercadopago.com', 'stripe.com', 'paypal.com',
    'hubspot.com', 'mailchimp.com', 'canva.com',
    'businessyab.com', 'chamberofcommerce.com', 'yellowpages.com', 'manta.com',
    'bbb.org', 'mapquest.com', 'foursquare.com', 'tienda.com',
    'bodegaaurrera.com.mx', 'soriana.com', 'coppel.com', 'liverpool.com.mx', 'elektra.com.mx',
    'elpalaciodehierro.com', 'palaciodehierro.com', 'infoisinfo.com.mx', 'infoisinfo.com',
    'dollargeneral.com', 'misuperdollargeneral.com', 'nuevaescuelamexicana.org', 'conaliteg.gob.mx',
    'zara.com', 'shein.com.mx', 'shein.com', 'hm.com', 'www2.hm.com', 'bershka.com', 'oldnavy.mx',
    'stradivarius.com', 'cyamoda.com', 'privalia.com.mx', 'sanborns.com.mx', 'modatelas.com.mx',
    'guiainfantil.com', 'babycenter.com', 'unicef.org', 'wikipedia.org',
    'regalador.com', 'fabricadesuenos.com.mx', 'unbonitodetalle.com', 'enviaflores.com',
]);

const PLATFORM_DOMAIN_RE = /^(shopify|myshopify|wix|wixsite|squarespace|weebly|godaddy|webflow|wordpress|ecwid|bigcommerce|volusion|shift4shop|tiendanube|nuvemshop)\./i;

const MEGA_RETAILER_RE = /\b(amazon|walmart|target|costco|best buy|home depot|lowe'?s|macys|kohl'?s|wayfair|sam'?s club|cvs|walgreens|alibaba|aliexpress|big-box|mass-market retailer|major retailer|mega-?retailer|liverpool|palacio de hierro|coppel|bodega aurrera|soriana|mercadolibre|mercado libre)\b/i;

const NON_COMPETITOR_RE = /\b(bank|banco|santander|chase|wells fargo|bbva|financial institution|website builder|web platform|software platform|create your (own )?website|crea tu (propia )?tienda|crear tu tienda|service businesses to create|technology provider|not a (direct )?competitor|saas platform|hosting provider|domain registrar|department store|grocery chain|supermarket chain|general merchandise|wikipedia|dictionary|news article|how to start|shopping cart software|online store builder|ecommerce platform|plataforma de ecommerce|plataforma ecommerce|launch your online store|try ecwid|sell online with|add an online store|no tech skills needed)\b/i;

const DIRECTORY_RE = /\b(cerca de ti|cerca de mi|near me|directorio|directory|listings|businesses in|chamber of commerce|store locator|find local|tiendas.*cerca|ubicaci[oó]n en usa|business directory|infoisinfo|empresas, ofertas y tiendas)\b/i;

const ECOMMERCE_SIGNALS = /\b(add to cart|añadir al carrito|agregar al carrito|shop now|comprar|buy now|checkout|collection|product|productos|producto|shipping|envío|envio|precio|\$\d|cart|carrito|tienda|store|shop\b)/i;

const GENERIC_NICHE_TOKENS = new Set([
    'shop', 'store', 'tienda', 'online', 'buy', 'comprar',
    'home', 'welcome', 'official', 'website', 'sitio', 'best', 'mejor', 'the', 'and', 'for', 'para',
    'your', 'our', 'with', 'from', 'that', 'this', 'page', 'site', 'collection', 'catalog',
    'catalogo', 'catálogo', 'marca', 'brand', 'envio', 'envío', 'shipping', 'nuevo', 'new',
]);

const STOPWORDS = new Set([
    ...GENERIC_NICHE_TOKENS,
    'llc', 'inc', 'shipped', 'nationwide', 'designed', 'located', 'based', 'mailing', 'address',
]);

function clientBrandTokens(url, clientTitle) {
    const tokens = brandTokensFrom(url, clientTitle);
    try {
        const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0].toLowerCase();
        const brandSeg = (clientTitle || '').split(/\s*[|\-–—]\s*/)[0] || '';
        brandSeg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .split(/\s+/)
            .filter((w) => w.length >= 4)
            .forEach((w) => {
                const clean = w.replace(/[^\w]/g, '');
                if (clean.length >= 4 && host.includes(clean)) tokens.add(clean);
            });
    } catch { /* skip */ }
    return tokens;
}

function isSpanishLocale(locale, geo, onPage) {
    if (locale?.code?.startsWith('es')) return true;
    if (geo?.marketCountry === 'MX' || geo?.country === 'MX') return true;
    const lang = String(onPage?.htmlLang || '').toLowerCase();
    return lang.startsWith('es');
}

function extractProductSignals(onPage, clientDesc, clientTitle) {
    const blob = `${onPage?.textSample || ''} ${onPage?.metaDescription || ''} ${clientDesc || ''} ${clientTitle || ''} ${onPage?.h1Text || ''}`.toLowerCase();
    return {
        baby: /\b(beb[eé]|baby|reci[eé]n nacido|recien nacido|maternidad|pañalero|canastilla)\b/.test(blob),
        personalized: /personaliz|bordad|custom|dise[nñ]a desde|a tu gusto|nombre del beb|100% personaliz/.test(blob),
        cotton: /algod[oó]n|cotton/.test(blob),
        welcomeKit: /kit de bienvenida|kit bienvenida|canastilla|welcome kit/.test(blob),
        bedding: /juego de cuna|juegos de cuna|cuna|nido|manta mensual|dona de lactancia|swaddle|babero/.test(blob),
        clothing: /\b(ropa|pañalero|mameluco|body|babero|manta)\b/.test(blob),
    };
}

function inferNicheFromSignals(signals, es) {
    if (signals.baby && signals.personalized && signals.cotton) {
        return es ? 'productos bebe personalizados algodon' : 'personalized cotton baby products';
    }
    if (signals.baby && signals.personalized && signals.bedding) {
        return es ? 'productos bebe personalizados cuna kit' : 'personalized baby crib welcome kit';
    }
    if (signals.baby && signals.personalized) {
        return es ? 'productos bebe personalizados' : 'personalized baby products';
    }
    if (signals.baby && signals.cotton) {
        return es ? 'ropa productos bebe algodon' : 'cotton baby clothing products';
    }
    if (signals.baby && signals.welcomeKit) {
        return es ? 'kit bienvenida bebe personalizado' : 'personalized baby welcome kit';
    }
    return null;
}

function getCategorySeedCandidates(signals, geo) {
    const mx = geo?.marketCountry === 'MX' || geo?.country === 'MX';
    if (!mx || !signals.baby) return [];
    const seeds = [];
    if (signals.personalized || signals.welcomeKit || signals.bedding) {
        seeds.push('bebedeparis.mx', 'creacionesbabyjonathan.com', 'hilodeluz.mx');
    }
    if (signals.cotton || signals.clothing) {
        seeds.push('creacionesbabyjonathan.com', 'bebedeparis.mx');
    }
    return [...new Set(seeds)];
}

function buildSignalQueries(signals, es, geo) {
    if (!signals.baby) return [];
    const mx = es || geo?.marketCountry === 'MX';
    const q = [];
    if (signals.personalized) {
        q.push(
            mx ? 'canastilla bebe personalizada mexico tienda' : 'personalized baby gift basket store',
            mx ? 'regalos bebe personalizados mexico tienda online' : 'personalized baby gifts online store',
            mx ? 'productos bebe personalizados algodon mexico' : 'personalized cotton baby products store',
            mx ? 'pijamas familia bebe personalizadas mexico' : 'personalized family baby pajamas store',
        );
    }
    if (signals.bedding || signals.welcomeKit) {
        q.push(
            mx ? 'kit bienvenida bebe personalizado tienda mexico' : 'personalized baby welcome kit store',
            mx ? 'juego cuna bebe personalizado tienda online' : 'personalized baby crib bedding store',
        );
    }
    if (signals.cotton && signals.clothing) {
        q.push(
            mx ? 'ropa bebe algodon tienda online mexico' : 'cotton baby clothes online store',
            mx ? 'pañalero algodon tienda mexico online' : 'cotton baby onesies online store',
        );
    }
    if (signals.baby && !q.length) {
        q.push(mx ? 'tienda productos bebe mexico online' : 'baby products online store');
    }
    return q;
}

function normalizeNichePhrase(raw, brandTokens) {
    let p = String(raw || '').trim()
        .replace(/^(mejor|comprar|best|buy)\s+/i, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (p.length < 8) return null;
    const dominatedByBrand = [...(brandTokens || [])].some((bt) => bt.length >= 4 && p.includes(bt));
    if (dominatedByBrand) return null;
    const words = p.split(/\s+/).filter((w) => w.length > 2);
    if (words.length >= 2) return p.slice(0, 55);
    return null;
}

function extractProductNiche(onPage, url, clientTitle, clientDesc, locale, geo) {
    const brandTokens = clientBrandTokens(url, clientTitle);
    const es = isSpanishLocale(locale, geo, onPage);
    const signals = extractProductSignals(onPage, clientDesc, clientTitle);
    const signalNiche = inferNicheFromSignals(signals, es);
    if (signalNiche) return signalNiche;

    const loc = locale || { code: es ? 'es-LATAM' : 'en-US' };
    const phrases = inferKeywords(onPage, loc, url, clientTitle);
    const productPart = productTitleCore(onPage, brandTokens);
    const meta = (onPage?.metaDescription || clientDesc || '').trim();
    const h1 = onPage?.h1Text && !/AUSENTE|ABSENT/i.test(onPage.h1Text) ? onPage.h1Text.trim() : '';
    const titleTail = (clientTitle || onPage?.title || '').split(/\s*[|\-–—]\s*/).slice(1).join(' ').trim();

    const candidates = [
        titleTail,
        productPart,
        meta.split(/[.!?|,;]/)[0],
        clientDesc?.split(/[.!?|]/)[0],
        ...phrases.filter((p) => !/^(mejor|comprar|best|buy)\s/i.test(p)),
        h1,
        (onPage?.textSample || '').slice(0, 120),
    ].map((p) => String(p || '').trim()).filter((p) => p.length > 8);

    for (const cand of candidates) {
        const normalized = normalizeNichePhrase(cand, brandTokens);
        if (normalized) return normalized;
        const tokens = tokenizeNiche(cand, brandTokens);
        if (tokens.length >= 2) {
            return tokens.slice(0, 5).join(' ');
        }
    }

    return (productPart || meta || 'tienda online').toLowerCase().slice(0, 55);
}

function tokenizeNiche(text, brandTokens) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\sáéíóúñ-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w)
            && ![...(brandTokens || [])].some((bt) => bt.length >= 4 && (w.includes(bt) || bt.includes(w))));
}

function deriveNicheSearchVariants(niche, onPage, clientDesc, es, signals) {
    const variants = new Set([niche]);
    const blob = `${onPage?.metaDescription || ''} ${onPage?.textSample || ''} ${clientDesc || ''}`.toLowerCase();
    const sig = signals || extractProductSignals(onPage, clientDesc, '');
    if (sig.baby) {
        variants.add(es ? 'productos bebe personalizados' : 'personalized baby products');
        variants.add(es ? 'ropa bebe algodon' : 'cotton baby clothes');
        variants.add(es ? 'regalos bebe personalizados' : 'personalized baby gifts');
        if (sig.personalized) variants.add(es ? 'canastilla bebe personalizada' : 'personalized baby gift basket');
        if (sig.bedding) variants.add(es ? 'kit bienvenida bebe' : 'baby welcome kit');
        if (sig.cotton) variants.add(es ? 'productos bebe algodon' : 'cotton baby products');
    } else if (/\b(beb[eé]|baby|infant|reci[eé]n nacido)\b/.test(blob)) {
        variants.add(es ? 'ropa bebe' : 'baby clothes');
        variants.add(es ? 'accesorios bebe' : 'baby accessories');
        variants.add(es ? 'tienda bebe online' : 'baby store online');
    }
    if (/\b(ropa|clothing|fashion|moda)\b/.test(blob) && /\b(beb[eé]|baby|ni[nñ]o)\b/.test(blob)) {
        variants.add(es ? 'ropa bebe tienda' : 'baby clothing store');
    }
    return [...variants].slice(0, 8);
}

function buildSearchQueries(onPage, url, isSocial, giro, clientTitle, clientDesc, geo, locale) {
    const niche = extractProductNiche(onPage, url, clientTitle, clientDesc, locale, geo);
    const es = isSpanishLocale(locale, geo, onPage);
    const signals = extractProductSignals(onPage, clientDesc, clientTitle);
    const nicheVariants = deriveNicheSearchVariants(niche, onPage, clientDesc, es, signals);
    let queries = [...buildSignalQueries(signals, es, geo)];
    for (const n of nicheVariants) {
        queries.push(...buildSearchQueriesForNiche(n, isSocial, giro, geo, locale, es));
    }
    return [...new Set(queries.filter(Boolean))].slice(0, 16);
}

function buildSearchQueriesForNiche(niche, isSocial, giro, geo, locale, es) {
    const giroId = giro?.id || (isSocial ? 'general_social' : 'general');
    const countryTerm = { US: 'USA', MX: 'Mexico', ES: 'España', GB: 'UK', CA: 'Canada', AU: 'Australia' }[geo?.marketCountry]
        || (es ? 'Mexico' : '');

    let queries = [];
    if (giroId === 'ecommerce') {
        queries = es
            ? [
                `tienda online ${niche}`,
                `comprar ${niche}`,
                `${niche} tienda`,
                countryTerm ? `${niche} ${countryTerm}` : `${niche} tienda online`,
            ]
            : [
                `${niche} online shop`,
                `${niche} store`,
                `buy ${niche}`,
                countryTerm ? `${niche} ${countryTerm}` : `${niche} online store`,
            ];
        if (!/^productos\s/i.test(niche)) {
            queries.push(es ? `productos ${niche}` : `products ${niche}`);
        }
        if (es && (geo?.marketCountry === 'MX' || geo?.country === 'MX')) {
            queries.push(`tienda ${niche} mexico`, `${niche} tienda mexicana`, `comprar ${niche} mexico`);
        }
    } else if (giroId === 'salud') {
        queries = es
            ? [`${niche} clínica`, `${niche} consultorio`, `${niche} cerca de mi`]
            : [`${niche} clinic`, `${niche} medical`, `${niche} near me`];
    } else if (giroId === 'restaurante') {
        queries = es
            ? [`${niche} restaurante`, `${niche} menú`, `${niche} reservaciones`]
            : [`${niche} restaurant`, `${niche} menu`, `${niche} reservations`];
    } else {
        queries = es
            ? [`${niche} servicios`, `${niche} empresa`, `${niche} negocio`]
            : [`${niche} services`, `${niche} company`, `${niche} business`];
        if (/fotograf|photo|video/i.test(niche)) {
            queries.push(es ? `fotografo ${niche}` : `${niche} photographer`, es ? `${niche} estudio` : `${niche} studio`);
        }
    }

    if (geo?.marketBasis === 'LOCAL' && geo.city) {
        queries.push(...queries.slice(0, 2).map((q) => `${q} ${geo.city}`));
    }

    return [...new Set(queries.filter(Boolean))].slice(0, 8);
}

function fallbackQueries(giroId, locale, geo, niche) {
    const es = locale?.code?.startsWith('es') || geo?.marketCountry === 'MX';
    const n = (niche || '').trim() || (es ? 'tienda online' : 'online store');
    if (giroId !== 'ecommerce') return [];
    const country = es ? 'mexico' : '';
    return es
        ? [
            `tienda ${n}`,
            `${n} tienda online`,
            country ? `${n} ${country}` : `comprar ${n}`,
            `site:com.mx ${n}`,
        ].filter(Boolean)
        : [
            `${n} online store`,
            `buy ${n}`,
            `${n} shop`,
        ];
}

function searchAcceptLanguage(locale, geo, onPage) {
    if (isSpanishLocale(locale, geo, onPage)) return 'es-MX,es;q=0.9,en;q=0.5';
    return 'en-US,en;q=0.9';
}

async function fetchSearchHtml(query, acceptLanguage) {
    const q = encodeURIComponent(query);
    const mxBias = acceptLanguage.startsWith('es-MX') || acceptLanguage.startsWith('es')
        ? '&cc=MX&setlang=es' : '';
    const urls = [
        `https://www.bing.com/search?q=${q}&count=20${mxBias}`,
        `https://html.duckduckgo.com/html/?q=${q}`,
    ];
    for (const url of urls) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 12000);
            const res = await fetch(url, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': acceptLanguage,
                },
            });
            clearTimeout(timer);
            if (res.ok && res.status !== 202) {
                const html = await res.text();
                if (html.length > 5000) return html;
            }
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

function addDomainFromUrl(href, found, seen, clientDomain) {
    const domain = extractDomain(href);
    if (!domain || seen.has(domain)) return;
    if (BLOCKLIST.has(domain)) return;
    if (PLATFORM_DOMAIN_RE.test(domain)) return;
    if (domain.endsWith('.google.com') || domain.includes('duckduckgo') || domain.includes('bing.com')) return;
    if (domain.includes('microsoft.com') || domain.includes('apple.com')) return;
    if (domain === clientDomain || clientDomain.endsWith(`.${domain}`) || domain.endsWith(`.${clientDomain}`)) return;
    seen.add(domain);
    found.push(domain);
}

function parseDomainsFromHtml(html, clientDomain) {
    const found = [];
    const seen = new Set([clientDomain]);
    const hrefRe = /href="([^"]+)"/gi;
    let m;
    while ((m = hrefRe.exec(html)) !== null) {
        addDomainFromUrl(m[1], found, seen, clientDomain);
        if (found.length >= 25) break;
    }
    if (found.length < 10) {
        const citeRe = /<cite[^>]*>([\s\S]*?)<\/cite>/gi;
        while ((m = citeRe.exec(html)) !== null) {
            const citeText = m[1].replace(/<[^>]+>/g, ' ').trim();
            const urlMatch = citeText.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
            if (urlMatch) addDomainFromUrl(`https://${urlMatch[1]}`, found, seen, clientDomain);
            if (found.length >= 25) break;
        }
    }
    if (found.length < 10) {
        const urlRe = /https?:\/\/(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi;
        while ((m = urlRe.exec(html)) !== null) {
            addDomainFromUrl(m[0], found, seen, clientDomain);
            if (found.length >= 25) break;
        }
    }
    return found;
}

async function fetchPageSnapshot(domain) {
    const hosts = [domain];
    if (!domain.startsWith('www.')) hosts.push(`www.${domain}`);
    for (const host of hosts) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 10000);
            const res = await fetch(`https://${host}`, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5',
                },
                redirect: 'follow',
            });
            clearTimeout(timer);
            if (!res.ok) continue;
            const html = (await res.text()).slice(0, 18000);
            const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim().slice(0, 150) || '';
            const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]
                || '';
            const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 1200);
            if (title) return { title, description: meta.slice(0, 250), bodyText, html: html.slice(0, 5000) };
        } catch {
            /* try next host */
        }
    }
    return null;
}

function stemToken(w) {
    let t = String(w || '').toLowerCase();
    if (t.endsWith('es') && t.length > 5) t = t.slice(0, -2);
    else if (t.endsWith('s') && t.length > 4) t = t.slice(0, -1);
    return t;
}

function tokenSet(text) {
    return new Set(
        String(text || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 3 && !STOPWORDS.has(w))
            .map(stemToken)
    );
}

function nicheSpecificOverlap(nicheCorpus, compText) {
    const nicheTokens = [...tokenSet(nicheCorpus)].filter((t) => !GENERIC_NICHE_TOKENS.has(t));
    const compTokens = tokenSet(compText);
    if (!nicheTokens.length) return 0;
    let shared = 0;
    nicheTokens.forEach((t) => { if (compTokens.has(t)) shared += 1; });
    return shared;
}

function overlapScore(a, b) {
    const ta = tokenSet(a);
    const tb = tokenSet(b);
    if (!ta.size || !tb.size) return 0;
    let shared = 0;
    ta.forEach((t) => { if (tb.has(t)) shared += 1; });
    return shared;
}

function isPlatformOrSaaS(domain, snapshot) {
    if (BLOCKLIST.has(domain)) return true;
    if (PLATFORM_DOMAIN_RE.test(domain)) return true;
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`.toLowerCase();
    if (NON_COMPETITOR_RE.test(blob)) return true;
    if (/\b(ecwid|shopify|wix|squarespace|bigcommerce|tiendanube|nuvemshop)\b/i.test(domain)) return true;
    if (/\b(shopping cart|online store builder|create (?:your|a) (?:online )?store|crea tu tienda|plataforma de tienda)\b/i.test(blob)) return true;
    return false;
}

function isMegaRetailer(domain, snapshot) {
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`.toLowerCase();
    if (/^(target|walmart|amazon|costco|bestbuy|homedepot|lowes|macys|kohls|wayfair|liverpool|coppel|bodegaaurrera|soriana|mercadolibre)\./i.test(domain)) return true;
    if (MEGA_RETAILER_RE.test(domain)) return true;
    if (MEGA_RETAILER_RE.test(blob) && /\b(millions of products|everyday low prices|groceries|electronics|department store|supercenter|big box|tienda departamental)\b/i.test(blob)) {
        return true;
    }
    return false;
}

function isNonCompetitorDomain(domain, snapshot, clientBrandTokensSet) {
    if (isMegaRetailer(domain, snapshot)) return true;
    if (isPlatformOrSaaS(domain, snapshot)) return true;
    if (/\.(gov|edu)$/.test(domain)) return true;
    const blob = `${domain} ${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    if (DIRECTORY_RE.test(blob)) return true;
    const domainClean = domain.replace(/\W/g, '').toLowerCase();
    for (const bt of clientBrandTokensSet || []) {
        if (bt.length >= 5 && domainClean.includes(bt)) return true;
    }
    return false;
}

function nicheSemanticMatch(nicheCorpus, compText) {
    const rules = [
        [/beb[eé]|baby|infant|reci[eé]n nacido|productos para bebe|productos bebe/i,
            /\b(beb[eé]|baby|infant|reci[eé]n nacido|maternidad|pañal|panal|pañalero|bodys?|manta|babero|ni[nñ]os?|canastilla|cuna|nido|regalo.*bebe|bebe.*regalo|ropa.*bebe|bebe.*ropa|algod[oó]n.*bebe|bebe.*algod)\b/i],
        [/personaliz|bordad|custom/i,
            /personaliz|bordad|custom|nombre|a medida|canastilla|kit de bienvenida/i],
        [/boda|wedding|matrimonio|novios/i,
            /\b(boda|wedding|matrimonio|novios|bride|groom|fotograf[aá]|photograph|photo studio|estudio fotogr[aá]fico)\b/i],
        [/restaurant|restaurante/i,
            /\b(restaurant|restaurante|men[uú]|reserv|comida|cocina)\b/i],
        [/cl[ií]nica|consultorio|salud|medical|dental/i,
            /\b(cl[ií]nica|consultorio|doctor|m[eé]dico|dental|salud|patient|paciente)\b/i],
    ];
    for (const [nicheRe, compRe] of rules) {
        if (!nicheRe.test(nicheCorpus)) continue;
        if (compRe.test(compText)) continue;
        if (/beb[eé]|productos bebe/i.test(nicheCorpus)) {
            const familyBabyAdjacent = /\b(pijama|pijamas)\b/i.test(compText)
                && /personaliz/i.test(compText)
                && /\b(familia|familiares|infantil|ni[nñ]o|reci[eé]n nacido|kit)\b/i.test(compText);
            if (familyBabyAdjacent) continue;
        }
        return false;
    }
    return true;
}

function hasCommercialSignals(snapshot, giroId) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''} ${snapshot?.html || ''}`;
    if (giroId === 'ecommerce') {
        if (ECOMMERCE_SIGNALS.test(blob)) return true;
        if (/\b(tienda online|online shop|online store|e-?commerce|comprar en línea|shopify|woocommerce|buy online)\b/i.test(blob)) return true;
        if (/\b(canastillas?|pañalero|pañaleros|ropa de beb[eé]|productos para beb[eé]|productos bebe|juego de cuna|kit de bienvenida|pijamas?|precio|mxn|\$\s*\d)\b/i.test(blob)) return true;
        if (/"@type"\s*:\s*"(?:Store|Product|OnlineStore|Organization)"/i.test(snapshot?.html || '')) return true;
        return (snapshot?.title || '').length > 10 && (snapshot?.description || '').length > 20;
    }
    return blob.length > 80;
}

function summarizeWhatTheyDo(snapshot) {
    const parts = [snapshot?.title, snapshot?.description].filter(Boolean);
    if (!parts.length) return null;
    const summary = parts.join(' — ').slice(0, 200);
    if (NON_COMPETITOR_RE.test(summary)) return null;
    if (/\b(ecwid|shopify|wix|squarespace|shopping cart software|online store builder)\b/i.test(summary)) return null;
    return summary;
}

async function validateCompetitor(domain, nicheCorpus, giro, clientBrandTokensSet, clientGeo, opts = {}) {
    const strictGeo = opts.strictGeo !== false;
    const minOverlap = opts.minOverlap ?? 1;
    const minNicheOverlap = opts.minNicheOverlap ?? 1;

    const snapshot = await fetchPageSnapshot(domain);
    if (!snapshot || !snapshot.title) return null;
    if (isNonCompetitorDomain(domain, snapshot, clientBrandTokensSet)) return null;
    if (!hasCommercialSignals(snapshot, giro?.id)) return null;

    if (strictGeo) {
        if (!geoMatchesMarket(clientGeo, snapshot, domain)) return null;
    } else if (clientGeo?.country && clientGeo.country !== 'NO_DETECTADA') {
        const { inferCountryFromSnapshot } = require('./geo-context');
        const compCountry = inferCountryFromSnapshot(snapshot, domain);
        if (compCountry && compCountry !== clientGeo.country && clientGeo.marketCountry !== compCountry) return null;
    }

    const compText = `${snapshot.title} ${snapshot.description} ${snapshot.bodyText}`;
    if (!nicheSemanticMatch(nicheCorpus, compText)) return null;
    const nicheScore = nicheSpecificOverlap(nicheCorpus, compText);
    const score = overlapScore(nicheCorpus, compText);
    if (/\b(beb[eé]|baby|productos bebe|productos para bebe)\b/i.test(nicheCorpus)) {
        const hasBabyFocus = /\b(beb[eé]|baby|reci[eé]n nacido|canastilla|pañalero|maternidad|cuna|nido|manta|babero|ni[nñ]o|infantil|infant)\b/i.test(compText);
        const hasFamilyBabyAdjacent = /\b(pijama|pijamas)\b/i.test(compText)
            && /personaliz/i.test(compText)
            && /\b(familia|familiares|infantil|ni[nñ]o|reci[eé]n nacido|kit)\b/i.test(compText);
        if (!hasBabyFocus && !hasFamilyBabyAdjacent) return null;
    }
    if (/\b(beb[eé]|baby|productos bebe)\b/i.test(nicheCorpus)
        && /\b(regalos originales|globos|desayunos sorpresa|flores a domicilio|envoltorios asombrosos)\b/i.test(compText)
        && !/\b(beb[eé]|baby|canastilla|reci[eé]n nacido)\b/i.test(compText)) {
        return null;
    }
    if (nicheScore < minNicheOverlap && score < minOverlap) return null;
    if (score < minOverlap && nicheScore < 1) return null;

    const queHace = summarizeWhatTheyDo(snapshot);
    if (!queHace) return null;

    return {
        domain,
        title: snapshot.title,
        queHace,
        relevanceScore: Math.min(10, nicheScore * 2 + score + 1),
        source: 'busqueda_nicho_geo_validada',
    };
}

async function collectCandidates(queries, clientDomain, acceptLanguage) {
    const candidates = [];
    const seen = new Set();
    for (const query of queries) {
        const html = await fetchSearchHtml(query, acceptLanguage);
        if (!html) continue;
        for (const d of parseDomainsFromHtml(html, clientDomain)) {
            if (!seen.has(d)) {
                seen.add(d);
                candidates.push(d);
            }
        }
        if (candidates.length >= 45) break;
    }
    return candidates;
}

async function pickCompetitors(candidates, nicheCorpus, giro, clientBrand, geo, passes) {
    const picked = [];
    const usedDomains = new Set();

    for (const pass of passes) {
        for (const domain of candidates) {
            if (picked.length >= MIN_COMPETITORS) break;
            if (usedDomains.has(domain)) continue;
            const validated = await validateCompetitor(domain, nicheCorpus, giro, clientBrand, geo, pass);
            if (validated) {
                picked.push(validated);
                usedDomains.add(domain);
            }
        }
        if (picked.length >= MIN_COMPETITORS) break;
    }
    return picked;
}

async function findCompetitors(url, onPage, isSocial = false, ctx = {}) {
    let clientDomain = '';
    try {
        clientDomain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return { competitors: [], block: formatBenchmarkBlock([], '', ctx.giro?.label, null, ctx.giro) };
    }

    const giro = ctx.giro || { id: 'general', label: 'Negocio local' };
    const locale = ctx.locale || null;
    const clientBrand = clientBrandTokens(url, ctx.clientTitle);
    const geo = extractGeoContext(onPage, url, giro);
    const niche = extractProductNiche(onPage, url, ctx.clientTitle, ctx.clientDesc, locale, geo);
    const nicheCorpus = [niche, ctx.clientDesc, onPage?.metaDescription, onPage?.h1Text, onPage?.textSample?.slice(0, 500), giro.label]
        .filter(Boolean).join(' ');

    const signals = extractProductSignals(onPage, ctx.clientDesc, ctx.clientTitle);
    const acceptLanguage = searchAcceptLanguage(locale, geo, onPage);
    const queries = buildSearchQueries(onPage, url, isSocial, giro, ctx.clientTitle, ctx.clientDesc, geo, locale);

    const seeds = getCategorySeedCandidates(signals, geo);
    const passes = [
        { strictGeo: true, minOverlap: 1, minNicheOverlap: 1 },
        { strictGeo: true, minOverlap: 1, minNicheOverlap: 0 },
        { strictGeo: false, minOverlap: 0, minNicheOverlap: 1 },
        { strictGeo: false, minOverlap: 0, minNicheOverlap: 0 },
    ];

    let competitors = await pickCompetitors(seeds, nicheCorpus, giro, clientBrand, geo, passes);

    if (competitors.length < MIN_COMPETITORS) {
        let candidates = await collectCandidates(queries.slice(0, 10), clientDomain, acceptLanguage);
        candidates = [...new Set([...seeds, ...candidates])];
        if (candidates.length < 20) {
            const extra = await collectCandidates(fallbackQueries(giro.id, locale, geo, niche), clientDomain, acceptLanguage);
            candidates = [...new Set([...candidates, ...extra])];
        }
        competitors = await pickCompetitors(candidates, nicheCorpus, giro, clientBrand, geo, passes);
    }

    if (competitors.length > 0 && competitors.length < MIN_COMPETITORS) {
        competitors = [];
    }

    const usedQuery = queries.join(' | ') || 'N/A';
    return {
        competitors,
        query: queries[0] || 'N/A',
        queries,
        niche,
        geo,
        block: formatBenchmarkBlock(competitors, usedQuery, giro.label, geo, giro, niche),
    };
}

function formatBenchmarkBlock(competitors, query, giroLabel, geo, giro, niche) {
    const geoBlock = geo ? formatGeoBlock(geo, giro || { id: geo.giroId, label: giroLabel }) : '';
    if (competitors.length < MIN_COMPETITORS) {
        return `${geoBlock}
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: SIN_COMPETENCIA_IDENTIFICADA
GIRO: ${giroLabel || 'NO_DETECTADO'}
NICHO_PRODUCTO: ${niche || 'NO_DETECTADO'}
QUERY_BUSQUEDA: ${query}
MENSAJE_OBLIGATORIO: No se identificaron al menos 3 competidores directos verificables del mismo nicho de producto/servicio (${niche || 'nicho detectado'}) en el mercado de venta/envío (${geo?.marketLabel || geo?.label || 'ubicación no detectada'}). PROHIBIDO inventar competidores, plataformas SaaS (Shopify, Ecwid, Wix), bancos o mega-retailers.
REGLA_IA: NO uses tabla comparativa. Escribe 2-3 párrafos sobre posicionamiento en este mercado. CERO dominios inventados.
=== FIN BENCHMARK_VERIFIED ===`;
    }

    const lines = competitors.map((c, i) => (
        `COMP_${i + 1}: ${c.domain} | TITLE: ${c.title} | QUE_HACE: ${c.queHace} | RELEVANCIA: ${c.relevanceScore}/10`
    ));

    return `${geoBlock}
=== BENCHMARK_VERIFIED (DATOS REALES — USAR EN SECCIÓN V) ===
ESTADO: COMPETENCIA_VERIFICADA
GIRO: ${giroLabel || 'NO_DETECTADO'}
NICHO_PRODUCTO: ${niche || 'NO_DETECTADO'}
QUERY_BUSQUEDA: ${query}
REGLA_IA: Usa ÚNICAMENTE estos ${competitors.length} competidores verificados — mismo nicho de producto/servicio (${niche}) y mismo mercado (UBICACION_MERCADO). PROHIBIDO plataformas SaaS, mega-retailers y dominios no listados. Tabla obligatoria con fila "Qué hacen" (copiar QUE_HACE literal).
${lines.join('\n')}
=== FIN BENCHMARK_VERIFIED ===`;
}

module.exports = {
    findCompetitors,
    formatBenchmarkBlock,
    buildSearchQueries,
    extractProductNiche,
    MEGA_RETAILER_RE,
    BLOCKLIST,
    MIN_COMPETITORS,
};
