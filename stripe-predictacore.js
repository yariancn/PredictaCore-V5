/**
 * PredictaCore — configuración Stripe compartida con otras líneas Regenoxy LLC.
 * Misma cuenta Stripe: filtrar webhooks por metadata/price IDs para no mezclar productos.
 */

const BRAND = 'predictacore';
const TERMS_URL = 'https://predictacore.ai/terminos';
const PRIVACY_URL = 'https://predictacore.ai/privacidad';

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
        email: email || '',
        refCode: refCode || '',
        lang: lang === 'es' ? 'es' : 'en',
    };
}

function subscriptionMetadata({ dna, email, refCode, lang }) {
    return checkoutMetadata({ dna, email, refCode, lang });
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
                    name: 'PredictaCore — Reporte Titán',
                    description: 'Auditoría forense completa (USD $349, cobro hoy). Marca PredictaCore · Regenoxy LLC.',
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
                    name: 'PredictaCore — Monitoreo mensual',
                    description: 'Reportes de seguimiento USD $25/mes. Primer cobro en ~30 días tras la compra inicial.',
                    metadata: { brand: BRAND, product: BRAND },
                },
                unit_amount: 2500,
                recurring: { interval: 'month' },
            },
            quantity: 1,
        },
    ];
}

function getCheckoutCustomText(lang) {
    const es = lang === 'es';
    const termsLink = `[Términos de PredictaCore](${TERMS_URL})`;
    const privacyLink = `[Privacidad](${PRIVACY_URL})`;
    const termsLinkEn = `[PredictaCore Terms of Service](${TERMS_URL})`;
    const privacyLinkEn = `[Privacy Policy](${PRIVACY_URL})`;

    return {
        terms_of_service_acceptance: {
            message: es
                ? `Acepto los ${termsLink} y ${privacyLink} (solo productos PredictaCore). Entiendo: cobro hoy USD $349 por el Reporte Titán; suscripción de monitoreo USD $25/mes activa ahora con primer cobro mensual en ~30 días; ventas finales sin reembolso; cancelación con al menos 5 días hábiles antes del siguiente ciclo.`
                : `I agree to the ${termsLinkEn} and ${privacyLinkEn} (PredictaCore products only). I understand: USD $349 Titan Report charged today; USD $25/mo monitoring subscription active now with first monthly charge in ~30 days; all sales final; cancel at least 5 business days before renewal.`,
        },
        submit: {
            message: es
                ? 'Regenoxy LLC · PredictaCore — No es un periodo de prueba: el Reporte Titán (USD $349) se cobra hoy. El monitoreo (USD $25/mes) inicia su facturación en aproximadamente 30 días.'
                : 'Regenoxy LLC · PredictaCore — Not a free trial: Titan Report (USD $349) is charged today. Monitoring (USD $25/mo) billing starts in approximately 30 days.',
        },
    };
}

function buildCheckoutSessionParams({ host, dna, email, refCode, lang }) {
    const locale = lang === 'es' ? 'es' : 'en';
    const meta = checkoutMetadata({ dna, email, refCode, lang });

    return {
        payment_method_types: ['card'],
        customer_email: email,
        mode: 'subscription',
        line_items: buildCheckoutLineItems(),
        locale,
        subscription_data: {
            trial_period_days: 30,
            metadata: subscriptionMetadata({ dna, email, refCode, lang }),
        },
        consent_collection: {
            terms_of_service: 'required',
        },
        custom_text: getCheckoutCustomText(locale),
        success_url: `${host}/exito?email=${encodeURIComponent(email)}&lang=${locale}`,
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
    predictacorePriceIds,
    buildCheckoutSessionParams,
    isPredictacoreCheckoutSession,
    isPredictacoreInvoice,
    expandCheckoutSession,
    metadataIsPredictacore,
};
