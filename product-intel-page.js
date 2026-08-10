/**
 * Product Intel page — free standalone store URL analysis (Pam & Ander framework).
 * Optional candidate product URL + image. No billing / no Titan.
 */

const { getFaviconHeadTags } = require('./brand');

function getProductIntelHTML() {
    return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PredictaCore | Product Intel — oportunidades de producto</title>
    <meta name="description" content="Pega la URL de tu tienda. Analizamos demanda vs oferta, utilidad y productos adyacentes fáciles de fabricar. Opcional: evalúa un producto candidato con URL o imagen.">
    <meta name="robots" content="noindex, nofollow">
    ${getFaviconHeadTags()}
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap');
        :root { --pc-violet: #8b5cf6; --pc-dark: #050505; }
        body { background: var(--pc-dark); color: #d1d5db; font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; font-size: 16px; line-height: 1.6; }
        .mesh { position: fixed; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% -10%, #4c1d9533 0%, transparent 55%); z-index: -1; pointer-events: none; }
        .pc-input {
            width: 100%; box-sizing: border-box; border-radius: 0.5rem; border: 1px solid #3f3f46;
            background: #0a0a0a; color: #fafafa; padding: 0.875rem 1rem; font-size: 1rem;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
        .pc-input:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139,92,246,0.2); }
        textarea.pc-input { font-family: Inter, ui-sans-serif, system-ui, sans-serif; min-height: 4.5rem; resize: vertical; }
        .pc-btn {
            display: inline-flex; align-items: center; justify-content: center; width: 100%;
            border-radius: 0.5rem; background: #8b5cf6; color: #04110c; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.06em; padding: 1rem 1.5rem; border: none;
            cursor: pointer; font-size: 0.875rem; box-shadow: 0 0 24px rgba(139,92,246,0.25);
        }
        .pc-btn:hover { background: #a78bfa; }
        .pc-btn:disabled { opacity: 0.55; cursor: wait; }
        .pc-card { border-radius: 0.75rem; border: 1px solid #27272a; background: rgba(0,0,0,0.45); padding: 1.25rem; }
        .pc-badge { display: inline-flex; border-radius: 9999px; border: 1px solid rgba(139,92,246,0.35); background: rgba(6,78,59,0.25); padding: 0.25rem 0.75rem; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #6ee7b7; }
        .score { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #a78bfa; }
        .opp-row { border-bottom: 1px solid #27272a; padding: 1rem 0; }
        .opp-row:last-child { border-bottom: none; }
        .tab { cursor: pointer; padding: 0.625rem 1rem; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #71717a; border: 1px solid transparent; }
        .tab.active { color: #6ee7b7; border-color: rgba(139,92,246,0.35); background: rgba(139,92,246,0.08); }
        .panel { display: none; }
        .panel.active { display: block; }
        .muted { color: #71717a; }
        .hidden-flow { display: none !important; }
        table.pi { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        table.pi th, table.pi td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #27272a; text-align: left; vertical-align: top; }
        table.pi th { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #71717a; }
        .spin { display: inline-block; width: 1rem; height: 1rem; border: 2px solid #27272a; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .drop {
            border: 1px dashed #3f3f46; border-radius: 0.5rem; padding: 1rem; text-align: center;
            color: #71717a; font-size: 0.875rem; cursor: pointer; background: #0a0a0a;
        }
        .drop:hover, .drop.drag { border-color: #8b5cf6; color: #a1a1aa; }
        .drop img { max-height: 120px; margin: 0.5rem auto 0; border-radius: 0.375rem; display: block; }
        .go-go { color: #a78bfa; } .go-pilot { color: #fbbf24; } .go-nogo { color: #f87171; }
        .need-box { border-left: 3px solid #8b5cf6; padding-left: 1rem; }
    </style>
</head>
<body class="min-h-screen antialiased">
    <div class="mesh" aria-hidden></div>

    <header class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <a href="/" class="text-lg font-black text-white tracking-tighter uppercase">PREDICTA<span class="text-violet-300">CORE</span></a>
            <div class="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <span class="text-violet-400/80 hidden sm:inline" id="free-label">Gratis · Beta</span>
                <button type="button" id="lang-en" class="text-zinc-500 hover:text-white">EN</button>
                <span class="text-zinc-700">|</span>
                <button type="button" id="lang-es" class="text-violet-300">ES</button>
            </div>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <p class="pc-badge mb-4" id="badge">Product Intel · Gratis</p>
        <h1 id="headline" class="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            Mejora ventas con productos que sí tienen hueco
        </h1>
        <p id="subhead" class="text-zinc-400 mb-6 max-w-2xl">
            Mismo marco que Pam &amp; Ander: demanda razonable, utilidad decente, poca oferta relativa, y fit con lo que ya fabricas. Sin cobro. No es auditoría Titan.
        </p>

        <div class="pc-card mb-6">
            <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3" id="how-title">Qué hace este análisis</p>
            <ul id="how-list" class="text-sm text-zinc-400 space-y-2 list-disc pl-5">
                <li>Lee el catálogo de la URL (Shopify preferido).</li>
                <li>Propone productos relacionados con mejor ratio demanda/oferta y utilidad real.</li>
                <li>Estima precios, costos y posicionamiento vs competencia.</li>
                <li>Sugiere líneas fáciles de fabricar con el mismo método (tela, print, confección, etc.).</li>
                <li>Opcional: evalúa un producto candidato (URL o imagen) con probabilidad de éxito.</li>
            </ul>
        </div>

        <div class="pc-card mb-8 space-y-5">
            <div>
                <label id="lbl-url" class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">URL de la tienda (obligatorio)</label>
                <input id="store-url" class="pc-input" type="url" placeholder="https://tudominio.com" autocomplete="url" />
            </div>

            <div class="border-t border-zinc-800 pt-5">
                <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3" id="cand-title">Producto candidato (opcional)</p>
                <p id="cand-hint" class="text-sm text-zinc-500 mb-3">Para medir probabilidad de éxito de una idea concreta, además del análisis de la tienda.</p>
                <label id="lbl-cand-url" class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">URL del producto / referencia</label>
                <input id="cand-url" class="pc-input mb-4" type="url" placeholder="https://… (Amazon, Etsy, Pinterest, listing…)" autocomplete="url" />
                <label id="lbl-notes" class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Notas sobre el producto</label>
                <textarea id="cand-notes" class="pc-input mb-4" placeholder="Ej: sleep sack bordado 0.5 TOG, misma tela que nuestras mantas…"></textarea>
                <label id="lbl-img" class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Imagen del producto</label>
                <div class="drop" id="drop" tabindex="0" role="button">
                    <span id="drop-text">Arrastra una imagen o haz clic para subir (JPG/PNG/WebP)</span>
                    <img id="preview" class="hidden-flow" alt="" />
                </div>
                <input id="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden-flow" />
                <button type="button" id="clear-img" class="hidden-flow mt-2 text-xs text-zinc-500 hover:text-zinc-300 underline">Quitar imagen</button>
            </div>

            <button type="button" id="run-btn" class="pc-btn">Analizar</button>
            <p id="hint" class="text-sm text-zinc-500">Gratis · sin registro · sin cobro. Mejor con Shopify (products.json). Ej: pamandander.com</p>
        </div>

        <div id="status" class="hidden-flow pc-card mb-8 flex items-center gap-3 text-sm text-zinc-300">
            <span class="spin" aria-hidden></span>
            <span id="status-text">Leyendo catálogo…</span>
        </div>

        <div id="error" class="hidden-flow pc-card mb-8 border-red-900/50 text-red-300 text-sm"></div>

        <div id="results" class="hidden-flow">
            <div class="pc-card mb-6">
                <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1" id="lbl-niche">Nicho detectado</p>
                <p id="niche" class="text-xl font-bold text-white"></p>
                <p id="catalog-meta" class="text-sm text-zinc-500 mt-2"></p>
                <p id="capabilities" class="text-sm text-violet-300/90 mt-2"></p>
                <p id="mfg" class="text-sm text-zinc-400 mt-1"></p>
                <div class="need-box mt-4">
                    <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1" id="lbl-need">Qué necesita esta tienda</p>
                    <p id="need-summary" class="text-sm text-zinc-300"></p>
                </div>
            </div>

            <div id="cand-result" class="hidden-flow pc-card mb-6 border-violet-900/40">
                <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1" id="lbl-cand-res">Producto candidato · probabilidad de éxito</p>
                <div class="flex flex-wrap items-baseline justify-between gap-2 mt-1">
                    <p id="cand-name" class="text-lg font-bold text-white"></p>
                    <p id="cand-score" class="score text-xl"></p>
                </div>
                <p id="cand-gono" class="text-sm font-bold mt-1"></p>
                <p id="cand-verdict" class="text-sm text-zinc-400 mt-2"></p>
                <p id="cand-signals" class="text-xs text-zinc-500 mt-3"></p>
                <p id="cand-fit" class="text-sm text-violet-300/90 mt-2"></p>
                <p id="cand-price" class="text-sm text-zinc-300 mt-2"></p>
                <ul id="cand-risks" class="text-sm text-zinc-500 list-disc pl-5 mt-3 space-y-1"></ul>
                <ul id="cand-next" class="text-sm text-zinc-400 list-disc pl-5 mt-2 space-y-1"></ul>
            </div>

            <div class="flex flex-wrap gap-2 mb-4" role="tablist">
                <button type="button" class="tab active" data-tab="r1" id="tab-r1">1 · Oportunidades</button>
                <button type="button" class="tab" data-tab="r2" id="tab-r2">2 · Precios & costos</button>
                <button type="button" class="tab" data-tab="r3" id="tab-r3">3 · Fabricación / expansión</button>
            </div>

            <section id="panel-r1" class="panel active pc-card mb-6">
                <h2 id="r1-title" class="text-lg font-bold text-white mb-2"></h2>
                <p id="r1-verdict" class="text-sm text-zinc-400 mb-2"></p>
                <p id="r1-ads" class="text-sm text-amber-200/80 mb-4"></p>
                <div id="r1-list"></div>
                <p id="r1-note" class="text-xs muted mt-4"></p>
            </section>

            <section id="panel-r2" class="panel pc-card mb-6">
                <h2 id="r2-title" class="text-lg font-bold text-white mb-2"></h2>
                <p id="r2-verdict" class="text-sm text-zinc-400 mb-4"></p>
                <div class="overflow-x-auto">
                    <table class="pi" id="r2-table">
                        <thead>
                            <tr>
                                <th id="th-prod">Producto</th>
                                <th id="th-price">Precio</th>
                                <th id="th-comp">Competencia</th>
                                <th id="th-cogs">COGS</th>
                                <th id="th-pos">Posición</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <p id="r2-prod" class="text-sm text-zinc-400 mt-4"></p>
                <p id="r2-invest" class="text-sm text-violet-300/90 mt-2"></p>
            </section>

            <section id="panel-r3" class="panel pc-card mb-6">
                <h2 id="r3-title" class="text-lg font-bold text-white mb-2"></h2>
                <p id="r3-verdict" class="text-sm text-zinc-400 mb-4"></p>
                <div id="r3-list"></div>
                <p id="r3-avoid-label" class="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-6 mb-2">Evitar</p>
                <ul id="r3-avoid" class="text-sm text-zinc-400 list-disc pl-5 space-y-1"></ul>
            </section>

            <p id="footer-note" class="text-xs text-zinc-600 text-center mt-8">
                Módulo gratuito de inteligencia de producto. Estimados de mercado — no son proyecciones garantizadas.
            </p>
        </div>
    </main>

    <script>
    (function () {
        const I18N = {
            es: {
                freeLabel: 'Gratis · Beta',
                badge: 'Product Intel · Gratis',
                headline: 'Mejora ventas con productos que sí tienen hueco',
                subhead: 'Mismo marco que Pam & Ander: demanda razonable, utilidad decente, poca oferta relativa, y fit con lo que ya fabricas. Sin cobro. No es auditoría Titan.',
                howTitle: 'Qué hace este análisis',
                howItems: [
                    'Lee el catálogo de la URL (Shopify preferido).',
                    'Propone productos relacionados con mejor ratio demanda/oferta y utilidad real.',
                    'Estima precios, costos y posicionamiento vs competencia.',
                    'Sugiere líneas fáciles de fabricar con el mismo método (tela, print, confección, etc.).',
                    'Opcional: evalúa un producto candidato (URL o imagen) con probabilidad de éxito.',
                ],
                lblUrl: 'URL de la tienda (obligatorio)',
                candTitle: 'Producto candidato (opcional)',
                candHint: 'Para medir probabilidad de éxito de una idea concreta, además del análisis de la tienda.',
                lblCandUrl: 'URL del producto / referencia',
                lblNotes: 'Notas sobre el producto',
                lblImg: 'Imagen del producto',
                dropText: 'Arrastra una imagen o haz clic para subir (JPG/PNG/WebP)',
                clearImg: 'Quitar imagen',
                run: 'Analizar',
                hint: 'Gratis · sin registro · sin cobro. Mejor con Shopify (products.json). Ej: pamandander.com',
                tab1: '1 · Oportunidades',
                tab2: '2 · Precios & costos',
                tab3: '3 · Fabricación / expansión',
                lblNiche: 'Nicho detectado',
                lblNeed: 'Qué necesita esta tienda',
                lblCandRes: 'Producto candidato · probabilidad de éxito',
                thProd: 'Producto',
                thPrice: 'Precio',
                thComp: 'Competencia',
                thCogs: 'COGS',
                thPos: 'Posición',
                avoid: 'Evitar',
                footer: 'Módulo gratuito de inteligencia de producto. Estimados de mercado — no son proyecciones garantizadas.',
                statusFetch: 'Leyendo catálogo…',
                statusAnalyze: 'Generando reportes con IA…',
                needUrl: 'Ingresa la URL de la tienda.',
                failed: 'No se pudo completar el análisis.',
                caps: 'Capacidades',
                mfg: 'Métodos de fabricación',
                units: 'uds/mes Base',
                rev: 'rev. Base',
                difficulty: 'Dificultad',
                mfgLink: 'Fabricación',
                risks: 'Riesgos',
                next: 'Siguientes pasos',
                priceRec: 'Precio recomendado',
            },
            en: {
                freeLabel: 'Free · Beta',
                badge: 'Product Intel · Free',
                headline: 'Grow sales with products that actually have room',
                subhead: 'Same Pam & Ander framework: reasonable demand, real utility, thin relative supply, and fit with what you already make. No charge. Not a Titan audit.',
                howTitle: 'What this analysis does',
                howItems: [
                    'Reads the catalog from the URL (Shopify preferred).',
                    'Proposes related products with better demand/supply ratio and real utility.',
                    'Estimates pricing, costs, and competitive positioning.',
                    'Suggests lines easy to make with the same method (fabric, print, sewing, etc.).',
                    'Optional: scores a candidate product (URL or image) for success probability.',
                ],
                lblUrl: 'Store URL (required)',
                candTitle: 'Candidate product (optional)',
                candHint: 'Score success probability for a concrete idea, on top of the store analysis.',
                lblCandUrl: 'Product / reference URL',
                lblNotes: 'Notes about the product',
                lblImg: 'Product image',
                dropText: 'Drop an image or click to upload (JPG/PNG/WebP)',
                clearImg: 'Remove image',
                run: 'Analyze',
                hint: 'Free · no signup · no charge. Best with Shopify (products.json). Ex: pamandander.com',
                tab1: '1 · Opportunities',
                tab2: '2 · Pricing & costs',
                tab3: '3 · Make / expand',
                lblNiche: 'Detected niche',
                lblNeed: 'What this store needs',
                lblCandRes: 'Candidate product · success probability',
                thProd: 'Product',
                thPrice: 'Price',
                thComp: 'Competition',
                thCogs: 'COGS',
                thPos: 'Position',
                avoid: 'Avoid',
                footer: 'Free product-intelligence module. Market estimates — not guaranteed forecasts.',
                statusFetch: 'Reading catalog…',
                statusAnalyze: 'Building AI reports…',
                needUrl: 'Enter the store URL.',
                failed: 'Could not complete the analysis.',
                caps: 'Capabilities',
                mfg: 'Manufacturing methods',
                units: 'Base units/mo',
                rev: 'Base rev.',
                difficulty: 'Difficulty',
                mfgLink: 'Manufacturing',
                risks: 'Risks',
                next: 'Next steps',
                priceRec: 'Recommended price',
            },
        };

        let lang = 'es';
        let imagePayload = null;
        const $ = (id) => document.getElementById(id);

        function applyLang() {
            const t = I18N[lang];
            $('free-label').textContent = t.freeLabel;
            $('badge').textContent = t.badge;
            $('headline').textContent = t.headline;
            $('subhead').textContent = t.subhead;
            $('how-title').textContent = t.howTitle;
            $('how-list').innerHTML = t.howItems.map((x) => '<li>' + x + '</li>').join('');
            $('lbl-url').textContent = t.lblUrl;
            $('cand-title').textContent = t.candTitle;
            $('cand-hint').textContent = t.candHint;
            $('lbl-cand-url').textContent = t.lblCandUrl;
            $('lbl-notes').textContent = t.lblNotes;
            $('lbl-img').textContent = t.lblImg;
            if (!imagePayload) $('drop-text').textContent = t.dropText;
            $('clear-img').textContent = t.clearImg;
            $('run-btn').textContent = t.run;
            $('hint').textContent = t.hint;
            $('tab-r1').textContent = t.tab1;
            $('tab-r2').textContent = t.tab2;
            $('tab-r3').textContent = t.tab3;
            $('lbl-niche').textContent = t.lblNiche;
            $('lbl-need').textContent = t.lblNeed;
            $('lbl-cand-res').textContent = t.lblCandRes;
            $('th-prod').textContent = t.thProd;
            $('th-price').textContent = t.thPrice;
            $('th-comp').textContent = t.thComp;
            $('th-cogs').textContent = t.thCogs;
            $('th-pos').textContent = t.thPos;
            $('r3-avoid-label').textContent = t.avoid;
            $('footer-note').textContent = t.footer;
            $('lang-es').classList.toggle('text-violet-300', lang === 'es');
            $('lang-en').classList.toggle('text-violet-300', lang === 'en');
            $('lang-es').classList.toggle('text-zinc-500', lang !== 'es');
            $('lang-en').classList.toggle('text-zinc-500', lang !== 'en');
        }

        $('lang-es').addEventListener('click', () => { lang = 'es'; applyLang(); });
        $('lang-en').addEventListener('click', () => { lang = 'en'; applyLang(); });

        document.querySelectorAll('.tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
                document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
                btn.classList.add('active');
                $('panel-' + btn.dataset.tab).classList.add('active');
            });
        });

        function show(el, on) {
            el.classList.toggle('hidden-flow', !on);
        }

        function esc(s) {
            return String(s == null ? '' : s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function clearImage() {
            imagePayload = null;
            $('file').value = '';
            show($('preview'), false);
            show($('clear-img'), false);
            $('drop-text').textContent = I18N[lang].dropText;
            show($('drop-text'), true);
        }

        function setPreview(dataUrl) {
            const img = $('preview');
            img.src = dataUrl;
            show(img, true);
            show($('drop-text'), false);
            show($('clear-img'), true);
        }

        function resizeImageFile(file) {
            return new Promise((resolve, reject) => {
                if (!file || !/^image\\//.test(file.type)) {
                    reject(new Error('Invalid image'));
                    return;
                }
                const reader = new FileReader();
                reader.onerror = () => reject(new Error('Could not read image'));
                reader.onload = () => {
                    const img = new Image();
                    img.onerror = () => reject(new Error('Invalid image data'));
                    img.onload = () => {
                        const max = 1280;
                        let w = img.width;
                        let h = img.height;
                        if (w > max || h > max) {
                            const r = Math.min(max / w, max / h);
                            w = Math.round(w * r);
                            h = Math.round(h * r);
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, w, h);
                        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                        const dataUrl = canvas.toDataURL(mime, 0.82);
                        const base64 = dataUrl.split(',')[1] || '';
                        if (base64.length > 2_500_000) {
                            reject(new Error(lang === 'es' ? 'Imagen demasiado grande' : 'Image too large'));
                            return;
                        }
                        resolve({ mimeType: mime, data: base64, preview: dataUrl });
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        }

        async function handleFile(file) {
            try {
                const payload = await resizeImageFile(file);
                imagePayload = { mimeType: payload.mimeType, data: payload.data };
                setPreview(payload.preview);
            } catch (err) {
                show($('error'), true);
                $('error').textContent = err.message || I18N[lang].failed;
            }
        }

        const drop = $('drop');
        drop.addEventListener('click', () => $('file').click());
        drop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); }
        });
        $('file').addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) handleFile(f);
        });
        drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('drag'); });
        drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
        drop.addEventListener('drop', (e) => {
            e.preventDefault();
            drop.classList.remove('drag');
            const f = e.dataTransfer.files && e.dataTransfer.files[0];
            if (f) handleFile(f);
        });
        $('clear-img').addEventListener('click', (e) => { e.preventDefault(); clearImage(); });

        function render(data) {
            const t = I18N[lang];
            const a = data.analysis || {};
            const meta = a.meta || {};
            const r1 = a.report1_nicheOpportunities || {};
            const r2 = a.report2_pricingCompetitionCosts || {};
            const r3 = a.report3_adjacentExpansion || {};
            const summary = (data.catalog && data.catalog.summary) || {};
            const cand = a.candidateAnalysis;

            $('niche').textContent = meta.detectedNiche || '—';
            $('catalog-meta').textContent =
                (meta.catalogCount || summary.count || '—') +
                ' SKUs · avg $' +
                (meta.avgPrice != null ? meta.avgPrice : summary.avgPrice != null ? summary.avgPrice : '—') +
                ' · source: ' +
                (meta.catalogSource || '—');
            $('capabilities').textContent =
                (meta.capabilities && meta.capabilities.length)
                    ? t.caps + ': ' + meta.capabilities.join(' · ')
                    : '';
            $('mfg').textContent =
                (meta.manufacturingMethods && meta.manufacturingMethods.length)
                    ? t.mfg + ': ' + meta.manufacturingMethods.join(' · ')
                    : '';
            $('need-summary').textContent =
                meta.whatWeNeedSummary || meta.currentCatalogSummary || '';

            if (cand && (cand.productName || cand.verdict || cand.successProbabilityPct != null)) {
                show($('cand-result'), true);
                $('cand-name').textContent = cand.productName || '—';
                const pct = cand.successProbabilityPct != null ? cand.successProbabilityPct : cand.score;
                $('cand-score').textContent = (pct != null ? pct + '%' : '—') + (cand.score != null ? ' · ' + cand.score + '/100' : '');
                const g = String(cand.goNoGo || '').toUpperCase();
                $('cand-gono').textContent = g || '';
                $('cand-gono').className = 'text-sm font-bold mt-1 ' + (g === 'GO' ? 'go-go' : g === 'NO-GO' ? 'go-nogo' : 'go-pilot');
                $('cand-verdict').textContent = cand.verdict || '';
                $('cand-signals').textContent = [cand.demandSignal, cand.supplySignal, cand.utility].filter(Boolean).join(' · ');
                $('cand-fit').textContent = [cand.fitWithStore, cand.manufacturingFit].filter(Boolean).join(' · ');
                $('cand-price').textContent = cand.recommendedPrice
                    ? t.priceRec + ': ' + cand.recommendedPrice
                    : '';
                $('cand-risks').innerHTML = (cand.risks || []).map((x) => '<li>' + esc(x) + '</li>').join('');
                $('cand-next').innerHTML = (cand.nextSteps || []).map((x) => '<li>' + esc(x) + '</li>').join('');
            } else {
                show($('cand-result'), false);
            }

            $('r1-title').textContent = r1.title || '';
            $('r1-verdict').textContent = r1.verdict || '';
            $('r1-ads').textContent = r1.whyCurrentAdsMayFail || '';
            $('r1-note').textContent = r1.baselineNote || '';
            $('r1-list').innerHTML = (r1.opportunities || [])
                .map((o) => {
                    return (
                        '<div class="opp-row">' +
                        '<div class="flex flex-wrap items-baseline justify-between gap-2">' +
                        '<p class="font-bold text-white">' +
                        esc(o.rank) + '. ' + esc(o.product) +
                        '</p>' +
                        '<span class="score">' + esc(o.score) + '/100 · ' + esc(o.action || '') + '</span></div>' +
                        '<p class="text-sm text-violet-300/90 mt-1">' +
                        esc(o.priceSweetSpot || '') +
                        (o.priceRange ? ' <span class="text-zinc-500">(' + esc(o.priceRange) + ')</span>' : '') +
                        '</p>' +
                        '<p class="text-sm text-zinc-400 mt-2">' + esc(o.why || '') + '</p>' +
                        '<p class="text-xs text-zinc-500 mt-2">' +
                        esc(o.demandSignal || '') + ' · ' + esc(o.supplySignal || '') +
                        (o.utility ? ' · ' + esc(o.utility) : '') +
                        '</p>' +
                        '<p class="text-xs text-zinc-500 mt-1">' +
                        t.units + ': ' + esc(o.estMonthlyUnitsBase ?? '—') +
                        ' · ' + t.rev + ': $' + esc(o.estMonthlyRevenueBaseUsd ?? '—') +
                        '</p></div>'
                    );
                })
                .join('');

            $('r2-title').textContent = r2.title || '';
            $('r2-verdict').textContent = r2.verdict || '';
            $('r2-prod').textContent = r2.productionNote || '';
            $('r2-invest').textContent = r2.launchInvestmentUsd
                ? (lang === 'es' ? 'Inversión lanzamiento: ' : 'Launch investment: ') + r2.launchInvestmentUsd
                : '';
            const tb = $('r2-table').querySelector('tbody');
            tb.innerHTML = (r2.rows || [])
                .map((row) => {
                    return (
                        '<tr><td><strong class="text-white">' + esc(row.product) +
                        '</strong><div class="text-xs text-zinc-500 mt-1">' + esc(row.qualityBar || '') +
                        '</div></td><td>' + esc(row.pamPrice || '') +
                        '</td><td>' + esc(row.competitorBenchmarks || '') +
                        '</td><td>$' + esc(row.cogsUsd ?? '—') +
                        '<div class="text-xs text-zinc-500">' +
                        esc(row.contribMarginPct != null ? row.contribMarginPct + '% margin' : '') +
                        '</div></td><td>' + esc(row.positioning || '') + '</td></tr>'
                    );
                })
                .join('');

            $('r3-title').textContent = r3.title || '';
            $('r3-verdict').textContent = r3.verdict || '';
            $('r3-list').innerHTML = (r3.lines || [])
                .map((l) => {
                    return (
                        '<div class="opp-row">' +
                        '<div class="flex flex-wrap items-baseline justify-between gap-2">' +
                        '<p class="font-bold text-white">' + esc(l.rank) + '. ' + esc(l.line) + '</p>' +
                        '<span class="score">' + esc(l.score) + '/100</span></div>' +
                        '<p class="text-sm text-violet-300/90 mt-1">' +
                        esc(l.ticket || '') + ' · $' + esc(l.estMonthlyRevenueBaseUsd ?? '—') + '/mo Base' +
                        (l.difficulty ? ' · ' + t.difficulty + ': ' + esc(l.difficulty) : '') +
                        '</p>' +
                        '<p class="text-sm text-zinc-400 mt-2">' + esc(l.why || '') + '</p>' +
                        (l.manufacturingLink
                            ? '<p class="text-xs text-zinc-500 mt-1">' + t.mfgLink + ': ' + esc(l.manufacturingLink) + '</p>'
                            : '') +
                        '</div>'
                    );
                })
                .join('');
            $('r3-avoid').innerHTML = (r3.avoid || []).map((x) => '<li>' + esc(x) + '</li>').join('');

            show($('results'), true);
        }

        async function poll(jobId) {
            const t = I18N[lang];
            for (let i = 0; i < 90; i++) {
                await new Promise((r) => setTimeout(r, 2000));
                const res = await fetch('/api/product-intel/' + encodeURIComponent(jobId));
                const data = await res.json().catch(() => ({}));
                if (data.progress) $('status-text').textContent = data.progress;
                if (data.status === 'ready' && data.result) {
                    show($('status'), false);
                    render(data.result);
                    return;
                }
                if (data.status === 'failed') {
                    throw new Error(data.error || t.failed);
                }
            }
            throw new Error(t.failed);
        }

        $('run-btn').addEventListener('click', async () => {
            const t = I18N[lang];
            const url = ($('store-url').value || '').trim();
            if (!url) {
                show($('error'), true);
                $('error').textContent = t.needUrl;
                return;
            }
            show($('error'), false);
            show($('results'), false);
            show($('status'), true);
            $('status-text').textContent = t.statusFetch;
            $('run-btn').disabled = true;

            const body = {
                url,
                lang,
                candidateUrl: ($('cand-url').value || '').trim() || undefined,
                notes: ($('cand-notes').value || '').trim() || undefined,
                image: imagePayload || undefined,
            };

            try {
                const res = await fetch('/api/product-intel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || t.failed);
                $('status-text').textContent = t.statusAnalyze;
                await poll(data.jobId);
            } catch (err) {
                show($('status'), false);
                show($('error'), true);
                $('error').textContent = err.message || t.failed;
            } finally {
                $('run-btn').disabled = false;
            }
        });

        const params = new URLSearchParams(location.search);
        if (params.get('url')) $('store-url').value = params.get('url');
        if (params.get('candidate')) $('cand-url').value = params.get('candidate');
        if (params.get('lang') === 'en') lang = 'en';
        applyLang();
    })();
    </script>
</body>
</html>`;
}

module.exports = { getProductIntelHTML };
