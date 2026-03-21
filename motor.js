const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo 360 iniciado: " + input);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
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
    await page.waitForTimeout(3000); // Espera para que carguen apps de Shopify

    // BARRIDO 360: Menús y Hamburguesas
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

    // MÉTRICAS DE RENDIMIENTO TÉCNICO
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
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' })).filter(i => i.src.startsWith('http')).slice(0, 25)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2)),
      loadTime,
      perfMetrics,
      technicalErrors: technicalErrors.slice(0, 5)
    };

    await browser.close();
    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Error técnico: ${e.message}. Activando Fallback Jina.`);
    const res = await axios.get(`https://r.jina.ai/${input}`);
    return { 
      text: res.data, 
      visuals: { loadTime: 'N/A', technicalErrors: [e.message] } 
    };
  }
}

module.exports = { scrapeDeep };
