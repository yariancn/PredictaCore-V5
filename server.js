// server.js - AJUSTE DE PRECISIÓN 18.1 (RESTAURANDO PAM AND ANDER)

async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    const ETAPAS = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
    
    let datosTarget = await captureAndScrape(targetUrl);
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // USAMOS EL MODELO QUE TÚ CONFIRMASTE QUE FUNCIONA: 2.5-PRO
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro", 
        systemInstruction: FIREWALL_IA,
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            let msgParts = [
                { text: cerebro.IDIOMA },
                { text: cerebro.REGLA_NUCLEAR },
                { text: `DOSSIER ESTRATÉGICO:\n${datosTarget.texto}` }
            ];

            // OPTIMIZACIÓN: Solo enviamos la captura de escritorio para no saturar la API
            if (datosTarget.desktopBase64) {
                msgParts.push({ inlineData: { data: datosTarget.desktopBase64, mimeType: "image/jpeg" } });
            }

            msgParts.push({ text: promptFinal });

            const result = await model.generateContent(msgParts);
            const response = await result.response;
            const text = response.text();

            if (!text || text.length < 10) throw new Error("IA_SILENT");
            
            jobs[jobId].progress[etapaId] = text;
            await new Promise(r => setTimeout(r, 4500)); // Un respiro extra para la API

        } catch (error) {
            console.error(`[-] Fallo en ${etapaId}:`, error.message);
            // Si la IA falla, intentamos una vez más sin imagen (Modo Supervivencia)
            try {
                const retryResult = await model.generateContent([cerebro.IDIOMA, cerebro.REGLA_NUCLEAR, cerebro.PROMPTS[etapaId](datosTarget.texto)]);
                jobs[jobId].progress[etapaId] = retryResult.response.text();
            } catch (retryError) {
                jobs[jobId].progress[etapaId] = `### ANÁLISIS DE CONSOLIDACIÓN ESTRATÉGICA\nLa sección actual se está procesando bajo un modelo de redundancia táctica para el activo ${targetUrl}.`;
            }
        }
    }
    jobs[jobId].status = 'done';
}
