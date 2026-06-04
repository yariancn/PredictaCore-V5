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
        terms_of_service_acceptance: {
            message: `I agree to the ${termsLink} and ${privacyLink}. I authorize PredictaCore to charge USD $349 today for the Titan Report and USD $25/month for monitoring (first monthly charge in ~30 days). I understand charges appear as ${descriptor} on my statement. All sales final; cancel monitoring at least 5 business days before renewal.`,
        },
        submit: {
            message: 'PredictaCore — Titan Report (USD $349) is charged today. Monthly monitoring (USD $25) starts billing in ~30 days. Not a free trial.',
        },
    };
}

function buildCheckoutSessionParams({ host, dna, email, refCode }) {
    const meta = checkoutMetadata({ dna, email, refCode });

    return {
        payment_method_types: ['card'],
        customer_email: email,
        mode: 'subscription',
        line_items: buildCheckoutLineItems(),
        locale: 'en',
        payment_intent_data: {
            statement_descriptor_suffix: STATEMENT_SUFFIX(),
        },
        subscription_data: {
            trial_period_days: 30,
            metadata: meta,
            description: 'PredictaCore Titan + monthly monitoring',
        },
        consent_collection: {
            terms_of_service: 'required',
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
    predictacorePriceIds,
    buildCheckoutSessionParams,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    metadataIsPredictacore,
};
