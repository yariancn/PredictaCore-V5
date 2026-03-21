const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando disección profunda: " + input);
    
    // Lanzamiento con sigilo para evadir escudos anti-bots
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    
    const page = await context.newPage();
    
    // Bypass de protecciones por tiempo de espera y red
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // Lógica para Redes Sociales: Forzar carga de comentarios y seguidores
    if (input.includes('instagram.com') || input.includes('tiktok.com')) {
      await page.waitForTimeout(5000); 
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    // Interacción con menús para exponer navegación oculta
    try {
      const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button'];
      for (const sel of menuSelectors) {
        const btn = await page.$(sel);
        if (btn) { await btn.click(); await page.waitForTimeout(1500); break; }
      }
    } catch (e) {}

    // Scroll final para activar Lazy Load de imágenes y certidumbre técnica
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
    console.error(`[MOTOR] Playwright neutralizado: ${e.message}`);
    if (browser) await browser.close();
    
    // Fallback de Autoridad: Jina Reader (Capacidad de entrar a cualquier sitio protegido)
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`, {
        headers: { "X-Return-Format": "markdown" }
      });
      return { text: res.data, visuals: {} };
    } catch (err) {
      return { text: "Error de acceso: El activo bloqueó la disección forense.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
