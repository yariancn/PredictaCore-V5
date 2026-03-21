const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando Barrido 360 en: " + input);
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 }
    });
    
    const page = await context.newPage();

    // Sensores de errores invisibles
    let technicalErrors = [];
    page.on('pageerror', err => technicalErrors.push(err.message));

    // Carga táctica (Bypass Shopify)
    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    const loadTime = (Date.now() - startTime) / 1000;
    
    await page.waitForTimeout(4000); 

    // BARRIDO 360: Menús y Navegación
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

    // SCROLL PROFUNDO: Activar Nodo de Cierre y Lazy Loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const metaData = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || ''
    }));

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' })).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim())),
      loadTime,
      technicalErrors: technicalErrors.slice(0, 5),
      metaData
    };

    await browser.close();
    if (fullText.length < 500) throw new Error("Ceguera de contenido detectada");

    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Activando Fallback Jina Forense.`);
    const res = await axios.get(`https://r.jina.ai/${input}`);
    return { text: res.data, visuals: { note: "Visión de Emergencia Activa", loadTime: 'N/A' } };
  }
}

module.exports = { scrapeDeep };
