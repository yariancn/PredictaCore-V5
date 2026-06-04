/**
 * Legales Regenoxy LLC — marcas separadas:
 * - PredictaCore → predictacore.ai/terminos | /privacidad
 * - Clínico / hiperbárica → oxyhyperbaric.com (web) + términos clínicos
 * - Hub corporativo Regenoxy → /legal/regenoxy (neutral; ideal migrar a oxyhyperbaric.com/legal)
 */

const UPDATED = '27 de mayo de 2026';

const CLINICAL_WEB = (process.env.REGENOXY_CLINICAL_WEB || 'https://oxyhyperbaric.com').replace(/\/$/, '');
const CLINICAL_TERMS_URL = process.env.REGENOXY_CLINICAL_TERMS_URL
    || `${CLINICAL_WEB}/legal`;
const PREDICTACORE_WEB = 'https://predictacore.ai';
const REGENOXY_HUB_PATH = '/legal/regenoxy';

function wrapRegenoxyPage({ title, breadcrumb, breadcrumbHref, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-sky-400 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Regenoxy LLC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#0a0f1a;color:#cbd5e1;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <header class="border-b border-slate-700 pb-4 mb-6">
        <p class="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">Regenoxy LLC — documentos legales</p>
        <nav class="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-wider">
            <a href="${REGENOXY_HUB_PATH}" class="text-sky-400">Centro legal</a>
            <a href="${CLINICAL_WEB}" class="text-slate-300 hover:text-white" rel="noopener">Oxy Hyperbaric ↗</a>
            <a href="${PREDICTACORE_WEB}" class="text-slate-300 hover:text-white" rel="noopener">PredictaCore ↗</a>
        </nav>
    </header>
    ${breadcrumbHref ? `<a href="${breadcrumbHref}" class="text-sky-400 text-xs uppercase tracking-widest">← Volver</a>` : ''}
    ${breadcrumb ? `<p class="text-slate-500 text-xs mt-2">${breadcrumb}</p>` : ''}
    <h1 class="text-2xl font-black text-white mt-3 mb-2">${title}</h1>
    <p class="text-slate-500 text-xs mb-6">Última actualización: ${UPDATED}</p>
    ${intro || ''}
    <section class="space-y-6 text-slate-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-slate-700 text-slate-500 text-xs">${links}</footer>
</body>
</html>`;
}

function wrapPredictacorePage({ title, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-emerald-500 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#050505;color:#d1d5db;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <header class="border-b border-zinc-800 pb-4 mb-6">
        <a href="/" class="text-emerald-500 text-xs uppercase tracking-widest font-black">PredictaCore</a>
        <p class="text-[10px] text-zinc-600 mt-1">Operado por Regenoxy LLC · Solo servicios digitales / IA</p>
    </header>
    <h1 class="text-2xl font-black text-white mb-2">${title}</h1>
    <p class="text-zinc-500 text-xs mb-6">Última actualización: ${UPDATED}</p>
    ${intro || ''}
    <section class="space-y-6 text-zinc-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-zinc-800 text-zinc-600 text-xs">${links}</footer>
</body>
</html>`;
}

/** Hub Regenoxy — NO es PredictaCore. Ideal: copiar a oxyhyperbaric.com/legal */
function getRegenoxyHubHTML() {
    const clinicalTerms = CLINICAL_TERMS_URL.startsWith('http')
        ? CLINICAL_TERMS_URL
        : `${CLINICAL_WEB}${CLINICAL_TERMS_URL}`;

    return wrapRegenoxyPage({
        title: 'Centro legal — Regenoxy LLC',
        intro: `<div class="border border-slate-600 bg-slate-900/60 p-4 rounded text-xs text-slate-400">
            <strong>Regenoxy LLC</strong> opera marcas independientes. Elija el documento del <strong>servicio que contrató</strong>.
            Los términos de hiperbárica <strong>no</strong> aplican a PredictaCore, y viceversa.
        </div>`,
        bodyHtml: `
        <div class="grid gap-6 md:grid-cols-2">
            <div class="border-2 border-sky-800/60 bg-slate-900/80 p-5 rounded-lg">
                <p class="text-[10px] uppercase tracking-widest text-sky-400 mb-2">Giro clínico / bienestar</p>
                <h2 class="text-lg font-black text-white mb-2">Oxy Hyperbaric</h2>
                <p class="text-xs text-slate-400 mb-4">Cámara hiperbárica, consultas, CarePatron, teléfono, calendarios.</p>
                <p class="text-xs mb-3">Sitio: <a href="${CLINICAL_WEB}" class="text-sky-400 font-bold underline" rel="noopener">${CLINICAL_WEB}</a></p>
                <ul class="space-y-2 text-sm">
                    <li><a href="${clinicalTerms}" class="text-sky-300 font-bold hover:underline">Términos servicios clínicos ↗</a></li>
                    <li><a href="/legal/servicios-clinicos" class="text-slate-400 hover:underline text-xs">Copia en predictacore.ai (mismo contenido)</a></li>
                </ul>
            </div>
            <div class="border-2 border-emerald-900/50 bg-zinc-950 p-5 rounded-lg">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 mb-2">Giro digital / IA</p>
                <h2 class="text-lg font-black text-white mb-2">PredictaCore</h2>
                <p class="text-xs text-zinc-400 mb-4">Auditorías web, Reporte Titán, monitoreo mensual.</p>
                <p class="text-xs mb-3">Sitio: <a href="${PREDICTACORE_WEB}" class="text-emerald-500 font-bold underline">${PREDICTACORE_WEB}</a></p>
                <ul class="space-y-2 text-sm">
                    <li><a href="/terminos" class="text-emerald-400 font-bold hover:underline">Términos PredictaCore</a></li>
                    <li><a href="/privacidad" class="text-emerald-400 hover:underline">Privacidad PredictaCore</a></li>
                </ul>
            </div>
        </div>
        <div class="border border-slate-700 p-4 rounded">
            <h2 class="text-white font-bold mb-2">Pagos Regenoxy (todos los giros)</h2>
            <p class="text-xs text-slate-400 mb-2">Stripe, teléfono, CarePatron — cómo se asigna el contrato correcto.</p>
            <a href="/legal/pagos" class="text-sky-400 font-bold hover:underline">Política de pagos Regenoxy LLC</a>
        </div>
        <div>
            <h2 class="text-white font-bold mb-2">Privacidad corporativa</h2>
            <a href="/legal/privacidad" class="text-sky-400 hover:underline">Privacidad Regenoxy LLC (todas las líneas)</a>
        </div>`,
        footerLinks: [
            { href: CLINICAL_WEB, label: 'oxyhyperbaric.com' },
            { href: PREDICTACORE_WEB, label: 'predictacore.ai' },
        ],
    });
}

function getLegalHubHTML() {
    return getRegenoxyHubHTML();
}

function getTerminosHTML() {
    return wrapPredictacorePage({
        title: 'Términos y Condiciones de Servicio',
        intro: `<div class="border border-emerald-900/50 bg-emerald-950/30 p-4 rounded mb-8 text-xs text-emerald-100/90">
            <strong>Solo PredictaCore</strong> (predictacore.ai). No incluye cámara hiperbárica ni servicios en
            <a href="${CLINICAL_WEB}" class="underline text-emerald-400" rel="noopener">oxyhyperbaric.com</a>.
            Índice corporativo: <a href="${REGENOXY_HUB_PATH}" class="underline">Regenoxy LLC</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Prestador</h2>
            <p>El servicio <strong>PredictaCore</strong> es operado por Regenoxy LLC en predictacore.ai. Marca digital independiente de Oxy Hyperbaric.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Servicio</h2>
            <p>Análisis de activos digitales con IA; reportes PDF. No implementamos cambios en su sitio.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Precios</h2>
            <p><strong>Reporte Titán:</strong> USD $349 — cobro al comprar.</p>
            <p class="mt-2"><strong>Monitoreo:</strong> USD $25/mes — activo al comprar; primer cobro ~30 días después.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. No reembolso</h2>
            <p><strong>VENTAS FINALES.</strong> USD $349 y cobros mensuales procesados no son reembolsables.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Cancelación</h2>
            <p>Portal Stripe. Cancelar al menos <strong>5 días hábiles</strong> antes del siguiente ciclo mensual.</p></div>
        <div><h2 class="text-white font-bold mb-2">6–8. Responsabilidad, PI, ley</h2>
            <p>Delaware, EE.UU. Limitación de responsabilidad estándar. Reportes con posibles imprecisiones de IA.</p></div>
        <div><h2 class="text-white font-bold mb-2">9. Contacto</h2>
            <p><a href="mailto:reportes@predictacore.ai" class="text-emerald-500">reportes@predictacore.ai</a></p></div>`,
        footerLinks: [
            { href: '/privacidad', label: 'Privacidad PredictaCore' },
            { href: REGENOXY_HUB_PATH, label: 'Otras marcas Regenoxy' },
        ],
    });
}

function getPrivacidadHTML() {
    return wrapPredictacorePage({
        title: 'Política de Privacidad',
        intro: `<div class="border border-zinc-800 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            Solo datos del servicio <strong>PredictaCore</strong>. Privacidad clínica / Oxy Hyperbaric: use el canal de su cita o
            <a href="/legal/privacidad" class="text-emerald-500 underline">privacidad Regenoxy</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Responsable</h2>
            <p>Regenoxy LLC — marca PredictaCore. reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Datos</h2>
            <ul class="list-disc pl-5 space-y-1"><li>Email, URL analizada</li><li>Pagos Stripe</li><li>Contenido público scrapeado</li><li>Logs</li></ul></div>
        <div><h2 class="text-white font-bold mb-2">3–7. Uso, terceros, retención, derechos, seguridad</h2>
            <p>Stripe, Resend, Vertex AI, Railway, PostgreSQL. Retención hasta 24 meses tras cancelar suscripción.</p></div>`,
        footerLinks: [
            { href: '/terminos', label: 'Términos PredictaCore' },
            { href: REGENOXY_HUB_PATH, label: 'Centro legal Regenoxy' },
        ],
    });
}

function getServiciosClinicosHTML() {
    const clinicalTerms = CLINICAL_TERMS_URL.startsWith('http')
        ? CLINICAL_TERMS_URL
        : `${CLINICAL_WEB}${CLINICAL_TERMS_URL}`;

    return wrapRegenoxyPage({
        title: 'Términos — Servicios clínicos (Oxy Hyperbaric)',
        breadcrumb: 'Oxy Hyperbaric / Regenoxy LLC',
        breadcrumbHref: REGENOXY_HUB_PATH,
        intro: `<div class="border border-sky-900/50 bg-sky-950/30 p-4 rounded mb-8 text-xs text-sky-100/90">
            <strong>Solo servicios clínicos y bienestar</strong> en ${CLINICAL_WEB}.
            <strong>No aplica a PredictaCore</strong> (<a href="/terminos" class="underline">términos PredictaCore</a>).
            Versión canónica recomendada en sitio clínico:
            <a href="${clinicalTerms}" class="text-sky-300 font-bold underline" rel="noopener">${clinicalTerms}</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Naturaleza</h2>
            <p>Servicios de salud/bienestar bajo Regenoxy LLC en ${CLINICAL_WEB}. No sustituye urgencias médicas.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Reservas</h2>
            <p>CarePatron, calendario, teléfono. Cancelar con antelación indicada al reservar.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Pagos</h2>
            <p>CarePatron, Stripe presencial/enlace, teléfono. Ver <a href="/legal/pagos" class="text-sky-400 underline">política de pagos</a>.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Reembolsos</h2>
            <p>Según servicio y política comunicada al agendar; servicios prestados pueden no ser reembolsables.</p></div>
        <div><h2 class="text-white font-bold mb-2">5–7. Consentimiento, responsabilidad, ley</h2>
            <p>Formularios adicionales en consultorio si aplica. Delaware, EE.UU.</p></div>`,
        footerLinks: [
            { href: clinicalTerms, label: 'Sitio Oxy Hyperbaric' },
            { href: REGENOXY_HUB_PATH, label: 'Centro legal' },
        ],
    });
}

function getPagosHTML() {
    return wrapRegenoxyPage({
        title: 'Política de pagos — Regenoxy LLC',
        breadcrumb: 'Pagos',
        breadcrumbHref: REGENOXY_HUB_PATH,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Extracto bancario</h2>
            <p>Cargos pueden figurar como <strong>REGENOXY</strong> o descriptor del servicio (clínico vs PredictaCore).</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Qué términos aplican</h2>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>PredictaCore</strong> (predictacore.ai): <a href="/terminos" class="text-emerald-400 underline">/terminos</a> — solo auditorías IA.</li>
                <li><strong>Oxy Hyperbaric</strong> (${CLINICAL_WEB}): <a href="/legal/servicios-clinicos" class="text-sky-400 underline">términos clínicos</a>.</li>
                <li><strong>CarePatron / teléfono:</strong> términos del servicio reservado + esta política de pagos.</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Disputas</h2>
            <p>Contacte Regenoxy con comprobante antes de contracargo.</p></div>`,
        footerLinks: [{ href: REGENOXY_HUB_PATH, label: 'Centro legal' }],
    });
}

function getPrivacidadRegenoxyHTML() {
    return wrapRegenoxyPage({
        title: 'Privacidad — Regenoxy LLC (todas las marcas)',
        breadcrumb: 'Privacidad corporativa',
        breadcrumbHref: REGENOXY_HUB_PATH,
        intro: `<div class="border border-slate-600 bg-slate-900/40 p-4 rounded mb-8 text-xs text-slate-400">
            Marco general Regenoxy LLC. <strong>PredictaCore:</strong> <a href="/privacidad" class="text-emerald-500 underline">privacidad específica</a>.
            <strong>Clínico:</strong> datos de salud según práctica en ${CLINICAL_WEB}.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Responsable</h2>
            <p>Regenoxy LLC. PredictaCore: reportes@predictacore.ai. Clínico: contacto de su cita.</p></div>
        <div><h2 class="text-white font-bold mb-2">2–6. Datos, uso, terceros, retención, derechos</h2>
            <p>Stripe, CarePatron, calendarios, email, cloud, IA según servicio. Derechos según ley aplicable.</p></div>`,
        footerLinks: [
            { href: '/privacidad', label: 'Privacidad PredictaCore' },
            { href: CLINICAL_WEB, label: 'Oxy Hyperbaric' },
        ],
    });
}

module.exports = {
    CLINICAL_WEB,
    CLINICAL_TERMS_URL,
    REGENOXY_HUB_PATH,
    getRegenoxyHubHTML,
    getLegalHubHTML,
    getTerminosHTML,
    getPrivacidadHTML,
    getServiciosClinicosHTML,
    getPagosHTML,
    getPrivacidadRegenoxyHTML,
};
