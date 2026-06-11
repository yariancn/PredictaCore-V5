/** Ubicación / mercado geográfico inferido del activo — criterio por giro */

const COUNTRY_TLD = {
    mx: 'MX', 'com.mx': 'MX', es: 'ES', 'co.uk': 'GB', uk: 'GB',
    'com.au': 'AU', au: 'AU', de: 'DE', fr: 'FR', br: 'BR', ar: 'AR', cl: 'CL', co: 'CO',
};

const COUNTRY_NAMES = {
    MX: ['mexico', 'méxico', 'mexico city', 'cdmx'],
    US: ['usa', 'united states', 'u.s.a', 'america'],
    ES: ['españa', 'spain', 'madrid', 'barcelona'],
    AU: ['australia', 'australian'],
    GB: ['uk', 'united kingdom', 'england', 'london'],
    CA: ['canada', 'canadian'],
};

const COUNTRY_LABEL = {
    US: 'Estados Unidos',
    MX: 'México',
    ES: 'España',
    GB: 'Reino Unido',
    AU: 'Australia',
    CA: 'Canadá',
    BR: 'Brasil',
    AR: 'Argentina',
    CL: 'Chile',
    CO: 'Colombia',
    DE: 'Alemania',
    FR: 'Francia',
};

/** Cómo definir el mercado de competidores según giro */
const GIRO_MARKET_BASIS = {
    ecommerce: 'SHIPPING',
    ecommerce_social: 'SHIPPING',
    salud: 'LOCAL',
    restaurante: 'LOCAL',
    inmobiliario: 'LOCAL',
    educacion: 'NATIONAL',
    servicios: 'AUTO',
    general: 'AUTO',
    general_social: 'AUTO',
};

const LOCAL_GIROS = new Set(['salud', 'restaurante', 'inmobiliario']);

function inferCountryFromDomain(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        for (const [tld, code] of Object.entries(COUNTRY_TLD)) {
            if (host.endsWith(`.${tld}`)) return code;
        }
        if (host.endsWith('.com') || host.endsWith('.net') || host.endsWith('.org')) return null;
    } catch { /* skip */ }
    return null;
}

function inferCountryFromLang(htmlLang) {
    if (!htmlLang) return null;
    const l = htmlLang.toLowerCase();
    if (l.startsWith('es-mx') || l.startsWith('es')) return 'MX';
    if (l.startsWith('en-au')) return 'AU';
    if (l.startsWith('en-gb')) return 'GB';
    if (l.startsWith('en')) return 'US';
    if (l.startsWith('pt-br')) return 'BR';
    if (l.startsWith('de')) return 'DE';
    if (l.startsWith('fr')) return 'FR';
    return null;
}

function detectCountryInText(text) {
    const lower = String(text || '').toLowerCase();
    for (const [code, names] of Object.entries(COUNTRY_NAMES)) {
        if (names.some((n) => lower.includes(n))) return code;
    }
    if (/\b(?:TX|CA|FL|NY|IL|GA|AZ|CO|WA|OR|NV|NC|SC|VA|PA|OH|MI|MN|WI|MO|TN|LA|AL|KY|OK|UT|IA|AR|MS|KS|NM|NE|WV|ID|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)\b/.test(text)) {
        return 'US';
    }
    return null;
}

function extractCityRegion(text) {
    const sample = String(text || '');
    const cityStateZip = sample.match(
        /\b([A-ZÁÉÍÓÚ][a-záéíóúA-Z]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)?),\s*([A-Z]{2}|[A-Za-záéíóúÁÉÍÓÚ\s]{2,30})(?:\s+(\d{4,5}))?\b/
    );
    const mxCity = sample.match(/\b(CDMX|Ciudad de México|Guadalajara|Monterrey|Cancún|Puebla|Tijuana|Querétaro|León|Mérida)\b/i);
    const esCity = sample.match(/\b(Madrid|Barcelona|Valencia|Sevilla|Bogotá|Buenos Aires|Santiago|Lima)\b/i);
    const city = cityStateZip?.[1]?.trim() || mxCity?.[0] || esCity?.[0] || null;
    const region = cityStateZip?.[2]?.trim() || null;
    const postal = cityStateZip?.[3] || null;
    return { city, region, postal };
}

