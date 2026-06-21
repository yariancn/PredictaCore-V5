const { getPool } = require('./init');

function normalizeUrl(dna) {
    let url = (dna || '').trim();
    if (!url) return '';
    if (!url.startsWith('http') && url.includes('.')) url = `https://${url}`;
    return url;
}

async function upsertCliente({
    email,
    urlSitio,
    stripeCustomerId,
    stripeSubscriptionId,
    refCode,
    subscriptionStatus,
}) {
    const pool = getPool();
    if (!pool || !email) return null;

    const normalizedEmail = String(email).trim().toLowerCase();
    const status = subscriptionStatus || 'active';
    const url = normalizeUrl(urlSitio);
    const result = await pool.query(
        `INSERT INTO clientes (email, url_sitio, stripe_customer_id, stripe_subscription_id, subscription_status, ref_code_usado)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET
            url_sitio = EXCLUDED.url_sitio,
            stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, clientes.stripe_customer_id),
            stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, clientes.stripe_subscription_id),
            subscription_status = EXCLUDED.subscription_status,
            ref_code_usado = COALESCE(EXCLUDED.ref_code_usado, clientes.ref_code_usado)
         RETURNING id`,
        [
            normalizedEmail,
            url || 'pending',
            stripeCustomerId || null,
            stripeSubscriptionId || null,
            status,
            refCode && refCode !== 'null' && refCode !== '' ? refCode : null,
        ]
    );
    return result.rows[0]?.id || null;
}

async function getClienteByEmail(email) {
    const pool = getPool();
    if (!pool) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const result = await pool.query(
        `SELECT id, email, url_sitio, stripe_customer_id, stripe_subscription_id,
                subscription_status, ref_code_usado
         FROM clientes WHERE LOWER(email) = $1`,
        [normalizedEmail]
    );
    return result.rows[0] || null;
}

async function getLatestTitanReport(clienteId) {
    const pool = getPool();
    if (!pool || !clienteId) return null;
    const result = await pool.query(
        `SELECT secciones_json, dossier_scrape, url_sitio
         FROM reportes WHERE cliente_id = $1 AND tipo = 'titan'
         ORDER BY creado_en DESC LIMIT 1`,
        [clienteId]
    );
    return result.rows[0] || null;
}

/** Clientes con al menos un reporte Titán guardado (para pruebas de seguimiento) */
async function listClientesConTitan(limit = 50) {
    const pool = getPool();
    if (!pool) return [];

    const result = await pool.query(
        `SELECT c.id AS cliente_id, c.email, c.url_sitio,
                r.creado_en AS titan_en, r.id AS reporte_id,
                (SELECT COUNT(*)::int FROM reportes d WHERE d.cliente_id = c.id AND d.tipo = 'delta') AS deltas
         FROM clientes c
         INNER JOIN LATERAL (
             SELECT id, creado_en FROM reportes
             WHERE cliente_id = c.id AND tipo = 'titan'
             ORDER BY creado_en DESC LIMIT 1
         ) r ON true
         ORDER BY r.creado_en DESC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
}

async function registrarComisionRecurrente(invoiceId, email, refCode) {
    const pool = getPool();
    if (!pool) return;

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
                    INSERT INTO comisiones_recurrentes
                    (stripe_invoice_id, cliente_email, monto_base, afiliado_nivel_1_id, comision_nivel_1,
                     afiliado_nivel_2_id, comision_nivel_2, afiliado_nivel_3_id, comision_nivel_3)
                    VALUES ($1, $2, 25.00, $3, 3.75, $4, 2.50, $5, 1.25)
                    ON CONFLICT (stripe_invoice_id) DO NOTHING
                `, [invoiceId, email, nivel1_id, nivel2_id, nivel3_id]);
                return;
            }
        }
    } catch (err) {
        console.error('!!! Error registrando comisión recurrente:', err);
    }
}

async function saveReporte({ email, urlSitio, tipo, jobId, secciones, dossier }) {
    const pool = getPool();
    if (!pool || !email) return null;

    let clienteId = null;
    const cliente = await getClienteByEmail(email);
    if (cliente) {
        clienteId = cliente.id;
    } else if (tipo === 'titan' || tipo === 'delta' || tipo === 'lite') {
        clienteId = await upsertCliente({
            email,
            urlSitio,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            refCode: null,
            subscriptionStatus: tipo === 'lite' ? 'lite' : 'inactive',
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
    getLatestTitanReport,
    listClientesConTitan,
    registrarComisionRecurrente,
    saveReporte,
};
