// server.js - PredictaCore (Lite + Titán + Seguimiento mensual)
const path = require('path');
const express = require('express');
const cerebroWeb = require('./cerebro');
const cerebroSocial = require('./cerebro_social');
const { PROMPTS_LITE } = require('./cerebro_lite');
const {
    PROMPTS_DELTA,
    buildPromptsDelta,
    extractInitialSummary,
    formatScoreDiffBlock,
    buildStructuralDiff,
    buildDeterministicDeltaSections,
    DELTA_SECTION_ORDER,
    DELTA_LLM_SECTIONS,
} = require('./cerebro_delta');
const { buildReportLanguagePrompt } = require('./idioma');
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
const { marked } = require('marked');
const {
    getPool,
    initDatabase,
    claimWebhookEvent,
    releaseWebhookClaim,
    fulfillmentLooksComplete,
    createJob,
    updateJobProgress,
    completeJob,
    failJob,
    getJobProgress,
    getJobsByEmail,
    markStaleRunningJobs,
    healthCheck,
} = require('./db/init');
const {
    normalizeUrl,
    upsertCliente,
    getClienteByEmail,
    getLatestTitanReport,
    listClientesConTitan,
    registrarComisionRecurrente,
    saveReporte,
} = require('./db/comercial');

const { isSocialMediaUrl, resolveAuditTarget } = require('./audit-target');
const { buildTitanUpgradeUrl, getEmailBrandHeader, getPdfCoverMetricsHtml, getResendFrom, getPdfClosingHtml, getPdfHeaderDisclaimerHtml, getSubscriptionCancellationPlain } = require('./brand');
const {
    getLocaleFromDossier,
    getLanguageLockInstruction,
    getPdfUiStrings,
    getReportEmailCopy,
    getVisionPromptLabels,
    postProcessSection,
} = require('./report-format');
const { stageUsesVision } = require('./forensics');
const { validateSection, stripFinancialClaims, SKIP_MONEY_CHECK } = require('./validator');

const {
    BRAND,
    TERMS_URL,
    TITAN_PRICE_USD,
    TITAN_PRICE_CENTS,
    MONITORING_PRICE_USD,
    buildCheckoutSessionParams,
    createMonitoringSubscription,
    checkoutMetadata,
    normalizeStripeSecretKey,
    stripeKeyDiagnostics,
    validateCheckoutPrices,
    predictacorePriceIds,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    isCheckoutSessionPaid,
    summarizeCheckoutSession,
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
    const brandHeader = getEmailBrandHeader(lang);
    const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const portalLine = portalUrl
        ? (es ? `Portal de facturación: ${portalUrl}` : `Billing portal: ${portalUrl}`)
        : '';
    const manageBlock = `<p style="margin:20px 0 0 0;font-size:11px;color:#71717a;line-height:1.55;border-top:1px solid rgba(113,113,122,0.35);padding-top:16px;">${cancelPlain}${portalLine ? `<br/>${portalLine}` : ''}</p>`;

    const subject = es ? 'PredictaCore — Protección Titán activada' : 'PredictaCore — Titan Protection Activated';
    const html = es ? `
<!DOCTYPE html><html><body style="background:#050505;color:#d1d5db;font-family:Inter,Arial,sans-serif;padding:32px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid rgba(16,185,129,0.35);padding:32px;border-radius:8px;background:#0a0a0a;">
    ${brandHeader}
    <h1 style="color:#fff;font-size:18px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;text-align:center;">PROTECCIÓN TITÁN ACTIVADA</h1>
    <p>Tu pago de <strong>USD $${TITAN_PRICE_USD}</strong> fue procesado. El motor forense ya analiza tu activo digital.</p>
    <p style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;">Recibirás el Reporte Titán completo en tu correo en los próximos minutos (hasta 60 min).</p>
    <p>Monitoreo PredictaCore (<strong>$${MONITORING_PRICE_USD}/mes</strong>) activo. Primer cobro el <strong>día 30</strong>. Estado de cuenta: <strong>PREDICTACORE</strong>.</p>
    ${manageBlock}
    <p style="font-size:11px;color:#71717a;">Ventas finales — sin reembolsos.</p>
  </div>
</body></html>` : `
<!DOCTYPE html><html><body style="background:#050505;color:#d1d5db;font-family:Inter,Arial,sans-serif;padding:32px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid rgba(16,185,129,0.35);padding:32px;border-radius:8px;background:#0a0a0a;">
    ${brandHeader}
    <h1 style="color:#fff;font-size:18px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;text-align:center;">TITAN PROTECTION ACTIVATED</h1>
    <p>Your <strong>USD $${TITAN_PRICE_USD}</strong> payment was processed successfully. Our forensic engine is analyzing your digital asset.</p>
    <p style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;">You will receive the full Titan Report in your email within the next few minutes (up to 60 minutes).</p>
    <p>PredictaCore monitoring (<strong>$${MONITORING_PRICE_USD}/mo</strong>) is active. First charge on <strong>day 30</strong>. Statement: <strong>PREDICTACORE</strong>.</p>
    ${manageBlock}
    <p style="font-size:11px;color:#71717a;">All sales final — no refunds.</p>
  </div>
</body></html>`;

    const textManage = portalUrl
        ? (es ? `\n\n${cancelPlain}\nPortal: ${portalUrl}` : `\n\n${cancelPlain}\nPortal: ${portalUrl}`)
        : `\n\n${cancelPlain}`;
    const text = es
        ? `PROTECCIÓN TITÁN ACTIVADA\n\nPago USD $${TITAN_PRICE_USD} confirmado. Reporte Titán en los próximos minutos.\nMonitoreo $${MONITORING_PRICE_USD}/mes; primer cobro el día 30. PREDICTACORE en el estado de cuenta.${textManage}`
        : `TITAN PROTECTION ACTIVATED\n\nUSD $${TITAN_PRICE_USD} payment confirmed. Titan Report arriving in the next few minutes.\nMonitoring $${MONITORING_PRICE_USD}/mo; first charge on day 30. Statement: PREDICTACORE.${textManage}`;

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
        from: getResendFrom(),
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
    const key = req.body?.key || req.query?.key;
    if (!key || key !== titanInternalKey()) {
        return res.status(401).json({ error: 'Invalid access key' });
    }
    next();
}

