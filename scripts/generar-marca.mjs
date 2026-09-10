/**
 * Genera el sistema de identidad de SEOH DESIGN TECH.
 *
 * Todas las variantes salen de la misma geometria definida aqui. Es
 * deliberado: si la marca se dibuja una sola vez, no puede haber versiones que
 * se contradigan entre si, que es como se degradan las identidades.
 *
 * La version a color lleva volumen —degradado, filo de luz y pliegue— porque es
 * la que tiene que causar impacto. Las versiones monocroma y reducida usan la
 * MISMA silueta, solo que plana: se simplifican por exigencia del soporte (una
 * tinta, 16 px, bordado), no porque la marca sea plana.
 *
 * Uso: npm run marca
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// ---------------------------------------------------------------------------
// Paleta
// ---------------------------------------------------------------------------
// El cian original (#41d7ff) esta fuera del gamut CMYK: en offset sale gris
// azulado. Por eso el primario es un azul que si se imprime, y el cian queda
// como acento exclusivo de pantalla.
const COLOR = {
  azul: '#0057B8', // primario, imprimible
  azulProfundo: '#003B7E',
  cian: '#41D7FF', // solo pantalla
  negro: '#020814',
  blanco: '#FFFFFF',
  claro: '#F4F7FB',
};

// ---------------------------------------------------------------------------
// Geometria de la cinta. El isotipo vive en un lienzo de 150 x 136.
// ---------------------------------------------------------------------------

/** Bucle inferior de la cinta. En el cruce pasa por detras. */
const BUCLE_BAJO = `M 118 92 C 118 77 103 69 84 65 L 70 62 L 76 83 L 86 85
   C 96 87 100 90 100 94 C 100 100 93 104 82 104 L 32 104 L 36 122 L 84 122
   C 107 122 118 110 118 92 Z`;

/** Bucle superior, por delante del cruce. */
const BUCLE_ALTO = `M 124 44 C 124 24 107 11 84 11 C 59 11 43 24 43 43
   C 43 58 53 66 73 71 L 88 75 L 82 54 L 70 51 C 63 49 61 47 61 43
   C 61 37 69 33 84 33 C 96 33 105 37 106 44 Z`;

/** Canto donde la cinta gira y asoma el reverso. Solo en la version a color. */
const PLIEGUE = `M 82 54 L 88 75 L 76 83 L 70 62 Z`;

/** Pixeles y trazas: la cinta se desintegra por la izquierda. */
const motivo = (tinta, conOpacidad) => `
    <g fill="${tinta}">
      <rect x="6" y="50" width="9" height="9" rx="1.5"${conOpacidad ? ' opacity="0.95"' : ''}/>
      <rect x="19" y="42" width="6.5" height="6.5" rx="1.2"${conOpacidad ? ' opacity="0.7"' : ''}/>
      <rect x="4" y="67" width="6" height="6" rx="1.2"${conOpacidad ? ' opacity="0.55"' : ''}/>
      <rect x="17" y="58" width="11" height="11" rx="1.8"/>
    </g>
    <g stroke="${tinta}" stroke-width="2" fill="none"${conOpacidad ? ' opacity="0.8"' : ''}>
      <path d="M 12 80 h 14 l 6 6 h 12"/>
      <path d="M 8 89 h 10 l 6 6 h 16"/>
    </g>
    <g fill="${tinta}">
      <circle cx="47" cy="86" r="3"/>
      <circle cx="51" cy="95" r="3"/>
    </g>`;

/** Escudo con candado, sobre el cruce de la cinta. */
const escudo = (relleno, borde, candado) => `
      <path d="M 64 40 L 89 50 L 89 76 C 89 91 78 101 64 108 C 50 101 39 91 39 76 L 39 50 Z"
            fill="${relleno}" stroke="${borde}" stroke-width="5.5" stroke-linejoin="round"/>
      <path d="M 56 74 v -6 a 8 8 0 0 1 16 0 v 6" fill="none" stroke="${candado}" stroke-width="5"/>
      <rect x="52" y="73" width="24" height="19" rx="3.5" fill="${candado}"/>
      <circle cx="64" cy="81" r="2.8" fill="${relleno}"/>`;

