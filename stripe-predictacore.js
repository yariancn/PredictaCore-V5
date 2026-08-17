/**
 * PredictaCore Stripe checkout — shared Regenoxy LLC account, isolated by metadata + price IDs.
 * Customer-facing copy and descriptors use PredictaCore only.
 */

const { getSupportEmail, TITAN_PRICE_USD, TITAN_PRICE_CENTS, MONITORING_PRICE_USD } = require('./brand');

const BRAND = 'predictacore';
const LEGAL_ENTITY = 'Regenoxy LLC';
const MONITORING_PRICE_CENTS = MONITORING_PRICE_USD * 100;
const TERMS_URL = 'https://predictacore.ai/terms';
const PRIVACY_URL = 'https://predictacore.ai/privacy';
const STATEMENT_SUFFIX = () => (process.env.STRIPE_STATEMENT_DESCRIPTOR || 'PREDICTACORE').slice(0, 22);

const PRICE_TITAN = () => process.env.STRIPE_PRICE_TITAN || '';
const PRICE_SUB = () => process.env.STRIPE_PRICE_SUBSCRIPTION || '';

function predictacorePriceIds() {
    return [PRICE_TITAN(), PRICE_SUB()].filter(Boolean);
}

function checkoutMetadata({ dna, email, refCode, lang, monitoring }) {
    return {
        product: BRAND,
        brand: BRAND,
        service: 'predictacore_titan',
        dna: dna || '',
        email: (email || '').trim().toLowerCase(),
        refCode: refCode || '',
        lang: lang === 'es' ? 'es' : 'en',
        monitoring: wantsMonitoring(monitoring) ? 'opt_in' : 'off',
    };
}

function wantsMonitoring(value) {
    if (value === true || value === 1) return true;
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'true' || raw === 'opt_in' || raw === '1' || raw === 'yes';
}

function titanPriceDataItem() {
    return {
        price_data: {
            currency: 'usd',
            product_data: {
                name: 'Predictacore Titan',
                description: `Titan Report. USD $${TITAN_PRICE_USD} one-time.`,
                metadata: { brand: BRAND, product: BRAND },
            },
            unit_amount: TITAN_PRICE_CENTS,
        },
        quantity: 1,
    };
}

function monitoringPriceDataItem() {
    return {
        price_data: {
            currency: 'usd',
            product_data: {
                name: 'PredictaCore Monthly Monitoring',
                description: `USD $${MONITORING_PRICE_USD}/month. Starts 30 days after purchase.`,
                metadata: { brand: BRAND, product: BRAND },
            },
            unit_amount: MONITORING_PRICE_CENTS,
            recurring: { interval: 'month' },
        },
        quantity: 1,
    };
}

function buildCheckoutLineItems() {
    // Titan is a one-time $39 payment. Monitoring is opt-in after metadata.monitoring === 'opt_in'.
    return [titanPriceDataItem()];
}

function getCheckoutCustomText(lang = 'en', { monitoring } = {}) {
    const termsLink = `[Terms of Service](${TERMS_URL})`;
    const privacyLink = `[Privacy Policy](${PRIVACY_URL})`;
    const termsLinkEs = `[Términos](${TERMS_URL})`;
    const privacyLinkEs = `[Privacidad](${PRIVACY_URL})`;
    const descriptor = STATEMENT_SUFFIX();
    const support = getSupportEmail();
    const optedIn = wantsMonitoring(monitoring);

    if (lang === 'es') {
        const extra = optedIn
            ? ` Monitoreo opcional $${MONITORING_PRICE_USD}/mes desde el día 30 (se renueva salvo cancelación; ${support} o portal).`
            : ` Solo Titán hoy — sin suscripción mensual.`;
        return {
            submit: {
                message: `$${TITAN_PRICE_USD} hoy (Reporte Titán).${extra} Al pagar aceptas ${termsLinkEs} y ${privacyLinkEs}. Estado de cuenta: ${descriptor}.`,
            },
        };
    }

    const extra = optedIn
        ? ` Optional monitoring $${MONITORING_PRICE_USD}/mo starts day 30 (renews unless cancelled; ${support} or portal).`
        : ` Titan only today — no monthly subscription.`;
    return {
        submit: {
            message: `$${TITAN_PRICE_USD} charged today (Titan Report).${extra} By paying you accept our ${termsLink} and ${privacyLink}. Statement: ${descriptor}.`,
        },
    };
}

