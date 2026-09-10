/**
 * Genera el sistema de identidad de SEOH DESIGN TECH.
 *
 * Todas las variantes salen de las mismas rutas vectoriales definidas aqui.
 * Es deliberado: si la marca se dibuja una sola vez, no puede haber versiones
 * que se contradigan entre si, que es como se degradan las identidades.
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
export const COLOR = {
  azul: '#0057B8', // primario, imprimible
  azulProfundo: '#003B7E',
  cian: '#41D7FF', // solo pantalla
  negro: '#020814',
  blanco: '#FFFFFF',
  claro: '#F4F7FB',
};

// ---------------------------------------------------------------------------
// Geometria de la marca
// ---------------------------------------------------------------------------

/** Cinta en S: dos bucles con contraformas abiertas unidos por una diagonal. */
const RUTA_S = `M 100 38
   C 100 24 84 16 63 16
   C 42 16 27 25 27 41
   C 27 55 41 62 64 68
   C 87 74 101 81 101 95
   C 101 111 86 120 65 120
   C 44 120 28 112 28 98`;

const GROSOR_S = 18;

/** Escudo con candado. Se dibuja a escala 1 y se reduce al componer. */
const escudo = (relleno, borde, candado) => `
    <path d="M 64 40 L 89 50 L 89 76 C 89 91 78 101 64 108 C 50 101 39 91 39 76 L 39 50 Z"
          fill="${relleno}" stroke="${borde}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M 56 74 v -6 a 8 8 0 0 1 16 0 v 6" fill="none" stroke="${candado}" stroke-width="5"/>
    <rect x="52" y="73" width="24" height="19" rx="3.5" fill="${candado}"/>
    <circle cx="64" cy="81" r="2.8" fill="${relleno}"/>`;

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

// ---------------------------------------------------------------------------
// Composicion
// ---------------------------------------------------------------------------

const envolver = (ancho, alto, titulo, contenido) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-label="SEOH DESIGN TECH">
  <title>${titulo}</title>${contenido}
