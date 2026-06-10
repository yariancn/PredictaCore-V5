// motor.js - BÚNKER 6.3: BIFURCACIÓN EXACTA (RESTAURADO + INYECCIÓN FRANCOTIRADOR)
const puppeteer = require('puppeteer');

const { isSocialMediaUrl } = require('./audit-target');
const { collectForensics, formatForensicsBlock } = require('./forensics');
const { runWebSimulation, runSocialSimulation, formatSimulationBlock } = require('./simulator');
const { findCompetitors } = require('./competitors');
const { formatKeywordsBlock } = require('./keywords');
const { formatIdiomaBlock, resolveReportLocale } = require('./idioma');
const { detectGiro } = require('./giro');

function formatBusinessProfile(onPage, giro, clientTitle, clientDesc) {
    const wc = onPage?.wordCount || 0;
    const links = onPage?.internalLinks || 0;
    const imgs = onPage?.imgsTotal || onPage?.imgs || 0;
    const escala = (wc < 12000 && links < 150) ? 'PYME_BOUTIQUE' : 'MEDIANA';
    const corpus = `${clientTitle || ''} ${clientDesc || ''} ${onPage?.title || ''} ${onPage?.metaDescription || ''} ${onPage?.textSample || ''}`;
    const personalized = /\b(custom|personalized|personaliz|handmade|artisan|artesanal|bespoke|monogram|hecho a medida)\b/i.test(corpus);
    return `
=== PERFIL_NEGOCIO (OBLIGATORIO PARA BENCHMARK, SWOT Y GEMELOS) ===
ESCALA: ${escala}
PERSONALIZACION: ${personalized ? 'SI — productos personalizados/artesanales' : 'NO_DETECTADA'}
SENALES_NAVEGACION: ${wc} palabras públicas | ${links} enlaces internos | ${imgs} imágenes
GIRO: ${giro?.label || 'NO_DETECTADO'}
REGLA_BENCHMARK: Activo boutique/PYME del nicho. PROHIBIDO comparar con Amazon, Walmart, Target, Costco, eBay marketplace genérico u otros mega-retailers. Solo competidores del mismo nicho, escala similar y oferta comparable (personalizado, DTC pequeño, artesanal).
=== FIN PERFIL_NEGOCIO ===`;
}

