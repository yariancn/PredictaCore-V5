const LEGAL_BASE = 'https://predictacore.ai';
const UPDATED = '27 de mayo de 2026';

function wrapLegalPage({ title, breadcrumb, breadcrumbHref, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-emerald-600 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Regenoxy LLC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#050505;color:#d1d5db;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <nav class="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-zinc-500 mb-6">
        <a href="/" class="text-emerald-500 hover:text-emerald-400">PredictaCore</a>
        <span>/</span>
        <a href="/legal" class="hover:text-zinc-300">Centro legal</a>
        ${breadcrumb ? `<span>/</span><span class="text-zinc-400">${breadcrumb}</span>` : ''}
    </nav>
    ${breadcrumbHref ? `<a href="${breadcrumbHref}" class="text-emerald-500 text-xs uppercase tracking-widest">← Volver</a>` : ''}
    <h1 class="text-2xl font-black text-white mt-4 mb-2">${title}</h1>
    <p class="text-zinc-500 text-xs mb-6">Última actualización: ${UPDATED} · Regenoxy LLC</p>
    ${intro || ''}
    <section class="space-y-6 text-zinc-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-zinc-800 text-zinc-600 text-xs">${links}</footer>
</body>
</html>`;
}

/** Hub principal — usar en Stripe Public details → Terms */
function getLegalHubHTML() {
    return wrapLegalPage({
        title: 'Centro legal Regenoxy LLC',
        intro: `<div class="border border-zinc-700 bg-zinc-900/50 p-4 rounded mb-8 text-xs text-zinc-400">
            <strong>Regenoxy LLC</strong> opera varias líneas de negocio. Los pagos pueden realizarse por Stripe (web),
            CarePatron, teléfono o en persona. <strong>Cada servicio tiene términos específicos</strong>; el documento aplicable
            es el que corresponda al producto que usted contrató.
        </div>`,
        bodyHtml: `
        <div>
            <h2 class="text-white font-bold mb-3">Servicios digitales — PredictaCore</h2>
            <p class="mb-3 text-zinc-400">Auditorías IA de sitios web y reportes PDF. Pagos vía checkout en predictacore.ai.</p>
            <ul class="space-y-2">
                <li><a href="/terminos" class="text-emerald-500 font-bold hover:underline">Términos PredictaCore</a></li>
                <li><a href="/privacidad" class="text-emerald-500 hover:underline">Privacidad PredictaCore</a></li>
            </ul>
        </div>
        <div>
            <h2 class="text-white font-bold mb-3">Servicios clínicos y bienestar</h2>
            <p class="mb-3 text-zinc-400">Cámara hiperbárica, consultas y tratamientos. Pagos vía CarePatron, calendarios, teléfono o Stripe presencial.</p>
            <ul class="space-y-2">
                <li><a href="/legal/servicios-clinicos" class="text-emerald-500 font-bold hover:underline">Términos — servicios clínicos Regenoxy</a></li>
            </ul>
        </div>
        <div>
            <h2 class="text-white font-bold mb-3">Pagos y canales</h2>
            <p class="mb-3 text-zinc-400">Cómo se aplican los términos según el método de cobro.</p>
            <ul class="space-y-2">
                <li><a href="/legal/pagos" class="text-emerald-500 font-bold hover:underline">Política de pagos Regenoxy</a></li>
            </ul>
        </div>
        <div>
            <h2 class="text-white font-bold mb-3">Privacidad (todas las líneas)</h2>
            <ul class="space-y-2">
                <li><a href="/legal/privacidad" class="text-emerald-500 font-bold hover:underline">Política de privacidad Regenoxy LLC</a></li>
            </ul>
        </div>
        <div>
            <h2 class="text-white font-bold mb-2">Contacto</h2>
            <p>PredictaCore: <a href="mailto:reportes@predictacore.ai" class="text-emerald-500">reportes@predictacore.ai</a><br>
            Servicios clínicos: indique el correo o teléfono que le proporcionó su coordinador al reservar.</p>
        </div>`,
        footerLinks: [
            { href: '/terminos', label: 'PredictaCore Términos' },
            { href: '/legal/privacidad', label: 'Privacidad Regenoxy' },
        ],
    });
}

function getTerminosHTML() {
    return wrapLegalPage({
        title: 'Términos y Condiciones — PredictaCore',
        breadcrumb: 'PredictaCore',
        breadcrumbHref: '/legal',
        intro: `<div class="border border-amber-900/50 bg-amber-950/20 p-4 rounded mb-8 text-xs text-amber-200/90">
            <strong>Alcance:</strong> Solo productos PredictaCore (Reporte Titán USD $349 y monitoreo USD $25/mes).
            <a href="/legal" class="underline">Otros servicios Regenoxy</a> tienen términos distintos.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Prestador</h2>
            <p>PredictaCore es operado por <strong>Regenoxy LLC</strong> en predictacore.ai.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Servicio</h2>
            <p>Análisis automatizados de activos digitales con IA. Entregamos reportes PDF con recomendaciones. <strong>No implementamos cambios</strong> en su sitio ni garantizamos resultados comerciales.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Precios</h2>
            <p><strong>Reporte Titán:</strong> USD $349.00 — cobro al comprar.</p>
            <p class="mt-2"><strong>Monitoreo mensual:</strong> USD $25.00/mes — suscripción activa al comprar; <strong>primer cobro ~30 días después</strong>.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. No reembolso</h2>
            <p><strong>VENTAS FINALES.</strong> El pago de USD $349 y los cobros mensuales de USD $25 ya procesados <strong>no son reembolsables</strong>.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Cancelación</h2>
            <p>Cancelación vía portal Stripe. Para evitar el siguiente cobro mensual: <strong>al menos 5 días hábiles antes</strong> de la renovación.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Responsabilidad</h2>
            <p>Limitación según ley de Delaware. Los reportes pueden contener imprecisiones de IA; usted decide cómo usarlos.</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Propiedad intelectual</h2>
            <p>Reportes para uso interno del cliente. Prohibida reventa sin autorización.</p></div>
        <div><h2 class="text-white font-bold mb-2">8. Ley aplicable</h2>
            <p>Leyes del Estado de Delaware, EE.UU. Disputas por arbitraje vinculante salvo derecho local imperativo.</p></div>
        <div><h2 class="text-white font-bold mb-2">9. Contacto</h2>
            <p>reportes@predictacore.ai</p></div>`,
        footerLinks: [
            { href: '/privacidad', label: 'Privacidad PredictaCore' },
            { href: '/legal', label: 'Centro legal' },
        ],
    });
}

function getPrivacidadHTML() {
    return wrapLegalPage({
        title: 'Privacidad — PredictaCore',
        breadcrumb: 'PredictaCore',
        breadcrumbHref: '/legal',
        intro: `<div class="border border-zinc-800 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            Solo el servicio PredictaCore. Privacidad general Regenoxy: <a href="/legal/privacidad" class="text-emerald-500 underline">aquí</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Responsable</h2>
            <p>Regenoxy LLC — PredictaCore. reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Datos</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li>Email, URL analizada</li>
                <li>Pagos vía Stripe (no guardamos tarjetas)</li>
                <li>Contenido público del sitio para el reporte</li>
                <li>Logs técnicos</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Uso</h2>
            <p>Generar reportes, cobros, seguimiento mensual, soporte y cumplimiento legal.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Terceros</h2>
            <p>Stripe, Resend, Google Cloud/Vertex AI, Railway, PostgreSQL.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Retención</h2>
            <p>Mientras haya suscripción activa y hasta 24 meses tras cancelar.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Derechos</h2>
            <p>Solicitudes a reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Seguridad</h2>
            <p>HTTPS y controles razonables; ningún sistema es 100% seguro.</p></div>`,
        footerLinks: [
            { href: '/terminos', label: 'Términos PredictaCore' },
            { href: '/legal/privacidad', label: 'Privacidad Regenoxy' },
        ],
    });
}

/** Servicios clínicos: hiperbárica, CarePatron, calendarios */
function getServiciosClinicosHTML() {
    return wrapLegalPage({
        title: 'Términos — Servicios clínicos Regenoxy',
        breadcrumb: 'Servicios clínicos',
        breadcrumbHref: '/legal',
        intro: `<div class="border border-zinc-700 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            Aplica a consultas, cámara hiperbárica y tratamientos de bienestar ofrecidos por Regenoxy LLC
            (incl. reservas por CarePatron, calendarios en línea, teléfono o cobro en Stripe en consultorio).
            <strong>No aplica a PredictaCore</strong> — ver <a href="/terminos" class="text-emerald-500 underline">términos PredictaCore</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Naturaleza del servicio</h2>
            <p>Servicios de salud/bienestar prestados por profesionales bajo Regenoxy LLC. No sustituyen emergencias médicas; acuda a urgencias si corresponde.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Reservas y asistencia</h2>
            <p>Las citas se confirman por los canales indicados (CarePatron, calendario, teléfono). Llegar puntual; cancelar con la antelación indicada al reservar (típicamente 24–48 h).</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Pagos</h2>
            <p>El precio del servicio reservado es el comunicado al momento de la cita. Los cobros pueden procesarse por CarePatron, Stripe (en persona o enlace), o método acordado por teléfono. Al pagar, usted acepta estos términos y la <a href="/legal/pagos" class="text-emerald-500 underline">política de pagos</a>.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Reembolsos y cancelaciones</h2>
            <p><strong>Las políticas de cancelación y reembolso dependen del servicio reservado</strong> y se comunican al agendar. Salvo obligación legal, los servicios ya prestados o no cancelados a tiempo pueden no ser reembolsables.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Consentimiento informado</h2>
            <p>Tratamientos específicos pueden requerir formularios o consentimiento adicional en consultorio o CarePatron.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley, Regenoxy LLC no responde por daños indirectos. La responsabilidad total se limita al monto pagado por el servicio que originó el reclamo.</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Ley aplicable</h2>
            <p>Leyes del Estado de Delaware, EE.UU., salvo normas locales imperativas del consumidor.</p></div>`,
        footerLinks: [
            { href: '/legal/pagos', label: 'Política de pagos' },
            { href: '/legal', label: 'Centro legal' },
        ],
    });
}

/** Stripe directo, teléfono, CarePatron */
function getPagosHTML() {
    return wrapLegalPage({
        title: 'Política de pagos Regenoxy LLC',
        breadcrumb: 'Pagos',
        breadcrumbHref: '/legal',
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Entidad de cobro</h2>
            <p>Todos los cargos de Regenoxy LLC pueden aparecer en su extracto como <strong>REGENOXY</strong> o descriptor configurado en Stripe (p. ej. servicio clínico o PredictaCore).</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Canales de pago</h2>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Stripe / web:</strong> PredictaCore en predictacore.ai — términos en <a href="/terminos" class="text-emerald-500 underline">/terminos</a>.</li>
                <li><strong>CarePatron:</strong> acepta los términos mostrados en esa plataforma más los <a href="/legal/servicios-clinicos" class="text-emerald-500 underline">servicios clínicos</a> de Regenoxy.</li>
                <li><strong>Teléfono o presencial:</strong> el cobro implica aceptación verbal/escrita de la política del servicio reservado y estos términos generales de pago.</li>
                <li><strong>Stripe en consultorio / enlaces de pago:</strong> aplican términos del servicio clínico correspondiente, no los de PredictaCore salvo que el enlace sea explícitamente de predictacore.ai.</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Disputas y contracargos</h2>
            <p>Contacte primero a Regenoxy con su comprobante y fecha de servicio. Los contracargos sin intento previo de resolución pueden impedir futuras reservas.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Documento aplicable</h2>
            <p>Use el <a href="/legal" class="text-emerald-500 underline">centro legal</a> para abrir el contrato del servicio que contrató.</p></div>`,
        footerLinks: [
            { href: '/legal', label: 'Centro legal' },
            { href: '/legal/servicios-clinicos', label: 'Servicios clínicos' },
        ],
    });
}

