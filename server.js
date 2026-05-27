// server.js - NÚCLEO BLINDADO PREDICTACORE (LITE + TITÁN) CON CAPACIDAD EXTENDIDA
const express = require('express');
const cerebroWeb = require('./cerebro');
const cerebroSocial = require('./cerebro_social');
const { PROMPTS_LITE } = require('./cerebro_lite');
const { getHTML } = require('./visual');
const { getHTMLLite } = require('./visual_lite');
const { getLandingHTML } = require('./landing');
const { getSuccessHTML } = require('./success');
const { getPlaygroundHTML } = require('./playground');
const { captureAndScrape } = require('./motor');
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const { Resend } = require('resend');
const {
    getPool,
    initDatabase,
    claimWebhookEvent,
    createJob,
    updateJobProgress,
    completeJob,
    failJob,
    getJobProgress,
    healthCheck,
} = require('./db/init');
const { normalizeUrl, upsertCliente, saveReporte } = require('./db/comercial');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 8080;

const resend = new Resend(process.env.RESEND_API_KEY);
const jobsMemoria = {};

function baseUrl(req) {
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${proto}://${req.get('host')}`;
}

function requirePlayground(req, res, next) {
    const key = req.headers['x-api-key'] || req.query.key;
    if (!process.env.API_KEY || key !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Playground requiere API_KEY válida' });
    }
    next();
}

function buildCheckoutLineItems() {
    const priceTitan = process.env.STRIPE_PRICE_TITAN;
    const priceSub = process.env.STRIPE_PRICE_SUBSCRIPTION;

    if (priceTitan && priceSub) {
        return [
            { price: priceTitan, quantity: 1 },
            { price: priceSub, quantity: 1 },
        ];
    }

    return [
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
                unit_amount: 2500,
                recurring: { interval: 'month' },
            },
            quantity: 1,
        },
    ];
}

app.post('/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`!!! Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        const isNew = await claimWebhookEvent(event.id, event.type);
        if (!isNew) {
            console.log(`>>> [WEBHOOK] Evento duplicado ignorado: ${event.id}`);
            return res.json({ received: true, duplicate: true });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { dna, email, refCode } = session.metadata || {};

            console.log(`>>> [PAGO EXITOSO] Recibido de ${email}. Despertando IA Titán...`);

            await upsertCliente({
                email,
                urlSitio: dna,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                refCode,
            });

            iniciarAuditoria(dna, email, false);
            await registrarVentaComisiones(session, email, refCode);
        }
    } catch (err) {
        console.error('!!! Error procesando webhook:', err);
        return res.status(500).json({ error: 'Error interno procesando webhook' });
    }

    res.json({ received: true });
});

async function registrarVentaComisiones(session, email, refCode) {
    const pool = getPool();
    if (!pool) return;

    try {
        if (refCode && refCode !== 'null' && refCode !== '') {
            const res1 = await pool.query(
                'SELECT id, sponsor_id FROM afiliados WHERE codigo_ref = $1',
                [refCode]
            );
            if (res1.rows.length > 0) {
                const nivel1_id = res1.rows[0].id;
                const nivel2_id = res1.rows[0].sponsor_id;
                let nivel3_id = null;

                if (nivel2_id) {
                    const res2 = await pool.query(
                        'SELECT sponsor_id FROM afiliados WHERE id = $1',
                        [nivel2_id]
                    );
                    if (res2.rows.length > 0) {
                        nivel3_id = res2.rows[0].sponsor_id;
                    }
                }

                await pool.query(`
                    INSERT INTO ventas_comisiones
                    (id_venta_stripe, cliente_email, monto_total, afiliado_nivel_1_id, comision_nivel_1, afiliado_nivel_2_id, comision_nivel_2, afiliado_nivel_3_id, comision_nivel_3)
                    VALUES ($1, $2, 349.00, $3, 104.70, $4, 34.90, $5, 17.45)
                    ON CONFLICT (id_venta_stripe) DO NOTHING
                `, [session.id, email, nivel1_id, nivel2_id, nivel3_id]);
                return;
            }
        }

        await pool.query(`
            INSERT INTO ventas_comisiones (id_venta_stripe, cliente_email, monto_total)
            VALUES ($1, $2, 349.00)
            ON CONFLICT (id_venta_stripe) DO NOTHING
        `, [session.id, email]);
    } catch (dbError) {
        console.error('!!! Error registrando comisiones en la BD:', dbError);
    }
}

