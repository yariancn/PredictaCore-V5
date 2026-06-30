const { getFaviconHeadTags, getSupportEmail } = require('./brand');
const { TITAN_PRICE_USD, MONITORING_PRICE_USD } = require('./stripe-predictacore');
const { TITAN_SECTIONS } = require('./titan-shared-content');

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
    const support = getSupportEmail();
    const sectionsHtml = TITAN_SECTIONS.map((section, index) => {
        const num = String(index + 1).padStart(2, '0');
        return `<li class="flex gap-2 text-left text-[11px] text-zinc-500 leading-relaxed"><span class="font-mono text-violet-500/80 shrink-0">${num}</span><span>${section}</span></li>`;
    }).join('');

    const t = lang === 'es' ? {
        title: 'Pago confirmado',
        headline: 'PAGO RECIBIDO',
        body: `Tu pago de USD $${TITAN_PRICE_USD} fue procesado correctamente. El motor forense PredictaCore ya está en cola.`,
        email: 'Recibirás un correo de confirmación y, después, el Reporte Titán completo en PDF.',
        eta: 'Por la cantidad de datos que analizamos, el correo puede tardar hasta 60 minutos. Revisa spam y la carpeta Promociones.',
        pdfTitle: 'Qué incluye tu PDF Titán (11 secciones)',
        sub: `Monitoreo $${MONITORING_PRICE_USD}/mes activo. Primer cobro el día 30. Estado de cuenta: PREDICTACORE.`,
        portalNote: `Información de cancelación del monitoreo recurrente: ${getSupportEmail()} o portal de facturación en su correo de confirmación de pago. Ver Términos.`,
        processing: 'Confirmando pago y encolando análisis…',
        processingOk: 'Pago confirmado. Análisis Titán en proceso — revisa tu correo (hasta 60 min).',
        processingDup: 'Pago ya registrado. Tu análisis sigue en cola — revisa tu correo (hasta 60 min).',
        processingFail: `Pago recibido en Stripe, pero hubo un retraso al encolar. Escríbenos a ${support} con tu email de compra.`,
        processingNotPaid: `Stripe devolvió esta sesión pero el pago NO está confirmado (payment_status ≠ paid). No se cobró USD $${TITAN_PRICE_USD}. Vuelve a intentar el checkout o revisa Developers → Eventos en Stripe.`,
        processingNotPredictacore: 'Esta sesión de Stripe no corresponde a PredictaCore (Price IDs o metadata incorrectos en Railway). Revisa STRIPE_PRICE_TITAN y STRIPE_PRICE_SUBSCRIPTION.',
        processingMissing: `El pago en Stripe parece OK, pero no llegó el ID de sesión (session_id) en la URL. Revisa tu correo en unos minutos; si no llega nada, escríbenos a ${support}.`,
        home: 'Volver al inicio',
        lite: 'Escaneo Lite gratis',
        terms: 'Términos',
        privacy: 'Privacidad',
    } : {
        title: 'Payment confirmed',
        headline: 'PAYMENT RECEIVED',
        body: `Your USD $${TITAN_PRICE_USD} payment was processed successfully. The PredictaCore forensic engine is now queued.`,
        email: 'You will receive a confirmation email, then your full Titan Report PDF.',
        eta: 'Because of the volume of data we process, delivery can take up to 60 minutes. Check spam and Promotions.',
        pdfTitle: 'What your Titan PDF includes (11 sections)',
        sub: `Monitoring $${MONITORING_PRICE_USD}/mo active. First charge on day 30. Statement: PREDICTACORE.`,
        portalNote: `Recurring monitoring cancellation: ${getSupportEmail()} or billing portal in your payment confirmation email. See Terms.`,
        processing: 'Confirming payment and queuing your audit…',
        processingOk: 'Payment confirmed. Titan audit running — watch your inbox (up to 60 min).',
        processingDup: 'Payment already registered. Your audit is queued — watch your inbox (up to 60 min).',
        processingFail: `Stripe shows payment OK, but queuing delayed. Email ${support} with your purchase email.`,
        processingNotPaid: `Stripe returned this session but payment is NOT confirmed (payment_status ≠ paid). USD $${TITAN_PRICE_USD} was not charged. Retry checkout or check Developers → Events in Stripe.`,
        processingNotPredictacore: 'This Stripe session is not PredictaCore (wrong Price IDs or metadata in Railway). Check STRIPE_PRICE_TITAN and STRIPE_PRICE_SUBSCRIPTION.',
        processingMissing: `Stripe payment looks OK, but the session_id was missing from the return URL. Check your inbox shortly; if nothing arrives, email ${support}.`,
        home: 'Back to home',
        lite: 'Free Lite scan',
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
    <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1734011764438170');
    fbq('track', 'PageView');
    </script>
    <style>
        body { background: #050505; color: #d1d5db; font-family: Inter, sans-serif; font-size: 16px; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-lg w-full border border-violet-500/30 bg-black/80 p-8 md:p-10 rounded-lg text-center">
        <div class="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-black text-white mb-4 tracking-tighter">${t.headline}</h1>
        <p class="text-zinc-300 text-sm mb-4 leading-relaxed">${t.body}</p>
        <p class="text-violet-300 text-xs font-semibold mb-3 leading-relaxed">${t.email}</p>
        <p class="text-amber-500/90 text-[11px] mb-4 leading-relaxed border border-amber-500/20 bg-amber-950/20 rounded p-3">${t.eta}</p>
        <div class="text-left border border-zinc-800 rounded-lg p-4 mb-4 bg-zinc-950/50">
            <p class="text-xs font-bold text-white mb-3 text-center">${t.pdfTitle}</p>
            <ol class="space-y-2 m-0 p-0 list-none">${sectionsHtml}</ol>
        </div>
        <p id="fulfill-status" class="text-[10px] text-zinc-400 mb-4 leading-relaxed font-mono">${statusMessage(t, fulfillStatus)}</p>
        <p class="text-zinc-500 text-[10px] mb-4 leading-relaxed">${t.sub}</p>
        <p class="text-zinc-600 text-[9px] mb-6 leading-relaxed">${t.portalNote}</p>
        <a href="/" class="inline-block w-full bg-violet-600 text-white py-3 rounded text-xs uppercase tracking-widest hover:bg-violet-500 transition-colors mb-2">${t.home}</a>
        <a href="https://predictacore.ai/ads/lite" class="inline-block w-full border border-zinc-700 text-zinc-300 py-3 rounded text-xs uppercase tracking-widest hover:border-violet-500 hover:text-violet-300 transition-colors">${t.lite}</a>
        <p class="text-[9px] text-zinc-600 pt-6">
            <a href="/terms" class="text-violet-400 hover:underline">${t.terms}</a> · <a href="/privacy" class="text-violet-400 hover:underline">${t.privacy}</a>
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

        const initialFulfill = ${JSON.stringify(fulfillStatus)};
        let purchaseTracked = false;

        function trackAdsFunnel(eventType, extra) {
            var payload = {
                clientSlug: 'predictacore',
                eventType: eventType,
                pagePath: '/exito',
                metadata: extra || {}
            };
            try {
                var sid = localStorage.getItem('pc_funnel_session:predictacore');
                if (sid) payload.sessionId = sid;
            } catch (e) {}
            fetch('/ads/api/funnel/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
                body: JSON.stringify(payload)
            }).catch(function() {});
        }

        function trackPurchaseOnce() {
            if (purchaseTracked || typeof fbq !== 'function') return;
            purchaseTracked = true;
            fbq('track', 'Purchase', { value: ${TITAN_PRICE_USD}, currency: 'USD', content_name: 'Titan Report' });
            trackAdsFunnel('purchase', { product: 'titan', value: ${TITAN_PRICE_USD} });
            trackAdsFunnel('upsell_accepted', { product: 'titan' });
        }

        if (initialFulfill === 'ok' || initialFulfill === 'dup') trackPurchaseOnce();

        if (sessionId && sessionId.startsWith('cs_') && !statusEl.innerText) {
            fetch('/fulfill-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId }),
            })
            .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
            .then(function(r) {
                if (r.ok && r.d.started) { statusEl.innerText = MSG.ok; trackPurchaseOnce(); }
                else if (r.d.duplicate) { statusEl.innerText = MSG.dup; trackPurchaseOnce(); }
                else if (r.ok) { statusEl.innerText = MSG.ok; trackPurchaseOnce(); }
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
