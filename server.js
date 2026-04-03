// server.js - HUB CENTRAL B31
// ... (mantenemos las importaciones anteriores)

async function ejecutarProceso(jobId) {
    let input = jobs[jobId].dna.trim();
    // Normalización: si no trae http, se lo ponemos para que el motor no falle
    let targetURL = (input.includes('.') && !input.startsWith('http')) ? `https://${input}` : input;

    // 1. CAPTURA FORENSE
    const data = await captureAndScrape(targetURL);
    
    // 2. SELECCIÓN DE CEREBRO (Web, Social o Idea)
    let cerebroActivo = PROMPTS; // Por defecto Web
    if (input.includes('instagram.com') || input.includes('facebook.com')) cerebroActivo = PROMPTS_SOCIAL;
    if (!input.includes('.')) cerebroActivo = PROMPTS_IDEAS;

    // 3. GENERACIÓN POR NODOS (Para no saturar y mantener calidad)
    const etapas = Object.keys(cerebroActivo);
    for (const etapaId of etapas) {
        jobs[jobId].currentEtapa = etapaId;
        const promptFinal = cerebroActivo[etapaId](data.texto);
        
        // Llamada a Vertex AI con las Directrices y el Dossier
        const resultado = await llamarIA(REGLAS_NUCLEARES, data.texto, promptFinal, data.desktopBase64);
        jobs[jobId].progress[etapaId] = resultado;
        
        await new Promise(r => setTimeout(r, 4500)); // Respiro para la API
    }
    jobs[jobId].status = 'done';
}

// ... (El resto de la lógica de descarga PDF usa ESTILOS_PDF de formato.js)
