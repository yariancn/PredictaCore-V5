#!/usr/bin/env node
/**
 * PredictaCore — Diagnóstico de infraestructura y base de datos
 *
 * Uso local (con DATABASE_URL de Railway):
 *   DATABASE_URL="postgresql://..." node scripts/db-diagnostic.js
 *
 * Uso en Railway (shell del servicio):
 *   node scripts/db-diagnostic.js
 */

const { Pool } = require('pg');

const REQUIRED_FOR_CORE = [
  'DATABASE_URL',
  'GOOGLE_CREDS',
  'RESEND_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

const REQUIRED_FOR_FUTURE = [
  'STRIPE_CONNECT_CLIENT_ID', // Fase 3 — afiliados
];

const CONFIGURED_UNUSED = [
  'API_KEY',
  'JINA_API_KEY',
  'XAI_API_KEY',
];

const EXPECTED_TABLES = {
  afiliados: {
    required: true,
    usedBy: 'server.js webhook — comisiones por refCode',
    columns: ['id', 'codigo_ref', 'sponsor_id'],
  },
  ventas_comisiones: {
    required: true,
    usedBy: 'server.js webhook — registro de ventas $199',
    columns: [
      'id_venta_stripe',
      'cliente_email',
      'monto_total',
      'afiliado_nivel_1_id',
      'comision_nivel_1',
      'afiliado_nivel_2_id',
      'comision_nivel_2',
      'afiliado_nivel_3_id',
      'comision_nivel_3',
    ],
  },
  clientes: {
    required: false,
    usedBy: 'Fase 2 — suscripción y reportes mensuales',
    columns: ['email', 'url_sitio', 'stripe_customer_id', 'stripe_subscription_id'],
  },
  reportes: {
    required: false,
    usedBy: 'Fase 2 — snapshot inicial + reportes delta mensuales',
    columns: ['cliente_id', 'tipo', 'contenido_json'],
  },
  comisiones_recurrentes: {
    required: false,
    usedBy: 'Fase 3 — comisiones 15/10/5% sobre $25/mes',
    columns: ['stripe_invoice_id', 'cliente_email', 'monto_base'],
  },
  invitaciones: {
    required: false,
    usedBy: 'Fase 3 — registro de afiliados por invitación',
    columns: ['codigo', 'sponsor_id'],
  },
  webhook_eventos: {
    required: false,
    usedBy: 'Fase 0 — idempotencia Stripe (evitar duplicados)',
    columns: ['stripe_event_id', 'tipo'],
  },
};

function mask(value) {
  if (!value) return '(vacío)';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}...${value.slice(-4)} (${value.length} chars)`;
}

function checkEnv() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  1. VARIABLES DE ENTORNO');
  console.log('══════════════════════════════════════════════════\n');

  const results = { ok: [], missing: [], unused: [], future: [] };

  for (const key of REQUIRED_FOR_CORE) {
    if (process.env[key]) {
      results.ok.push(key);
      console.log(`  ✅ ${key.padEnd(28)} ${mask(process.env[key])}`);
    } else {
      results.missing.push(key);
      console.log(`  ❌ ${key.padEnd(28)} NO DEFINIDA — bloqueante`);
    }
  }

  console.log('\n  --- Variables en Railway pero no usadas por server.js ---');
  for (const key of CONFIGURED_UNUSED) {
    if (process.env[key]) {
      results.unused.push(key);
      console.log(`  ⚠️  ${key.padEnd(28)} definida pero sin uso en código actual`);
    } else {
      console.log(`  ·  ${key.padEnd(28)} no definida (ok por ahora)`);
    }
  }

  console.log('\n  --- Requeridas en fases futuras ---');
  for (const key of REQUIRED_FOR_FUTURE) {
    if (process.env[key]) {
      results.future.push(key);
      console.log(`  ✅ ${key.padEnd(28)} ${mask(process.env[key])}`);
    } else {
      console.log(`  ·  ${key.padEnd(28)} pendiente (Fase 3 — Stripe Connect)`);
    }
  }

  if (process.env.GOOGLE_CREDS) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_CREDS);
      console.log(`\n  GOOGLE_CREDS válido → project_id: ${creds.project_id || '(sin project_id)'}`);
    } catch {
      console.log('\n  ❌ GOOGLE_CREDS no es JSON válido — bloqueante para Vertex AI');
      results.missing.push('GOOGLE_CREDS (JSON inválido)');
    }
  }

  return results;
}

async function checkDatabase() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  2. BASE DE DATOS (PostgreSQL)');
  console.log('══════════════════════════════════════════════════\n');

  if (!process.env.DATABASE_URL) {
    console.log('  ❌ DATABASE_URL no definida — no se puede conectar.\n');
    return { connected: false, tables: {} };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const version = await pool.query('SELECT version()');
    console.log(`  ✅ Conexión exitosa`);
    console.log(`     ${version.rows[0].version.split(',')[0]}\n`);

    const tablesRes = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const existingTables = tablesRes.rows.map((r) => r.table_name);
    console.log(`  Tablas en schema public: ${existingTables.length || 0}`);
    if (existingTables.length === 0) {
      console.log('  ⚠️  Base de datos VACÍA — hay que ejecutar schema.sql\n');
    } else {
      existingTables.forEach((t) => console.log(`     · ${t}`));
      console.log('');
    }

    const tableReport = {};

    for (const [tableName, spec] of Object.entries(EXPECTED_TABLES)) {
      const exists = existingTables.includes(tableName);
      tableReport[tableName] = { exists, spec };

      const icon = exists ? '✅' : spec.required ? '❌' : '·';
      const label = spec.required ? 'REQUERIDA AHORA' : 'futura';
      console.log(`  ${icon} ${tableName.padEnd(24)} [${label}] — ${spec.usedBy}`);

      if (exists) {
        const cols = await pool.query(
          `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`,
          [tableName]
        );
        const colNames = cols.rows.map((c) => c.column_name);
        const missingCols = spec.columns.filter((c) => !colNames.includes(c));

        if (missingCols.length > 0) {
          console.log(`     ⚠️  Columnas faltantes vs schema propuesto: ${missingCols.join(', ')}`);
        } else if (spec.required) {
          console.log(`     ✅ Columnas críticas presentes`);
        }

        const count = await pool.query(`SELECT COUNT(*)::int AS n FROM "${tableName}"`);
        console.log(`     Registros: ${count.rows[0].n}`);
      }
      console.log('');
    }

    await pool.end();
    return { connected: true, tables: tableReport, existingTables };
  } catch (err) {
    console.log(`  ❌ Error de conexión: ${err.message}\n`);
    await pool.end().catch(() => {});
    return { connected: false, error: err.message, tables: {} };
  }
}

function checkCodeGaps(envResults, dbResults) {
  console.log('══════════════════════════════════════════════════');
  console.log('  3. BRECHAS CÓDIGO ↔ INFRAESTRUCTURA');
  console.log('══════════════════════════════════════════════════\n');

  const gaps = [];

  if (envResults.missing.length > 0) {
    gaps.push(`Variables faltantes: ${envResults.missing.join(', ')}`);
  }

  if (!dbResults.connected) {
    gaps.push('Sin conexión a PostgreSQL — comisiones de afiliados fallan en silencio');
  } else {
    const missingRequired = Object.entries(EXPECTED_TABLES)
      .filter(([name, spec]) => spec.required && !dbResults.existingTables?.includes(name))
      .map(([name]) => name);

    if (missingRequired.length > 0) {
      gaps.push(`Tablas faltantes (bloqueantes): ${missingRequired.join(', ')}`);
      gaps.push('→ Ejecutar: psql $DATABASE_URL -f schema.sql');
    }
  }

  gaps.push('Webhook solo escucha checkout.session.completed — falta invoice.paid (suscripción mensual)');
  gaps.push('Reportes Titán no se guardan en BD — imposible reporte delta mensual');
  gaps.push('Jobs de auditoría en memoria (jobs={}) — se pierden al reiniciar Railway');
  gaps.push('Sin idempotencia webhook — reintentos Stripe pueden duplicar auditorías');
  gaps.push('Sin endpoint /health — Railway no puede monitorear el servicio');
  gaps.push('JINA_API_KEY y XAI_API_KEY en Railway sin integrar en server.js');

  if (envResults.unused.length > 0) {
    gaps.push(`Variables sin uso: ${envResults.unused.join(', ')} — decidir si integrar o eliminar`);
  }

  gaps.forEach((g, i) => console.log(`  ${i + 1}. ${g}`));
  console.log('');
}

function printSummary(envResults, dbResults) {
  console.log('══════════════════════════════════════════════════');
  console.log('  4. RESUMEN Y ACCIÓN INMEDIATA');
  console.log('══════════════════════════════════════════════════\n');

  let score = 0;
  let max = 5;

  if (envResults.missing.length === 0) score++;
  if (dbResults.connected) score++;
  if (dbResults.existingTables?.includes('afiliados')) score++;
  if (dbResults.existingTables?.includes('ventas_comisiones')) score++;
  if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_SECRET_KEY) score++;

  console.log(`  Preparación launch comercial: ${score}/${max}\n`);

  if (!dbResults.connected) {
    console.log('  ACCIÓN 1: Verificar DATABASE_URL en Railway → Deploy pendiente (3 changes en tu panel)');
  } else if (!dbResults.existingTables?.includes('afiliados')) {
    console.log('  ACCIÓN 1: Ejecutar schema.sql en la BD de Railway');
    console.log('           Railway → Postgres → Connect → Query, o:');
    console.log('           psql "$DATABASE_URL" -f schema.sql');
  } else {
    console.log('  ACCIÓN 1: BD base OK — continuar con Fase 1 (Stripe Products + dominio)');
  }

  console.log('  ACCIÓN 2: Desplegar los 3 cambios pendientes en Railway (botón Deploy)');
  console.log('  ACCIÓN 3: Conectar dominio predictacore.ai → CNAME a Railway');
  console.log('  ACCIÓN 4: Configurar webhook Stripe → https://predictacore.ai/webhook-stripe');
  console.log('');
}

async function main() {
  console.log('\n🔍 PredictaCore — Diagnóstico completo');
  console.log(`   ${new Date().toISOString()}\n`);

  const envResults = checkEnv();
  const dbResults = await checkDatabase();
  checkCodeGaps(envResults, dbResults);
  printSummary(envResults, dbResults);
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
