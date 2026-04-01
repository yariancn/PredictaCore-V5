app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        let htmlFinal = html;
        // CORRECCIÓN: Buscamos <h3> que es lo que envía el cliente, no ###
        for (const [etapa, explicacion] of Object.entries(CONTEXTOS)) {
            const regex = new RegExp(`(<h3.*?>.*?${etapa}.*?</h3>)`, 'g');
            htmlFinal = htmlFinal.replace(regex, `$1<div class="capsula-contexto">${explicacion}</div>`);
        }

        const htmlConEstilos = htmlFinal.replace('</head>', `${CSS_TITAN}</head>`);
        
        await page.setContent(htmlConEstilos, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' }
        });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Fallo en la cristalización.");
    }
});
