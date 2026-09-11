/**
 * Genera el paquete de formatos de la marca para uso externo.
 *
 * Es lo que se entrega a imprentas, proveedores, prensa o a cualquiera que
 * pida "el logo". Cubre las tres situaciones que se dan en la practica:
 * transparente para montar sobre cualquier fondo, con fondo claro para quien
 * no sabe manejar transparencias, y JPG para sistemas que no admiten PNG.
 *
 * Uso: npm run formatos
 */
import sharp from 'sharp';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';

const LOGOTIPO = 'brand-src/SEOH_logo_4K_4096px_transparente.png';
const MARCA_S = 'brand-src/SEOH_S_limpia.png';
const RAIZ = 'identidad/formatos';

// Claro de marca, el mismo del sitio.
const CLARO = { r: 238, g: 243, b: 249, alpha: 1 };
const BLANCO = { r: 255, g: 255, b: 255, alpha: 1 };

const MEDIDAS = [
  ['4K', 4096],
  ['2K', 2048],
  ['HD', 1024],
  ['web', 512],
  ['mini', 256],
];

const generados = [];

async function exportar(origen, carpeta, base) {
  await mkdir(`${RAIZ}/${carpeta}`, { recursive: true });

  for (const [etiqueta, ancho] of MEDIDAS) {
    // Transparente: la version de referencia.
    const t = `${RAIZ}/${carpeta}/${base}_${etiqueta}_${ancho}px_transparente.png`;
    await sharp(origen).resize({ width: ancho }).png({ compressionLevel: 9 }).toFile(t);
    generados.push(t);

    // Sobre claro de marca, para quien no maneja transparencias.
    const c = `${RAIZ}/${carpeta}/${base}_${etiqueta}_${ancho}px_fondo_claro.png`;
    await sharp(origen)
      .resize({ width: ancho })
      .flatten({ background: CLARO })
      .png({ compressionLevel: 9 })
      .toFile(c);
    generados.push(c);
  }

  // JPG sobre blanco para sistemas que no admiten PNG (algunos gestores,
  // formularios de registro, plataformas de terceros).
  const j = `${RAIZ}/${carpeta}/${base}_2048px_fondo_blanco.jpg`;
  await sharp(origen)
    .resize({ width: 2048 })
    .flatten({ background: BLANCO })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(j);
  generados.push(j);
}

await exportar(LOGOTIPO, 'logotipo', 'SEOH_logotipo');
await exportar(MARCA_S, 'marca-s', 'SEOH_marca_S');

// --- Vectores para una sola tinta -------------------------------------------
// Salen del calco de contornos. Son los unicos archivos realmente escalables
// del paquete: el resto son rasteres, incluida la marca original.
await mkdir(`${RAIZ}/vector-una-tinta`, { recursive: true });

const { lado, trazados } = JSON.parse(await readFile('identidad/marcas/_calco.json', 'utf8'));
const P = (lista) => lista.map((d) => `<path d="${d}"/>`).join('');

const silueta = (tinta, nombre) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}" role="img" aria-label="SEOH">
  <title>SEOH — ${nombre}</title>
  <g fill="${tinta}" fill-rule="evenodd">${P(trazados.silueta)}</g>
</svg>
`;

for (const [archivo, tinta, nombre] of [
  ['SEOH_marca_S_una_tinta_azul.svg', '#0057B8', 'silueta a una tinta, azul de marca'],
  ['SEOH_marca_S_una_tinta_negro.svg', '#000000', 'silueta a una tinta, negro'],
  ['SEOH_marca_S_una_tinta_blanco.svg', '#FFFFFF', 'silueta a una tinta, blanco para negativo'],
]) {
  const ruta = `${RAIZ}/vector-una-tinta/${archivo}`;
  await writeFile(ruta, silueta(tinta, nombre), 'utf8');
  generados.push(ruta);
}

// --- Resumen ----------------------------------------------------------------
let total = 0;
for (const g of generados) total += (await stat(g)).size;
console.log(`  ${generados.length} archivos en ${RAIZ}/`);
console.log(`  peso total: ${(total / 1024 / 1024).toFixed(1)} MB`);