function hasLocalPresenceSignals(text) {
    return /\b(dirección|address|ubicación|location|horario|hours|visit us|visítanos|sucursal|branch|our (?:office|clinic|store)|nuestra (?:tienda|clínica|oficina)|showroom|walk-?in|tienda física|physical store|book (?:an )?appointment|agendar cita|reservar mesa|near me|cerca de ti|serving the\s+[A-Z])/i.test(text);
}

function hasRemoteServiceSignals(text) {
    return /\b(remote|remoto|nationwide|a nivel nacional|virtual|online only|100% online|worldwide|international clients|clientes en todo|sin importar ubicación|anywhere in)\b/i.test(text);
}

/** E-commerce: mercado = dónde ENVÍA, no dónde está el negocio */
function detectShippingMarket(text, url, onPage) {
    const sample = String(text || '');

    if (/\b(worldwide shipping|ships worldwide|env[ií]o internacional|we ship (?:anywhere|worldwide|globally|internationally)|global shipping)\b/i.test(sample)) {
        return { scope: 'GLOBAL', country: 'GLOBAL', label: 'Envío internacional / worldwide' };
    }

    const shippingPatterns = [
        { re: /\b(?:ships?|shipping|deliver(?:y|ies)|env[ií]os?)\s+(?:to|within|across|throughout|in)\s+(?:the\s+)?(?:all\s+)?(?:50\s+)?(?:contiguous\s+)?(US|USA|U\.S\.A\.?|United States)\b/i, country: 'US' },
        { re: /\b(?:free\s+shipping|env[ií]o\s+gratis).{0,40}\b(US|USA|United States|Estados Unidos)\b/i, country: 'US' },
        { re: /\bnationwide\s+(?:shipping|delivery|within the us|in the us)\b/i, country: 'US' },
        { re: /\b(?:ships?|shipping|env[ií]os?)\s+(?:to|within|a)\s+(?:todo\s+)?(M[eé]xico|M[eé]xico|MX)\b/i, country: 'MX' },
        { re: /\benv[ií]os?\s+a\s+todo\s+(?:el\s+)?(?:pa[ií]s|m[eé]xico)\b/i, country: 'MX' },
        { re: /\b(?:ships?|shipping|deliver(?:y|ies))\s+(?:to|within|across)\s+(Canada|Canad[aá])\b/i, country: 'CA' },
        { re: /\b(?:ships?|shipping|deliver(?:y|ies))\s+(?:to|within|across)\s+(Spain|España|UK|United Kingdom|Australia)\b/i, country: null },
    ];

    for (const { re, country } of shippingPatterns) {
        const m = sample.match(re);
        if (m) {
            let c = country;
            if (!c && m[1]) {
                const name = m[1].toLowerCase();
                if (name.includes('spain') || name.includes('españa')) c = 'ES';
                else if (name.includes('uk') || name.includes('kingdom')) c = 'GB';
                else if (name.includes('australia')) c = 'AU';
                else if (name.includes('canad')) c = 'CA';
            }
            if (c) {
                return {
                    scope: 'NATIONAL',
                    country: c,
                    label: `${COUNTRY_LABEL[c] || c} (zona de envío detectada)`,
                };
            }
        }
    }

    const inferred = detectCountryInText(sample)
        || inferCountryFromDomain(url)
        || inferCountryFromLang(onPage?.htmlLang);

    if (inferred) {
        return {
            scope: 'NATIONAL',
            country: inferred,
            label: `${COUNTRY_LABEL[inferred] || inferred} (mercado inferido por idioma/dominio — sin política de envío explícita)`,
            inferred: true,
        };
    }

    return {
        scope: 'NATIONAL',
        country: 'NO_DETECTADA',
        label: 'Mercado de envío no detectado',
        inferred: true,
    };
}

function resolveMarketBasis(giroId, hasLocal, hasRemote) {
    const basis = GIRO_MARKET_BASIS[giroId] || 'AUTO';
    if (basis !== 'AUTO') return basis;
    if (LOCAL_GIROS.has(giroId)) return 'LOCAL';
    if (hasLocal && !hasRemote) return 'LOCAL';
    if (hasRemote) return 'NATIONAL';
    return hasLocal ? 'LOCAL' : 'NATIONAL';
}

