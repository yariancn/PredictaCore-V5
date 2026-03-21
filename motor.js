const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado - URL: " + input);
    // Configuración con identidad humana para evadir bloqueos de Shopify
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Espera extendida para asegurar carga de activos pesados
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // Intento de cerrar popups obstructores
    try { await page.keyboard.press('Escape'); await page.waitForTimeout(1000); } catch(e) {}

    // Clic en menú para exponer navegación (Jerarquía Visual)
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button'];
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); await page.waitForTimeout(2000); break; }
    }

    // Scroll profundo (Activa Lazy Loading de Texturas)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' })).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();
    return { text: fullText.substring(0, 45000), visuals };
  } catch (e) {
    console.error(`[MOTOR] Playwright neutralizado: ${e.message}`);
    if (browser) await browser.close();
    
    // FALLBACK DE AUTORIDAD: Si Playwright falla, Jina Reader entra al sitio protegido
    try {
      const jinaUrl = `https://r.jina.ai/${input}`;
      const res = await axios.get(jinaUrl);
      return { text: res.data, visuals: {} };
    } catch (err) {
      return { text: "Error de acceso: El activo bloqueó la disección.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