const DEGRADADOS = `
  <defs>
    <linearGradient id="cara" x1="0.15" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#7FD1FF"/><stop offset="0.38" stop-color="#1B93EE"/><stop offset="1" stop-color="#004399"/>
    </linearGradient>
    <linearGradient id="caraBaja" x1="0.2" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="#0C74CE"/><stop offset="1" stop-color="#002E7E"/>
    </linearGradient>
    <linearGradient id="filo" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#BFE9FF"/><stop offset="0.55" stop-color="#7FD1FF" stop-opacity="0.5"/><stop offset="1" stop-color="#7FD1FF" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

/**
 * Cuerpo de la cinta.
 * @param modo 'color' produce volumen; 'mono' y 'negativo' dan la silueta plana.
 */
function cinta(modo) {
  if (modo === 'color') {
    return `
    ${motivo('#2E9EFF', true)}
    <path fill="url(#caraBaja)" d="${BUCLE_BAJO}"/>
    <path fill="none" stroke="#00112E" stroke-width="5" opacity="0.55"
          d="M 60 44 C 60 52 66 56 76 58 L 92 62 L 88 80"/>
    <path fill="url(#cara)" d="${BUCLE_ALTO}"/>
    <path fill="none" stroke="url(#filo)" stroke-width="2.6" stroke-linecap="round"
          d="M 121 42 C 120 26 105 15 84 15 C 62 15 47 27 47 43"/>
    <path fill="#001C4A" opacity="0.6" d="${PLIEGUE}"/>`;
  }

  // Silueta plana: la misma forma, sin modelado ni marca de cruce. A una tinta
  // el corte que separa las dos bandas parte la S en dos trozos sueltos; los
  // bucles se dejan fundir en una sola pieza, que es lo que se lee.
  const tinta = modo === 'negativo' ? COLOR.blanco : COLOR.azul;
  return `
    ${motivo(tinta, false)}
    <path fill="${tinta}" d="${BUCLE_BAJO}"/>
    <path fill="${tinta}" d="${BUCLE_ALTO}"/>
    <path fill="${tinta}" d="${PLIEGUE}"/>`;
}

/** Letras SEOH dibujadas como vectores: un logotipo no depende de fuentes. */
const LETRAS_SEOH = `
    <path d="M 74 30 C 74 12 60 2 39 2 C 18 2 4 13 4 30 C 4 45 17 51 39 55 C 55 58 58 61 58 67 C 58 74 51 79 39 79 C 26 79 20 74 20 64 L 0 64 C 0 87 15 99 39 99 C 63 99 78 87 78 68 C 78 51 65 45 42 41 C 27 38 24 35 24 30 C 24 23 30 19 39 19 C 50 19 55 23 55 30 Z"/>
    <path d="M 96 3 h 66 v 19 h -46 v 19 h 42 v 19 h -42 v 19 h 47 v 19 h -67 z"/>
    <path fill-rule="evenodd" d="M 222 1 c 26 0 44 20 44 50 c 0 30 -18 50 -44 50 c -26 0 -44 -20 -44 -50 c 0 -30 18 -50 44 -50 z M 222 21 c -14 0 -23 12 -23 30 c 0 18 9 30 23 30 c 14 0 23 -12 23 -30 c 0 -18 -9 -30 -23 -30 z"/>
    <path d="M 286 3 h 20 v 38 h 44 v -38 h 20 v 95 h -20 v -38 h -44 v 38 h -20 z"/>`;

/**
 * Descriptor "DESIGN TECH".
 *
 * Va como texto, no como trazado. Para pantalla y ofimatica es correcto; antes
 * de enviar a imprenta hay que convertirlo a curvas con la tipografia elegida.
 * Por eso el archivo primario de impresion es el que no lo lleva.
 */
const descriptor = (color, x, y, tamano) => `
  <text x="${x}" y="${y}" fill="${color}" font-family="'Segoe UI', system-ui, Arial, sans-serif"
        font-size="${tamano}" font-weight="600" letter-spacing="${tamano * 0.42}">DESIGN TECH</text>`;

const escudoDe = (modo) =>
  modo === 'color'
    ? escudo(COLOR.negro, COLOR.cian, COLOR.blanco)
    : modo === 'negativo'
      ? escudo(COLOR.negro, COLOR.blanco, COLOR.blanco)
      : escudo(COLOR.blanco, COLOR.azul, COLOR.azul);

const envolver = (ancho, alto, titulo, contenido) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-label="SEOH DESIGN TECH">
  <title>${titulo}</title>${contenido}
</svg>
`;

// ---------------------------------------------------------------------------
// Composicion
// ---------------------------------------------------------------------------

/** @param conEscudo false produce la version reducida, legible bajo 40 px. */
function isotipo(modo, conEscudo = true) {
  const contenido = `${modo === 'color' ? DEGRADADOS : ''}
    ${cinta(modo)}${
      conEscudo
        ? `
    <g transform="translate(84 77) scale(0.64) translate(-64 -68)">${escudoDe(modo)}
    </g>`
        : ''
    }`;
  return envolver(
    150,
    136,
    `SEOH — ${conEscudo ? 'isotipo' : 'isotipo reducido'} (${modo})`,
    contenido,
  );
}

function horizontal(modo, conDescriptor) {
  const tintaLetras = modo === 'negativo' ? COLOR.blanco : COLOR.azul;
  const contenido = `${modo === 'color' ? DEGRADADOS : ''}
  <g transform="translate(6 4)">
    ${cinta(modo)}
    <g transform="translate(84 77) scale(0.64) translate(-64 -68)">${escudoDe(modo)}
    </g>
  </g>
  <g transform="translate(184 26) scale(0.8)" fill="${tintaLetras}">${LETRAS_SEOH}
  </g>${conDescriptor ? descriptor(modo === 'negativo' ? COLOR.claro : COLOR.azulProfundo, 186, 128, 16) : ''}`;
  return envolver(500, 150, `SEOH DESIGN TECH — logotipo horizontal (${modo})`, contenido);
}

