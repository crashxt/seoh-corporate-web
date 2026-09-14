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
import sharp from 'sharp';
import XLSX from 'xlsx';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';

const ORIGEN = 'catalogo-src';
const IMAGENES = 'catalogo-src/imagenes';
const IMAGENES_WEB = 'public/catalogo';
const CONFIG = 'catalogo-src/catalogo.config.json';
const SALIDA = 'src/data/products.ts';
const SALIDA_CATEGORIAS = 'src/data/categorias-equipos.ts';

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

// --- Listas adicionales en TSV -----------------------------------------------
//
// El Excel de TecnoMega cubre redes y energia. La linea de seguridad viene de
// otro distribuidor y llega como TSV: sku, mpn, marca, nombre, costo, imagen.
// Se trata igual que el Excel —costo dentro, precio de venta fuera— y no toca
// el control de versiones, porque vive en catalogo-src/.
const extras = [];
for (const fuente of config.fuentes ?? []) {
  let texto;
  try {
    texto = await readFile(`${ORIGEN}/${fuente.archivo}`, 'utf8');
  } catch {
    console.warn(`  aviso: no se encontro ${ORIGEN}/${fuente.archivo}, se omite`);
    continue;
  }
  const [cabecera, ...cuerpo] = texto.trim().split(/\r?\n/);
  const cols = cabecera.split('\t').map((c) => c.trim());
  for (const linea of cuerpo) {
    const v = linea.split('\t');
    const fila = Object.fromEntries(cols.map((c, i) => [c, (v[i] ?? '').trim()]));
    const costo = Number.parseFloat(fila.costo);
    if (!Number.isFinite(costo) || costo <= 0) continue;
    extras.push({
      fuente,
      descripcion: fila.nombre || `${fila.marca} ${fila.mpn}`.trim(),
      marca: fila.marca,
      codigo: fila.mpn || fila.sku,
      imagenRemota: fila.imagen || null,
      costo,
    });
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

// --- Emparejar imagenes ------------------------------------------------------
//
// El mayorista entrega su paquete de fotografias con el codigo o el nombre del
// producto en el archivo. En vez de mantener una tabla a mano, se emparejan
// por coincidencia de texto: basta dejar las imagenes en catalogo-src/imagenes
// y volver a ejecutar.
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

let archivosImagen = [];
try {
  archivosImagen = (await readdir(IMAGENES)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
} catch {
  // Sin carpeta de imagenes se sigue adelante: el catalogo usa sus marcadores.
}

const indiceImagenes = archivosImagen.map((archivo) => ({
  archivo,
  clave: normalizar(archivo.replace(/\.[^.]+$/, '')),
}));

/**
 * Empareja una imagen con un producto.
 *
 * Contar palabras en comun no basta: "access point tp-link eap653" comparte
 * dos palabras con cualquier punto de acceso del catalogo, y una sola imagen
 * acababa asignada a cinco productos distintos. Lo que identifica de verdad a
 * un equipo es su codigo de modelo —eap653, bv500, avr1808—, asi que se exige
 * que coincida al menos uno de esos.
 *
 * Ademas cada imagen se usa una sola vez: dos fichas con la misma fotografia
 * significan que una de las dos esta mal.
 */
const usadas = new Set();

const esModelo = (palabra) => /\d/.test(palabra) && palabra.length >= 3;

function buscarImagen(descripcion) {
  if (indiceImagenes.length === 0) return null;
  const palabras = normalizar(descripcion).split(' ').filter((p) => p.length > 2);
  const modelos = palabras.filter(esModelo);
  if (modelos.length === 0) return null;

  let mejor = null;
  let mejorPuntos = 0;
  for (const entrada of indiceImagenes) {
    if (usadas.has(entrada.archivo)) continue;
    const tokens = entrada.clave.split(' ');
    // Coincidencia exacta de token, no subcadena: "bv50" no debe casar con
    // "bv500", que son dos equipos distintos.
    const modelosComunes = modelos.filter((m) => tokens.includes(m));
    if (modelosComunes.length === 0) continue;
    const puntos = modelosComunes.length * 10 + palabras.filter((p) => tokens.includes(p)).length;
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = entrada;
    }
  }
  if (mejor) usadas.add(mejor.archivo);
  return mejor;
}

// --- Calcular el precio publico ----------------------------------------------
//
// El margen NO es uno solo: va por categoria, porque no en todas se compite
// contra lo mismo. Cada uno esta medido y justificado en
// catalogo-src/metodo-de-precios.md, junto a la configuracion que lo fija.
//
// Ese documento y la configuracion viven fuera del control de versiones a
// proposito: este repositorio es publico, y tanto los costos de distribuidor
// como los margenes propios son informacion comercial.
const { iva } = config;
const precioVenta = (costo, margen) => Math.round(costo * (1 + margen) * (1 + iva) * 100) / 100;

const publico = seleccion.map((p, i) => {
  const destino = config.categorias.find((c) => c.origen === p.categoria);
  const imagen = buscarImagen(p.descripcion);
  return {
    id: `eq-${String(i + 1).padStart(3, '0')}`,
    imagen: imagen?.archivo ?? null,
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
    price: precioVenta(p.costo, destino.margen),
    is_active: true,
    sort_order: i + 1,
  };
});

// Las fuentes TSV se anaden despues, con su propio margen.
publico.push(
  ...extras.map((p, i) => ({
    id: `eq-x${String(i + 1).padStart(3, '0')}`,
    imagen: null,
    imagenRemota: p.imagenRemota,
    slug: `${p.descripcion} ${p.codigo}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60),
    name: p.descripcion,
    category: p.fuente.publica,
    summary: p.fuente.resumen,
    description: p.descripcion,
    price: precioVenta(p.costo, p.fuente.margen),
    is_active: true,
    sort_order: seleccion.length + i + 1,
  })),
);

// Un slug repetido haria que dos fichas distintas compartan direccion.
const vistos = new Set();
const catalogo = publico.filter((p) => {
  if (vistos.has(p.slug)) return false;
  vistos.add(p.slug);
  return true;
});

// --- Optimizar las imagenes emparejadas --------------------------------------
// Las fotografias de fabricante suelen venir a 2000 px y varios cientos de KB.
// En una ficha se muestran a 400, asi que se reescalan una vez aqui en lugar de
// enviarlas enteras a cada visitante.
let imagenesUsadas = 0;
await mkdir(IMAGENES_WEB, { recursive: true });

if (archivosImagen.length > 0) {
  for (const p of publico) {
    if (!p.imagen) continue;
    const destino = `${p.slug}.webp`;
    await sharp(`${IMAGENES}/${p.imagen}`)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${IMAGENES_WEB}/${destino}`);
    p.image_url = `/catalogo/${destino}`;
    imagenesUsadas++;
  }
}

// --- Descargar las fotografias del portal de distribuidor --------------------
//
// Las fuentes TSV traen el nombre del archivo tal como lo sirve el portal. Se
// descarga una sola vez y se guarda en catalogo-src/imagenes-remotas/, que no
// va al control de versiones: en ejecuciones siguientes se usa la copia local
// en lugar de volver a pedirsela al proveedor.
//
// No se enlazan directamente desde el sitio. Servir imagenes desde el dominio
// del distribuidor dejaria el catalogo a merced de que el las mueva, y le
// cargaria trafico que no le corresponde.
const CACHE_REMOTA = `${ORIGEN}/imagenes-remotas`;
await mkdir(CACHE_REMOTA, { recursive: true });

/**
 * Nombres alternativos de mayor resolucion para una miniatura.
 *
 * El portal sirve la misma fotografia en varios tamanos y los distingue con un
 * sufijo en el nombre del archivo: "ES213HIK49 M.jpg" tiene hermanas " L" y
 * " XL". El listado enlaza siempre la M, que son 200 px: suficiente para una
 * rejilla de miniaturas suya, corto para una ficha de producto nuestra.
 *
 * El sufijo no es uniforme —" M", "M", "m", "med", "-200"— asi que no se puede
 * derivar con una sola regla. Se prueban los candidatos y se elige el archivo
 * mas pesado que responda, que es el de mas resolucion.
 */
function candidatosGrandes(nombre) {
  const punto = nombre.lastIndexOf('.');
  const ext = nombre.slice(punto);
  const raiz = nombre.slice(0, punto);
  const limpia = raiz.replace(/(\s*[Mm]ed|\s*[Mm]|[-_]\s*200(x200)?)$/, '').trim();

  const salida = [];
  for (const base of [limpia, raiz]) {
    for (const sufijo of [' XL', ' L', 'XL', 'L', '-XL', '-L']) salida.push(base + sufijo + ext);
  }
  for (const sufijo of ['-800', '-500', '-400']) salida.push(limpia + sufijo + ext);
  return [...new Set(salida)].filter((c) => c !== nombre);
}

const urlDe = (base, nombre) => base + encodeURIComponent(nombre).replace(/%2F/g, '/');

/** El candidato mas pesado que exista, o el original si ninguno responde. */
async function mejorResolucion(base, nombre) {
  let elegido = nombre;
  let mayor = 0;
  for (const candidato of candidatosGrandes(nombre)) {
    try {
      const r = await fetch(urlDe(base, candidato), { method: 'HEAD' });
      if (!r.ok) continue;
      const bytes = Number(r.headers.get('content-length') ?? 0);
      if (bytes > mayor) {
        mayor = bytes;
        elegido = candidato;
      }
    } catch {
      // candidato inexistente: se ignora y se prueba el siguiente
    }
  }
  return elegido;
}

let descargadas = 0;
let fallidas = 0;
let mejoradas = 0;
for (const p of publico) {
  if (!p.imagenRemota || p.image_url) continue;
  const fuente = config.fuentes?.find((f) => f.publica === p.category);
  if (!fuente?.imagenBase) continue;

  const local = `${CACHE_REMOTA}/${p.imagenRemota.replace(/[^\w.-]/g, '_')}`;
  try {
    await stat(local);
  } catch {
    const grande = await mejorResolucion(fuente.imagenBase, p.imagenRemota);
    if (grande !== p.imagenRemota) mejoradas++;
    const respuesta = await fetch(urlDe(fuente.imagenBase, grande));
    if (!respuesta.ok) {
      fallidas++;
      continue;
    }
    await writeFile(local, Buffer.from(await respuesta.arrayBuffer()));
    descargadas++;
  }

  const destino = `${p.slug}.webp`;
  try {
    await sharp(local)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${IMAGENES_WEB}/${destino}`);
    p.image_url = `/catalogo/${destino}`;
    imagenesUsadas++;
  } catch {
    fallidas++; // archivo corrupto o formato no soportado
  }
}

// --- Emitir ------------------------------------------------------------------
const cuerpo = catalogo
  .map(
    (p) => ` {
  id: ${JSON.stringify(p.id)},
  slug: ${JSON.stringify(p.slug)},
  name: ${JSON.stringify(p.name)},
  category: ${JSON.stringify(p.category)},
  summary: ${JSON.stringify(p.summary)},
  description: ${JSON.stringify(p.description)},${p.image_url ? `
  image_url: ${JSON.stringify(p.image_url)},` : ''}
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

// --- Emitir las categorias que realmente tienen producto --------------------
//
// El menu y la portada listaban tres categorias fijas —Seguridad, Automatizacion,
// Infraestructura— que no se correspondian con nada: el catalogo solo tiene lo
// que trae la lista del mayorista. Quien pulsaba cualquiera de las tres llegaba
// a "No hay equipos publicados en esta categoria" desde un menu del sitio en
// produccion. Se emiten aqui para que la navegacion no pueda desincronizarse
// del catalogo: si una categoria se queda sin stock, desaparece del menu sola.
//
// Va en su propio modulo, y no leyendo products.ts, porque el catalogo son 32 KB
// que se cargan solo al entrar a Equipos; el menu esta en todas las paginas.
const categoriasConProducto = [...config.categorias, ...(config.fuentes ?? [])].filter((c) =>
  catalogo.some((p) => p.category === c.publica),
);

await writeFile(
  SALIDA_CATEGORIAS,
  `/**
 * Categorias de equipo que tienen producto publicado.
 *
 * GENERADO AUTOMATICAMENTE — no editar a mano.
 * Origen: ${lista} · generado el ${new Date().toISOString().slice(0, 10)} · npm run catalogo
 */
export const CATEGORIAS_EQUIPOS = [
${categoriasConProducto.map((c) => `  ${JSON.stringify(c.publica)},`).join('\n')}
] as const;

export const DESCRIPCION_CATEGORIA: Record<string, string> = {
${categoriasConProducto.map((c) => `  ${JSON.stringify(c.publica)}: ${JSON.stringify(c.resumen)},`).join('\n')}
};
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
console.log(
  `
  imágenes: ${archivosImagen.length} disponibles · ${imagenesUsadas} emparejadas`,
);
if (archivosImagen.length === 0) {
  console.log(`  deje las fotografías del mayorista en ${IMAGENES}/ y vuelva a ejecutar`);
}
console.log(`\n  escrito en ${SALIDA}`);
