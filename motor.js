const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando disección profunda en: " + input);
    
    // Lanzamiento con configuración de sigilo para evitar bloqueos
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Espera de red inactiva para asegurar carga de scripts y texturas
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // Clic en menús para exponer navegación oculta (autoridad visual)
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {}
    }

    // Scroll para activar lazy loading de imágenes y certidumbre técnica
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ 
        src: img.src, 
        alt: img.alt || 'sin descripción técnica' 
      })).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button, [role="button"]', els => 
        els.map(el => el.textContent.trim()).filter(t => t.length > 2)
      )
    };

    await browser.close();
    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    console.error(`[MOTOR] Falla en Playwright: ${e.message}`);
    if (browser) await browser.close();
    
    // Fallback a Jina Reader si el sitio bloquea el navegador
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`);
      return { text: res.data, visuals: {} };
    } catch (err) {
      return { text: "Error de acceso: El activo bloqueó la disección.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
