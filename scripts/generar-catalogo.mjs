/**
 * Genera el catalogo publico a partir de la lista del mayorista.
 *
 * La fuente de verdad es el Excel que llega cada mes. Actualizar precios,
 * anadir referencias o retirar lo descontinuado se hace reemplazando ese
 * archivo y volviendo a ejecutar esto, sin tocar codigo.
 *
 *   1. Coloque la lista del mes en catalogo-src/
 *   2. npm run catalogo
 *
 * REGLA QUE NO SE PUEDE ROMPER
 * El repositorio es publico. Los costos del mayorista NO salen de
 * catalogo-src/, que esta en .gitignore. Este script emite unicamente el
 * precio de venta; el costo se usa para calcularlo y se descarta.
 */
import XLSX from 'xlsx';
import { readFile, readdir, writeFile } from 'node:fs/promises';

const ORIGEN = 'catalogo-src';
const CONFIG = 'catalogo.config.json';
const SALIDA = 'src/data/products.ts';

const config = JSON.parse(await readFile(CONFIG, 'utf8'));

// --- Localizar la lista mas reciente -----------------------------------------
const archivos = (await readdir(ORIGEN)).filter((f) => /\.(xls|xlsx)$/i.test(f)).sort();
if (archivos.length === 0) {
  console.error(`\n  No hay ninguna lista en ${ORIGEN}/`);
  console.error('  Coloque ahí el Excel del mayorista y vuelva a ejecutar.\n');
  process.exit(1);
}
const lista = archivos.at(-1);

// --- Leer la rejilla ---------------------------------------------------------
// El listado viene en cinco pares de columnas (descripcion, precio) dispuestos
// en paralelo. Cada columna es una lista independiente con sus propias
// cabeceras de categoria; lo que aparece por encima de la primera cabecera de
// una columna continua la ultima categoria de la columna anterior.
const libro = XLSX.readFile(`${ORIGEN}/${lista}`);
const filas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], {
  header: 1,
  defval: null,
});

const crudos = [];
let categoria = null;
for (let c = 0; c < 10; c += 2) {
  for (const fila of filas) {
    const desc = fila?.[c];
    const precio = fila?.[c + 1];
    if (typeof desc !== 'string' || !desc.trim()) continue;
    const descripcion = desc.replace(/\s+/g, ' ').trim();
    if (typeof precio !== 'number') {
      categoria = descripcion; // fila sin precio = cabecera
      continue;
    }
    crudos.push({ categoria, descripcion, costo: precio });
  }
}

// --- Seleccionar lo que se publica -------------------------------------------
const incluidas = new Set(config.categorias.map((c) => c.origen));
const excluir = config.excluir.map((t) => t.toLowerCase());

const seleccion = crudos.filter((p) => {
  if (!incluidas.has(p.categoria)) return false;
  if (p.costo < config.costoMinimo) return false; // accesorios sueltos: no se venden solos
  return !excluir.some((t) => p.descripcion.toLowerCase().includes(t));
});

// --- Calcular el precio publico ----------------------------------------------
// El mayorista vende al publico aplicando su propio margen sobre este mismo
// costo, asi que un margen por encima del suyo deja el catalogo fuera de
// mercado. Se publica por debajo, y el negocio se hace en las soluciones.
const { margen, iva } = config;
const publico = seleccion.map((p, i) => {
  const destino = config.categorias.find((c) => c.origen === p.categoria);
  return {
    id: `eq-${String(i + 1).padStart(3, '0')}`,
    slug: p.descripcion
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60),
    name: p.descripcion,
    category: destino.publica,
    summary: destino.resumen,
    description: p.descripcion,
    price: Math.round(p.costo * (1 + margen) * (1 + iva) * 100) / 100,
    is_active: true,
    sort_order: i + 1,
  };
});

// Un slug repetido haria que dos fichas distintas compartan direccion.
const vistos = new Set();
const catalogo = publico.filter((p) => {
  if (vistos.has(p.slug)) return false;
  vistos.add(p.slug);
  return true;
});

// --- Emitir ------------------------------------------------------------------
const cuerpo = catalogo
  .map(
    (p) => ` {
  id: ${JSON.stringify(p.id)},
  slug: ${JSON.stringify(p.slug)},
  name: ${JSON.stringify(p.name)},
  category: ${JSON.stringify(p.category)},
  summary: ${JSON.stringify(p.summary)},
  description: ${JSON.stringify(p.description)},
  price: ${p.price},
  is_active: true,
  sort_order: ${p.sort_order},
  documents: [],
 },`,
  )
  .join('\n');

const fecha = new Date().toISOString().slice(0, 10);
await writeFile(
  SALIDA,
  `import type { Product } from '../types';

/**
 * Catalogo publico de equipos.
 *
 * GENERADO AUTOMATICAMENTE — no editar a mano.
 * Origen: ${lista} · generado el ${fecha} · npm run catalogo
 *
 * Contiene solo precios de venta. Los costos del mayorista se quedan en
 * catalogo-src/, fuera del control de versiones, porque este repositorio es
 * publico y publicarlos revelaria el margen.
 */
export const fallbackProducts: Product[] = [
${cuerpo}
];
`,
  'utf8',
);

// --- Resumen -----------------------------------------------------------------
const porCategoria = new Map();
for (const p of catalogo) porCategoria.set(p.category, (porCategoria.get(p.category) ?? 0) + 1);

console.log(`\n  lista leída        : ${lista}`);
console.log(`  referencias totales: ${crudos.length}`);
console.log(`  publicadas         : ${catalogo.length}\n`);
for (const [cat, n] of porCategoria) {
  const precios = catalogo.filter((p) => p.category === cat).map((p) => p.price);
  console.log(
    `    ${cat.padEnd(20)}${String(n).padStart(4)}   desde ${Math.min(...precios).toFixed(2).padStart(9)} hasta ${Math.max(...precios).toFixed(2)}`,
  );
}
console.log(`\n  escrito en ${SALIDA}`);