function extractGeoContext(onPage, url, giro) {
    const sample = `${onPage?.textSample || ''} ${onPage?.metaDescription || ''} ${onPage?.h1Text || ''}`.slice(0, 6000);
    const giroId = giro?.id || 'general';
    const { city, region, postal } = extractCityRegion(sample);
    const hasLocal = hasLocalPresenceSignals(sample) || LOCAL_GIROS.has(giroId);
    const hasRemote = hasRemoteServiceSignals(sample);
    const marketBasis = resolveMarketBasis(giroId, hasLocal, hasRemote);

    const businessAddress = [city, region].filter(Boolean).join(', ') || null;

    let scope;
    let country;
    let marketLabel;
    let marketCountry;
    let shippingInferred = false;

    if (marketBasis === 'SHIPPING') {
        const ship = detectShippingMarket(sample, url, onPage);
        scope = ship.scope;
        marketCountry = ship.country;
        country = ship.country === 'GLOBAL' ? 'GLOBAL' : (ship.country || 'NO_DETECTADA');
        marketLabel = ship.label;
        shippingInferred = !!ship.inferred;
    } else if (marketBasis === 'LOCAL') {
        scope = 'LOCAL';
        country = detectCountryInText(sample)
            || inferCountryFromDomain(url)
            || inferCountryFromLang(onPage?.htmlLang)
            || (region && /^[A-Z]{2}$/.test(region) ? 'US' : null)
            || 'NO_DETECTADA';
        marketCountry = country;
        marketLabel = city
            ? `${city}${region ? `, ${region}` : ''}${country && country !== 'NO_DETECTADA' ? `, ${country}` : ''}`
            : (country !== 'NO_DETECTADA' ? `${COUNTRY_LABEL[country] || country} (ciudad no detectada)` : 'Ubicación local no detectada');
    } else {
        scope = 'NATIONAL';
        country = detectCountryInText(sample)
            || inferCountryFromDomain(url)
            || inferCountryFromLang(onPage?.htmlLang)
            || 'NO_DETECTADA';
        marketCountry = country;
        marketLabel = COUNTRY_LABEL[country] || country;
    }

    const label = marketBasis === 'SHIPPING'
        ? marketLabel
        : (marketBasis === 'LOCAL' && city
            ? `${city}${region ? `, ${region}` : ''}, ${country}`
            : marketLabel);

    return {
        city: marketBasis === 'LOCAL' ? city : null,
        region: marketBasis === 'LOCAL' ? region : null,
        postal: marketBasis === 'LOCAL' ? postal : null,
        country,
        marketCountry,
        scope,
        marketBasis,
        label,
        marketLabel,
        businessAddress: marketBasis === 'SHIPPING' ? businessAddress : null,
        hasLocalSignals: hasLocal,
        shippingInferred,
        giroId,
    };
}

function benchmarkRuleForGeo(geo, giro) {
    const giroLabel = giro?.label || geo.giroId || '';
    switch (geo.marketBasis) {
        case 'SHIPPING':
            return `GIRO e-commerce: competidores = mismo nicho de producto/servicio que venden o envían a ${geo.marketLabel}. La dirección física del negocio${geo.businessAddress ? ` (${geo.businessAddress})` : ''} NO define el mercado — solo importa la zona de envío/venta.`;
        case 'LOCAL':
            return `GIRO ${giroLabel}: competidores SOLO con presencia local en ${geo.city ? `la misma ciudad/región (${geo.city}${geo.region ? `, ${geo.region}` : ''})` : 'la misma área geográfica detectada'}. PROHIBIDO competidores de otras ciudades o estados lejanos.`;
        case 'NATIONAL':
        default:
            return `Competidores del mismo nicho comercial en el mismo país/mercado (${geo.marketLabel || geo.country}). Sin restricción de ciudad salvo que el negocio sea explícitamente local.`;
    }
}

