const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado - URL: " + input);
    browser = await chromium.launch({ headless: true });
    
    // Simulación de identidad humana para evitar bloqueos de Shopify/Cloudflare
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Espera hasta que la red esté inactiva (asegura carga de scripts de personalización)
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // Intento de cierre de pop-ups iniciales que bloquean la vista
    try {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    } catch(e) {}

    // Clic en menú hamburguesa para exponer navegación oculta
    const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(2000);
        console.log(`[MOTOR] Menú expuesto: ${sel}`);
        break;
      }
    }

    // Scroll profundo para activar Lazy Loading de imágenes y elementos
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    let fullText = await page.evaluate(() => document.body.innerText);
    
    // Extracción de visuales con metadatos para análisis de textura y autoridad
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ 
        src: img.src, 
        alt: img.alt || 'sin descripción (fuga de SEO)' 
      })).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button, [role="button"]', els => 
        els.map(el => el.textContent.trim()).filter(t => t.length > 2)
      )
    };

    await browser.close();
    console.log(`[MOTOR] Barrido completado. Texto: ${fullText.length} caracteres.`);
    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    console.error(`[MOTOR] Playwright bloqueado o fallido: ${e.message}`);
    if (browser) await browser.close();
    return { text: "Error de acceso: El sitio bloqueó el barrido automatizado.", visuals: {} };
  }
}

module.exports = { scrapeDeep };
