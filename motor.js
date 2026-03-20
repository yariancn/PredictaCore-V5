const axios = require('axios');
const { chromium } = require('playwright');

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

// BARRIDO PROFUNDO UNIVERSAL: Abre sitio, clica menú hamburguesa, navega categorías, llega a checkout si existe, analiza imágenes
async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Iniciando barrido profundo...");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle', timeout: 30000 });

    // 1. Clic universal en menú hamburguesa / toggle
    const menuSelectors = [
      'button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', 'nav button', 
      '[data-testid*="menu"]', '.menu-icon', '.nav-toggle', '[class*="hamburger"]', '[id*="menu-toggle"]'
    ];
    let menuFound = false;
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(1500); // Espera carga menú
        menuFound = true;
        console.log(`[MOTOR] Menú clickeado con selector: ${sel}`);
        break;
      }
    }
    if (!menuFound) console.log("[MOTOR] No se encontró menú hamburguesa");

    // 2. Navegación profunda: entra a las primeras categorías detectadas
    const categoryLinks = await page.$$eval('a[href]', links => 
      links.map(l => l.href).filter(h => h.startsWith('http') && !h.includes('cart') && !h.includes('login') && !h.includes('#'))
    );
    const subpages = categoryLinks.slice(0, 12);

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      buttons: await page.$$eval('button, .btn, [role="button"]', els => els.map(el => el.textContent.trim())),
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' }))),
      hasCheckout: (await page.evaluate(() => document.body.innerText)).includes('Pagar') || 
                    (await page.evaluate(() => document.body.innerText)).includes('Checkout') || 
                    (await page.evaluate(() => document.body.innerText)).includes('PayPal')
    };

    // 3. Visitar subpáginas (categorías, checkout si aparece)
    for (const url of subpages) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
        await page.waitForTimeout(800);
        fullText += "\n\n--- SUBPÁGINA: " + url + " ---\n" + await page.evaluate(() => document.body.innerText);
      } catch (e) {
        console.log(`[MOTOR] Subpágina falló: ${url}`);
      }
    }

    await browser.close();
    console.log(`[MOTOR] Barrido completado - Texto: ${fullText.length} chars`);
    return { text: fullText.substring(0, 50000), visuals };
  } catch (e) {
    console.error(`[MOTOR] Playwright falló: ${e.message}`);
    if (browser) await browser.close();
    // Fallback seguro a Jina
    try {
      const jinaText = await extraerDNA(input);
      return { text: jinaText, visuals: {} };
    } catch {
      return { text: "Datos no detectados en scrape", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep, llamarIA };
