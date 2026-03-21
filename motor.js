const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  console.log(`[MOTOR v40] Iniciando Infiltración en: ${input}`);

  // FASE 1: Extracción Stealth vía HTTP Puro (Indetectable para Shopify)
  try {
    const { data } = await axios.get(input, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      timeout: 15000
    });

    // Limpieza básica del HTML para extraer contenido
    const textContent = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ').trim();
    
    // Extracción de imágenes mediante Regex
    const imageMatches = [...data.matchAll(/<img[^>]+src="([^">]+)"/gi)];
    const images = imageMatches.map(m => ({ src: m[1], alt: 'Extraída vía HTML' })).slice(0, 20);

    if (textContent.length > 1000) {
      console.log(`[MOTOR v40] Éxito en Fase 1. Datos extraídos: ${textContent.length} chars.`);
      return { 
        text: textContent.substring(0, 45000), 
        visuals: { images, loadTime: 'N/A (Carga Estática)', technicalErrors: [] } 
      };
    }
  } catch (err) {
    console.log(`[MOTOR v40] Fase 1 bloqueada (${err.message}). Pasando a Fase 2.`);
  }

  // FASE 2: Playwright Ultra-Stealth (Si la Fase 1 falla o requiere renderizado)
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    let technicalErrors = [];
    page.on('pageerror', err => technicalErrors.push(err.message));

    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const loadTime = (Date.now() - startTime) / 1000;
    
    await page.waitForTimeout(3000); // Esperar carga de frameworks

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'N/A' })).slice(0, 20)),
      loadTime,
      technicalErrors: technicalErrors.slice(0, 3)
    };

    await browser.close();
    
    if (fullText.length < 500) throw new Error("Contenido insuficiente tras renderizado");
    
    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR v40] Fase 2 Fallida: ${e.message}. Forzando Rescate Jina.`);
    
    // FASE 3: Fallback Externo (Último recurso)
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`);
      return { 
        text: res.data || "SITIO TOTALMENTE BLOQUEADO", 
        visuals: { note: "Rescate Jina", images: [] } 
      };
    } catch(jinaErr) {
       return { text: "ERROR CRÍTICO: Imposible extraer datos del objetivo.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
