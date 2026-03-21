const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: { type: 'concept' } };

  let browser;
  try {
    console.log(`[BARRIDO 360] Iniciando disección: ${input}`);
    browser = await chromium.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'] 
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Bypass de latencia: Entramos y forzamos lectura
    const response = await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(5000); // Ventana crítica para renderizado de Shopify

    // Sensor de Identidad (Título, Meta-desc para anclaje de nicho)
    const identity = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      h1: document.querySelector('h1')?.innerText || ''
    }));

    // BARRIDO 360: Apertura de menús ocultos
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn && await btn.isVisible()) { await btn.click(); await page.waitForTimeout(1000); break; }
      } catch (e) {}
    }

    // SCROLL PROFUNDO: Activar Nodo de Cierre y Lazy Load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'fuga de SEO' })).filter(i => i.src.startsWith('http')).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2)),
      identity
    };

    const resultText = `TITULO: ${identity.title}\nDESCRIPCION: ${identity.description}\nCONTENIDO:\n${fullText}`;
    
    await browser.close();
    if (fullText.length < 500) throw new Error("Acceso Restringido - Activando Sensor Auxiliar");
    
    return { text: resultText.substring(0, 40000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[ALERTA] Blindaje detectado. Activando Fallback Jina.`);
    // Fallback de alta fidelidad
    const res = await axios.get(`https://r.jina.ai/${input}`, { headers: { "X-Return-Format": "markdown" } });
    return { text: res.data, visuals: { note: "Visión de Emergencia Activa", images: [], buttons: [] } };
  }
}

module.exports = { scrapeDeep };
