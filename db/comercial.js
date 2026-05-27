const { getPool } = require('./init');

function normalizeUrl(dna) {
    let url = (dna || '').trim();
    if (!url) return '';
    if (!url.startsWith('http') && url.includes('.')) url = `https://${url}`;
    return url;
}

async function upsertCliente({ email, urlSitio, stripeCustomerId, stripeSubscriptionId, refCode }) {
    const pool = getPool();
    if (!pool || !email) return null;

    const url = normalizeUrl(urlSitio);
    const result = await pool.query(
        `INSERT INTO clientes (email, url_sitio, stripe_customer_id, stripe_subscription_id, subscription_status, ref_code_usado)
         VALUES ($1, $2, $3, $4, 'active', $5)
         ON CONFLICT (email) DO UPDATE SET
            url_sitio = EXCLUDED.url_sitio,
            stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, clientes.stripe_customer_id),
            stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, clientes.stripe_subscription_id),
            subscription_status = 'active',
            ref_code_usado = COALESCE(EXCLUDED.ref_code_usado, clientes.ref_code_usado)
         RETURNING id`,
        [
            email,
            url || 'pending',
            stripeCustomerId || null,
            stripeSubscriptionId || null,
            refCode && refCode !== 'null' && refCode !== '' ? refCode : null,
        ]
    );
    return result.rows[0]?.id || null;
}

async function getClienteByEmail(email) {
    const pool = getPool();
    if (!pool) return null;
    const result = await pool.query(
        `SELECT id, email, url_sitio, stripe_customer_id, stripe_subscription_id, subscription_status
         FROM clientes WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

async function saveReporte({ email, urlSitio, tipo, jobId, secciones, dossier }) {
    const pool = getPool();
    if (!pool || !email) return null;

    let clienteId = null;
    const cliente = await getClienteByEmail(email);
    if (cliente) {
        clienteId = cliente.id;
    } else if (tipo === 'titan') {
        clienteId = await upsertCliente({
            email,
            urlSitio,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            refCode: null,
        });
    }

    if (!clienteId) return null;

    const result = await pool.query(
        `INSERT INTO reportes (cliente_id, tipo, url_sitio, dossier_scrape, secciones_json, job_id, enviado, enviado_en)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, TRUE, NOW())
         RETURNING id`,
        [
            clienteId,
            tipo,
            normalizeUrl(urlSitio) || urlSitio,
            dossier || null,
            JSON.stringify(secciones || {}),
            jobId,
        ]
    );

    await pool.query(
        `UPDATE clientes SET ultimo_reporte_en = NOW() WHERE id = $1`,
        [clienteId]
    );

    console.log(`>>> [BD] Reporte ${tipo} guardado (#${result.rows[0].id}) para ${email}`);
    return result.rows[0].id;
}

module.exports = {
    normalizeUrl,
    upsertCliente,
    getClienteByEmail,
    saveReporte,
};
