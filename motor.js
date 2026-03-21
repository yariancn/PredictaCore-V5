const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado en: " + input);
    // Lanzamiento con sigilo
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    
    // Espera de red inactiva (asegura que Shopify cargue todo)
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // CLIC EN MENÚS (Abrir la navegación oculta)
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await page.waitForTimeout(2000); // Tiempo para que el menú despliegue
          console.log(`[MOTOR] Menú expandido: ${sel}`);
          break; 
        }
      } catch (e) {}
    }

    // SCROLL PROFUNDO (Llegar hasta el fondo para detectar fallas en footer/checkout)
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'fuga de SEO' })).slice(0, 25)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();
    return { text: fullText.substring(0, 40000), visuals };
  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Error: ${e.message}`);
    // Fallback Jina por si Playwright es bloqueado
    const res = await axios.get(`https://r.jina.ai/${input}`);
    return { text: res.data, visuals: {} };
  }
}

module.exports = { scrapeDeep };
