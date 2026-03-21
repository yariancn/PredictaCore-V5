const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo 360 iniciado: " + input);
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 }
    });
    
    const page = await context.newPage();

    // SENSOR DE ERRORES NO VISUALES
    let technicalErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') technicalErrors.push(msg.text()); });
    page.on('pageerror', err => { technicalErrors.push(err.message); });

    // MEDIDOR DE CARGA
    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    const loadTime = (Date.now() - startTime) / 1000;
    await page.waitForTimeout(3000);

    // BARRIDO 360: Menús
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn && await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(1500);
          break; 
        }
      } catch (e) {}
    }

    // BARRIDO 360: Scroll profundo
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // MÉTRICAS DE RENDIMIENTO
    const perfMetrics = await page.evaluate(() => {
      const t = performance.timing;
      return {
        dns: t.domainLookupEnd - t.domainLookupStart,
        tcp: t.connectEnd - t.connectStart,
        dom: t.domContentLoadedEventEnd - t.navigationStart
      };
    });

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' })).filter(i => i.src.startsWith('http')).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim())),
      loadTime,
      perfMetrics,
      technicalErrors: technicalErrors.slice(0, 5)
    };

    await browser.close();
    return { text: fullText.substring(0, 40000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Falla técnica. Activando Jina Fallback.`);
    
    const res = await axios.get(`https://r.jina.ai/${input}`);
    const markdown = res.data;

    // REPARACIÓN MAESTRA: Extraemos imágenes del fallback para no estar ciegos
    const imageMatches = [...markdown.matchAll(/\!\[.*?\]\((https:\/\/.*?)\)/g)];
    const fallbackImages = imageMatches.map(m => ({ src: m[1], alt: 'detectado vía sensor de emergencia' })).slice(0, 15);

    return { 
      text: markdown, 
      visuals: { 
        images: fallbackImages, 
        buttons: [], 
        loadTime: 'N/A', 
        technicalErrors: [e.message] 
      } 
    };
  }
}

module.exports = { scrapeDeep };
