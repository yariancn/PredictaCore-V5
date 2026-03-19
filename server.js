const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// 1. SELLADO DE LLAVE: Detecta cualquier nombre de variable en Railway
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Usamos 1.5-flash para asegurar velocidad y compatibilidad total de llave
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 2. NODO DE ENTRADA: Panel Visual PredictaCore
app.get('/', (req, res) => {
    res.send(getHTML());
});

// 3. NODO DE CIERRE: Ejecución de Auditoría Forense
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    try {
        let contextoForense = "";
        
        // DETECCIÓN CAMALEÓNICA: ¿Es una URL o una Idea de Negocio/Red Social?
        const esURL = dna.trim().includes('.') && !dna.includes(' ');
        
        if (esURL) {
            console.log(`[MOTOR]: Ejecutando disección web en ${dna}`);
            const dataWeb = await captureAndScrape(dna);
            contextoForense = dataWeb.texto;
        } else {
            console.log(`[CEREBRO]: Analizando DNA de Idea o Contenido Directo`);
            contextoForense = dna;
        }

        // CONSTRUCCIÓN DE SENTENCIA CON ESTÁNDAR 'ORGANIC NAILS'
        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        const instruccionFinal = `
            ${PROTOCOLOS_IA}
            INSTRUCCIÓN DE SOCIO SENIOR:
            Actúa como Auditor Forense de PredictaCore. 
            Tu estándar de calidad son los reportes de 'Organic Nails' y 'La Fortuna'.
            No expliques conceptos, dicta sentencias financieras. 
            Tu prioridad es el Nodo de Cierre y la Certidumbre Técnica.
            Tu juicio debe ser asertivo, pragmático y quirúrgico. 
            Prohibido el relleno. 
            Analiza el siguiente dossier y emite el veredicto para la fase: ${etapaId}.
            
            DOSSIER:
            ${contextoForense}
        `;

        const result = await model.generateContent(instruccionFinal);
        const response = await result.response;
        const textoSentencia = response.text();

        res.json({ content: textoSentencia });

    } catch (error) {
        console.error(`[FALLA CRÍTICA]: ${error.message}`);
        res.status(500).json({ 
            content: `### FALLA EN EL NODO DE CIERRE\nHubo un error al procesar el capital de información.\nDetalle: ${error.message}` 
        });
    }
});

// 4. CERTIDUMBRE DE PUERTO: Compatible con Railway (8080)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`PREDICTACORE TITÁN v32.0 - ESTATUS: ONLINE`);
    console.log(`PUERTO OPERATIVO: ${PORT}`);
    console.log(`-------------------------------------------`);
});
