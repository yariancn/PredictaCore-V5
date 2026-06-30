// titan-upgrade.js — Lite → Titan upsell (CRO-aligned with /ads/lite)

const { getFaviconHeadTags, getSubscriptionCancellationNotice } = require('./brand');
const { TITAN_PRICE_USD, MONITORING_PRICE_USD } = require('./stripe-predictacore');
const {
    TITAN_FLAW_FIX_EXAMPLES,
    COMPARE_ROWS,
    TITAN_SECTIONS,
    getTitanPageCopy,
} = require('./titan-shared-content');

const LITE_LANDING = 'https://predictacore.ai/ads/lite';

function getTitanUpgradeHTML() {
    const cancelNoticeEn = getSubscriptionCancellationNotice('en', MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const cancelNoticeEs = getSubscriptionCancellationNotice('es', MONITORING_PRICE_USD, TITAN_PRICE_USD);

    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PredictaCore | Titan Report — 15 Flaws + 15 Fixes · $${TITAN_PRICE_USD}</title>
    <meta name="description" content="Upgrade from Lite: all 15 conversion flaws ranked + a fix recommendation for each. One-click checkout.">
    <meta name="robots" content="noindex, nofollow">
    ${getFaviconHeadTags()}
    <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1734011764438170');
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: 'Titan Report', content_category: 'upsell' });
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        :root { --pc-purple: #8b5cf6; --pc-purple-dim: #6d28d9; }
        body { background: #050505; color: #d1d5db; font-family: Inter, ui-sans-serif, system-ui, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; }
        .hidden-flow { display: none !important; }
        .pc-mesh { position: fixed; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(109,40,217,0.18) 0%, transparent 55%); z-index: -1; pointer-events: none; }
        .pc-wrap { max-width: 42rem; margin: 0 auto; padding: 0 1.25rem; }
        .pc-wrap-wide { max-width: 56rem; margin: 0 auto; padding: 0 1.25rem; }
        .pc-break { overflow-wrap: anywhere; word-break: break-word; }
        .pc-badge { display: inline-flex; border-radius: 9999px; border: 1px solid rgba(139,92,246,0.35); background: rgba(76,29,149,0.25); padding: 0.25rem 0.75rem; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #c4b5fd; }
        .pc-card { border-radius: 0.75rem; border: 1px solid #3f3f46; background: rgba(0,0,0,0.45); padding: 1rem 1.125rem; }
        .pc-stat { border-radius: 0.75rem; padding: 1.25rem; border: 2px solid rgba(139,92,246,0.35); background: rgba(0,0,0,0.5); text-align: center; }
        .pc-stat.fix { border-color: rgba(16,185,129,0.35); }
        .pc-stat-num { font-size: 3rem; font-weight: 900; color: var(--pc-purple); line-height: 1; }
        .pc-stat.fix .pc-stat-num { color: #34d399; }
        .pc-btn { display: inline-flex; width: 100%; align-items: center; justify-content: center; border-radius: 0.5rem; background: var(--pc-purple); color: #fff; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; padding: 1rem 1.5rem; border: none; cursor: pointer; font-size: 0.875rem; box-shadow: 0 0 24px rgba(139,92,246,0.28); transition: background 0.15s; }
        .pc-btn:hover { background: #7c3aed; }
        .pc-btn:disabled { opacity: 0.6; cursor: wait; }
        .pc-compare { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .pc-compare th, .pc-compare td { padding: 0.75rem; border-bottom: 1px solid #27272a; text-align: left; vertical-align: top; }
        .pc-compare th { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #71717a; background: rgba(0,0,0,0.35); }
        .pc-compare .col-titan { background: rgba(139,92,246,0.08); color: #ede9fe; }
        .pc-leak { margin: 0 0 0.625rem 0; padding: 0.625rem 0.75rem; background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; border-radius: 4px; list-style: none; }
        .pc-leak-label { color: #fca5a5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .pc-details summary { cursor: pointer; list-style: none; font-weight: 700; color: #e4e4e7; font-size: 0.875rem; }
        .pc-details summary::-webkit-details-marker { display: none; }
        .pc-details summary::after { content: '+'; float: right; color: #71717a; }
        .pc-details[open] summary::after { content: '−'; }
        .pc-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; border-top: 1px solid rgba(109,40,217,0.4); background: rgba(0,0,0,0.95); padding: 0.75rem 1rem; padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); backdrop-filter: blur(12px); }
        .pc-sticky.hidden-flow { display: none !important; }
        .pc-purple { color: var(--pc-purple); }
        header { border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(15,23,42,0.75); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
    </style>
</head>
<body class="antialiased min-h-screen pb-24">
    <div class="pc-mesh" aria-hidden></div>

    <header class="py-3 px-4 md:px-6">
        <div class="pc-wrap-wide flex items-center justify-between gap-3">
            <a href="/" class="text-lg font-black text-white tracking-tighter uppercase shrink-0">PREDICTA<span class="pc-purple">CORE</span></a>
            <div class="flex items-center gap-3">
                <a href="${LITE_LANDING}" id="nav-lite" class="text-[10px] font-bold uppercase tracking-wide text-zinc-500 hover:text-violet-400 hidden sm:inline">Free Lite scan</a>
                <div class="flex gap-2 text-xs font-bold uppercase tracking-widest">
                    <button type="button" id="lang-en" class="text-zinc-500 hover:text-white">EN</button>
                    <span class="text-zinc-700">|</span>
                    <button type="button" id="lang-es" class="text-zinc-500 hover:text-white">ES</button>
                </div>
            </div>
        </div>
    </header>

    <main class="py-8 md:py-12">
        <div class="pc-wrap text-center">
            <p id="badge" class="pc-badge mb-4">After your free Lite scan</p>
            <h1 id="headline" class="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-3">15 main flaws. 15 fixes. One report.</h1>
            <p id="subhead" class="text-sm md:text-base text-zinc-400 leading-relaxed mb-6">Your Lite report only shows 3 critical leaks. Titan finds all 15 ranked conversion failures plus a recommendation to fix each one.</p>

            <div class="pc-card text-left mb-6 space-y-3">
                <div>
                    <p id="lbl-page" class="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Your page</p>
                    <p id="target-display" class="text-sm text-white font-mono pc-break">—</p>
                </div>
                <div>
                    <p id="lbl-email" class="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Report email</p>
                    <p id="email-display" class="text-sm text-white font-mono pc-break">—</p>
                </div>
                <p id="metrics-line" class="hidden-flow text-xs text-violet-300/90 font-semibold"></p>
            </div>
        </div>

        <div class="pc-wrap mb-8">
            <div id="leaks-block" class="hidden-flow">
                <p id="leaks-title" class="text-sm font-bold text-white mb-3">Issues from your Lite scan — still active:</p>
                <ul id="leaks-list" class="m-0 p-0"></ul>
            </div>
            <p id="leaks-wait" class="text-sm text-zinc-600 text-center">Loading your Lite scan leaks…</p>
        </div>

        <div class="pc-wrap-wide mb-8">
            <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
                <div class="pc-stat">
                    <p class="pc-stat-num">15</p>
                    <p id="flaws-title" class="mt-3 text-base font-bold text-white pc-break">15 main conversion flaws</p>
                    <p class="mt-2 text-sm text-zinc-400 text-left pc-break">Ranked by impact — trust gaps, weak CTAs, slow load, mobile friction, and more.</p>
                </div>
                <div class="pc-stat fix">
                    <p class="pc-stat-num">15</p>
                    <p id="fixes-title" class="mt-3 text-base font-bold text-white pc-break">15 fix recommendations</p>
                    <p class="mt-2 text-sm text-zinc-400 text-left pc-break">One actionable solution per flaw — copy, CTA, layout, proof, checkout.</p>
                </div>
            </div>
        </div>

        <div class="pc-wrap mb-8">
            <p id="examples-title" class="text-xs font-bold uppercase tracking-widest text-zinc-500 text-center mb-3">Example flaw → recommendation</p>
            <div id="examples-list" class="space-y-3"></div>
        </div>

        <div class="pc-wrap-wide mb-8 overflow-x-auto rounded-xl border border-zinc-800">
            <table class="pc-compare min-w-[320px]">
                <thead>
                    <tr>
                        <th id="col-feature">What you get</th>
                        <th id="col-lite">Lite · Free</th>
                        <th id="col-titan" class="col-titan">Titan · $${TITAN_PRICE_USD}</th>
                    </tr>
                </thead>
                <tbody id="compare-body"></tbody>
            </table>
        </div>

        <div class="pc-wrap mb-6">
            <details class="pc-details pc-card mb-4">
                <summary id="sections-summary">Inside the Titan PDF (11 sections)</summary>
                <ol id="sections-list" class="mt-4 space-y-2 text-sm text-zinc-500 m-0 pl-0 list-none"></ol>
            </details>
        </div>

        <div class="pc-wrap mb-6">
            <div class="rounded-xl border border-violet-500/30 bg-violet-950/20 p-5">
                <p id="monitoring-title" class="text-sm font-bold text-violet-200 mb-2">What monitoring includes (USD $${MONITORING_PRICE_USD}/mo from day 30)</p>
                <p id="monitoring-body" class="text-xs text-zinc-400 leading-relaxed"></p>
            </div>
        </div>

        <div class="pc-wrap text-center mb-4">
            <p id="price-anchor" class="text-sm text-zinc-500 mb-2"></p>
            <p id="price-today" class="text-xs text-zinc-600 mb-4"></p>
            <button type="button" id="btn-pay" class="pc-btn">Pay $${TITAN_PRICE_USD} — get my Titan Report</button>
            <p id="checkout-hint" class="text-sm text-zinc-600 mt-3 mb-2"></p>
            <p id="checkout-error" class="hidden-flow text-sm text-red-400 font-medium mb-2" role="alert"></p>
            <p id="terms-line" class="text-[10px] text-zinc-600 leading-relaxed mb-3"></p>
            <div id="cancel-notice-en" class="text-[10px] text-zinc-600 leading-relaxed text-left">${cancelNoticeEn}</div>
            <div id="cancel-notice-es" class="hidden-flow text-[10px] text-zinc-600 leading-relaxed text-left">${cancelNoticeEs}</div>
            <p class="mt-4"><a href="${LITE_LANDING}" id="free-lite-link" class="text-sm font-semibold text-zinc-500 hover:text-violet-400">No Lite yet? Free scan →</a></p>
        </div>

        <div class="pc-wrap mt-10 border-t border-zinc-900 pt-8">
            <h2 id="faq-title" class="text-lg font-black text-white text-center mb-4">Questions before you pay</h2>
            <div id="faq-list" class="space-y-3"></div>
        </div>
    </main>

    <div id="sticky-cta" class="pc-sticky hidden-flow">
        <button type="button" id="btn-pay-sticky" class="pc-btn">Get my Titan — $${TITAN_PRICE_USD}</button>
    </div>

    <div id="checkout-overlay" class="hidden-flow fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md px-6" aria-live="polite">
        <div class="text-center max-w-sm">
            <div class="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p id="overlay-title" class="text-white font-bold text-sm uppercase tracking-widest mb-2">Secure checkout</p>
            <p id="overlay-sub" class="text-zinc-500 text-xs">Redirecting to Stripe. Do not close this window.</p>
        </div>
    </div>

    <script>
        (function() {
            const PRICE = ${TITAN_PRICE_USD};
            const MONITORING = ${MONITORING_PRICE_USD};
            const LITE_URL = ${JSON.stringify(LITE_LANDING)};
            const EXAMPLES = ${JSON.stringify(TITAN_FLAW_FIX_EXAMPLES)};
            const COMPARE = ${JSON.stringify(COMPARE_ROWS)};
            const SECTIONS = ${JSON.stringify(TITAN_SECTIONS)};

            const params = new URLSearchParams(window.location.search);
            let currentLang = params.get('lang') === 'es' ? 'es' : 'en';
            const email = (params.get('email') || '').trim().toLowerCase();
            const dna = (params.get('dna') || '').trim();
            const refCode = params.get('ref') || params.get('from') || params.get('utm_campaign') || params.get('utm_content') || '';

            const copyEn = ${JSON.stringify(getTitanPageCopy('en', TITAN_PRICE_USD, MONITORING_PRICE_USD))};
            const copyEs = ${JSON.stringify(getTitanPageCopy('es', TITAN_PRICE_USD, MONITORING_PRICE_USD))};

            function copy() { return currentLang === 'es' ? copyEs : copyEn; }

            function trackAdsFunnel(eventType, extra) {
                var payload = {
                    clientSlug: 'predictacore',
                    eventType: eventType,
                    pagePath: '/titan',
                    refCode: refCode || undefined,
                    utmSource: params.get('utm_source') || undefined,
                    utmMedium: params.get('utm_medium') || undefined,
                    utmCampaign: params.get('utm_campaign') || undefined,
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

            if (!email || !dna) {
                window.location.replace(LITE_URL + '#titan-offer');
                return;
            }

            trackAdsFunnel('page_view', { surface: 'titan_upsell' });

            function applyLang() {
                const d = copy();
                document.documentElement.lang = currentLang;
                document.getElementById('badge').innerText = params.get('from') ? d.badgeEmail : d.badgeLite;
                document.getElementById('lbl-page').innerText = d.lblPage;
                document.getElementById('lbl-email').innerText = d.lblEmail;
                document.getElementById('flaws-title').innerText = d.flawsTitle;
                document.getElementById('fixes-title').innerText = d.fixesTitle;
                document.getElementById('examples-title').innerText = d.examplesTitle;
                document.getElementById('col-feature').innerText = d.colFeature;
                document.getElementById('col-lite').innerText = d.colLite;
                document.getElementById('col-titan').innerText = d.colTitan;
                document.getElementById('sections-summary').innerText = d.sectionsSummary;
                document.getElementById('monitoring-title').innerText = d.monitoringTitle;
                document.getElementById('monitoring-body').innerText = d.monitoringBody;
                document.getElementById('price-anchor').innerText = d.priceAnchor;
                document.getElementById('price-today').innerText = d.priceToday;
                document.getElementById('btn-pay').innerText = d.btnPay;
                document.getElementById('btn-pay-sticky').innerText = d.stickyCta;
                document.getElementById('checkout-hint').innerText = d.checkoutHint;
                document.getElementById('terms-line').innerHTML = d.termsLine;
                document.getElementById('overlay-title').innerText = d.overlayTitle;
                document.getElementById('overlay-sub').innerText = d.overlaySub;
                document.getElementById('faq-title').innerText = d.faqTitle;
                document.getElementById('free-lite-link').innerText = d.freeLiteLink;
                document.getElementById('leaks-title').innerText = d.leaksTitle;
                document.getElementById('leaks-wait').innerText = d.leaksWait;
                document.getElementById('cancel-notice-en').classList.toggle('hidden-flow', currentLang !== 'en');
                document.getElementById('cancel-notice-es').classList.toggle('hidden-flow', currentLang !== 'es');
                document.getElementById('lang-en').classList.toggle('pc-purple', currentLang === 'en');
                document.getElementById('lang-en').classList.toggle('text-zinc-500', currentLang !== 'en');
                document.getElementById('lang-es').classList.toggle('pc-purple', currentLang === 'es');
                document.getElementById('lang-es').classList.toggle('text-zinc-500', currentLang !== 'es');

                document.getElementById('examples-list').innerHTML = EXAMPLES.map(function(row) {
                    return '<div class="pc-card"><p class="text-[10px] font-bold uppercase tracking-wider text-rose-400/90">Flaw</p><p class="pc-break mt-1 text-sm text-zinc-200">' + row.flaw + '</p><p class="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">Recommendation</p><p class="pc-break mt-1 text-sm text-zinc-300">' + row.fix + '</p></div>';
                }).join('');

                document.getElementById('compare-body').innerHTML = COMPARE.map(function(row) {
                    return '<tr><td class="text-zinc-300">' + row.feature + '</td><td class="text-zinc-500">' + row.lite + '</td><td class="col-titan font-semibold text-violet-200">' + row.titan + '</td></tr>';
                }).join('');

                document.getElementById('sections-list').innerHTML = SECTIONS.map(function(s, i) {
                    return '<li class="pc-break flex gap-3"><span class="font-mono text-xs font-bold text-violet-500/80">' + String(i + 1).padStart(2, '0') + '</span><span>' + s + '</span></li>';
                }).join('');

                document.getElementById('faq-list').innerHTML = d.faq.map(function(item) {
                    return '<details class="pc-details pc-card"><summary>' + item.q + '</summary><p class="pc-break mt-3 text-sm text-zinc-500 leading-relaxed">' + item.a + '</p></details>';
                }).join('');
            }

            function setHeadline(hasLeaks) {
                const d = copy();
                document.getElementById('headline').innerText = hasLeaks ? d.headlineLeaks : d.headlineDefault;
                document.getElementById('subhead').innerText = hasLeaks ? d.subheadLeaks : d.subheadDefault;
            }

            function renderLeaks(leaks) {
                const list = document.getElementById('leaks-list');
                const block = document.getElementById('leaks-block');
                const wait = document.getElementById('leaks-wait');
                if (!leaks || !leaks.length) {
                    wait.classList.add('hidden-flow');
                    setHeadline(false);
                    return;
                }
                wait.classList.add('hidden-flow');
                block.classList.remove('hidden-flow');
                setHeadline(true);
                list.innerHTML = leaks.slice(0, 3).map(function(leak) {
                    const label = currentLang === 'es' ? ('Fuga #' + leak.index) : ('Leak #' + leak.index);
                    const text = leak.text || '';
                    return '<li class="pc-leak"><span class="pc-leak-label">' + label + '</span><p class="pc-break mt-1 text-sm text-zinc-200 m-0">' + text + '</p></li>';
                }).join('');
            }

            function renderMetrics(metrics) {
                if (!metrics) return;
                const parts = [];
                if (metrics.seoScore != null) parts.push('SEO ' + metrics.seoScore + '/100');
                if (metrics.aiScore != null) parts.push((currentLang === 'es' ? 'IA ' : 'AI ') + metrics.aiScore + '/100');
                if (metrics.loadTimeSec != null) parts.push((currentLang === 'es' ? 'Carga ' : 'Load ') + metrics.loadTimeSec + 's');
                if (!parts.length) return;
                const el = document.getElementById('metrics-line');
                el.innerText = parts.join(' · ');
                el.classList.remove('hidden-flow');
            }

            async function loadContext() {
                try {
                    const q = new URLSearchParams({ email: email, dna: dna });
                    const res = await fetch('/titan-context?' + q.toString());
                    const data = await res.json().catch(function() { return {}; });
                    if (data.titanAcquired) {
                        document.getElementById('checkout-hint').innerText = currentLang === 'es'
                            ? 'Ya tienes Titán activo para este correo — revisa tu bandeja.'
                            : 'Titan already active for this email — check your inbox.';
                        document.getElementById('btn-pay').disabled = true;
                        document.getElementById('btn-pay-sticky').disabled = true;
                    }
                    renderLeaks(data.leaks || []);
                    renderMetrics(data.metrics || {});
                } catch (e) {
                    document.getElementById('leaks-wait').classList.add('hidden-flow');
                    setHeadline(false);
                }
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
                const d = copy();
                const btn = document.getElementById('btn-pay');
                const sticky = document.getElementById('btn-pay-sticky');
                if (!email || !dna) {
                    setError(d.errMissing);
                    return;
                }
                setError('');
                btn.disabled = true;
                sticky.disabled = true;
                btn.innerText = d.btnLoading;
                sticky.innerText = d.btnLoading;
                showOverlay();
                trackAdsFunnel('cta_click', { action: 'titan_checkout_started', email: email, dna: dna });
                if (typeof fbq === 'function') {
                    fbq('track', 'InitiateCheckout', { value: PRICE, currency: 'USD', content_name: 'Titan Report' });
                }

                const cancelParams = new URLSearchParams({ email: email, dna: dna, lang: currentLang });
                if (refCode) cancelParams.set('ref', refCode);
                const cancelUrl = window.location.origin + '/titan?' + cancelParams.toString();

                try {
                    const res = await fetch('/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            dna: dna,
                            lang: currentLang,
                            refCode: refCode,
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
                    sticky.disabled = false;
                    btn.innerText = d.btnPay;
                    sticky.innerText = d.stickyCta;
                    setError(err.message || d.errNetwork);
                }
            }

            document.getElementById('target-display').innerText = dna || '—';
            document.getElementById('email-display').innerText = email || '—';
            applyLang();
            loadContext();

            document.getElementById('btn-pay').addEventListener('click', startCheckout);
            document.getElementById('btn-pay-sticky').addEventListener('click', startCheckout);
            document.getElementById('lang-en').addEventListener('click', function() { currentLang = 'en'; applyLang(); loadContext(); });
            document.getElementById('lang-es').addEventListener('click', function() { currentLang = 'es'; applyLang(); loadContext(); });

            var payBtn = document.getElementById('btn-pay');
            var stickyBar = document.getElementById('sticky-cta');
            function onScroll() {
                if (!payBtn || !stickyBar) return;
                var rect = payBtn.getBoundingClientRect();
                var show = rect.bottom < 0 || rect.top > window.innerHeight;
                stickyBar.classList.toggle('hidden-flow', !show);
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        })();
    </script>
</body>
</html>`;
}

module.exports = { getTitanUpgradeHTML };
