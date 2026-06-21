// landing.js — conversion-focused landing (non-repetitive, Titan-first, anonymized sample)

const { getFaviconHeadTags } = require('./brand');

function getLandingHTML() {
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
            #sticky-cta.visible { transform: translateY(0); }
            #checkout-overlay { transition: opacity 0.25s ease; }
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
                <p id="hero-badge" class="inline-block text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-950/40 border border-emerald-500/25 px-3 py-1 rounded-full mb-6">Page review for shop owners · no login</p>
                <h1 id="hero-title" class="text-huge text-white mb-5">Your page is losing sales <span class="text-emerald-500">right now.</span></h1>
                <p id="hero-sub" class="pc-body text-zinc-300 max-w-2xl mx-auto mb-8">Share your website or social page — we review it the way a new customer would. You get a PDF by email that shows how your page looks, how easy it is to find on Google, how you compare to competitors, what makes people leave without buying, what to fix first, and a simple 21-day plan to turn more visitors into sales. Just your link — no passwords or complicated setup.</p>
                <div class="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-2 mb-8">
                    <span id="hero-price-label" class="text-zinc-400 text-sm">Titan Report</span>
                    <span class="text-2xl font-black text-white">$199</span>
                    <span id="hero-price-note" class="text-xs text-emerald-500 font-semibold">intro · one-time</span>
                </div>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
                    <a href="#buy-section" id="hero-cta-titan" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-lg text-base uppercase tracking-wide transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)]">Get Titan Report — $199</a>
                    <a href="#lite-section" id="hero-cta-lite" class="text-zinc-400 hover:text-white text-sm font-semibold py-4 px-4 underline-offset-4 hover:underline">Or start with a free Lite scan →</a>
                </div>
                <p id="hero-trust" class="mt-6 text-sm text-zinc-500">One asset per scan · web or one Instagram, Facebook, or TikTok profile</p>
            </div>
        </section>

        <!-- SAMPLE REPORT (anonymized real audit — baby bedding e-commerce) -->
        <section id="sample-section" class="py-14 md:py-16 px-4 md:px-6 border-y border-zinc-900 bg-black/30">
            <div class="max-w-5xl mx-auto">
                <p id="sample-kicker" class="text-xs font-bold uppercase tracking-widest text-emerald-500 text-center mb-2">Real report preview</p>
                <h2 id="sample-title" class="text-2xl md:text-3xl font-black text-white text-center mb-3">This is what lands in your inbox</h2>
                <p id="sample-sub" class="pc-body text-zinc-400 text-center max-w-xl mx-auto mb-10">Anonymized extract from a live Titan audit — custom baby bedding shop, US e-commerce.</p>

                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start mb-6">
                    <div class="lg:col-span-2 report-card p-6 md:p-7">
                        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-200">
                            <div class="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p id="sample-case" class="font-bold text-zinc-900 text-sm leading-tight">Custom baby bedding · e-commerce</p>
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
                <p id="sample-foot" class="text-sm text-zinc-500 text-center mt-8">+ buyer profiles, competitor comparison, 12 more problems, 14 more fixes &amp; 21-day plan in the full PDF.</p>
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

        <!-- SOCIAL PROOF -->
        <section class="py-10 px-4 md:px-6 border-y border-zinc-900 bg-emerald-950/10">
            <div class="max-w-2xl mx-auto text-center">
                <p id="proof-quote" class="text-lg md:text-xl text-zinc-200 italic leading-relaxed mb-4">"We knew traffic was fine — we didn't know <em class="text-emerald-400 not-italic font-semibold">why</em> personalized orders stalled. The report pointed to three fixes we shipped in a week."</p>
                <p id="proof-attr" class="text-sm text-zinc-500">— Owner, custom baby products shop · US e-commerce</p>
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
                <p id="buy-sub" class="pc-body text-zinc-400 text-center mb-8">Enter your page and email — secure Stripe checkout. PDF delivered to your inbox.</p>

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
                    heroBadge: "Page review for shop owners · no login",
                    heroTitle: "Your page is losing sales <span class='text-emerald-500'>right now.</span>",
                    heroSub: "Share your website or social page — we review it the way a new customer would. You get a PDF by email that shows how your page looks, how easy it is to find on Google, how you compare to competitors, what makes people leave without buying, what to fix first, and a simple 21-day plan to turn more visitors into sales. Just your link — no passwords or complicated setup.",
                    heroPriceLabel: "Titan Report",
                    heroPriceNote: "intro · one-time",
                    heroCtaTitan: "Get Titan Report — $199",
                    heroCtaLite: "Or start with a free Lite scan →",
                    heroTrust: "One asset per scan · web or one Instagram, Facebook, or TikTok profile",
                    sampleKicker: "Real report preview",
                    sampleTitle: "This is what lands in your inbox",
                    sampleSub: "Anonymized extract from a live Titan audit — custom baby bedding shop, US e-commerce.",
                    sampleCase: "Custom baby bedding · e-commerce",
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
                    sampleFoot: "+ buyer profiles, competitor comparison, 12 more problems, 14 more fixes & 21-day plan in the full PDF.",
                    includedTitle: "Everything in the Titan Report",
                    inc1: "Desktop + mobile capture with measured load time",
                    inc2: "SEO forensics: title, meta, schema, sitemap, robots",
                    inc3: "AI discoverability score (GEO) 0–100",
                    inc4: "4 buyer psychology profiles for your industry",
                    inc5: "15 ranked drop-offs + 15 tactical actions",
                    inc6: "Competitive benchmark + 21-day implementation roadmap",
                    includedFoot: "Structured PDF by email — not a ChatGPT paragraph. More deliverables than agencies charging $3k+ for the same public URL review.",
                    proofQuote: '"We knew traffic was fine — we didn\\'t know <em class="text-emerald-400 not-italic font-semibold">why</em> personalized orders stalled. The report pointed to three fixes we shipped in a week."',
                    proofAttr: "— Owner, custom baby products shop · US e-commerce",
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
                    buySub: "Enter your page and email — secure Stripe checkout. PDF delivered to your inbox.",
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
                    heroBadge: "Revisión de tu página · sin login",
                    heroTitle: "Tu página está perdiendo ventas <span class='text-emerald-500'>ahora mismo.</span>",
                    heroSub: "Comparte tu web o tu página de Instagram, Facebook o TikTok — la revisamos como la vería un cliente nuevo. Te enviamos un PDF por correo con: cómo se ve tu página, qué tan fácil es encontrarte en Google, cómo te comparas con la competencia, qué hace que la gente se vaya sin comprar, qué corregir primero y un plan sencillo de 21 días para vender más. Solo tu enlace — sin contraseñas ni configuraciones complicadas.",
                    heroPriceLabel: "Reporte Titán",
                    heroPriceNote: "intro · pago único",
                    heroCtaTitan: "Obtener Reporte Titán — $199",
                    heroCtaLite: "O empezar con escaneo Lite gratis →",
                    heroTrust: "Un activo por escaneo · web o un perfil de Instagram, Facebook o TikTok",
                    sampleKicker: "Vista previa real",
                    sampleTitle: "Esto es lo que llega a tu correo",
                    sampleSub: "Extracto anonimizado de una auditoría Titán real — tienda de ropa de cuna personalizada, e-commerce US.",
                    sampleCase: "Ropa de cuna personalizada · e-commerce",
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
                    sampleFoot: "+ perfiles de comprador, comparativa con competencia, 12 problemas más, 14 correcciones y plan de 21 días en el PDF completo.",
                    includedTitle: "Todo lo que incluye el Reporte Titán",
                    inc1: "Captura desktop + móvil con tiempo de carga medido",
                    inc2: "SEO forense: title, meta, schema, sitemap, robots",
                    inc3: "Score de visibilidad en IAs (GEO) 0–100",
                    inc4: "4 perfiles de psicología de comprador por tu giro",
                    inc5: "15 fugas rankeadas + 15 acciones tácticas",
                    inc6: "Benchmark competitivo + roadmap de implementación 21 días",
                    includedFoot: "PDF estructurado por email — no un párrafo de ChatGPT. Más entregables que agencias que cobran $3k+ por revisar la misma URL pública.",
                    proofQuote: '"Sabíamos que el tráfico estaba bien — no sabíamos <em class="text-emerald-400 not-italic font-semibold">por qué</em> los pedidos personalizados se estancaban. El reporte señaló tres arreglos que lanzamos en una semana."',
                    proofAttr: "— Dueño, tienda de productos para bebé custom · e-commerce US",
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
                    buySub: "Ingresa tu página y correo — checkout seguro Stripe. PDF a tu bandeja.",
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
                    'nav-titan': d.navTitan, 'hero-badge': d.heroBadge, 'hero-sub': d.heroSub,
                    'hero-price-label': d.heroPriceLabel, 'hero-price-note': d.heroPriceNote,
                    'hero-cta-titan': d.heroCtaTitan, 'hero-cta-lite': d.heroCtaLite, 'hero-trust': d.heroTrust,
                    'sample-kicker': d.sampleKicker, 'sample-title': d.sampleTitle, 'sample-sub': d.sampleSub,
                    'sample-case': d.sampleCase, 'sample-industry': d.sampleIndustry, 'sample-caption': d.sampleCaption,
                    'sample-foot': d.sampleFoot, 'sample-seo-title': d.sampleSeoTitle, 'sample-seo-note': d.sampleSeoNote,
                    'sample-ai-title': d.sampleAiTitle, 'sample-ai-note': d.sampleAiNote,
                    'sample-leak-h1': d.sampleLeakH1, 'sample-leak-h2': d.sampleLeakH2, 'sample-fix-h': d.sampleFixH, 'included-title': d.includedTitle, 'included-foot': d.includedFoot,
                    'proof-attr': d.proofAttr, 'faq-title': d.faqTitle,
                    'faq-q1': d.faqQ1, 'faq-a1': d.faqA1, 'faq-q2': d.faqQ2, 'faq-a2': d.faqA2,
                    'faq-q3': d.faqQ3, 'faq-a3': d.faqA3, 'faq-q4': d.faqQ4, 'faq-a4': d.faqA4,
                    'faq-q5': d.faqQ5, 'faq-a5': d.faqA5,
                    'buy-title': d.buyTitle, 'buy-sub': d.buySub, 'asset-picker-label': d.assetPickerLabel,
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
                document.getElementById('proof-quote').innerHTML = d.proofQuote;
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
