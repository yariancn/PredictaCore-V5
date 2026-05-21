// server.js - NÚCLEO BLINDADO PREDICTACORE (LITE + TITÁN) CON CAPACIDAD EXTENDIDA
const express = require('express');
const cerebroWeb = require('./cerebro');          
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { getHTML } = require('./visual'); 
const { getHTMLLite } = require('./visual_lite');
const { getLandingHTML } = require('./landing'); 
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const { Resend } = require('resend');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const app = express();
const port = process.env.PORT || 8080;

const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

app.post('/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`!!! Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { dna, email, refCode } = session.metadata;

        console.log(`>>> [PAGO EXITOSO] Recibido de ${email}. Despertando IA Titán...`);

        iniciarAuditoria(dna, email, false);

        try {
            if (refCode && refCode !== 'null' && refCode !== '') {
                const res1 = await pool.query('SELECT id, sponsor_id FROM afiliados WHERE codigo_ref = $1', [refCode]);
                if (res1.rows.length > 0) {
                    const nivel1_id = res1.rows[0].id;
                    const nivel2_id = res1.rows[0].sponsor_id;
                    let nivel3_id = null;

                    if (nivel2_id) {
                        const res2 = await pool.query('SELECT sponsor_id FROM afiliados WHERE id = $1', [nivel2_id]);
                        if (res2.rows.length > 0) {
                            nivel3_id = res2.rows[0].sponsor_id;
                        }
                    }

                    await pool.query(`
                        INSERT INTO ventas_comisiones
                        (id_venta_stripe, cliente_email, monto_total, afiliado_nivel_1_id, comision_nivel_1, afiliado_nivel_2_id, comision_nivel_2, afiliado_nivel_3_id, comision_nivel_3)
                        VALUES ($1, $2, 349.00, $3, 104.70, $4, 34.90, $5, 17.45)
                    `, [session.id, email, nivel1_id, nivel2_id, nivel3_id]);
                }
            } else {
                await pool.query(`
                    INSERT INTO ventas_comisiones (id_venta_stripe, cliente_email, monto_total)
                    VALUES ($1, $2, 349.00)
                `, [session.id, email]);
            }
        } catch (dbError) {
            console.error("!!! Error registrando comisiones en la BD:", dbError);
        }
    }
    res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send(getLandingHTML()));

app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

app.post('/start', async (req, res) => {
    try {
        const { dna, email, refCode } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Reporte Titán (Auditoría Forense)' },
                        unit_amount: 34900,
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Suscripción Monitoreo Titán' },
                        unit_amount: 2500, // ACTUALIZADO A $25 USD
                        recurring: { interval: 'month' }
                    },
                    quantity: 1,
                }
            ],
            success_url: `https://${req.get('host')}/?success=true`,
            cancel_url: `https://${req.get('host')}/`,
            metadata: { dna, email, refCode: refCode || '' } 
        });

        res.json({ status: 'checkout', url: session.url });
    } catch (error) {
        console.error("!!! Error creando sesión de Stripe:", error);
        res.status(500).json({ error: 'Error interno en la pasarela de pagos' });
    }
});

async function iniciarAuditoria(dna, email, isLite) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    const modo = isLite ? 'LITE' : 'TITAN';
    const jobId = `${modo}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, isLite: isLite };
    console.log(`>>> [SISTEMA] Iniciando Reporte ${modo} para: ${targetUrl}`);
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(e => console.error("!!! ERROR:", e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsAUsar = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
            const payload = {
                contents: [{ role: "user", parts: [
                    { text: FIREWALL_IA },
                    { text: cerebroActivo.IDIOMA }, 
                    { text: cerebroActivo.REGLA_NUCLEAR },
                    { text: `CONTEXTO:\n${datosTarget.texto}` }, 
                    { text: promptFinal }
                ]}],
                generationConfig: { temperature: 0.1, maxOutputTokens: 8192 } 
            };

            const vertexRes = await fetch(vertexUrl, { 
                method: "POST", 
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` }, 
                body: JSON.stringify(payload) 
            });

            const vertexData = await vertexRes.json();
            if (vertexData.candidates) {
                jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, isLite);
    } catch (error) { console.error("!!! FALLO MOTOR:", error); }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    let browser;
    try {
        const job = jobs[jobId];
        const htmlBase = isLite ? getHTMLLite() : getHTML();
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            const dEl = document.getElementById('pdf-domain');
            if(dEl && dominio) dEl.innerText = 'Analysis: ' + dominio;
            
            for (const key in progressData) {
                const div = document.createElement('div');
                div.className = 'report-section';
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        const { data, error } = await resend.emails.send({
            from: 'PredictaCore Titán <reportes@predictacore.ai>',
            to: emailDestino,
            subject: isLite ? 'Tu Auditoría Forense PredictaCore (Lite)' : 'Auditoría Forense Titán Completa',
            text: 'Adjunto encontrarás la radiografía de conversión de tu activo digital. Ábrelo en un ordenador para su correcta visualización.',
            attachments: [
                {
                    filename: isLite ? 'PREDICTACORE_LITE.pdf' : 'PREDICTACORE_TITAN.pdf',
                    content: pdfBuffer
                }
            ]
        });

        if (error) { throw new Error(`Resend API Error: ${error.message}`); }
        console.log(`>>> Sellado. Reporte entregado con éxito a ${emailDestino}. ID: ${data.id}`);
    } catch (error) { 
        if(browser) await browser.close(); 
        console.error(">>> Error crítico al ensamblar o enviar correo:", error); 
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR UNIFICADO ONLINE - MODELO 2.5`));
