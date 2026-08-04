/** Shared Titan upsell copy — aligned with /ads/lite (15 flaws + 15 fixes). */

const TITAN_FLAW_FIX_EXAMPLES = [
    { flaw: 'CTA below the fold on mobile', fix: 'Move primary button above fold; shorten hero to 2 lines' },
    { flaw: 'No social proof near the buy decision', fix: 'Add 3 review snippets or trust badges next to price' },
    { flaw: 'Headline promises speed, page feels slow', fix: 'Compress hero images; show load time vs competitor benchmark' },
];

const COMPARE_ROWS = [
    { feature: 'Main conversion flaws shown', lite: '3 only (teaser)', titan: 'All 15 — ranked by impact' },
    { feature: 'How to fix each flaw', lite: 'Not included', titan: '15 recommendations — 1 per flaw' },
    { feature: 'Google SEO scorecard', lite: 'Snapshot', titan: 'Full forensic breakdown' },
    { feature: 'AI visibility (ChatGPT, etc.)', lite: 'Score only', titan: 'Engine-by-engine verdict' },
    { feature: 'Competitor comparison', lite: '—', titan: 'Included' },
    { feature: 'Buyer psychology profiles', lite: 'Brief read', titan: '4 profiles by industry' },
    { feature: '21-day action plan', lite: '—', titan: 'Included' },
    {
        feature: 'Bonus: new product opportunities',
        lite: '—',
        titan: 'Included free — niche SKUs, pricing/costs, adjacent lines',
    },
    { feature: 'Report format', lite: 'Short email report', titan: 'PDF · 11 sections + Product Opportunities bonus' },
];

const TITAN_SECTIONS = [
    'Forensic executive summary & page verdict',
    'Desktop + mobile capture with measured load time',
    'SEO forensics: title, meta, schema, sitemap, robots',
    'AI discoverability scorecard (GEO) — engine by engine',
    '4 buyer psychology profiles for your industry',
    '15 ranked conversion leaks — full drop-off map',
    '15 copy-paste tactical fixes — step by step',
    'Competitive benchmark vs peers in your category',
    'Trust, credibility & CTA friction audit',
    'Desktop + mobile screenshots in the PDF',
    '21-day implementation roadmap',
    'BONUS · New product opportunities (niche SKUs, pricing/costs, adjacent lines)',
];

/** Free add-on announced with Titan — same Product Intel quality as /product-intel. */
const TITAN_BONUS = {
    badgeEs: 'Bonus gratis con Titán',
    badgeEn: 'Free bonus with Titan',
    titleEs: 'Oportunidades de nuevos productos',
    titleEn: 'New product opportunities',
    bodyEs:
        'Además de las 11 secciones forenses, el PDF incluye sin costo el análisis Product Intel: SKUs del nicho rankeados vs tu catálogo actual, precios/costos/márgenes, y líneas adyacentes por método de fabricación — la misma calidad que predictacore.ai/product-intel.',
    bodyEn:
        'On top of the 11 forensic sections, the PDF includes at no extra cost the Product Intel analysis: niche SKUs ranked against your current catalog, pricing/costs/margins, and adjacent lines by manufacturing method — the same quality as predictacore.ai/product-intel.',
    containsEs: [
        'A — Oportunidades en el nicho (5–8 productos con score y precio sweet spot)',
        'B — Precios vs competencia y costos estimados',
        'C — Expansión adyacente (qué fabricar después sin salir de tu método)',
    ],
    containsEn: [
        'A — Niche opportunities (5–8 products with score + price sweet spot)',
        'B — Pricing vs competition and estimated costs',
        'C — Adjacent expansion (what to make next without leaving your method)',
    ],
};

