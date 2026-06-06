// server.js - PredictaCore (Lite + Titán + Seguimiento mensual)
const path = require('path');
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
const { getTitanInternalHTML } = require('./titan-internal');
const { getPlaygroundHTML } = require('./playground');
const { getTerminosHTML, getPrivacidadHTML } = require('./legal');
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

const { isSocialMediaUrl, resolveAuditTarget } = require('./audit-target');

const {
    BRAND,
    TERMS_URL,
    buildCheckoutSessionParams,
    normalizeStripeSecretKey,
    stripeKeyDiagnostics,
    validateCheckoutPrices,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
} = require('./stripe-predictacore');

const stripe = require('stripe')(normalizeStripeSecretKey(process.env.STRIPE_SECRET_KEY));

const app = express();
const port = process.env.PORT || 8080;

const resend = new Resend(process.env.RESEND_API_KEY);
const jobsMemoria = {};

function baseUrl(req) {
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${proto}://${req.get('host')}`;
}

function publicBaseUrl() {
    return (process.env.PUBLIC_BASE_URL || 'https://predictacore.ai').replace(/\/$/, '');
}

async function resolveStripeCustomerId(email) {
    const normalized = String(email).trim().toLowerCase();
    const cliente = await getClienteByEmail(normalized);
    if (cliente?.stripe_customer_id) return cliente.stripe_customer_id;

    const customers = await stripe.customers.list({ email: normalized, limit: 5 });
    const match = customers.data.find((c) => c.email?.toLowerCase() === normalized);
    return match?.id || customers.data[0]?.id || null;
}

async function createCustomerPortalUrl(customerId) {
    const portalParams = {
        customer: customerId,
        return_url: `${publicBaseUrl()}/`,
    };
    if (process.env.STRIPE_PORTAL_CONFIG) {
        portalParams.configuration = process.env.STRIPE_PORTAL_CONFIG;
    }
    const session = await stripe.billingPortal.sessions.create(portalParams);
    return session.url;
}

function buildTitanActivationEmail(lang, portalUrl) {
    const es = lang === 'es';
    const manageBlock = portalUrl
        ? (es
            ? `<p style="margin:24px 0;"><a href="${portalUrl}" style="color:#10b981;font-weight:bold;">Gestionar suscripción</a> — cancela al menos 5 días hábiles antes de la renovación si no deseas continuar el monitoreo ($25/mes).</p>`
            : `<p style="margin:24px 0;"><a href="${portalUrl}" style="color:#10b981;font-weight:bold;">Manage subscription</a> — cancel at least 5 business days before renewal if you do not wish to continue monitoring ($25/mo).</p>`)
        : '';

    const subject = es ? 'PredictaCore — Protección Titán activada' : 'PredictaCore — Titan Protection Activated';
    const html = es ? `
<!DOCTYPE html><html><body style="background:#050505;color:#d1d5db;font-family:Inter,Arial,sans-serif;padding:32px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid rgba(16,185,129,0.35);padding:32px;border-radius:8px;">
    <h1 style="color:#fff;font-size:20px;letter-spacing:0.05em;">PROTECCIÓN TITÁN ACTIVADA</h1>
    <p>Tu pago de <strong>USD $349</strong> fue procesado. El motor forense ya analiza tu activo digital.</p>
    <p style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;">Recibirás el Reporte Titán completo en tu correo en los próximos minutos.</p>
    <p>El monitoreo PredictaCore (<strong>$25/mes</strong>) está <strong>activo</strong>. Suscripción en periodo inicial: <strong>primer cobro mensual en ~30 días</strong>. En tu estado de cuenta: <strong>PREDICTACORE</strong>.</p>
    ${manageBlock}
    <p style="font-size:11px;color:#71717a;">Ventas finales — sin reembolsos.</p>
  </div>
</body></html>` : `
<!DOCTYPE html><html><body style="background:#050505;color:#d1d5db;font-family:Inter,Arial,sans-serif;padding:32px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid rgba(16,185,129,0.35);padding:32px;border-radius:8px;">
    <h1 style="color:#fff;font-size:20px;letter-spacing:0.05em;">TITAN PROTECTION ACTIVATED</h1>
    <p>Your <strong>USD $349</strong> payment was processed successfully. Our forensic engine is analyzing your digital asset.</p>
    <p style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;">You will receive the full Titan Report in your email within the next few minutes.</p>
    <p>PredictaCore monitoring (<strong>$25/mo</strong>) is <strong>active</strong>. You are in the initial period: <strong>first monthly charge in ~30 days</strong>. Statement descriptor: <strong>PREDICTACORE</strong>.</p>
    ${manageBlock}
    <p style="font-size:11px;color:#71717a;">All sales final — no refunds.</p>
  </div>
</body></html>`;

    const textManage = portalUrl
        ? (es ? `\n\nGestionar suscripción: ${portalUrl}` : `\n\nManage subscription: ${portalUrl}`)
        : '';
    const text = es
        ? `PROTECCIÓN TITÁN ACTIVADA\n\nPago USD $349 confirmado. Reporte Titán en los próximos minutos.\nMonitoreo $25/mes activo; primer cobro mensual en ~30 días. PREDICTACORE en el estado de cuenta.${textManage}`
        : `TITAN PROTECTION ACTIVATED\n\nUSD $349 payment confirmed. Titan Report arriving in the next few minutes.\nMonitoring $25/mo active; first monthly charge in ~30 days. Statement: PREDICTACORE.${textManage}`;

    return { subject, html, text };
}

