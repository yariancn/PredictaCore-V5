/**
 * Product Intel — standalone catalog opportunity analysis (Pam & Ander framework).
 * Free page at /product-intel. No Stripe / no Titan billing.
 * Reports: (1) niche demand/supply opportunities (2) pricing/costs (3) manufacture-adjacent expansion
 * Optional: score a candidate product via URL and/or image.
 */

const { GoogleAuth } = require('google-auth-library');
const { FIREWALL_IA } = require('./firewall');
const { normalizeUrl } = require('./audit-target');

const JOBS = new Map();
const JOB_TTL_MS = 45 * 60 * 1000;
const MAX_IMAGE_CHARS = 2_800_000; // ~2MB base64

function pruneJobs() {
    const now = Date.now();
    for (const [id, job] of JOBS) {
        if (now - (job.createdAt || 0) > JOB_TTL_MS) JOBS.delete(id);
    }
}

function createProductIntelJob(url, options = {}) {
    pruneJobs();
    const id = `pi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    JOBS.set(id, {
        id,
        url,
        options,
        status: 'running',
        createdAt: Date.now(),
        progress: 'Fetching catalog…',
        result: null,
        error: null,
    });
    return id;
}

function getProductIntelJob(id) {
    pruneJobs();
    return JOBS.get(String(id || '').trim()) || null;
}

function setJobProgress(id, progress) {
    const job = JOBS.get(id);
    if (job) job.progress = progress;
}

function setJobReady(id, result) {
    const job = JOBS.get(id);
    if (!job) return;
    job.status = 'ready';
    job.progress = 'Done';
    job.result = result;
}

function setJobFailed(id, error) {
    const job = JOBS.get(id);
    if (!job) return;
    job.status = 'failed';
    job.error = error || 'Analysis failed';
}

function originFromUrl(raw) {
    const u = normalizeUrl(raw);
    if (!u) return null;
    try {
        return new URL(u).origin;
    } catch {
        return null;
    }
}

function sanitizeImagePayload(raw) {
    if (!raw || typeof raw !== 'object') return null;
    let mimeType = String(raw.mimeType || raw.mime || 'image/jpeg').toLowerCase();
    if (!/^image\/(jpeg|jpg|png|webp|gif)$/.test(mimeType)) mimeType = 'image/jpeg';
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
    let data = String(raw.data || raw.base64 || '').trim();
    if (!data) return null;
    const comma = data.indexOf(',');
    if (data.startsWith('data:') && comma > 0) {
        const header = data.slice(0, comma);
        const m = header.match(/^data:(image\/[a-z0-9.+-]+);base64$/i);
        if (m) mimeType = m[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : m[1].toLowerCase();
        data = data.slice(comma + 1);
    }
    data = data.replace(/\s/g, '');
    if (data.length < 80 || data.length > MAX_IMAGE_CHARS) return null;
    return { mimeType, data };
}

async function fetchText(url, timeoutMs = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: ctrl.signal,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (compatible; PredictaCore-ProductIntel/1.0; +https://predictacore.ai)',
                Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
            },
            redirect: 'follow',
        });
        const text = await res.text();
        return { ok: res.ok, status: res.status, text, contentType: res.headers.get('content-type') || '' };
    } finally {
        clearTimeout(t);
    }
}

function mapShopifyProduct(p) {
    const variant = (p.variants && p.variants[0]) || {};
    const price = variant.price != null ? Number(variant.price) : null;
    const title = String(p.title || '').trim();
    const tags = Array.isArray(p.tags)
        ? p.tags
        : String(p.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
    const productType = String(p.product_type || '').trim();
    const vendor = String(p.vendor || '').trim();
    const handle = String(p.handle || '').trim();
    return {
        title,
        handle,
        price,
        currency: 'USD',
        productType,
        vendor,
        tags: tags.slice(0, 12),
        url: handle ? `/products/${handle}` : null,
    };
}

async function scrapeShopifyCatalog(origin) {
    const products = [];
    let page = 1;
    while (page <= 4 && products.length < 200) {
        const url = `${origin}/products.json?limit=50&page=${page}`;
        const { ok, text, contentType } = await fetchText(url);
        if (!ok || (!/json/i.test(contentType) && !text.trim().startsWith('{'))) break;
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            break;
        }
        const batch = Array.isArray(data.products) ? data.products : [];
        if (!batch.length) break;
        for (const p of batch) products.push(mapShopifyProduct(p));
        if (batch.length < 50) break;
        page += 1;
    }
    return products;
}

function scrapeHtmlProducts(html, origin) {
    const products = [];
    const seen = new Set();
    const linkRe = /href="([^"]*\/products\/[^"?#]+)"[^>]*>[\s\S]{0,200}?([^<]{3,120})/gi;
    let m;
    while ((m = linkRe.exec(html)) && products.length < 80) {
        const path = m[1];
        const title = String(m[2] || '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!title || title.length < 3 || seen.has(path)) continue;
        seen.add(path);
        products.push({
            title,
            handle: path.split('/products/')[1] || '',
            price: null,
            currency: 'USD',
            productType: '',
            vendor: '',
            tags: [],
            url: path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? '' : '/'}${path}`,
        });
    }
    const priceHits = [...html.matchAll(/\$\s*([0-9]+(?:\.[0-9]{2})?)/g)].slice(0, 40).map((x) => Number(x[1]));
    if (priceHits.length && products.length) {
        products.forEach((p, i) => {
            if (p.price == null && priceHits[i] != null) p.price = priceHits[i];
        });
    }
    return products;
}

