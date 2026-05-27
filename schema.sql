-- PredictaCore — Schema PostgreSQL (Launch v1)
-- Comisiones: venta inicial $349 → 30/10/5% | suscripción $25/mes → 15/10/5%
-- Ejecutar: psql "$DATABASE_URL" -f schema.sql

BEGIN;

-- ─── Idempotencia Stripe ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_eventos (
    id              SERIAL PRIMARY KEY,
    stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
    tipo            VARCHAR(100) NOT NULL,
    procesado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Afiliados (compatible con server.js actual + Stripe Connect futuro) ───
CREATE TABLE IF NOT EXISTS afiliados (
    id                  SERIAL PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    nombre              VARCHAR(255),
    codigo_ref          VARCHAR(32) NOT NULL UNIQUE,
    sponsor_id          INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    tipo_registro       VARCHAR(20) NOT NULL DEFAULT 'abierto'
                        CHECK (tipo_registro IN ('abierto', 'invitacion')),
    stripe_connect_id   VARCHAR(255) UNIQUE,
    connect_onboarded   BOOLEAN NOT NULL DEFAULT FALSE,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_afiliados_codigo_ref ON afiliados(codigo_ref);
CREATE INDEX IF NOT EXISTS idx_afiliados_sponsor ON afiliados(sponsor_id);

-- ─── Invitaciones (registro por invitación) ────────────────────────────────
CREATE TABLE IF NOT EXISTS invitaciones (
    id              SERIAL PRIMARY KEY,
    codigo          VARCHAR(32) NOT NULL UNIQUE,
    sponsor_id      INTEGER NOT NULL REFERENCES afiliados(id) ON DELETE CASCADE,
    usado_por       INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    usado_en        TIMESTAMPTZ,
    expira_en       TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitaciones_codigo ON invitaciones(codigo);

-- ─── Clientes (suscripción + reportes mensuales) ───────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
    id                      SERIAL PRIMARY KEY,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    url_sitio               TEXT NOT NULL,
    stripe_customer_id      VARCHAR(255) UNIQUE,
    stripe_subscription_id  VARCHAR(255) UNIQUE,
    subscription_status     VARCHAR(50) DEFAULT 'inactive',
    ref_code_usado          VARCHAR(32),
    creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ultimo_reporte_en       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_subscription ON clientes(stripe_subscription_id);

-- ─── Ventas iniciales + comisiones $349 (30/10/5%) — usado por server.js ───
CREATE TABLE IF NOT EXISTS ventas_comisiones (
    id                      SERIAL PRIMARY KEY,
    id_venta_stripe         VARCHAR(255) NOT NULL UNIQUE,
    cliente_email           VARCHAR(255) NOT NULL,
    monto_total             NUMERIC(10, 2) NOT NULL DEFAULT 349.00,
    afiliado_nivel_1_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_1        NUMERIC(10, 2),
    afiliado_nivel_2_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_2        NUMERIC(10, 2),
    afiliado_nivel_3_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_3        NUMERIC(10, 2),
    stripe_transfer_1       VARCHAR(255),
    stripe_transfer_2       VARCHAR(255),
    stripe_transfer_3       VARCHAR(255),
    comisiones_pagadas      BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ventas_stripe ON ventas_comisiones(id_venta_stripe);
CREATE INDEX IF NOT EXISTS idx_ventas_email ON ventas_comisiones(cliente_email);

-- ─── Comisiones recurrentes $25/mes (15/10/5%) ────────────────────────────
CREATE TABLE IF NOT EXISTS comisiones_recurrentes (
    id                      SERIAL PRIMARY KEY,
    stripe_invoice_id       VARCHAR(255) NOT NULL UNIQUE,
    cliente_email           VARCHAR(255) NOT NULL,
    monto_base              NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    afiliado_nivel_1_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_1        NUMERIC(10, 2),  -- 15% = $3.75
    afiliado_nivel_2_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_2        NUMERIC(10, 2),  -- 10% = $2.50
    afiliado_nivel_3_id     INTEGER REFERENCES afiliados(id) ON DELETE SET NULL,
    comision_nivel_3        NUMERIC(10, 2),  --  5% = $1.25
    stripe_transfer_1       VARCHAR(255),
    stripe_transfer_2       VARCHAR(255),
    stripe_transfer_3       VARCHAR(255),
    comisiones_pagadas      BOOLEAN NOT NULL DEFAULT FALSE,
    periodo_inicio          TIMESTAMPTZ,
    periodo_fin             TIMESTAMPTZ,
    creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comisiones_recurrentes_invoice ON comisiones_recurrentes(stripe_invoice_id);

-- ─── Reportes (snapshot Titán + deltas mensuales) ──────────────────────────
CREATE TABLE IF NOT EXISTS reportes (
    id              SERIAL PRIMARY KEY,
    cliente_id      INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('lite', 'titan', 'delta')),
    url_sitio       TEXT NOT NULL,
    dossier_scrape  TEXT,
    secciones_json  JSONB NOT NULL DEFAULT '{}',
    acciones_json   JSONB,
    scorecard_json  JSONB,
    job_id          VARCHAR(100),
    enviado         BOOLEAN NOT NULL DEFAULT FALSE,
    enviado_en      TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reportes_cliente ON reportes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes(tipo);

-- ─── Jobs de auditoría (reemplaza jobs={} en memoria) ──────────────────────
CREATE TABLE IF NOT EXISTS jobs_auditoria (
    id              SERIAL PRIMARY KEY,
    job_id          VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL,
    url_sitio       TEXT NOT NULL,
    modo            VARCHAR(10) NOT NULL CHECK (modo IN ('LITE', 'TITAN', 'DELTA')),
    estado          VARCHAR(20) NOT NULL DEFAULT 'running'
                    CHECK (estado IN ('running', 'completed', 'failed')),
    progreso_json   JSONB NOT NULL DEFAULT '{}',
    error_msg       TEXT,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completado_en   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_jobs_estado ON jobs_auditoria(estado);

COMMIT;

-- ─── Verificación post-migración ───────────────────────────────────────────
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