/** Privacidad general Regenoxy — Stripe Public details → Privacy */
function getPrivacidadRegenoxyHTML() {
    return wrapLegalPage({
        title: 'Política de privacidad — Regenoxy LLC',
        breadcrumb: 'Privacidad',
        breadcrumbHref: '/legal',
        intro: `<div class="border border-zinc-800 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            Cubre todas las líneas de Regenoxy LLC. PredictaCore tiene detalle adicional en
            <a href="/privacidad" class="text-emerald-500 underline">privacidad PredictaCore</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Responsable</h2>
            <p>Regenoxy LLC. Contacto según servicio: reportes@predictacore.ai (PredictaCore) o el canal de su cita clínica.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Datos que podemos tratar</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li>Identificación y contacto (nombre, email, teléfono)</li>
                <li>Datos de salud/bienestar (solo servicios clínicos, según HIPAA/práctica local aplicable)</li>
                <li>Datos de pago (procesados por Stripe, CarePatron u otros; no almacenamos PAN completo)</li>
                <li>Datos técnicos (IP, logs)</li>
                <li>Para PredictaCore: URLs y contenido público de sitios analizados</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Finalidades</h2>
            <p>Prestar servicios, facturación, cumplimiento legal, seguridad y mejora operativa.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Encargados</h2>
            <p>Stripe, CarePatron, proveedores de calendario, email, cloud e IA según el servicio contratado.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Conservación</h2>
            <p>El tiempo necesario para el servicio, obligaciones legales y plazos clínicos/contables aplicables.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Sus derechos</h2>
            <p>Solicite acceso, rectificación o eliminación donde la ley lo permita, por el canal de contacto de su servicio.</p></div>`,
        footerLinks: [
            { href: '/privacidad', label: 'Privacidad PredictaCore' },
            { href: '/legal', label: 'Centro legal' },
        ],
    });
}

module.exports = {
    LEGAL_BASE,
    getLegalHubHTML,
    getTerminosHTML,
    getPrivacidadHTML,
    getServiciosClinicosHTML,
    getPagosHTML,
    getPrivacidadRegenoxyHTML,
};
