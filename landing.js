// landing.js - REDISEÑO DE ÉLITE: CERO JERGA TÉCNICA, MÁXIMA AUTORIDAD Y ESTÉTICA BALANCEADA

const { getFaviconHeadTags } = require('./brand');

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore | Auditoría forense para emprendedores</title>
        <meta name="description" content="PredictaCore audita tu web o perfil social (solo URL) para encontrar por qué pierdes clientes y cómo arreglarlo. Escaneo Lite gratis. Reporte Titán USD $199 (precio introductorio).">
        <meta name="application-name" content="PredictaCore">
        <meta property="og:site_name" content="PredictaCore">
        ${getFaviconHeadTags()}
        
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            
            :root {
                --pc-emerald: #10b981;
                --pc-dark-bg: #050505;
            }

            body { 
                background: var(--pc-dark-bg); 
                color: #d1d5db; 
                font-family: 'Inter', sans-serif;
                overflow-x: hidden;
            }

            .glass-panel { 
                background: rgba(15, 23, 42, 0.6); 
                border: 1px solid rgba(30, 41, 59, 0.5); 
                backdrop-filter: blur(12px); 
            }

            .text-huge { font-size: clamp(2.5rem, 6vw, 5.5rem); line-height: 0.95; font-weight: 900; letter-spacing: -0.05em; }
            
            .dossier-preview {
                background: #fff;
                color: #0f172a;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                transform: rotateX(10deg) rotateY(-5deg);
                transition: all 0.5s ease;
            }
            .dossier-preview:hover { transform: rotateX(0deg) rotateY(0deg); }

            .scan-line { width: 100%; height: 2px; background: var(--pc-emerald); position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.3; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

            .hidden-flow { display: none !important; }
            .terminal-box {
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid rgba(16, 185, 129, 0.35);
                border-radius: 0.5rem;
            }
            #checkout-overlay { transition: opacity 0.25s ease; }
            .lang-btn { cursor: pointer; transition: all 0.3s; opacity: 0.4; }
            .lang-btn.active { opacity: 1; color: var(--pc-emerald); font-weight: bold; }

            .mesh-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-image: radial-gradient(circle at 50% -20%, #1e293b 0%, transparent 50%);
                z-index: -1;
            }

            .pc-readable { font-size: 0.875rem; line-height: 1.65; letter-spacing: 0; }
            .pc-input {
                font-size: 0.875rem;
                letter-spacing: 0;
                text-transform: none;
            }
            .pc-label-xs {
                font-size: 0.6875rem;
                letter-spacing: 0.12em;
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="mesh-bg"></div>

        <nav class="fixed top-0 w-full z-50 p-6 flex justify-between items-center glass-panel border-b border-white/5">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span class="font-black tracking-tighter text-xl text-white uppercase">PREDICTA<span class="text-emerald-500">CORE</span></span>
            </div>
            <div class="flex items-center space-x-6">
                <div class="flex space-x-3 text-[10px] tracking-widest border border-zinc-800 px-3 py-1 rounded-full bg-black/50">
                    <span id="lang-en" class="lang-btn active">EN</span>
                    <span class="text-zinc-700">/</span>
                    <span id="lang-es" class="lang-btn">ES</span>
                </div>
                <a href="#terminal-section" id="nav-access" class="text-xs uppercase font-bold tracking-wide text-emerald-500 border-b border-emerald-500/30 hover:text-emerald-400 transition-colors">Escaneo gratis</a>
            </div>
        </nav>

        <section class="pt-28 pb-16 md:pt-36 md:pb-20 px-6">
            <div class="max-w-6xl mx-auto w-full">
                <h1 id="hero-title" class="text-huge text-white mb-8 md:mb-10">TRAFFIC DOES NOT GUARANTEE <br><span class="text-emerald-500">PROFITABILITY.</span></h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div class="border-l-4 border-emerald-500 pl-6">
                        <p id="hero-desc-left" class="text-lg text-zinc-200 leading-relaxed pc-readable">
                            Your public page is where strangers decide yes or no. We don't need your analytics — we forensic-scan what every customer sees and show you exactly what's making them leave.
                        </p>
                    </div>
                    <div class="border-l-4 border-zinc-700 pl-6 flex flex-col justify-center">
                        <p id="hero-desc-right" class="text-base text-zinc-400 leading-relaxed pc-readable">
                            If your page loses visitors in silence, you're giving away sales. One URL. One PDF. We map every moment a customer hesitates, bounces, or chooses a competitor — plus 15 copy-paste fixes to recover conversions. Deeper than generic chat AI. More deliverables than agencies charging $3k+ to review the same page.
                        </p>
                    </div>
                </div>
                <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#terminal-section" id="hero-cta" class="inline-block w-full sm:w-auto text-center bg-emerald-600 text-white font-black py-4 px-8 rounded hover:bg-emerald-500 transition-all uppercase tracking-wide text-sm">
                        Ejecutar escaneo gratuito
                    </a>
                </div>
                <p id="hero-tagline" class="max-w-3xl mx-auto mt-8 text-center text-xs text-emerald-500/90 uppercase tracking-wide font-semibold">
                    We don't value your internal data. We value what your page is doing to your next customer.
                </p>
            </div>
        </section>

        <section id="why-section" class="py-16 border-b border-zinc-900 bg-black/40">
            <div class="max-w-6xl mx-auto px-6">
                <h2 id="why-title" class="text-xs text-emerald-500 font-bold tracking-wide uppercase mb-3 text-center">Why PredictaCore</h2>
                <p id="why-sub" class="text-2xl md:text-3xl font-black text-white text-center mb-10 max-w-3xl mx-auto leading-tight">The spearhead audit for entrepreneurs who can't afford to guess.</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 border border-zinc-800 rounded-xl bg-white/[0.03]">
                        <h3 id="why-1-t" class="text-white font-bold text-sm mb-3">Our only focus</h3>
                        <p id="why-1-d" class="text-sm text-zinc-400 leading-relaxed pc-readable">Your live website or social profile — what a real visitor sees before they buy, book, or bounce. We find friction, invisible errors, and missed trust signals. Goal: stop losing customers you never knew you had.</p>
                    </div>
                    <div class="p-6 border border-emerald-500/20 rounded-xl bg-emerald-950/10">
                        <h3 id="why-2-t" class="text-emerald-400 font-bold text-sm mb-3">Beat agencies on the same page</h3>
                        <p id="why-2-d" class="text-sm text-zinc-300 leading-relaxed pc-readable">Any consultant reviewing only your public URL gets one opinion deck. You get measured SEO + AI scores, buyer profiles by industry, verified competitors when found, 15 leaks, 15 copy-paste actions, captures, and a 21-day roadmap — for $199.</p>
                    </div>
                    <div class="p-6 border border-zinc-800 rounded-xl bg-white/[0.03]">
                        <h3 id="why-3-t" class="text-white font-bold text-sm mb-3">Beat generic AI</h3>
                        <p id="why-3-d" class="text-sm text-zinc-400 leading-relaxed pc-readable">ChatGPT guesses. We scrape, score, simulate buyer psychology by your industry, validate outputs, and deliver a structured 11-section PDF — not a paragraph you have to interpret.</p>
                    </div>
                </div>
                <p id="why-foot" class="text-center text-xs text-zinc-500 mt-8 max-w-2xl mx-auto leading-relaxed pc-readable">Not for Fortune 500 data rooms. For the shop owner, clinic, creator, or local brand who needs their page to convert — today.</p>
            </div>
        </section>

        <section class="py-16 bg-[#080808] border-y border-zinc-900 overflow-hidden">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="order-2 lg:order-1">
                        <div class="dossier-preview p-8 md:p-12 rounded-sm aspect-[3/4] max-w-md mx-auto relative flex flex-col">
                            <div class="absolute top-4 right-4 text-[8px] font-bold text-zinc-400 uppercase">TITAN REPORT // CONFIDENTIAL</div>
                            
                            <div class="flex items-center space-x-2 mb-6 border-b border-zinc-200 pb-4 mt-4">
                                <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span class="font-black tracking-tighter text-lg text-black uppercase">PREDICTA<span class="text-emerald-600">CORE</span></span>
                                <span id="dos-sample" class="text-[9px] text-zinc-400 ml-auto uppercase font-bold tracking-widest bg-zinc-100 px-2 py-1 rounded">SAMPLE EXTRACT</span>
                            </div>

                            <h4 id="dos-title" class="text-2xl font-black mb-4 uppercase tracking-tighter">Vital Signs</h4>
                            
                            <div id="dos-meat" class="flex-grow space-y-3">
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 01 ] - Checkout Friction:</strong><br>
                                        Express payment buttons bypass cart and reduce AOV.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Restrict express buttons to final screen.
                                    </p>
                                </div>
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 02 ] - Authority Weakness:</strong><br>
                                        Website disconnected from positive external reviews.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Inject dynamic social proof carousel.
                                    </p>
                                </div>
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 03 ] - Visual Paralysis:</strong><br>
                                        Cluttered main menu fragments user attention.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Consolidate navigation into "Shop By Item".
                                    </p>
                                </div>
                            </div>
                            
                            <div class="mt-6 pt-4 border-t border-zinc-200">
                                <div class="h-2 bg-zinc-200 w-full mb-2"></div>
                                <div class="h-2 bg-emerald-500 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="order-1 lg:order-2">
                        <h2 id="offer-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-4">What we deliver</h2>
                        <h3 id="offer-sub" class="text-4xl font-extrabold text-white mb-6 leading-none">A Boardroom Level Blueprint.</h3>
                        <p id="offer-desc" class="text-zinc-300 mb-6 leading-relaxed">
                            The Titan Report is an 11-section PDF delivered by email. We detect your business type, simulate how each buyer profile reacts, and give copy-paste fixes — plus real SEO and AI visibility scores.
                        </p>
                        <ul id="offer-deliverables" class="space-y-2 font-mono text-xs text-zinc-400 mb-8 border-l border-emerald-500/30 pl-4 pc-readable">
                            <li id="od-1">✓ Desktop + mobile capture · measured load time</li>
                            <li id="od-2">✓ SEO forensics (title, meta, schema, sitemap, robots)</li>
                            <li id="od-3">✓ AI discoverability (GEO) · technical proxy score 0–100</li>
                            <li id="od-4">✓ 4 buyer profiles by industry + friction findings</li>
                            <li id="od-5">✓ 15 drop-offs + 15 copy-paste actions · 21-day roadmap</li>
                            <li id="od-6">✓ Web or Instagram / Facebook / TikTok profile</li>
                        </ul>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div class="border border-zinc-700 rounded-xl p-6 bg-zinc-900/50">
                        <h4 id="lite-box-title" class="text-emerald-500 text-xs font-bold uppercase tracking-wide mb-3">Lite — Free</h4>
                        <ul id="lite-box-list" class="text-sm text-zinc-400 space-y-2 font-mono pc-readable">
                            <li>· 3 critical conversion leaks</li>
                            <li>· SEO + AI visibility snapshot</li>
                            <li>· Buyer profiles by industry (summary)</li>
                        </ul>
                    </div>
                    <div class="border border-emerald-500/40 rounded-xl p-6 bg-emerald-950/20">
                        <h4 id="titan-box-title" class="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-3">Titan — USD $199 <span class="text-zinc-500 normal-case">(intro)</span></h4>
                        <ul id="titan-box-list" class="text-sm text-zinc-300 space-y-2 font-mono pc-readable">
                            <li>· Full 11-section forensic PDF</li>
                            <li>· 15 leaks + 15 copy-paste actions</li>
                            <li>· SEO forensics + AI (GEO) + benchmark</li>
                            <li>· Monthly monitoring report ($25/mo from day 30)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 relative border-b border-zinc-900">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 id="method-title" class="text-xs text-emerald-500 font-bold tracking-wide uppercase mb-8">The 11 forensic pillars</h2>

                <div class="bg-black/50 border border-zinc-800 p-8 rounded-xl text-left max-w-4xl mx-auto">
                    <h3 id="pillars-title" class="text-emerald-500 font-bold tracking-wide uppercase mb-6 text-xs border-b border-zinc-800 pb-4">What your PDF includes</h3>
                    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 font-mono text-xs text-zinc-400 pc-readable">
                        <li id="p-1"><span class="text-emerald-600 mr-2">01</span> Asset X-Ray</li>
                        <li id="p-2"><span class="text-emerald-600 mr-2">02</span> Psychological Profiles</li>
                        <li id="p-3"><span class="text-emerald-600 mr-2">03</span> Health Scorecard</li>
                        <li id="p-4"><span class="text-emerald-600 mr-2">04</span> Visibility & SEO</li>
                        <li id="p-5"><span class="text-emerald-600 mr-2">05</span> Competitive Benchmark</li>
                        <li id="p-6"><span class="text-emerald-600 mr-2">06</span> SWOT Matrix</li>
                        <li id="p-7"><span class="text-emerald-600 mr-2">07</span> Wishlist</li>
                        <li id="p-8"><span class="text-emerald-600 mr-2">08</span> 15 Drop-off Points</li>
                        <li id="p-9"><span class="text-emerald-600 mr-2">09</span> 15 Tactical Actions</li>
                        <li id="p-10"><span class="text-emerald-600 mr-2">10</span> Scaling Tools</li>
                        <li id="p-11"><span class="text-emerald-600 mr-2">11</span> 21-Day Roadmap</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="terminal-section" class="py-16 bg-emerald-950/10 border-t border-emerald-900/20">
            <div class="max-w-2xl mx-auto px-6">
                
                <div id="setup-stage" class="terminal-box p-8 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-zinc-800 bg-black/80 relative">
                    <h2 id="term-title" class="text-2xl font-black text-white mb-2 uppercase tracking-tighter text-center">Start Forensic Diagnostic</h2>
                    <p id="term-sub" class="text-sm text-zinc-400 text-center mb-6 pc-readable">Paste your website or public Instagram, Facebook, or TikTok URL. No login required.</p>
                    <div class="space-y-4">
                        <input type="url" id="dna-url" placeholder="Website or social profile URL (yourbusiness.com · instagram.com/brand)" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono pc-input">
                        <input type="email" id="user-email" placeholder="Your Email" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono pc-input">
                        <p id="lite-eta-before" class="text-xs text-zinc-500 leading-relaxed text-center pc-readable">Report delivery can take up to 60 minutes while our engine processes your site.</p>
                        <p id="setup-error" class="hidden-flow text-sm text-red-400 text-center font-medium" role="alert"></p>
                        <button type="button" id="btn-start" class="w-full bg-emerald-600 text-white font-black py-4 rounded hover:bg-emerald-500 transition-all uppercase tracking-wide text-sm disabled:opacity-60 disabled:cursor-wait">
                            Execute Free Scan
                        </button>
                    </div>
                </div>

                <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-black border border-emerald-500">
                    <div class="scan-line"></div>
                    <div id="terminal-output" class="font-mono text-[10px] text-emerald-500 space-y-1 h-64 overflow-y-auto">
                        <p id="log-init">>> INITIALIZING PREDICTACORE CORE...</p>
                    </div>
                </div>

                <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center relative border border-emerald-500/50 bg-black">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 id="up-t" class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">X-Ray Sealed</h2>
                    <p class="text-zinc-400 text-xs mb-2" id="up-st">Successfully sent to <span id="sent-email" class="text-white font-bold"></span>.</p>
                    <p id="lite-queued-msg" class="text-emerald-500/90 text-[10px] font-bold uppercase tracking-widest mb-2 leading-relaxed">Your Lite report is being generated and will arrive by email.</p>
                    <p id="lite-eta-after" class="text-amber-500/80 text-[10px] mb-8 leading-relaxed border border-amber-500/15 rounded p-3 bg-amber-950/10">Delivery may take up to 60 minutes due to forensic processing volume. Check spam.</p>
                    
                    <div class="bg-zinc-900 border border-zinc-700 p-6 rounded mb-8 text-left">
                        <p id="box-text" class="text-[11px] text-zinc-300 leading-relaxed">
                            Initial scan shows critical bottlenecks. You are losing sales today due to purchasing obstacles. The Titan Report dissects your website and delivers the exact instructions to fix these leaks.
                        </p>
                    </div>

                    <div class="border-t border-zinc-800 pt-8">
                        <h4 class="text-4xl font-black text-white mb-2 tracking-tighter">$199 <span id="titan-price-note" class="text-xs text-zinc-500 font-normal">USD · introductory · one-time</span></h4>
                        <p id="sub-price" class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-2">Charged today: USD $199 (Titan Report — intro price)</p>
                        <p id="sub-price-2" class="text-xs text-zinc-400 mb-4 leading-relaxed pc-readable">USD $25/mo monitoring starts 30 days after purchase. Renews unless cancelled — cancellation: audit@predictacore.ai or billing portal after purchase (see Terms).</p>
                        <p id="titan-eta-before" class="text-[10px] text-zinc-500 mb-4 leading-relaxed">After payment, your Titan PDF may take up to 60 minutes to arrive by email.</p>
                        
                        <button type="button" class="w-full bg-emerald-600 text-white font-black py-4 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-2 transition-opacity disabled:opacity-60 disabled:cursor-wait" id="btn-titan">
                            Get Full Titan Report — $199
                        </button>
                        <p id="checkout-error" class="hidden-flow text-[10px] text-red-400 mb-2 leading-relaxed" role="alert"></p>
                        <p id="cancel-badge" class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a></p>
                    </div>
                </div>
            </div>
        </section>

        <div id="checkout-overlay" class="hidden-flow fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md px-6" aria-live="polite" aria-busy="true">
            <div class="terminal-box w-full max-w-md p-10 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                <div class="w-11 h-11 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" role="status"></div>
                <p id="checkout-overlay-title" class="text-white font-black uppercase tracking-[0.2em] text-xs mb-3">Secure checkout</p>
                <p id="checkout-overlay-sub" class="text-zinc-500 text-[10px] leading-relaxed font-mono">Connecting to Stripe…</p>
            </div>
        </div>

        <footer class="py-10 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-4xl mx-auto px-6">
                <p id="footer-text" class="text-xs text-emerald-600 uppercase tracking-wide mb-4">Consultant or Agency? Join our Forensic Audit network.</p>
                <p id="disclaimer-text" class="text-xs text-zinc-500 leading-relaxed mb-4 max-w-2xl mx-auto pc-readable">
                    PredictaCore AI website audits. USD $199 introductory price charged today. Monitoring $25/mo from day 30; renews unless cancelled per <a href="/terms" class="text-emerald-600 underline">Terms</a> (audit@predictacore.ai). Card statement: PREDICTACORE. Titan Report — all sales final.
                </p>
                <p class="text-xs text-zinc-600 mb-4">
                    <a href="/terms" class="text-emerald-600 hover:underline">Terms</a> · <a href="/privacy" class="text-emerald-600 hover:underline">Privacy</a>
                </p>
                <div class="text-xs text-zinc-600 font-mono">
                    © 2026 PredictaCore · predictacore.ai
                </div>
            </div>
        </footer>

        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref') || '';

            let currentLang = 'en';
            
            const dictionary = {
                en: {
                    pageTitle: "PredictaCore | Forensic audit for entrepreneurs",
                    navAccess: "Free scan",
                    heroCta: "Run free scan",
                    heroTitle: "TRAFFIC DOES NOT GUARANTEE <br><span class='text-emerald-500'>PROFITABILITY.</span>",
                    heroDescLeft: "Your public page is where strangers decide yes or no. We don't need your analytics — we forensic-scan what every customer sees and show you exactly what's making them leave.",
                    heroDescRight: "If your page loses visitors in silence, you're giving away sales. One URL. One PDF. We map every moment a customer hesitates, bounces, or chooses a competitor — plus 15 copy-paste fixes to recover conversions. Deeper than generic chat AI. More deliverables than agencies charging $3k+ to review the same page.",
                    heroTagline: "We don't value your internal data. We value what your page is doing to your next customer.",
                    whyTitle: "Why PredictaCore",
                    whySub: "The spearhead audit for entrepreneurs who can't afford to guess.",
                    why1T: "Our only focus", why1D: "Your live website or social profile — what a real visitor sees before they buy, book, or bounce. We find friction, invisible errors, and missed trust signals. Goal: stop losing customers you never knew you had.",
                    why2T: "Beat agencies on the same page", why2D: "Any consultant reviewing only your public URL gets one opinion deck. You get measured SEO + AI scores, buyer profiles by industry, verified competitors when found, 15 leaks, 15 copy-paste actions, captures, and a 21-day roadmap — for $199.",
                    why3T: "Beat generic AI", why3D: "ChatGPT guesses. We scrape, score, simulate buyer psychology by your industry, validate outputs, and deliver a structured 11-section PDF — not a paragraph you have to interpret.",
                    whyFoot: "Not for Fortune 500 data rooms. For the shop owner, clinic, creator, or local brand who needs their page to convert — today.",
                    dosSample: "SAMPLE EXTRACT",
                    dosTitle: "Vital Signs",
                    dosMeat: '<div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 01 ] - Checkout Friction:</strong><br>Express payment buttons bypass cart and reduce AOV.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Restrict express buttons to final screen.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 02 ] - Authority Weakness:</strong><br>Website disconnected from positive external reviews.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Inject dynamic social proof carousel.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 03 ] - Visual Paralysis:</strong><br>Cluttered main menu fragments user attention.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Consolidate navigation into "Shop By Item".</p></div>',
                    offerTitle: "What we deliver", offerSub: "A Boardroom Level Blueprint.", offerDesc: "The Titan Report is an 11-section PDF delivered by email. We detect your business type, simulate how each buyer profile reacts, and give copy-paste fixes — plus real SEO and AI visibility scores.",
                    od1: "✓ Desktop + mobile capture · measured load time",
                    od2: "✓ SEO forensics (title, meta, schema, sitemap, robots)",
                    od3: "✓ AI discoverability (GEO) · technical proxy score 0–100",
                    od4: "✓ 4 buyer profiles by industry + friction findings",
                    od5: "✓ 15 drop-offs + 15 copy-paste actions · 21-day roadmap",
                    od6: "✓ Web or Instagram / Facebook / TikTok profile",
                    liteBoxTitle: "Lite — Free",
                    liteBoxList: "<li>· 3 critical conversion leaks</li><li>· SEO + AI visibility snapshot</li><li>· Buyer profiles by industry (summary)</li>",
                    titanBoxTitle: "Titan — USD $199 (intro)",
                    titanBoxList: "<li>· Full 11-section forensic PDF</li><li>· 15 leaks + 15 copy-paste actions</li><li>· SEO forensics + AI (GEO) + benchmark</li><li>· Monthly monitoring report ($25/mo from day 30)</li>",
                    methodTitle: "The 11 forensic pillars",
                    pillarsTitle: "What your PDF includes",
                    p1: "Asset X-Ray", p2: "Psychological Profiles", p3: "Health Scorecard", p4: "Visibility & SEO", p5: "Competitive Benchmark", p6: "SWOT Matrix", p7: "Wishlist", p8: "15 Drop-off Points", p9: "15 Tactical Actions", p10: "Scaling Tools", p11: "21-Day Roadmap",
                    termTitle: "Start Forensic Diagnostic",
                    termSub: "Paste your website or public Instagram, Facebook, or TikTok URL. No login required.",
                    btnStart: "Execute Free Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "X-Ray Sealed", upSt: "Successfully sent to",
                    boxText: "Initial scan shows critical bottlenecks. You are losing sales today due to purchasing obstacles. The Titan Report dissects your website and delivers the exact instructions to fix these leaks.",
                    subPrice: "Charged today: USD $199 (Titan Report — intro price)",
                    subPrice2: "USD $25/mo monitoring starts 30 days after purchase. Renews unless cancelled — cancellation: audit@predictacore.ai or billing portal after purchase (see Terms).",
                    btnTitan: "Get Full Titan Report — $199",
                    titanPriceNote: "USD · introductory · one-time",
                    urlHint: "Instagram, Facebook, TikTok, or any public website — no login required.",
                    cancelBadge: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>',
                    footerText: "Consultant or Agency? Join our Forensic Audit network.",
                    disclaimerText: "PredictaCore audits. $199 intro price today. $25/mo monitoring from day 30; renews unless cancelled per Terms. Statement: PREDICTACORE.",
                    checkoutLoading: "Opening secure checkout…",
                    checkoutOverlayTitle: "Secure checkout",
                    checkoutOverlaySub: "Redirecting to Stripe. Do not close this window.",
                    checkoutError: "Could not start checkout. Try again or contact support.",
                    checkoutNetwork: "Network error. Check your connection and try again.",
                    alertError: "URL and email are required.",
                    invalidEmail: "Enter a valid email address.",
                    scanError: "Could not start the scan. Try again in a moment.",
                    liteEtaBefore: "Report delivery can take up to 60 minutes while our engine processes your site.",
                    liteQueued: "Your Lite report is being generated and will arrive by email.",
                    liteEtaAfter: "Delivery may take up to 60 minutes due to forensic processing volume. Check spam.",
                    titanEtaBefore: "After payment, your Titan PDF may take up to 60 minutes to arrive by email.",
                    successPayment: "Payment confirmed! Your Titan report is being processed by the AI and will arrive in your email shortly.",
                    phUrl: "Website or social profile URL (yourbusiness.com · instagram.com/brand)", phEmail: "Your Email"
                },
                es: {
                    pageTitle: "PredictaCore | Auditoría forense para emprendedores",
                    navAccess: "Escaneo gratis",
                    heroCta: "Ejecutar escaneo gratuito",
                    heroTitle: "TENER TRÁFICO NO GARANTIZA <br><span class='text-emerald-500'>RENTABILIDAD.</span>",
                    heroDescLeft: "Tu página pública es donde un desconocido dice sí o no. No necesitamos tu analytics — escaneamos lo que ve cada cliente y te mostramos qué lo hace irse.",
                    heroDescRight: "Si tu página pierde visitantes en silencio, estás regalando ventas. Una URL. Un PDF. Mapeamos cada punto donde un cliente duda, abandona o se va con la competencia — y te damos 15 correcciones copy-paste para recuperar conversiones. Más rigor que una IA genérica. Más entregables que agencias que cobran $3k+ por revisar la misma página.",
                    heroTagline: "No valoramos tus datos internos. Valoramos lo que tu página le hace a tu próximo cliente.",
                    whyTitle: "Por qué PredictaCore",
                    whySub: "La auditoría punta de lanza para emprendedores que no pueden permitirse adivinar.",
                    why1T: "Nuestro único foco", why1D: "Tu web o perfil social en vivo — lo que ve un visitante real antes de comprar, reservar o irse. Detectamos fricción, errores invisibles y señales de confianza faltantes. Objetivo: dejar de perder clientes que ni sabías que tenías.",
                    why2T: "Mejor que agencias sobre la misma página", why2D: "Un consultor que solo ve tu URL entrega un deck de opinión. Tú recibes scores SEO + IA medidos, perfiles de comprador por giro, competencia verificada cuando existe, 15 fugas, 15 acciones copy-paste, capturas y roadmap 21 días — por $199.",
                    why3T: "Mejor que IA genérica", why3D: "ChatGPT adivina. Nosotros scrapeamos, medimos, simulamos psicología de comprador según tu giro, validamos el output y entregamos un PDF de 11 secciones — no un párrafo que debes interpretar.",
                    whyFoot: "No es para data rooms de Fortune 500. Es para la tienda, clínica, creador o marca local que necesita que su página convierta — hoy.",
                    dosSample: "EXTRACTO DE MUESTRA",
                    dosTitle: "Signos Vitales",
                    dosMeat: '<div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 01 ] - Fricción de Checkout:</strong><br>Botones de pago rápido saltan el carrito y reducen el Ticket Promedio.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Restringir botones express a la pantalla final.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 02 ] - Debilidad de Autoridad:</strong><br>Sitio web desconectado de reseñas externas positivas.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Inyectar carrusel dinámico de prueba social.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 03 ] - Parálisis Visual:</strong><br>Menú principal saturado fragmenta la atención.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Consolidar navegación en "Shop By Item".</p></div>',
                    offerTitle: "Lo que entregamos", offerSub: "Un Mapa de Acción Definitivo.", offerDesc: "El Reporte Titán es un PDF de 11 secciones por email. Detectamos tu giro, simulamos cómo reacciona cada perfil de comprador y entregamos correcciones copy-paste — más scores SEO e IA reales.",
                    od1: "✓ Captura desktop/móvil · tiempo de carga medido",
                    od2: "✓ SEO forense (title, meta, schema, sitemap, robots)",
                    od3: "✓ Visibilidad en IAs (GEO) · score técnico 0–100",
                    od4: "✓ 4 perfiles de comprador por giro + hallazgos de fricción",
                    od5: "✓ 15 fugas + 15 acciones copy-paste · roadmap 21 días",
                    od6: "✓ Web o perfil Instagram / Facebook / TikTok",
                    liteBoxTitle: "Lite — Gratis",
                    liteBoxList: "<li>· 3 fugas críticas de conversión</li><li>· Snapshot SEO + visibilidad IA</li><li>· Perfiles de comprador por giro (resumen)</li>",
                    titanBoxTitle: "Titán — USD $199 (intro)",
                    titanBoxList: "<li>· PDF forense completo (11 secciones)</li><li>· 15 fugas + 15 acciones copy-paste</li><li>· SEO forense + IA (GEO) + benchmark</li><li>· Reporte mensual de seguimiento ($25/mes desde día 30)</li>",
                    methodTitle: "Los 11 pilares forenses",
                    pillarsTitle: "Qué incluye tu PDF",
                    p1: "Radiografía del Activo", p2: "Perfiles Psicológicos", p3: "Scorecard de Salud", p4: "Visibilidad y SEO", p5: "Benchmark Competitivo", p6: "Matriz Estratégica", p7: "Lista de Deseos", p8: "15 Puntos de Fuga", p9: "15 Acciones Tácticas", p10: "Herramientas de Escala", p11: "Hoja de Ruta a 21 Días",
                    termTitle: "Iniciar diagnóstico forense",
                    termSub: "Pega tu web o URL pública de Instagram, Facebook o TikTok. Sin login.",
                    btnStart: "Ejecutar escaneo gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upT: "Radiografía Sellada", upSt: "Enviado con éxito a",
                    boxText: "El escaneo inicial muestra cuellos de botella críticos. Estás perdiendo ventas hoy por obstáculos de compra. El Reporte Titán disecta tu sitio y entrega las instrucciones exactas para arreglar estas fugas.",
                    subPrice: "Cobro hoy: USD $199 (Reporte Titán — precio introductorio)",
                    subPrice2: "Monitoreo USD $25/mes desde el día 30. Se renueva salvo cancelación — solicitud: audit@predictacore.ai o portal en correo de activación (ver Términos).",
                    btnTitan: "Obtener Reporte Titán completo — $199",
                    titanPriceNote: "USD · precio introductorio · pago único",
                    urlHint: "Instagram, Facebook, TikTok o cualquier web pública — sin login.",
                    cancelBadge: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>',
                    footerText: "¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.",
                    disclaimerText: "Auditorías PredictaCore. $199 precio introductorio hoy. Monitoreo $25/mes desde día 30; se renueva salvo cancelación según Términos. Estado de cuenta: PREDICTACORE.",
                    checkoutLoading: "Abriendo pago seguro…",
                    checkoutOverlayTitle: "Pago seguro",
                    checkoutOverlaySub: "Redirigiendo a Stripe. No cierres esta ventana.",
                    checkoutError: "No se pudo iniciar el pago. Reintenta o contacta soporte.",
                    checkoutNetwork: "Error de red. Revisa tu conexión e intenta de nuevo.",
                    alertError: "URL y email son obligatorios.",
                    invalidEmail: "Ingresa un email válido.",
                    scanError: "No se pudo iniciar el escaneo. Intenta de nuevo en un momento.",
                    liteEtaBefore: "La entrega puede tardar hasta 60 minutos mientras procesamos tu sitio.",
                    liteQueued: "Tu reporte Lite se está generando y llegará por correo.",
                    liteEtaAfter: "La entrega puede tardar hasta 60 minutos por el volumen de análisis. Revisa spam.",
                    titanEtaBefore: "Tras el pago, tu PDF Titán puede tardar hasta 60 minutos en llegar por correo.",
                    successPayment: "¡Pago confirmado! Tu reporte Titán está siendo procesado por la IA y llegará a tu correo a la brevedad.",
                    phUrl: "URL web o perfil social (tunegocio.com · instagram.com/marca)", phEmail: "Tu Email"
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
                
                document.getElementById('nav-access').innerText = d.navAccess;
                if (d.heroCta) document.getElementById('hero-cta').innerText = d.heroCta;
                document.getElementById('hero-title').innerHTML = d.heroTitle;
                document.getElementById('hero-desc-left').innerText = d.heroDescLeft;
                document.getElementById('hero-desc-right').innerText = d.heroDescRight;
                if (d.heroTagline) document.getElementById('hero-tagline').innerText = d.heroTagline;
                if (d.whyTitle) document.getElementById('why-title').innerText = d.whyTitle;
                if (d.whySub) document.getElementById('why-sub').innerText = d.whySub;
                if (d.why1T) document.getElementById('why-1-t').innerText = d.why1T;
                if (d.why1D) document.getElementById('why-1-d').innerText = d.why1D;
                if (d.why2T) document.getElementById('why-2-t').innerText = d.why2T;
                if (d.why2D) document.getElementById('why-2-d').innerText = d.why2D;
                if (d.why3T) document.getElementById('why-3-t').innerText = d.why3T;
                if (d.why3D) document.getElementById('why-3-d').innerText = d.why3D;
                if (d.whyFoot) document.getElementById('why-foot').innerText = d.whyFoot;
                
                document.getElementById('dos-sample').innerText = d.dosSample;
                document.getElementById('dos-title').innerText = d.dosTitle;
                document.getElementById('dos-meat').innerHTML = d.dosMeat;

                document.getElementById('offer-title').innerText = d.offerTitle;
                document.getElementById('offer-sub').innerText = d.offerSub;
                document.getElementById('offer-desc').innerText = d.offerDesc;
                for (let i = 1; i <= 6; i++) {
                    const el = document.getElementById('od-' + i);
                    if (el && d['od' + i]) el.innerText = d['od' + i];
                }
                if (d.liteBoxTitle) document.getElementById('lite-box-title').innerText = d.liteBoxTitle;
                if (d.liteBoxList) document.getElementById('lite-box-list').innerHTML = d.liteBoxList;
                if (d.titanBoxTitle) document.getElementById('titan-box-title').innerText = d.titanBoxTitle;
                if (d.titanBoxList) document.getElementById('titan-box-list').innerHTML = d.titanBoxList;
                if (d.titanPriceNote) document.getElementById('titan-price-note').innerText = d.titanPriceNote;

                document.getElementById('method-title').innerText = d.methodTitle;
                
                document.getElementById('pillars-title').innerText = d.pillarsTitle;
                for(let i=1; i<=11; i++) {
                    let text = d['p'+i];
                    let num = i < 10 ? '0'+i : i;
                    document.getElementById('p-'+i).innerHTML = '<span class="text-emerald-600 mr-2">' + num + '</span> ' + text;
                }
                
                document.getElementById('term-title').innerText = d.termTitle;
                if (d.termSub) document.getElementById('term-sub').innerText = d.termSub;
                document.getElementById('btn-start').innerText = d.btnStart;
                document.getElementById('dna-url').placeholder = d.phUrl;
                document.getElementById('user-email').placeholder = d.phEmail;
                document.getElementById('log-init').innerText = d.logInit;
                
                document.getElementById('up-t').innerText = d.upT;
                document.getElementById('up-st').innerHTML = d.upSt + ' <span id="sent-email" class="text-white font-bold">' + document.getElementById('user-email').value + '</span>.';
                
                document.getElementById('box-text').innerText = d.boxText;
                document.getElementById('sub-price').innerText = d.subPrice;
                document.getElementById('sub-price-2').innerText = d.subPrice2;
                document.getElementById('btn-titan').innerText = d.btnTitan;
                document.getElementById('cancel-badge').innerHTML = d.cancelBadge;
                document.getElementById('lite-eta-before').innerText = d.liteEtaBefore;
                document.getElementById('lite-queued-msg').innerText = d.liteQueued;
                document.getElementById('lite-eta-after').innerText = d.liteEtaAfter;
                document.getElementById('titan-eta-before').innerText = d.titanEtaBefore;
                
                document.getElementById('footer-text').innerText = d.footerText;
                document.getElementById('disclaimer-text').innerText = d.disclaimerText;
            }

            function setSetupError(msg) {
                const el = document.getElementById('setup-error');
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
                if (btn) {
                    btn.disabled = false;
                    btn.classList.remove('opacity-60', 'cursor-wait');
                }
            }

            async function iniciarEscaneo() {
                const url = (document.getElementById('dna-url')?.value || '').trim();
                const email = (document.getElementById('user-email')?.value || '').trim();
                const d = dictionary[currentLang];
                const btn = document.getElementById('btn-start');
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                if (!url || !email) {
                    setSetupError(d.alertError);
                    return;
                }
                if (!emailOk) {
                    setSetupError(d.invalidEmail);
                    return;
                }
                setSetupError('');

                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-60', 'cursor-wait');
                }

                document.getElementById('setup-stage')?.classList.add('hidden-flow');
                document.getElementById('scanner-stage')?.classList.remove('hidden-flow');
                document.getElementById('upsell-stage')?.classList.add('hidden-flow');
                document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                updateSentEmail(email);

                const terminal = document.getElementById('terminal-output');
                if (terminal) {
                    terminal.innerHTML = '<p id="log-init">' + d.logInit + '</p>';
                }

                const logs = currentLang === 'es'
                    ? [">> Conectando nodos...", ">> Analizando página pública...", ">> Detectando fricción y fugas...", ">> Generando reporte Lite...", ">> Enviando por correo..."]
                    : [">> Connecting nodes...", ">> Scanning public page...", ">> Detecting friction and leaks...", ">> Building Lite report...", ">> Sending email..."];

                let fetchOk = false;
                try {
                    const res = await fetch('/start-lite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dna: url, email }),
                    });
                    fetchOk = res.ok;
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.error || d.scanError);
                    }
                } catch (err) {
                    resetScanUi();
                    setSetupError(err.message || d.scanError);
                    return;
                }

                if (!fetchOk) return;

                let i = 0;
                const interval = setInterval(() => {
                    if (!terminal || i >= logs.length) {
                        clearInterval(interval);
                        return;
                    }
                    const p = document.createElement('p');
                    p.innerText = logs[i];
                    terminal.appendChild(p);
                    i++;
                    if (i >= logs.length) {
                        clearInterval(interval);
                        setTimeout(() => {
                            document.getElementById('scanner-stage')?.classList.add('hidden-flow');
                            document.getElementById('upsell-stage')?.classList.remove('hidden-flow');
                        }, 1500);
                    }
                }, 900);
            }

            function setCheckoutError(msg) {
                const el = document.getElementById('checkout-error');
                el.innerText = msg || '';
                el.classList.toggle('hidden-flow', !msg);
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
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                const d = dictionary[currentLang];
                const btn = document.getElementById('btn-titan');
                const btnLabel = d.btnTitan;

                if (!url || !email) {
                    setCheckoutError(d.alertError);
                    return;
                }

                setCheckoutError('');
                btn.disabled = true;
                btn.innerText = d.checkoutLoading;
                showCheckoutOverlay();

                try {
                    const res = await fetch('/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dna: url, email, refCode, lang: currentLang }),
                    });
                    const data = await res.json().catch(() => ({}));

                    if (res.ok && data.status === 'checkout' && data.url) {
                        window.location.assign(data.url);
                        return;
                    }

                    hideCheckoutOverlay();
                    setCheckoutError(data.error || d.checkoutError);
                    btn.disabled = false;
                    btn.innerText = btnLabel;
                } catch (err) {
                    console.error('!!! Error en pasarela:', err);
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

                const langParam = urlParams.get('lang');
                if (langParam === 'es') {
                    setLanguage('es');
                } else if (langParam === 'en') {
                    setLanguage('en');
                }

                document.getElementById('btn-start')?.addEventListener('click', iniciarEscaneo);
                document.getElementById('btn-titan')?.addEventListener('click', comprarTitan);
                document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
                document.getElementById('lang-es')?.addEventListener('click', () => setLanguage('es'));

                document.getElementById('dna-url')?.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') iniciarEscaneo();
                });
                document.getElementById('user-email')?.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') iniciarEscaneo();
                });

                if (urlParams.get('titan') === '1') {
                    setTimeout(function() {
                        document.getElementById('terminal-section').scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                }
            })();
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