function summarizeCatalog(products) {
    const titles = products.map((p) => p.title).filter(Boolean);
    const prices = products.map((p) => p.price).filter((n) => typeof n === 'number' && n > 0);
    const types = {};
    const tagFreq = {};
    for (const p of products) {
        const t = p.productType || 'untyped';
        types[t] = (types[t] || 0) + 1;
        for (const tag of p.tags || []) {
            const k = tag.toLowerCase();
            tagFreq[k] = (tagFreq[k] || 0) + 1;
        }
    }
    const topTags = Object.entries(tagFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([k, v]) => `${k}(${v})`);
    const avg =
        prices.length > 0 ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : null;
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    return {
        count: products.length,
        avgPrice: avg,
        minPrice: min,
        maxPrice: max,
        types,
        topTags,
        sampleTitles: titles.slice(0, 40),
    };
}

async function fetchCandidatePageHint(candidateUrl) {
    if (!candidateUrl) return null;
    try {
        const { ok, text } = await fetchText(candidateUrl, 15000);
        if (!ok || !text) return null;
        const title =
            (text.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) ||
                text.match(/<title[^>]*>([^<]+)/i) ||
                [])[1] || '';
        const desc =
            (text.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i) ||
                text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) ||
                [])[1] || '';
        const price =
            (text.match(/itemprop=["']price["'][^>]*content=["']([^"']+)/i) ||
                text.match(/\$\s*([0-9]+(?:\.[0-9]{2})?)/) ||
                [])[1] || '';
        return {
            url: candidateUrl,
            title: String(title).replace(/\s+/g, ' ').trim().slice(0, 180),
            description: String(desc).replace(/\s+/g, ' ').trim().slice(0, 400),
            priceHint: price ? String(price) : null,
        };
    } catch {
        return { url: candidateUrl, title: '', description: '', priceHint: null };
    }
}

async function callGeminiJson(prompt, image = null) {
    if (!process.env.GOOGLE_CREDS) {
        throw new Error('GOOGLE_CREDS not configured');
    }
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    const parts = [{ text: FIREWALL_IA }, { text: prompt }];
    if (image?.data && image?.mimeType) {
        parts.push({
            inlineData: { mimeType: image.mimeType, data: image.data },
        });
        parts.push({
            text: 'La imagen adjunta es el PRODUCTO CANDIDATO a evaluar (probabilidad de éxito). Úsala junto con el catálogo de la tienda.',
        });
    }

    const payload = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
        },
    };

    const vertexRes = await fetch(vertexUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenResponse.token}`,
        },
        body: JSON.stringify(payload),
    });
    const raw = await vertexRes.text();
    if (!vertexRes.ok) {
        throw new Error(`Gemini error ${vertexRes.status}: ${raw.slice(0, 400)}`);
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error('Invalid Gemini response envelope');
    }
    const text =
        parsed?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') ||
        parsed?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '';
    if (!text) throw new Error('Empty Gemini content');
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
        throw new Error('Gemini did not return valid JSON');
    }
}

function buildAnalysisPrompt({ url, origin, summary, products, candidate, hasImage, langHint }) {
    const catalogLines = products
        .slice(0, 60)
        .map((p) => {
            const price = p.price != null ? `$${p.price}` : 'n/a';
            const type = p.productType || '-';
            return `- ${p.title} | ${price} | type:${type} | tags:${(p.tags || []).slice(0, 5).join(',')}`;
        })
        .join('\n');

    const candidateBlock = candidate
        ? `CANDIDATE_PRODUCT:
url=${candidate.url || 'n/a'}
title=${candidate.title || 'n/a'}
description=${candidate.description || 'n/a'}
priceHint=${candidate.priceHint || 'n/a'}
notes=${candidate.notes || 'n/a'}
imageAttached=${hasImage ? 'yes' : 'no'}
`
        : `CANDIDATE_PRODUCT: none (no evaluar candidato; candidateAnalysis = null)
`;

    return `Eres el motor Product Intel de PredictaCore (módulo GRATUITO / standalone — NO es auditoría Titan).
Analizas una tienda online con el mismo marco que usamos en expansiones de catálogo tipo Pam & Ander:
demanda razonable + utilidad alta + oferta relativa delgada + fit con lo que ya fabrican/venden.

Responde SOLO JSON válido (sin markdown) con esta forma:

{
  "meta": {
    "storeUrl": string,
    "detectedNiche": string,
    "nicheConfidence": number,
    "capabilities": string[],
    "manufacturingMethods": string[],
    "currentCatalogSummary": string,
    "whatWeNeedSummary": string,
    "language": "es" | "en"
  },
  "report1_nicheOpportunities": {
    "title": string,
    "verdict": string,
    "whyCurrentAdsMayFail": string,
    "opportunities": [
      {
        "rank": number,
        "product": string,
        "score": number,
        "action": "Prioridad 1" | "Piloto" | "Evitar ampliar",
        "priceSweetSpot": string,
        "priceRange": string,
        "demandSignal": string,
        "supplySignal": string,
        "utility": string,
        "brandFit": string,
        "why": string,
        "estMonthlyUnitsBase": number,
        "estMonthlyRevenueBaseUsd": number
      }
    ],
    "baselineNote": string
  },
  "report2_pricingCompetitionCosts": {
    "title": string,
    "verdict": string,
    "rows": [
      {
        "product": string,
        "pamPrice": string,
        "competitorBenchmarks": string,
        "qualityBar": string,
        "cogsUsd": number,
        "contribMarginPct": number,
        "positioning": "barato" | "mediana" | "premium"
      }
    ],
    "productionNote": string,
    "launchInvestmentUsd": string
  },
  "report3_adjacentExpansion": {
    "title": string,
    "verdict": string,
    "lines": [
      {
        "rank": number,
        "line": string,
        "score": number,
        "ticket": string,
        "why": string,
        "manufacturingLink": string,
        "difficulty": "fácil" | "media" | "alta",
        "estMonthlyRevenueBaseUsd": number
      }
    ],
    "avoid": string[]
  },
  "candidateAnalysis": null | {
    "productName": string,
    "successProbabilityPct": number,
    "score": number,
    "goNoGo": "GO" | "PILOT" | "NO-GO",
    "verdict": string,
    "demandSignal": string,
    "supplySignal": string,
    "utility": string,
    "fitWithStore": string,
    "manufacturingFit": string,
    "recommendedPrice": string,
    "risks": string[],
    "nextSteps": string[]
  }
}