function apilado(modo) {
  const tintaLetras = modo === 'negativo' ? COLOR.blanco : COLOR.azul;
  const contenido = `${modo === 'color' ? DEGRADADOS : ''}
  <g transform="translate(101 4)">
    ${cinta(modo)}
    <g transform="translate(84 77) scale(0.64) translate(-64 -68)">${escudoDe(modo)}
    </g>
  </g>
  <g transform="translate(60 168) scale(0.63)" fill="${tintaLetras}">${LETRAS_SEOH}
  </g>${descriptor(modo === 'negativo' ? COLOR.claro : COLOR.azulProfundo, 63, 258, 14)}`;
  return envolver(352, 282, `SEOH DESIGN TECH — logotipo apilado (${modo})`, contenido);
}

// ---------------------------------------------------------------------------

const DESTINO = 'identidad/marcas';
await mkdir(DESTINO, { recursive: true });

const ARCHIVOS = {
  'isotipo-color.svg': isotipo('color'),
  'isotipo-mono.svg': isotipo('mono'),
  'isotipo-negativo.svg': isotipo('negativo'),
  'isotipo-reducido-color.svg': isotipo('color', false),
  'isotipo-reducido-mono.svg': isotipo('mono', false),
  'isotipo-reducido-negativo.svg': isotipo('negativo', false),
  'logotipo-horizontal-color.svg': horizontal('color', true),
  'logotipo-horizontal-mono.svg': horizontal('mono', true),
  'logotipo-horizontal-negativo.svg': horizontal('negativo', true),
  'logotipo-horizontal-imprenta.svg': horizontal('mono', false),
  'logotipo-apilado-color.svg': apilado('color'),
  'logotipo-apilado-negativo.svg': apilado('negativo'),
};

for (const [nombre, contenido] of Object.entries(ARCHIVOS)) {
  await writeFile(`${DESTINO}/${nombre}`, contenido, 'utf8');
}

const PNG = `${DESTINO}/png`;
await mkdir(PNG, { recursive: true });

for (const [origen, nombre, ancho] of [
  ['logotipo-horizontal-color.svg', 'logotipo-horizontal', 1200],
  ['logotipo-horizontal-negativo.svg', 'logotipo-horizontal-negativo', 1200],
  ['isotipo-color.svg', 'isotipo', 512],
  ['isotipo-reducido-color.svg', 'isotipo-reducido', 512],
]) {
  await sharp(Buffer.from(ARCHIVOS[origen]), { density: 600 })
    .resize({ width: ancho })
    .png({ compressionLevel: 9 })
    .toFile(`${PNG}/${nombre}.png`);
}

// ---------------------------------------------------------------------------
// Iconos de aplicacion
// ---------------------------------------------------------------------------
// El favicon usa la version reducida y sin motivo de pixeles: a 32 px las
// trazas desaparecen y solo ensucian. La cinta si se reconoce.
const ICONOS = 'public/brand';
await mkdir(ICONOS, { recursive: true });

const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 166" width="180" height="166">
  <rect width="180" height="166" rx="34" fill="${COLOR.negro}"/>
  <g transform="translate(18 14)">
    <path fill="${COLOR.blanco}" d="${BUCLE_BAJO}"/>
    <path fill="none" stroke="${COLOR.negro}" stroke-width="3.5" d="M 61 45 C 62 53 68 57 78 59 L 92 63"/>
    <path fill="${COLOR.blanco}" d="${BUCLE_ALTO}"/>
  </g>
</svg>`;
await writeFile(`${ICONOS}/favicon.svg`, svgFavicon, 'utf8');

const FONDO_ICONO = { r: 2, g: 8, b: 20, alpha: 1 };
for (const medida of [32, 192, 512]) {
  await sharp(Buffer.from(svgFavicon), { density: 600 })
    .resize(medida, medida, { fit: 'contain', background: FONDO_ICONO })
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${ICONOS}/favicon-${medida}.png`);
}
await sharp(Buffer.from(svgFavicon), { density: 600 })
  .resize(180, 180, { fit: 'contain', background: FONDO_ICONO })
  .png({ compressionLevel: 9, palette: true })
  .toFile(`${ICONOS}/apple-touch-icon.png`);

// Marca para la firma de correo: azul sobre blanco, que es como se lee un correo.
await sharp(Buffer.from(ARCHIVOS['isotipo-mono.svg']), { density: 600 })
  .resize(240, 240, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(`${ICONOS}/firma-marca.png`);

await mkdir('identidad/aplicaciones', { recursive: true });
await sharp(Buffer.from(ARCHIVOS['logotipo-apilado-color.svg']), { density: 600 })
  .resize(700, 700, { fit: 'contain', background: FONDO_ICONO })
  .flatten({ background: FONDO_ICONO })
  .png({ compressionLevel: 9 })
  .toFile('identidad/aplicaciones/avatar-redes.png');

console.log(`  ${Object.keys(ARCHIVOS).length} variantes SVG en ${DESTINO}/`);
console.log('  exportaciones PNG, iconos de navegador y avatar de redes');
