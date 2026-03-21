const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado en: " + input);
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // CAMBIO CRÍTICO: Usamos 'load' en lugar de 'networkidle' para evitar timeouts en Shopify
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    // Espera táctica para que carguen elementos dinámicos
    await page.waitForTimeout(5000);

    // Clic en menús
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn && await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(1000);
          break; 
        }
      } catch (e) {}
    }

    // Scroll profundo
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ 
        src: img.src, 
        alt: img.alt || 'fuga de SEO' 
      })).filter(i => i.src.startsWith('http')).slice(0, 25)),
      buttons: await page.$$eval('button, .btn, a.button', els => 
        els.map(el => el.textContent.trim()).filter(t => t.length > 2)
      )
    };

    await browser.close();
    return { text: fullText.substring(0, 40000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Playwright neutralizado. Activando Visión de Emergencia Jina.`);
    
    const res = await axios.get(`https://r.jina.ai/${input}`);
    const markdown = res.data;

    // REPARACIÓN MAESTRA: Extraemos imágenes del markdown para que la IA no esté "ciega"
    const imageMatches = [...markdown.matchAll(/\!\[.*?\]\((https:\/\/.*?)\)/g)];
    const fallbackImages = imageMatches.map(m => ({ src: m[1], alt: 'detectado vía sensor de emergencia' })).slice(0, 15);

    return { 
      text: markdown, 
      visuals: { images: fallbackImages, buttons: [] } 
    };
  }
}

module.exports = { scrapeDeep };
