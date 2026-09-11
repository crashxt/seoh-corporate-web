/**
 * Compone el manual de marca como pagina autonoma.
 *
 * Las imagenes van incrustadas en base64 para que el manual se pueda abrir,
 * compartir o archivar sin depender de ningun servidor. Se genera desde las
 * mismas fuentes que el resto de la identidad, asi que no puede quedar
 * mostrando una version antigua de la marca.
 *
 * Uso: node scripts/generar-manual.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const SALIDA = process.argv[2] ?? 'identidad/manual-marca.html';

const incrustar = async (ruta, ancho, fondo) => {
  let img = sharp(ruta).resize({ width: ancho });
  if (fondo) img = img.flatten({ background: fondo });
  return `data:image/png;base64,${(await img.png({ compressionLevel: 9 }).toBuffer()).toString('base64')}`;
};

const CLARO = { r: 238, g: 243, b: 249, alpha: 1 };
const OSCURO = { r: 12, g: 26, b: 43, alpha: 1 };

const logoClaro = await incrustar('brand-src/SEOH_logo_4K_4096px_transparente.png', 760);
const logoOscuro = await incrustar('brand-src/SEOH_logo_4K_4096px_transparente.png', 760, OSCURO);
const marcaClaro = await incrustar('brand-src/SEOH_S_limpia.png', 420);
const marcaOscuro = await incrustar('brand-src/SEOH_S_limpia.png', 420, OSCURO);

// Silueta calcada, para la seccion de una tinta y de tamanos pequenos.
const { lado, trazados } = JSON.parse(await readFile('identidad/marcas/_calco.json', 'utf8'));
const P = trazados.silueta.map((d) => `<path d="${d}"/>`).join('');
const silueta = (tinta) =>
  `<svg viewBox="0 0 ${lado} ${lado}" width="100%" style="max-width:150px" role="img" aria-label="Silueta de la marca SEOH"><g fill="${tinta}" fill-rule="evenodd">${P}</g></svg>`;
const siluetaPx = (tinta, px) =>
  `<svg viewBox="0 0 ${lado} ${lado}" width="${px}" height="${px}" role="img" aria-label="Silueta a ${px} píxeles"><g fill="${tinta}" fill-rule="evenodd">${P}</g></svg>`;

const html = `<title>Marca SEOH DESIGN TECH</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">

<style>
  :root {
    --papel: #F5F8FC; --panel: #FFFFFF; --tinta: #0B1726; --tinta-media: #44596F;
    --tinta-tenue: #5A6C80; --linea: #D9E3EE; --linea-fuerte: #B9C9DA;
    --azul: #0057B8; --azul-profundo: #003B7E; --alerta: #B3341F;
    --display: 'Archivo', 'Segoe UI', system-ui, sans-serif;
    --texto: 'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif;
    --dato: 'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --papel: #060D18; --panel: #0C1626; --tinta: #E6EEF8; --tinta-media: #9DB2C7;
      --tinta-tenue: #7A8FA6; --linea: #1C2A3C; --linea-fuerte: #2C3F55;
      --azul: #5BA6F2; --azul-profundo: #8AC2F8; --alerta: #F0806F;
    }
  }
  :root[data-theme="dark"] {
    --papel: #060D18; --panel: #0C1626; --tinta: #E6EEF8; --tinta-media: #9DB2C7;
    --tinta-tenue: #7A8FA6; --linea: #1C2A3C; --linea-fuerte: #2C3F55;
    --azul: #5BA6F2; --azul-profundo: #8AC2F8; --alerta: #F0806F;
  }

  * { box-sizing: border-box; }
  body { margin:0; background:var(--papel); color:var(--tinta); font-family:var(--texto); font-size:16px; line-height:1.65; -webkit-font-smoothing:antialiased; }
  .hoja { max-width:1080px; margin:0 auto; padding:0 28px 96px; }

  header.portada { display:grid; grid-template-columns:1fr auto; gap:36px; align-items:end; padding:64px 0 28px; border-bottom:3px solid var(--tinta); }
  .eyebrow { font-family:var(--dato); font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:var(--azul); }
  h1 { font-family:var(--display); font-size:clamp(2.1rem,1.3rem + 2.6vw,3.2rem); font-weight:700; line-height:1.05; letter-spacing:-.02em; margin:10px 0 12px; text-wrap:balance; }
  .bajada { max-width:62ch; color:var(--tinta-media); margin:0; }
  .version { font-family:var(--dato); font-size:.75rem; color:var(--tinta-tenue); text-align:right; line-height:1.9; }

  section { padding-top:64px; }
  .titulo-seccion { display:flex; align-items:baseline; gap:14px; padding-bottom:8px; border-bottom:1px solid var(--linea-fuerte); margin-bottom:26px; }
  .titulo-seccion h2 { font-family:var(--display); font-size:clamp(1.35rem,1.1rem + .9vw,1.75rem); font-weight:600; margin:0; }
  .titulo-seccion .ref { font-family:var(--dato); font-size:.72rem; color:var(--tinta-tenue); margin-left:auto; }
  section > p { max-width:68ch; color:var(--tinta-media); margin:0 0 22px; }

  .muestras { display:grid; gap:18px; }
  .muestras.dos { grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); }
  .muestras.tres { grid-template-columns:repeat(auto-fit,minmax(228px,1fr)); }
  figure { margin:0; }
  .lienzo { display:grid; place-items:center; min-height:180px; padding:26px; border:1px solid var(--linea); border-radius:3px; }
  /* Fondos fijos a proposito: demuestran la regla de uso, no siguen el tema. */
  .lienzo.claro { background:#EEF3F9; }
  .lienzo.oscuro { background:#0C1A2B; border-color:#0C1A2B; }
  .lienzo.blanco { background:#FFFFFF; }
  .lienzo img { width:100%; max-width:270px; display:block; }
  .lienzo.tres img, .muestras.tres .lienzo img { max-width:150px; }
  figcaption { font-family:var(--dato); font-size:.73rem; color:var(--tinta-tenue); padding-top:9px; line-height:1.5; }
  figcaption b { color:var(--tinta); font-weight:500; }

  .escalera { display:flex; align-items:flex-end; gap:38px; flex-wrap:wrap; padding:26px 30px; background:#0C1A2B; border-radius:3px; }
  .escalon { text-align:center; }
  .escalon span { display:block; font-family:var(--dato); font-size:.7rem; color:#8FA8C2; padding-top:10px; }

  .tabla-envoltura { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:.88rem; font-variant-numeric:tabular-nums; }
  th,td { text-align:left; padding:11px 14px 11px 0; border-bottom:1px solid var(--linea); vertical-align:top; }
  th { font-family:var(--dato); font-size:.7rem; letter-spacing:.11em; text-transform:uppercase; color:var(--tinta-tenue); font-weight:500; white-space:nowrap; }
  td.dato { font-family:var(--dato); white-space:nowrap; }
  .ficha { display:inline-block; width:15px; height:15px; border-radius:2px; vertical-align:-2px; margin-right:9px; border:1px solid rgba(0,0,0,.18); }

  .archivos { display:grid; gap:1px; background:var(--linea); border:1px solid var(--linea); border-radius:3px; overflow:hidden; }
  .archivo { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.35fr); gap:20px; background:var(--panel); padding:15px 18px; }
  .archivo code { font-family:var(--dato); font-size:.79rem; color:var(--azul); overflow-wrap:anywhere; }
  .archivo p { margin:0; font-size:.88rem; color:var(--tinta-media); }

  .aviso { border-left:3px solid var(--azul); background:var(--panel); padding:16px 20px; border-radius:0 3px 3px 0; margin-top:22px; }
  .aviso p { margin:0; font-size:.9rem; color:var(--tinta-media); max-width:none; }
  .aviso strong { color:var(--tinta); font-weight:600; }
  .aviso.rojo { border-left-color:var(--alerta); }

  footer { margin-top:80px; padding-top:22px; border-top:1px solid var(--linea); font-family:var(--dato); font-size:.75rem; color:var(--tinta-tenue); }

  @media (max-width:620px) { header.portada { grid-template-columns:1fr; align-items:start; } .version { text-align:left; } .archivo { grid-template-columns:1fr; gap:5px; } }
</style>

<div class="hoja">
  <header class="portada">
    <div>
      <div class="eyebrow">Manual de identidad</div>
      <h1>Marca SEOH DESIGN TECH</h1>
      <p class="bajada">Cómo se reproduce y se aplica la marca. Es la referencia para imprenta, papelería, firma de correo y aplicaciones digitales.</p>
    </div>
    <div class="version">Versión 2.0<br>Septiembre 2026<br>Ecuador</div>
  </header>

  <section>
    <div class="titulo-seccion"><h2>Las tres piezas</h2><span class="ref">01</span></div>
    <p>No son tres marcas distintas, son tres piezas de la misma. La regla es simple: si quien mira todavía no sabe quién eres, usa el <strong>logotipo</strong>; si ya lo sabe o no cabe el nombre, el <strong>isotipo</strong>; si es diminuto, la <strong>silueta</strong>.</p>
    <div class="muestras dos">
      <figure>
        <div class="lienzo claro"><img src="${logoClaro}" alt="Logotipo SEOH DESIGN TECH sobre fondo claro"></div>
        <figcaption><b>Logotipo</b> — símbolo más nombre. La versión por defecto: web, tarjeta, membrete, firma.</figcaption>
      </figure>
      <figure>
        <div class="lienzo claro"><img src="${marcaClaro}" alt="Isotipo: la S con el escudo" style="max-width:180px"></div>
        <figcaption><b>Isotipo</b> — solo el símbolo. Cuando el contexto ya identifica a la empresa.</figcaption>
      </figure>
    </div>
  </section>

  <section>
    <div class="titulo-seccion"><h2>Fondo claro, no oscuro</h2><span class="ref">02</span></div>
    <p>El logotipo está construido para fondos claros: la palabra <span class="dato">SEOH</span> va en grafito y sobre negro se pierde. Es la razón por la que la identidad abandonó el fondo oscuro.</p>
    <div class="muestras tres">
      <figure>
        <div class="lienzo claro"><img src="${logoClaro}" alt="Logotipo sobre el claro de marca"></div>
        <figcaption><b>Correcto</b><br>Sobre el claro de marca #EEF3F9.</figcaption>
      </figure>
      <figure>
        <div class="lienzo blanco"><img src="${logoClaro}" alt="Logotipo sobre blanco"></div>
        <figcaption><b>Correcto</b><br>Sobre blanco, en documentos e impresos.</figcaption>
      </figure>
      <figure>
        <div class="lienzo oscuro"><img src="${logoOscuro}" alt="Logotipo sobre fondo oscuro, donde el nombre pierde legibilidad"></div>
        <figcaption><b style="color:var(--alerta)">Evitar</b><br>Sobre oscuro el nombre se apaga. Si es inevitable, usar solo el isotipo.</figcaption>
      </figure>
    </div>
  </section>

  <section>
    <div class="titulo-seccion"><h2>Tamaños pequeños</h2><span class="ref">03</span></div>
    <p>Por debajo de unos 48 px el escudo, el candado y las trazas de circuito se empastan y el logotipo se convierte en una mancha. Para esos tamaños existe la silueta: <strong>la misma forma, sin modelado y a máximo contraste</strong>. Es la que se usa en favicon, bordado, grabado y cualquier impresión a una sola tinta.</p>
    <div class="escalera">
      <div class="escalon"><img src="${marcaOscuro}" alt="Isotipo a 96 píxeles" style="width:96px"><span>isotipo · 96 px</span></div>
      <div class="escalon"><img src="${marcaOscuro}" alt="Isotipo a 48 píxeles, mínimo" style="width:48px"><span>isotipo · 48 px<br>mínimo</span></div>
      <div class="escalon">${siluetaPx('#FFFFFF', 48)}<span>silueta · 48 px</span></div>
      <div class="escalon">${siluetaPx('#FFFFFF', 24)}<span>silueta · 24 px</span></div>
    </div>
    <div class="muestras tres" style="margin-top:18px">
      <figure><div class="lienzo claro">${silueta('#0057B8')}</div><figcaption><b>Azul de marca</b><br>Una tinta sobre claro.</figcaption></figure>
      <figure><div class="lienzo blanco">${silueta('#000000')}</div><figcaption><b>Negro</b><br>Sellos, facturación, fax y fotocopia.</figcaption></figure>
      <figure><div class="lienzo oscuro">${silueta('#FFFFFF')}</div><figcaption><b>Blanco</b><br>Negativo sobre oscuro y grabado.</figcaption></figure>
    </div>
  </section>

  <section>
    <div class="titulo-seccion"><h2>Color</h2><span class="ref">04</span></div>
    <p>El azul primario es el que reproduce en imprenta. El cian brillante del logotipo está fuera del gamut CMYK: en offset sale un gris azulado apagado, así que nunca se usa como tinta plana ni como color de texto en impresos.</p>
    <div class="tabla-envoltura">
      <table>
        <thead><tr><th>Color</th><th>HEX</th><th>CMYK aprox.</th><th>Pantone aprox.</th><th>Uso</th></tr></thead>
        <tbody>
          <tr><td><span class="ficha" style="background:#0057B8"></span>Azul primario</td><td class="dato">#0057B8</td><td class="dato">100 / 65 / 0 / 0</td><td class="dato">2935 C</td><td>Marca, titulares, elementos de acción.</td></tr>
          <tr><td><span class="ficha" style="background:#003B7E"></span>Azul profundo</td><td class="dato">#003B7E</td><td class="dato">100 / 78 / 18 / 5</td><td class="dato">2945 C</td><td>Textos destacados y apoyo.</td></tr>
          <tr><td><span class="ficha" style="background:#EEF3F9"></span>Claro de marca</td><td class="dato">#EEF3F9</td><td class="dato">5 / 2 / 0 / 0</td><td class="dato">—</td><td>Fondo de la web y de la papelería.</td></tr>
          <tr><td><span class="ficha" style="background:#0C1A2B"></span>Tinta</td><td class="dato">#0C1A2B</td><td class="dato">80 / 65 / 45 / 45</td><td class="dato">—</td><td>Texto. En impresión, negro rico.</td></tr>
          <tr><td><span class="ficha" style="background:#41D7FF"></span>Cian</td><td class="dato">#41D7FF</td><td class="dato">no reproducible</td><td class="dato">—</td><td><strong>Solo pantalla.</strong> Vive dentro del logotipo; nunca como tinta.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="aviso"><p><strong>Para la imprenta:</strong> los valores CMYK son de conversión y varían según papel y perfil. Si el color debe ser idéntico entre tiradas, especificar Pantone 2935 C como tinta directa y pedir prueba de color.</p></div>
  </section>

  <section>
    <div class="titulo-seccion"><h2>Qué archivo usar</h2><span class="ref">05</span></div>
    <p>Todo está en <span class="dato">identidad/</span> del repositorio de la web corporativa y se regenera con scripts. No se edita a mano: si la marca cambia, cambia la fuente y se regeneran todas las variantes a la vez.</p>
    <div class="archivos">
      <div class="archivo"><code>formatos/logotipo/…_transparente.png</code><p>Uso general. Se monta sobre cualquier fondo claro.</p></div>
      <div class="archivo"><code>formatos/logotipo/…_fondo_claro.png</code><p>Para quien no maneja transparencias, que es casi todo el mundo fuera del diseño.</p></div>
      <div class="archivo"><code>formatos/logotipo/…_fondo_blanco.jpg</code><p>Formularios y plataformas de terceros que no admiten PNG.</p></div>
      <div class="archivo"><code>formatos/marca-s/…</code><p>El símbolo sin el nombre, en las mismas medidas y acabados.</p></div>
      <div class="archivo"><code>formatos/vector-una-tinta/…svg</code><p>Sellos, grabado, vinilo, bordado. Los únicos archivos realmente escalables.</p></div>
      <div class="archivo"><code>plantillas/SEOH_membrete.docx</code><p>Hoja con membrete para cualquier documento institucional.</p></div>
      <div class="archivo"><code>plantillas/SEOH_oficio.docx</code><p>Oficio con la estructura formal completa.</p></div>
      <div class="archivo"><code>plantillas/SEOH_tarjeta_presentacion.svg</code><p>Tarjeta de 90 × 50 mm con 3 mm de sangrado, dos caras.</p></div>
      <div class="archivo"><code>plantillas/SEOH_firma_correo.html</code><p>Firma de correo compatible con Outlook y Gmail.</p></div>
    </div>
    <div class="aviso rojo"><p><strong>Límite que conviene conocer:</strong> el logotipo es una ilustración rasterizada, no un vector. Los PNG de 4K cubren cualquier impresión de tamaño razonable, pero no escalan sin fin. Para una gigantografía o un rótulo grande hay que redibujar el arte en vector. Los SVG y PDF que venían en el paquete de formatos <em>no son vectores</em>: son el mismo PNG dentro de una carcasa, y el propio archivo LEEME de ese paquete lo advierte.</p></div>
  </section>

  <section>
    <div class="titulo-seccion"><h2>Antes de mandar algo a imprenta</h2><span class="ref">06</span></div>
    <div class="archivos">
      <div class="archivo"><code>1</code><p>Convertir todo el texto a curvas.</p></div>
      <div class="archivo"><code>2</code><p>Convertir el documento a CMYK.</p></div>
      <div class="archivo"><code>3</code><p>Comprobar los 3 mm de sangrado y que ningún texto entre en los 5 mm interiores: el guillotinado tiene tolerancia.</p></div>
      <div class="archivo"><code>4</code><p>Si el color debe ser exacto entre tiradas, pedir Pantone 2935 C como tinta directa y prueba de color.</p></div>
    </div>
  </section>

  <footer>SEOH DESIGN TECH S.A. · Manual de identidad v2.0 · Las dudas sobre aplicación de la marca se resuelven contra este documento.</footer>
</div>
`;

await writeFile(SALIDA, html, 'utf8');
console.log(`  ${SALIDA}  (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