function normalizeStripeSecretKey(raw) {
    if (raw == null || raw === '') return '';
    return String(raw).trim().replace(/^['"]|['"]$/g, '');
}

function stripeKeyDiagnostics() {
    const raw = process.env.STRIPE_SECRET_KEY;
    if (!normalizeStripeSecretKey(raw)) {
        return {
            mode: 'missing',
            prefix: null,
            restricted: false,
            hint: 'Set STRIPE_SECRET_KEY in Railway (Stripe Dashboard → Developers → API keys → Secret key).',
        };
    }

    const key = normalizeStripeSecretKey(raw);
    const prefix = key.slice(0, 8);

    if (key.startsWith('pk_')) {
        return {
            mode: 'unknown',
            prefix,
            restricted: false,
            hint: 'Publishable key (pk_) detected. Use sk_test_, rk_test_, sk_live_, or rk_live_, not pk_.',
        };
    }
    if (key.startsWith('rk_test_') || key.startsWith('sk_test_')) {
        return {
            mode: 'test',
            prefix: key.startsWith('rk_') ? 'rk_test_' : 'sk_test_',
            restricted: key.startsWith('rk_'),
            hint: null,
        };
    }
    if (key.startsWith('rk_live_') || key.startsWith('sk_live_')) {
        return {
            mode: 'live',
            prefix: key.startsWith('rk_') ? 'rk_live_' : 'sk_live_',
            restricted: key.startsWith('rk_'),
            hint: null,
        };
    }

    return {
        mode: 'unknown',
        prefix,
        restricted: false,
        hint: 'Key must start with sk_test_, rk_test_, sk_live_, or rk_live_. Check typos, spaces, or quotes in Railway.',
    };
}

function stripeKeyMode() {
    return stripeKeyDiagnostics().mode;
}

async function validateCheckoutPrices(stripe, { requireMonitoring } = {}) {
    const subId = PRICE_SUB();
    const mode = stripeKeyMode();
    const lineItems = buildCheckoutLineItems();

    if (!requireMonitoring) {
        return {
            ok: true,
            lineItems,
            mode,
            usingEnvPrices: false,
            titanChargedVia: 'price_data',
            expectedTitanCents: TITAN_PRICE_CENTS,
        };
    }

    if (!subId) {
        return {
            ok: false,
            errors: ['STRIPE_PRICE_SUBSCRIPTION is required when monthly monitoring is selected.'],
            lineItems,
            mode,
            usingEnvPrices: false,
        };
    }

    try {
        const sub = await stripe.prices.retrieve(subId);
        const errors = [];
        if (!sub.active) errors.push('STRIPE_PRICE_SUBSCRIPTION is inactive in Stripe.');
        if (!sub.recurring) errors.push('STRIPE_PRICE_SUBSCRIPTION must be a recurring (monthly) price.');
        if (sub.unit_amount !== MONITORING_PRICE_CENTS) {
            errors.push(`STRIPE_PRICE_SUBSCRIPTION should be USD $${MONITORING_PRICE_USD}/mo (${MONITORING_PRICE_CENTS} cents).`);
        }

        if (mode === 'test' && sub.livemode) {
            errors.push('Stripe is in Test mode but STRIPE_PRICE_SUBSCRIPTION is Live.');
        }
        if (mode === 'live' && !sub.livemode) {
            errors.push('Stripe is in Live mode but STRIPE_PRICE_SUBSCRIPTION is Test.');
        }

        return {
            ok: errors.length === 0,
            errors,
            lineItems,
            mode,
            usingEnvPrices: false,
            titanChargedVia: 'price_data',
            expectedTitanCents: TITAN_PRICE_CENTS,
            subRecurring: !!sub.recurring,
        };
    } catch (err) {
        const msg = err?.raw?.message || err?.message || 'Stripe price validation failed';
        if (/no such price/i.test(msg)) {
            const modeHint = mode === 'unknown' || mode === 'missing'
                ? 'Fix STRIPE_SECRET_KEY first (must be sk_test_ or sk_live_, no quotes).'
                : `Stripe is in ${mode} mode — use matching Test or Live Price IDs in Railway.`;
            return {
                ok: false,
                errors: [`Price ID not found. ${modeHint}`],
                mode,
                usingEnvPrices: false,
            };
        }
        return { ok: false, errors: [msg], mode, usingEnvPrices: false };
    }
}

function titanCheckoutLineItems(lineItems) {
    const items = lineItems || buildCheckoutLineItems();
    return items.length ? [items[0]] : buildCheckoutLineItems().slice(0, 1);
}

async function getCheckoutPaymentMethodId(stripe, session) {
    const piRef = session.payment_intent;
    const piId = typeof piRef === 'string' ? piRef : piRef?.id;
    if (!piId) return null;
    const pi = typeof piRef === 'object' && piRef?.payment_method
        ? piRef
        : await stripe.paymentIntents.retrieve(piId);
    const pm = pi.payment_method;
    return typeof pm === 'string' ? pm : pm?.id || null;
}

async function ensureCustomerDefaultPaymentMethod(stripe, customerId, paymentMethodId) {
    if (!customerId || !paymentMethodId) return;
    await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });
}

