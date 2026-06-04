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

function checkoutMetadata({ dna, email, refCode }) {
    return {
        product: BRAND,
        brand: BRAND,
        service: 'predictacore_titan',
        dna: dna || '',
        email: email || '',
        refCode: refCode || '',
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
                    description: 'USD $25/month. First charge in ~30 days after purchase.',
                    metadata: { brand: BRAND, product: BRAND },
                },
                unit_amount: 2500,
                recurring: { interval: 'month' },
            },
            quantity: 1,
        },
    ];
}

function getCheckoutCustomText() {
    const termsLink = `[PredictaCore Terms of Service](${TERMS_URL})`;
    const privacyLink = `[Privacy Policy](${PRIVACY_URL})`;
    const descriptor = STATEMENT_SUFFIX();

    return {
        submit: {
            message: `PredictaCore — USD $349 charged today (Titan Report). USD $25/mo monitoring starts in ~30 days. By paying you accept our ${termsLink} and ${privacyLink}. Statement: ${descriptor}. All sales final.`,
        },
    };
}

function stripeKeyMode() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    if (key.startsWith('sk_test_')) return 'test';
    if (key.startsWith('sk_live_')) return 'live';
    return 'unknown';
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
            return {
                ok: false,
                errors: [`Price ID not found in Stripe (${mode} key). Check STRIPE_PRICE_TITAN and STRIPE_PRICE_SUBSCRIPTION in Railway.`],
                mode,
                usingEnvPrices: true,
            };
        }
        return { ok: false, errors: [msg], mode, usingEnvPrices: true };
    }
}

function buildCheckoutSessionParams({ host, dna, email, refCode, lineItems }) {
    const meta = checkoutMetadata({ dna, email, refCode });
    const items = lineItems || buildCheckoutLineItems();

    return {
        payment_method_types: ['card'],
        customer_email: email,
        mode: 'subscription',
        line_items: items,
        locale: 'en',
        subscription_data: {
            trial_period_days: 30,
            metadata: meta,
        },
        custom_text: getCheckoutCustomText(),
        success_url: `${host}/exito?email=${encodeURIComponent(email)}&lang=en`,
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

async function expandCheckoutSession(stripe, session) {
    if (session.line_items?.data?.length) return session;
    return stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price'],
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
    stripeKeyMode,
    validateCheckoutPrices,
    predictacorePriceIds,
    buildCheckoutSessionParams,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    metadataIsPredictacore,
};
