const axios = require('axios');
const { chromium } = require('playwright'); // ← Solo se carga aquí

async function llamarIA(instruccion, prompt) {
  const key = (process.env.XAI_API_KEY || "").trim();
  if (!key) throw new Error("FALTA_LLAVE_XAI");
  try {
    const r = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: "grok-4-latest",
      messages: [
        { role: "system", content: instruccion },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      stream: false
    }, {
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      timeout: 90000
    });
    return r.data.choices[0].message.content;
  } catch (e) {
    throw new Error("XAI_FAIL: " + e.message);
  }
}

async function extraerDNA(url) {
  try {
    const jinaKey = (process.env.JINA_API_KEY || "").trim();
    const headers = jinaKey ? { 'Authorization': `Bearer ${jinaKey}` } : {};
    const r = await axios.get("https://r.jina.ai/" + url, { headers, timeout: 25000 });
    return r.data.substring(0, 45000);
  } catch (e) { throw new Error("JINA_FAIL: " + e.message); }
}

// BARRIDO PROFUNDO UNIVERSAL (el cambio que pediste)
async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle' });

    // 1. Clic genérico en cualquier hamburguesa / menú
    const menuSelectors = ['button[aria-label*="Menú"]', 'button[aria-label*="menu"]', '.hamburger', 'nav button', '[data-testid*="menu"]'];
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); await page.waitForTimeout(800); break; }
    }

    // 2. Navegación profunda (hasta 12 subpáginas)
    const links = await page.$$eval('a[href]', links => 
      links.map(l => l.href).filter(h => h.startsWith('http') && !h.includes('logout') && !h.includes('cart'))
    );
    const subpages = links.slice(0, 12);

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      buttons: await page.$$eval('button, .btn, [role="button"]', els => els.map(el => el.textContent.trim())),
      mainColor: await page.evaluate(() => getComputedStyle(document.body).backgroundColor),
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt }))),
      hasCheckout: await page.evaluate(() => document.body.innerText.includes('Pagar') || document.body.innerText.includes('Checkout') || document.body.innerText.includes('PayPal'))
    };

    // 3. Visitar subpáginas clave (productos, checkout si existe)
    for (const url of subpages) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
        fullText += "\n\n--- SUBPÁGINA ---\n" + await page.evaluate(() => document.body.innerText);
      } catch (e) {}
    }

    await browser.close();
    return {
      text: fullText.substring(0, 50000),
      visuals: visuals
    };
  } catch (e) {
    if (browser) await browser.close();
    // Fallback limpio a Jina (nunca inventa)
    const text = await extraerDNA(input);
    return { text, visuals: {} };
  }
}

module.exports = { scrapeDeep, llamarIA };
