// landing.js — conversion-focused landing (non-repetitive, Titan-first)

const { getFaviconHeadTags, TITAN_REPORT_PAGE_COUNT, getSupportEmail } = require('./brand');

function getLandingHTML() {
    const supportEmail = getSupportEmail();
    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore | Find why your page loses customers</title>
        <meta name="description" content="PredictaCore audits your website or social profile from the public URL only. 15 conversion leaks + tactical fixes in a PDF. Titan Report USD $199 intro. Free Lite scan available.">
        <meta name="application-name" content="PredictaCore">
        <meta property="og:site_name" content="PredictaCore">
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
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1734011764438170&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Meta Pixel Code -->

        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap');
            :root { --pc-emerald: #10b981; --pc-dark-bg: #050505; }
            body { background: var(--pc-dark-bg); color: #d1d5db; font-family: 'Inter', sans-serif; overflow-x: hidden; font-size: 16px; line-height: 1.6; }
            .glass-panel { background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); }
            .text-huge { font-size: clamp(2rem, 5.5vw, 3.75rem); line-height: 1.05; font-weight: 900; letter-spacing: -0.04em; }
            .hidden-flow { display: none !important; }
            .terminal-box { background: rgba(0,0,0,0.88); border: 1px solid rgba(16,185,129,0.35); border-radius: 0.75rem; }
            .scan-line { width: 100%; height: 2px; background: var(--pc-emerald); position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.35; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            .lang-btn { cursor: pointer; transition: all 0.2s; opacity: 0.45; font-size: 0.75rem; }
            .lang-btn.active { opacity: 1; color: var(--pc-emerald); font-weight: 700; }
            .mesh-bg { position: fixed; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% -10%, #134e4a33 0%, transparent 55%); z-index: -1; }
            .pc-body { font-size: 1rem; line-height: 1.65; }
            .pc-small { font-size: 0.875rem; line-height: 1.55; }
            .pc-input { font-size: 1rem; letter-spacing: 0; text-transform: none; }
            .asset-option { position: relative; cursor: pointer; border: 1px solid #3f3f46; border-radius: 0.5rem; padding: 0.75rem 0.5rem; text-align: center; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #a1a1aa; background: #0a0a0a; transition: all 0.15s; }
            .asset-option:hover { border-color: #52525b; color: #e4e4e7; }
            .asset-option.selected { border-color: #10b981; color: #10b981; background: rgba(16,185,129,0.08); box-shadow: 0 0 0 1px rgba(16,185,129,0.25); }
            .asset-option input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
            .report-card { background: #fafafa; color: #18181b; border-radius: 0.5rem; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.45); }
            .score-pill { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; font-weight: 700; }
            .faq-item { border: 1px solid #27272a; border-radius: 0.75rem; background: rgba(0,0,0,0.4); overflow: hidden; }
            .faq-item summary { cursor: pointer; list-style: none; padding: 1rem 1.25rem; font-weight: 600; color: #fafafa; font-size: 1rem; }
            .faq-item summary::-webkit-details-marker { display: none; }
            .faq-item[open] summary { border-bottom: 1px solid #27272a; color: #34d399; }
            .faq-answer { padding: 1rem 1.25rem 1.25rem; color: #a1a1aa; font-size: 0.9375rem; line-height: 1.65; }
            .sample-panel-title { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #71717a; margin-bottom: 0.75rem; }
            .sample-row { display: flex; justify-content: space-between; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #e4e4e7; font-size: 0.875rem; }
            .sample-row:last-child { border-bottom: none; }
            .sample-status-ok { color: #15803d; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
            .sample-status-warn { color: #b45309; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
            .sample-status-bad { color: #b91c1c; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
            .sample-ai-row { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; align-items: start; padding: 0.45rem 0; border-bottom: 1px solid #e4e4e7; font-size: 0.875rem; }
            .sample-ai-row:last-child { border-bottom: none; }
            .stars { color: #fbbf24; font-size: 0.875rem; letter-spacing: 0.12em; }
            .review-card { border: 1px solid #27272a; border-radius: 0.75rem; background: rgba(0,0,0,0.45); padding: 1.25rem; height: 100%; }
            .review-tag { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; }
            .pdf-mockup { transform: rotate(-1.5deg); transition: transform 0.35s ease; }
            .pdf-mockup:hover { transform: rotate(0deg); }
            .compare-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.9375rem; }
            .compare-table th, .compare-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #27272a; text-align: left; vertical-align: top; }
            .compare-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #71717a; background: rgba(0,0,0,0.35); }
            .compare-table .col-titan { background: rgba(16,185,129,0.06); color: #ecfdf5; }
            .compare-yes { color: #34d399; font-weight: 700; }
            .compare-no { color: #71717a; }
            .compare-partial { color: #fbbf24; font-weight: 600; }
            .customer-extract-box { border: 2px solid rgba(16,185,129,0.35); border-radius: 1rem; background: rgba(0,0,0,0.55); padding: 1.25rem; position: relative; }
            @media (min-width: 768px) { .customer-extract-box { padding: 1.5rem; } }
            .customer-extract-pin { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0.75rem 1rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #27272a; }
            .customer-extract-label { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.6875rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #10b981; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35); padding: 0.35rem 0.65rem; border-radius: 9999px; white-space: nowrap; }
            .customer-extract-note { flex: 1; min-width: 12rem; font-size: 0.8125rem; line-height: 1.5; color: #a1a1aa; margin: 0; }
            .extract-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-bottom: 1.25rem; }
            @media (min-width: 768px) { .extract-metrics { grid-template-columns: repeat(4, 1fr); } }
            .extract-metric { background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.22); border-radius: 0.5rem; padding: 0.7rem 0.75rem; text-align: center; }
            .extract-metric-value { font-size: 1.125rem; font-weight: 800; color: #34d399; line-height: 1.2; font-family: 'JetBrains Mono', monospace; }
            .extract-metric-label { font-size: 0.625rem; color: #71717a; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 0.35rem; line-height: 1.35; }
            .extract-metric-sub { font-size: 0.625rem; color: #52525b; margin-top: 0.2rem; }
            #sticky-cta { transform: translateY(100%); transition: transform 0.3s ease; }
            #sticky-cta.visible { transform: translateY(0); }
        </style>
    </head>
    <body class="antialiased pb-20 md:pb-0">
        <div class="mesh-bg"></div>

        <nav class="fixed top-0 w-full z-50 px-4 py-4 md:px-6 md:py-5 flex justify-between items-center glass-panel border-b border-white/5">
            <span class="font-black tracking-tighter text-lg md:text-xl text-white uppercase">PREDICTA<span class="text-emerald-500">CORE</span></span>
            <div class="flex items-center gap-3 md:gap-5">
                <div class="flex gap-2 px-2.5 py-1 rounded-full border border-zinc-800 bg-black/50">
                    <span id="lang-en" class="lang-btn active">EN</span>
                    <span class="text-zinc-700">/</span>
                    <span id="lang-es" class="lang-btn">ES</span>
                </div>
                <a href="#buy-section" id="nav-titan" class="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded transition-colors">Get Titan — $199</a>
            </div>
        </nav>

        <!-- HERO -->
        <section class="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-6">
            <div class="max-w-4xl mx-auto text-center">
                <p id="hero-badge" class="inline-block text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-950/40 border border-emerald-500/25 px-3 py-1 rounded-full mb-6">Independent page review · no login</p>
                <h1 id="hero-title" class="text-huge text-white mb-5">Find out why your page is <span class="text-emerald-500">losing sales</span></h1>
                <p id="hero-value" class="pc-body text-zinc-300 max-w-2xl mx-auto mb-6">PredictaCore reviews your public website or social page the way a first-time visitor would — then sends you a clear PDF report by email. You'll see how your page looks, how easy it is to find on Google, how you compare to competitors, what makes people leave without buying, what to fix first, and a simple 21-day plan to turn more visitors into customers.</p>
                <a href="#buy-section" id="hero-cta-mid" class="inline-block mb-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-8 rounded-lg text-base uppercase tracking-wide transition-all shadow-[0_0_24px_rgba(16,185,129,0.22)]">Get Titan Report — $199</a>
                <p id="hero-price-anchor" class="text-sm md:text-base text-emerald-400 font-bold max-w-xl mx-auto mb-5 leading-snug">Don't spend $3,000 on an agency for a report in weeks to deliver — we deliver yours in ~60 minutes. No fluff — hard scores, ranked leaks, and fixes only.</p>
                <p id="hero-ask" class="pc-body text-zinc-400 max-w-xl mx-auto mb-6">When you're ready, share your link below — your website or one Instagram, Facebook, or TikTok profile. No passwords or complicated setup.</p>
                <div class="inline-flex flex-col sm:flex-row items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 mb-6">
                    <div class="inline-flex items-center gap-2">
                        <span id="hero-price-label" class="text-zinc-400 text-sm">Titan Report</span>
                        <span class="text-2xl font-black text-white">$199</span>
                        <span id="hero-price-note" class="text-xs text-emerald-500 font-semibold">intro · one-time</span>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
                    <a href="#buy-section" id="hero-cta-titan" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-lg text-base uppercase tracking-wide transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)]">Get Titan Report — $199</a>
                    <a href="#lite-section" id="hero-cta-lite" class="text-zinc-400 hover:text-white text-sm font-semibold py-4 px-4 underline-offset-4 hover:underline">Or start with a free Lite scan →</a>
                </div>
                <p id="hero-delivery" class="mt-5 text-sm text-zinc-500">PDF delivered from <span class="text-zinc-300">${supportEmail}</span> · usually within 60 minutes</p>
                <p id="hero-trust" class="mt-2 text-sm text-zinc-600">One asset per scan · web or one Instagram, Facebook, or TikTok profile</p>
            </div>
        </section>

        <!-- SAMPLE REPORT -->
        <section id="sample-section" class="py-14 md:py-16 px-4 md:px-6 border-y border-zinc-900 bg-black/30">
            <div class="max-w-5xl mx-auto">
                <p id="sample-kicker" class="text-xs font-bold uppercase tracking-widest text-emerald-500 text-center mb-2">Sample extract</p>
                <h2 id="sample-title" class="text-2xl md:text-3xl font-black text-white text-center mb-3">This is what lands in your inbox</h2>
                <p id="sample-sub" class="pc-body text-zinc-400 text-center max-w-2xl mx-auto mb-10">Below: the PDF you get by email, plus a pinned customer extract from a real audit. Full Titan PDF = <strong class="text-zinc-200">${TITAN_REPORT_PAGE_COUNT} pages</strong>, <strong class="text-zinc-200">11 sections</strong>, <strong class="text-zinc-200">15 ranked leaks</strong>, and <strong class="text-zinc-200">15 fixes</strong>.</p>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-center">
                    <div class="pdf-mockup report-card p-8 md:p-9 text-left shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
                        <p id="pdf-mock-tag" class="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-700">Forensic conversion report</p>
                        <div class="w-14 h-1.5 bg-emerald-500 my-4"></div>
                        <p class="font-black text-xl text-zinc-900 uppercase tracking-tighter leading-none">PREDICTA<span class="text-emerald-600">CORE</span></p>
                        <p id="pdf-mock-title" class="text-lg font-black text-zinc-800 uppercase mt-2 tracking-tight">Titan Intelligence</p>
                        <p id="pdf-mock-meta" class="text-sm text-zinc-600 mt-4 leading-relaxed">${TITAN_REPORT_PAGE_COUNT}-page PDF · 11 sections · email attachment</p>
                        <ul id="pdf-mock-toc" class="mt-5 space-y-1.5 text-[11px] text-zinc-600 leading-snug">
                            <li>I. Executive summary &amp; page health</li>
                            <li>II. Buyer psychology profiles</li>
                            <li>III. Commercial scorecard</li>
                            <li>IV. Google SEO &amp; AI visibility</li>
                            <li>V–VII. Competitors, SWOT, wishlist</li>
                            <li>VIII. 15 reasons people leave</li>
                            <li>IX. 15 recommended fixes</li>
                            <li>X–XI. Tools &amp; 21-day plan</li>
                        </ul>
                        <p id="pdf-mock-from" class="text-[11px] text-zinc-500 mt-6 pt-4 border-t border-zinc-200">Delivered from ${supportEmail}</p>
                    </div>
                    <div class="lg:col-span-2 text-left">
                        <p id="pdf-mock-caption" class="text-lg text-zinc-200 font-semibold mb-3">This is the file you receive — not what your customers see</p>
                        <p id="pdf-mock-desc" class="pc-body text-zinc-400 mb-4">A complete PDF in your inbox — not a dashboard login. Forward it to your team, implement from section IX, and track with the 21-day roadmap in section XI.</p>
                        <p id="pdf-mock-proof" class="text-sm text-emerald-500/90 font-medium">Same ${TITAN_REPORT_PAGE_COUNT}-page format for websites, service businesses, and social profiles.</p>
                    </div>
                </div>

                <div class="customer-extract-box">
                    <div class="customer-extract-pin">
                        <span id="sample-extract-label" class="customer-extract-label">📌 Customer extract</span>
                        <p id="sample-extract-note" class="customer-extract-note">Don't spend $3,000 on an agency for a report in weeks.<br><span class="text-zinc-300">Custom baby bedding Shopify store (US e-commerce). Scores and findings are real.</span></p>
                    </div>
                    <div id="sample-extract-metrics" class="extract-metrics">
                        <div class="extract-metric">
                            <p class="extract-metric-value">+19%</p>
                            <p id="sample-metric-1-label" class="extract-metric-label">Add-to-cart · personalized SKUs</p>
                            <p id="sample-metric-1-sub" class="extract-metric-sub">After shipping-date badge (fix #09)</p>
                        </div>
                        <div class="extract-metric">
                            <p class="extract-metric-value">61 → 76</p>
                            <p id="sample-metric-2-label" class="extract-metric-label">Google SEO score</p>
                            <p id="sample-metric-2-sub" class="extract-metric-sub">H1 + meta trim · 5 weeks</p>
                        </div>
                        <div class="extract-metric">
                            <p class="extract-metric-value">−13%</p>
                            <p id="sample-metric-3-label" class="extract-metric-label">Bounce rate · product pages</p>
                            <p id="sample-metric-3-sub" class="extract-metric-sub">Snippet + headline fixes</p>
                        </div>
                        <div class="extract-metric">
                            <p class="extract-metric-value">4.3s → 2.8s</p>
                            <p id="sample-metric-4-label" class="extract-metric-label">Mobile load time</p>
                            <p id="sample-metric-4-sub" class="extract-metric-sub">Image compression pass</p>
                        </div>
                    </div>
                    <p id="sample-metrics-foot" class="text-[11px] text-zinc-500 text-center mb-4 leading-relaxed">Measured ~6 weeks after applying section IX fixes · same Shopify store as extract above</p>
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start mb-6">
                    <div class="lg:col-span-2 report-card p-6 md:p-7">
                        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-200">
                            <div class="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p id="sample-case" class="font-bold text-zinc-900 text-sm leading-tight">Custom baby bedding · Shopify</p>
                                <p id="sample-industry" class="text-xs text-zinc-500">Personalized milestone products · US market</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-3 mb-5">
                            <div class="text-center p-3 bg-zinc-100 rounded-lg">
                                <p class="text-xs text-zinc-500 mb-1">Google SEO</p>
                                <p class="score-pill text-amber-700">61</p>
                            </div>
                            <div class="text-center p-3 bg-zinc-100 rounded-lg">
                                <p class="text-xs text-zinc-500 mb-1">AI visibility</p>
                                <p class="score-pill text-emerald-700">85</p>
                            </div>
                            <div class="text-center p-3 bg-zinc-100 rounded-lg">
                                <p class="text-xs text-zinc-500 mb-1">Load</p>
                                <p class="score-pill text-zinc-800">4.3s</p>
                            </div>
                        </div>
                        <p id="sample-caption" class="text-xs text-zinc-500 leading-relaxed">Real scores from a live audit — same checks we run on your page.</p>
                    </div>

                    <div class="lg:col-span-3 space-y-4">
                        <div class="report-card p-5 border-l-4 border-red-500">
                            <p id="sample-leak-h1" class="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">What scares buyers · #04</p>
                            <p id="sample-leak1" class="text-sm text-zinc-800 leading-relaxed"><strong>Google cuts off your description.</strong> The text under your name in search results is too long — shoppers never see your personalized blanket keywords before the snippet ends.</p>
                        </div>
                        <div class="report-card p-5 border-l-4 border-amber-500">
                            <p id="sample-leak-h2" class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">What scares buyers · #09</p>
                            <p id="sample-leak2" class="text-sm text-zinc-800 leading-relaxed"><strong>No delivery date on custom orders.</strong> Made-to-order products show photos and price, but buyers can't see when it ships — so they hesitate on personalized items.</p>
                        </div>
                        <div class="report-card p-5 border-l-4 border-emerald-600 bg-emerald-50">
                            <p id="sample-fix-h" class="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">What to fix first · #09</p>
                            <p id="sample-action" class="text-sm text-zinc-800 leading-relaxed">Add a clear <strong>Ships in 5–7 business days</strong> badge above Add to Cart on every personalized product page.</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="report-card p-5 md:p-6">
                        <p id="sample-seo-title" class="sample-panel-title">How you show up on Google</p>
                        <div id="sample-seo-rows">
                            <div class="sample-row"><span>Page title</span><span class="sample-status-ok">OK</span></div>
                            <div class="sample-row"><span>Main headline (H1)</span><span class="sample-status-bad">Missing</span></div>
                            <div class="sample-row"><span>Product image labels</span><span class="sample-status-bad">6% only</span></div>
                            <div class="sample-row"><span>Rich results (stars, price in search)</span><span class="sample-status-bad">None</span></div>
                            <div class="sample-row"><span>Sitemap &amp; robots.txt</span><span class="sample-status-ok">Found</span></div>
                            <div class="sample-row"><span>Page speed</span><span class="sample-status-warn">4.3 sec</span></div>
                        </div>
                        <p id="sample-seo-note" class="text-xs text-zinc-500 mt-4 leading-relaxed">Without a main headline and product data for Google, your store ranks weaker and looks less trustworthy in search — even when traffic arrives.</p>
                    </div>
                    <div class="report-card p-5 md:p-6">
                        <p id="sample-ai-title" class="sample-panel-title">How ChatGPT &amp; other AIs see you</p>
                        <div id="sample-ai-rows">
                            <div class="sample-ai-row"><span>Overall AI readiness</span><span class="score-pill text-emerald-700">85/100</span></div>
                            <div class="sample-ai-row"><span>ChatGPT (OpenAI)</span><span class="sample-status-warn">Can cite you — with errors</span></div>
                            <div class="sample-ai-row"><span>Claude (Anthropic)</span><span class="sample-status-warn">Can cite you — with errors</span></div>
                            <div class="sample-ai-row"><span>Perplexity</span><span class="sample-status-warn">Can cite you — with errors</span></div>
                            <div class="sample-ai-row"><span>Google AI Overviews</span><span class="sample-status-warn">Allowed — hard to feature</span></div>
                        </div>
                        <p id="sample-ai-note" class="text-xs text-zinc-500 mt-4 leading-relaxed">AIs are allowed to read this shop, but with no structured product data and no clear main headline they guess — and may recommend a competitor with a clearer page instead.</p>
                    </div>
                </div>
                </div>
                <p id="sample-foot" class="text-sm text-zinc-500 text-center mt-8">What you see above is a small extract. The full ${TITAN_REPORT_PAGE_COUNT}-page PDF also includes buyer profiles, competitor comparison, screenshots, and a 21-day action plan.</p>
            </div>
        </section>

        <!-- WHAT'S INCLUDED (single block, no duplicate pricing cards) -->
        <section class="py-14 md:py-16 px-4 md:px-6">
            <div class="max-w-4xl mx-auto">
                <h2 id="included-title" class="text-2xl md:text-3xl font-black text-white text-center mb-8">Everything in the Titan Report</h2>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pc-body text-zinc-300">
                    <li id="inc-1" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> Desktop + mobile capture with measured load time</li>
                    <li id="inc-2" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> SEO forensics: title, meta, schema, sitemap, robots</li>
                    <li id="inc-3" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> AI discoverability score (GEO) 0–100</li>
                    <li id="inc-4" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> 4 buyer psychology profiles for your industry</li>
                    <li id="inc-5" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> 15 ranked drop-offs + 15 tactical actions</li>
                    <li id="inc-6" class="flex gap-3"><span class="text-emerald-500 shrink-0">✓</span> Competitive benchmark + 21-day implementation roadmap</li>
                </ul>
                <p id="included-foot" class="text-center text-sm text-zinc-500 mt-8 max-w-lg mx-auto">Structured PDF by email — not a ChatGPT paragraph. More deliverables than agencies charging $3k+ for the same public URL review.</p>
            </div>
        </section>

        <!-- LITE VS TITAN -->
        <section id="compare-section" class="py-14 md:py-16 px-4 md:px-6 border-y border-zinc-900 bg-black/40">
            <div class="max-w-3xl mx-auto">
                <h2 id="compare-title" class="text-2xl md:text-3xl font-black text-white text-center mb-2">Lite vs Titan — side by side</h2>
                <p id="compare-sub" class="pc-body text-zinc-400 text-center mb-8 max-w-xl mx-auto">Lite is a free teaser. Titan is the full ${TITAN_REPORT_PAGE_COUNT}-page report that shows every reason people leave and what to do about it.</p>
                <div class="overflow-x-auto rounded-xl border border-zinc-800">
                    <table class="compare-table">
                        <thead>
                            <tr>
                                <th id="compare-th-feature">What you get</th>
                                <th id="compare-th-lite">Lite · Free</th>
                                <th id="compare-th-titan" class="col-titan">Titan · $199</th>
                            </tr>
                        </thead>
                        <tbody id="compare-body">
                            <tr><td>Conversion problems found</td><td class="compare-partial">3 only</td><td class="col-titan compare-yes">All 15 ranked</td></tr>
                            <tr><td>Recommended fixes</td><td class="compare-no">Summary only</td><td class="col-titan compare-yes">15 step-by-step actions</td></tr>
                            <tr><td>Google SEO scorecard</td><td class="compare-partial">Snapshot</td><td class="col-titan compare-yes">Full forensic breakdown</td></tr>
                            <tr><td>AI visibility (ChatGPT, etc.)</td><td class="compare-partial">Score only</td><td class="col-titan compare-yes">Engine-by-engine verdict</td></tr>
                            <tr><td>Competitor comparison</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr>
                            <tr><td>Buyer psychology profiles</td><td class="compare-partial">Brief</td><td class="col-titan compare-yes">4 profiles by industry</td></tr>
                            <tr><td>Desktop + mobile screenshots</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr>
                            <tr><td>21-day action plan</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr>
                            <tr><td>Report length</td><td class="compare-partial">Short teaser</td><td class="col-titan compare-yes">${TITAN_REPORT_PAGE_COUNT} pages</td></tr>
                        </tbody>
                    </table>
                </div>
                <p id="compare-foot" class="text-center text-sm text-zinc-500 mt-6">Most owners start with Lite, then upgrade when they see how much is still hidden.</p>
            </div>
        </section>

        <!-- REVIEWS -->
        <section id="reviews-section" class="py-14 md:py-16 px-4 md:px-6 bg-emerald-950/10 border-b border-zinc-900">
            <div class="max-w-5xl mx-auto">
                <h2 id="reviews-title" class="text-2xl md:text-3xl font-black text-white text-center mb-2">Trusted by shop owners &amp; creators</h2>
                <p id="reviews-sub" class="pc-body text-zinc-400 text-center mb-10 max-w-xl mx-auto">Real feedback from different business types — website, local services, and social profiles.</p>
                <div id="reviews-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <article class="review-card">
                        <p class="stars mb-3" aria-label="5 stars">★★★★★</p>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-4">"We fixed three product-page issues from section IX and personalized orders jumped <strong class="text-white">28% in two weeks</strong>. Worth every dollar vs waiting on an agency quote."</p>
                        <p class="review-tag mb-1">E-commerce · website</p>
                        <p class="text-white font-semibold text-sm">Sarah M.</p>
                        <p class="text-zinc-500 text-xs">Custom baby products · US</p>
                    </article>
                    <article class="review-card">
                        <p class="stars mb-3" aria-label="5 stars">★★★★★</p>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-4">"Our booking page looked fine to us. The report showed why people weren't calling — we rewrote the hero and online bookings rose <strong class="text-white">41% in a month</strong>."</p>
                        <p class="review-tag mb-1">Local services · website</p>
                        <p class="text-white font-semibold text-sm">Dr. James R.</p>
                        <p class="text-zinc-500 text-xs">Dental clinic · Texas</p>
                    </article>
                    <article class="review-card">
                        <p class="stars mb-3" aria-label="5 stars">★★★★★</p>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-4">"I sell coaching through Instagram. The audit flagged my link-in-bio and highlight order — DMs asking for pricing went up <strong class="text-white">34%</strong> after I applied the checklist."</p>
                        <p class="review-tag mb-1">Instagram · social profile</p>
                        <p class="text-white font-semibold text-sm">Elena V.</p>
                        <p class="text-zinc-500 text-xs">Business coach · Miami</p>
                    </article>
                    <article class="review-card">
                        <p class="stars mb-3" aria-label="5 stars">★★★★★</p>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-4">"We only had a Facebook page, no real site. Still got a full PDF — fixed our menu photos and hours clarity and walk-ins increased <strong class="text-white">19% in three weeks</strong>."</p>
                        <p class="review-tag mb-1">Facebook · social profile</p>
                        <p class="text-white font-semibold text-sm">Tom &amp; Ana K.</p>
                        <p class="text-zinc-500 text-xs">Neighborhood café · Chicago</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq-section" class="py-14 md:py-16 px-4 md:px-6">
            <div class="max-w-2xl mx-auto">
                <h2 id="faq-title" class="text-2xl font-black text-white text-center mb-8">Questions before you pay</h2>
                <div class="space-y-3">
                    <details class="faq-item" open>
                        <summary id="faq-q1">Do I need to give you analytics or backend access?</summary>
                        <p id="faq-a1" class="faq-answer">No. We only need your public URL — website or one social profile. We scan exactly what a stranger sees before they buy.</p>
                    </details>
                    <details class="faq-item">
                        <summary id="faq-q2">What's the difference between Lite and Titan?</summary>
                        <p id="faq-a2" class="faq-answer">Lite is free and shows 3 critical leaks plus a score snapshot. Titan is the full 11-section PDF with all 15 leaks, 15 tactical actions, buyer profiles, benchmark, and roadmap — USD $199 introductory price.</p>
                    </details>
                    <details class="faq-item">
                        <summary id="faq-q3">How fast do I get the report?</summary>
                        <p id="faq-a3" class="faq-answer">Most reports arrive within 60 minutes by email. Check spam and Promotions. Titan delivery starts right after payment; Lite after your free scan completes.</p>
                    </details>
                    <details class="faq-item">
                        <summary id="faq-q4">What does $25/month monitoring mean?</summary>
                        <p id="faq-a4" class="faq-answer">USD $199 is charged today for the Titan Report. Monitoring ($25/mo) starts 30 days later and renews unless you cancel via audit@predictacore.ai or the Stripe billing portal. See Terms for full details.</p>
                    </details>
                    <details class="faq-item">
                        <summary id="faq-q5">Can I scan Instagram, Facebook, or TikTok instead of a website?</summary>
                        <p id="faq-a5" class="faq-answer">Yes — pick one network and enter your @handle. One asset per scan: either your website or a single public social profile.</p>
                    </details>
                </div>
            </div>
        </section>

        <!-- BUY (Titan primary) -->
        <section id="buy-section" class="py-14 md:py-16 px-4 md:px-6 bg-emerald-950/15 border-t border-emerald-900/30">
            <div class="max-w-xl mx-auto">
                <h2 id="buy-title" class="text-2xl md:text-3xl font-black text-white text-center mb-2">Get your Titan Report</h2>
                <p id="buy-sub" class="pc-body text-zinc-400 text-center mb-2">Enter your page and email — secure Stripe checkout.</p>
                <p id="buy-delivery" class="text-sm text-emerald-500/90 text-center mb-8">Your PDF arrives from ${supportEmail} · usually within 60 minutes</p>

                <div id="setup-stage" class="terminal-box p-6 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
                    <p id="asset-picker-label" class="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Where is your page?</p>
                    <div id="asset-type-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        <label class="asset-option selected" data-asset="web">
                            <input type="radio" name="asset-type" value="web" checked>
                            <span id="asset-label-web">Website</span>
                        </label>
                        <label class="asset-option" data-asset="instagram">
                            <input type="radio" name="asset-type" value="instagram">
                            <span id="asset-label-instagram">Instagram</span>
                        </label>
                        <label class="asset-option" data-asset="facebook">
                            <input type="radio" name="asset-type" value="facebook">
                            <span id="asset-label-facebook">Facebook</span>
                        </label>
                        <label class="asset-option" data-asset="tiktok">
                            <input type="radio" name="asset-type" value="tiktok">
                            <span id="asset-label-tiktok">TikTok</span>
                        </label>
                    </div>
                    <div class="space-y-4">
                        <input type="text" id="dna-url" placeholder="yourbusiness.com" class="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono pc-input" autocomplete="off">
                        <p id="url-preview" class="text-xs text-zinc-600 text-center font-mono break-all"></p>
                        <input type="email" id="user-email" placeholder="you@email.com" class="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono pc-input">
                        <p id="buy-price-line" class="text-sm text-center text-zinc-400">Charged today: <strong class="text-white">USD $199</strong> · monitoring $25/mo from day 30</p>
                        <p id="setup-error" class="hidden-flow text-sm text-red-400 text-center font-medium" role="alert"></p>
                        <button type="button" id="btn-titan" class="w-full bg-emerald-600 text-white font-black py-4 rounded-lg hover:bg-emerald-500 transition-all uppercase tracking-wide text-base disabled:opacity-60 disabled:cursor-wait shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                            Pay $199 — Get Titan Report
                        </button>
                        <p id="checkout-error" class="hidden-flow text-sm text-red-400 text-center" role="alert"></p>
                        <p id="cancel-badge" class="text-xs text-zinc-500 text-center leading-relaxed">By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a></p>
                        <p id="titan-eta-before" class="text-xs text-zinc-600 text-center">PDF may take up to 60 minutes after payment. Statement: PREDICTACORE.</p>
                    </div>
                </div>

                <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.2)] mt-6">
                    <div class="scan-line"></div>
                    <div id="terminal-output" class="font-mono text-sm text-emerald-500 space-y-1 h-48 overflow-y-auto">
                        <p id="log-init">>> INITIALIZING PREDICTACORE CORE...</p>
                    </div>
                </div>

                <div id="upsell-stage" class="hidden-flow terminal-box p-8 text-center mt-6 border border-emerald-500/50">
                    <h2 id="up-t" class="text-xl font-black text-white mb-2">Scan complete</h2>
                    <p class="text-zinc-400 text-sm mb-2" id="up-st">Successfully sent to <span id="sent-email" class="text-white font-bold"></span>.</p>
                    <p id="lite-queued-msg" class="text-emerald-500 text-sm font-semibold mb-4">Your Lite report is being generated and will arrive by email.</p>
                    <p id="lite-eta-after" class="text-amber-500/90 text-sm mb-6">Check inbox and spam — delivery up to 60 minutes.</p>
                    <div class="bg-zinc-900 border border-zinc-700 p-5 rounded-lg mb-6 text-left">
                        <p id="box-text" class="text-sm text-zinc-300 leading-relaxed">Initial scan shows critical bottlenecks. The Titan Report finds all 15 leaks plus tactical fixes.</p>
                    </div>
                    <button type="button" id="btn-titan-upsell" class="w-full bg-emerald-600 text-white font-black py-4 rounded-lg text-base uppercase tracking-wide">Get Full Titan Report — $199</button>
                </div>
            </div>
        </section>

        <!-- LITE (secondary, hidden in ads mode) -->
        <section id="lite-section" class="py-12 px-4 md:px-6 border-t border-zinc-900">
            <div class="max-w-xl mx-auto text-center">
                <h2 id="lite-title" class="text-xl font-bold text-white mb-2">Not ready to pay?</h2>
                <p id="lite-sub" class="pc-body text-zinc-400 mb-6">Run a free Lite scan — 3 critical leaks + score snapshot. Same form above; click below instead.</p>
                <button type="button" id="btn-start" class="w-full max-w-sm mx-auto border border-zinc-600 text-zinc-200 font-bold py-3 px-6 rounded-lg hover:border-emerald-500 hover:text-emerald-400 transition-all text-base">
                    Run free Lite scan
                </button>
                <p id="lite-eta-before" class="text-sm text-zinc-600 mt-4">Lite report by email once processing finishes (up to 60 min).</p>
            </div>
        </section>

        <div id="checkout-overlay" class="hidden-flow fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md px-6" aria-live="polite" aria-busy="true">
            <div class="terminal-box w-full max-w-md p-10 text-center">
                <div class="w-11 h-11 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" role="status"></div>
                <p id="checkout-overlay-title" class="text-white font-black uppercase tracking-widest text-sm mb-3">Secure checkout</p>
                <p id="checkout-overlay-sub" class="text-zinc-500 text-sm leading-relaxed font-mono">Connecting to Stripe…</p>
            </div>
        </div>

        <div id="sticky-cta" class="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3 glass-panel border-t border-emerald-500/20">
            <a href="#buy-section" id="sticky-btn" class="block w-full bg-emerald-600 text-white font-black py-3.5 rounded-lg text-center text-sm uppercase tracking-wide">Get Titan — $199</a>
        </div>

        <footer class="py-10 bg-black border-t border-zinc-900 text-center px-4">
            <p id="footer-text" class="text-sm text-emerald-600 mb-3">Consultant or agency? Join our audit partner network.</p>
            <p id="disclaimer-text" class="text-sm text-zinc-500 leading-relaxed mb-4 max-w-xl mx-auto">PredictaCore AI audits. USD $199 intro today. Monitoring $25/mo from day 30; cancel via audit@predictacore.ai. <a href="/terms" class="text-emerald-600 underline">Terms</a> · <a href="/privacy" class="text-emerald-600 underline">Privacy</a></p>
            <p class="text-sm text-zinc-600">© 2026 PredictaCore · predictacore.ai</p>
        </footer>

        <!-- terminal-section alias for old links -->
        <span id="terminal-section" class="hidden-flow"></span>

        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref') || '';
            const adsMode = urlParams.get('src') === 'ads';
            let currentLang = 'en';

            function pcPixel(event, data) {
                if (typeof fbq === 'function') fbq('track', event, data || {});
            }

            const dictionary = {
                en: {
                    pageTitle: "PredictaCore | Find why your page loses customers",
                    navTitan: "Get Titan — $199",
                    heroBadge: "Independent page review · no login",
                    heroTitle: "Find out why your page is <span class='text-emerald-500'>losing sales</span>",
                    heroValue: "PredictaCore reviews your public website or social page the way a first-time visitor would — then sends you a clear PDF report by email. You'll see how your page looks, how easy it is to find on Google, how you compare to competitors, what makes people leave without buying, what to fix first, and a simple 21-day plan to turn more visitors into customers.",
                    heroAsk: "When you're ready, share your link below — your website or one Instagram, Facebook, or TikTok profile. No passwords or complicated setup.",
                    heroPriceLabel: "Titan Report",
                    heroPriceNote: "intro · one-time",
                    heroCtaTitan: "Get Titan Report — $199",
                    heroCtaMid: "Get Titan Report — $199",
                    heroCtaLite: "Or start with a free Lite scan →",
                    heroPriceAnchor: "Don't spend $3,000 on an agency for a report in weeks to deliver — we deliver yours in ~60 minutes. No fluff — hard scores, ranked leaks, and fixes only.",
                    heroDelivery: "PDF delivered from ${supportEmail} · usually within 60 minutes",
                    heroTrust: "One asset per scan · web or one Instagram, Facebook, or TikTok profile",
                    pdfMockTag: "Forensic conversion report",
                    pdfMockTitle: "Titan Intelligence",
                    pdfMockMeta: "${TITAN_REPORT_PAGE_COUNT}-page PDF · 11 sections · email attachment",
                    pdfMockToc: "<li>I. Executive summary &amp; page health</li><li>II. Buyer psychology profiles</li><li>III. Commercial scorecard</li><li>IV. Google SEO &amp; AI visibility</li><li>V–VII. Competitors, SWOT, wishlist</li><li>VIII. 15 reasons people leave</li><li>IX. 15 recommended fixes</li><li>X–XI. Tools &amp; 21-day plan</li>",
                    pdfMockFrom: "Delivered from ${supportEmail}",
                    pdfMockCaption: "This is the file you receive — not what your customers see",
                    pdfMockDesc: "A complete PDF in your inbox — not a dashboard login. Forward it to your team, implement from section IX, and track with the 21-day roadmap in section XI.",
                    pdfMockProof: "Same ${TITAN_REPORT_PAGE_COUNT}-page format for websites, service businesses, and social profiles.",
                    compareTitle: "Lite vs Titan — side by side",
                    compareSub: "Lite is a free teaser. Titan is the full ${TITAN_REPORT_PAGE_COUNT}-page report that shows every reason people leave and what to do about it.",
                    compareThFeature: "What you get",
                    compareThLite: "Lite · Free",
                    compareThTitan: "Titan · $199",
                    compareBody: '<tr><td>Conversion problems found</td><td class="compare-partial">3 only</td><td class="col-titan compare-yes">All 15 ranked</td></tr><tr><td>Recommended fixes</td><td class="compare-no">Summary only</td><td class="col-titan compare-yes">15 step-by-step actions</td></tr><tr><td>Google SEO scorecard</td><td class="compare-partial">Snapshot</td><td class="col-titan compare-yes">Full forensic breakdown</td></tr><tr><td>AI visibility (ChatGPT, etc.)</td><td class="compare-partial">Score only</td><td class="col-titan compare-yes">Engine-by-engine verdict</td></tr><tr><td>Competitor comparison</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr><tr><td>Buyer psychology profiles</td><td class="compare-partial">Brief</td><td class="col-titan compare-yes">4 profiles by industry</td></tr><tr><td>Desktop + mobile screenshots</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr><tr><td>21-day action plan</td><td class="compare-no">—</td><td class="col-titan compare-yes">Included</td></tr><tr><td>Report length</td><td class="compare-partial">Short teaser</td><td class="col-titan compare-yes">${TITAN_REPORT_PAGE_COUNT} pages</td></tr>',
                    compareFoot: "Most owners start with Lite, then upgrade when they see how much is still hidden.",
                    reviewsTitle: "Trusted by shop owners & creators",
                    reviewsSub: "Real feedback from different business types — website, local services, and social profiles.",
                    reviewsGrid: '<article class="review-card"><p class="stars mb-3" aria-label="5 stars">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"We fixed three product-page issues from section IX and personalized orders jumped <strong class="text-white">28% in two weeks</strong>. Worth every dollar vs waiting on an agency quote."</p><p class="review-tag mb-1">E-commerce · website</p><p class="text-white font-semibold text-sm">Sarah M.</p><p class="text-zinc-500 text-xs">Custom baby products · US</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 stars">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"Our booking page looked fine to us. The report showed why people were not calling — we rewrote the hero and online bookings rose <strong class="text-white">41% in a month</strong>."</p><p class="review-tag mb-1">Local services · website</p><p class="text-white font-semibold text-sm">Dr. James R.</p><p class="text-zinc-500 text-xs">Dental clinic · Texas</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 stars">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"I sell coaching through Instagram. The audit flagged my link-in-bio and highlight order — DMs asking for pricing went up <strong class="text-white">34%</strong> after I applied the checklist."</p><p class="review-tag mb-1">Instagram · social profile</p><p class="text-white font-semibold text-sm">Elena V.</p><p class="text-zinc-500 text-xs">Business coach · Miami</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 stars">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"We only had a Facebook page, no real site. Still got a full PDF — fixed our menu photos and hours clarity and walk-ins increased <strong class="text-white">19% in three weeks</strong>."</p><p class="review-tag mb-1">Facebook · social profile</p><p class="text-white font-semibold text-sm">Tom &amp; Ana K.</p><p class="text-zinc-500 text-xs">Neighborhood café · Chicago</p></article>',
                    sampleKicker: "Sample extract",
                    sampleTitle: "This is what lands in your inbox",
                    sampleSub: "Below: the PDF you get by email, plus a pinned customer extract from a real audit. Full Titan PDF = <strong class='text-zinc-200'>${TITAN_REPORT_PAGE_COUNT} pages</strong>, <strong class='text-zinc-200'>11 sections</strong>, <strong class='text-zinc-200'>15 ranked leaks</strong>, and <strong class='text-zinc-200'>15 fixes</strong>.",
                    sampleExtractLabel: "📌 Customer extract",
                    sampleExtractNote: "Don't spend $3,000 on an agency for a report in weeks.<br><span class='text-zinc-300'>Custom baby bedding Shopify store (US e-commerce). Scores and findings are real.</span>",
                    sampleMetric1Label: "Add-to-cart · personalized SKUs",
                    sampleMetric1Sub: "After shipping-date badge (fix #09)",
                    sampleMetric2Label: "Google SEO score",
                    sampleMetric2Sub: "H1 + meta trim · 5 weeks",
                    sampleMetric3Label: "Bounce rate · product pages",
                    sampleMetric3Sub: "Snippet + headline fixes",
                    sampleMetric4Label: "Mobile load time",
                    sampleMetric4Sub: "Image compression pass",
                    sampleMetricsFoot: "Measured ~6 weeks after applying section IX fixes · same Shopify store as extract above",
                    sampleCase: "Custom baby bedding · Shopify",
                    sampleIndustry: "Personalized milestone products · US market",
                    sampleCaption: "Real scores from a live audit — same checks we run on your page.",
                    sampleLeakH1: "What scares buyers · #04",
                    sampleLeakH2: "What scares buyers · #09",
                    sampleFixH: "What to fix first · #09",
                    sampleLeak1: "<strong>Google cuts off your description.</strong> The text under your name in search results is too long — shoppers never see your personalized blanket keywords before the snippet ends.",
                    sampleLeak2: "<strong>No delivery date on custom orders.</strong> Made-to-order products show photos and price, but buyers can't see when it ships — so they hesitate on personalized items.",
                    sampleAction: "Add a clear <strong>Ships in 5–7 business days</strong> badge above Add to Cart on every personalized product page.",
                    sampleSeoTitle: "How you show up on Google",
                    sampleSeoRows: '<div class="sample-row"><span>Page title</span><span class="sample-status-ok">OK</span></div><div class="sample-row"><span>Main headline (H1)</span><span class="sample-status-bad">Missing</span></div><div class="sample-row"><span>Product image labels</span><span class="sample-status-bad">6% only</span></div><div class="sample-row"><span>Rich results (stars, price in search)</span><span class="sample-status-bad">None</span></div><div class="sample-row"><span>Sitemap &amp; robots.txt</span><span class="sample-status-ok">Found</span></div><div class="sample-row"><span>Page speed</span><span class="sample-status-warn">4.3 sec</span></div>',
                    sampleSeoNote: "Without a main headline and product data for Google, your store ranks weaker and looks less trustworthy in search — even when traffic arrives.",
                    sampleAiTitle: "How ChatGPT & other AIs see you",
                    sampleAiRows: '<div class="sample-ai-row"><span>Overall AI readiness</span><span class="score-pill text-emerald-700">85/100</span></div><div class="sample-ai-row"><span>ChatGPT (OpenAI)</span><span class="sample-status-warn">Can cite you — with errors</span></div><div class="sample-ai-row"><span>Claude (Anthropic)</span><span class="sample-status-warn">Can cite you — with errors</span></div><div class="sample-ai-row"><span>Perplexity</span><span class="sample-status-warn">Can cite you — with errors</span></div><div class="sample-ai-row"><span>Google AI Overviews</span><span class="sample-status-warn">Allowed — hard to feature</span></div>',
                    sampleAiNote: "AIs are allowed to read this shop, but with no structured product data and no clear main headline they guess — and may recommend a competitor with a clearer page instead.",
                    sampleFoot: "What you see above is a small extract. The full ${TITAN_REPORT_PAGE_COUNT}-page PDF also includes buyer profiles, competitor comparison, screenshots, and a 21-day action plan.",
                    includedTitle: "Everything in the Titan Report",
                    inc1: "Desktop + mobile capture with measured load time",
                    inc2: "SEO forensics: title, meta, schema, sitemap, robots",
                    inc3: "AI discoverability score (GEO) 0–100",
                    inc4: "4 buyer psychology profiles for your industry",
                    inc5: "15 ranked drop-offs + 15 tactical actions",
                    inc6: "Competitive benchmark + 21-day implementation roadmap",
                    includedFoot: "Structured PDF by email — not a ChatGPT paragraph. More deliverables than agencies charging $3k+ for the same public URL review.",
                    faqTitle: "Questions before you pay",
                    faqQ1: "Do I need to give you analytics or backend access?",
                    faqA1: "No. We only need your public URL — website or one social profile. We scan exactly what a stranger sees before they buy.",
                    faqQ2: "What's the difference between Lite and Titan?",
                    faqA2: "Lite is free and shows 3 critical leaks plus a score snapshot. Titan is the full 11-section PDF with all 15 leaks, 15 tactical actions, buyer profiles, benchmark, and roadmap — USD $199 introductory price.",
                    faqQ3: "How fast do I get the report?",
                    faqA3: "Most reports arrive within 60 minutes by email. Check spam and Promotions. Titan delivery starts right after payment; Lite after your free scan completes.",
                    faqQ4: "What does $25/month monitoring mean?",
                    faqA4: "USD $199 is charged today for the Titan Report. Monitoring ($25/mo) starts 30 days later and renews unless you cancel via audit@predictacore.ai or the Stripe billing portal. See Terms for full details.",
                    faqQ5: "Can I scan Instagram, Facebook, or TikTok instead of a website?",
                    faqA5: "Yes — pick one network and enter your @handle. One asset per scan: either your website or a single public social profile.",
                    buyTitle: "Get your Titan Report",
                    buySub: "Enter your page and email — secure Stripe checkout.",
                    buyDelivery: "Your PDF arrives from ${supportEmail} · usually within 60 minutes",
                    assetPickerLabel: "Where is your page?",
                    assetWeb: "Website", assetInstagram: "Instagram", assetFacebook: "Facebook", assetTiktok: "TikTok",
                    phWeb: "yourbusiness.com", phInstagram: "yourbrand", phFacebook: "pagename", phTiktok: "yourbrand",
                    urlPreviewPrefix: "We'll scan:",
                    buyPriceLine: "Charged today: <strong class='text-white'>USD $199</strong> · monitoring $25/mo from day 30",
                    btnTitan: "Pay $199 — Get Titan Report",
                    btnTitanUpsell: "Get Full Titan Report — $199",
                    cancelBadge: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>',
                    titanEtaBefore: "PDF may take up to 60 minutes after payment. Statement: PREDICTACORE.",
                    liteTitle: "Not ready to pay?",
                    liteSub: "Run a free Lite scan — 3 critical leaks + score snapshot. Same form above; click below instead.",
                    btnStart: "Run free Lite scan",
                    liteEtaBefore: "Lite report by email once processing finishes (up to 60 min).",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "Scan complete", upSt: "Successfully sent to",
                    boxText: "Initial scan shows critical bottlenecks. The Titan Report finds all 15 leaks plus tactical fixes.",
                    liteQueued: "Your Lite report is being generated and will arrive by email.",
                    liteEtaAfter: "Check inbox and spam — delivery up to 60 minutes.",
                    footerText: "Consultant or agency? Join our audit partner network.",
                    disclaimerText: 'PredictaCore AI audits. USD $199 intro today. Monitoring $25/mo from day 30; cancel via audit@predictacore.ai. <a href="/terms" class="text-emerald-600 underline">Terms</a> · <a href="/privacy" class="text-emerald-600 underline">Privacy</a>',
                    checkoutLoading: "Opening secure checkout…",
                    checkoutOverlayTitle: "Secure checkout",
                    checkoutOverlaySub: "Redirecting to Stripe. Do not close this window.",
                    checkoutError: "Could not start checkout. Try again or contact support.",
                    checkoutNetwork: "Network error. Check your connection and try again.",
                    alertError: "Enter your page and email.",
                    invalidEmail: "Enter a valid email address.",
                    invalidUrl: "Enter a valid website (e.g. yourbusiness.com).",
                    useSocialPicker: "For Instagram, Facebook, or TikTok, select that network above.",
                    scanError: "Could not start the scan. Try again in a moment.",
                    phEmail: "you@email.com",
                    stickyBtn: "Get Titan — $199"
                },
                es: {
                    pageTitle: "PredictaCore | Descubre por qué tu página pierde clientes",
                    navTitan: "Obtener Titán — $199",
                    heroBadge: "Revisión independiente de tu página · sin login",
                    heroTitle: "Descubre por qué tu página <span class='text-emerald-500'>pierde ventas</span>",
                    heroValue: "PredictaCore revisa tu web o perfil social público como lo haría un visitante por primera vez — y te envía un PDF claro por correo. Verás cómo se ve tu página, qué tan fácil es encontrarte en Google, cómo te comparas con la competencia, qué hace que la gente se vaya sin comprar, qué corregir primero y un plan sencillo de 21 días para convertir más visitas en clientes.",
                    heroAsk: "Cuando quieras, comparte tu enlace abajo — tu web o un perfil de Instagram, Facebook o TikTok. Sin contraseñas ni configuraciones complicadas.",
                    heroPriceLabel: "Reporte Titán",
                    heroPriceNote: "intro · pago único",
                    heroCtaTitan: "Obtener Reporte Titán — $199",
                    heroCtaMid: "Obtener Reporte Titán — $199",
                    heroCtaLite: "O empezar con escaneo Lite gratis →",
                    heroPriceAnchor: "No gastes $3,000 en una agencia por un reporte que tarda semanas en entregarse — el tuyo en ~60 minutos. Sin relleno: solo datos duros, fugas rankeadas y acciones concretas.",
                    heroDelivery: "PDF enviado desde ${supportEmail} · normalmente en 60 minutos",
                    heroTrust: "Un activo por escaneo · web o un perfil de Instagram, Facebook o TikTok",
                    pdfMockTag: "Reporte forense de conversión",
                    pdfMockTitle: "Inteligencia Titán",
                    pdfMockMeta: "PDF de ${TITAN_REPORT_PAGE_COUNT} páginas · 11 secciones · adjunto por email",
                    pdfMockToc: "<li>I. Resumen ejecutivo y salud de la página</li><li>II. Perfiles de psicología de comprador</li><li>III. Scorecard comercial</li><li>IV. SEO en Google y visibilidad en IAs</li><li>V–VII. Competencia, SWOT, wishlist</li><li>VIII. 15 razones por las que se van</li><li>IX. 15 correcciones recomendadas</li><li>X–XI. Herramientas y plan 21 días</li>",
                    pdfMockFrom: "Enviado desde ${supportEmail}",
                    pdfMockCaption: "Este es el archivo que recibes tú — no lo que ven tus clientes",
                    pdfMockDesc: "Un PDF completo en tu correo — no un login a un panel. Reenvíalo a tu equipo, implementa desde la sección IX y sigue la hoja de ruta de 21 días en la sección XI.",
                    pdfMockProof: "El mismo formato de ${TITAN_REPORT_PAGE_COUNT} páginas para webs, negocios de servicios y perfiles sociales.",
                    compareTitle: "Lite vs Titán — comparativa",
                    compareSub: "Lite es un avance gratis. Titán es el reporte completo de ${TITAN_REPORT_PAGE_COUNT} páginas con cada razón por la que la gente se va y qué hacer al respecto.",
                    compareThFeature: "Qué incluye",
                    compareThLite: "Lite · Gratis",
                    compareThTitan: "Titán · $199",
                    compareBody: '<tr><td>Problemas de conversión detectados</td><td class="compare-partial">Solo 3</td><td class="col-titan compare-yes">Los 15 rankeados</td></tr><tr><td>Correcciones recomendadas</td><td class="compare-no">Solo resumen</td><td class="col-titan compare-yes">15 acciones paso a paso</td></tr><tr><td>Scorecard SEO Google</td><td class="compare-partial">Snapshot</td><td class="col-titan compare-yes">Desglose forense completo</td></tr><tr><td>Visibilidad en IAs (ChatGPT, etc.)</td><td class="compare-partial">Solo score</td><td class="col-titan compare-yes">Veredicto motor por motor</td></tr><tr><td>Comparativa con competencia</td><td class="compare-no">—</td><td class="col-titan compare-yes">Incluida</td></tr><tr><td>Perfiles de psicología de comprador</td><td class="compare-partial">Breve</td><td class="col-titan compare-yes">4 perfiles por giro</td></tr><tr><td>Capturas desktop + móvil</td><td class="compare-no">—</td><td class="col-titan compare-yes">Incluidas</td></tr><tr><td>Plan de acción 21 días</td><td class="compare-no">—</td><td class="col-titan compare-yes">Incluido</td></tr><tr><td>Extensión del reporte</td><td class="compare-partial">Teaser corto</td><td class="col-titan compare-yes">${TITAN_REPORT_PAGE_COUNT} páginas</td></tr>',
                    compareFoot: "La mayoría empieza con Lite y sube a Titán cuando ve cuánto falta por descubrir.",
                    reviewsTitle: "Confianza de tiendas y creadores",
                    reviewsSub: "Opiniones reales de distintos giros — web, servicios locales y perfiles sociales.",
                    reviewsGrid: '<article class="review-card"><p class="stars mb-3" aria-label="5 estrellas">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"Arreglamos tres cosas en la ficha de producto (sección IX) y los pedidos personalizados subieron <strong class="text-white">28% en dos semanas</strong>. Mejor que esperar cotización de agencia."</p><p class="review-tag mb-1">E-commerce · sitio web</p><p class="text-white font-semibold text-sm">Sarah M.</p><p class="text-zinc-500 text-xs">Productos para bebé · US</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 estrellas">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"Nuestra página de reservas se veía bien. El reporte mostró por qué no llamaban — reescribimos el hero y las citas online subieron <strong class="text-white">41% en un mes</strong>."</p><p class="review-tag mb-1">Servicios locales · sitio web</p><p class="text-white font-semibold text-sm">Dr. James R.</p><p class="text-zinc-500 text-xs">Clínica dental · Texas</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 estrellas">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"Vendo coaching por Instagram. La auditoría señaló mi link en bio y el orden de highlights — los DM pidiendo precio subieron <strong class="text-white">34%</strong> tras aplicar la lista."</p><p class="review-tag mb-1">Instagram · perfil social</p><p class="text-white font-semibold text-sm">Elena V.</p><p class="text-zinc-500 text-xs">Coach de negocios · Miami</p></article><article class="review-card"><p class="stars mb-3" aria-label="5 estrellas">★★★★★</p><p class="text-zinc-200 text-sm leading-relaxed mb-4">"Solo teníamos página de Facebook, sin web. Igual recibimos el PDF — arreglamos fotos del menú y horarios y las visitas subieron <strong class="text-white">19% en tres semanas</strong>."</p><p class="review-tag mb-1">Facebook · perfil social</p><p class="text-white font-semibold text-sm">Tom &amp; Ana K.</p><p class="text-zinc-500 text-xs">Café de barrio · Chicago</p></article>',
                    sampleKicker: "Extracto de muestra",
                    sampleTitle: "Esto es lo que llega a tu correo",
                    sampleSub: "Abajo: el PDF que recibes por email, más un extracto fijado de una auditoría real. Reporte Titán completo = <strong class='text-zinc-200'>${TITAN_REPORT_PAGE_COUNT} páginas</strong>, <strong class='text-zinc-200'>11 secciones</strong>, <strong class='text-zinc-200'>15 fugas rankeadas</strong> y <strong class='text-zinc-200'>15 correcciones</strong>.",
                    sampleExtractLabel: "📌 Extracto de cliente",
                    sampleExtractNote: "No gastes $3,000 en una agencia por un reporte en semanas.<br><span class='text-zinc-300'>Tienda Shopify de ropa de cuna personalizada (e-commerce US). Puntuaciones y hallazgos reales.</span>",
                    sampleMetric1Label: "Add-to-cart · SKUs personalizados",
                    sampleMetric1Sub: "Tras badge de fecha de envío (fix #09)",
                    sampleMetric2Label: "Score SEO Google",
                    sampleMetric2Sub: "H1 + meta recortada · 5 semanas",
                    sampleMetric3Label: "Rebote · fichas de producto",
                    sampleMetric3Sub: "Snippet + titular corregidos",
                    sampleMetric4Label: "Carga móvil",
                    sampleMetric4Sub: "Compresión de imágenes",
                    sampleMetricsFoot: "Medido ~6 semanas tras aplicar fixes de la sección IX · misma tienda Shopify del extracto",
                    sampleCase: "Ropa de cuna personalizada · Shopify",
                    sampleIndustry: "Productos milestone personalizados · mercado US",
                    sampleCaption: "Puntuaciones reales de una auditoría en vivo — las mismas que aplicamos a tu página.",
                    sampleLeakH1: "Qué ahuyenta compradores · #04",
                    sampleLeakH2: "Qué ahuyenta compradores · #09",
                    sampleFixH: "Qué corregir primero · #09",
                    sampleLeak1: "<strong>Google corta tu descripción.</strong> El texto bajo tu nombre en resultados de búsqueda es demasiado largo — el comprador no ve tus keywords de mantas personalizadas antes de que el snippet termine.",
                    sampleLeak2: "<strong>Sin fecha de entrega en pedidos custom.</strong> Los productos hechos a pedido muestran fotos y precio, pero el comprador no ve cuándo llega — y duda en artículos personalizados.",
                    sampleAction: "Añade un badge claro de <strong>Envío en 5–7 días hábiles</strong> sobre Añadir al carrito en cada producto personalizado.",
                    sampleSeoTitle: "Cómo te ve Google",
                    sampleSeoRows: '<div class="sample-row"><span>Título de página</span><span class="sample-status-ok">OK</span></div><div class="sample-row"><span>Titular principal (H1)</span><span class="sample-status-bad">Ausente</span></div><div class="sample-row"><span>Texto en imágenes de producto</span><span class="sample-status-bad">Solo 6%</span></div><div class="sample-row"><span>Resultados enriquecidos (estrellas, precio)</span><span class="sample-status-bad">Ninguno</span></div><div class="sample-row"><span>Sitemap y robots.txt</span><span class="sample-status-ok">Encontrados</span></div><div class="sample-row"><span>Velocidad de carga</span><span class="sample-status-warn">4,3 seg</span></div>',
                    sampleSeoNote: "Sin titular principal ni datos de producto para Google, tu tienda posiciona peor y se ve menos confiable en búsqueda — aunque llegue tráfico.",
                    sampleAiTitle: "Cómo te ven ChatGPT y otras IAs",
                    sampleAiRows: '<div class="sample-ai-row"><span>Preparación general para IAs</span><span class="score-pill text-emerald-700">85/100</span></div><div class="sample-ai-row"><span>ChatGPT (OpenAI)</span><span class="sample-status-warn">Puede citarte — con errores</span></div><div class="sample-ai-row"><span>Claude (Anthropic)</span><span class="sample-status-warn">Puede citarte — con errores</span></div><div class="sample-ai-row"><span>Perplexity</span><span class="sample-status-warn">Puede citarte — con errores</span></div><div class="sample-ai-row"><span>Google AI Overviews</span><span class="sample-status-warn">Permitido — difícil destacar</span></div>',
                    sampleAiNote: "Las IAs pueden leer esta tienda, pero sin datos estructurados de producto ni titular claro adivinan — y pueden recomendar a un competidor con página más clara.",
                    sampleFoot: "Lo de arriba es solo un extracto. El PDF completo de ${TITAN_REPORT_PAGE_COUNT} páginas también incluye perfiles de comprador, comparativa con competencia, capturas y plan de acción de 21 días.",
                    includedTitle: "Todo lo que incluye el Reporte Titán",
                    inc1: "Captura desktop + móvil con tiempo de carga medido",
                    inc2: "SEO forense: title, meta, schema, sitemap, robots",
                    inc3: "Score de visibilidad en IAs (GEO) 0–100",
                    inc4: "4 perfiles de psicología de comprador por tu giro",
                    inc5: "15 fugas rankeadas + 15 acciones tácticas",
                    inc6: "Benchmark competitivo + roadmap de implementación 21 días",
                    includedFoot: "PDF estructurado por email — no un párrafo de ChatGPT. Más entregables que agencias que cobran $3k+ por revisar la misma URL pública.",
                    faqTitle: "Preguntas antes de pagar",
                    faqQ1: "¿Necesito dar analytics o acceso al backend?",
                    faqA1: "No. Solo tu URL pública — web o un perfil social. Escaneamos exactamente lo que ve un desconocido antes de comprar.",
                    faqQ2: "¿Qué diferencia hay entre Lite y Titán?",
                    faqA2: "Lite es gratis: 3 fugas críticas y snapshot de scores. Titán es el PDF completo de 11 secciones con las 15 fugas, 15 acciones, perfiles, benchmark y roadmap — USD $199 precio introductorio.",
                    faqQ3: "¿Qué tan rápido llega el reporte?",
                    faqA3: "La mayoría llega en 60 minutos por email. Revisa spam y Promociones. Titán tras el pago; Lite tras completar el escaneo gratis.",
                    faqQ4: "¿Qué significa el monitoreo de $25/mes?",
                    faqA4: "Hoy se cobra USD $199 por el Reporte Titán. El monitoreo ($25/mes) empieza a los 30 días y renueva salvo cancelación en audit@predictacore.ai o portal Stripe. Ver Términos.",
                    faqQ5: "¿Puedo escanear Instagram, Facebook o TikTok?",
                    faqA5: "Sí — elige una red e ingresa tu @usuario. Un activo por escaneo: tu web o un solo perfil social público.",
                    buyTitle: "Obtén tu Reporte Titán",
                    buySub: "Ingresa tu página y correo — checkout seguro Stripe.",
                    buyDelivery: "Tu PDF llega desde ${supportEmail} · normalmente en 60 minutos",
                    assetPickerLabel: "¿Dónde está tu página?",
                    assetWeb: "Sitio web", assetInstagram: "Instagram", assetFacebook: "Facebook", assetTiktok: "TikTok",
                    phWeb: "tunegocio.com", phInstagram: "tumarca", phFacebook: "nombrepagina", phTiktok: "tumarca",
                    urlPreviewPrefix: "Escanearemos:",
                    buyPriceLine: "Cobro hoy: <strong class='text-white'>USD $199</strong> · monitoreo $25/mes desde día 30",
                    btnTitan: "Pagar $199 — Reporte Titán",
                    btnTitanUpsell: "Reporte Titán completo — $199",
                    cancelBadge: 'Al pagar aceptas nuestros <a href="/terms" class="text-emerald-600 underline">Términos</a> y <a href="/privacy" class="text-emerald-600 underline">Privacidad</a>',
                    titanEtaBefore: "El PDF puede tardar hasta 60 min tras el pago. Estado de cuenta: PREDICTACORE.",
                    liteTitle: "¿Aún no quieres pagar?",
                    liteSub: "Escaneo Lite gratis — 3 fugas críticas + snapshot. Mismo formulario arriba; pulsa abajo.",
                    btnStart: "Escaneo Lite gratis",
                    liteEtaBefore: "Reporte Lite por email al terminar (hasta 60 min).",
                    logInit: ">> INICIALIZANDO PREDICTACORE CORE...",
                    upT: "Escaneo completo", upSt: "Enviado correctamente a",
                    boxText: "El escaneo inicial muestra cuellos de botella críticos. El Reporte Titán encuentra las 15 fugas y acciones tácticas.",
                    liteQueued: "Tu reporte Lite se está generando y llegará por email.",
                    liteEtaAfter: "Revisa bandeja y spam — entrega hasta 60 min.",
                    footerText: "¿Consultor o agencia? Únete a nuestra red de partners.",
                    disclaimerText: 'Auditorías PredictaCore AI. USD $199 intro hoy. Monitoreo $25/mes desde día 30; cancelar en audit@predictacore.ai. <a href="/terms" class="text-emerald-600 underline">Términos</a> · <a href="/privacy" class="text-emerald-600 underline">Privacidad</a>',
                    checkoutLoading: "Abriendo checkout seguro…",
                    checkoutOverlayTitle: "Checkout seguro",
                    checkoutOverlaySub: "Redirigiendo a Stripe. No cierres esta ventana.",
                    checkoutError: "No se pudo iniciar el checkout. Intenta de nuevo.",
                    checkoutNetwork: "Error de red. Revisa tu conexión.",
                    alertError: "Ingresa tu página y correo.",
                    invalidEmail: "Ingresa un correo válido.",
                    invalidUrl: "Ingresa una web válida (ej. tunegocio.com).",
                    useSocialPicker: "Para Instagram, Facebook o TikTok, selecciona esa red arriba.",
                    scanError: "No se pudo iniciar el escaneo. Intenta en un momento.",
                    phEmail: "tu@correo.com",
                    stickyBtn: "Titán — $199"
                }
            };

            if (urlParams.get('success') === 'true') {
                window.location.replace('/exito' + (currentLang === 'es' ? '?lang=es' : ''));
            }

            function setLanguage(lang) {
                currentLang = lang;
                document.documentElement.lang = lang;
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                const d = dictionary[lang];
                if (d.pageTitle) document.title = d.pageTitle;

                const textMap = {
                    'nav-titan': d.navTitan, 'hero-badge': d.heroBadge,
                    'hero-value': d.heroValue, 'hero-ask': d.heroAsk,
                    'hero-price-label': d.heroPriceLabel, 'hero-price-note': d.heroPriceNote,
                    'hero-cta-titan': d.heroCtaTitan, 'hero-cta-mid': d.heroCtaMid, 'hero-cta-lite': d.heroCtaLite,
                    'hero-price-anchor': d.heroPriceAnchor, 'hero-delivery': d.heroDelivery, 'hero-trust': d.heroTrust,
                    'pdf-mock-tag': d.pdfMockTag, 'pdf-mock-title': d.pdfMockTitle, 'pdf-mock-meta': d.pdfMockMeta,
                    'pdf-mock-from': d.pdfMockFrom, 'pdf-mock-caption': d.pdfMockCaption, 'pdf-mock-desc': d.pdfMockDesc, 'pdf-mock-proof': d.pdfMockProof,
                    'compare-title': d.compareTitle, 'compare-sub': d.compareSub, 'compare-foot': d.compareFoot,
                    'compare-th-feature': d.compareThFeature, 'compare-th-lite': d.compareThLite, 'compare-th-titan': d.compareThTitan,
                    'reviews-title': d.reviewsTitle, 'reviews-sub': d.reviewsSub,
                    'sample-kicker': d.sampleKicker, 'sample-title': d.sampleTitle,
                    'sample-extract-label': d.sampleExtractLabel,
                    'sample-metrics-foot': d.sampleMetricsFoot,
                    'sample-metric-1-label': d.sampleMetric1Label, 'sample-metric-1-sub': d.sampleMetric1Sub,
                    'sample-metric-2-label': d.sampleMetric2Label, 'sample-metric-2-sub': d.sampleMetric2Sub,
                    'sample-metric-3-label': d.sampleMetric3Label, 'sample-metric-3-sub': d.sampleMetric3Sub,
                    'sample-metric-4-label': d.sampleMetric4Label, 'sample-metric-4-sub': d.sampleMetric4Sub,
                    'sample-case': d.sampleCase, 'sample-industry': d.sampleIndustry, 'sample-caption': d.sampleCaption,
                    'sample-foot': d.sampleFoot, 'sample-seo-title': d.sampleSeoTitle, 'sample-seo-note': d.sampleSeoNote,
                    'sample-ai-title': d.sampleAiTitle, 'sample-ai-note': d.sampleAiNote,
                    'sample-leak-h1': d.sampleLeakH1, 'sample-leak-h2': d.sampleLeakH2, 'sample-fix-h': d.sampleFixH,
                    'included-title': d.includedTitle, 'included-foot': d.includedFoot,
                    'faq-title': d.faqTitle,
                    'faq-q1': d.faqQ1, 'faq-a1': d.faqA1, 'faq-q2': d.faqQ2, 'faq-a2': d.faqA2,
                    'faq-q3': d.faqQ3, 'faq-a3': d.faqA3, 'faq-q4': d.faqQ4, 'faq-a4': d.faqA4,
                    'faq-q5': d.faqQ5, 'faq-a5': d.faqA5,
                    'buy-title': d.buyTitle, 'buy-sub': d.buySub, 'buy-delivery': d.buyDelivery, 'asset-picker-label': d.assetPickerLabel,
                    'asset-label-web': d.assetWeb, 'asset-label-instagram': d.assetInstagram,
                    'asset-label-facebook': d.assetFacebook, 'asset-label-tiktok': d.assetTiktok,
                    'btn-titan': d.btnTitan, 'btn-titan-upsell': d.btnTitanUpsell,
                    'titan-eta-before': d.titanEtaBefore, 'lite-title': d.liteTitle, 'lite-sub': d.liteSub,
                    'btn-start': d.btnStart, 'lite-eta-before': d.liteEtaBefore, 'log-init': d.logInit,
                    'up-t': d.upT, 'box-text': d.boxText, 'lite-queued-msg': d.liteQueued,
                    'lite-eta-after': d.liteEtaAfter, 'footer-text': d.footerText, 'checkout-overlay-title': d.checkoutOverlayTitle,
                    'checkout-overlay-sub': d.checkoutOverlaySub, 'sticky-btn': d.stickyBtn
                };
                Object.keys(textMap).forEach(function(id) {
                    const el = document.getElementById(id);
                    if (el && textMap[id]) el.innerText = textMap[id];
                });

                document.getElementById('hero-title').innerHTML = d.heroTitle;
                document.getElementById('sample-sub').innerHTML = d.sampleSub;
                document.getElementById('sample-extract-note').innerHTML = d.sampleExtractNote;
                document.getElementById('compare-sub').innerHTML = d.compareSub;
                if (d.pdfMockToc) document.getElementById('pdf-mock-toc').innerHTML = d.pdfMockToc;
                if (d.compareBody) document.getElementById('compare-body').innerHTML = d.compareBody;
                if (d.reviewsGrid) document.getElementById('reviews-grid').innerHTML = d.reviewsGrid;
                document.getElementById('sample-leak1').innerHTML = d.sampleLeak1;
                document.getElementById('sample-leak2').innerHTML = d.sampleLeak2;
                document.getElementById('sample-action').innerHTML = d.sampleAction;
                if (d.sampleSeoRows) document.getElementById('sample-seo-rows').innerHTML = d.sampleSeoRows;
                if (d.sampleAiRows) document.getElementById('sample-ai-rows').innerHTML = d.sampleAiRows;
                document.getElementById('buy-price-line').innerHTML = d.buyPriceLine;
                document.getElementById('cancel-badge').innerHTML = d.cancelBadge;
                document.getElementById('disclaimer-text').innerHTML = d.disclaimerText;
                for (let i = 1; i <= 6; i++) {
                    const el = document.getElementById('inc-' + i);
                    if (el && d['inc' + i]) el.innerHTML = '<span class="text-emerald-500 shrink-0">✓</span> ' + d['inc' + i];
                }

                document.getElementById('user-email').placeholder = d.phEmail;
                document.getElementById('up-st').innerHTML = d.upSt + ' <span id="sent-email" class="text-white font-bold">' + (document.getElementById('user-email').value || '') + '</span>.';
                updateAssetUi();
            }

            function getSelectedAssetType() {
                const el = document.querySelector('input[name="asset-type"]:checked');
                return el ? el.value : 'web';
            }

            function buildSocialUrl(platform, raw) {
                let handle = String(raw || '').trim();
                if (!handle) return '';
                if (/instagram\\.com/i.test(handle)) {
                    const m = handle.match(/instagram\\.com\\/([^/?#]+)/i);
                    if (m) handle = m[1];
                } else if (/facebook\\.com/i.test(handle)) {
                    const m = handle.match(/facebook\\.com\\/([^/?#]+)/i);
                    if (m) handle = m[1];
                } else if (/tiktok\\.com/i.test(handle)) {
                    const m = handle.match(/tiktok\\.com\\/@?([^/?#]+)/i);
                    if (m) handle = m[1];
                }
                handle = handle.replace(/^@/, '').replace(/\\/$/, '');
                if (platform === 'instagram') return 'https://www.instagram.com/' + handle + '/';
                if (platform === 'facebook') return 'https://www.facebook.com/' + handle;
                if (platform === 'tiktok') return 'https://www.tiktok.com/@' + handle.replace(/^@/, '');
                return '';
            }

            function buildWebUrl(raw) {
                let url = String(raw || '').trim();
                if (!url) return '';
                if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url.replace(/^\\/\\//, '');
                return url;
            }

            function buildScanPayload() {
                const d = dictionary[currentLang];
                const raw = (document.getElementById('dna-url')?.value || '').trim();
                const assetType = getSelectedAssetType();
                if (!raw) return { error: d.alertError };
                if (assetType === 'web') {
                    const url = buildWebUrl(raw);
                    try { new URL(url); } catch { return { error: d.invalidUrl }; }
                    if (/instagram\\.com|facebook\\.com|tiktok\\.com/i.test(url)) {
                        return { error: d.useSocialPicker };
                    }
                    return { assetType: 'web', dna: url };
                }
                const url = buildSocialUrl(assetType, raw);
                if (!url) return { error: d.alertError };
                return { assetType: 'social', platform: assetType, handle: raw.replace(/^@/, ''), dna: url };
            }

            function updateAssetUi() {
                const d = dictionary[currentLang];
                const assetType = getSelectedAssetType();
                document.querySelectorAll('.asset-option').forEach(function(el) {
                    const input = el.querySelector('input[name="asset-type"]');
                    el.classList.toggle('selected', input && input.checked);
                });
                const phMap = { web: d.phWeb, instagram: d.phInstagram, facebook: d.phFacebook, tiktok: d.phTiktok };
                const input = document.getElementById('dna-url');
                if (input) input.placeholder = phMap[assetType] || d.phWeb;
                const raw = (input?.value || '').trim();
                const preview = document.getElementById('url-preview');
                if (!preview) return;
                if (!raw) { preview.innerText = ''; return; }
                const payload = buildScanPayload();
                preview.innerText = payload.error ? '' : ((d.urlPreviewPrefix || "We'll scan:") + ' ' + payload.dna);
            }

            function setSetupError(msg) {
                const el = document.getElementById('setup-error');
                el.innerText = msg || '';
                el.classList.toggle('hidden-flow', !msg);
            }

            function setCheckoutError(msg) {
                const el = document.getElementById('checkout-error');
                el.innerText = msg || '';
                el.classList.toggle('hidden-flow', !msg);
            }

            function updateSentEmail(email) {
                let el = document.getElementById('sent-email');
                if (!el) {
                    const upSt = document.getElementById('up-st');
                    const d = dictionary[currentLang];
                    if (upSt) {
                        upSt.innerHTML = d.upSt + ' <span id="sent-email" class="text-white font-bold"></span>.';
                        el = document.getElementById('sent-email');
                    }
                }
                if (el) el.textContent = email;
            }

            function resetScanUi() {
                document.getElementById('setup-stage')?.classList.remove('hidden-flow');
                document.getElementById('scanner-stage')?.classList.add('hidden-flow');
                document.getElementById('upsell-stage')?.classList.add('hidden-flow');
                const btn = document.getElementById('btn-start');
                if (btn) { btn.disabled = false; btn.classList.remove('opacity-60', 'cursor-wait'); }
            }

            async function iniciarEscaneo() {
                const email = (document.getElementById('user-email')?.value || '').trim();
                const d = dictionary[currentLang];
                const payload = buildScanPayload();
                if (payload.error) { setSetupError(payload.error); return; }
                if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
                    setSetupError(d.invalidEmail);
                    return;
                }
                setSetupError('');
                const btn = document.getElementById('btn-start');
                if (btn) { btn.disabled = true; btn.classList.add('opacity-60', 'cursor-wait'); }

                document.getElementById('setup-stage')?.classList.add('hidden-flow');
                document.getElementById('scanner-stage')?.classList.remove('hidden-flow');
                const output = document.getElementById('terminal-output');
                output.innerHTML = '<p>' + d.logInit + '</p>';

                try {
                    const res = await fetch('/start-lite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, refCode, lang: currentLang, ...payload }),
                    });
                    const data = await res.json().catch(function() { return {}; });
                    if (!res.ok) throw new Error(data.error || d.scanError);

                    output.innerHTML += '<p>>> LITE SCAN QUEUED</p><p>>> REPORT DELIVERY: EMAIL</p>';
                    updateSentEmail(email);
                    document.getElementById('scanner-stage')?.classList.add('hidden-flow');
                    document.getElementById('upsell-stage')?.classList.remove('hidden-flow');
                    pcPixel('Lead', { content_name: 'Lite Scan' });
                } catch (err) {
                    console.error(err);
                    resetScanUi();
                    setSetupError(err.message || d.scanError);
                }
            }

            function showCheckoutOverlay() {
                const d = dictionary[currentLang];
                document.getElementById('checkout-overlay-title').innerText = d.checkoutOverlayTitle;
                document.getElementById('checkout-overlay-sub').innerText = d.checkoutOverlaySub;
                document.getElementById('checkout-overlay').classList.remove('hidden-flow');
                document.body.style.overflow = 'hidden';
            }

            function hideCheckoutOverlay() {
                document.getElementById('checkout-overlay').classList.add('hidden-flow');
                document.body.style.overflow = '';
            }

            async function comprarTitan() {
                const email = (document.getElementById('user-email').value || '').trim();
                const d = dictionary[currentLang];
                const btn = document.getElementById('btn-titan');
                const btnLabel = d.btnTitan;
                const payload = buildScanPayload();

                if (payload.error) { setCheckoutError(payload.error); return; }
                if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
                    setCheckoutError(d.invalidEmail);
                    return;
                }

                setCheckoutError('');
                btn.disabled = true;
                btn.innerText = d.checkoutLoading;
                showCheckoutOverlay();
                pcPixel('InitiateCheckout', { value: 199, currency: 'USD', content_name: 'Titan Report' });

                try {
                    const res = await fetch('/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, refCode, lang: currentLang, ...payload }),
                    });
                    const data = await res.json().catch(function() { return {}; });

                    if (res.ok && data.status === 'checkout' && data.url) {
                        window.location.assign(data.url);
                        return;
                    }

                    hideCheckoutOverlay();
                    setCheckoutError(data.error || d.checkoutError);
                    btn.disabled = false;
                    btn.innerText = btnLabel;
                } catch (err) {
                    console.error('!!! Checkout error:', err);
                    hideCheckoutOverlay();
                    setCheckoutError(d.checkoutNetwork);
                    btn.disabled = false;
                    btn.innerText = btnLabel;
                }
            }

            (function initFromUrl() {
                const dna = urlParams.get('dna');
                const emailParam = urlParams.get('email');
                if (dna) document.getElementById('dna-url').value = decodeURIComponent(dna);
                if (emailParam) document.getElementById('user-email').value = decodeURIComponent(emailParam);

                setLanguage(urlParams.get('lang') === 'es' ? 'es' : 'en');

                if (adsMode) {
                    document.getElementById('lite-section')?.classList.add('hidden-flow');
                    document.getElementById('hero-cta-lite')?.classList.add('hidden-flow');
                    document.getElementById('compare-foot')?.classList.add('hidden-flow');
                    pcPixel('ViewContent', { content_name: 'Titan Report', content_category: 'ads' });
                    setTimeout(function() {
                        document.getElementById('buy-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 500);
                } else {
                    pcPixel('ViewContent', { content_name: 'Landing' });
                }

                document.getElementById('btn-start')?.addEventListener('click', iniciarEscaneo);
                document.getElementById('btn-titan')?.addEventListener('click', comprarTitan);
                document.getElementById('btn-titan-upsell')?.addEventListener('click', comprarTitan);
                document.getElementById('lang-en')?.addEventListener('click', function() { setLanguage('en'); });
                document.getElementById('lang-es')?.addEventListener('click', function() { setLanguage('es'); });

                document.querySelectorAll('input[name="asset-type"]').forEach(function(radio) {
                    radio.addEventListener('change', updateAssetUi);
                });
                document.getElementById('dna-url')?.addEventListener('input', updateAssetUi);

                document.getElementById('dna-url')?.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') comprarTitan();
                });
                document.getElementById('user-email')?.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') comprarTitan();
                });

                if (urlParams.get('titan') === '1' || urlParams.get('src') === 'ads') {
                    setTimeout(function() {
                        document.getElementById('buy-section').scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                }

                var sticky = document.getElementById('sticky-cta');
                var buySection = document.getElementById('buy-section');
                if (sticky && buySection && 'IntersectionObserver' in window) {
                    new IntersectionObserver(function(entries) {
                        var inView = entries.some(function(e) { return e.isIntersecting; });
                        sticky.classList.toggle('visible', !inView);
                    }, { threshold: 0.1 }).observe(buySection);
                } else if (sticky) {
                    sticky.classList.add('visible');
                }
            })();
        </script>
    </body>
    </html>`;
}

module.exports = { getLandingHTML };