async function createMonitoringSubscription(stripe, { customerId, metadata, defaultPaymentMethodId }) {
    const subPriceId = PRICE_SUB();
    if (!subPriceId) {
        throw new Error('STRIPE_PRICE_SUBSCRIPTION not configured');
    }
    const params = {
        customer: customerId,
        items: [{ price: subPriceId }],
        trial_period_days: 30,
        metadata: {
            ...metadata,
            service: 'predictacore_monitoring',
        },
    };
    if (defaultPaymentMethodId) {
        params.default_payment_method = defaultPaymentMethodId;
    }
    return stripe.subscriptions.create(params);
}

function buildCheckoutSessionParams({ host, dna, email, refCode, lineItems, lang, cancelUrl, monitoring }) {
    const meta = checkoutMetadata({ dna, email, refCode, lang, monitoring });
    const locale = meta.lang === 'es' ? 'es' : 'en';
    const optedIn = wantsMonitoring(monitoring);

    const params = {
        payment_method_types: ['card'],
        customer_email: meta.email || email,
        customer_creation: 'always',
        mode: 'payment',
        line_items: titanCheckoutLineItems(lineItems),
        locale,
        custom_text: getCheckoutCustomText(meta.lang, { monitoring: optedIn }),
        success_url: `${host}/exito?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(meta.email || email)}&lang=${meta.lang}`,
        cancel_url: cancelUrl || `${host}/`,
        metadata: meta,
    };
    if (optedIn) {
        params.payment_intent_data = { setup_future_usage: 'off_session' };
    }
    return params;
}

function metadataIsPredictacore(metadata) {
    if (!metadata) return false;
    return metadata.product === BRAND
        || metadata.brand === BRAND
        || metadata.service === 'predictacore_titan';
}

function lineItemsMatchPredictacore(lineItems) {
    const ids = new Set(predictacorePriceIds());
    if (!ids.size || !lineItems?.length) return false;
    return lineItems.some((item) => {
        const priceId = item.price?.id || item.price;
        return priceId && ids.has(priceId);
    });
}

function isPredictacoreCheckoutSession(session) {
    if (metadataIsPredictacore(session.metadata)) return true;
    return lineItemsMatchPredictacore(session.line_items?.data || session.display_items);
}

function isCheckoutSessionPaid(session) {
    if (session.payment_status === 'paid') return true;
    if (session.payment_status === 'no_payment_required' && session.status === 'complete') return true;
    return false;
}

function summarizeCheckoutSession(session) {
    return {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        livemode: session.livemode,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email || session.customer_details?.email || null,
        is_paid: isCheckoutSessionPaid(session),
        is_predictacore: isPredictacoreCheckoutSession(session),
        metadata: session.metadata || {},
    };
}

async function expandCheckoutSession(stripe, session) {
    const expand = [];
    if (!session.line_items?.data?.length) {
        expand.push('line_items.data.price', 'subscription');
    }
    if (!session.payment_intent || typeof session.payment_intent === 'string') {
        expand.push('payment_intent');
    }
    if (!expand.length) return session;
    return stripe.checkout.sessions.retrieve(session.id, { expand });
}

function isMonitoringInvoiceAmount(invoice) {
    const paid = invoice.amount_paid ?? 0;
    return paid === MONITORING_PRICE_CENTS;
}

function isPredictacoreInvoice(invoice, subscriptionMeta) {
    if (metadataIsPredictacore(invoice.metadata)) return true;
    if (metadataIsPredictacore(invoice.subscription_details?.metadata)) return true;
    if (metadataIsPredictacore(subscriptionMeta)) return true;

    const subPrice = PRICE_SUB();
    if (!subPrice || !invoice.lines?.data?.length) return false;

    return invoice.lines.data.some((line) => {
        const priceId = line.price?.id || line.plan?.id;
        return priceId === subPrice;
    });
}

module.exports = {
    BRAND,
    LEGAL_ENTITY,
    TITAN_PRICE_USD,
    TITAN_PRICE_CENTS,
    MONITORING_PRICE_USD,
    MONITORING_PRICE_CENTS,
    TERMS_URL,
    PRIVACY_URL,
    STATEMENT_SUFFIX,
    normalizeStripeSecretKey,
    stripeKeyMode,
    stripeKeyDiagnostics,
    validateCheckoutPrices,
    predictacorePriceIds,
    checkoutMetadata,
    wantsMonitoring,
    buildCheckoutSessionParams,
    createMonitoringSubscription,
    getCheckoutPaymentMethodId,
    ensureCustomerDefaultPaymentMethod,
    isMonitoringInvoiceAmount,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    metadataIsPredictacore,
    isCheckoutSessionPaid,
    summarizeCheckoutSession,
};
