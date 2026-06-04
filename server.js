// server.js - PredictaCore (Lite + Titán + Seguimiento mensual)
const express = require('express');
const cerebroWeb = require('./cerebro');
const cerebroSocial = require('./cerebro_social');
const { PROMPTS_LITE } = require('./cerebro_lite');
const { PROMPTS_DELTA, extractInitialSummary } = require('./cerebro_delta');
const { getHTML } = require('./visual');
const { getHTMLLite } = require('./visual_lite');
const { getHTMLDelta } = require('./visual_delta');
const { getLandingHTML } = require('./landing');
const { getSuccessHTML } = require('./success');
const { getPlaygroundHTML } = require('./playground');
const {
    CLINICAL_WEB,
    REGENOXY_HUB_PATH,
    getLegalHubHTML,
    getTerminosHTML,
    getPrivacidadHTML,
    getServiciosClinicosHTML,
    getPagosHTML,
    getPrivacidadRegenoxyHTML,
} = require('./legal');
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
const {
    normalizeUrl,
    upsertCliente,
    getClienteByEmail,
    getLatestTitanReport,
    registrarComisionRecurrente,
    saveReporte,
} = require('./db/comercial');

const {
    BRAND,
    TERMS_URL,
    buildCheckoutSessionParams,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
} = require('./stripe-predictacore');

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
            let session = event.data.object;
            session = await expandCheckoutSession(stripe, session);

            if (!isPredictacoreCheckoutSession(session)) {
                console.log(`>>> [WEBHOOK] checkout ignorado — no es producto ${BRAND}`);
                return res.json({ received: true, skipped: 'not_predictacore' });
            }

            const { dna, email, refCode } = session.metadata || {};
            if (!dna || !email) {
                console.warn('>>> [WEBHOOK] PredictaCore checkout sin metadata dna/email');
                return res.json({ received: true, skipped: 'missing_metadata' });
            }

            console.log(`>>> [PAGO INICIAL $349] ${email}. Activando Titán + suscripción...`);

            await upsertCliente({
                email,
                urlSitio: dna,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                refCode,
            });

            iniciarAuditoria(dna, email, 'TITAN');
            await registrarVentaComisiones(session, email, refCode);
        }

        if (event.type === 'invoice.paid') {
            await handleInvoicePaid(event.data.object);
        }
    } catch (err) {
        console.error('!!! Error procesando webhook:', err);
        return res.status(500).json({ error: 'Error interno procesando webhook' });
    }

    res.json({ received: true });
});