REGLAS:
1) Basarte en el catálogo real. No inventes SKUs que contradigan lo que venden.
2) Prioriza productos con: demanda razonable, oferta relativa delgada, utilidad decente/alta, y relación clara con el catálogo o con el método de fabricación detectado (tela, bordado, print, confección, wood, etc.).
3) report3 debe proponer líneas relacionadas por MÉTODO DE FABRICACIÓN o que no sean difíciles de hacer según lo que ya ofrece la página (matching sets, variantes, upsells, categorías adyacentes fáciles).
4) meta.whatWeNeedSummary = resumen ejecutivo corto (3–5 frases) de qué necesita la tienda para mejorar ventas vía producto (no ads).
5) Si hay candidato (URL y/o imagen y/o notes), rellena candidateAnalysis con probabilidad de éxito 0–100 y goNoGo. Si no hay candidato, candidateAnalysis = null.
6) Scores 0–100. Unidades/revenue son ESTIMADOS Base, no garantías. No inventes ventas históricas del cliente.
7) Idioma del reporte = ${langHint || 'idioma dominante del catálogo (ES o EN)'}.
8) 5–8 oportunidades en report1, 3–6 filas en report2, 4–6 líneas en report3.
9) NO menciones Titan, Stripe ni cobros. Este es un módulo de inteligencia de producto standalone.

STORE: ${url}
ORIGIN: ${origin}
CATALOG_STATS: count=${summary.count}, avgPrice=${summary.avgPrice}, min=${summary.minPrice}, max=${summary.maxPrice}
TYPES: ${JSON.stringify(summary.types)}
TOP_TAGS: ${summary.topTags.join(', ')}
SAMPLE_TITLES: ${summary.sampleTitles.join(' | ')}

