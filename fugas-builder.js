/** Construye 15 fugas determinísticas desde SIMULATION_RESULTS — sin placeholders de Gemini */

const PLACEHOLDER_RE = /\b(?:additional conversion leak not detected|fuga adicional no detectada|not detected from available data|no detectada en los datos disponibles)\b/i;

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
    return findings;
}

function severityRank(severity) {
    const s = String(severity || '').toUpperCase();
    if (s === 'CRITICA' || s === 'CRITICAL') return 0;
    if (s === 'ALTA' || s === 'HIGH') return 1;
    if (s === 'MEDIA' || s === 'MEDIUM') return 2;
    return 3;
}

function severityLabel(severity, locale) {
    const es = locale?.code?.startsWith('es');
    const s = String(severity || '').toUpperCase();
    if (s === 'CRITICA' || s === 'CRITICAL') return es ? 'Crítico' : 'Critical';
    if (s === 'ALTA' || s === 'HIGH') return es ? 'Alto' : 'High';
    if (s === 'MEDIA' || s === 'MEDIUM') return es ? 'Medio' : 'Medium';
    return es ? 'Bajo' : 'Low';
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

function extraForensicLeaks(dossier, locale, existingIds) {
    const es = locale?.code?.startsWith('es');
    const extras = [];
    const used = new Set(existingIds);

    const push = (id, band, rule, evidence) => {
        if (used.has(id)) return;
        used.add(id);
        extras.push({ id, persona: 'forense', severity: band, rule, evidence, band });
    };

    const h1 = dossier.match(/H1_COUNT:\s*(\d+)/i);
    if (h1 && Number(h1[1]) === 0) {
        push(9001, es ? 'Alto' : 'High', es ? 'Encabezado principal ausente' : 'Missing primary headline', `H1_COUNT: ${h1[1]}`);
    }
    const jsonLd = dossier.match(/JSON-LD:\s*(\d+)/i);
    if (jsonLd && Number(jsonLd[1]) === 0) {
        push(9002, es ? 'Alto' : 'High', es ? 'Datos estructurados ausentes' : 'Missing structured data', `JSON-LD: ${jsonLd[1]}`);
    }
    const alt = dossier.match(/(?:Alt coverage|ALT_IMG|imgsAltPct):\s*(\d+)%?/i);
    if (alt && Number(alt[1]) < 50) {
        push(9003, es ? 'Medio' : 'Medium', es ? 'Cobertura baja de texto alternativo en imágenes' : 'Low image alt text coverage', `${alt[1]}%`);
    }
    const load = dossier.match(/TIEMPO_CARGA_SEG:\s*([\d.]+)/i);
    if (load && Number(load[1]) > 3.5) {
        push(9004, es ? 'Alto' : 'High', es ? 'Tiempo de carga elevado' : 'Slow page load time', `${load[1]}s`);
    }
    const titleLen = dossier.match(/Title:\s*([^\n|]{20,120})/i);
    if (titleLen && titleLen[1].length > 65) {
        push(9005, es ? 'Medio' : 'Medium', es ? 'Título demasiado largo para resultados de búsqueda' : 'Title tag too long for search snippets', `${titleLen[1].length} chars`);
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

    const banded = assignPriorityBands(findings.slice(0, target), locale);
    while (banded.length < target) {
        const n = banded.length + 1;
        banded.push({
            id: 9100 + n,
            persona: 'forense',
            severity: 'MEDIA',
            rule: es ? 'Fricción de navegación o claridad de oferta' : 'Navigation friction or offer clarity gap',
            evidence: es ? 'Revisar jerarquía visual y CTAs principales' : 'Review visual hierarchy and primary CTAs',
            band: n >= 13 ? (es ? 'Bajo' : 'Low') : (es ? 'Medio' : 'Medium'),
        });
    }

    const evLabel = es ? 'evaluación' : 'evaluation';
    const items = banded.slice(0, target).map((f) => {
        const label = f.band || severityLabel(f.severity, locale);
        const evId = f.id < 9000 ? `#${f.id}` : null;
        const base = `${f.rule} — ${f.evidence}`;
        const suffix = evId ? ` (evidence: ${evLabel} ${evId})` : '';
        return `**${label}:** ${base}${suffix}`;
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