async function sendTitanActivationEmail(email, lang, customerId) {
    let portalUrl = null;
    try {
        const cid = customerId || await resolveStripeCustomerId(email);
        if (cid) portalUrl = await createCustomerPortalUrl(cid);
    } catch (err) {
        console.warn('>>> Email activación: portal no generado:', err.message);
    }

    const { subject, html, text } = buildTitanActivationEmail(lang, portalUrl);
    const { error } = await resend.emails.send({
        from: 'PredictaCore <reportes@predictacore.ai>',
        to: email,
        subject,
        html,
        text,
    });
    if (error) throw new Error(`Resend activation email: ${error.message}`);
    console.log(`>>> Email activación Titán enviado a ${email}`);
}

function titanInternalKey() {
    return process.env.TITAN_INTERNAL_KEY || '12345';
}

function requireTitanInternalKey(req, res, next) {
    const key = req.body?.key;
    if (!key || key !== titanInternalKey()) {
        return res.status(401).json({ error: 'Invalid access key' });
    }
    next();
}

function requirePlayground(req, res, next) {
    const key = req.headers['x-api-key'] || req.query.key;
    if (!process.env.API_KEY || key !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Playground requiere API_KEY válida' });
    }
    next();
}

async function resolveCheckoutMetadata(session) {
    const base = session.metadata || {};
    let dna = base.dna;
    let email = base.email || session.customer_email || session.customer_details?.email;
    let refCode = base.refCode || '';
    let lang = base.lang || 'en';

    const subId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if ((!dna || !email) && subId) {
        try {
            const sub = await stripe.subscriptions.retrieve(subId);
            dna = dna || sub.metadata?.dna;
            email = email || sub.metadata?.email;
            refCode = refCode || sub.metadata?.refCode || '';
            lang = lang || sub.metadata?.lang || 'en';
        } catch (subErr) {
            console.warn('>>> No se pudo leer metadata de suscripción:', subErr.message);
        }
    }

    return {
        dna,
        email: email ? String(email).trim().toLowerCase() : '',
        refCode,
        lang: lang === 'es' ? 'es' : 'en',
    };
}

async function fulfillPredictacoreCheckoutSession(rawSession, source = 'webhook') {
    const session = await expandCheckoutSession(stripe, rawSession);

    if (!isPredictacoreCheckoutSession(session)) {
        console.log(`>>> [${source}] checkout ignorado — no es producto ${BRAND}`);
        return { ok: false, skipped: 'not_predictacore' };
    }

    const paid = session.payment_status === 'paid' || session.status === 'complete';
    if (!paid) {
        return { ok: false, skipped: 'not_paid' };
    }

    const isNew = await claimWebhookEvent(`checkout_session:${session.id}`, 'checkout.session.fulfilled');
    if (!isNew) {
        console.log(`>>> [${source}] checkout ya procesado: ${session.id}`);
        return { ok: true, duplicate: true };
    }

    const { dna, email, refCode, lang } = await resolveCheckoutMetadata(session);
    if (!dna || !email) {
        console.warn(`>>> [${source}] checkout sin dna/email — session ${session.id}`);
        return { ok: false, skipped: 'missing_metadata' };
    }

    const customerId = typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;
    const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    let subscriptionStatus = 'active';
    if (subscriptionId) {
        try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            subscriptionStatus = sub.status || 'active';
        } catch (subErr) {
            console.warn('>>> No se pudo leer suscripción:', subErr.message);
        }
    }

    console.log(`>>> [PAGO $349 / ${source}] ${email}. Titán + suscripción (${subscriptionStatus})...`);

    await upsertCliente({
        email,
        urlSitio: dna,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        refCode,
        subscriptionStatus,
    });

    try {
        await sendTitanActivationEmail(email, lang, customerId);
    } catch (mailErr) {
        console.error('!!! Email activación Titán:', mailErr.message);
    }

    iniciarAuditoria(dna, email, 'TITAN');
    await registrarVentaComisiones(session, email, refCode);

    return { ok: true, started: true, email };
}

