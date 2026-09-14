/**
 * Comprueba que los assets de marca publicados correspondan al script que los
 * genera.
 *
 * QUE PROBLEMA RESUELVE
 * Los archivos de public/brand se producen con scripts. Si alguien edita un
 * script y olvida regenerar, el sitio publica una version antigua del logotipo
 * sin que nadie lo note.
 *
 * POR QUE NO SE COMPARAN LOS BYTES
 * La comprobacion anterior era `git status --porcelain public/brand` despues de
 * regenerar, y fallaba en integracion continua aunque nada estuviera mal:
 * favicon-192.png es un PNG de paleta, y libimagequant no produce los mismos
 * bytes compilado en Windows que compilado en Ubuntu. Mismo tamano, misma
 * imagen, bytes distintos.
 *
 * Un asset olvidado no se diferencia en unos bytes: cambia de dimensiones o de
 * peso de forma evidente. Asi que se comparan dimensiones y peso con una
 * tolerancia, que es lo que de verdad distingue "esta desactualizado" de
 * "lo comprimio otra maquina".
 */
import { spawnSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import sharp from 'sharp';

const DIRECTORIO = 'public/brand';

/** Por encima de esto, el archivo cambio de verdad y no por el compresor. */
const TOLERANCIA = 0.03;

/**
 * Se lee a buffer y no por ruta a proposito: sharp deja abierto el archivo que
 * abre por ruta, y en Windows eso impide que el generador lo reescriba despues.
 */
async function inventario() {
  const salida = new Map();
  for (const archivo of await readdir(DIRECTORIO)) {
    const contenido = await readFile(`${DIRECTORIO}/${archivo}`);
    let dimensiones;
    try {
      const meta = await sharp(contenido).metadata();
      dimensiones = `${meta.width}x${meta.height}`;
    } catch {
      dimensiones = 'no-imagen'; // el SVG y cualquier otro formato no rasterizado
    }
    salida.set(archivo, { size: contenido.length, dimensiones });
  }
  return salida;
}

const antes = await inventario();

const ejecucion = spawnSync('node', ['scripts/optimize-images.mjs'], { stdio: 'inherit' });
if (ejecucion.status !== 0) {
  console.error('\n  El script de imagenes fallo. No se puede comprobar nada.\n');
  process.exit(1);
}

const despues = await inventario();

const problemas = [];

for (const [archivo, nuevo] of despues) {
  const viejo = antes.get(archivo);

  if (!viejo) {
    problemas.push(`${archivo}: el script produce un archivo que no esta publicado`);
    continue;
  }

  if (viejo.dimensiones !== nuevo.dimensiones) {
    problemas.push(
      `${archivo}: dimensiones ${viejo.dimensiones} publicadas frente a ${nuevo.dimensiones} generadas`,
    );
    continue;
  }

  const desvio = Math.abs(nuevo.size - viejo.size) / viejo.size;
  if (desvio > TOLERANCIA) {
    problemas.push(
      `${archivo}: ${viejo.size} bytes publicados frente a ${nuevo.size} generados ` +
        `(${(desvio * 100).toFixed(1)}% de diferencia)`,
    );
  }
}

for (const archivo of antes.keys()) {
  if (!despues.has(archivo)) problemas.push(`${archivo}: publicado pero el script ya no lo produce`);
}

if (problemas.length > 0) {
  console.error('');
  for (const problema of problemas) console.error(`::error::${problema}`);
  console.error('\n  Ejecute "npm run images" y confirme el resultado.\n');
  process.exit(1);
}

console.log(`\n  ${despues.size} assets de marca al dia.\n`);
