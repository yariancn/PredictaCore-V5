const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando Barrido 360 en: " + input);
    // Lanzamiento con configuración de sigilo para evitar detecciones
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // CAMBIO CRÍTICO: Usamos 'load' y un tiempo de espera fijo para evitar Timeouts
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(4000); // Ventana de carga para elementos dinámicos

    // Apertura de Menús (Hamburguesas) para capturar navegación profunda
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

    // SCROLL PROFUNDO: Forzamos la carga de imágenes y el Nodo de Cierre
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
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
    
    // Si el texto es muy pobre, forzamos un error para activar el Fallback
    if (fullText.length < 500) throw new Error("Ceguera de contenido");

    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Falla detectada: ${e.message}. Activando sensor de emergencia.`);
    
    // FALLBACK: Si Playwright falla, usamos Jina como sensor secundario
    const res = await axios.get(`https://r.jina.ai/${input}`);
    return { text: res.data, visuals: { images: [], buttons: [] } };
  }
}

module.exports = { scrapeDeep };
