const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado...");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle', timeout: 45000 });

    // Clic agresivo en cualquier menú hamburguesa (incluye menú izquierdo)
    const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]', '[id*="menu"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await page.waitForTimeout(2000);
          console.log(`[MOTOR] Menú clickeado: ${sel}`);
          break;
        }
      } catch (e) {}
    }

    // Scroll y extracción profunda
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt }))),
      buttons: await page.$$eval('button, .btn', els => els.map(el => el.textContent.trim())),
      hasCheckout: fullText.includes('Pagar') || fullText.includes('Checkout') || fullText.includes('PayPal') || fullText.includes('Oxxo')
    };

    // Navegación a colecciones y productos
    const links = await page.$$eval('a[href]', links => links.map(l => l.href).filter(h => h.startsWith('http') && !h.includes('cart') && !h.includes('login')).slice(0, 12));
    for (const url of links) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
        fullText += "\n\n--- SUBPÁGINA: " + url + " ---\n" + await page.evaluate(() => document.body.innerText);
        await page.waitForTimeout(1000);
      } catch (e) {}
    }

    await browser.close();
    console.log(`[MOTOR] Barrido completado - Texto: ${fullText.length} chars`);
    return { text: fullText.substring(0, 60000), visuals };
  } catch (e) {
    console.error(`[MOTOR] Playwright falló: ${e.message}`);
    if (browser) await browser.close();
    try {
      const r = await axios.get("https://r.jina.ai/" + input, { timeout: 30000 });
      return { text: r.data.substring(0, 50000), visuals: {} };
    } catch {
      return { text: input, visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
