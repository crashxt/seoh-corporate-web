/**
 * Calca la marca original a vector.
 *
 * No redibuja ni reinterpreta: extrae los contornos reales del PNG y los
 * convierte en trazados. El resultado es la forma exacta de la S de SEOH —con
 * su giro y su pliegue— pero escalable, imprimible y utilizable a una tinta.
 *
 * El procedimiento:
 *   1. Se separa la imagen en capas por color (cinta, escudo, candado, motivo),
 *      porque cada una necesita su propia tinta en las variantes.
 *   2. Marching squares saca los contornos de cada capa con interpolacion
 *      lineal, que suaviza el dentado del pixel.
 *   3. Ramer-Douglas-Peucker reduce los miles de puntos a los que definen la
 *      forma.
 *   4. Catmull-Rom convierte esa poligonal en curvas cubicas.
 *
 * Uso: node scripts/calcar-marca.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const ORIGEN = 'brand-src/seoh-s-mark-original.png';

// Lienzo de destino. La marca original es cuadrada; se normaliza a 150 de lado.
const LADO = 150;

/** Tolerancia de simplificacion, en pixeles del original. */
const TOLERANCIA = 1.1;

// ---------------------------------------------------------------------------
// 1. Separacion por capas
// ---------------------------------------------------------------------------

const { data, info } = await sharp(ORIGEN)
  .resize({ width: 700 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: CH } = info;

const leer = (x, y) => {
  const i = (y * W + x) * CH;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
};

const idx = (x, y) => y * W + x;

const opaco = new Uint8Array(W * H);
const blanco = new Uint8Array(W * H);
const oscuro = new Uint8Array(W * H);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = leer(x, y);
    if (p.a < 110) continue;
    opaco[idx(x, y)] = 1;
    const luz = (p.r + p.g + p.b) / 3;
    if (luz > 190 && p.b - p.r < 90) blanco[idx(x, y)] = 1;
    else if (luz < 62) oscuro[idx(x, y)] = 1;
  }
}

/**
 * Aisla el escudo.
 *
 * Clasificar por oscuridad no sirve: la cinta tiene sombras tan oscuras como el
 * interior del escudo y salian manchas negras sobre la S. El escudo si es una
 * region conexa que rodea al candado y termina en su filo claro, asi que se
 * obtiene inundando desde el candado hacia fuera sin salir de lo oscuro.
 */
function aislarEscudo() {
  // Centro del candado: el blanco mas compacto de la marca.
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (blanco[idx(x, y)]) {
        sx += x;
        sy += y;
        n++;
      }
    }
  }
  if (n === 0) return new Uint8Array(W * H);

  const cx = Math.round(sx / n);
  const cy = Math.round(sy / n);

  // Se inunda por lo oscuro y por el propio candado, partiendo de su centro.
  const escudo = new Uint8Array(W * H);
  const pila = [[cx, cy]];
  const admisible = (x, y) => oscuro[idx(x, y)] === 1 || blanco[idx(x, y)] === 1;

  while (pila.length > 0) {
    const [x, y] = pila.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const i = idx(x, y);
    if (escudo[i] || !admisible(x, y)) continue;
    escudo[i] = 1;
    pila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return escudo;
}

const escudoMask = aislarEscudo();

// La cinta es todo lo opaco que no sea escudo ni candado.
const capas = {
  cinta: new Uint8Array(W * H),
  escudo: escudoMask,
  candado: new Uint8Array(W * H),
};
const silueta = new Uint8Array(W * H);

for (let i = 0; i < W * H; i++) {
  if (!opaco[i]) continue;
  silueta[i] = 1;
  if (blanco[i] && escudoMask[i]) capas.candado[i] = 1;
  else if (!escudoMask[i]) capas.cinta[i] = 1;
}

// ---------------------------------------------------------------------------
// 2. Marching squares
// ---------------------------------------------------------------------------

/**
 * Extrae los contornos cerrados de una mascara binaria siguiendo las aristas
 * entre pixel lleno y pixel vacio.
 *
 * Cada pixel lleno aporta una arista dirigida por cada lado que da al vacio,
 * todas orientadas en el mismo sentido de giro. Encadenando final con principio
 * salen los anillos cerrados, y el metodo termina siempre porque el numero de
 * aristas es finito y cada una se consume una sola vez.
 */
