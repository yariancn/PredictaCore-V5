/** Real SEO + AI visibility signals for PredictaCore forensic dossiers */

const AI_BOTS = [
    'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai',
    'Google-Extended', 'Bytespider', 'CCBot', 'PerplexityBot',
];

async function fetchUrlText(url, timeoutMs = 8000) {
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);
        const res = await fetch(url, {
            signal: ctrl.signal,
            headers: { 'User-Agent': 'PredictaCore-Forensics/1.0 (+https://predictacore.ai)' },
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        const text = await res.text();
        return text.slice(0, 8000);
    } catch {
        return null;
    }
}

function analyzeRobotsForAiBots(robotsTxt) {
    if (!robotsTxt) {
        return { status: 'NO_ROBOTS_TXT', bots: {}, blocksAll: false };
    }
    const blocksAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/(\s|$)/im.test(robotsTxt);
    const bots = {};
    AI_BOTS.forEach((bot) => {
        const re = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?(Disallow:\\s*(\\S+))`, 'i');
        const m = robotsTxt.match(re);
        if (m) {
            bots[bot] = m[2] === '/' ? 'BLOQUEADO_TOTAL' : `RESTRINGIDO (${m[2]})`;
        } else if (blocksAll) {
            bots[bot] = 'BLOQUEADO_VIA_WILDCARD';
        } else {
            bots[bot] = 'PERMITIDO';
        }
    });
    return { status: 'OK', bots, blocksAll };
}

async function collectWebForensics(page, url, loadTimeSec) {
    const onPage = await page.evaluate(() => {
        const meta = (sel) => document.querySelector(sel)?.content
            || document.querySelector(sel)?.href
            || '';
        const h1s = [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()).filter(Boolean);
        const h2s = [...document.querySelectorAll('h2')].map((h) => h.innerText.trim()).filter(Boolean).slice(0, 8);
        const imgs = [...document.querySelectorAll('img')];
        const withAlt = imgs.filter((i) => i.alt && i.alt.trim().length > 2).length;
        const links = [...document.querySelectorAll('a[href]')];
        let internal = 0;
        let external = 0;
        const origin = location.origin;
        links.forEach((a) => {
            try {
                if (a.href.startsWith(origin)) internal += 1;
                else if (a.href.startsWith('http')) external += 1;
            } catch (_) { /* skip */ }
        });
        const jsonLdScripts = [...document.querySelectorAll('script[type="application/ld+json"]')]
            .map((s) => s.textContent?.trim().slice(0, 400))
            .filter(Boolean);
        const textSample = document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 1200);
        return {
            title: document.title || '',
            titleLen: (document.title || '').length,
            metaDescription: meta('meta[name="description"]'),
            metaDescLen: meta('meta[name="description"]').length,
            canonical: document.querySelector('link[rel="canonical"]')?.href || 'AUSENTE',
            robotsMeta: meta('meta[name="robots"]') || 'AUSENTE',
            ogTitle: meta('meta[property="og:title"]') || 'AUSENTE',
            ogDescription: meta('meta[property="og:description"]') || 'AUSENTE',
            ogImage: document.querySelector('meta[property="og:image"]')?.content ? 'PRESENTE' : 'AUSENTE',
            viewport: document.querySelector('meta[name="viewport"]')?.content ? 'OK' : 'AUSENTE',
            htmlLang: document.documentElement.lang || 'AUSENTE',
            h1Count: h1s.length,
            h1Text: h1s.join(' | ') || 'AUSENTE',
            h2Sample: h2s.join(' | ') || 'AUSENTE',
            imgsTotal: imgs.length,
            imgsAltPct: imgs.length ? Math.round((withAlt / imgs.length) * 100) : 0,
            internalLinks: internal,
            externalLinks: external,
            jsonLdCount: jsonLdScripts.length,
            jsonLdTypes: jsonLdScripts.map((j) => {
                try {
                    const o = JSON.parse(j);
                    if (Array.isArray(o)) return o.map((x) => x['@type']).join(',');
                    return o['@type'] || 'Unknown';
                } catch {
                    return 'ParseError';
                }
            }).join(' | ') || 'NINGUNO',
            wordCount: document.body.innerText.split(/\s+/).filter(Boolean).length,
            textSample,
        };
    });

    let robotsTxt = null;
    let llmsTxt = null;
    let sitemapFound = false;
    try {
        const base = new URL(url);
        robotsTxt = await fetchUrlText(`${base.origin}/robots.txt`);
        llmsTxt = await fetchUrlText(`${base.origin}/llms.txt`)
            || await fetchUrlText(`${base.origin}/.well-known/llms.txt`);
        if (robotsTxt) {
            const sm = robotsTxt.match(/Sitemap:\s*(.+)/i);
            if (sm) sitemapFound = !!(await fetchUrlText(sm[1].trim(), 5000));
        }
        if (!sitemapFound) {
            sitemapFound = !!(await fetchUrlText(`${base.origin}/sitemap.xml`, 5000));
        }
    } catch (_) { /* skip */ }

    const aiRobots = analyzeRobotsForAiBots(robotsTxt);
    const seoScore = scoreWebSeo(onPage, { sitemapFound, robotsTxt: !!robotsTxt, llmsTxt: !!llmsTxt });
    const aiScore = scoreWebAiVisibility(onPage, aiRobots, llmsTxt);

    return {
        assetType: 'website',
        loadTimeSec,
        seoScore,
        aiScore,
        onPage,
        robotsTxt: robotsTxt ? robotsTxt.slice(0, 2500) : null,
        llmsTxt: llmsTxt ? llmsTxt.slice(0, 1500) : null,
        sitemapFound,
        aiRobots,
    };
}

async function collectSocialForensics(page, url, loadTimeSec) {
    const onPage = await page.evaluate(() => {
        const body = document.body.innerText || '';
        const bioCandidates = body.split('\n').map((l) => l.trim()).filter((l) => l.length > 10 && l.length < 280);
        const links = [...document.querySelectorAll('a[href]')].map((a) => ({
            text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 80),
            href: a.href,
        })).filter((l) => l.href.startsWith('http'));
        const externalLinks = links.filter((l) => !l.href.includes(location.hostname));
        return {
            title: document.title || '',
            htmlLang: document.documentElement.lang || 'AUSENTE',
            wordCount: body.split(/\s+/).filter(Boolean).length,
            bioSnippet: bioCandidates.slice(0, 5).join(' | ') || body.slice(0, 400),
            linkCount: links.length,
            externalLinkCount: externalLinks.length,
            externalLinks: externalLinks.slice(0, 6).map((l) => `${l.text} → ${l.href}`).join(' | '),
            hasEmail: /[\w.+-]+@[\w.-]+\.\w+/.test(body),
            hasPhone: /\+?\d[\d\s().-]{8,}/.test(body),
            textSample: body.replace(/\s+/g, ' ').trim().slice(0, 1200),
        };
    });

    const platform = url.includes('instagram') ? 'Instagram'
        : url.includes('facebook') ? 'Facebook'
            : url.includes('tiktok') ? 'TikTok' : 'Social';

    const aiScore = scoreSocialAiVisibility(onPage);

    return {
        assetType: 'social',
        platform,
        loadTimeSec,
        aiScore,
        onPage,
    };
}

function scoreWebSeo(onPage, extras) {
    let s = 0;
    if (onPage.titleLen >= 30 && onPage.titleLen <= 65) s += 15;
    else if (onPage.titleLen > 0) s += 8;
    if (onPage.metaDescLen >= 120 && onPage.metaDescLen <= 160) s += 15;
    else if (onPage.metaDescLen > 0) s += 8;
    if (onPage.h1Count === 1) s += 15;
    else if (onPage.h1Count > 0) s += 5;
    if (onPage.canonical !== 'AUSENTE') s += 10;
    if (onPage.ogImage === 'PRESENTE') s += 8;
    if (onPage.viewport === 'OK') s += 7;
    if (onPage.imgsAltPct >= 70) s += 10;
    else if (onPage.imgsAltPct >= 40) s += 5;
    if (extras.robotsTxt) s += 5;
    if (extras.sitemapFound) s += 10;
    if (onPage.jsonLdCount > 0) s += 10;
    if (onPage.internalLinks >= 5) s += 5;
    return Math.min(100, s);
}

function scoreWebAiVisibility(onPage, aiRobots, llmsTxt) {
    let s = 40;
    if (llmsTxt) s += 25;
    if (onPage.jsonLdCount > 0) s += 15;
    if (onPage.wordCount >= 300) s += 10;
    if (aiRobots.status === 'NO_ROBOTS_TXT') s += 5;
    else if (!aiRobots.blocksAll) s += 10;
    const blocked = Object.values(aiRobots.bots || {}).filter((v) => String(v).includes('BLOQUEADO')).length;
    s -= Math.min(30, blocked * 4);
    if (onPage.robotsMeta.toLowerCase().includes('noindex')) s -= 25;
    return Math.max(0, Math.min(100, s));
}

function scoreSocialAiVisibility(onPage) {
    let s = 35;
    if (onPage.bioSnippet && onPage.bioSnippet.length > 40) s += 20;
    if (onPage.externalLinkCount > 0) s += 15;
    if (onPage.hasEmail || onPage.hasPhone) s += 10;
    if (onPage.wordCount >= 150) s += 10;
    if (onPage.linkCount >= 2) s += 10;
    return Math.min(100, s);
}

function formatForensicsBlock(data) {
    if (data.assetType === 'social') {
        const p = data.onPage;
        return `
=== AI_VISIBILITY (PERFIL SOCIAL — DATOS REALES) ===
PLATAFORMA: ${data.platform}
TIEMPO_CARGA_SEG: ${data.loadTimeSec}
AI_DISCOVERABILITY_SCORE: ${data.aiScore}/100
BIO_PUBLICA: ${p.bioSnippet}
LINKS_EXTERNOS: ${p.externalLinks || 'NINGUNO'}
EMAIL_EN_BIO: ${p.hasEmail ? 'SI' : 'NO'} | TELEFONO_EN_BIO: ${p.hasPhone ? 'SI' : 'NO'}
MUESTRA_TEXTO_PUBLICO: ${p.textSample}
INSTRUCCION_IA: Evaluación técnica PROXY (robots, bio, links). NO es prueba en vivo en ChatGPT. Señala vacíos de entidad (nombre, servicio, ciudad, enlace web propia).
=== FIN AI_VISIBILITY ===`;
    }

    const p = data.onPage;
    const botLines = Object.entries(data.aiRobots.bots || {})
        .map(([k, v]) => `${k}=${v}`).join(' | ');

    return `
=== SEO_FORENSICS (DATOS REALES — USAR EN SECCIÓN IV) ===
TIEMPO_CARGA_SEG: ${data.loadTimeSec}
SEO_TECNICO_SCORE: ${data.seoScore}/100
TITLE (${p.titleLen} chars): ${p.title}
META_DESCRIPTION (${p.metaDescLen} chars): ${p.metaDescription || 'AUSENTE'}
CANONICAL: ${p.canonical}
ROBOTS_META: ${p.robotsMeta}
HTML_LANG: ${p.htmlLang}
H1_COUNT: ${p.h1Count} | H1_TEXT: ${p.h1Text}
H2_MUESTRA: ${p.h2Sample}
OG_TITLE: ${p.ogTitle} | OG_DESC: ${p.ogDescription} | OG_IMAGE: ${p.ogImage}
VIEWPORT_MOBILE: ${p.viewport}
IMAGENES_ALT_COVERAGE: ${p.imgsAltPct}% (${p.imgsTotal} imgs)
ENLACES_INTERNOS: ${p.internalLinks} | EXTERNOS: ${p.externalLinks}
JSON_LD: ${p.jsonLdCount} bloques | TIPOS: ${p.jsonLdTypes}
SITEMAP_XML: ${data.sitemapFound ? 'ENCONTRADO' : 'NO_ENCONTRADO'}
ROBOTS_TXT: ${data.robotsTxt ? 'PRESENTE' : 'AUSENTE'}
LLMS_TXT: ${data.llmsTxt ? 'PRESENTE' : 'AUSENTE'}
PALABRAS_EN_PAGINA: ${p.wordCount}
=== FIN SEO_FORENSICS ===

=== AI_VISIBILITY (DATOS REALES — USAR EN SECCIÓN IV Y ACCIONES) ===
AI_DISCOVERABILITY_SCORE: ${data.aiScore}/100
BOTS_IA_EN_ROBOTS: ${botLines || 'SIN_ROBOTS_TXT'}
ROBOTS_BLOQUEA_TODO: ${data.aiRobots.blocksAll ? 'SI' : 'NO'}
LLMS_TXT_CONTENIDO: ${data.llmsTxt ? data.llmsTxt.slice(0, 800) : 'AUSENTE — las IAs no tienen manifiesto de entrenamiento/citación'}
MUESTRA_TEXTO_INDEXABLE: ${p.textSample}
INSTRUCCION_IA: Evaluación técnica PROXY — NO prueba en vivo en motores IA. Diagnostica citabilidad por robots.txt, Schema.org, llms.txt, extractabilidad de texto, meta noindex.
=== FIN AI_VISIBILITY ===`;
}

async function collectForensics(page, url, loadTimeSec, isSocial) {
    const data = isSocial
        ? await collectSocialForensics(page, url, loadTimeSec)
        : await collectWebForensics(page, url, loadTimeSec);
    return {
        ...data,
        block: formatForensicsBlock(data),
    };
}

const VISION_STAGES = new Set(['INTRO', 'SCORECARD', 'VISIBILIDAD', 'FUGAS', 'ACCIONES', 'FUGAS_LITE']);

function stageUsesVision(modo, etapaId) {
    if (modo === 'LITE') return etapaId === 'FUGAS_LITE' || etapaId === 'SCORECARD';
    if (modo === 'TITAN') return VISION_STAGES.has(etapaId);
    return false;
}

module.exports = {
    collectForensics,
    stageUsesVision,
    AI_BOTS,
};
