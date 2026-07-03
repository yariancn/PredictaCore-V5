/**
 * Server-side bridge: Titan/V5 → predictacore-ads funnel_events.
 * Keeps ads dashboard first-party funnel in sync when Lite completes or Titan sells.
 */

const ADS_FUNNEL_PATH = '/ads/api/funnel/events';
const TEST_REF = 'internal_test';

function adsOrigin() {
    return (process.env.ADS_ORIGIN || 'https://predictacore-ads-production.up.railway.app').replace(/\/$/, '');
}

function isTestRef(refCode) {
    return String(refCode || '').trim().toLowerCase() === TEST_REF;
}

/**
 * @param {object} input
 * @param {'lite_scan_completed'|'purchase'|'upsell_accepted'|'cta_click'} input.eventType
 * @param {string} [input.email]
 * @param {string} [input.jobId]
 * @param {string} [input.urlSitio]
 * @param {string} [input.refCode]
 * @param {string} [input.utmSource]
 * @param {string} [input.utmMedium]
 * @param {string} [input.utmCampaign]
 * @param {Record<string, unknown>} [input.metadata]
 */
async function notifyAdsFunnelEvent(input) {
    const url = `${adsOrigin()}${ADS_FUNNEL_PATH}`;
    const test = isTestRef(input.refCode) || input.metadata?.is_test === true;
    const body = {
        clientSlug: 'predictacore',
        eventType: input.eventType,
        // Never invent paid attribution for internal QA scans
        utmSource: test ? 'internal' : (input.utmSource || undefined),
        utmMedium: test ? 'test' : (input.utmMedium || undefined),
        utmCampaign: input.utmCampaign || input.refCode || undefined,
        refCode: test ? TEST_REF : (input.refCode || undefined),
        pagePath: '/ads/lite',
        metadata: {
            source: 'titan-v5',
            email: input.email || undefined,
            job_id: input.jobId || undefined,
            url: input.urlSitio || undefined,
            ...(test ? { is_test: true } : {}),
            ...(input.metadata || {}),
        },
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.warn('[ads-funnel-bridge]', input.eventType, res.status, text.slice(0, 200));
        }
    } catch (err) {
        console.warn('[ads-funnel-bridge]', input.eventType, err?.message || err);
    }
}

async function notifyLiteScanCompleted({ email, urlSitio, jobId, refCode }) {
    return notifyAdsFunnelEvent({
        eventType: 'lite_scan_completed',
        email,
        urlSitio,
        jobId,
        refCode,
    });
}

async function notifyTitanPurchase({ email, urlSitio, jobId, stripeSessionId }) {
    await notifyAdsFunnelEvent({
        eventType: 'upsell_accepted',
        email,
        urlSitio,
        jobId,
        metadata: { stripe_session_id: stripeSessionId, action: 'titan_purchase' },
    });
    return notifyAdsFunnelEvent({
        eventType: 'purchase',
        email,
        urlSitio,
        jobId,
        metadata: { stripe_session_id: stripeSessionId, product: 'titan', amount_usd: 199 },
    });
}

module.exports = {
    notifyAdsFunnelEvent,
    notifyLiteScanCompleted,
    notifyTitanPurchase,
};