app.get('/webhook-stripe', (req, res) => {
    res.status(200).json({
        ok: true,
        endpoint: 'Stripe webhook (POST only)',
        message: 'This URL is for Stripe servers. Opening it in a browser uses GET and does not test delivery. Configure it in Stripe Dashboard → Webhooks.',
        events: ['checkout.session.completed', 'invoice.paid'],
    });
});

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
            await fulfillPredictacoreCheckoutSession(event.data.object, 'webhook');
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

app.post('/fulfill-checkout', async (req, res) => {
    try {
        const sessionId = req.body?.session_id || req.query?.session_id;
        if (!sessionId || !String(sessionId).startsWith('cs_')) {
            return res.status(400).json({ error: 'session_id required (cs_...)' });
        }

        const session = await stripe.checkout.sessions.retrieve(String(sessionId));
        const result = await fulfillPredictacoreCheckoutSession(session, 'success_page');
        res.json(result);
    } catch (error) {
        const stripeMsg = error?.raw?.message || error?.message;
        console.error('!!! fulfill-checkout:', stripeMsg || error);
        res.status(500).json({ error: stripeMsg || 'Fulfillment failed' });
    }
});

app.get('/health', async (req, res) => {
    const db = await healthCheck();
    res.status(db.ok ? 200 : 503).json({
        status: db.ok ? 'ok' : 'degraded',
        service: 'predictacore-titan',
        phase: '2',
        database: db,
        stripe_prices: !!(process.env.STRIPE_PRICE_TITAN && process.env.STRIPE_PRICE_SUBSCRIPTION),
        stripe: stripeKeyDiagnostics(),
        stripe_brand: BRAND,
        stripe_terms_url: TERMS_URL,
        stripe_statement_descriptor: process.env.STRIPE_STATEMENT_DESCRIPTOR || 'PREDICTACORE',
        playground: !!process.env.API_KEY,
        timestamp: new Date().toISOString(),
    });
});

app.get('/favicon.ico', (req, res) => {
    res.type('image/svg+xml');
    res.sendFile(path.join(__dirname, 'static', 'favicon.svg'));
});

app.use('/static', express.static(path.join(__dirname, 'static'), { maxAge: '7d' }));

app.get('/', (req, res) => res.send(getLandingHTML()));
app.get('/terms', (req, res) => res.send(getTerminosHTML()));
app.get('/privacy', (req, res) => res.send(getPrivacidadHTML()));
app.get('/terminos', (req, res) => res.redirect(301, '/terms'));
app.get('/privacidad', (req, res) => res.redirect(301, '/privacy'));

app.get('/legal', (req, res) => res.redirect(301, '/'));
app.get('/legal/regenoxy', (req, res) => res.redirect(301, '/'));
app.get('/legal/clinical-services', (req, res) => res.redirect(301, '/'));
app.get('/legal/servicios-clinicos', (req, res) => res.redirect(301, '/'));
app.get('/legal/payments', (req, res) => res.redirect(301, '/'));
app.get('/legal/pagos', (req, res) => res.redirect(301, '/'));
app.get('/legal/privacy', (req, res) => res.redirect(301, '/privacy'));
app.get('/legal/privacidad', (req, res) => res.redirect(301, '/privacy'));

app.get('/exito', (req, res) => {
    const lang = req.query.lang === 'es' ? 'es' : 'en';
    res.send(getSuccessHTML(lang));
});

app.get('/titan-interno', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.send(getTitanInternalHTML());
});

app.post('/titan-interno', requireTitanInternalKey, async (req, res) => {
    const { dna, email, assetType, platform, handle } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }

    const resolved = resolveAuditTarget({ assetType, dna, platform, handle });
    if (!resolved.ok) {
        return res.status(400).json({ error: resolved.error });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    console.log(`>>> [TITAN INTERNO / ${resolved.assetType}] ${normalizedEmail} — ${resolved.url}`);
    iniciarAuditoria(resolved.url, normalizedEmail, 'TITAN');

    const label = resolved.assetType === 'social'
        ? `${resolved.platform} profile`
        : 'website';

    res.json({
        status: 'started',
        mode: 'TITAN',
        assetType: resolved.assetType,
        target: resolved.url,
        message: `Titan ${label} audit started. Full PDF in ~10–20 min at ${normalizedEmail}.`,
    });
});

