/**
 * Limpia la fuente de la marca S.
 *
 * El archivo "S separada" del paquete de formatos arrastra un resto del eslogan
 * —el arranque de "Diseñamos"— pegado en la esquina inferior derecha, de cuando
 * se recorto la S del logotipo completo. Ese fragmento se cuela en la portada
 * del sitio y en los favicons.
 *
 * No se puede quitar recortando por altura: el fragmento se solapa en filas con
 * el lazo inferior de la cinta. Se borra por region, que si esta aislada.
 *
 * Uso: node scripts/limpiar-marca-s.mjs
 */
import sharp from 'sharp';

const ORIGEN = 'brand-src/SEOH_S_separada_4K_4096px_transparente.png';
const DESTINO = 'brand-src/SEOH_S_limpia.png';

// Region del fragmento, en proporcion del lienzo. Se deja margen respecto al
// lazo inferior de la cinta, que termina bastante mas arriba y a la izquierda.
const REGION = { desdeX: 0.84, desdeY: 0.87 };

const { data, info } = await sharp(ORIGEN).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: CH } = info;

const x0 = Math.floor(W * REGION.desdeX);
const y0 = Math.floor(H * REGION.desdeY);

let borrados = 0;
for (let y = y0; y < H; y++) {
  for (let x = x0; x < W; x++) {
    const i = (y * W + x) * CH + 3;
    if (data[i] > 0) {
      data[i] = 0;
      borrados++;
    }
  }
}

await sharp(data, { raw: { width: W, height: H, channels: CH } }).png().toFile(DESTINO);

console.log(`  region borrada: x>${x0} y>${y0} de ${W}x${H}`);
console.log(`  pixeles eliminados: ${borrados.toLocaleString('es')}`);
console.log(`  fuente limpia: ${DESTINO}`);