</svg>
`;

/**
 * Isotipo.
 * @param modo 'color' | 'mono' | 'negativo'
 * @param conEscudo false produce la version reducida, legible por debajo de 32 px.
 */
function isotipo(modo, conEscudo = true) {
  const tinta = modo === 'negativo' ? COLOR.blanco : modo === 'mono' ? COLOR.azul : COLOR.azul;
  // A una tinta el escudo no puede depender del contraste entre dos colores:
  // se invierte el relleno para que el candado siga leyendose.
  const partes = [
    `\n  <path d="${RUTA_S}" fill="none" stroke="${tinta}" stroke-width="${GROSOR_S}" stroke-linecap="butt"/>`,
  ];

  if (conEscudo) {
    const contenidoEscudo =
      modo === 'color'
        ? escudo(COLOR.negro, COLOR.cian, COLOR.blanco)
        : modo === 'negativo'
          ? escudo(COLOR.negro, COLOR.blanco, COLOR.blanco)
          : escudo(COLOR.blanco, tinta, tinta);
    partes.push(
      `\n  <g transform="translate(70 69) scale(0.74) translate(-64 -68)">${contenidoEscudo}\n  </g>`,
    );
  }

  const nombre = conEscudo ? 'isotipo' : 'isotipo reducido';
  return envolver(128, 128, `SEOH — ${nombre} (${modo})`, partes.join(''));
}

/** Logotipo horizontal: isotipo a la izquierda, nombre a la derecha. */
function horizontal(modo, conDescriptor) {
  const tinta = modo === 'negativo' ? COLOR.blanco : COLOR.azul;
  const contenidoEscudo =
    modo === 'color'
      ? escudo(COLOR.negro, COLOR.cian, COLOR.blanco)
      : modo === 'negativo'
        ? escudo(COLOR.negro, COLOR.blanco, COLOR.blanco)
        : escudo(COLOR.blanco, tinta, tinta);

  // El area de resguardo equivale a la altura de la S dividida entre dos.
  const contenido = `
  <g transform="translate(8 8)">
    <path d="${RUTA_S}" fill="none" stroke="${tinta}" stroke-width="${GROSOR_S}" stroke-linecap="butt"/>
    <g transform="translate(70 69) scale(0.74) translate(-64 -68)">${contenidoEscudo}
    </g>
  </g>
  <g transform="translate(176 22) scale(0.78)" fill="${tinta}">${LETRAS_SEOH}
  </g>${conDescriptor ? descriptor(modo === 'negativo' ? COLOR.claro : COLOR.azulProfundo, 178, 122, 16) : ''}`;

  return envolver(
    conDescriptor ? 480 : 470,
    conDescriptor ? 144 : 144,
    `SEOH DESIGN TECH — logotipo horizontal (${modo})`,
    contenido,
  );
}

/** Logotipo apilado: para formatos verticales y avatares cuadrados. */
function apilado(modo) {
  const tinta = modo === 'negativo' ? COLOR.blanco : COLOR.azul;
  const contenidoEscudo =
    modo === 'color'
      ? escudo(COLOR.negro, COLOR.cian, COLOR.blanco)
      : modo === 'negativo'
        ? escudo(COLOR.negro, COLOR.blanco, COLOR.blanco)
        : escudo(COLOR.blanco, tinta, tinta);

  const contenido = `
  <g transform="translate(112 8)">
    <path d="${RUTA_S}" fill="none" stroke="${tinta}" stroke-width="${GROSOR_S}" stroke-linecap="butt"/>
    <g transform="translate(70 69) scale(0.74) translate(-64 -68)">${contenidoEscudo}
    </g>
  </g>
  <g transform="translate(60 158) scale(0.63)" fill="${tinta}">${LETRAS_SEOH}
  </g>${descriptor(modo === 'negativo' ? COLOR.claro : COLOR.azulProfundo, 63, 248, 14)}`;

  return envolver(352, 272, `SEOH DESIGN TECH — logotipo apilado (${modo})`, contenido);
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

// Exportaciones PNG para quien no pueda abrir un SVG (ofimatica, redes).
const PNG = 'identidad/marcas/png';
await mkdir(PNG, { recursive: true });

const exportaciones = [
  ['logotipo-horizontal-color.svg', 'logotipo-horizontal', 1200],
  ['logotipo-horizontal-negativo.svg', 'logotipo-horizontal-negativo', 1200],
  ['isotipo-color.svg', 'isotipo', 512],
  ['isotipo-reducido-color.svg', 'isotipo-reducido', 512],
];

for (const [origen, nombre, ancho] of exportaciones) {
  await sharp(Buffer.from(ARCHIVOS[origen]), { density: 600 })
    .resize({ width: ancho })
    .png({ compressionLevel: 9 })
    .toFile(`${PNG}/${nombre}.png`);
}

console.log(`  ${Object.keys(ARCHIVOS).length} variantes SVG en ${DESTINO}/`);
console.log(`  ${exportaciones.length} exportaciones PNG en ${PNG}/`);

// ---------------------------------------------------------------------------
// Iconos de aplicacion
// ---------------------------------------------------------------------------
// El favicon usa la version reducida: a 32 px el escudo y el candado se
// empastan y solo se distingue una mancha. La S sola si se reconoce.
const ICONOS = 'public/brand';
await mkdir(ICONOS, { recursive: true });

const iconoCuadrado = (contenido, fondo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect width="160" height="160" rx="34" fill="${fondo}"/>
  <g transform="translate(16 16)">${contenido}</g>
</svg>`;

// El SVG del favicon lleva la S en blanco sobre el negro de marca.
const svgFavicon = iconoCuadrado(
  `<svg viewBox="0 0 128 128" width="128" height="128" x="0" y="0"><path d="${RUTA_S}" fill="none" stroke="${COLOR.blanco}" stroke-width="${GROSOR_S}" stroke-linecap="butt"/></svg>`,
  COLOR.negro,
);
await writeFile(`${ICONOS}/favicon.svg`, svgFavicon, 'utf8');

for (const medida of [32, 192, 512]) {
  await sharp(Buffer.from(svgFavicon), { density: 600 })
    .resize(medida, medida)
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${ICONOS}/favicon-${medida}.png`);
}
await sharp(Buffer.from(svgFavicon), { density: 600 })
  .resize(180, 180)
  .png({ compressionLevel: 9, palette: true })
  .toFile(`${ICONOS}/apple-touch-icon.png`);

// Avatar cuadrado para redes y perfiles: aqui si cabe el logotipo apilado.
await sharp(Buffer.from(ARCHIVOS['logotipo-apilado-negativo.svg']), { density: 600 })
  .resize(700, 700, { fit: 'contain', background: { r: 2, g: 8, b: 20, alpha: 1 } })
  .flatten({ background: { r: 2, g: 8, b: 20, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toFile('identidad/aplicaciones/avatar-redes.png');

console.log('  iconos de aplicacion en public/brand/');
console.log('  avatar de redes en identidad/aplicaciones/');
