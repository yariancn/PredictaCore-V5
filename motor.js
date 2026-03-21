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
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();

    // Captura de Errores No Visuales
    let technicalErrors = [];
    page.on('pageerror', err => technicalErrors.push(err.message));

    // Medición de Carga Real
    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    const loadTime = (Date.now() - startTime) / 1000;
    await page.waitForTimeout(3000); // Ventana para scripts de terceros

    // BARRIDO 360: Apertura de Menús (Hamburguesas)
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

    // SCROLL PROFUNDO: Activar Lazy Loading y Nodo de Cierre
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const fullText = await page.evaluate(() => document.body.innerText);
    
    // Extracción de Visuales
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ 
        src: img.src, 
        alt: img.alt || 'fuga de SEO' 
      })).filter(i => i.src.startsWith('http')).slice(0, 25)),
      buttons: await page.$$eval('button, .btn, a.button', els => 
        els.map(el => el.textContent.trim()).filter(t => t.length > 2)
      ),
      loadTime,
      technicalErrors: technicalErrors.slice(0, 5)
    };

    await browser.close();
    
    // Validación de Calidad: Si el texto es ridículamente corto, forzar Fallback
    if (fullText.length < 500) throw new Error("Ceguera por Bloqueo");

    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Alerta: ${e.message}. Activando Sensor Jina.`);
    
    const res = await axios.get(`https://r.jina.ai/${input}`);
    const markdown = res.data;

    // Extracción forense de imágenes desde Markdown
    const imageMatches = [...markdown.matchAll(/\!\[.*?\]\((https:\/\/.*?)\)/g)];
    const fallbackImages = imageMatches.map(m => ({ src: m[1], alt: 'detectado vía sensor de emergencia' })).slice(0, 15);

    return { 
      text: markdown, 
      visuals: { images: fallbackImages, buttons: [], loadTime: 'N/A', technicalErrors: [e.message] } 
    };
  }
}

module.exports = { scrapeDeep };