function buildJobDeliveryHint(job) {
    if (!job) return 'No Titan job found for this email.';
    if (job.estado === 'failed') {
        return `Titan failed: ${job.error_msg || 'unknown error'}. Retry from Playground or Titan Lab.`;
    }
    if (job.estado === 'running') {
        const mins = job.creado_en ? Math.round((Date.now() - new Date(job.creado_en).getTime()) / 60000) : 0;
        if (job.secciones >= 11) return `Titan almost done (${job.secciones}/11 sections, ${mins} min) — email should arrive shortly.`;
        if (mins > 60) return `Titan stuck (${job.secciones}/11 sections after ${mins} min) — likely interrupted by deploy. Retry the audit.`;
        return `Titan in progress (${job.secciones}/11 sections, ~${mins} min elapsed). PDF takes 10–25 min.`;
    }
    if (job.estado === 'completed') return 'Titan completed — check inbox and spam. If missing, retry from Playground.';
    return null;
}

async function getJobStatusByEmail(email) {
    const jobs = await getJobsByEmail(email, 5);
    const titanJobs = jobs.filter((j) => j.modo === 'TITAN');
    const last = titanJobs[0] || null;
    return {
        email: String(email).trim().toLowerCase(),
        recent_jobs: jobs,
        last_titan: last,
        hint: buildJobDeliveryHint(last),
    };
}

