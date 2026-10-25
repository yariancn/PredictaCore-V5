/**
 * Reporte interno: local para clínica hiperbárica y casa en renta.
 * Norte de Mérida — corte 25 de octubre de 2026.
 * Anuncios públicos; no es una visita ni una oferta verificada.
 */
function shots(base, alt, ext) {
    const e = ext || 'jpg';
    return `<div class="photos"><img src="/static/reportes/clinica/${base}-1.${e}" alt="${alt}"><img src="/static/reportes/clinica/${base}-2.${e}" alt="${alt}. Otra vista del anuncio"></div>`;
}

function getClinicaMeridaNorteHTML() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Clínica hiperbárica · renta norte de Mérida</title>
<style>
  :root {
    --bg: #09090b;
    --card: #111114;
    --line: #27272a;
    --text: #f4f4f5;
    --muted: #a1a1aa;
    --dim: #71717a;
    --violet: #a78bfa;
    --violet-2: #7c3aed;
    --ok: #4ade80;
    --warn: #fbbf24;
    --bad: #fb7185;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
  }
  a { color: var(--violet); }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 32px 20px 80px; }
  header.top { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; margin-bottom: 28px; }
  .brand { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--violet); font-weight: 700; }
  .date { color: var(--dim); font-size: 13px; }
  h1 { font-size: 34px; line-height: 1.15; margin: 0 0 10px; letter-spacing: -0.03em; }
  .lede { color: var(--muted); max-width: 68ch; margin: 0 0 28px; }
  .verdict {
    border: 1px solid #3f2d62;
    background: linear-gradient(180deg, #1a1228, #111114);
    border-radius: 16px;
    padding: 20px 22px;
    margin-bottom: 28px;
  }
  .verdict strong { color: #fff; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0 8px; }
  .stat { background: #0c0c0f; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
  .stat b { display: block; font-size: 22px; letter-spacing: -0.03em; margin-top: 4px; }
  .stat span { color: var(--dim); font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
  h2 { font-size: 22px; margin: 36px 0 8px; letter-spacing: -0.02em; }
  h3 { font-size: 16px; margin: 0 0 6px; }
  p.note { color: var(--muted); margin: 0 0 16px; }
  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 16px 18px 14px;
    margin: 0 0 12px;
  }
  .card.head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
  .price { font-size: 20px; font-weight: 700; letter-spacing: -0.03em; white-space: nowrap; }
  .meta { color: var(--muted); font-size: 14px; margin: 0; }
  ul { margin: 8px 0 0; padding-left: 18px; color: var(--muted); }
  li { margin: 3px 0; }
  .badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    border-radius: 999px;
    padding: 3px 8px;
    margin-right: 6px;
    vertical-align: 1px;
  }
  .fit { background: #052e16; color: var(--ok); }
  .near { background: #2a2106; color: var(--warn); }
  .out { background: #2a1218; color: var(--bad); }
  .gone { background: #27272a; color: #d4d4d8; }
  .zone { background: #18181b; color: #d4d4d8; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 8px 0 18px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { color: var(--dim); font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
  .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0 4px; }
  .photos img { width: 100%; height: 210px; object-fit: cover; border-radius: 10px; background: #18181b; }
  .cap { color: var(--dim); font-size: 12px; margin: 4px 0 0; }
  .sources { color: var(--dim); font-size: 13px; }
  footer { margin-top: 36px; color: var(--dim); font-size: 13px; border-top: 1px solid var(--line); padding-top: 16px; }
  @media (max-width: 720px) {
    h1 { font-size: 28px; }
    .grid, .card.head, header.top { display: block; }
    .price { margin-top: 8px; }
    .stat { margin-bottom: 8px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="brand">PredictaCore · reporte interno</div>
    <div class="date">Corte 25 de octubre de 2026 · Mérida, Yucatán</div>
  </header>
  <h1>Local para clínica hiperbárica y casa en el norte</h1>
  <p class="lede">Búsqueda en Montebello, San Ramón Norte y Santa Gertrudis Copó, con preferencia por avenidas principales (García Lavín y Paseo Norte). Local de 40 a 60 m² hasta $13,000. Casa en coto o privada hasta $15,000. Precios en pesos mexicanos, tomados de anuncios públicos.</p>

  <section class="verdict">
    <p style="margin:0 0 8px"><span class="badge out">Avenida</span> <strong>Sobre García Lavín y Paseo Norte sigue sin haber un local de 40–60 m² en $13,000.</strong></p>
    <p style="margin:0 0 8px;color:var(--muted)">En la segunda vuelta, sin exigir avenida, sí hay espacios activos dentro del presupuesto. Los más útiles para la clínica son dos oficinas de planta baja en Montebello, de 45 m², a <strong style="color:#fff">$11,200</strong>, y una oficina de 40 m² dentro de una casa-oficina, a <strong style="color:#fff">$10,000 más $1,000 de mantenimiento</strong>.</p>
    <p style="margin:0;color:var(--muted)">El piso de renta en García Lavín y Paseo Norte, para ese tamaño, está entre <strong style="color:#fff">$16,500 y $20,000</strong> antes de sumar IVA y, en plazas, mantenimiento. En San Ramón Norte la mediana publicada ronda <strong style="color:#fff">$430 a $447 por m² al mes</strong>: un local de 40 m² sale cerca de $17,200 y uno de 50 m² cerca de $21,500, sin IVA. Para entrar en $13,000 con 50 m² haría falta cerca de $260/m², unos 40% debajo de esa mediana. Eso aparece en oficinas interiores o en otras colonias, no en el frente de estas avenidas.</p>
    <div class="grid">
      <div class="stat"><span>Mejor local, si pueden esperar</span><b>$16,500 + IVA</b>50 m² · Paseo Norte · entrega oct–nov 2026</div>
      <div class="stat"><span>Mejor local disponible ya</span><b>$19,896</b>40.44 m² · García Lavín · IVA incluido</div>
      <div class="stat"><span>Casas dentro de $15,000</span><b>6 fichas</b>Townhouses y una privada chica</div>
    </div>
  </section>

  <h2>Más cerca del presupuesto, activos hoy</h2>
  <p class="note">Segunda búsqueda el 25 de octubre de 2026, en calles internas de Montebello, San Ramón Norte y Santa Gertrudis Copó. Cada ficha se abrió en EasyBroker, CDG o el sitio de la agencia. Solo entran las que siguen publicadas.</p>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">En presupuesto</span><span class="badge zone">Montebello</span> Oficina en planta baja, 45 m²</h3>
        <p class="meta">Recepción, cubículo con baño y bodega · 1 estacionamiento · agua y basura incluidas · a unos 3 minutos del Hospital Faro · EB-WR5769</p>
      </div>
      <div class="price">$11,200</div>
    </div>
    ${shots('ofi-faro', 'Oficina de 45 m² en planta baja, Montebello')}
    <ul>
      <li>Es el espacio activo que mejor combina tamaño y renta. No es un local de aparador: es oficina en planta baja, con acceso para pacientes.</li>
      <li>La luz y el internet corren por cuenta del inquilino. Pide aval con propiedad en Mérida, o un segundo depósito.</li>
      <li>Hay que confirmar altura libre, acceso del equipo y si el reglamento acepta oxígeno. Una cámara monoplaza cabe en 45 m² si el cubículo y la recepción se usan juntos.</li>
    </ul>
    <p class="sources"><a href="https://www.easybroker.com/es-mx/listings/oficina-en-renta-norte-de-merida-montebello">EasyBroker EB-WR5769</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">En presupuesto</span><span class="badge zone">Montebello</span> Oficina en esquina, planta baja, 45 m²</h3>
        <p class="meta">Recepción, área privada, cocineta y baño · 1 estacionamiento · aires inverter · mantenimiento, agua y basura incluidos · EB-WN7674</p>
      </div>
      <div class="price">$11,200</div>
    </div>
    ${shots('ofi-esq', 'Oficina en esquina de 45 m² en Montebello')}
    <ul>
      <li>Segunda ficha, también activa y también en $11,200. Trae dos minisplits, cortinas, parrilla y calentador. El anuncio la describe en esquina.</li>
      <li>Al visitar, confirmar que no sea el mismo espacio que EB-WR5769. Los identificadores y las fotos son distintos.</li>
    </ul>
    <p class="sources"><a href="https://www.easybroker.com/es-mx/listings/oficina-en-esquina-en-renta-en-montebello-merida-planta-baja-montebello">EasyBroker EB-WN7674</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">En presupuesto</span><span class="badge zone">Montebello</span> Oficinas dentro de una casa, la de 40 m²</h3>
        <p class="meta">Planta alta · sin muebles · 1 cajón · aire, agua, luz y basura incluidos · recepción, cocina y sala de juntas compartidas · mantenimiento $1,000</p>
      </div>
      <div class="price">$11,000</div>
    </div>
    ${shots('tierra', 'Casa de oficinas en Montebello, Tierra Linda')}
    <ul>
      <li>La renta de la oficina 4 es $10,000. Con el mantenimiento de planta alta ($1,000) el total es $11,000. Las otras oficinas del mismo inmueble miden 5, 10, 12 y 17 m²: no alcanzan para la cámara.</li>
      <li>El anuncio dice que ya tienen licencia de funcionamiento para oficinas. Para una clínica hay que preguntar si ese permiso cubre servicios de salud y oxígeno, o si hay que tramitar otro.</li>
      <li>Las fotos son del inmueble, no de un local suelto en la calle.</li>
    </ul>
    <p class="sources"><a href="https://www.tierra-linda.com/p/8422675-Oficina-en-Renta-en-Fraccionamiento-Montebello-Montebello">Tierra Linda</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge near">Mil pesos arriba</span><span class="badge zone">Montebello</span> Local de 40 m² sobre Avenida 10</h3>
        <p class="meta">Fachada de cristal · medio baño · 2 estacionamientos · planta a pie de calle · EB-WU5285</p>
      </div>
      <div class="price">$14,000</div>
    </div>
    ${shots('loc-av10', 'Local de 40 m² sobre Avenida 10, Montebello')}
    <ul>
      <li>Es el local comercial activo más cercano al tamaño pedido. Avenida 10 no es García Lavín, y la renta queda $1,000 arriba del tope.</li>
      <li>El anuncio lo ofrece para consultorio, oficina o showroom. Sigue publicado.</li>
    </ul>
    <p class="sources"><a href="https://www.easybroker.com/es-mx/listings/renta-de-local-comercial-en-colonia-montebello">EasyBroker EB-WU5285</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge near">Chico y en piso 2</span><span class="badge zone">San Ramón Norte</span> Local en plaza, Cámara de Comercio</h3>
        <p class="meta">34 m² (4 × 8.30) · baño adentro · aire · estacionamiento · piso 2 · EB-TB5293</p>
      </div>
      <div class="price">$8,000</div>
    </div>
    ${shots('cdg-cam', 'Local de 34 m² en plaza sobre Cámara de Comercio')}
    <ul>
      <li>Es el más barato que sigue activo en la zona. Está debajo de 40 m² y en segundo piso: la cámara y el acceso de pacientes hay que medirlos antes de tomarlo en serio.</li>
      <li>El anuncio de CDG, revisado hoy, dice $8,000, un mes de depósito y contrato de $8,000. Cámara de Comercio sí es avenida; el ahorro viene del tamaño y del piso, no de estar escondido.</li>
    </ul>
    <p class="sources"><a href="https://www.inmobiliariacdg.com/property/local-en-renta-en-plaza-comercial-sobre-avenida-camara-de-comercio">CDG Buildings EB-TB5293</a></p>
  </article>

  <h2>Casas que siguen activas</h2>
  <p class="note">Se volvió a abrir cada ficha. Estas no dicen despublicada ni “ya no está disponible”.</p>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">Activa</span><span class="badge zone">Montebello</span> Townhouse amueblado, 123 m²</h3>
        <p class="meta">2 recámaras con baño · cochera para 2 autos · paneles · internet, basura y áreas comunes incluidos · a un minuto del Periférico · EB-JZ3877</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('th-estrena', 'Townhouse amueblado de 123 m² en Montebello')}
    <ul>
      <li>Ficha nueva respecto a la primera búsqueda, y sigue publicada. No acepta mascotas. Aval con propiedad en Yucatán. El anuncio la clasifica como departamento, pero la distribución es de townhouse.</li>
    </ul>
    <p class="sources"><a href="https://www.easybroker.com/es-mx/listings/estrena-este-hermoso-townhouse-en-montebello">EasyBroker EB-JZ3877</a></p>
  </article>

  <h2>Locales para la clínica</h2>
  <p class="note">Una cámara monoplaza con recepción, vestidor y una sala de espera corta cabe en 40–60 m² si el local es abierto y la altura libre pasa de 2.5 m. Conviene planta baja (peso del equipo y acceso de pacientes), cajones para pacientes, y confirmación por escrito de que el reglamento acepta servicios de salud y el manejo de oxígeno. El uso de suelo y el permiso municipal se revisan antes de firmar.</p>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge near">Lo más cercano</span><span class="badge zone">Santa Gertrudis Copó</span> Plaza Core Vía, Paseo Norte</h3>
        <p class="meta">50 m² (5 × 10 m) · altura libre 3.5 m · planta baja y planta alta · 23 locales · 46 cajones</p>
      </div>
      <div class="price">$16,500 + IVA</div>
    </div>
    ${shots('core-via', 'Render del anuncio de Plaza Core Vía, en Paseo Norte')}
    <p class="cap">Renders del anuncio. La plaza todavía no está entregada.</p>
    <ul>
      <li>Hay dos anuncios del mismo proyecto. Uno publica $16,500 + IVA y entrega en octubre de 2026. Otro (EB-WK3797) publica $18,500 + IVA y 10% de mantenimiento, locales de planta baja 05, 06, 07, 09 y 10.</li>
      <li>Un tercer anuncio ofrece, en contrato de 2 o 3 años, 30% de descuento el primer año. Sobre $16,500 eso son $11,550 + IVA (unos $13,400 ya con IVA). El mantenimiento, si se cobra aparte, puede volver a pasar el tope.</li>
      <li>Se entrega en obra con piso de concreto, cristal al frente y preparación eléctrica e hidrosanitaria. No está listo para operar hoy. La altura de 3.5 m sí ayuda para la cámara.</li>
      <li>46 cajones para 23 locales es justo: hay que preguntar cuántos quedan asignados a un consultorio.</li>
    </ul>
    <p class="sources">Fichas: <a href="https://www.icasas.mx/propiedad/c88d-8221-19f3ac0-aff05655ec26-7eb1">icasas EB-WK3797</a> · <a href="https://www.pincali.com/inmueble/itarch-locales-comerciales-en-renta-santa-gertrudis-copo">Pincali, descuento a plazo</a> · <a href="https://www.inmuebles24.com/locales-comerciales-en-renta-en-santa-gertrudis-copo.html">Inmuebles24, Copó</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge near">Disponible ya</span><span class="badge zone">Montebello</span> García Lavín, cerca de City 32</h3>
        <p class="meta">40.44 m² · planta baja · medio baño · mantenimiento incluido · estacionamiento en la zona</p>
      </div>
      <div class="price">$19,896</div>
    </div>
    ${shots('garcia-40', 'Interior del local de 40.44 m² sobre García Lavín')}
    <ul>
      <li>IVA incluido. Queda unos $6,900 arriba del tope, y es el local sobre avenida, del tamaño pedido, que se puede ocupar ahora.</li>
      <li>El anuncio lo describe en buenas condiciones, al norte, con flujo hacia Periférico, cerca de City Center, Walmart y privadas residenciales.</li>
    </ul>
    <p class="sources">Ficha: <a href="https://www.pincali.com/inmueble/local-en-renta-de-40-44m2-sobre-la-avenida-andres-garcia-lavin-cerca-de-city-32">Pincali, 40.44 m²</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge out">Chico y caro</span><span class="badge zone">San Ramón Norte</span> García Lavín</h3>
        <p class="meta">33.28 m² · planta baja · medio baño · acabados y cancelería · entrega inmediata</p>
      </div>
      <div class="price">$19,008 + IVA</div>
    </div>
    ${shots('sr-local', 'Local de 33 m² sobre García Lavín, San Ramón Norte', 'webp')}
    <ul>
      <li>Con IVA son unos $22,050. Está debajo de 40 m² y arriba del presupuesto. Sirve como referencia del precio por metro en esa avenida (cerca de $570/m² + IVA).</li>
    </ul>
    <p class="sources">Ficha: <a href="https://inmueble.mercadolibre.com.mx/MLM-3086292323-local-en-renta-en-san-ramon-norte-_JM">Mercado Libre</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge out">Doble del presupuesto</span><span class="badge zone">Montebello</span> Calle 33-A 495, listos para consultorio</h3>
        <p class="meta">Luz, agua e internet incluidos · baño propio · se pueden partir en zonas</p>
      </div>
      <div class="price">$27,000–$30,000 + IVA</div>
    </div>
    <p class="cap">El listado de Inmuebles24 no deja ver la galería sin pasar su verificación. No puse fotos de otro local para no mezclar inmuebles.</p>
    <ul>
      <li>56 m² (37 m² cerrados, antes cafetería, más terraza de 19 m²) en $27,000 + IVA.</li>
      <li>53 m² en $30,000 + IVA. El anuncio dice que se puede dividir en tres y lo ofrece para consultorio u oficina.</li>
      <li>Hay otro de 31 m² en $24,000 + IVA: cabe en operación pequeña, no en el rango de 40–60 m².</li>
      <li>No están confirmados sobre García Lavín. El valor aquí es que ya tienen baño, clima y servicios, no el precio.</li>
    </ul>
    <p class="sources">Listado: <a href="https://www.inmuebles24.com/locales-comerciales-en-renta-en-fraccionamiento-montebello.html">Inmuebles24, Montebello</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge out">Avenida, fuera de precio</span><span class="badge zone">Copó / San Ramón</span> Otros frentes que sí están en renta</h3>
        <p class="meta">Para no perseguir fichas que no cierran</p>
      </div>
      <div class="price">desde $25,800</div>
    </div>
    <p class="cap">Son varios locales distintos. No hay una sola galería que los represente.</p>
    <ul>
      <li>60 m², frente de 5 m y fondo de 12 m, doble altura, recepción, dos privados y baño: $25,800 a $25,900 + IVA + 10% de mantenimiento. Aparece en el listado de Santa Gertrudis Copó.</li>
      <li>Town Square, San Ramón Norte, junto a City Center: $350/m² + IVA y 15% de mantenimiento. El local más chico anunciado es de 90 m² (unos $31,500 + IVA). La isla de 16 m² es demasiado pequeña para la cámara.</li>
      <li>City 32 y Victory Platz, sobre García Lavín, empiezan muy por encima (food hall de 40 m² en unos $43,600 + IVA y 20% de mantenimiento; Victory Platz de 54 m² interiores en $46,000 + IVA).</li>
      <li>Plaza Kura, Montebello: del orden de $350/m² + IVA y 10% de mantenimiento. Un local de 50 m² quedaría cerca de $17,500 + IVA, otra vez arriba del tope, y los anuncios visibles son de más de 100 m².</li>
    </ul>
    <p class="sources">Referencias: <a href="https://www.inmuebles24.com/locales-comerciales-en-renta-en-santa-gertrudis-copo.html">Copó</a> · <a href="https://www.orten.com.mx/p/3429006-Local-en-Renta-en-San-Ramon-Norte-locales-comerciales-en-renta-en-Merida--Town-Square">Town Square</a> · <a href="https://spot2.mx/locales-comerciales/renta/yucatan/merida/san-ramon-norte">Spot2, San Ramón Norte</a></p>
  </article>

  <h2>Qué haría con el local</h2>
  <table>
    <thead><tr><th>Opción</th><th>Por qué</th><th>El hueco</th></tr></thead>
    <tbody>
      <tr><td>Negociar Core Vía, planta baja, contrato de 3 años</td><td>Único 50 m² en avenida de la zona cuyo primer año puede acercarse al tope</td><td>No abre antes de octubre de 2026. Hay que dejar por escrito renta, IVA, mantenimiento y el descuento</td></tr>
      <tr><td>Ver el de 40.44 m² en García Lavín</td><td>Tamaño correcto, planta baja, se ocupa ahora</td><td>$19,896 con IVA, unos $6,900 arriba</td></tr>
      <tr><td>Subir el tope a $20,000 + IVA o bajar a unos 30 m²</td><td>Es el mercado real de estas avenidas</td><td>Con $13,000 el frente de avenida de 40–60 m² no aparece</td></tr>
    </tbody>
  </table>

  <h2>Casas en renta, tope $15,000</h2>
  <p class="note">En Santa Gertrudis Copó, la mediana de casas en privada publicada es de unos $23,750 (el rango visible arranca cerca de $17,000). Fontana, Luana y privadas de 13 casas están en $22,000 a $26,000. Lo que sí entra en $15,000 son townhouses en conjuntos chicos y una privada de seis casas. Abajo, “en rango” significa renta publicada de $15,000 o menos. Confirmar caseta, acceso controlado y si el mantenimiento va dentro de esa renta.</p>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge gone">Despublicada el 21 de octubre</span><span class="badge zone">Montebello</span> Townhouse en privada, 2020</h3>
        <p class="meta">77.42 m² · terreno 93.52 m² · 1 recámara · 1 baño y medio · 1 estacionamiento · alberca o patio · mantenimiento incluido · EB-VS9858</p>
      </div>
      <div class="price">$13,500</div>
    </div>
    ${shots('th-13500', 'Townhouse en privada en Montebello, renta de 13,500')}
    <ul>
      <li>La renta más baja que sí dice “privada tranquila”. Planta baja con cocina, sala, comedor, medio baño, bodega y patio. Recámara arriba con vestidor.</li>
      <li>Es de una recámara. Cabe si vive una persona o una pareja. Aval con propiedad en Mérida, o doble depósito, más contrato notarial.</li>
    </ul>
    <p class="sources"><a href="https://www.pincali.com/inmueble/casa-tipo-townhouse-en-renta-en-montebello-dentro-de-merida-yucatan">Pincali</a> · <a href="https://www.triadica.mx/property/casa-tipo-townhouse-en-renta-en-montebello-dentro-de-merida-yucatan">Triadica</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">Sigue activa</span><span class="badge zone">Montebello</span> Townhouse amueblado con paneles</h3>
        <p class="meta">90 m² · 2 recámaras · 2 baños y medio · 2 estacionamientos techados · áreas comunes · EB-RY7856 y EB-WL9347</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('th-90', 'Townhouse amueblado de 90 m² en Montebello')}
    <ul>
      <li>Misma ficha en dos portales: amueblado, estufa, refrigerador, minisplits, paneles solares. Incluye internet, basura y mantenimiento de áreas comunes.</li>
      <li>Contrato de 12 meses. Aval con propiedad en Yucatán, sin opción de doble depósito. No mascotas. El contrato se cobra como 75% de un mes.</li>
    </ul>
    <p class="sources"><a href="https://www.pincali.com/inmueble/townhouse-2-hab-amueblado-en-montebello-paneles-solares">Pincali</a> · <a href="https://inmobitaria.easybroker.com/property/townhouse-en-renta-amueblado-con-paneles-solares-en-montebello-montebello-casa">EasyBroker</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge gone">Despublicada el 12 de octubre</span><span class="badge zone">Montebello</span> Townhouse, Calle 23, con paneles</h3>
        <p class="meta">75 m² · 2 recámaras · 2 baños · 2 cajones techados · internet y basura incluidos · EB-VB1139</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('calle23', 'Townhouse de Calle 23 en Montebello, con paneles solares')}
    <ul>
      <li>Amueblado, camas king, aires en sala y recámaras, boiler eléctrico. No mascotas. Pide mes de renta, mes de depósito, gastos notariales y aval.</li>
      <li>Puede ser otro townhouse del mismo tipo de conjunto, no la ficha de 90 m². Conviene tratarlo como anuncio distinto hasta ver la dirección.</li>
    </ul>
    <p class="sources"><a href="https://www.icasas.mx/propiedad/6729-83bb-19ece77-7969b0d5c54f-74ea">icasas EB-VB1139</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge gone">Despublicada el 14 de octubre</span><span class="badge zone">Santa Gertrudis Copó</span> Townhouse cerca del puente del Periférico</h3>
        <p class="meta">130 m² · 2 recámaras con vestidor · jardín · cochera techada para 2 autos · paneles · cisterna · EB-WR0931</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('copo-th', 'Townhouse en Santa Gertrudis Copó, cerca del Periférico')}
    <ul>
      <li>La casa más grande dentro del tope. El portal la clasifica como departamento, pero la descripción es de townhouse de dos plantas.</li>
      <li>Aval o doble depósito. Aires, cortinas blackout, hidroneumático y parrilla de inducción.</li>
    </ul>
    <p class="sources"><a href="https://affarebienesraices.easybroker.com/property/town-house-con-paneles-en-renta-en-santa-gertrudis-copo">EasyBroker</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">En rango</span><span class="badge zone">Santa Gertrudis Copó</span> Privada de 6 residencias</h3>
        <p class="meta">Dos plantas · 3 recámaras · 3 baños · sala de TV · terreno anunciado 548 m² (380 m² más 168 m² indiviso)</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    <p class="cap">La página pública es el perfil de la agencia y no trae galería de esta casa. No usé fotos de otra residencia.</p>
    <ul>
      <li>Es la ficha que más se parece a un coto chico y no a un townhouse. Estilo californiano, al norte.</li>
      <li>La página pública es el perfil de la agencia, no un anuncio con fotos completas. Hay que pedir la ficha y la dirección antes de agendar.</li>
    </ul>
    <p class="sources"><a href="https://mylisting365.com.mx/agencia-inmobiliaria-AREA%20REAL%20ESTATE%20YUCATAN,%20SCP-831">Área Real Estate Yucatán</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge fit">Sigue activa</span><span class="badge zone">San Ramón Norte</span> Townhouse amueblado</h3>
        <p class="meta">2 recámaras · 1 baño y medio · 2 cajones techados · seguridad de lunes a sábado · EB-QR0749</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('sr-th', 'Townhouse amueblado en San Ramón Norte')}
    <ul>
      <li>Incluye basura, JAPAY y gas, internet, cocina equipada y aires. No mascotas.</li>
      <li>La agencia que lo publica está en Guadalajara. Confirmar que el anuncio sigue vigente y que la visita es en Mérida.</li>
    </ul>
    <p class="sources"><a href="https://loto.easybroker.com/property/townhouse-amueblado-en-renta-san-ramon-norte">EasyBroker</a></p>
  </article>

  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge gone">Ya no está disponible</span><span class="badge zone">Montebello</span> Casa, 3 minutos de Altabrisa</h3>
        <p class="meta">2 recámaras · 3 baños · terraza · cochera para 2 autos · mascotas permitidas · EB-WD3588</p>
      </div>
      <div class="price">$15,000</div>
    </div>
    ${shots('casa-alta', 'Casa en Montebello a unos minutos de Altabrisa')}
    <ul>
      <li>El precio entra. El anuncio no dice privada ni caseta, y el metraje publicado (1 m²) no es creíble. Sirve si al visitarla está dentro de un acceso controlado.</li>
    </ul>
    <p class="sources"><a href="https://www.pincali.com/inmueble/casa-en-renta-montebello-49c418cf-3d66-45fb-828e-0efb45108aa1">Pincali EB-WD3588</a></p>
  </article>

  <h2>Justo arriba del tope</h2>
  <p class="note">Si el coto con caseta pesa más que los $1,000 de diferencia, estas tres son las siguientes.</p>
  <table>
    <thead><tr><th>Casa</th><th>Renta</th><th>Nota</th></tr></thead>
    <tbody>
      <tr>
        <td><a href="https://www.pincali.com/en/home/casa-en-renta-en-merida-en-privada-san-ramon-nte">Privada de 6 casas, San Ramón Norte</a><br>EB-WU0608 · 180 m² · 3 recámaras · alberca común${shots('sr-priv', 'Casa en privada de San Ramón Norte')}</td>
        <td>$16,000</td>
        <td>El coto más claro de San Ramón Norte. Mantenimiento incluido. Mascotas a considerar. $1,000 arriba.</td>
      </tr>
      <tr>
        <td><a href="https://inmobitaria.easybroker.com/property/casa-santa-gertrudis-copo-dos-recamaras-santa-gertrudis-copo">Casa en Copó, a unas cuadras de García Lavín</a><br>EB-VE1965 · 150 m² · 2 recámaras en planta baja. La ficha ya no está publicada.${shots('copo-casa', 'Casa de dos recámaras en Santa Gertrudis Copó')}</td>
        <td>$16,000</td>
        <td>Acepta perros pequeños y doble depósito. No dice caseta.</td>
      </tr>
      <tr>
        <td><a href="https://www.asterismoinmobiliaria.com/property/townhouse-con-paneles-solares-en-montebello">Townhouse Montebello, 130 m²</a><br>EB-KA7529 · 2 recámaras · paneles · amueblado${shots('th-130', 'Townhouse de 130 m² en Montebello')}</td>
        <td>$16,000</td>
        <td>Misma familia de townhouses con paneles. Aval indispensable. No mascotas.</td>
      </tr>
    </tbody>
  </table>

  <h2>También en $13,500, pero es departamento</h2>
  <article class="card">
    <div class="card head">
      <div>
        <h3><span class="badge gone">Ya no está disponible</span><span class="badge zone">Montebello</span> Departamento amueblado con caseta</h3>
        <p class="meta">1 recámara · mantenimiento de $1,600 incluido en la renta · caseta, portón, roof garden, alberca y salón de juegos</p>
      </div>
      <div class="price">$13,500</div>
    </div>
    ${shots('depto', 'Departamento amueblado en Montebello, con caseta')}
    <ul>
      <li>No es casa. Sí es el anuncio con caseta de vigilancia más barato de la zona. No mascotas. Planta alta, estacionamiento techado para un auto.</li>
    </ul>
    <p class="sources"><a href="https://www.pincali.com/inmueble/departamento-amueblado-en-montebello-6540ef30-6a60-4f81-b828-67e822622bab">Pincali</a></p>
  </article>

  <h2>Cómo se armó</h2>
  <p class="note">Se revisaron listados públicos de Inmuebles24, Pincali, EasyBroker, icasas, Lamudi, Spot2, Mercado Libre y fichas de plazas (City 32, Town Square, Core Vía, Plaza Kura, Victory Platz), filtrando Montebello, San Ramón Norte y Santa Gertrudis Copó. No se visitó ningún inmueble y no se habló con los anunciantes. Un anuncio puede estar repetido, ya rentado o con un precio distinto al publicado. IVA, mantenimiento y uso de suelo médico hay que confirmarlos en la visita.</p>

  <footer>
    PredictaCore · reporte interno de búsqueda · 25 de octubre de 2026. No forma parte de la oferta de auditorías del sitio.
  </footer>
</div>
</body>
</html>`;
}

module.exports = { getClinicaMeridaNorteHTML };
