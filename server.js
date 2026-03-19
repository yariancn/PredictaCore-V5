const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// CONFIGURACIÓN DE AUTORIDAD (API KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// RUTA RAÍZ: Panel de Control Visual
app.get('/', (req, res) => {
    res.send(getHTML());
});

// RUTA DE DISECCIÓN: El Nodo de Cierre
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    try {
        let contextoForense = "";
        
        // 1. DETECCIÓN CAMALEÓNICA: ¿Es URL o es Idea/Red Social?
        if (dna.includes('.') && (dna.startsWith('http') || dna.length < 50)) {
            console.log(`[MOTOR]: Ejecutando disección web en ${dna}`);
            const dataWeb = await captureAndScrape(dna);
            contextoForense = dataWeb.texto;
        } else {
            console.log(`[CEREBRO]: Analizando DNA de Idea o Red Social`);
            contextoForense = dna;
        }

        // 2. CONSTRUCCIÓN DEL PROMPT DE CAPITAL
        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        const instruccionFinal = `${PROTOCOLOS_IA}\n\nActúa como Socio Senior de PredictaCore. Mi estándar son 'Organic Nails' y 'La Fortuna'. Dicta sentencias de capital. No expliques conceptos.\n\n${promptTemplate(contextoForense)}`;

        // 3. GENERACIÓN DE SENTENCIA (LLAMADA A GEMINI)
        const result = await model.generateContent(instruccionFinal);
        const response = await result.response;
        const textoSentencia = response.text();

        res.json({ content: textoSentencia });

    } catch (error) {
        console.error(`[FALLA CRÍTICA]: ${error.message}`);
        res.status(500).json({ 
            content: `### ERROR DE AUDITORÍA\nEl activo presenta bloqueos de capital o fallas de DNA.\nDetalle: ${error.message}` 
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`PREDICTACORE TITÁN v32.0 - ESTATUS: ONLINE`);
    console.log(`PUERTO OPERATIVO: ${PORT}`);
    console.log(`-------------------------------------------`);
});