app.use(express.json({ limit: '10mb' }));

app.get('/health', async (req, res) => {
    const db = await healthCheck();
    res.status(db.ok ? 200 : 503).json({
        status: db.ok ? 'ok' : 'degraded',
        service: 'predictacore-titan',
        phase: '1',
        database: db,
        stripe_prices: !!(process.env.STRIPE_PRICE_TITAN && process.env.STRIPE_PRICE_SUBSCRIPTION),
        playground: !!process.env.API_KEY,
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (req, res) => res.send(getLandingHTML()));

app.get('/exito', (req, res) => {
    const lang = req.query.lang === 'es' ? 'es' : 'en';
    res.send(getSuccessHTML(lang));
});

app.get('/playground', requirePlayground, (req, res) => {
    res.send(getPlaygroundHTML());
});

app.get('/playground/db', requirePlayground, async (req, res) => {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'BD no disponible' });

    try {
        const [clientes, reportes, ventas, jobs] = await Promise.all([
            pool.query('SELECT COUNT(*)::int AS n FROM clientes'),
            pool.query('SELECT COUNT(*)::int AS n FROM reportes'),
            pool.query('SELECT COUNT(*)::int AS n FROM ventas_comisiones'),
            pool.query(`SELECT estado, COUNT(*)::int AS n FROM jobs_auditoria GROUP BY estado`),
        ]);
        res.json({
            clientes: clientes.rows[0].n,
            reportes: reportes.rows[0].n,
            ventas: ventas.rows[0].n,
            jobs: jobs.rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/portal-cliente', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email requerido' });

        const pool = getPool();
        if (!pool) return res.status(503).json({ error: 'BD no disponible' });

        const result = await pool.query(
            'SELECT stripe_customer_id FROM clientes WHERE email = $1',
            [email]
        );
        const customerId = result.rows[0]?.stripe_customer_id;
        if (!customerId) {
            return res.status(404).json({ error: 'Cliente sin suscripción activa en Stripe' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${baseUrl(req)}/`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('!!! Error portal Stripe:', error);
        res.status(500).json({ error: 'No se pudo abrir el portal de cliente' });
    }
});

app.post('/playground/titan', requirePlayground, async (req, res) => {
    const { dna, email } = req.body;
    if (!dna || !email) {
        return res.status(400).json({ error: 'URL y email requeridos' });
    }

    console.log(`>>> [PLAYGROUND] Titán sin cobro para ${email} — ${dna}`);
    iniciarAuditoria(dna, email, false);

    res.json({
        status: 'started',
        mode: 'TITAN',
        message: 'Auditoría Titán completa iniciada. El PDF llegará por email en ~10-20 min.',
    });
});

app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

app.post('/start', async (req, res) => {
    try {
        const { dna, email, refCode } = req.body;
        if (!dna || !email) {
            return res.status(400).json({ error: 'URL y email requeridos' });
        }

        const host = baseUrl(req);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            mode: 'subscription',
            line_items: buildCheckoutLineItems(),
            success_url: `${host}/exito?email=${encodeURIComponent(email)}&lang=en`,
            cancel_url: `${host}/`,
            metadata: { dna, email, refCode: refCode || '' },
        });

        res.json({ status: 'checkout', url: session.url });
    } catch (error) {
        console.error('!!! Error creando sesión de Stripe:', error);
        res.status(500).json({ error: 'Error interno en la pasarela de pagos' });
    }
});

async function iniciarAuditoria(dna, email, isLite) {
    const targetUrl = normalizeUrl(dna);
    if (!targetUrl) return;

    const modo = isLite ? 'LITE' : 'TITAN';
    const jobId = `${modo}-${Date.now()}`;

    jobsMemoria[jobId] = { status: 'running', progress: {}, email, isLite, dossier: null };
    await createJob(jobId, email, targetUrl, modo);

    console.log(`>>> [SISTEMA] Iniciando Reporte ${modo} para: ${targetUrl}`);
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(async (e) => {
        console.error('!!! ERROR:', e);
        await failJob(jobId, e.message);
    });
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    try {
        const datosTarget = await captureAndScrape(targetUrl);
        jobsMemoria[jobId].dossier = datosTarget.texto;

        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsAUsar = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({
            credentials: credenciales,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();

        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
            const payload = {
                contents: [{
                    role: 'user',
                    parts: [
                        { text: FIREWALL_IA },
                        { text: cerebroActivo.IDIOMA },
                        { text: cerebroActivo.REGLA_NUCLEAR },
                        { text: `CONTEXTO:\n${datosTarget.texto}` },
                        { text: promptFinal },
                    ],
                }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
            };

            const vertexRes = await fetch(vertexUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenResponse.token}`,
                },
                body: JSON.stringify(payload),
            });

            const vertexData = await vertexRes.json();
            if (vertexData.candidates) {
                jobsMemoria[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
                await updateJobProgress(jobId, jobsMemoria[jobId].progress);
            }
            await new Promise((r) => setTimeout(r, 2000));
        }

        await enviarReportePorCorreo(jobId, jobsMemoria[jobId].email, targetUrl, isLite);

        if (!isLite) {
            await saveReporte({
                email: jobsMemoria[jobId].email,
                urlSitio: targetUrl,
                tipo: 'titan',
                jobId,
                secciones: jobsMemoria[jobId].progress,
                dossier: jobsMemoria[jobId].dossier,
            });
        }

        await completeJob(jobId);
    } catch (error) {
        await failJob(jobId, error.message);
        throw error;
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    let browser;
    try {
        const jobDb = await getJobProgress(jobId);
        const job = jobsMemoria[jobId] || {
            progress: jobDb?.progress || {},
            email: jobDb?.email || emailDestino,
            isLite: jobDb?.isLite ?? isLite,
        };

        const htmlBase = job.isLite ? getHTMLLite() : getHTML();
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            const dEl = document.getElementById('pdf-domain');
            if (dEl && dominio) dEl.innerText = 'Analysis: ' + dominio;

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
            subject: job.isLite
                ? 'Tu Auditoría Forense PredictaCore (Lite)'
                : 'Auditoría Forense Titán Completa',
            text: 'Adjunto encontrarás la radiografía de conversión de tu activo digital. Ábrelo en un ordenador para su correcta visualización.',
            attachments: [{
                filename: job.isLite ? 'PREDICTACORE_LITE.pdf' : 'PREDICTACORE_TITAN.pdf',
                content: pdfBuffer,
            }],
        });

        if (error) throw new Error(`Resend API Error: ${error.message}`);
        console.log(`>>> Sellado. Reporte entregado con éxito a ${emailDestino}. ID: ${data.id}`);
    } catch (error) {
        if (browser) await browser.close();
        console.error('>>> Error crítico al ensamblar o enviar correo:', error);
        throw error;
    }
}

async function startServer() {
    await initDatabase();

    app.listen(port, '0.0.0.0', () => {
        console.log(`MOTOR UNIFICADO ONLINE - MODELO 2.5 - Puerto ${port}`);
        console.log(`>>> Health check: http://0.0.0.0:${port}/health`);
        if (process.env.API_KEY) {
            console.log('>>> Playground activo: /playground?key=***');
        }
    });
}

startServer().catch((err) => {
    console.error('!!! Error fatal al iniciar:', err);
    process.exit(1);
});
