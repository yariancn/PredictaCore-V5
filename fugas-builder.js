/** Construye fugas desde SIMULATION_RESULTS — solo fallback si Gemini usa placeholders */

const PLACEHOLDER_RE = /\b(?:additional conversion leak not detected|fuga adicional no detectada|not detected from available data|no detectada en los datos disponibles)\b/i;

const RULE_EN = {
    'Señales de confianza en copy': 'Trust signals missing in page copy',
    'Schema.org / datos estructurados': 'Missing Schema.org structured data',
    'Contacto verificable (email/tel)': 'Verifiable contact not detected',
    'Tiempo de carga ≤ 4s': 'Page load time exceeds 4 seconds',
    'CTA de acción visible': 'Primary action CTA not visible',
    'H1 único': 'Missing or duplicate primary H1 headline',
    'Alt en imágenes (≥ 50%)': 'Insufficient image alt text coverage',
    'Propuesta de valor en H1': 'Value proposition absent from H1',
    'Precio u oferta señalada': 'Price or offer not clearly signaled',
    'Política envío/devolución mencionada': 'Shipping/returns policy not visible',
    'Botón de compra en producto': 'Product purchase button not detected',
};

function parseSimulationFindings(dossier) {
    const block = (dossier || '').match(/=== SIMULATION_RESULTS[\s\S]*?=== FIN SIMULATION_RESULTS ===/);
    if (!block) return [];

    const findings = [];
    for (const line of block[0].split('\n')) {
        const m = line.match(/^#(\d+)\s*\|\s*persona=([^|]+)\|\s*(\w+)\s*\|\s*([^|]+)\|\s*evidencia=(.+)$/i);
        if (!m) continue;
        const status = m[3].toUpperCase();
        if (status === 'PASS' || status === 'OK') continue;
        findings.push({
            id: Number(m[1]),
            persona: m[2].trim(),
            severity: status,
            rule: m[4].trim(),
            evidence: m[5].trim(),
        });
    }

    const failBlock = block[0].match(/FALLAS_PRIORITARIAS:\n([\s\S]*?)(?:\n===|$)/);
    if (failBlock) {
        for (const line of failBlock[1].split('\n')) {
            const m = line.match(/^#(\d+)\s*\[([^\]]+)\]\s*(.+?)\s*→\s*(.+)$/);
            if (!m) continue;
            if (findings.some((f) => f.id === Number(m[1]))) continue;
            findings.push({
                id: Number(m[1]),
                persona: m[2].trim(),
                severity: 'ALTA',
                rule: m[3].trim(),
                evidence: m[4].trim(),
            });
        }
    }
    return findings;
}

function severityRank(severity) {
    const s = String(severity || '').toUpperCase();
    if (s === 'CRITICA' || s === 'CRITICAL') return 0;
    if (s === 'ALTA' || s === 'HIGH') return 1;
    if (s === 'MEDIA' || s === 'MEDIUM') return 2;
    return 3;
}

function assignPriorityBands(findings, locale) {
    const sorted = [...findings].sort((a, b) => {
        const d = severityRank(a.severity) - severityRank(b.severity);
        return d !== 0 ? d : a.id - b.id;
    });

    return sorted.map((f, idx) => {
        let band;
        if (idx < 3) band = locale?.code?.startsWith('es') ? 'Crítico' : 'Critical';
        else if (idx < 8) band = locale?.code?.startsWith('es') ? 'Alto' : 'High';
        else if (idx < 12) band = locale?.code?.startsWith('es') ? 'Medio' : 'Medium';
        else band = locale?.code?.startsWith('es') ? 'Bajo' : 'Low';
        return { ...f, band };
    });
}

function localizeRule(rule, locale) {
    if (locale?.code?.startsWith('es')) return rule;
    return RULE_EN[rule] || rule;
}

function extraForensicLeaks(dossier, locale, existingIds) {
    const es = locale?.code?.startsWith('es');
    const extras = [];
    const used = new Set(existingIds);

    const push = (id, band, rule, evidence) => {
        if (used.has(id)) return;
        used.add(id);
        extras.push({ id, persona: 'forense', severity: band, rule, evidence, band });
    };

    const checks = [
        [/H1_COUNT:\s*0/i, 9001, 'High', es ? 'Encabezado H1 ausente' : 'Missing primary H1 headline', 'H1_COUNT: 0'],
        [/JSON-LD:\s*0/i, 9002, 'High', es ? 'Schema.org ausente' : 'Missing Schema.org structured data', 'JSON-LD: 0'],
        [/IMAGENES_ALT_COVERAGE:\s*(\d+)%/i, 9003, 'Medium', es ? 'Cobertura baja de alt en imágenes' : 'Low image alt text coverage', null],
        [/META_DESCRIPTION \(\d+ chars\)/i, 9004, 'Medium', es ? 'Meta description subóptima' : 'Suboptimal meta description length', null],
        [/SITEMAP_XML:\s*NO_ENCONTRADO|NOT FOUND/i, 9005, 'Medium', es ? 'Sitemap no detectado' : 'Sitemap not detected', null],
        [/ROBOTS_TXT:\s*AUSENTE|ABSENT/i, 9006, 'Low', es ? 'robots.txt ausente' : 'Missing robots.txt', null],
        [/CANONICAL:\s*AUSENTE|ABSENT/i, 9007, 'Low', es ? 'Canonical URL ausente' : 'Missing canonical URL', null],
        [/VIEWPORT_MOBILE:\s*AUSENTE|ABSENT/i, 9008, 'Medium', es ? 'Viewport mobile ausente' : 'Missing mobile viewport meta', null],
        [/TIEMPO_CARGA_SEG:\s*([\d.]+)/i, 9009, 'High', es ? 'Tiempo de carga elevado' : 'Slow page load time', null],
    ];

    for (const [re, id, band, rule, ev] of checks) {
        const m = dossier.match(re);
        if (!m) continue;
        const evidence = ev || m[0].trim();
        if (id === 9003 && m[1] && Number(m[1]) >= 50) continue;
        if (id === 9009 && m[1] && Number(m[1]) <= 3.5) continue;
        push(id, band, rule, evidence);
    }

    return extras;
}

function buildFugasFromDossier(dossier, locale, { target = 15, header } = {}) {
    const es = locale?.code?.startsWith('es');
    const hdr = header || (es ? '### VIII. 15 PUNTOS DE FUGA' : '### VIII. 15 CONVERSION LEAK POINTS');

    let findings = parseSimulationFindings(dossier);
    if (findings.length < target) {
        findings = findings.concat(extraForensicLeaks(dossier, locale, findings.map((f) => f.id)));
    }

    const unique = [];
    const seen = new Set();
    for (const f of assignPriorityBands(findings, locale)) {
        const key = `${f.rule}|${f.evidence}`;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(f);
        if (unique.length >= target) break;
    }

    const evLabel = es ? 'evaluación' : 'evaluation';
    const items = unique.map((f) => {
        const label = f.band;
        const rule = localizeRule(f.rule, locale);
        const evId = f.id < 9000 ? `#${f.id}` : null;
        const suffix = evId ? ` (evidence: ${evLabel} ${evId})` : ` (evidence: ${f.evidence})`;
        return `**${label}:** ${rule} — ${f.evidence}${suffix}`;
    });

    const numbered = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    return `${hdr}\n\n${numbered}`;
}

function stripPlaceholderLeaks(text) {
    return String(text || '')
        .split('\n')
        .filter((line) => !PLACEHOLDER_RE.test(line))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function hasPlaceholderLeaks(text) {
    return PLACEHOLDER_RE.test(text || '');
}

module.exports = {
    PLACEHOLDER_RE,
    parseSimulationFindings,
    buildFugasFromDossier,
    stripPlaceholderLeaks,
    hasPlaceholderLeaks,
};
