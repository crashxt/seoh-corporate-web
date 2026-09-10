/**
 * Genera los assets de marca optimizados a partir de los logos originales.
 *
 * Los originales viven en brand-src/ y NO en public/: si estuvieran en public,
 * Vite los copiaria al build y se seguirian sirviendo los 3 MB. Traen ademas
 * el fondo negro incrustado, sin transparencia real.
 * Este script hace tres cosas con ellos:
 *
 *   1. Extrae transparencia. El logo es arte luminoso sobre negro puro, asi que
 *      el brillo de cada pixel equivale a su opacidad. Eso libera a la marca de
 *      su recuadro negro y elimina la costura al colocarla sobre el fondo.
 *   2. Recorta el aire sobrante y reescala a la medida en que se muestra.
 *   3. Emite WebP para navegadores actuales y PNG cuantizado como respaldo.
 *
 * Se conservan como fuente de verdad para poder regenerar los assets.
 *
 * Uso: npm run images
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const ORIGEN_HEADER = 'brand-src/logo-seoh-header-2x.png';
const ORIGEN_HERO = 'brand-src/logo-seoh.png';
const DESTINO = 'public/brand';

// Negro de marca, muestreado del propio logo.
const FONDO = { r: 2, g: 8, b: 20, alpha: 1 };

// Los degradados con glow no cuantizan bien: sin limitar la paleta, un PNG de
// 512px pesaba mas que el WebP del hero entero. 128 colores conservan el brillo.
const PNG_CUANTIZADO = { compressionLevel: 9, palette: true, colors: 128, effort: 10 };

const generados = [];
const registrar = async (ruta) => generados.push({ ruta, size: (await stat(ruta)).size });

/**
 * Convierte el negro incrustado en transparencia real.
 * alfa = canal mas brillante del pixel.
 */
async function conTransparencia(origen, recorte) {
  const base = recorte ? sharp(origen).extract(recorte) : sharp(origen);
  const { data, info } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = Math.max(data[i], data[i + 1], data[i + 2]);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

// El alfa de un degradado con glow es caro en WebP: con alphaQuality alto el
// archivo triplicaba su tamano sin diferencia visible sobre fondo oscuro.
const WEBP = { quality: 72, alphaQuality: 30, effort: 6 };

/**
 * Emite cada logo en dos anchos para `srcset`, de modo que un movil no
 * descargue la version de escritorio, mas un PNG de respaldo.
 */
async function emitir(fuente, nombre, anchos) {
  for (const ancho of anchos) {
    const salida = `${DESTINO}/${nombre}-${ancho}.webp`;
    await fuente.clone().resize({ width: ancho }).webp(WEBP).toFile(salida);
    await registrar(salida);
  }
  const respaldo = `${DESTINO}/${nombre}.png`;
  await fuente.clone().resize({ width: anchos.at(-1) }).png(PNG_CUANTIZADO).toFile(respaldo);
  await registrar(respaldo);
}

await mkdir(DESTINO, { recursive: true });

// --- Logo de cabecera -------------------------------------------------------
// Se muestra a 350px (280px en pantallas menores), asi que 800px cubre 2x.
const cabecera = await conTransparencia(ORIGEN_HEADER);
await emitir(cabecera, 'logo-header', [400, 800]);

// --- Logo hero --------------------------------------------------------------
// El original tiene 418px de fondo vacio en vertical; se recorta al contenido
// real (medido: x 0-1501, y 195-800) dejando un respiro proporcionado.
const RESPIRO = 36;
const hero = await conTransparencia(ORIGEN_HERO, {
  left: 0,
  top: 195 - RESPIRO,
  width: 1536,
  height: 606 + RESPIRO * 2,
});
await emitir(hero, 'logo-hero', [640, 1100]);

// --- Favicons ---------------------------------------------------------------
// Aqui el fondo si va aplanado: una pestana del navegador puede ser clara y la
// marca sobre transparencia desapareceria.
const marca = sharp(ORIGEN_HERO).extract({ left: 30, top: 230, width: 470, height: 470 });

for (const medida of [32, 192, 512]) {
  const salida = `${DESTINO}/favicon-${medida}.png`;
  await marca.clone().resize(medida, medida).flatten({ background: FONDO }).png(PNG_CUANTIZADO).toFile(salida);
  await registrar(salida);
}

const apple = `${DESTINO}/apple-touch-icon.png`;
await marca.clone().resize(180, 180).flatten({ background: FONDO }).png(PNG_CUANTIZADO).toFile(apple);
await registrar(apple);

// --- Imagen para compartir (Open Graph / Twitter) ---------------------------
// 1200x630 es la proporcion que esperan LinkedIn, WhatsApp, X y Facebook.
const heroParaOg = await hero.clone().resize({ width: 960, fit: 'inside' }).png().toBuffer();
const og = `${DESTINO}/og-image.jpg`;
await sharp({ create: { width: 1200, height: 630, channels: 4, background: FONDO } })
  .composite([{ input: heroParaOg, gravity: 'center' }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(og);
await registrar(og);

// --- Resumen ----------------------------------------------------------------
const original = (await stat(ORIGEN_HEADER)).size + (await stat(ORIGEN_HERO)).size;
const total = generados.reduce((suma, g) => suma + g.size, 0);
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

for (const g of generados) console.log(`  ${g.ruta.padEnd(36)} ${kb(g.size).padStart(10)}`);

// Lo que realmente descarga un visitante: WebP de cabecera y hero, mas favicon.
const enPagina = generados
  .filter((g) => /logo-header-800\.webp$|logo-hero-1100\.webp$|favicon-32/.test(g.ruta))
  .reduce((suma, g) => suma + g.size, 0);

console.log('');
console.log(`  originales (no publicados)           ${kb(original).padStart(10)}`);
console.log(`  generados en total                   ${kb(total).padStart(10)}`);
console.log(`  descarga en escritorio (peor caso)   ${kb(enPagina).padStart(10)}`);
console.log(`  reduccion sobre lo que se servia     ${(100 - (enPagina / original) * 100).toFixed(1)}%`);