async function captureAndScrape(url) {
    let browser;
    try {
        const isSocialMedia = isSocialMediaUrl(url);

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', 
                '--single-process', '--disable-gpu', '--disable-blink-features=AutomationControlled'
            ]
        });
        
        const startTime = Date.now();
        const page = await browser.newPage();
        
        if (isSocialMedia) {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8' });
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });
        }
        
        let consoleErrors = [];
        page.on('pageerror', err => consoleErrors.push(err.message));

        await page.setViewport({ width: 1280, height: 900 });
        
        if (isSocialMedia) {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 4000)); 
            await page.evaluate(() => window.scrollBy(0, 800));
            await new Promise(r => setTimeout(r, 1500));
        } else {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        }
        
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await new Promise(r => setTimeout(r, 1000)); 
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        // 1. EXTRACCIÓN BASE + SONDA DE LOGOS (SVGs y atributos ocultos)
        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            const metaDesc = document.querySelector('meta[name="description"]')?.content || "";
            const metaTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
            const imgs = Array.from(document.querySelectorAll('img')).map(img => `[Img: ${img.alt || 'Sin alt'}]`).join(' | ');
            
            // Extraer botones sumando atributos "aria-label" o "title" por si son íconos
            const botones = Array.from(document.querySelectorAll('a, button')).map(b => b.innerText.trim() || b.getAttribute('aria-label') || '').filter(t => t.length > 2).join(' | ');
            
            // Extraer vectores (SVGs) que suelen ser los logos de pago (Visa, Mastercard, etc.)
            const svgs = Array.from(document.querySelectorAll('svg')).map(svg => {
                const title = svg.querySelector('title');
                const aria = svg.getAttribute('aria-label');
                return title ? title.textContent : (aria ? aria : '');
            }).filter(t => t.length > 1).join(' | ');
            
            return { titulo: metaTitle, descripcion: metaDesc, cuerpo: document.body.innerText.substring(0, 45000), interactores: botones, visual: imgs, svgs: svgs };
        });

        // 2. SONDA DE SEGUNDO PLANO (Capturar pasarelas como Shop Pay en la página de producto)
        let botonesProducto = "NO_DETECTADO";
        if (!isSocialMedia) {
            try {
                // Buscar el primer enlace de un producto real
                const productUrl = await page.evaluate(() => {
                    const link = document.querySelector('a[href*="/products/"], a[href*="/product/"], a[href*="/item/"]');
                    return link ? link.href : null;
                });

                if (productUrl) {
                    const productPage = await browser.newPage();
                    // BLOQUEO DE RAM: Cancelamos imágenes, css y fuentes en esta pestaña invisible
                    await productPage.setRequestInterception(true);
                    productPage.on('request', req => {
                        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                            req.abort();
                        } else {
                            req.continue();
                        }
                    });
                    
                    await productPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
                    
                    botonesProducto = await productPage.evaluate(() => {
                        return Array.from(document.querySelectorAll('a, button, [role="button"], div[role="button"]'))
                            .map(b => b.innerText.trim() || b.getAttribute('aria-label') || b.getAttribute('title') || '')
                            .filter(t => t.length > 2)
                            .join(' | ');
                    });
                    await productPage.close();
                }
            } catch (e) {
                botonesProducto = "ERROR_AL_SONDEAR_PRODUCTO";
            }
        }

        const forensics = await collectForensics(page, url, loadTime, isSocialMedia);

        const locale = resolveReportLocale(
            forensics.onPage?.htmlLang,
            `${dataForense.titulo} ${dataForense.descripcion} ${dataForense.cuerpo}`.slice(0, 4000)
        );
        const forensicsBlock = formatForensicsBlock(forensics, locale);
        const giroCorpus = `${dataForense.titulo} ${dataForense.descripcion} ${dataForense.cuerpo}`.slice(0, 4000);
        const giro = detectGiro(giroCorpus, isSocialMedia);

        let simulationBlock = '';
        let benchmarkBlock = '';
        let keywordsBlock = '';

        if (isSocialMedia) {
            const sim = runSocialSimulation({
                title: dataForense.titulo,
                bioSnippet: forensics.onPage?.bioSnippet,
                textSample: forensics.onPage?.textSample,
                hasEmail: forensics.onPage?.hasEmail,
                hasPhone: forensics.onPage?.hasPhone,
                externalLinkCount: forensics.onPage?.externalLinkCount,
                externalLinks: forensics.onPage?.externalLinks,
                wordCount: forensics.onPage?.wordCount,
                aiScore: forensics.aiScore,
                platform: forensics.platform,
            });
            simulationBlock = formatSimulationBlock(sim, 'social');
            const bench = await findCompetitors(url, forensics.onPage, true, {
                giro,
                clientTitle: dataForense.titulo,
                clientDesc: dataForense.descripcion,
            });
            benchmarkBlock = bench.block;
        } else {
            const bodySample = dataForense.cuerpo.slice(0, 2000);
            const hasContact = /[\w.+-]+@[\w.-]+\.\w+/.test(bodySample)
                || /\+?\d[\d\s().-]{8,}/.test(bodySample);
            const sim = runWebSimulation({
                title: dataForense.titulo,
                metaDescription: dataForense.descripcion,
                bodySample,
                ctas: dataForense.interactores,
                botonesProducto,
                loadTimeSec: loadTime,
                seoScore: forensics.seoScore,
                aiScore: forensics.aiScore,
                imgsAltPct: forensics.onPage?.imgsAltPct,
                h1Count: forensics.onPage?.h1Count,
                h1Text: forensics.onPage?.h1Text,
                wordCount: forensics.onPage?.wordCount,
                viewport: forensics.onPage?.viewport,
                canonical: forensics.onPage?.canonical,
                jsonLdCount: forensics.onPage?.jsonLdCount,
                internalLinks: forensics.onPage?.internalLinks,
                robotsMeta: forensics.onPage?.robotsMeta,
                sitemapFound: forensics.sitemapFound,
                hasContact,
            });
            simulationBlock = formatSimulationBlock(sim, 'website');
            keywordsBlock = formatKeywordsBlock(forensics.onPage, locale);
            const bench = await findCompetitors(url, forensics.onPage, false, {
                giro,
                clientTitle: dataForense.titulo,
                clientDesc: dataForense.descripcion,
            });
            benchmarkBlock = bench.block;
        }

        await browser.close();
        const dateLocale = locale.code.startsWith('es') ? 'es-MX' : 'en-US';
        const fechaHoy = new Date().toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });
        const idiomaBlock = formatIdiomaBlock(
            forensics.onPage?.htmlLang,
            `${dataForense.titulo} ${dataForense.descripcion} ${dataForense.cuerpo}`.slice(0, 4000)
        );

        const businessProfileBlock = formatBusinessProfile(
            forensics.onPage,
            giro,
            dataForense.titulo,
            dataForense.descripcion
        );

        const dossierTexto = `FECHA: ${fechaHoy} | URL: ${url} | TITULO: ${dataForense.titulo} | CTAS_INICIO: ${dataForense.interactores} | LOGOS_SVG: ${dataForense.svgs} | BOTONES_PRODUCTO: ${botonesProducto} | IMAGENES: ${dataForense.visual} | TEXTO: ${dataForense.cuerpo}${idiomaBlock}${businessProfileBlock}${forensicsBlock}${simulationBlock}${benchmarkBlock}${keywordsBlock}`;

        return {
            isUrl: true,
            texto: dossierTexto,
            reportLocale: locale,
            desktopBase64,
            mobileBase64,
            loadTimeSec: loadTime,
            seoScore: forensics.seoScore ?? null,
            aiScore: forensics.aiScore ?? null,
            assetType: forensics.assetType,
        };
    } catch (error) {
        if (browser) await browser.close();
        return { isUrl: false, texto: `ERROR_MOTOR: ${error.message}` };
    }
}
module.exports = { captureAndScrape };
