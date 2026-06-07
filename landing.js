// landing.js - REDISEÑO DE ÉLITE: CERO JERGA TÉCNICA, MÁXIMA AUTORIDAD Y ESTÉTICA BALANCEADA

const { getFaviconHeadTags } = require('./brand');

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getFaviconHeadTags()}
        
        <script>
            window.history.scrollRestoration = 'manual';
            window.onload = function() {
                setTimeout(function() { window.scrollTo(0, 0); }, 10);
            };
        </script>

        <title>PredictaCore | Forensic audit for entrepreneurs — fix the page that loses customers</title>
        <meta name="description" content="For the average entrepreneur: PredictaCore audits your public website or social profile (URL only) to find why you lose customers and exactly how to fix it. More than generic AI. Denser than a $3k agency looking at the same page. USD $349.">
        
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
                    <span onclick="setLanguage('en')" id="lang-en" class="lang-btn active">EN</span>
                    <span class="text-zinc-700">/</span>
                    <span onclick="setLanguage('es')" id="lang-es" class="lang-btn">ES</span>
                </div>
                <a href="#terminal-section" id="nav-access" class="text-[10px] uppercase font-bold tracking-widest text-emerald-500 border-b border-emerald-500/30 hover:text-emerald-400 transition-colors">Node Access</a>
            </div>
        </nav>

        <section class="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20">
            <div class="max-w-6xl mx-auto w-full">
                <h1 id="hero-title" class="text-huge text-white mb-12">TRAFFIC DOES NOT GUARANTEE <br><span class="text-emerald-500">PROFITABILITY.</span></h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    <div class="border-l-4 border-emerald-500 pl-6">
                        <p id="hero-desc-left" class="text-xl text-zinc-200 leading-tight">
                            Your public page is where strangers decide yes or no. We don't need your analytics — we forensic-scan what every customer sees and show you exactly what's making them leave.
                        </p>
                    </div>
                    <div class="border-l-4 border-zinc-700 pl-6 flex flex-col justify-center">
                        <p id="hero-desc-right" class="text-md text-zinc-400 leading-relaxed">
                            Built for the average entrepreneur, not enterprise. One URL. One PDF. Why you're losing customers on your site or social profile — and 15 copy-paste fixes. More rigor than chat AI. More deliverables than most agencies charge $3k+ to review the same page.
                        </p>
                    </div>
                </div>
                <p id="hero-tagline" class="max-w-3xl mx-auto mt-16 text-center text-[11px] text-emerald-500/90 uppercase tracking-[0.25em] font-bold">
                    We don't value your internal data. We value what your page is doing to your next customer.
                </p>
            </div>
        </section>

        <section id="why-section" class="py-20 border-b border-zinc-900 bg-black/40">
            <div class="max-w-6xl mx-auto px-6">
                <h2 id="why-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-3 text-center">Why PredictaCore</h2>
                <p id="why-sub" class="text-2xl md:text-3xl font-black text-white text-center mb-12 max-w-3xl mx-auto leading-tight">The spearhead audit for entrepreneurs who can't afford to guess.</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 border border-zinc-800 rounded-xl bg-white/[0.03]">
                        <h3 id="why-1-t" class="text-white font-bold text-sm mb-3">Our only focus</h3>
                        <p id="why-1-d" class="text-[11px] text-zinc-400 leading-relaxed">Your live website or social profile — what a real visitor sees before they buy, book, or bounce. We find friction, invisible errors, and missed trust signals. Goal: stop losing customers you never knew you had.</p>
                    </div>
                    <div class="p-6 border border-emerald-500/20 rounded-xl bg-emerald-950/10">
                        <h3 id="why-2-t" class="text-emerald-400 font-bold text-sm mb-3">Beat agencies on the same page</h3>
                        <p id="why-2-d" class="text-[11px] text-zinc-300 leading-relaxed">Any consultant reviewing only your public URL gets one opinion deck. You get measured SEO + AI scores, buyer profiles by industry, verified competitors when found, 15 leaks, 15 copy-paste actions, captures, and a 21-day roadmap — for $349.</p>
                    </div>
                    <div class="p-6 border border-zinc-800 rounded-xl bg-white/[0.03]">
                        <h3 id="why-3-t" class="text-white font-bold text-sm mb-3">Beat generic AI</h3>
                        <p id="why-3-d" class="text-[11px] text-zinc-400 leading-relaxed">ChatGPT guesses. We scrape, score, simulate buyer psychology by your industry, validate outputs, and deliver a structured 11-section PDF — not a paragraph you have to interpret.</p>
                    </div>
                </div>
                <p id="why-foot" class="text-center text-[10px] text-zinc-600 mt-10 max-w-2xl mx-auto leading-relaxed">Not for Fortune 500 data rooms. For the shop owner, clinic, creator, or local brand who needs their page to convert — today.</p>
            </div>
        </section>

        <section class="py-24 bg-[#080808] border-y border-zinc-900 overflow-hidden">
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
                        <ul id="offer-deliverables" class="space-y-3 font-mono text-[10px] text-zinc-400 mb-8 border-l border-emerald-500/30 pl-4">
                            <li id="od-1">✓ Desktop + mobile capture · measured load time</li>
                            <li id="od-2">✓ SEO forensics (title, meta, schema, sitemap, robots)</li>
                            <li id="od-3">✓ AI discoverability (GEO) · technical proxy score 0–100</li>
                            <li id="od-4">✓ 4 buyer profiles by industry + friction findings</li>
                            <li id="od-5">✓ 15 drop-offs + 15 copy-paste actions · 21-day roadmap</li>
                            <li id="od-6">✓ Web or Instagram / Facebook / TikTok profile</li>
                        </ul>
                        
                        <ul class="space-y-6 font-mono text-xs text-zinc-300">
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-1" class="leading-tight">1. Drop-off Point X-Ray<br><span class="text-[10px] text-zinc-500">(Where exactly do they leave?)</span></span>
                            </li>
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-2" class="leading-tight">2. Direct Action Plan<br><span class="text-[10px] text-zinc-500">(What to change today)</span></span>
                            </li>
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-3" class="leading-tight">3. Hidden Competition Analysis<br><span class="text-[10px] text-zinc-500">(Why do they buy elsewhere?)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div class="border border-zinc-700 rounded-xl p-6 bg-zinc-900/50">
                        <h4 id="lite-box-title" class="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-3">Lite — Free</h4>
                        <ul id="lite-box-list" class="text-[11px] text-zinc-400 space-y-2 font-mono">
                            <li>· 3 critical conversion leaks</li>
                            <li>· SEO + AI visibility snapshot</li>
                            <li>· Buyer profiles by industry (summary)</li>
                        </ul>
                    </div>
                    <div class="border border-emerald-500/40 rounded-xl p-6 bg-emerald-950/20">
                        <h4 id="titan-box-title" class="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3">Titan — USD $349</h4>
                        <ul id="titan-box-list" class="text-[11px] text-zinc-300 space-y-2 font-mono">
                            <li>· Full 11-section forensic PDF</li>
                            <li>· 15 leaks + 15 copy-paste actions</li>
                            <li>· SEO forensics + AI (GEO) + benchmark</li>
                            <li>· Monthly monitoring report ($25/mo from day 30)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-12 border-b border-zinc-900">
            <div class="max-w-3xl mx-auto px-6 text-center">
                <p id="social-banner" class="text-[11px] text-zinc-400 leading-relaxed">
                    <span class="text-emerald-500 font-bold">Web + Social:</span> paste your domain or a public Instagram, Facebook, or TikTok profile URL — same forensic engine.
                </p>
            </div>
        </section>

        <section class="py-24 relative">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 id="method-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-12">Our Technology</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">→</div>
                        <div id="m1" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Profiles by Industry</div>
                        <p id="m1-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">We detect your business type and simulate skeptical, rushed, mobile, and comparison shoppers — looking for trust gaps, weak CTAs, and checkout friction on your public URL.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">11</div>
                        <div id="m2" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Forensic Pillars</div>
                        <p id="m2-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">Full PDF: scorecard, SEO, AI visibility, verified benchmark when found, 15 leaks, 15 actions, roadmap. Lite free scan: 3 critical leaks + SEO/AI snapshot.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">URL</div>
                        <div id="m3" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Only URL Required</div>
                        <p id="m3-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">No analytics login, no plugins. Measured data from your live page or social profile + AI-assisted narrative grounded in that evidence.</p>
                    </div>
                </div>

                <div class="bg-black/50 border border-zinc-800 p-8 rounded-xl text-left max-w-4xl mx-auto">
                    <h3 id="pillars-title" class="text-emerald-500 font-bold tracking-[0.2em] uppercase mb-6 text-[10px] border-b border-zinc-800 pb-4">The 11 Pillars of our Forensic Audit</h3>
                    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 font-mono text-[10px] text-zinc-400">
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

        <section id="terminal-section" class="py-24 bg-emerald-950/10 border-t border-emerald-900/20">
            <div class="max-w-2xl mx-auto px-6">
                
                <div id="setup-stage" class="terminal-box p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-zinc-800 bg-black/80 relative">
                    <div class="absolute top-4 right-4 text-[10px] text-emerald-500 font-mono animate-pulse">
                        // AVAILABLE NODES: 2
                    </div>
                    <h2 id="term-title" class="text-2xl font-black text-white mt-4 mb-6 uppercase tracking-tighter text-center">Start Forensic Diagnostic</h2>
                    <div class="space-y-4">
                        <input type="text" id="dna-url" placeholder="Website or social profile URL (yourbusiness.com · instagram.com/brand)" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs tracking-widest">
                        <input type="email" id="user-email" placeholder="Your Email" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <p id="url-hint" class="text-[9px] text-zinc-600 text-center leading-relaxed">Instagram, Facebook, TikTok, or any public website — no login required.</p>
                        <p id="lite-eta-before" class="text-[10px] text-zinc-500 leading-relaxed text-center">Report delivery can take up to 60 minutes while our engine processes your site.</p>
                        <p id="setup-error" class="hidden-flow text-[10px] text-red-400 text-center" role="alert"></p>
                        <button id="btn-start" onclick="iniciarEscaneo()" class="w-full bg-emerald-600 text-white font-black py-4 rounded hover:bg-emerald-500 transition-all uppercase tracking-[0.2em] text-xs">
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
                        <h4 class="text-4xl font-black text-white mb-2 tracking-tighter">$349 <span id="titan-price-note" class="text-xs text-zinc-500 font-normal">USD · one-time</span></h4>
                        <p id="sub-price" class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-2">Charged today: USD $349 (Titan Report)</p>
                        <p id="sub-price-2" class="text-[9px] text-zinc-400 mb-4 leading-relaxed">Monitoring subscription ($25/mo) activates now; first monthly charge in ~30 days. Cancel at least 5 business days before renewal. All sales final — no refunds.</p>
                        <p id="titan-eta-before" class="text-[10px] text-zinc-500 mb-4 leading-relaxed">After payment, your Titan PDF may take up to 60 minutes to arrive by email.</p>
                        
                        <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-black py-4 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-2 transition-opacity disabled:opacity-60 disabled:cursor-wait" id="btn-titan">
                            Get Full Titan Report — $349
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

        <footer class="py-12 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-4xl mx-auto px-6">
                <p id="footer-text" class="text-[10px] text-emerald-600 uppercase tracking-[0.2em] mb-6">Consultant or Agency? Join our Forensic Audit network.</p>
                <p id="disclaimer-text" class="text-[9px] text-zinc-500 leading-relaxed mb-4 max-w-2xl mx-auto">
                    PredictaCore AI website audits. USD $349 charged today; USD $25/mo monitoring starts ~30 days later. Card statement shows PREDICTACORE. All sales final. Cancel at least 5 business days before renewal.
                </p>
                <p class="text-[9px] text-zinc-600 mb-6">
                    <a href="/terms" class="text-emerald-600 hover:underline">Terms</a> · <a href="/privacy" class="text-emerald-600 hover:underline">Privacy</a>
                </p>
                <div class="text-[9px] text-zinc-700 font-mono">
                    © 2026 PREDICTACORE // NODE_STATUS: OPERATIONAL
                </div>
            </div>
        </footer>

        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref') || '';

            let currentLang = 'en';
            
            const dictionary = {
                en: {
                    navAccess: "Node Access",
                    heroTitle: "TRAFFIC DOES NOT GUARANTEE <br><span class='text-emerald-500'>PROFITABILITY.</span>",
                    heroDescLeft: "Your public page is where strangers decide yes or no. We don't need your analytics — we forensic-scan what every customer sees and show you exactly what's making them leave.",
                    heroDescRight: "Built for the average entrepreneur, not enterprise. One URL. One PDF. Why you're losing customers on your site or social profile — and 15 copy-paste fixes. More rigor than chat AI. More deliverables than most agencies charge $3k+ to review the same page.",
                    heroTagline: "We don't value your internal data. We value what your page is doing to your next customer.",
                    whyTitle: "Why PredictaCore",
                    whySub: "The spearhead audit for entrepreneurs who can't afford to guess.",
                    why1T: "Our only focus", why1D: "Your live website or social profile — what a real visitor sees before they buy, book, or bounce. We find friction, invisible errors, and missed trust signals. Goal: stop losing customers you never knew you had.",
                    why2T: "Beat agencies on the same page", why2D: "Any consultant reviewing only your public URL gets one opinion deck. You get measured SEO + AI scores, buyer profiles by industry, verified competitors when found, 15 leaks, 15 copy-paste actions, captures, and a 21-day roadmap — for $349.",
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
                    titanBoxTitle: "Titan — USD $349",
                    titanBoxList: "<li>· Full 11-section forensic PDF</li><li>· 15 leaks + 15 copy-paste actions</li><li>· SEO forensics + AI (GEO) + benchmark</li><li>· Monthly monitoring report ($25/mo from day 30)</li>",
                    socialBanner: "<span class=\"text-emerald-500 font-bold\">Web + Social:</span> paste your domain or a public Instagram, Facebook, or TikTok profile URL — same forensic engine.",
                    li1: "1. Drop-off Point X-Ray<br><span class='text-[10px] text-zinc-500'>(Where exactly do they leave?)</span>", 
                    li2: "2. Direct Action Plan<br><span class='text-[10px] text-zinc-500'>(What to change today)</span>", 
                    li3: "3. Hidden Competition Analysis<br><span class='text-[10px] text-zinc-500'>(Why do they buy elsewhere?)</span>",
                    methodTitle: "Our Technology",
                    m1: "Profiles by Industry", m1Desc: "We detect your business type and simulate skeptical, rushed, mobile, and comparison shoppers — looking for trust gaps, weak CTAs, and checkout friction on your public URL.",
                    m2: "Forensic Pillars", m2Desc: "Full PDF: scorecard, SEO, AI visibility, verified benchmark when found, 15 leaks, 15 actions, roadmap. Lite free scan: 3 critical leaks + SEO/AI snapshot.",
                    m3: "Only URL Required", m3Desc: "No analytics login, no plugins. Measured data from your live page or social profile + AI-assisted narrative grounded in that evidence.",
                    pillarsTitle: "The 11 Pillars of our Forensic Audit",
                    p1: "Asset X-Ray", p2: "Psychological Profiles", p3: "Health Scorecard", p4: "Visibility & SEO", p5: "Competitive Benchmark", p6: "SWOT Matrix", p7: "Wishlist", p8: "15 Drop-off Points", p9: "15 Tactical Actions", p10: "Scaling Tools", p11: "21-Day Roadmap",
                    termTitle: "Start Forensic Diagnostic", btnStart: "Execute Free Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "X-Ray Sealed", upSt: "Successfully sent to",
                    boxText: "Initial scan shows critical bottlenecks. You are losing sales today due to purchasing obstacles. The Titan Report dissects your website and delivers the exact instructions to fix these leaks.",
                    subPrice: "Charged today: USD $349 (Titan Report)",
                    subPrice2: "Monitoring subscription ($25/mo) activates now; first monthly charge in ~30 days. Cancel at least 5 business days before renewal. All sales final — no refunds.",
                    btnTitan: "Get Full Titan Report — $349",
                    titanPriceNote: "USD · one-time",
                    urlHint: "Instagram, Facebook, TikTok, or any public website — no login required.",
                    cancelBadge: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>',
                    footerText: "Consultant or Agency? Join our Forensic Audit network.",
                    disclaimerText: "PredictaCore AI website audits. USD $349 charged today; USD $25/mo monitoring starts ~30 days later. Card statement shows PREDICTACORE. All sales final. Cancel at least 5 business days before renewal.",
                    checkoutLoading: "Opening secure checkout…",
                    checkoutOverlayTitle: "Secure checkout",
                    checkoutOverlaySub: "Redirecting to Stripe. Do not close this window.",
                    checkoutError: "Could not start checkout. Try again or contact support.",
                    checkoutNetwork: "Network error. Check your connection and try again.",
                    alertError: "Required data missing.",
                    liteEtaBefore: "Report delivery can take up to 60 minutes while our engine processes your site.",
                    liteQueued: "Your Lite report is being generated and will arrive by email.",
                    liteEtaAfter: "Delivery may take up to 60 minutes due to forensic processing volume. Check spam.",
                    titanEtaBefore: "After payment, your Titan PDF may take up to 60 minutes to arrive by email.",
                    successPayment: "Payment confirmed! Your Titan report is being processed by the AI and will arrive in your email shortly.",
                    phUrl: "Website or social profile URL (yourbusiness.com · instagram.com/brand)", phEmail: "Your Email"
                },
                es: {
                    navAccess: "Acceso Nodo",
                    heroTitle: "TENER TRÁFICO NO GARANTIZA <br><span class='text-emerald-500'>RENTABILIDAD.</span>",
                    heroDescLeft: "Tu página pública es donde un desconocido dice sí o no. No necesitamos tu analytics — escaneamos lo que ve cada cliente y te mostramos qué lo hace irse.",
                    heroDescRight: "Hecho para el emprendedor promedio, no para corporativos. Una URL. Un PDF. Por qué pierdes clientes en tu web o red social — y 15 correcciones copy-paste. Más rigor que la IA en chat. Más entregables que muchas agencias que cobran $3k+ por revisar la misma página.",
                    heroTagline: "No valoramos tus datos internos. Valoramos lo que tu página le hace a tu próximo cliente.",
                    whyTitle: "Por qué PredictaCore",
                    whySub: "La auditoría punta de lanza para emprendedores que no pueden permitirse adivinar.",
                    why1T: "Nuestro único foco", why1D: "Tu web o perfil social en vivo — lo que ve un visitante real antes de comprar, reservar o irse. Detectamos fricción, errores invisibles y señales de confianza faltantes. Objetivo: dejar de perder clientes que ni sabías que tenías.",
                    why2T: "Mejor que agencias sobre la misma página", why2D: "Un consultor que solo ve tu URL entrega un deck de opinión. Tú recibes scores SEO + IA medidos, perfiles de comprador por giro, competencia verificada cuando existe, 15 fugas, 15 acciones copy-paste, capturas y roadmap 21 días — por $349.",
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
                    titanBoxTitle: "Titán — USD $349",
                    titanBoxList: "<li>· PDF forense completo (11 secciones)</li><li>· 15 fugas + 15 acciones copy-paste</li><li>· SEO forense + IA (GEO) + benchmark</li><li>· Reporte mensual de seguimiento ($25/mes desde día 30)</li>",
                    socialBanner: "<span class=\"text-emerald-500 font-bold\">Web + Social:</span> pega tu dominio o URL pública de Instagram, Facebook o TikTok — mismo motor forense.",
                    li1: "1. Radiografía de Abandono<br><span class='text-[10px] text-zinc-500'>(¿Dónde exactamente se van?)</span>", 
                    li2: "2. Plan de Acción Directo<br><span class='text-[10px] text-zinc-500'>(¿Qué cambiar hoy mismo?)</span>", 
                    li3: "3. Análisis de Competencia<br><span class='text-[10px] text-zinc-500'>(¿Por qué compran en otro lado?)</span>",
                    methodTitle: "Nuestra Tecnología",
                    m1: "Perfiles por Giro", m1Desc: "Detectamos tu tipo de negocio y simulamos comprador escéptico, apurado, móvil y comparador — buscando brechas de confianza, CTAs débiles y fricción en tu URL pública.",
                    m2: "Pilares Forenses", m2Desc: "PDF completo: scorecard, SEO, visibilidad IA, benchmark verificado si existe, 15 fugas, 15 acciones, roadmap. Lite gratis: 3 fugas críticas + snapshot SEO/IA.",
                    m3: "Solo URL", m3Desc: "Sin analytics ni plugins. Datos medidos de tu página o perfil social + narrativa IA anclada a esa evidencia.",
                    pillarsTitle: "Los 11 Pilares de nuestra Auditoría Forense",
                    p1: "Radiografía del Activo", p2: "Perfiles Psicológicos", p3: "Scorecard de Salud", p4: "Visibilidad y SEO", p5: "Benchmark Competitivo", p6: "Matriz Estratégica", p7: "Lista de Deseos", p8: "15 Puntos de Fuga", p9: "15 Acciones Tácticas", p10: "Herramientas de Escala", p11: "Hoja de Ruta a 21 Días",
                    termTitle: "Iniciar Diagnóstico Forense", btnStart: "Ejecutar Escaneo Gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upT: "Radiografía Sellada", upSt: "Enviado con éxito a",
                    boxText: "El escaneo inicial muestra cuellos de botella críticos. Estás perdiendo ventas hoy por obstáculos de compra. El Reporte Titán disecta tu sitio y entrega las instrucciones exactas para arreglar estas fugas.",
                    subPrice: "Cobro hoy: USD $349 (Reporte Titán)",
                    subPrice2: "La suscripción de monitoreo ($25/mes) se activa ahora; el primer cobro mensual será en ~30 días. Cancela al menos 5 días hábiles antes de la renovación. Ventas finales — sin reembolsos.",
                    btnTitan: "Obtener Reporte Titán completo — $349",
                    titanPriceNote: "USD · pago único",
                    urlHint: "Instagram, Facebook, TikTok o cualquier web pública — sin login.",
                    cancelBadge: 'By paying you agree to our <a href="/terms" class="text-emerald-600 underline">Terms</a> and <a href="/privacy" class="text-emerald-600 underline">Privacy Policy</a>',
                    footerText: "¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.",
                    disclaimerText: "PredictaCore AI website audits. USD $349 charged today; USD $25/mo monitoring starts ~30 days later. Card statement shows PREDICTACORE. All sales final. Cancel at least 5 business days before renewal.",
                    checkoutLoading: "Abriendo pago seguro…",
                    checkoutOverlayTitle: "Pago seguro",
                    checkoutOverlaySub: "Redirigiendo a Stripe. No cierres esta ventana.",
                    checkoutError: "No se pudo iniciar el pago. Reintenta o contacta soporte.",
                    checkoutNetwork: "Error de red. Revisa tu conexión e intenta de nuevo.",
                    alertError: "Faltan datos requeridos.",
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
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                const d = dictionary[lang];
                
                document.getElementById('nav-access').innerText = d.navAccess;
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
                if (d.socialBanner) document.getElementById('social-banner').innerHTML = d.socialBanner;
                if (d.urlHint) document.getElementById('url-hint').innerText = d.urlHint;
                if (d.titanPriceNote) document.getElementById('titan-price-note').innerText = d.titanPriceNote;
                document.getElementById('li-1').innerHTML = d.li1;
                document.getElementById('li-2').innerHTML = d.li2;
                document.getElementById('li-3').innerHTML = d.li3;

                document.getElementById('method-title').innerText = d.methodTitle;
                document.getElementById('m1').innerText = d.m1; document.getElementById('m1-desc').innerText = d.m1Desc;
                document.getElementById('m2').innerText = d.m2; document.getElementById('m2-desc').innerText = d.m2Desc;
                document.getElementById('m3').innerText = d.m3; document.getElementById('m3-desc').innerText = d.m3Desc;
                
                document.getElementById('pillars-title').innerText = d.pillarsTitle;
                for(let i=1; i<=11; i++) {
                    let text = d['p'+i];
                    let num = i < 10 ? '0'+i : i;
                    document.getElementById('p-'+i).innerHTML = '<span class="text-emerald-600 mr-2">' + num + '</span> ' + text;
                }
                
                document.getElementById('term-title').innerText = d.termTitle;
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

            async function iniciarEscaneo() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                if (!url || !email) {
                    setSetupError(dictionary[currentLang].alertError);
                    return;
                }
                setSetupError('');
                
                document.getElementById('setup-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');
                document.getElementById('sent-email').innerText = email;
                
                const terminal = document.getElementById('terminal-output');
                const logs = currentLang === 'es' ? 
                    [">> Conectando nodos...", ">> Inyectando Gemelos Sintéticos...", ">> Analizando Perfiles y Fricción...", ">> Sellando Teaser...", ">> Enviando..."] :
                    [">> Connecting nodes...", ">> Injecting Synthetic Twins...", ">> Analyzing Profiles & Friction...", ">> Sealing Teaser...", ">> Sending..."];
                
                fetch('/start-lite', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ dna: url, email: email }) });
                
                let i = 0;
                const interval = setInterval(() => {
                    const p = document.createElement('p'); p.innerText = logs[i]; terminal.appendChild(p); i++;
                    if(i >= logs.length) { 
                        clearInterval(interval); 
                        setTimeout(() => { document.getElementById('scanner-stage').classList.add('hidden-flow'); document.getElementById('upsell-stage').classList.remove('hidden-flow'); }, 2000); 
                    }
                }, 1000);
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
                if (urlParams.get('lang') === 'es') setLanguage('es');
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