function getTitanPageCopy(lang, priceUsd, monitoringUsd) {
    const es = lang === 'es';
    return es
        ? {
            badgeLite: 'Tras tu escaneo Lite',
            badgeEmail: 'Desde tu correo Lite — 12 fugas más por descubrir',
            headlineDefault: '15 fallas principales. 15 correcciones. Un reporte.',
            headlineLeaks: 'Tus 3 fugas del Lite siguen activas — faltan 12 más',
            subheadDefault: 'El Lite solo nombra 3 problemas. El Reporte Titán detecta las 15 fugas de conversión más graves en tu página y te da una recomendación concreta para resolver cada una — más el bonus gratis de oportunidades de nuevos productos.',
            subheadLeaks: 'Tu Lite ya mostró fugas reales en tu página. Titán entrega el mapa completo: las 15 fallas rankeadas + cómo arreglar cada una — y el bonus gratis de oportunidades de producto si otros SKUs podrían vender mejor que tu catálogo actual.',
            lblPage: 'Tu página',
            lblEmail: 'Correo del reporte',
            leaksTitle: 'Fallas detectadas en tu Lite — siguen activas:',
            leaksWait: 'Cargando tus fugas del escaneo Lite…',
            flawsTitle: '15 fallas principales de conversión',
            fixesTitle: '15 recomendaciones para resolverlas',
            examplesTitle: 'Ejemplo de falla → recomendación',
            compareTitle: 'Lite vs Titán',
            compareSub: 'Lite = teaser gratis · Titán = fallas + correcciones + bonus de productos',
            monitoringTitle: 'Qué incluye el monitoreo (USD $' + monitoringUsd + '/mes desde día 30)',
            monitoringBody: 'Reporte mensual de seguimiento con métricas actualizadas. Puedes cancelar por correo o portal Stripe al menos 5 días hábiles antes del cobro. El Reporte Titán (USD $' + priceUsd + ') es venta final hoy.',
            priceAnchor: 'No pagues $3,000 ni esperes semanas por una agencia — reporte forense en ~60 min por USD $' + priceUsd + '.',
            priceToday: 'Cobro hoy: USD $' + priceUsd + ' (Reporte Titán — precio introductorio)',
            btnPay: 'Pagar $' + priceUsd + ' — obtener mi Reporte Titán',
            checkoutHint: 'Checkout seguro Stripe · tu correo y URL ya están listos',
            faqTitle: 'Preguntas antes de pagar',
            stickyCta: 'Obtener mi Titán — $' + priceUsd,
            redirectNote: 'Redirigiendo al escaneo Lite gratis…',
            errMissing: 'Enlace incompleto — necesitas correo y URL. Empieza con el escaneo Lite gratis.',
            errCheckout: 'No se pudo iniciar el checkout. Intenta de nuevo.',
            errNetwork: 'Error de red. Revisa tu conexión.',
            btnLoading: 'Abriendo checkout…',
            overlayTitle: 'Checkout seguro',
            overlaySub: 'Redirigiendo a Stripe. No cierres esta ventana.',
            termsLine: 'Al pagar aceptas nuestros <a href="/terms" class="text-violet-400 underline">Términos</a> y <a href="/privacy" class="text-violet-400 underline">Privacidad</a>.',
            freeLiteLink: '¿Aún no tienes Lite? Escaneo gratis →',
            colLite: 'Lite · Gratis',
            colTitan: 'Titán · $' + priceUsd,
            colFeature: 'Qué recibes',
            sectionsSummary: 'Qué incluye el PDF Titán (11 secciones + bonus de producto)',
            faq: [
                { q: '¿Por qué pagar si ya tengo el Lite?', a: 'Lite nombra 3 fugas sin playbook de corrección. Titán muestra las 15 principales y una recomendación específica para cada una, más benchmark, plan de 21 días y el bonus gratis de oportunidades de nuevos productos.' },
                { q: '¿Qué es el bonus de productos?', a: 'Sin costo extra: el mismo análisis Product Intel — SKUs del nicho rankeados, precios/costos y expansión adyacente — por si tu catálogo actual no es el que mejor convierte.' },
                { q: '¿Qué es el cargo de $' + monitoringUsd + '/mes?', a: 'Monitoreo mensual opcional que empieza el día 30. Puedes cancelarlo antes del primer cobro recurrente. El reporte Titán de hoy (USD $' + priceUsd + ') es un pago único.' },
                { q: '¿Cuándo llega el PDF?', a: 'Normalmente en ~60 minutos a tu correo. Revisa spam y Promociones.' },
                { q: '¿Necesito acceso a mi backend?', a: 'No. Auditamos tu página pública como la vería un extraño — la misma URL que tus anuncios envían.' },
            ],
        }
        : {
            badgeLite: 'After your free Lite scan',
            badgeEmail: 'From your Lite email — 12 more leaks to uncover',
            headlineDefault: '15 main flaws. 15 fixes. One report.',
            headlineLeaks: 'Your 3 Lite leaks are still live — 12 more hidden',
            subheadDefault: 'Lite names 3 problems only. The Titan Report finds all 15 ranked conversion failures on your page and gives you a clear recommendation to fix each one — plus a free New Product Opportunities bonus.',
            subheadLeaks: 'Your Lite already flagged real issues on your page. Titan delivers the full map: all 15 flaws ranked + how to fix each — and a free Product Opportunities bonus if better SKUs could outperform your current catalog.',
            lblPage: 'Your page',
            lblEmail: 'Report email',
            leaksTitle: 'Issues from your Lite scan — still active:',
            leaksWait: 'Loading your Lite scan leaks…',
            flawsTitle: '15 main conversion flaws',
            fixesTitle: '15 fix recommendations',
            examplesTitle: 'Example flaw → recommendation',
            compareTitle: 'Lite vs Titan',
            compareSub: 'Lite = free teaser · Titan = flaws + fixes + product opportunities bonus',
            monitoringTitle: 'What monitoring includes (USD $' + monitoringUsd + '/mo from day 30)',
            monitoringBody: 'Monthly follow-up report with updated metrics. Cancel via email or Stripe portal at least 5 business days before renewal. Today\'s Titan Report (USD $' + priceUsd + ') is a one-time charge.',
            priceAnchor: 'Don\'t pay $3,000 and wait weeks for an agency — forensic report in ~60 min for USD $' + priceUsd + '.',
            priceToday: 'Charged today: USD $' + priceUsd + ' (Titan Report — introductory price)',
            btnPay: 'Pay $' + priceUsd + ' — get my Titan Report',
            checkoutHint: 'Secure Stripe checkout · your email and URL are already set',
            faqTitle: 'Questions before you pay',
            stickyCta: 'Get my Titan — $' + priceUsd,
            redirectNote: 'Redirecting to free Lite scan…',
            errMissing: 'Incomplete link — email and page URL required. Start with the free Lite scan.',
            errCheckout: 'Could not start checkout. Try again.',
            errNetwork: 'Network error. Check your connection.',
            btnLoading: 'Opening checkout…',
            overlayTitle: 'Secure checkout',
            overlaySub: 'Redirecting to Stripe. Do not close this window.',
            termsLine: 'By paying you agree to our <a href="/terms" class="text-violet-400 underline">Terms</a> and <a href="/privacy" class="text-violet-400 underline">Privacy Policy</a>.',
            freeLiteLink: 'No Lite yet? Free scan →',
            colLite: 'Lite · Free',
            colTitan: 'Titan · $' + priceUsd,
            colFeature: 'What you get',
            sectionsSummary: 'Inside the Titan PDF (11 sections + product opportunities bonus)',
            faq: [
                { q: 'Why pay if I already have Lite?', a: 'Lite names 3 flaws with no fix playbook. Titan shows all 15 main failures plus a specific recommendation for each, plus competitor benchmark, a 21-day plan, and a free New Product Opportunities bonus.' },
                { q: 'What is the product opportunities bonus?', a: 'At no extra cost: the same Product Intel analysis — ranked niche SKUs, pricing/costs, and adjacent expansion — in case better products could outperform your current catalog.' },
                { q: 'What is the $' + monitoringUsd + '/mo charge?', a: 'Optional monthly monitoring starting day 30. You can cancel before the first recurring charge. Today\'s Titan Report (USD $' + priceUsd + ') is a one-time payment.' },
                { q: 'When does the PDF arrive?', a: 'Usually within ~60 minutes by email. Check spam and Promotions.' },
                { q: 'Do I need backend access?', a: 'No. We audit your public page like a stranger would — the same URL your ads send traffic to.' },
            ],
        };
}

module.exports = {
    TITAN_FLAW_FIX_EXAMPLES,
    COMPARE_ROWS,
    TITAN_SECTIONS,
    TITAN_BONUS,
    getTitanPageCopy,
};
