/**
 * Genera los assets de marca que sirve el sitio.
 *
 * Las fuentes son los PNG 4K del paquete de formatos, que traen transparencia
 * real. La version anterior partia de un PNG con el fondo negro incrustado y
 * habia que deducir el alfa a partir del brillo de cada pixel: una
 * aproximacion que ya no hace falta.
 *
 * Importante sobre estas dos fuentes: el logotipo completo esta preparado para
 * FONDO CLARO —"SEOH" va en grafito y se pierde sobre negro—, que es
 * justamente lo que necesita el sitio.
 *
 * Uso: npm run images
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const LOGOTIPO = 'brand-src/SEOH_logo_4K_4096px_transparente.png';
// Fuente ya saneada: la del paquete arrastra un resto del eslogan pegado en la
// esquina inferior derecha. Se genera con scripts/limpiar-marca-s.mjs.
const MARCA_S = 'brand-src/SEOH_S_limpia.png';
const DESTINO = 'public/brand';

// Fondo de marca para los iconos, que necesitan una superficie opaca.
const FONDO_ICONO = { r: 12, g: 26, b: 43, alpha: 1 };

const PNG_CUANTIZADO = { compressionLevel: 9, palette: true, colors: 128, effort: 10 };
// El alfa de un degradado con glow es caro en WebP: con alphaQuality alto el
// archivo se triplicaba sin diferencia visible.
const WEBP = { quality: 74, alphaQuality: 40, effort: 6 };

const generados = [];
const registrar = async (ruta) => generados.push({ ruta, size: (await stat(ruta)).size });

/** Emite dos anchos para `srcset` mas un PNG de respaldo. */
async function emitir(origen, nombre, anchos) {
  for (const ancho of anchos) {
    const salida = `${DESTINO}/${nombre}-${ancho}.webp`;
    await sharp(origen).resize({ width: ancho }).webp(WEBP).toFile(salida);
    await registrar(salida);
  }
  const respaldo = `${DESTINO}/${nombre}.png`;
  await sharp(origen).resize({ width: anchos.at(-1) }).png(PNG_CUANTIZADO).toFile(respaldo);
  await registrar(respaldo);
}

await mkdir(DESTINO, { recursive: true });

// Logotipo de cabecera.
//
// La fuente trae el lema incrustado en su franja inferior, que a 300 px de
// ancho es un borron ilegible. Se recorta: el lema vive ahora como texto real
// en la portada, donde escala y lo leen buscadores y lectores de pantalla.
const ALTO_SIN_LEMA = 0.84;
const metaLogotipo = await sharp(LOGOTIPO).metadata();
const cabecera = await sharp(LOGOTIPO)
  .extract({
    left: 0,
    top: 0,
    width: metaLogotipo.width,
    height: Math.round(metaLogotipo.height * ALTO_SIN_LEMA),
  })
  .png()
  .toBuffer();

await emitir(cabecera, 'logo-header', [400, 800]);

// Marca S para la portada. El nombre ya esta en la cabecera, asi que el heroe
// lleva solo el simbolo y el lema pasa a ser texto real de la pagina.
await emitir(MARCA_S, 'logo-hero', [420, 760]);

// --- Iconos de navegador ----------------------------------------------------
for (const medida of [32, 192, 512]) {
  const salida = `${DESTINO}/favicon-${medida}.png`;
  await sharp(MARCA_S)
    .resize(medida, medida, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: FONDO_ICONO })
    .png(PNG_CUANTIZADO)
    .toFile(salida);
  await registrar(salida);
}

const apple = `${DESTINO}/apple-touch-icon.png`;
await sharp(MARCA_S)
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .flatten({ background: FONDO_ICONO })
  .png(PNG_CUANTIZADO)
  .toFile(apple);
await registrar(apple);

// --- Marca para la firma de correo -----------------------------------------
const firma = `${DESTINO}/firma-marca.png`;
await sharp(MARCA_S)
  .resize(240, 240, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png(PNG_CUANTIZADO)
  .toFile(firma);
await registrar(firma);

// --- Imagen para compartir (Open Graph / Twitter) --------------------------
// 1200x630 es la proporcion que esperan LinkedIn, WhatsApp, X y Facebook.
const FONDO_OG = { r: 238, g: 243, b: 249, alpha: 1 };
const logoOg = await sharp(LOGOTIPO).resize({ width: 940, fit: 'inside' }).png().toBuffer();
const og = `${DESTINO}/og-image.jpg`;
await sharp({ create: { width: 1200, height: 630, channels: 4, background: FONDO_OG } })
  .composite([{ input: logoOg, gravity: 'center' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(og);
await registrar(og);

// --- Resumen ----------------------------------------------------------------
const original = (await stat(LOGOTIPO)).size + (await stat(MARCA_S)).size;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

for (const g of generados) console.log(`  ${g.ruta.padEnd(36)} ${kb(g.size).padStart(10)}`);

const enPagina = generados
  .filter((g) => /logo-header-800\.webp$|logo-hero-760\.webp$|favicon-32/.test(g.ruta))
  .reduce((suma, g) => suma + g.size, 0);

console.log('');
console.log(`  fuentes 4K (no publicadas)           ${kb(original).padStart(10)}`);
console.log(`  descarga en escritorio (peor caso)   ${kb(enPagina).padStart(10)}`);