app.get('/playground', requirePlayground, (req, res) => {
    res.send(getPlaygroundHTML());
});

app.get('/playground/db', requirePlayground, async (req, res) => {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'BD no disponible' });

    try {
        const [clientes, reportes, ventas, jobs, recentJobs, recentWebhooks] = await Promise.all([
            pool.query('SELECT COUNT(*)::int AS n FROM clientes'),
            pool.query(`SELECT tipo, COUNT(*)::int AS n FROM reportes GROUP BY tipo`),
            pool.query('SELECT COUNT(*)::int AS n FROM ventas_comisiones'),
            pool.query(`SELECT estado, COUNT(*)::int AS n FROM jobs_auditoria GROUP BY estado`),
            pool.query(`
                SELECT job_id, email, modo, estado, error_msg, creado_en, completado_en,
                       (SELECT count(*)::int FROM jsonb_object_keys(progreso_json) k) AS secciones
                FROM jobs_auditoria
                ORDER BY creado_en DESC
                LIMIT 10
            `),
            pool.query(`
                SELECT stripe_event_id, tipo, procesado_en
                FROM webhook_eventos
                ORDER BY procesado_en DESC
                LIMIT 10
            `),
        ]);
        res.json({
            clientes: clientes.rows[0].n,
            reportes: reportes.rows,
            ventas: ventas.rows[0].n,
            jobs: jobs.rows,
            recent_jobs: recentJobs.rows,
            recent_webhooks: recentWebhooks.rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/portal-cliente', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email requerido' });

        const customerId = await resolveStripeCustomerId(email);
        if (!customerId) {
            return res.status(404).json({ error: 'No active subscription found for this email yet.' });
        }

        const url = await createCustomerPortalUrl(customerId);
        res.json({ url });
    } catch (error) {
        const stripeMsg = error?.raw?.message || error?.message;
        console.error('!!! Error portal Stripe:', stripeMsg || error);
        res.status(500).json({ error: stripeMsg || 'Could not open customer portal' });
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

        const keyDiag = stripeKeyDiagnostics();
        if (keyDiag.mode === 'missing' || keyDiag.mode === 'unknown') {
            return res.status(400).json({ error: keyDiag.hint });
        }

        const host = baseUrl(req);
        const validation = await validateCheckoutPrices(stripe);
        if (!validation.ok) {
            return res.status(400).json({ error: validation.errors.join(' ') });
        }

        const session = await stripe.checkout.sessions.create(
            buildCheckoutSessionParams({
                host,
                dna,
                email,
                refCode,
                lang,
                lineItems: validation.lineItems,
            })
        );

        res.json({ status: 'checkout', url: session.url });
    } catch (error) {
        const stripeMsg = error?.raw?.message || error?.message;
        console.error('!!! Error creando sesión de Stripe:', stripeMsg || error);
        res.status(500).json({
            error: stripeMsg || 'Payment gateway error',
        });
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
            const cerebroActivo = isSocialMediaUrl(targetUrl) ? cerebroSocial : cerebroWeb;
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
            subject = 'Your PredictaCore Lite Audit';
            filename = 'PREDICTACORE_LITE.pdf';
            textBody = 'Your PredictaCore Lite audit is attached.';
        } else if (modo === 'DELTA') {
            htmlBase = getHTMLDelta();
            subject = 'PredictaCore — Monthly Monitoring Report';
            filename = 'PREDICTACORE_MONITORING.pdf';
            textBody = 'Your monthly PredictaCore monitoring report is attached.';
        } else {
            htmlBase = getHTML();
            const social = isSocialMediaUrl(targetUrl);
            subject = social
                ? 'Your PredictaCore Titan Social Audit'
                : 'Your PredictaCore Titan Report';
            filename = social ? 'PREDICTACORE_TITAN_SOCIAL.pdf' : 'PREDICTACORE_TITAN.pdf';
            let portalUrl = null;
            try {
                const cid = await resolveStripeCustomerId(emailDestino);
                if (cid) portalUrl = await createCustomerPortalUrl(cid);
            } catch (_) { /* optional */ }
            textBody = portalUrl
                ? `Your PredictaCore Titan forensic audit is attached.\n\nManage subscription: ${portalUrl}`
                : 'Your PredictaCore Titan forensic audit is attached.';
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
            from: 'PredictaCore <reportes@predictacore.ai>',
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