async function handleInvoicePaid(invoice) {
    if (invoice.amount_paid !== 2500) return;

    let fullInvoice = invoice;
    if (!invoice.lines?.data?.length) {
        fullInvoice = await stripe.invoices.retrieve(invoice.id, {
            expand: ['lines.data.price', 'subscription'],
        });
    }

    let subscriptionMeta = fullInvoice.subscription?.metadata;
    if (!subscriptionMeta && fullInvoice.subscription) {
        const subId = typeof fullInvoice.subscription === 'string'
            ? fullInvoice.subscription
            : fullInvoice.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        subscriptionMeta = sub.metadata;
    }

    if (!isPredictacoreInvoice(fullInvoice, subscriptionMeta)) {
        console.log(`>>> [WEBHOOK] invoice.paid ignorado — no es monitoreo ${BRAND}`);
        return;
    }

    let email = fullInvoice.customer_email;
    if (!email && fullInvoice.customer) {
        const customer = await stripe.customers.retrieve(fullInvoice.customer);
        email = customer.email;
    }
    if (!email) return;

    console.log(`>>> [COBRO MENSUAL $25] ${email}. Iniciando reporte de seguimiento...`);

    const cliente = await getClienteByEmail(email);
    if (cliente?.ref_code_usado) {
        await registrarComisionRecurrente(fullInvoice.id, email, cliente.ref_code_usado);
    }

    const urlSitio = cliente?.url_sitio || email;
    iniciarAuditoria(urlSitio, email, 'DELTA');
}

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
                    if (res2.rows.length > 0) nivel3_id = res2.rows[0].sponsor_id;
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
        phase: '2',
        database: db,
        stripe_prices: !!(process.env.STRIPE_PRICE_TITAN && process.env.STRIPE_PRICE_SUBSCRIPTION),
        stripe_brand: BRAND,
        stripe_terms_url: TERMS_URL,
        legal_hub_regenoxy: `https://predictacore.ai${REGENOXY_HUB_PATH}`,
        clinical_web: CLINICAL_WEB,
        playground: !!process.env.API_KEY,
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (req, res) => res.send(getLandingHTML()));
app.get('/legal', (req, res) => res.redirect(301, REGENOXY_HUB_PATH));
app.get('/legal/regenoxy', (req, res) => res.send(getLegalHubHTML()));
app.get('/terms', (req, res) => res.send(getTerminosHTML()));
app.get('/privacy', (req, res) => res.send(getPrivacidadHTML()));
app.get('/legal/clinical-services', (req, res) => res.send(getServiciosClinicosHTML()));
app.get('/legal/payments', (req, res) => res.send(getPagosHTML()));
app.get('/legal/privacy', (req, res) => res.send(getPrivacidadRegenoxyHTML()));
app.get('/static/oxyhyperbaric-legal-hub.html', (req, res) => {
    res.sendFile(require('path').join(__dirname, 'static', 'oxyhyperbaric-legal-hub.html'));
});
app.get('/terminos', (req, res) => res.redirect(301, '/terms'));
app.get('/privacidad', (req, res) => res.redirect(301, '/privacy'));
app.get('/legal/servicios-clinicos', (req, res) => res.redirect(301, '/legal/clinical-services'));
app.get('/legal/pagos', (req, res) => res.redirect(301, '/legal/payments'));
app.get('/legal/privacidad', (req, res) => res.redirect(301, '/legal/privacy'));

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
            pool.query(`SELECT tipo, COUNT(*)::int AS n FROM reportes GROUP BY tipo`),
            pool.query('SELECT COUNT(*)::int AS n FROM ventas_comisiones'),
            pool.query(`SELECT estado, COUNT(*)::int AS n FROM jobs_auditoria GROUP BY estado`),
        ]);
        res.json({
            clientes: clientes.rows[0].n,
            reportes: reportes.rows,
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
    iniciarAuditoria(dna, email, 'TITAN');

    res.json({
        status: 'started',
        mode: 'TITAN',
        message: 'Auditoría Titán completa iniciada. El PDF llegará por email en ~10-20 min.',
    });
});

app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, 'LITE');
    res.json({ status: 'started' });
});

app.post('/start', async (req, res) => {
    try {
        const { dna, email, refCode, lang } = req.body;
        if (!dna || !email) {
            return res.status(400).json({ error: 'URL y email requeridos' });
        }

        const host = baseUrl(req);
        const session = await stripe.checkout.sessions.create(
            buildCheckoutSessionParams({ host, dna, email, refCode, lang })
        );

        res.json({ status: 'checkout', url: session.url });
    } catch (error) {
        console.error('!!! Error creando sesión de Stripe:', error);
        res.status(500).json({ error: 'Error interno en la pasarela de pagos' });
    }
});

