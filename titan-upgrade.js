// titan-upgrade.js — Lite → Titan upsell page (email + URL prefilled, one-click checkout)

const { getFaviconHeadTags, getSubscriptionCancellationNotice } = require('./brand');
const { TITAN_PRICE_USD, MONITORING_PRICE_USD } = require('./stripe-predictacore');

function getTitanUpgradeHTML() {
    const cancelNoticeEn = getSubscriptionCancellationNotice('en', MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const cancelNoticeEs = getSubscriptionCancellationNotice('es', MONITORING_PRICE_USD, TITAN_PRICE_USD);

    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PredictaCore | Titan Report — $${TITAN_PRICE_USD}</title>
    <meta name="robots" content="noindex, nofollow">
    ${getFaviconHeadTags()}
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1734011764438170');
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: 'Titan Report', content_category: 'upsell' });
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; font-size: 16px; }
        .hidden-flow { display: none !important; }
    </style>
</head>
<body class="antialiased min-h-screen">
    <header class="border-b border-zinc-800/80 py-5 px-6">
        <div class="max-w-xl mx-auto flex items-center justify-between">
            <a href="/" class="text-lg font-black text-white tracking-tighter uppercase">PREDICTA<span class="text-emerald-500">CORE</span></a>
            <div class="flex gap-2 text-xs font-bold uppercase tracking-widest">
                <button type="button" id="lang-en" class="text-zinc-500 hover:text-white">EN</button>
                <span class="text-zinc-700">|</span>
                <button type="button" id="lang-es" class="text-zinc-500 hover:text-white">ES</button>
            </div>
        </div>
    </header>

    <main class="max-w-xl mx-auto px-6 py-10">
        <p id="badge" class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 text-center mb-3">After your free Lite scan</p>
        <h1 id="headline" class="text-2xl md:text-3xl font-black text-white text-center uppercase tracking-tighter leading-tight mb-4">
            Stop losing customers you never knew you had
        </h1>
        <p id="subhead" class="text-base text-zinc-400 text-center leading-relaxed mb-8">
            Your Lite report only shows <strong class="text-white">3 critical leaks</strong>. The Titan Report finds <strong class="text-emerald-400">all 15 drop-off points</strong> that make strangers leave — plus concrete fixes to recover sales.
        </p>

        <div class="rounded-lg border border-zinc-800 bg-zinc-950/80 p-5 mb-6 space-y-3">
            <div>
                <p id="lbl-page" class="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Your page</p>
                <p id="target-display" class="text-sm text-white font-mono break-all">—</p>
            </div>
            <div>
                <p id="lbl-email" class="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Report email</p>
                <p id="email-display" class="text-sm text-white font-mono break-all">—</p>
            </div>
        </div>

        <div class="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-6 mb-6">
            <h2 id="box-title" class="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-4">Titan Report — USD $${TITAN_PRICE_USD} (intro)</h2>
            <ul id="feature-list" class="text-sm text-zinc-300 space-y-2.5 leading-relaxed">
                <li>· Full 11-section PDF delivered to your email</li>
                <li>· <strong class="text-white">15 conversion leaks</strong> ranked by severity — not just 3</li>
                <li>· <strong class="text-white">15 tactical actions</strong> to fix what scares buyers away</li>
                <li>· Desktop + mobile capture · measured load time</li>
                <li>· SEO + AI visibility scores · competitive benchmark</li>
                <li>· 4 buyer psychology profiles by your industry</li>
                <li>· 21-day implementation roadmap</li>
                <li>· Monthly monitoring report ($${MONITORING_PRICE_USD}/mo from day 30)</li>
            </ul>
        </div>

        <p id="price-today" class="text-center text-xs text-zinc-500 mb-2">Charged today: USD $${TITAN_PRICE_USD} (Titan Report — introductory price)</p>
        <button type="button" id="btn-pay" class="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-4 rounded-lg text-base uppercase tracking-widest shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all disabled:opacity-60 disabled:cursor-wait mb-4">
            Pay $${TITAN_PRICE_USD} — Get Titan Report
        </button>
        <p id="checkout-hint" class="text-sm text-zinc-600 text-center mb-6">Secure Stripe checkout · your email and URL are already set</p>
        <p id="checkout-error" class="hidden-flow text-sm text-red-400 text-center font-medium mb-4" role="alert"></p>

        <p id="terms-line" class="text-[10px] text-zinc-600 text-center leading-relaxed mb-4">
            By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>.
        </p>
        <div id="cancel-notice-en" class="text-[10px] text-zinc-600 leading-relaxed">${cancelNoticeEn}</div>
        <div id="cancel-notice-es" class="hidden-flow text-[10px] text-zinc-600 leading-relaxed">${cancelNoticeEs}</div>
    </main>

    <div id="checkout-overlay" class="hidden-flow fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md px-6" aria-live="polite">
        <div class="text-center max-w-sm">
            <div class="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p id="overlay-title" class="text-white font-bold text-sm uppercase tracking-widest mb-2">Secure checkout</p>
            <p id="overlay-sub" class="text-zinc-500 text-xs">Redirecting to Stripe. Do not close this window.</p>
        </div>
    </div>

    <script>
        (function() {
            const params = new URLSearchParams(window.location.search);
            let currentLang = params.get('lang') === 'es' ? 'es' : 'en';
            const adsMode = params.get('src') === 'ads';
            const email = (params.get('email') || '').trim().toLowerCase();
            const dna = (params.get('dna') || '').trim();

            const copy = {
                en: {
                    badge: adsMode ? 'Titan Report · USD $${TITAN_PRICE_USD}' : 'After your free Lite scan',
                    headline: 'Stop losing customers you never knew you had',
                    subhead: 'Your Lite report only shows <strong class="text-white">3 critical leaks</strong>. The Titan Report finds <strong class="text-emerald-400">all 15 drop-off points</strong> that make strangers leave — plus concrete fixes to recover sales.',
                    lblPage: 'Your page',
                    lblEmail: 'Report email',
                    boxTitle: 'Titan Report — USD $${TITAN_PRICE_USD} (intro)',
                    features: [
                        '· Full 11-section PDF delivered to your email',
                        '· <strong class="text-white">15 conversion leaks</strong> ranked by severity — not just 3',
                        '· <strong class="text-white">15 tactical actions</strong> to fix what scares buyers away',
                        '· Desktop + mobile capture · measured load time',
                        '· SEO + AI visibility scores · competitive benchmark',
                        '· 4 buyer psychology profiles by your industry',
                        '· 21-day implementation roadmap',
                        '· Monthly monitoring report ($${MONITORING_PRICE_USD}/mo from day 30)',
                    ],
                    priceToday: 'Charged today: USD $${TITAN_PRICE_USD} (Titan Report — introductory price)',
                    btnPay: 'Pay $${TITAN_PRICE_USD} — Get Titan Report',
                    checkoutHint: 'Secure Stripe checkout · your email and URL are already set',
                    termsLine: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>.',
                    overlayTitle: 'Secure checkout',
                    overlaySub: 'Redirecting to Stripe. Do not close this window.',
                    btnLoading: 'Opening checkout…',
                    errMissing: 'Invalid link — missing email or page URL. Run a new free scan from the homepage.',
                    errCheckout: 'Could not start checkout. Try again or contact support.',
                    errNetwork: 'Network error. Check your connection and try again.',
                },
                es: {
                    badge: adsMode ? 'Reporte Titán · USD $${TITAN_PRICE_USD}' : 'Tras tu escaneo Lite gratis',
                    headline: 'Deja de perder clientes que ni sabías que tenías',
                    subhead: 'Tu reporte Lite solo muestra <strong class="text-white">3 fugas críticas</strong>. El Reporte Titán encuentra <strong class="text-emerald-400">las 15 fugas</strong> que hacen que los desconocidos se vayan — más correcciones concretas para recuperar ventas.',
                    lblPage: 'Tu página',
                    lblEmail: 'Correo del reporte',
                    boxTitle: 'Reporte Titán — USD $${TITAN_PRICE_USD} (intro)',
                    features: [
                        '· PDF completo de 11 secciones a tu correo',
                        '· <strong class="text-white">15 fugas de conversión</strong> por gravedad — no solo 3',
                        '· <strong class="text-white">15 acciones tácticas</strong> para arreglar lo que ahuyenta compradores',
                        '· Captura desktop/móvil · tiempo de carga medido',
                        '· Scores SEO + visibilidad IA · benchmark competitivo',
                        '· 4 perfiles de psicología de comprador por tu giro',
                        '· Hoja de ruta de implementación 21 días',
                        '· Reporte mensual de seguimiento ($${MONITORING_PRICE_USD}/mes desde día 30)',
                    ],
                    priceToday: 'Cobro hoy: USD $${TITAN_PRICE_USD} (Reporte Titán — precio introductorio)',
                    btnPay: 'Pagar $${TITAN_PRICE_USD} — Obtener Reporte Titán',
                    checkoutHint: 'Checkout seguro Stripe · tu correo y URL ya están listos',
                    termsLine: 'Al pagar aceptas nuestros <a href="/terms" class="text-emerald-600 underline">Términos</a> y <a href="/privacy" class="text-emerald-600 underline">Privacidad</a>.',
                    overlayTitle: 'Checkout seguro',
                    overlaySub: 'Redirigiendo a Stripe. No cierres esta ventana.',
                    btnLoading: 'Abriendo checkout…',
                    errMissing: 'Enlace inválido — falta correo o URL. Haz un escaneo gratis desde la página principal.',
                    errCheckout: 'No se pudo iniciar el checkout. Intenta de nuevo o contacta soporte.',
                    errNetwork: 'Error de red. Revisa tu conexión e intenta de nuevo.',
                },
            };

            function applyLang() {
                const d = copy[currentLang];
                document.documentElement.lang = currentLang;
                document.getElementById('badge').innerText = d.badge;
                document.getElementById('headline').innerText = d.headline;
                document.getElementById('subhead').innerHTML = d.subhead;
                document.getElementById('lbl-page').innerText = d.lblPage;
                document.getElementById('lbl-email').innerText = d.lblEmail;
                document.getElementById('box-title').innerText = d.boxTitle;
                document.getElementById('feature-list').innerHTML = d.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');
                document.getElementById('price-today').innerText = d.priceToday;
                document.getElementById('btn-pay').innerText = d.btnPay;
                document.getElementById('checkout-hint').innerText = d.checkoutHint;
                document.getElementById('terms-line').innerHTML = d.termsLine;
                document.getElementById('overlay-title').innerText = d.overlayTitle;
                document.getElementById('overlay-sub').innerText = d.overlaySub;
                document.getElementById('cancel-notice-en').classList.toggle('hidden-flow', currentLang !== 'en');
                document.getElementById('cancel-notice-es').classList.toggle('hidden-flow', currentLang !== 'es');
                document.getElementById('lang-en').classList.toggle('text-emerald-500', currentLang === 'en');
                document.getElementById('lang-en').classList.toggle('text-zinc-500', currentLang !== 'en');
                document.getElementById('lang-es').classList.toggle('text-emerald-500', currentLang === 'es');
                document.getElementById('lang-es').classList.toggle('text-zinc-500', currentLang !== 'es');
            }

            function setError(msg) {
                const el = document.getElementById('checkout-error');
                el.innerText = msg || '';
                el.classList.toggle('hidden-flow', !msg);
            }

            function showOverlay() {
                document.getElementById('checkout-overlay').classList.remove('hidden-flow');
            }

            async function startCheckout() {
                const d = copy[currentLang];
                const btn = document.getElementById('btn-pay');
                if (!email || !dna) {
                    setError(d.errMissing);
                    btn.disabled = true;
                    return;
                }
                setError('');
                btn.disabled = true;
                btn.innerText = d.btnLoading;
                showOverlay();
                if (typeof fbq === 'function') {
                    fbq('track', 'InitiateCheckout', { value: ${TITAN_PRICE_USD}, currency: 'USD', content_name: 'Titan Report' });
                }

                const cancelUrl = window.location.origin + '/titan?' + new URLSearchParams({
                    email: email,
                    dna: dna,
                    lang: currentLang,
                }).toString();

                try {
                    const res = await fetch('/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            dna: dna,
                            lang: currentLang,
                            refCode: '',
                            cancelUrl: cancelUrl,
                        }),
                    });
                    const data = await res.json().catch(function() { return {}; });
                    if (!res.ok || !data.url) {
                        throw new Error(data.error || d.errCheckout);
                    }
                    window.location.href = data.url;
                } catch (err) {
                    document.getElementById('checkout-overlay').classList.add('hidden-flow');
                    btn.disabled = false;
                    btn.innerText = d.btnPay;
                    setError(err.message || d.errNetwork);
                }
            }

            document.getElementById('target-display').innerText = dna || '—';
            document.getElementById('email-display').innerText = email || '—';
            applyLang();

            document.getElementById('btn-pay').addEventListener('click', startCheckout);
            document.getElementById('lang-en').addEventListener('click', function() { currentLang = 'en'; applyLang(); });
            document.getElementById('lang-es').addEventListener('click', function() { currentLang = 'es'; applyLang(); });

            if (!email || !dna) {
                setError(copy[currentLang].errMissing);
                document.getElementById('btn-pay').disabled = true;
            }
        })();
    </script>
</body>
</html>`;
}

module.exports = { getTitanUpgradeHTML };
