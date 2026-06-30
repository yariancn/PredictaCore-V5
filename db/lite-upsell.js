const { getPool } = require('./init');

async function emailHasTitanPurchase(email) {
    const pool = getPool();
    if (!pool || !email) return false;
    const normalized = String(email).trim().toLowerCase();
    const result = await pool.query(
        `SELECT 1 FROM ventas_comisiones WHERE lower(cliente_email) = $1
         UNION
         SELECT 1 FROM jobs_auditoria
           WHERE lower(email) = $1 AND modo = 'TITAN' AND estado IN ('running', 'completed')
         LIMIT 1`,
        [normalized]
    );
    return result.rows.length > 0;
}

async function registerLiteFollowup({ email, urlSitio, lang, jobId, leaks, metrics }) {
    const pool = getPool();
    if (!pool || !email) return null;

    const normalized = String(email).trim().toLowerCase();
    if (await emailHasTitanPurchase(normalized)) return null;

    const result = await pool.query(
        `INSERT INTO lite_upsell_followups
            (email, url_sitio, lang, job_id, leaks_json, metrics_json, lite_sent_at, next_weekly_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, NOW(), NOW() + INTERVAL '7 days')
         ON CONFLICT (email, url_sitio) DO UPDATE SET
            job_id = EXCLUDED.job_id,
            leaks_json = EXCLUDED.leaks_json,
            metrics_json = EXCLUDED.metrics_json,
            lang = EXCLUDED.lang,
            lite_sent_at = NOW(),
            day1_sent_at = NULL,
            last_weekly_sent_at = NULL,
            next_weekly_at = NOW() + INTERVAL '7 days',
            titan_acquired = FALSE,
            cancelled = FALSE
         RETURNING id`,
        [
            normalized,
            urlSitio,
            lang === 'es' ? 'es' : 'en',
            jobId || null,
            JSON.stringify(leaks || []),
            JSON.stringify(metrics || {}),
        ]
    );
    return result.rows[0]?.id || null;
}

async function markTitanAcquiredForEmail(email) {
    const pool = getPool();
    if (!pool || !email) return;
    const normalized = String(email).trim().toLowerCase();
    await pool.query(
        `UPDATE lite_upsell_followups
         SET titan_acquired = TRUE, cancelled = TRUE
         WHERE lower(email) = $1 AND NOT titan_acquired`,
        [normalized]
    );
}

async function getDueDay1Followups(limit = 25) {
    const pool = getPool();
    if (!pool) return [];
    const result = await pool.query(
        `SELECT id, email, url_sitio, lang, job_id, leaks_json, metrics_json, lite_sent_at
         FROM lite_upsell_followups
         WHERE NOT titan_acquired AND NOT cancelled
           AND lite_sent_at IS NOT NULL
           AND day1_sent_at IS NULL
           AND lite_sent_at <= NOW() - INTERVAL '20 hours'
         ORDER BY lite_sent_at ASC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
}

async function getDueWeeklyFollowups(limit = 25) {
    const pool = getPool();
    if (!pool) return [];
    const result = await pool.query(
        `SELECT id, email, url_sitio, lang, job_id, leaks_json, metrics_json,
                lite_sent_at, last_weekly_sent_at, next_weekly_at
         FROM lite_upsell_followups
         WHERE NOT titan_acquired AND NOT cancelled
           AND day1_sent_at IS NOT NULL
           AND next_weekly_at IS NOT NULL
           AND next_weekly_at <= NOW()
         ORDER BY next_weekly_at ASC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
}

async function markDay1Sent(id) {
    const pool = getPool();
    if (!pool) return;
    await pool.query(
        `UPDATE lite_upsell_followups SET day1_sent_at = NOW() WHERE id = $1`,
        [id]
    );
}

async function markWeeklySent(id) {
    const pool = getPool();
    if (!pool) return;
    await pool.query(
        `UPDATE lite_upsell_followups
         SET last_weekly_sent_at = NOW(), next_weekly_at = NOW() + INTERVAL '7 days'
         WHERE id = $1`,
        [id]
    );
}

async function getLiteUpsellContext(email, urlSitio) {
    const pool = getPool();
    if (!pool || !email) return null;

    const normalized = String(email).trim().toLowerCase();
    const url = String(urlSitio || '').trim();

    const result = await pool.query(
        `SELECT leaks_json, metrics_json, lang, job_id, lite_sent_at, titan_acquired, url_sitio
         FROM lite_upsell_followups
         WHERE lower(email) = $1
           AND ($2::text = '' OR url_sitio = $2)
         ORDER BY lite_sent_at DESC NULLS LAST
         LIMIT 1`,
        [normalized, url]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
        leaks: Array.isArray(row.leaks_json) ? row.leaks_json : [],
        metrics: row.metrics_json && typeof row.metrics_json === 'object' ? row.metrics_json : {},
        lang: row.lang === 'es' ? 'es' : 'en',
        jobId: row.job_id || null,
        targetUrl: row.url_sitio || url,
        liteSentAt: row.lite_sent_at,
        titanAcquired: Boolean(row.titan_acquired),
    };
}

module.exports = {
    emailHasTitanPurchase,
    registerLiteFollowup,
    markTitanAcquiredForEmail,
    getDueDay1Followups,
    getDueWeeklyFollowups,
    markDay1Sent,
    markWeeklySent,
    getLiteUpsellContext,
};
