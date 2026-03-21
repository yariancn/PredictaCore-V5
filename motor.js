// motor.js - ACTUALIZADO
const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado - URL: " + input);
    // Lanzamos con configuración de sigilo
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Esperamos a que la red esté inactiva para asegurar carga de Shopify
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });

    // Clic en menú hamburguesa y scroll para activar elementos
    try {
      const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle'];
      for (const sel of menuSelectors) {
        const btn = await page.$(sel);
        if (btn) { await btn.click(); await page.waitForTimeout(1000); break; }
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
    } catch(e) {}

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' })).slice(0, 15)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();
    return { text: fullText.substring(0, 30000), visuals };
  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Falla: ${e.message}`);
    // Fallback a Jina Reader si Playwright es bloqueado
    const jinaUrl = `https://r.jina.ai/${input}`;
    const res = await axios.get(jinaUrl);
    return { text: res.data, visuals: {} };
  }
}

module.exports = { scrapeDeep };
