const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

let pool = null;
let dbReady = false;

function getPool() {
    if (!process.env.DATABASE_URL) return null;
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 15000,
        });
    }
    return pool;
}

function parseSchemaStatements(sql) {
    return sql
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .split(';')
        .map((s) => s.trim())
        .filter((s) => {
            if (!s) return false;
            const upper = s.toUpperCase();
            if (upper === 'BEGIN' || upper === 'COMMIT') return false;
            if (upper.startsWith('SELECT TABLE_NAME')) return false;
            return true;
        });
}

async function initDatabase() {
    const p = getPool();
    if (!p) {
        console.warn('>>> [BD] DATABASE_URL no definida — persistencia desactivada');
        return false;
    }

    try {
        await p.query('SELECT 1');
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = parseSchemaStatements(schema);

        for (const stmt of statements) {
            await p.query(stmt);
        }

        const count = await p.query(`
            SELECT COUNT(*)::int AS n
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `);

        dbReady = true;
        console.log(`>>> [BD] Schema inicializado — ${count.rows[0].n} tablas en public`);
        return true;
    } catch (err) {
        console.error('>>> [BD] Error inicializando schema:', err.message);
        dbReady = false;
        return false;
    }
}

async function claimWebhookEvent(stripeEventId, tipo) {
    const p = getPool();
    if (!p) return true;

    const result = await p.query(
        `INSERT INTO webhook_eventos (stripe_event_id, tipo)
         VALUES ($1, $2)
         ON CONFLICT (stripe_event_id) DO NOTHING
         RETURNING id`,
        [stripeEventId, tipo]
    );
    return result.rows.length > 0;
}

async function releaseWebhookClaim(stripeEventId) {
    const p = getPool();
    if (!p) return;
    await p.query('DELETE FROM webhook_eventos WHERE stripe_event_id = $1', [stripeEventId]);
}

async function fulfillmentLooksComplete(email) {
    const p = getPool();
    if (!p || !email) return false;
    const [cli, job] = await Promise.all([
        p.query('SELECT 1 FROM clientes WHERE lower(email) = lower($1) LIMIT 1', [email]),
        p.query(
            `SELECT 1 FROM jobs_auditoria
             WHERE lower(email) = lower($1) AND modo = 'TITAN'
               AND estado IN ('running', 'completed')
             LIMIT 1`,
            [email]
        ),
    ]);
    return cli.rows.length > 0 && job.rows.length > 0;
}

async function createJob(jobId, email, urlSitio, modo) {
    const p = getPool();
    if (!p) return;
    await p.query(
        `INSERT INTO jobs_auditoria (job_id, email, url_sitio, modo, estado, progreso_json)
         VALUES ($1, $2, $3, $4, 'running', '{}')
         ON CONFLICT (job_id) DO NOTHING`,
        [jobId, email, urlSitio, modo]
    );
}

async function updateJobProgress(jobId, progress) {
    const p = getPool();
    if (!p) return;
    await p.query(
        `UPDATE jobs_auditoria SET progreso_json = $2::jsonb WHERE job_id = $1`,
        [jobId, JSON.stringify(progress)]
    );
}

async function completeJob(jobId) {
    const p = getPool();
    if (!p) return;
    await p.query(
        `UPDATE jobs_auditoria SET estado = 'completed', completado_en = NOW() WHERE job_id = $1`,
        [jobId]
    );
}

async function failJob(jobId, errorMsg) {
    const p = getPool();
    if (!p) return;
    await p.query(
        `UPDATE jobs_auditoria SET estado = 'failed', error_msg = $2, completado_en = NOW() WHERE job_id = $1`,
        [jobId, errorMsg]
    );
}

async function getJobProgress(jobId) {
    const p = getPool();
    if (!p) return null;
    const result = await p.query(
        `SELECT email, url_sitio, modo, progreso_json, estado, error_msg, creado_en, completado_en
         FROM jobs_auditoria WHERE job_id = $1`,
        [jobId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    const progress = row.progreso_json || {};
    const meta = progress.__meta__ || null;
    const sections = { ...progress };
    delete sections.__meta__;
    return {
        email: row.email,
        urlSitio: row.url_sitio,
        modo: row.modo,
        estado: row.estado,
        errorMsg: row.error_msg,
        creadoEn: row.creado_en,
        completadoEn: row.completado_en,
        isLite: row.modo === 'LITE',
        progress: sections,
        meta,
    };
}

async function getJobsByEmail(email, limit = 5) {
    const p = getPool();
    if (!p || !email) return [];
    const normalized = String(email).trim().toLowerCase();
    const result = await p.query(
        `SELECT job_id, email, url_sitio, modo, estado, error_msg, creado_en, completado_en,
                progreso_json
         FROM jobs_auditoria
         WHERE lower(email) = $1
         ORDER BY creado_en DESC
         LIMIT $2`,
        [normalized, limit]
    );
    return result.rows.map((row) => {
        const progress = row.progreso_json || {};
        const sectionKeys = Object.keys(progress).filter((k) => k !== '__meta__');
        return {
            job_id: row.job_id,
            email: row.email,
            url_sitio: row.url_sitio,
            modo: row.modo,
            estado: row.estado,
            error_msg: row.error_msg,
            creado_en: row.creado_en,
            completado_en: row.completado_en,
            secciones: sectionKeys.length,
            seccion_ids: sectionKeys,
        };
    });
}

async function markStaleRunningJobs(maxAgeMinutes = 75) {
    const p = getPool();
    if (!p) return 0;
    const result = await p.query(
        `UPDATE jobs_auditoria
         SET estado = 'failed',
             error_msg = COALESCE(error_msg, 'Job interrupted (server restart or timeout)'),
             completado_en = NOW()
         WHERE estado = 'running'
           AND creado_en < NOW() - ($1 || ' minutes')::interval
         RETURNING job_id`,
        [String(maxAgeMinutes)]
    );
    if (result.rows.length) {
        console.warn(`>>> [BD] ${result.rows.length} job(s) running marcados como failed (stale)`);
    }
    return result.rows.length;
}

async function healthCheck() {
    if (!process.env.DATABASE_URL) {
        return { ok: false, db: 'not_configured', tables: [] };
    }

    const p = getPool();
    try {
        await p.query('SELECT 1');
        const tables = await p.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        const names = tables.rows.map((r) => r.table_name);
        const expected = [
            'webhook_eventos', 'afiliados', 'invitaciones', 'clientes',
            'ventas_comisiones', 'comisiones_recurrentes', 'reportes', 'jobs_auditoria',
        ];
        const missing = expected.filter((t) => !names.includes(t));

        return {
            ok: missing.length === 0 && dbReady,
            db: 'connected',
            tables: names,
            missing,
            tableCount: names.length,
        };
    } catch (err) {
        return { ok: false, db: 'error', message: err.message, tables: [] };
    }
}

function isDbReady() {
    return dbReady;
}

module.exports = {
    getPool,
    initDatabase,
    claimWebhookEvent,
    releaseWebhookClaim,
    fulfillmentLooksComplete,
    createJob,
    updateJobProgress,
    completeJob,
    failJob,
    getJobProgress,
    getJobsByEmail,
    markStaleRunningJobs,
    healthCheck,
    isDbReady,
};
