const { getFaviconHeadTags } = require('./brand');

function statusMessage(t, fulfillStatus) {
    if (fulfillStatus === 'ok') return t.processingOk;
    if (fulfillStatus === 'dup') return t.processingDup;
    if (fulfillStatus === 'fail') return t.processingFail;
    if (fulfillStatus === 'not_paid') return t.processingNotPaid;
    if (fulfillStatus === 'not_predictacore') return t.processingNotPredictacore;
    if (fulfillStatus === 'missing_session') return t.processingMissing;
    if (fulfillStatus === 'processing') return t.processing;
    return '';
}

function getSuccessHTML(lang = 'en', fulfillStatus = 'processing') {
    const t = lang === 'es' ? {
        title: 'Pago confirmado',
        headline: 'PAGO RECIBIDO',
        body: 'Tu pago de USD $349 fue procesado correctamente. El motor forense PredictaCore ya está en cola.',
        email: 'Recibirás un correo de confirmación y, después, el Reporte Titán completo en PDF.',
        eta: 'Por la cantidad de datos que analizamos, el correo puede tardar hasta 60 minutos. Revisa spam y la carpeta Promociones.',
        sub: 'Monitoreo PredictaCore ($25/mes) activo. Primer reporte de seguimiento al mes 1; primer cobro entonces (no es prueba gratis). Estado de cuenta: PREDICTACORE.',
        portalNote: 'El enlace para gestionar tu suscripción llegará en el correo con tu reporte.',
        processing: 'Confirmando pago y encolando análisis…',
        processingOk: 'Pago confirmado. Análisis Titán en proceso — revisa tu correo (hasta 60 min).',
        processingDup: 'Pago ya registrado. Tu análisis sigue en cola — revisa tu correo (hasta 60 min).',
        processingFail: 'Pago recibido en Stripe, pero hubo un retraso al encolar. Escríbenos a reportes@predictacore.ai con tu email de compra.',
        processingNotPaid: 'Stripe devolvió esta sesión pero el pago NO está confirmado (payment_status ≠ paid). No se cobró USD $349. Vuelve a intentar el checkout o revisa Developers → Eventos en Stripe.',
        processingNotPredictacore: 'Esta sesión de Stripe no corresponde a PredictaCore (Price IDs o metadata incorrectos en Railway). Revisa STRIPE_PRICE_TITAN y STRIPE_PRICE_SUBSCRIPTION.',
        processingMissing: 'El pago en Stripe parece OK, pero no llegó el ID de sesión (session_id) en la URL. Revisa tu correo en unos minutos; si no llega nada, escríbenos a reportes@predictacore.ai.',
        home: 'Volver al inicio',
        terms: 'Términos',
        privacy: 'Privacidad',
    } : {
        title: 'Payment confirmed',
        headline: 'PAYMENT RECEIVED',
        body: 'Your USD $349 payment was processed successfully. The PredictaCore forensic engine is now queued.',
        email: 'You will receive a confirmation email, then your full Titan Report PDF.',
        eta: 'Because of the volume of data we process, delivery can take up to 60 minutes. Check spam and Promotions.',
        sub: 'PredictaCore monitoring ($25/mo) is active. First follow-up report at month 1; first charge on that date (not a free trial). Statement: PREDICTACORE.',
        portalNote: 'A link to manage your subscription will arrive in your report email.',
        processing: 'Confirming payment and queuing your audit…',
        processingOk: 'Payment confirmed. Titan audit running — watch your inbox (up to 60 min).',
        processingDup: 'Payment already registered. Your audit is queued — watch your inbox (up to 60 min).',
        processingFail: 'Stripe shows payment OK, but queuing delayed. Email reportes@predictacore.ai with your purchase email.',
        processingNotPaid: 'Stripe returned this session but payment is NOT confirmed (payment_status ≠ paid). USD $349 was not charged. Retry checkout or check Developers → Events in Stripe.',
        processingNotPredictacore: 'This Stripe session is not PredictaCore (wrong Price IDs or metadata in Railway). Check STRIPE_PRICE_TITAN and STRIPE_PRICE_SUBSCRIPTION.',
        processingMissing: 'Stripe payment looks OK, but the session_id was missing from the return URL. Check your inbox shortly; if nothing arrives, email reportes@predictacore.ai.',
        home: 'Back to home',
        terms: 'Terms',
        privacy: 'Privacy',
    };

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${getFaviconHeadTags()}
    <title>${t.title} | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #050505; color: #d1d5db; font-family: Inter, sans-serif; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-lg w-full border border-emerald-500/30 bg-black/80 p-10 rounded-lg text-center">
        <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-black text-white mb-4 tracking-tighter">${t.headline}</h1>
        <p class="text-zinc-300 text-sm mb-4 leading-relaxed">${t.body}</p>
        <p class="text-emerald-400 text-xs font-semibold mb-3 leading-relaxed">${t.email}</p>
        <p class="text-amber-500/90 text-[11px] mb-4 leading-relaxed border border-amber-500/20 bg-amber-950/20 rounded p-3">${t.eta}</p>
        <p id="fulfill-status" class="text-[10px] text-zinc-400 mb-4 leading-relaxed font-mono">${statusMessage(t, fulfillStatus)}</p>
        <p class="text-zinc-500 text-[10px] mb-4 leading-relaxed">${t.sub}</p>
        <p class="text-zinc-600 text-[9px] mb-8 leading-relaxed">${t.portalNote}</p>
        <a href="/" class="inline-block w-full bg-emerald-600 text-white py-3 rounded text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors">${t.home}</a>
        <p class="text-[9px] text-zinc-600 pt-6">
            <a href="/terms" class="text-emerald-600 hover:underline">${t.terms}</a> · <a href="/privacy" class="text-emerald-600 hover:underline">${t.privacy}</a>
        </p>
    </div>
    <script>
        const MSG = ${JSON.stringify({
            ok: t.processingOk,
            dup: t.processingDup,
            fail: t.processingFail,
            not_paid: t.processingNotPaid,
            not_predictacore: t.processingNotPredictacore,
            missing: t.processingMissing,
            none: '',
        })};
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const sessionId = params.get('session_id');
        const statusEl = document.getElementById('fulfill-status');
        if (email) localStorage.setItem('pc_email', email.trim().toLowerCase());

        if (sessionId && sessionId.startsWith('cs_') && !statusEl.innerText) {
            fetch('/fulfill-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId }),
            })
            .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
            .then(function(r) {
                if (r.ok && r.d.started) statusEl.innerText = MSG.ok;
                else if (r.d.duplicate) statusEl.innerText = MSG.dup;
                else if (r.ok) statusEl.innerText = MSG.ok;
                else statusEl.innerText = MSG.fail;
            })
            .catch(function() { statusEl.innerText = MSG.fail; });
        } else if (!sessionId || !sessionId.startsWith('cs_')) {
            if (!statusEl.innerText) statusEl.innerText = MSG.missing || MSG.none;
        }
    </script>
</body>
</html>`;
}

module.exports = { getSuccessHTML };