function contornos(mascara) {
  const lleno = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : mascara[y * W + x]);
  const clave = (x, y) => y * (W + 1) + x;

  // Aristas indexadas por su punto de partida.
  const desde = new Map();
  const anadir = (x1, y1, x2, y2) => {
    const k = clave(x1, y1);
    if (!desde.has(k)) desde.set(k, []);
    desde.get(k).push([x2, y2]);
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!lleno(x, y)) continue;
      if (!lleno(x, y - 1)) anadir(x + 1, y, x, y); // borde superior
      if (!lleno(x + 1, y)) anadir(x + 1, y + 1, x + 1, y); // borde derecho
      if (!lleno(x, y + 1)) anadir(x, y + 1, x + 1, y + 1); // borde inferior
      if (!lleno(x - 1, y)) anadir(x, y, x, y + 1); // borde izquierdo
    }
  }

  const anillos = [];
  for (const [k, salidas] of desde) {
    while (salidas.length > 0) {
      const inicio = [k % (W + 1), Math.floor(k / (W + 1))];
      let actual = salidas.pop();
      const anillo = [inicio];

      while (actual[0] !== inicio[0] || actual[1] !== inicio[1]) {
        anillo.push(actual);
        const siguientes = desde.get(clave(actual[0], actual[1]));
        if (!siguientes || siguientes.length === 0) break; // cadena abierta
        actual = siguientes.pop();
      }

      if (anillo.length > 12) anillos.push(anillo);
    }
  }
  return anillos;
}

// ---------------------------------------------------------------------------
// 3. Simplificacion
// ---------------------------------------------------------------------------

/** Ramer-Douglas-Peucker sobre una poligonal cerrada. */
function simplificar(puntos, tolerancia) {
  if (puntos.length < 4) return puntos;

  const distancia = ([px, py], [ax, ay], [bx, by]) => {
    const dx = bx - ax;
    const dy = by - ay;
    const largo = dx * dx + dy * dy;
    if (largo === 0) return Math.hypot(px - ax, py - ay);
    let t = ((px - ax) * dx + (py - ay) * dy) / largo;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  };

  // Pila explicita en lugar de recursion: un contorno largo desbordaba.
  const conservar = new Uint8Array(puntos.length);
  conservar[0] = 1;
  conservar[puntos.length - 1] = 1;
  const pila = [[0, puntos.length - 1]];

  while (pila.length > 0) {
    const [ini, fin] = pila.pop();
    let peor = 0;
    let indice = -1;
    for (let i = ini + 1; i < fin; i++) {
      const d = distancia(puntos[i], puntos[ini], puntos[fin]);
      if (d > peor) {
        peor = d;
        indice = i;
      }
    }
    if (indice !== -1 && peor > tolerancia) {
      conservar[indice] = 1;
      pila.push([ini, indice], [indice, fin]);
    }
  }

  return puntos.filter((_, i) => conservar[i] === 1);
}

// ---------------------------------------------------------------------------
// 4. Poligonal a curvas
// ---------------------------------------------------------------------------

/** Catmull-Rom a Bezier cubica: suaviza la poligonal sin desviarla. */
function aTrazado(puntos, escala, tension = 0.5) {
  const n = puntos.length;
  if (n < 3) return '';
  const p = (i) => {
    const [x, y] = puntos[((i % n) + n) % n];
    return [x * escala, y * escala];
  };
  const f = (v) => Math.round(v * 100) / 100;

  const [x0, y0] = p(0);
  let d = `M ${f(x0)} ${f(y0)}`;

  for (let i = 0; i < n; i++) {
    const [xa, ya] = p(i - 1);
    const [xb, yb] = p(i);
    const [xc, yc] = p(i + 1);
    const [xd, yd] = p(i + 2);
    const c1x = xb + ((xc - xa) / 6) * tension * 2;
    const c1y = yb + ((yc - ya) / 6) * tension * 2;
    const c2x = xc - ((xd - xb) / 6) * tension * 2;
    const c2y = yc - ((yd - yb) / 6) * tension * 2;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(xc)} ${f(yc)}`;
  }
  return `${d} Z`;
}

// ---------------------------------------------------------------------------

const escala = LADO / W;

function trazadosDe(mascara, areaMinima) {
  return contornos(mascara)
    .filter((anillo) => anillo.length > areaMinima)
    .map((anillo) => aTrazado(simplificar(anillo, TOLERANCIA), escala))
    .filter(Boolean);
}

const trazados = {
  silueta: trazadosDe(silueta, 40),
  cinta: trazadosDe(capas.cinta, 40),
  escudo: trazadosDe(capas.escudo, 40),
  candado: trazadosDe(capas.candado, 25),
};

for (const [nombre, lista] of Object.entries(trazados)) {
  const puntos = lista.reduce((suma, d) => suma + (d.match(/C/g)?.length ?? 0), 0);
  console.log(`  ${nombre.padEnd(9)} ${String(lista.length).padStart(3)} contornos, ${puntos} curvas`);
}

await writeFile(
  'identidad/marcas/_calco.json',
  JSON.stringify({ lado: LADO, trazados }, null, 1),
  'utf8',
);
console.log(`\n  calco guardado en identidad/marcas/_calco.json`);
