/**
 * Server-side bridge: Titan/V5 → predictacore-ads funnel_events.
 * Keeps ads dashboard first-party funnel in sync when Lite completes or Titan sells.
 */

const ADS_FUNNEL_PATH = '/ads/api/funnel/events';

function adsOrigin() {
    return (process.env.ADS_ORIGIN || 'https://predictacore-ads-production.up.railway.app').replace(/\/$/, '');
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
    const body = {
        clientSlug: 'predictacore',
        eventType: input.eventType,
        utmSource: input.utmSource || 'facebook',
        utmMedium: input.utmMedium || 'paid',
        utmCampaign: input.utmCampaign || input.refCode || undefined,
        refCode: input.refCode || undefined,
        pagePath: '/ads/lite',
        metadata: {
            source: 'titan-v5',
            email: input.email || undefined,
            job_id: input.jobId || undefined,
            url: input.urlSitio || undefined,
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
