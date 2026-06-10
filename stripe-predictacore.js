/**
 * PredictaCore Stripe checkout — shared Regenoxy LLC account, isolated by metadata + price IDs.
 * Customer-facing copy and descriptors use PredictaCore only.
 */

const BRAND = 'predictacore';
const TERMS_URL = 'https://predictacore.ai/terms';
const PRIVACY_URL = 'https://predictacore.ai/privacy';
const STATEMENT_SUFFIX = () => (process.env.STRIPE_STATEMENT_DESCRIPTOR || 'PREDICTACORE').slice(0, 22);

const PRICE_TITAN = () => process.env.STRIPE_PRICE_TITAN || '';
const PRICE_SUB = () => process.env.STRIPE_PRICE_SUBSCRIPTION || '';

function predictacorePriceIds() {
    return [PRICE_TITAN(), PRICE_SUB()].filter(Boolean);
}

function checkoutMetadata({ dna, email, refCode, lang }) {
    return {
        product: BRAND,
        brand: BRAND,
        service: 'predictacore_titan',
        dna: dna || '',
        email: (email || '').trim().toLowerCase(),
        refCode: refCode || '',
        lang: lang === 'es' ? 'es' : 'en',
    };
}

function buildCheckoutLineItems() {
    const priceTitan = PRICE_TITAN();
    const priceSub = PRICE_SUB();

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
                product_data: {
                    name: 'PredictaCore Titan Report',
                    description: 'Full forensic website audit. USD $349 charged today.',
                    metadata: { brand: BRAND, product: BRAND },
                },
                unit_amount: 34900,
            },
            quantity: 1,
        },
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'PredictaCore Monthly Monitoring',
                    description: 'USD $25/month. Starts 30 days after purchase.',
                    metadata: { brand: BRAND, product: BRAND },
                },
                unit_amount: 2500,
                recurring: { interval: 'month' },
            },
            quantity: 1,
        },
    ];
}

function getCheckoutCustomText(lang = 'en') {
    const termsLink = `[Terms of Service](${TERMS_URL})`;
    const privacyLink = `[Privacy Policy](${PRIVACY_URL})`;
    const termsLinkEs = `[Términos](${TERMS_URL})`;
    const privacyLinkEs = `[Privacidad](${PRIVACY_URL})`;
    const descriptor = STATEMENT_SUFFIX();

    if (lang === 'es') {
        return {
            submit: {
                message: `$349 hoy (Reporte Titán). Monitoreo $25/mes desde el día 30. Al pagar aceptas ${termsLinkEs} y ${privacyLinkEs}. Estado de cuenta: ${descriptor}.`,
            },
        };
    }

    return {
        submit: {
            message: `$349 charged today (Titan Report). $25/month monitoring starts 30 days from purchase. By paying you accept our ${termsLink} and ${privacyLink}. Statement: ${descriptor}.`,
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

async function validateCheckoutPrices(stripe) {
    const titanId = PRICE_TITAN();
    const subId = PRICE_SUB();
    const mode = stripeKeyMode();

    if (!titanId || !subId) {
        return { ok: true, lineItems: buildCheckoutLineItems(), mode, usingEnvPrices: false };
    }

    try {
        const [titan, sub] = await Promise.all([
            stripe.prices.retrieve(titanId),
            stripe.prices.retrieve(subId),
        ]);

        const errors = [];
        if (!titan.active) errors.push('STRIPE_PRICE_TITAN is inactive in Stripe.');
        if (!sub.active) errors.push('STRIPE_PRICE_SUBSCRIPTION is inactive in Stripe.');
        if (!sub.recurring) errors.push('STRIPE_PRICE_SUBSCRIPTION must be a recurring (monthly) price.');
        if (titan.currency !== sub.currency) errors.push('Titan and subscription prices must use the same currency.');

        if (mode === 'test' && (titan.livemode || sub.livemode)) {
            errors.push('Stripe is in Test mode but your Price IDs are Live. Create Test prices and update Railway.');
        }
        if (mode === 'live' && (!titan.livemode || !sub.livemode)) {
            errors.push('Stripe is in Live mode but your Price IDs are Test. Use Live Price IDs in Railway.');
        }

        return {
            ok: errors.length === 0,
            errors,
            lineItems: [{ price: titanId, quantity: 1 }, { price: subId, quantity: 1 }],
            mode,
            usingEnvPrices: true,
            titanType: titan.type,
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
                usingEnvPrices: true,
            };
        }
        return { ok: false, errors: [msg], mode, usingEnvPrices: true };
    }
}

function titanCheckoutLineItems(lineItems) {
    const items = lineItems || buildCheckoutLineItems();
    return items.length ? [items[0]] : buildCheckoutLineItems().slice(0, 1);
}

async function createMonitoringSubscription(stripe, { customerId, metadata }) {
    const subPriceId = PRICE_SUB();
    if (!subPriceId) {
        throw new Error('STRIPE_PRICE_SUBSCRIPTION not configured');
    }
    return stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: subPriceId }],
        trial_period_days: 30,
        metadata: {
            ...metadata,
            service: 'predictacore_monitoring',
        },
    });
}

function buildCheckoutSessionParams({ host, dna, email, refCode, lineItems, lang }) {
    const meta = checkoutMetadata({ dna, email, refCode, lang });
    const locale = meta.lang === 'es' ? 'es' : 'en';

    return {
        payment_method_types: ['card'],
        customer_email: meta.email || email,
        customer_creation: 'always',
        mode: 'payment',
        line_items: titanCheckoutLineItems(lineItems),
        locale,
        custom_text: getCheckoutCustomText(meta.lang),
        success_url: `${host}/exito?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(meta.email || email)}&lang=${meta.lang}`,
        cancel_url: `${host}/`,
        metadata: meta,
    };
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
    if (session.line_items?.data?.length) return session;
    return stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price', 'subscription'],
    });
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
    TERMS_URL,
    PRIVACY_URL,
    STATEMENT_SUFFIX,
    normalizeStripeSecretKey,
    stripeKeyMode,
    stripeKeyDiagnostics,
    validateCheckoutPrices,
    predictacorePriceIds,
    checkoutMetadata,
    buildCheckoutSessionParams,
    createMonitoringSubscription,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    metadataIsPredictacore,
    isCheckoutSessionPaid,
    summarizeCheckoutSession,
};