function formatGeoBlock(geo, giro) {
    const regla = benchmarkRuleForGeo(geo, giro);
    const criterio = geo.marketBasis === 'SHIPPING'
        ? 'ZONA_ENVIO (e-commerce — dónde envía/vende, NO dónde está ubicado)'
        : geo.marketBasis === 'LOCAL'
            ? 'PRESENCIA_LOCAL (consultorio, clínica, restaurante, inmobiliario — misma ciudad)'
            : 'MERCADO_NACIONAL (servicios/educación — mismo país)';

    const extra = geo.marketBasis === 'SHIPPING' && geo.businessAddress
        ? `DOMICILIO_NEGOCIO: ${geo.businessAddress} (referencia únicamente — NO usar para definir competidores)\n`
        : '';

    return `
=== UBICACION_MERCADO (OBLIGATORIO PARA BENCHMARK) ===
CRITERIO_MERCADO: ${criterio}
ALCANCE: ${geo.scope}
MERCADO_COMPETENCIA: ${geo.marketLabel || geo.label}
PAIS_MERCADO: ${geo.marketCountry || geo.country}
${geo.marketBasis === 'LOCAL' ? `CIUDAD_SERVICIO: ${geo.city || 'NO_DETECTADA'}\nREGION: ${geo.region || 'NO_DETECTADA'}\n` : ''}${extra}REGLA_BENCHMARK: ${regla}
=== FIN UBICACION_MERCADO ===`;
}

function inferCountryFromSnapshot(snapshot, domain) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    return detectCountryInText(blob) || inferCountryFromDomain(`https://${domain}`) || null;
}

function competitorServesShippingMarket(snapshot, domain, clientGeo) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    const ship = detectShippingMarket(blob, `https://${domain}`, { htmlLang: snapshot?.htmlLang });
    if (ship.country === 'GLOBAL' || clientGeo.marketCountry === 'GLOBAL') return true;
    if (ship.country && clientGeo.marketCountry && ship.country === clientGeo.marketCountry) return true;
    const compCountry = inferCountryFromSnapshot(snapshot, domain);
    if (clientGeo.marketCountry && compCountry === clientGeo.marketCountry) return true;
    if (ship.inferred && compCountry === clientGeo.marketCountry) return true;
    if (clientGeo.marketCountry === 'MX' && /\.(com\.mx|mx)$/i.test(domain)) return true;
    if (clientGeo.marketCountry === 'MX' && /\b(m[eé]xico|mxn|env[ií]o|carrito|comprar|tienda)\b/i.test(blob)
        && !/\b(ships?\s+(?:only\s+)?to\s+(?:the\s+)?(?:us|usa|united states|canada))\b/i.test(blob)) {
        return true;
    }
    if (!compCountry && clientGeo.marketCountry !== 'NO_DETECTADA') return true;
    return false;
}

function competitorHasLocalPresence(snapshot, clientGeo, domain) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`.toLowerCase();
    if (!clientGeo.city) {
        const compCountry = inferCountryFromSnapshot(snapshot, domain);
        return !compCountry || compCountry === clientGeo.country;
    }
    const cityLower = clientGeo.city.toLowerCase();
    if (blob.includes(cityLower)) return true;
    if (clientGeo.region && blob.includes(clientGeo.region.toLowerCase())) return true;
    const compCountry = inferCountryFromSnapshot(snapshot, domain);
    if (compCountry && clientGeo.country && compCountry !== clientGeo.country) return false;
    return false;
}

function geoMatchesMarket(clientGeo, snapshot, domain) {
    if (!clientGeo || clientGeo.country === 'NO_DETECTADA') return true;
    if (clientGeo.scope === 'GLOBAL' || clientGeo.marketCountry === 'GLOBAL') return true;

    if (clientGeo.marketBasis === 'SHIPPING') {
        return competitorServesShippingMarket(snapshot, domain, clientGeo);
    }

    if (clientGeo.marketBasis === 'LOCAL') {
        return competitorHasLocalPresence(snapshot, clientGeo, domain);
    }

    const compCountry = inferCountryFromSnapshot(snapshot, domain);
    if (clientGeo.marketCountry && compCountry && clientGeo.marketCountry !== compCountry) {
        return false;
    }
    if (clientGeo.country && compCountry && clientGeo.country !== compCountry) {
        return false;
    }
    return true;
}

module.exports = {
    extractGeoContext,
    formatGeoBlock,
    geoMatchesMarket,
    inferCountryFromDomain,
    inferCountryFromSnapshot,
    detectShippingMarket,
    benchmarkRuleForGeo,
    GIRO_MARKET_BASIS,
};
