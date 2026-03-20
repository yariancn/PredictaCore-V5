const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando barrido profundo con Playwright...");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle', timeout: 30000 });

    // Clic universal en cualquier hamburguesa/menú
    const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', 'nav button', '[data-testid*="menu"]', '.menu-icon'];
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(1200);
        console.log(`[MOTOR] Menú clickeado con selector: ${sel}`);
        break;
      }
    }

    // Extraer TODO
    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      buttons: await page.$$eval('button, .btn, [role="button"]', els => els.map(el => el.textContent.trim())),
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt }))),
      hasCheckout: fullText.includes('Pagar') || fullText.includes('Checkout') || fullText.includes('PayPal') || fullText.includes('Oxxo')
    };

    // Navegar subpáginas clave
    const links = await page.$$eval('a[href]', links => links.map(l => l.href).slice(0, 12));
    for (const url of links) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
        await page.waitForTimeout(600);
      } catch (e) {}
    }

    await browser.close();
    console.log(`[MOTOR] Barrido completado - Texto: ${fullText.length} chars`);
    return { text: fullText.substring(0, 50000), visuals };
  } catch (e) {
    console.error(`[MOTOR] Playwright falló: ${e.message}`);
    if (browser) await browser.close();
    // Fallback limpio
    try {
      const jina = await axios.get("https://r.jina.ai/" + input, { timeout: 25000 });
      return { text: jina.data.substring(0, 50000), visuals: {} };
    } catch {
      return { text: "Datos no detectados", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