function persistJobMeta(jobId, progress, meta) {
    return updateJobProgress(jobId, { ...progress, __meta__: meta });
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
        return { ok: false, skipped: 'not_predictacore', session: summarizeCheckoutSession(session) };
    }

    if (!isCheckoutSessionPaid(session)) {
        return {
            ok: false,
            skipped: 'not_paid',
            session: summarizeCheckoutSession(session),
        };
    }

    const { dna, email, refCode, lang } = await resolveCheckoutMetadata(session);
    if (!dna || !email) {
        console.warn(`>>> [${source}] checkout sin dna/email — session ${session.id}`);
        return { ok: false, skipped: 'missing_metadata' };
    }

    const claimId = `checkout_session:${session.id}`;
    const isNew = await claimWebhookEvent(claimId, 'checkout.session.fulfilled');
    if (!isNew) {
        const complete = await fulfillmentLooksComplete(email);
        if (complete) {
            console.log(`>>> [${source}] checkout ya procesado: ${session.id}`);
            return { ok: true, duplicate: true, email };
        }
        console.warn(`>>> [${source}] fulfillment incompleto — reintentando: ${session.id}`);
    }

    let customerId = typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;
    let subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId && customerId) {
        try {
            const meta = checkoutMetadata({
                dna,
                email,
                refCode,
                lang,
            });
            const sub = await createMonitoringSubscription(stripe, {
                customerId,
                metadata: meta,
            });
            subscriptionId = sub.id;
            console.log(`>>> [${source}] Suscripción monitoreo creada post-pago: ${subscriptionId}`);
        } catch (subCreateErr) {
            console.error('!!! No se pudo crear suscripción de monitoreo:', subCreateErr.message);
        }
    }

    let subscriptionStatus = 'active';
    if (subscriptionId) {
        try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            subscriptionStatus = sub.status || 'active';
        } catch (subErr) {
            console.warn('>>> No se pudo leer suscripción:', subErr.message);
        }
    }

    try {
        console.log(`>>> [PAGO $${TITAN_PRICE_USD} / ${source}] ${email}. Titán + suscripción (${subscriptionStatus})...`);

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

        return { ok: true, started: true, email, recovered: !isNew };
    } catch (err) {
        if (isNew) await releaseWebhookClaim(claimId);
        throw err;
    }
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

    const montoTotal = Math.round((session?.amount_total ?? TITAN_PRICE_CENTS)) / 100;
    const comision1 = Math.round(montoTotal * 0.30 * 100) / 100;
    const comision2 = Math.round(montoTotal * 0.10 * 100) / 100;
    const comision3 = Math.round(montoTotal * 0.05 * 100) / 100;

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
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (id_venta_stripe) DO NOTHING
                `, [session.id, email, montoTotal, nivel1_id, comision1, nivel2_id, comision2, nivel3_id, comision3]);
                return;
            }
        }

        await pool.query(`
            INSERT INTO ventas_comisiones (id_venta_stripe, cliente_email, monto_total)
            VALUES ($1, $2, $3)
            ON CONFLICT (id_venta_stripe) DO NOTHING
        `, [session.id, email, montoTotal]);
    } catch (dbError) {
        console.error('!!! Error registrando comisiones en la BD:', dbError);
    }
}

app.use(express.json({ limit: '10mb' }));

const ADS_ORIGIN = (process.env.ADS_ORIGIN || 'https://predictacore-ads-production.up.railway.app').replace(/\/$/, '');

// predictacore.ai/ads/* → servicio Next.js Predictacore Ads (Railway)
if (ADS_ORIGIN) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    app.use(
        createProxyMiddleware({
            target: ADS_ORIGIN,
            changeOrigin: true,
            pathFilter: (pathname) => pathname === '/ads' || pathname.startsWith('/ads/'),
            on: {
                proxyReq(proxyReq) {
                    proxyReq.setHeader('x-forwarded-host', 'predictacore.ai');
                    proxyReq.setHeader('x-forwarded-proto', 'https');
                },
            },
        }),
    );
}

app.get('/checkout-status', async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId || !String(sessionId).startsWith('cs_')) {
            return res.status(400).json({ error: 'session_id required (cs_...)' });
        }

        const session = await expandCheckoutSession(stripe, await stripe.checkout.sessions.retrieve(String(sessionId)));
        const summary = summarizeCheckoutSession(session);
        const pool = getPool();
        let fulfillmentClaimed = false;
        let recentJobs = [];
        let reportes = [];
        let cliente = null;
        const email = summary.customer_email || summary.metadata?.email;

        if (pool) {
            const claimed = await pool.query(
                'SELECT 1 FROM webhook_eventos WHERE stripe_event_id = $1 LIMIT 1',
                [`checkout_session:${session.id}`]
            );
            fulfillmentClaimed = claimed.rows.length > 0;

            if (email) {
                const [jobsRes, repsRes, cliRes] = await Promise.all([
                    pool.query(`
                        SELECT job_id, modo, estado, error_msg, creado_en, completado_en,
                               (SELECT count(*)::int FROM jsonb_object_keys(progreso_json) k) AS secciones
                        FROM jobs_auditoria
                        WHERE lower(email) = lower($1)
                        ORDER BY creado_en DESC
                        LIMIT 5
                    `, [email]),
                    pool.query(`
                        SELECT r.tipo, r.url_sitio, r.creado_en
                        FROM reportes r
                        JOIN clientes c ON c.id = r.cliente_id
                        WHERE lower(c.email) = lower($1)
                        ORDER BY r.creado_en DESC
                        LIMIT 3
                    `, [email]),
                    pool.query(
                        'SELECT email, url_sitio, subscription_status, creado_en FROM clientes WHERE lower(email) = lower($1) LIMIT 1',
                        [email]
                    ),
                ]);
                recentJobs = jobsRes.rows;
                reportes = repsRes.rows;
                cliente = cliRes.rows[0] || null;
            }
        }

        res.json({
            ...summary,
            fulfillment_claimed: fulfillmentClaimed,
            stripe_key: stripeKeyDiagnostics(),
            predictacore_price_ids: predictacorePriceIds(),
            delivery: {
                cliente,
                recent_jobs: recentJobs,
                titan_jobs: recentJobs.filter((j) => j.modo === 'TITAN'),
                reportes,
                hint: (() => {
                    const titanJobs = recentJobs.filter((j) => j.modo === 'TITAN');
                    if (!titanJobs.length && fulfillmentClaimed) {
                        return 'Payment claimed but no Titan job — use Playground → replay-delivery to resend email and start Titan.';
                    }
                    if (!titanJobs.length) {
                        return 'No Titan job yet — use Playground replay or POST /playground/replay-delivery';
                    }
                    const last = titanJobs[0];
                    if (last.estado === 'failed') return `Titan failed: ${last.error_msg || 'unknown'}`;
                    if (last.estado === 'running') return `Titan in progress (${last.secciones || 0} sections done)`;
                    if (last.estado === 'completed') return 'Titan completed — check spam if no PDF';
                    return null;
                })(),
            },
        });
    } catch (error) {
        const stripeMsg = error?.raw?.message || error?.message;
        console.error('!!! checkout-status:', stripeMsg || error);
        res.status(500).json({ error: stripeMsg || 'Could not read checkout session' });
    }
});

app.post('/fulfill-checkout', async (req, res) => {
    try {
        const sessionId = req.body?.session_id || req.query?.session_id;
        if (!sessionId || !String(sessionId).startsWith('cs_')) {
            return res.status(400).json({ error: 'session_id required (cs_...)' });
        }

        const session = await expandCheckoutSession(stripe, await stripe.checkout.sessions.retrieve(String(sessionId)));
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
    let priceCheck = null;
    if (normalizeStripeSecretKey(process.env.STRIPE_SECRET_KEY)
        && process.env.STRIPE_PRICE_TITAN
        && process.env.STRIPE_PRICE_SUBSCRIPTION) {
        try {
            priceCheck = await validateCheckoutPrices(stripe);
        } catch (err) {
            priceCheck = { ok: false, errors: [err?.message || 'Price validation failed'] };
        }
    }
    res.status(db.ok ? 200 : 503).json({
        status: db.ok ? 'ok' : 'degraded',
        service: 'predictacore-titan',
        phase: '2',
        database: db,
        stripe_prices: !!(process.env.STRIPE_PRICE_TITAN && process.env.STRIPE_PRICE_SUBSCRIPTION),
        stripe_price_validation: priceCheck
            ? {
                ok: priceCheck.ok,
                errors: priceCheck.errors || [],
                expected_titan_usd: TITAN_PRICE_USD,
                expected_monitoring_usd: MONITORING_PRICE_USD,
            }
            : null,
        stripe: {
            ...stripeKeyDiagnostics(),
            restricted_key_warning: stripeKeyDiagnostics().restricted
                ? 'Prefer sk_test_/sk_live_ secret key over rk_ restricted key for Checkout subscriptions.'
                : null,
        },
        stripe_brand: BRAND,
        stripe_terms_url: TERMS_URL,
        stripe_statement_descriptor: process.env.STRIPE_STATEMENT_DESCRIPTOR || 'PREDICTACORE',
        playground: !!process.env.API_KEY,
        resend: !!process.env.RESEND_API_KEY,
        resend_from: getResendFrom(),
        timestamp: new Date().toISOString(),
    });
});

app.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon');
    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(__dirname, 'static', 'favicon.ico'));
});

app.get('/apple-touch-icon.png', (req, res) => {
    res.type('image/png');
    res.sendFile(path.join(__dirname, 'static', 'apple-touch-icon.png'));
});

app.use('/static', express.static(path.join(__dirname, 'static'), { maxAge: '7d' }));

app.get('/', (req, res) => {
    const sessionId = req.query.session_id;
    if (sessionId && String(sessionId).startsWith('cs_')) {
        const qs = new URLSearchParams(req.query);
        return res.redirect(302, `/exito?${qs.toString()}`);
    }
    res.send(getLandingHTML());
});
app.get('/terms', (req, res) => res.send(getTerminosHTML()));
app.get('/privacy', (req, res) => res.send(getPrivacidadHTML()));
app.get('/terminos', (req, res) => res.redirect(301, '/terms'));
app.get('/privacidad', (req, res) => res.redirect(301, '/privacy'));

app.get('/legal', (req, res) => res.redirect(301, '/'));
app.get('/legal/regenoxy', (req, res) => res.redirect(301, '/'));
app.get('/static/oxyhyperbaric-legal-hub.html', (req, res) => res.redirect(301, '/'));
app.get('/legal/clinical-services', (req, res) => res.redirect(301, '/'));
app.get('/legal/servicios-clinicos', (req, res) => res.redirect(301, '/'));
app.get('/legal/payments', (req, res) => res.redirect(301, '/'));
app.get('/legal/pagos', (req, res) => res.redirect(301, '/'));
app.get('/legal/privacy', (req, res) => res.redirect(301, '/privacy'));
app.get('/legal/privacidad', (req, res) => res.redirect(301, '/privacy'));

app.get('/exito', async (req, res) => {
    const lang = req.query.lang === 'es' ? 'es' : 'en';
    const sessionId = req.query.session_id;
    let fulfillStatus = 'processing';

    if (!sessionId || !String(sessionId).startsWith('cs_')) {
        fulfillStatus = 'missing_session';
    } else {
        try {
            const session = await expandCheckoutSession(stripe, await stripe.checkout.sessions.retrieve(String(sessionId)));
            const result = await fulfillPredictacoreCheckoutSession(session, 'success_page');
            if (result.started) fulfillStatus = 'ok';
            else if (result.duplicate) fulfillStatus = 'dup';
            else if (result.ok) fulfillStatus = 'ok';
            else if (result.skipped === 'not_paid') fulfillStatus = 'not_paid';
            else if (result.skipped === 'not_predictacore') fulfillStatus = 'not_predictacore';
            else fulfillStatus = 'fail';
        } catch (err) {
            const stripeMsg = err?.raw?.message || err?.message;
            console.error('!!! /exito fulfill:', stripeMsg || err);
            fulfillStatus = 'fail';
        }
    }

    res.send(getSuccessHTML(lang, fulfillStatus));
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
    let started;
    try {
        started = await iniciarAuditoria(resolved.url, normalizedEmail, 'TITAN');
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Could not start audit' });
    }

    const label = resolved.assetType === 'social'
        ? `${resolved.platform} profile`
        : 'website';

    res.json({
        status: 'started',
        job_id: started.jobId,
        mode: 'TITAN',
        assetType: resolved.assetType,
        target: resolved.url,
        message: `Titan ${label} audit started. PDF may take up to 60 minutes at ${normalizedEmail}.`,
    });
});

app.post('/titan-interno/status', requireTitanInternalKey, async (req, res) => {
    const email = req.body?.email || req.query?.email;
    if (!email) return res.status(400).json({ error: 'Email required' });
    try {
        const status = await getJobStatusByEmail(email);
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/delta-interno', requireTitanInternalKey, async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const cliente = await getClienteByEmail(normalizedEmail);
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado en BD' });
    }
    const titan = await getLatestTitanReport(cliente.id);
    if (!titan) {
        return res.status(400).json({ error: 'Sin reporte Titán previo en BD' });
    }
    const urlSitio = cliente.url_sitio;
    if (!urlSitio) {
        return res.status(400).json({ error: 'Cliente sin URL registrada' });
    }

    console.log(`>>> [DELTA INTERNO] ${normalizedEmail} — ${urlSitio}`);
    try {
        const started = await iniciarAuditoria(urlSitio, normalizedEmail, 'DELTA');
        res.json({
            status: 'started',
            job_id: started.jobId,
            mode: 'DELTA',
            target: started.targetUrl,
            message: `Seguimiento DELTA iniciado. PDF en ~5-15 min a ${normalizedEmail}.`,
        });
    } catch (err) {
        res.status(400).json({ error: err.message || 'No se pudo iniciar el seguimiento' });
    }
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

app.get('/playground/job-status', requirePlayground, async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'email query param required' });
    try {
        const status = await getJobStatusByEmail(email);
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/playground/titan', requirePlayground, async (req, res) => {
    const { dna, email } = req.body;
    if (!dna || !email) {
        return res.status(400).json({ error: 'URL y email requeridos' });
    }

    console.log(`>>> [PLAYGROUND] Titán sin cobro para ${email} — ${dna}`);
    try {
        const started = await iniciarAuditoria(dna, email, 'TITAN');
        res.json({
            status: 'started',
            job_id: started.jobId,
            mode: 'TITAN',
            target: started.targetUrl,
            message: 'Auditoría Titán completa iniciada. El PDF llegará por email en ~10-25 min.',
        });
    } catch (err) {
        res.status(400).json({ error: err.message || 'No se pudo iniciar la auditoría' });
    }
});

app.get('/playground/titan-clients', requirePlayground, async (req, res) => {
    try {
        const clientes = await listClientesConTitan(50);
        res.json({ count: clientes.length, clientes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/playground/delta', requirePlayground, async (req, res) => {
    const { email, cliente_id } = req.body || {};
    let resolvedEmail = email ? String(email).trim().toLowerCase() : '';
    let urlSitio = '';

    try {
        if (cliente_id) {
            const pool = getPool();
            if (!pool) return res.status(503).json({ error: 'BD no disponible' });
            const row = await pool.query(
                `SELECT c.email, c.url_sitio,
                        (SELECT id FROM reportes WHERE cliente_id = c.id AND tipo = 'titan' LIMIT 1) AS tiene_titan
                 FROM clientes c WHERE c.id = $1`,
                [cliente_id]
            );
            if (!row.rows[0]) return res.status(404).json({ error: 'Cliente no encontrado' });
            if (!row.rows[0].tiene_titan) {
                return res.status(400).json({ error: 'Este cliente no tiene reporte Titán en BD' });
            }
            resolvedEmail = row.rows[0].email;
            urlSitio = row.rows[0].url_sitio;
        } else if (resolvedEmail) {
            const cliente = await getClienteByEmail(resolvedEmail);
            if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
            const titan = await getLatestTitanReport(cliente.id);
            if (!titan) return res.status(400).json({ error: 'Sin reporte Titán previo en BD' });
            urlSitio = cliente.url_sitio;
        } else {
            return res.status(400).json({ error: 'email o cliente_id requerido' });
        }

        if (!urlSitio) return res.status(400).json({ error: 'Cliente sin URL registrada' });

        console.log(`>>> [PLAYGROUND] Seguimiento DELTA sin cobro para ${resolvedEmail} — ${urlSitio}`);
        const started = await iniciarAuditoria(urlSitio, resolvedEmail, 'DELTA');
        res.json({
            status: 'started',
            job_id: started.jobId,
            mode: 'DELTA',
            email: resolvedEmail,
            target: started.targetUrl,
            message: 'Seguimiento mensual DELTA iniciado. PDF comprimido (~2-3 hojas) por email en ~5-10 min.',
        });
    } catch (err) {
        res.status(400).json({ error: err.message || 'No se pudo iniciar el seguimiento' });
    }
});

app.post('/playground/replay-delivery', requirePlayground, async (req, res) => {
    try {
        const sessionId = req.body?.session_id;
        if (!sessionId || !String(sessionId).startsWith('cs_')) {
            return res.status(400).json({ error: 'session_id required (cs_...)' });
        }

        const session = await expandCheckoutSession(stripe, await stripe.checkout.sessions.retrieve(String(sessionId)));
        if (!isCheckoutSessionPaid(session)) {
            return res.status(400).json({ error: 'Session not paid', session: summarizeCheckoutSession(session) });
        }

        const { dna, email, lang } = await resolveCheckoutMetadata(session);
        if (!dna || !email) {
            return res.status(400).json({ error: 'Missing dna/email in session metadata' });
        }

        const customerId = typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id;

        let activationSent = false;
        let activationError = null;
        try {
            await sendTitanActivationEmail(email, lang, customerId);
            activationSent = true;
        } catch (mailErr) {
            activationError = mailErr.message;
            console.error('!!! replay activation email:', mailErr.message);
        }

        iniciarAuditoria(dna, email, 'TITAN');

        res.json({
            status: 'replayed',
            email,
            dna,
            activation_sent: activationSent,
            activation_error: activationError,
            message: 'Activation email resent (if Resend OK) and new Titan job started.',
        });
    } catch (error) {
        const stripeMsg = error?.raw?.message || error?.message;
        console.error('!!! replay-delivery:', stripeMsg || error);
        res.status(500).json({ error: stripeMsg || 'Replay failed' });
    }
});

app.post('/playground/preview-email', requirePlayground, async (req, res) => {
    try {
        const { email, type = 'all', lang = 'en', dna = 'https://example.com' } = req.body || {};
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: 'Valid email required' });
        }

        const allowed = ['activation', 'titan', 'delta', 'lite', 'all'];
        const kind = String(type || 'all').toLowerCase();
        if (!allowed.includes(kind)) {
            return res.status(400).json({ error: `type must be one of: ${allowed.join(', ')}` });
        }

        if (!process.env.RESEND_API_KEY) {
            return res.status(503).json({ error: 'RESEND_API_KEY not configured' });
        }

        const langCode = lang === 'es' ? 'es' : 'en';
        const reportLocale = { code: langCode === 'es' ? 'es-MX' : 'en-US' };
        const previewPrefix = '[PREVIEW] ';
        const previewNote = langCode === 'es'
            ? '[Vista previa — sin PDF adjunto, sin generar reporte]'
            : '[Preview — no PDF attached, report not generated]';

        let portalUrl = null;
        try {
            const cid = await resolveStripeCustomerId(normalizedEmail);
            if (cid) portalUrl = await createCustomerPortalUrl(cid);
        } catch (_) { /* optional */ }

        const targetUrl = normalizeUrl(dna) || 'https://example.com';
        const types = kind === 'all' ? ['activation', 'titan', 'delta', 'lite'] : [kind];
        const sent = [];

        for (const t of types) {
            let payload;
            if (t === 'activation') {
                payload = buildTitanActivationEmail(langCode, portalUrl);
            } else if (t === 'titan') {
                const mail = getReportEmailCopy('TITAN', reportLocale, { portalUrl, targetUrl });
                payload = {
                    subject: mail.subject,
                    text: `${mail.text}\n\n${previewNote}`,
                    html: mail.html ? getEmailBrandHeader(langCode) + mail.html : null,
                };
            } else if (t === 'delta') {
                const mail = getReportEmailCopy('DELTA', reportLocale, { portalUrl, targetUrl });
                payload = {
                    subject: mail.subject,
                    text: `${mail.text}\n\n${previewNote}`,
                    html: mail.html ? getEmailBrandHeader(langCode) + mail.html : null,
                };
            } else if (t === 'lite') {
                const titanUrl = buildTitanUpgradeUrl({ email: normalizedEmail, dna: targetUrl, lang: langCode });
                const mail = getReportEmailCopy('LITE', reportLocale, { titanUrl, targetUrl });
                payload = {
                    subject: mail.subject,
                    text: `${mail.text}\n\n${previewNote}`,
                    html: mail.html ? getEmailBrandHeader(langCode) + mail.html : null,
                };
            }

            const { error } = await resend.emails.send({
                from: getResendFrom(),
                to: normalizedEmail,
                subject: previewPrefix + payload.subject,
                text: payload.text,
                html: payload.html || undefined,
            });
            if (error) throw new Error(`${t}: ${error.message}`);
            sent.push(t);
        }

        res.json({
            ok: true,
            email: normalizedEmail,
            sent,
            lang: langCode,
            portal_included: !!portalUrl,
            note: 'Preview emails sent without PDF attachments or report generation.',
        });
    } catch (err) {
        console.error('!!! preview-email:', err.message);
        res.status(500).json({ error: err.message || 'Could not send preview email' });
    }
});

app.post('/start-lite', async (req, res) => {
    const { dna, email } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const targetUrl = normalizeUrl(dna);
    if (!targetUrl || !normalizedEmail) {
        return res.status(400).json({ error: 'URL and email required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    try {
        const started = await iniciarAuditoria(dna, normalizedEmail, 'LITE');
        res.json({ status: 'started', job_id: started.jobId });
    } catch (err) {
        console.error('!!! /start-lite:', err?.message || err);
        res.status(400).json({ error: err.message || 'Could not start scan' });
    }
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

        const validation = await validateCheckoutPrices(stripe);
        if (!validation.ok) {
            return res.status(400).json({ error: validation.errors.join(' ') });
        }

        const session = await stripe.checkout.sessions.create(
            buildCheckoutSessionParams({
                host: publicBaseUrl(),
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
    if (!targetUrl) {
        throw new Error('Invalid or missing URL');
    }
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        throw new Error('Invalid email address');
    }

    const jobId = `${modo}-${Date.now()}`;

    jobsMemoria[jobId] = {
        status: 'running',
        progress: {},
        email: normalizedEmail,
        modo,
        dossier: null,
        initialSummary: null,
    };

    if (modo === 'DELTA') {
        const cliente = await getClienteByEmail(normalizedEmail);
        const titan = await getLatestTitanReport(cliente?.id);
        jobsMemoria[jobId].initialSummary = extractInitialSummary(titan?.secciones_json);
        jobsMemoria[jobId].prevDossier = titan?.dossier_scrape || '';
    }

    await createJob(jobId, normalizedEmail, targetUrl, modo);

    console.log(`>>> [SISTEMA] Iniciando Reporte ${modo} para: ${targetUrl} (job ${jobId})`);
    ejecutarAuditoriaFondo(targetUrl, jobId, modo).catch(async (e) => {
        console.error('!!! ERROR:', e);
        await failJob(jobId, e.message);
    });

    return { jobId, targetUrl, email: normalizedEmail };
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, modo) {
    try {
        const datosTarget = await captureAndScrape(targetUrl, { modo });
        let dossierTexto = datosTarget.texto;
        jobsMemoria[jobId].reportLocale = datosTarget.reportLocale || getLocaleFromDossier(dossierTexto);
        if (modo === 'DELTA' && jobsMemoria[jobId].prevDossier) {
            const det = buildDeterministicDeltaSections(
                jobsMemoria[jobId].prevDossier,
                datosTarget.texto,
                jobsMemoria[jobId].reportLocale
            );
            jobsMemoria[jobId].structuralDiff = det.diff;
            dossierTexto += formatScoreDiffBlock(jobsMemoria[jobId].prevDossier, datosTarget.texto);
            dossierTexto += det.diff.block;
            Object.assign(jobsMemoria[jobId].progress, {
                SCORECARD: det.SCORECARD,
                SCORECARD_IS_HTML: true,
                RESUMEN: det.RESUMEN,
                IMPLEMENTADAS: det.IMPLEMENTADAS,
                NUEVAS: det.NUEVAS,
            });
        }
        jobsMemoria[jobId].dossier = dossierTexto;
        jobsMemoria[jobId].captures = {
            desktopBase64: datosTarget.desktopBase64,
            mobileBase64: datosTarget.mobileBase64,
            loadTimeSec: datosTarget.loadTimeSec,
            seoScore: datosTarget.seoScore,
            aiScore: datosTarget.aiScore,
            assetType: datosTarget.assetType,
        };

        await persistJobMeta(jobId, jobsMemoria[jobId].progress, {
            dossier: dossierTexto,
            reportLocale: jobsMemoria[jobId].reportLocale,
            captures: jobsMemoria[jobId].captures,
            targetUrl,
        });

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({
            credentials: credenciales,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();

        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

        let promptsAUsar;
        let regla;
        const inicial = jobsMemoria[jobId].initialSummary || '';
        const reportLocale = jobsMemoria[jobId].reportLocale || getLocaleFromDossier(dossierTexto);
        const idiomaPrompt = buildReportLanguagePrompt(reportLocale);
        const languageLock = getLanguageLockInstruction(reportLocale);

        if (modo === 'DELTA') {
            const isSocial = isSocialMediaUrl(targetUrl);
            promptsAUsar = buildPromptsDelta(isSocial, reportLocale);
            regla = `REGLA: Seguimiento mensual — ${isSocial ? 'perfil social' : 'sitio web'}. Usa CAMBIOS_VERIFICADOS; no inventes cambios.`;
        } else if (modo === 'LITE') {
            promptsAUsar = PROMPTS_LITE;
            regla = '';
        } else {
            const cerebroActivo = isSocialMediaUrl(targetUrl) ? cerebroSocial : cerebroWeb;
            promptsAUsar = cerebroActivo.PROMPTS;
            regla = cerebroActivo.REGLA_NUCLEAR;
        }

        const etapas = modo === 'DELTA'
            ? [...DELTA_LLM_SECTIONS]
            : Object.keys(promptsAUsar);

        for (const etapaId of etapas) {
            if (modo === 'DELTA' && !DELTA_LLM_SECTIONS.has(etapaId)) continue;

            let promptFinal;
            if (modo === 'DELTA') {
                promptFinal = etapaId === 'ACCIONES_NUEVAS'
                    ? promptsAUsar[etapaId](dossierTexto, inicial, jobsMemoria[jobId].progress.NUEVAS || '')
                    : promptsAUsar[etapaId](dossierTexto, inicial);
            } else {
                promptFinal = promptsAUsar[etapaId](dossierTexto);
            }

            const parts = [
                { text: FIREWALL_IA },
                { text: idiomaPrompt },
                { text: languageLock },
                { text: regla },
                { text: `CONTEXTO:\n${dossierTexto}` },
                { text: promptFinal },
            ];

            if (stageUsesVision(modo, etapaId) && datosTarget.desktopBase64) {
                const visionLabels = getVisionPromptLabels(reportLocale);
                parts.push({ text: visionLabels.desktop });
                parts.push({ inlineData: { mimeType: 'image/jpeg', data: datosTarget.desktopBase64 } });
                if (datosTarget.mobileBase64) {
                    parts.push({ text: visionLabels.mobile });
                    parts.push({ inlineData: { mimeType: 'image/jpeg', data: datosTarget.mobileBase64 } });
                }
            }

            let sectionText = '';
            let retries = 0;
            const maxRetries = 2;

            while (retries <= maxRetries) {
                const attemptParts = retries === 0
                    ? parts
                    : [...parts, { text: `REINTENTO ${retries}: Corrige el output anterior.` }];

                const payload = {
                    contents: [{ role: 'user', parts: attemptParts }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: modo === 'DELTA'
                            ? (etapaId === 'ACCIONES_NUEVAS' ? 6144 : 4096)
                            : 8192,
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
                if (!vertexData.candidates) break;

                sectionText = SKIP_MONEY_CHECK.has(etapaId)
                    ? vertexData.candidates[0].content.parts[0].text
                    : stripFinancialClaims(vertexData.candidates[0].content.parts[0].text);
                const validation = validateSection(etapaId, sectionText, dossierTexto, reportLocale, {
                    modo,
                    nuevasSection: jobsMemoria[jobId].progress.NUEVAS,
                });
                if (validation.ok || retries >= maxRetries) {
                    if (!validation.ok && retries >= maxRetries) {
                        console.warn(`>>> [VALIDATOR] ${etapaId} con issues: ${validation.issues.join('; ')}`);
                    }
                    break;
                }
                parts.push({ text: validation.retrySuffix });
                retries += 1;
            }

            if (sectionText) {
                sectionText = postProcessSection(etapaId, sectionText, reportLocale, dossierTexto, {
                    modo,
                    nuevasSection: jobsMemoria[jobId].progress.NUEVAS,
                });
                jobsMemoria[jobId].progress[etapaId] = sectionText;
                await persistJobMeta(jobId, jobsMemoria[jobId].progress, {
                    dossier: dossierTexto,
                    reportLocale: jobsMemoria[jobId].reportLocale,
                    captures: jobsMemoria[jobId].captures,
                    targetUrl,
                });
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
        const memJob = jobsMemoria[jobId];
        const job = memJob || {
            progress: jobDb?.progress || {},
            email: jobDb?.email || emailDestino,
            modo,
            dossier: jobDb?.meta?.dossier || '',
            reportLocale: jobDb?.meta?.reportLocale,
            captures: jobDb?.meta?.captures || {},
        };

        if (!memJob && jobDb?.meta) {
            jobsMemoria[jobId] = {
                status: 'running',
                progress: jobDb.progress,
                email: jobDb.email,
                modo: jobDb.modo,
                dossier: jobDb.meta.dossier,
                reportLocale: jobDb.meta.reportLocale,
                captures: jobDb.meta.captures || {},
            };
        }

        const captures = job.captures || jobsMemoria[jobId]?.captures || jobDb?.meta?.captures || {};
        const dossier = jobsMemoria[jobId]?.dossier || jobDb?.meta?.dossier || '';
        const reportLocale = jobsMemoria[jobId]?.reportLocale || jobDb?.meta?.reportLocale || getLocaleFromDossier(dossier);
        const langCode = reportLocale.code.startsWith('es') ? 'es' : 'en';
        const pdfUi = getPdfUiStrings(reportLocale);

        let htmlBase;
        let subject;
        let filename;
        let textBody;
        let emailHtml = null;
        let liteTitanUrl = null;

        if (modo === 'LITE') {
            htmlBase = getHTMLLite();
            liteTitanUrl = buildTitanUpgradeUrl({ email: emailDestino, dna: targetUrl, lang: langCode });
            const mail = getReportEmailCopy('LITE', reportLocale, { titanUrl: liteTitanUrl, targetUrl });
            subject = mail.subject;
            filename = mail.filename;
            textBody = mail.text;
            emailHtml = mail.html ? getEmailBrandHeader(langCode) + mail.html : null;
        } else if (modo === 'DELTA') {
            htmlBase = getHTMLDelta();
            let portalUrl = null;
            try {
                const cid = await resolveStripeCustomerId(emailDestino);
                if (cid) portalUrl = await createCustomerPortalUrl(cid);
            } catch (_) { /* optional */ }
            const mail = getReportEmailCopy('DELTA', reportLocale, { portalUrl, targetUrl });
            subject = mail.subject;
            filename = mail.filename;
            textBody = mail.text;
            emailHtml = mail.html ? getEmailBrandHeader(langCode) + mail.html : null;
        } else {
            htmlBase = getHTML();
            const social = isSocialMediaUrl(targetUrl);
            let portalUrl = null;
            try {
                const cid = await resolveStripeCustomerId(emailDestino);
                if (cid) portalUrl = await createCustomerPortalUrl(cid);
            } catch (_) { /* optional */ }
            const mail = getReportEmailCopy('TITAN', reportLocale, { portalUrl, social, targetUrl });
            subject = mail.subject;
            filename = mail.filename;
            textBody = mail.text;
            emailHtml = mail.html ? getEmailBrandHeader(langCode) + mail.html : null;
        }

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
        await page.setContent(htmlBase, { waitUntil: 'load', timeout: 90000 });

        const metricsHtml = getPdfCoverMetricsHtml({
            loadTimeSec: captures.loadTimeSec,
            seoScore: captures.seoScore,
            aiScore: captures.aiScore,
            assetType: captures.assetType,
            lang: langCode,
        });

        const progressForPdf = {};
        const progressHtml = {};
        const deltaKeys = modo === 'DELTA'
            ? DELTA_SECTION_ORDER.filter((k) => job.progress?.[k])
            : null;
        const pdfKeys = deltaKeys || Object.keys(job.progress || {});
        for (const key of pdfKeys) {
            const value = job.progress[key];
            if (!value || key === '__meta__' || key === 'SCORECARD_IS_HTML') continue;
            if (modo === 'DELTA' && key === 'SCORECARD' && job.progress.SCORECARD_IS_HTML) {
                progressHtml[key] = value;
                continue;
            }
            progressForPdf[key] = postProcessSection(key, value, reportLocale, dossier, {
                modo,
                nuevasSection: job.progress?.NUEVAS,
            });
            progressHtml[key] = marked.parse(progressForPdf[key]);
        }

        const closingHtml = (modo === 'TITAN' || modo === 'DELTA') ? getPdfClosingHtml(langCode, modo) : '';
        const headerDisclaimerHtml = (modo === 'TITAN' || modo === 'DELTA') ? getPdfHeaderDisclaimerHtml(langCode) : '';

        await page.evaluate((sectionsHtml, dominio, titanUpgradeUrl, metricsBlock, desktopB64, mobileB64, ui, dateLocale, htmlLang, closingBlock, headerDisclaimerBlock) => {
            if (htmlLang) document.documentElement.lang = htmlLang;
            const reporte = document.getElementById('reporte');
            const dEl = document.getElementById('pdf-domain');
            if (dEl && dominio) dEl.innerText = dominio.replace(/^https?:\/\//, '');
            else if (dEl && ui.assetDefault) dEl.innerText = ui.assetDefault;

            const disclaimerEl = document.getElementById('pdf-header-disclaimer');
            if (disclaimerEl && headerDisclaimerBlock) disclaimerEl.innerHTML = headerDisclaimerBlock;

            const tagEl = document.getElementById('pdf-cover-tag');
            if (tagEl && ui.coverTag) tagEl.innerText = ui.coverTag;
            const titleEl = document.getElementById('pdf-cover-title');
            if (titleEl && titanUpgradeUrl && ui.liteTitle) titleEl.innerText = ui.liteTitle;
            else if (titleEl && ui.coverTitle) titleEl.innerText = ui.coverTitle;
            const brandTagline = document.querySelector('.pc-tagline');
            if (brandTagline && ui.brandTagline) brandTagline.innerText = ui.brandTagline;
            const dateEl = document.getElementById('pdf-date');
            if (dateEl) {
                dateEl.innerText = new Date().toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
            }

            const metricsEl = document.getElementById('pdf-metrics');
            if (metricsEl && metricsBlock) metricsEl.innerHTML = metricsBlock;

            const evidenceTargets = [
                document.getElementById('pdf-evidence-page'),
                document.getElementById('evidence-area'),
            ].filter(Boolean);

            if (desktopB64 && evidenceTargets.length) {
                const block = document.createElement('div');
                block.className = 'forensic-evidence';
                block.innerHTML = '<h3>' + (ui.evidenceTitle || 'Evidence') + '</h3><div class="forensic-shots">'
                    + '<figure><img src="data:image/jpeg;base64,' + desktopB64 + '" alt="Desktop"/><figcaption>' + (ui.desktop || 'Desktop') + '</figcaption></figure>'
                    + (mobileB64 ? '<figure><img src="data:image/jpeg;base64,' + mobileB64 + '" alt="Mobile"/><figcaption>' + (ui.mobile || 'Mobile') + '</figcaption></figure>' : '')
                    + '</div>';
                evidenceTargets.forEach((el) => el.appendChild(block.cloneNode(true)));
            }

            for (const key in sectionsHtml) {
                const div = document.createElement('div');
                div.className = 'report-section markdown-content';
                div.innerHTML = sectionsHtml[key];
                reporte.appendChild(div);
            }

            document.querySelectorAll('.report-section.markdown-content').forEach(function(section) {
                section.querySelectorAll('ol').forEach(function(ol) {
                    ol.style.listStyleType = 'decimal';
                    ol.style.paddingLeft = '2rem';
                    ol.style.marginLeft = '0.15rem';
                    ol.style.listStylePosition = 'outside';
                });
                section.querySelectorAll('ul').forEach(function(ul) {
                    ul.style.paddingLeft = '1.75rem';
                    ul.style.marginLeft = '0.15rem';
                    ul.style.listStylePosition = 'outside';
                });
            });

            const closingEl = document.getElementById('pdf-closing');
            if (closingEl && closingBlock) closingEl.innerHTML = closingBlock;

            if (titanUpgradeUrl) {
                const cta = document.createElement('div');
                cta.className = 'lite-titan-cta';
                cta.innerHTML = '<h3>' + (ui.liteCtaTitle || 'Titan') + '</h3>'
                    + '<p>' + (ui.liteCtaBody || '') + '</p>'
                    + '<p><strong>' + titanUpgradeUrl + '</strong></p>';
                reporte.appendChild(cta);
            }
        }, progressHtml, targetUrl, liteTitanUrl, metricsHtml, captures.desktopBase64, captures.mobileBase64, pdfUi, langCode === 'es' ? 'es-MX' : 'en-US', langCode, closingHtml, headerDisclaimerHtml);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, timeout: 120000 });
        await browser.close();

        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured — cannot send email');
        }

        const mailPayload = {
            from: getResendFrom(),
            to: emailDestino,
            subject,
            text: textBody,
            attachments: [{ filename, content: pdfBuffer }],
        };
        if (emailHtml) mailPayload.html = emailHtml;

        const { data, error } = await resend.emails.send(mailPayload);

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
    await markStaleRunningJobs(75);

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