${candidateBlock}
CATALOG_LINES:
${catalogLines}
`;
}

function fallbackReport({ url, summary, products, candidate }) {
    const nicheGuess = summary.topTags.slice(0, 3).join(', ') || 'e-commerce personalizado';
    const avg = summary.avgPrice || 55;
    const candidateAnalysis = candidate
        ? {
              productName: candidate.title || candidate.notes || 'Producto candidato',
              successProbabilityPct: 55,
              score: 58,
              goNoGo: 'PILOT',
              verdict:
                  'Evaluación heurística (Gemini no disponible). Requiere validar demanda/oferta del candidato contra el catálogo.',
              demandSignal: 'Sin señal fuerte sin modelo IA',
              supplySignal: 'Revisar listings competidores manualmente',
              utility: 'Depende del uso diario vs decorativo',
              fitWithStore: 'Relacionar con capacidades detectadas del catálogo',
              manufacturingFit: 'Validar con método de fabricación actual',
              recommendedPrice: `$${Math.round(avg)}–$${Math.round(avg * 1.15)}`,
              risks: ['Datos de mercado limitados en modo fallback'],
              nextSteps: ['Correr de nuevo con GOOGLE_CREDS', 'Prototipo + test de precio'],
          }
        : null;

    return {
        meta: {
            storeUrl: url,
            detectedNiche: nicheGuess,
            nicheConfidence: 0.45,
            capabilities: ['personalización', 'soft goods', 'print/confección'],
            manufacturingMethods: ['personalización', 'soft goods'],
            currentCatalogSummary: `${summary.count} productos detectados. Precio medio ~$${avg}.`,
            whatWeNeedSummary:
                'El catálogo actual compite en keywords genéricas saturadas. Necesita SKUs adyacentes con mejor ratio demanda/oferta, utilidad clara y mismo método de fabricación — no más ads del mismo core.',
            language: 'es',
            fallback: true,
        },
        report1_nicheOpportunities: {
            title: 'Oportunidades dentro del nicho',
            verdict:
                'Análisis heurístico (Gemini no disponible). Se proponen extensiones adyacentes al catálogo detectado.',
            whyCurrentAdsMayFail:
                'Keywords genéricas del catálogo actual suelen estar saturadas; conviene atacar SKUs con mejor ratio demanda/oferta.',
            opportunities: (products.slice(0, 3).length ? products.slice(0, 3) : [{ title: 'Extensión adyacente' }]).map(
                (p, i) => ({
                    rank: i + 1,
                    product: `Variante premium / matching set de: ${p.title || 'SKU actual'}`,
                    score: 72 - i * 4,
                    action: i === 0 ? 'Prioridad 1' : 'Piloto',
                    priceSweetSpot: `$${Math.round((p.price || avg) * 1.05)}`,
                    priceRange: `$${Math.round((p.price || avg) * 0.9)}–$${Math.round((p.price || avg) * 1.2)}`,
                    demandSignal: 'Demanda del nicho existente (estimado)',
                    supplySignal: 'Oferta genérica alta; matching/personalizado más delgado',
                    utility: 'Alta si resuelve un uso diario del mismo buyer',
                    brandFit: 'Alto — misma capacidad productiva',
                    why: 'Extiende el catálogo actual sin salir del craft de la marca.',
                    estMonthlyUnitsBase: 10 - i * 2,
                    estMonthlyRevenueBaseUsd: Math.round((10 - i * 2) * (p.price || avg)),
                })
            ),
            baselineNote: 'Estimados sin datos de ventas del cliente.',
        },
        report2_pricingCompetitionCosts: {
            title: 'Precios vs competencia y costos',
            verdict: 'Coloca precios en mediana de categoría y diferencia por personalización + matching.',
            rows: [
                {
                    product: 'SKU adyacente #1',
                    pamPrice: `$${Math.round(avg)}`,
                    competitorBenchmarks: 'Mediana de categoría comparable',
                    qualityBar: 'Empatar material percibido del líder de categoría',
                    cogsUsd: Math.round(avg * 0.28),
                    contribMarginPct: 45,
                    positioning: 'mediana',
                },
            ],
            productionNote: 'Validar COGS real con prototipo.',
            launchInvestmentUsd: '$1,500–$2,500',
        },
        report3_adjacentExpansion: {
            title: 'Expansión por fabricación / facilidad',
            verdict: 'Líneas que reutilizan el mismo método productivo o son fáciles de añadir.',
            lines: [
                {
                    rank: 1,
                    line: 'Matching set / upsell del mismo craft',
                    score: 85,
                    ticket: `$${Math.round(avg)}–$${Math.round(avg * 4)}`,
                    why: 'Misma capacidad de personalización, menor saturación en long-tails.',
                    manufacturingLink: 'Mismo proceso/material del catálogo actual',
                    difficulty: 'fácil',
                    estMonthlyRevenueBaseUsd: Math.round(avg * 20),
                },
            ],
            avoid: ['Apparel genérico saturado', 'POD de precio piso'],
        },
        candidateAnalysis,
    };
}

async function analyzeStoreCatalog(rawUrl, options = {}) {
    const url = normalizeUrl(rawUrl);
    if (!url) throw new Error('Invalid URL');
    const origin = originFromUrl(url);
    if (!origin) throw new Error('Invalid store origin');

    const image = sanitizeImagePayload(options.image);
    const candidateUrlRaw = String(options.candidateUrl || '').trim();
    const candidateUrl = candidateUrlRaw ? normalizeUrl(candidateUrlRaw) : null;
    const notes = String(options.notes || '').trim().slice(0, 800);
    const langHint = options.lang === 'en' ? 'en' : options.lang === 'es' ? 'es' : null;

    let products = [];
    let source = 'none';
    try {
        products = await scrapeShopifyCatalog(origin);
        if (products.length) source = 'shopify_products_json';
    } catch {
        /* continue */
    }

    if (!products.length) {
        const home = await fetchText(url);
        if (home.ok && home.text) {
            products = scrapeHtmlProducts(home.text, origin);
            if (products.length) source = 'html_parse';
        }
    }

    if (!products.length) {
        throw new Error(
            'No se pudo leer el catálogo. Usa una URL de tienda Shopify (o página con /products/).'
        );
    }

    let candidateHint = null;
    if (candidateUrl || notes || image) {
        candidateHint = (await fetchCandidatePageHint(candidateUrl)) || {
            url: candidateUrl,
            title: '',
            description: '',
            priceHint: null,
        };
        candidateHint.notes = notes;
    }

    const summary = summarizeCatalog(products);
    let analysis;
    try {
        analysis = await callGeminiJson(
            buildAnalysisPrompt({
                url,
                origin,
                summary,
                products,
                candidate: candidateHint,
                hasImage: Boolean(image),
                langHint,
            }),
            image
        );
    } catch (err) {
        console.error('!!! product-intel Gemini fallback:', err?.message || err);
        analysis = fallbackReport({ url, summary, products, candidate: candidateHint });
        analysis.meta.geminiError = String(err?.message || err).slice(0, 200);
    }

    if (!candidateHint) analysis.candidateAnalysis = null;

    analysis.meta = {
        ...(analysis.meta || {}),
        storeUrl: url,
        origin,
        scrapedAt: new Date().toISOString(),
        catalogSource: source,
        catalogCount: summary.count,
        avgPrice: summary.avgPrice,
        hadCandidate: Boolean(candidateHint),
        hadImage: Boolean(image),
        freeModule: true,
    };

    return {
        analysis,
        catalog: {
            summary,
            products: products.slice(0, 80),
        },
    };
}

async function runProductIntelJob(jobId, rawUrl, options = {}) {
    try {
        setJobProgress(jobId, 'Reading product catalog…');
        const result = await analyzeStoreCatalog(rawUrl, options);
        setJobProgress(jobId, 'Building opportunity reports…');
        setJobReady(jobId, result);
        return result;
    } catch (err) {
        setJobFailed(jobId, err?.message || 'Analysis failed');
        throw err;
    }
}

/**
 * Full Product Intel markdown for Titan PDF — same analysis engine as /product-intel.
 * Announced as free Bonus (XII) on paid Titan reports.
 */
function formatProductIntelForTitan(analysis, lang = 'en') {
    if (!analysis) return '';
    const es = lang === 'es' || analysis?.meta?.language === 'es';
    const r1 = analysis.report1_nicheOpportunities || {};
    const r2 = analysis.report2_pricingCompetitionCosts || {};
    const r3 = analysis.report3_adjacentExpansion || {};
    const meta = analysis.meta || {};
    const lines = [];

    lines.push(
        es
            ? '### XII. BONUS — OPORTUNIDADES DE NUEVOS PRODUCTOS (incluido sin costo)'
            : '### XII. BONUS — NEW PRODUCT OPPORTUNITIES (included at no extra cost)'
    );
    lines.push('');
    lines.push(
        es
            ? '**Qué es este bonus:** el mismo análisis de inteligencia de producto que corre en PredictaCore Product Intel — rankea oportunidades de catálogo que podrían vender mejor que el core actual, con precios/costos y expansión adyacente. No es parte de las 11 secciones de fugas; es un adicional gratuito al Titán.'
            : '**What this bonus is:** the same Product Intel analysis PredictaCore runs for catalog opportunity scoring — ranked product ideas that may outperform your current core, plus pricing/cost and adjacent expansion. Not one of the 11 leak sections; a free add-on with Titan.'
    );
    lines.push('');
    lines.push(`**${es ? 'Nicho detectado' : 'Detected niche'}:** ${meta.detectedNiche || '—'}`);
    if (meta.currentCatalogSummary) {
        lines.push(`**${es ? 'Catálogo' : 'Catalog'}:** ${meta.currentCatalogSummary}`);
    }
    if (meta.manufacturingMethods?.length) {
        lines.push(
            `**${es ? 'Métodos de fabricación detectados' : 'Detected manufacturing methods'}:** ${meta.manufacturingMethods.join(', ')}`
        );
    }
    if (meta.whatWeNeedSummary) {
        lines.push('');
        lines.push(`**${es ? 'Qué necesita la tienda (producto)' : 'What the store needs (product)'}:** ${meta.whatWeNeedSummary}`);
    }
    if (r1.whyCurrentAdsMayFail) {
        lines.push('');
        lines.push(
            `**${es ? 'Por qué el catálogo actual puede no convertir' : 'Why the current catalog may underperform'}:** ${r1.whyCurrentAdsMayFail}`
        );
    }

    lines.push('');
    lines.push(`#### A — ${r1.title || (es ? 'Oportunidades en el nicho' : 'Niche opportunities')}`);
    if (r1.verdict) lines.push(r1.verdict);
    lines.push('');
    const opps = Array.isArray(r1.opportunities) ? r1.opportunities : [];
    opps.slice(0, 8).forEach((o, i) => {
        const n = o.rank || i + 1;
        lines.push(
            `${n}. **${o.product || '—'}** — score ${o.score ?? '—'}/100 · ${o.action || ''} · ${es ? 'precio' : 'price'} ${o.priceSweetSpot || '—'}`
        );
        if (o.why) lines.push(`   ${o.why}`);
        if (o.utility) lines.push(`   ${es ? 'Utilidad' : 'Utility'}: ${o.utility}`);
        if (o.demandSignal || o.supplySignal) {
            lines.push(
                `   ${es ? 'Demanda' : 'Demand'}: ${o.demandSignal || '—'} · ${es ? 'Oferta' : 'Supply'}: ${o.supplySignal || '—'}`
            );
        }
        if (o.estMonthlyUnitsBase != null || o.estMonthlyRevenueBaseUsd != null) {
            lines.push(
                `   ${es ? 'Estimado Base' : 'Base estimate'}: ${o.estMonthlyUnitsBase ?? '—'} ${es ? 'uds/mes' : 'units/mo'} · $${o.estMonthlyRevenueBaseUsd ?? '—'}`
            );
        }
    });

    lines.push('');
    lines.push(`#### B — ${r2.title || (es ? 'Precios, competencia y costos' : 'Pricing, competition & costs')}`);
    if (r2.verdict) lines.push(r2.verdict);
    lines.push('');
    const rows = Array.isArray(r2.rows) ? r2.rows : Array.isArray(r2.products) ? r2.products : [];
    if (rows.length) {
        lines.push(
            es
                ? '| Producto | Precio recomendado | Benchmarks | COGS est. | Margen | Posicionamiento |'
                : '| Product | Recommended price | Benchmarks | Est. COGS | Margin | Positioning |'
        );
        lines.push('| --- | --- | --- | --- | --- | --- |');
        rows.slice(0, 8).forEach((row) => {
            const name = row.product || row.name || '—';
            const price = row.recommendedPrice || row.price || '—';
            const bench = row.benchmarks || row.competitorPrices || '—';
            const cogs = row.cogs || row.estimatedCogs || '—';
            const margin = row.margin || row.marginPct || '—';
            const pos = row.positioning || row.note || '—';
            lines.push(
                `| ${String(name).replace(/\|/g, '/')} | ${String(price).replace(/\|/g, '/')} | ${String(bench).replace(/\|/g, '/')} | ${String(cogs).replace(/\|/g, '/')} | ${String(margin).replace(/\|/g, '/')} | ${String(pos).replace(/\|/g, '/')} |`
            );
        });
    }

    lines.push('');
    lines.push(`#### C — ${r3.title || (es ? 'Expansión adyacente' : 'Adjacent expansion')}`);
    if (r3.verdict) lines.push(r3.verdict);
    lines.push('');
    const adj = Array.isArray(r3.lines) ? r3.lines : [];
    adj.slice(0, 6).forEach((l, i) => {
        const n = l.rank || i + 1;
        lines.push(
            `${n}. **${l.line || '—'}** — ${l.ticket || ''} · score ${l.score ?? '—'} · ${l.difficulty || ''}`
        );
        if (l.why) lines.push(`   ${l.why}`);
        if (l.manufacturingLink) {
            lines.push(`   ${es ? 'Vínculo de fabricación' : 'Manufacturing link'}: ${l.manufacturingLink}`);
        }
    });
    if (Array.isArray(r3.avoid) && r3.avoid.length) {
        lines.push('');
        lines.push(`**${es ? 'Evitar' : 'Avoid'}:** ${r3.avoid.join('; ')}`);
    }

    if (analysis.candidateAnalysis) {
        const c = analysis.candidateAnalysis;
        lines.push('');
        lines.push(`#### ${es ? 'Producto candidato' : 'Candidate product'}`);
        lines.push(
            `**${c.productName || ''}** — ${c.successProbabilityPct ?? '—'}% · ${c.goNoGo || ''} — ${c.verdict || ''}`
        );
        if (c.recommendedPrice) {
            lines.push(`${es ? 'Precio sugerido' : 'Suggested price'}: ${c.recommendedPrice}`);
        }
        if (Array.isArray(c.nextSteps) && c.nextSteps.length) {
            c.nextSteps.slice(0, 4).forEach((s, i) => lines.push(`${i + 1}. ${s}`));
        }
    }

    lines.push('');
    lines.push(
        es
            ? '_Estimados de mercado en escenario Base — no son garantías ni ventas históricas del cliente. Misma metodología que Product Intel._'
            : '_Market estimates are Base-case scenarios — not guarantees or the client’s historical sales. Same methodology as Product Intel._'
    );

    return lines.join('\n');
}

module.exports = {
    createProductIntelJob,
    getProductIntelJob,
    runProductIntelJob,
    analyzeStoreCatalog,
    formatProductIntelForTitan,
};
