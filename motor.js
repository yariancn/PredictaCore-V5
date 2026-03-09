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
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
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
        return r.data.substring(0, 15000);
    } catch (e) { throw new Error("JINA_FAIL: " + e.message); }
}

async function scrapeDeep(input, maxPages = 12) {
    const timestamp = new Date().toISOString();  // Timestamp fresco por request
    if (input.startsWith('http')) {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(input, { timeout: 30000 });
        
        let content = await page.content();
        const currentDate = new Date().toISOString().slice(0, 10);
        content = content.replace(/2026/g, currentDate);  // Corregir fechas
        const visuals = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a.btn, [class*="button"], [class*="btn"]')).map(el => ({
                text: el.innerText.trim(),
                color: window.getComputedStyle(el).backgroundColor,
                position: el.getBoundingClientRect()
            }));
            const mainColor = window.getComputedStyle(document.body).backgroundColor;
            const location = document.querySelector('[itemprop="address"], .address, footer address')?.innerText || 'No ubicación detectada';
            return { buttons, mainColor, location };
        });
        
        const links = await page.$$eval('a[href^="/"], a[href^="' + new URL(input).origin + '"]', as => 
            as.map(a => a.href).filter(h => !h.includes('#') && !h.includes('login')).slice(0, maxPages - 1)
        );
        for (const link of links) {
            try {
                await page.goto(link, { timeout: 20000 });
                let subContent = await page.content();
                subContent = subContent.replace(/2026/g, currentDate);
                content += `\n--- Subpágina: ${link} (timestamp: ${timestamp}) ---\n` + subContent;
            } catch (e) { console.log("Subpágina falló:", link); }
        }
        
        await browser.close();
        return { text: content.substring(0, 50000), visuals };
    } else {
        return { text: input + `\n(Timestamp fresco: ${timestamp})`, visuals: {} };
    }
}

module.exports = { llamarIA, extraerDNA, scrapeDeep };
