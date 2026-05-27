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
        `SELECT email, url_sitio, modo, progreso_json FROM jobs_auditoria WHERE job_id = $1`,
        [jobId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
        email: row.email,
        urlSitio: row.url_sitio,
        isLite: row.modo === 'LITE',
        progress: row.progreso_json || {},
    };
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
    createJob,
    updateJobProgress,
    completeJob,
    failJob,
    getJobProgress,
    healthCheck,
    isDbReady,
};