async function iniciarAuditoria(dna, email, modo) {
    const targetUrl = normalizeUrl(dna);
    if (!targetUrl) return;

    const jobId = `${modo}-${Date.now()}`;

    jobsMemoria[jobId] = {
        status: 'running',
        progress: {},
        email,
        modo,
        dossier: null,
        initialSummary: null,
    };

    if (modo === 'DELTA') {
        const cliente = await getClienteByEmail(email);
        const titan = await getLatestTitanReport(cliente?.id);
        jobsMemoria[jobId].initialSummary = extractInitialSummary(titan?.secciones_json);
    }

    await createJob(jobId, email, targetUrl, modo);

    console.log(`>>> [SISTEMA] Iniciando Reporte ${modo} para: ${targetUrl}`);
    ejecutarAuditoriaFondo(targetUrl, jobId, modo).catch(async (e) => {
        console.error('!!! ERROR:', e);
        await failJob(jobId, e.message);
    });
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, modo) {
    try {
        const datosTarget = await captureAndScrape(targetUrl);
        jobsMemoria[jobId].dossier = datosTarget.texto;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({
            credentials: credenciales,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();

        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

        let promptsAUsar;
        let idioma;
        let regla;
        const inicial = jobsMemoria[jobId].initialSummary || '';

        if (modo === 'DELTA') {
            promptsAUsar = PROMPTS_DELTA;
            idioma = 'INSTRUCCIÓN: Redacta en el idioma del sitio analizado.';
            regla = 'REGLA: Reporte de seguimiento mensual comparativo.';
        } else if (modo === 'LITE') {
            promptsAUsar = PROMPTS_LITE;
            idioma = 'INSTRUCCIÓN: Redacta en el idioma del sitio analizado.';
            regla = '';
        } else {
            const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
            promptsAUsar = cerebroActivo.PROMPTS;
            idioma = cerebroActivo.IDIOMA;
            regla = cerebroActivo.REGLA_NUCLEAR;
        }

        for (const etapaId in promptsAUsar) {
            const promptFinal = modo === 'DELTA'
                ? promptsAUsar[etapaId](datosTarget.texto, inicial)
                : promptsAUsar[etapaId](datosTarget.texto);

            const payload = {
                contents: [{
                    role: 'user',
                    parts: [
                        { text: FIREWALL_IA },
                        { text: idioma },
                        { text: regla },
                        { text: `CONTEXTO:\n${datosTarget.texto}` },
                        { text: promptFinal },
                    ],
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: modo === 'DELTA' ? 4096 : 8192,
                },
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

        await enviarReportePorCorreo(jobId, jobsMemoria[jobId].email, targetUrl, modo);

        if (modo === 'TITAN') {
            await saveReporte({
                email: jobsMemoria[jobId].email,
                urlSitio: targetUrl,
                tipo: 'titan',
                jobId,
                secciones: jobsMemoria[jobId].progress,
                dossier: jobsMemoria[jobId].dossier,
            });
        }
        if (modo === 'DELTA') {
            await saveReporte({
                email: jobsMemoria[jobId].email,
                urlSitio: targetUrl,
                tipo: 'delta',
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

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, modo) {
    let browser;
    try {
        const jobDb = await getJobProgress(jobId);
        const job = jobsMemoria[jobId] || {
            progress: jobDb?.progress || {},
            email: jobDb?.email || emailDestino,
            modo,
        };

        let htmlBase;
        let subject;
        let filename;
        let textBody;

        if (modo === 'LITE') {
            htmlBase = getHTMLLite();
            subject = 'Tu Auditoría Forense PredictaCore (Lite)';
            filename = 'PREDICTACORE_LITE.pdf';
            textBody = 'Adjunto encontrarás tu radiografía inicial PredictaCore.';
        } else if (modo === 'DELTA') {
            htmlBase = getHTMLDelta();
            subject = 'PredictaCore — Reporte de Seguimiento Mensual';
            filename = 'PREDICTACORE_SEGUIMIENTO.pdf';
            textBody = 'Adjunto encontrarás su reporte de seguimiento mensual comparativo.';
        } else {
            htmlBase = getHTML();
            subject = 'Auditoría Forense Titán Completa';
            filename = 'PREDICTACORE_TITAN.pdf';
            textBody = 'Adjunto encontrarás la radiografía de conversión de su activo digital.';
        }

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            const dEl = document.getElementById('pdf-domain');
            if (dEl && dominio) dEl.innerText = dominio.replace(/^https?:\/\//, '');

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
            subject,
            text: textBody,
            attachments: [{ filename, content: pdfBuffer }],
        });

        if (error) throw new Error(`Resend API Error: ${error.message}`);
        console.log(`>>> Sellado. Reporte ${modo} entregado a ${emailDestino}. ID: ${data.id}`);
    } catch (error) {
        if (browser) await browser.close();
        console.error('>>> Error crítico al ensamblar o enviar correo:', error);
        throw error;
    }
}

async function startServer() {
    await initDatabase();

    app.listen(port, '0.0.0.0', () => {
        console.log(`MOTOR UNIFICADO ONLINE - FASE 2 - Puerto ${port}`);
        console.log(`>>> Health: http://0.0.0.0:${port}/health`);
        if (process.env.API_KEY) console.log('>>> Playground: /playground?key=***');
    });
}

startServer().catch((err) => {
    console.error('!!! Error fatal al iniciar:', err);
    process.exit(1);
});
