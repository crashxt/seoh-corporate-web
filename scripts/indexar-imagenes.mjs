/**
 * Construye un indice de fotografias por codigo de modelo.
 *
 * POR QUE EXISTE
 * La lista de TecnoMega trae descripcion y precio, pero ninguna fotografia. El
 * catalogo publicado se veia con marcadores dibujados en mas de cien fichas.
 *
 * DE DONDE SALEN LAS FOTOGRAFIAS
 * Del catalogo publico de un distribuidor que vende las mismas marcas y publica
 * la fotografia del fabricante junto al numero de parte. Se consulta sin sesion
 * —los precios necesitan cuenta, las fichas y las fotografias no— y solo se
 * toma el nombre del archivo de imagen y el numero de parte.
 *
 * Los sitios de los fabricantes se descartaron tras probarlos: de cuatro marcas,
 * solo una expone la fotografia de forma localizable. APC devuelve imagenes de
 * campana, TP-Link tiene buscador dinamico y Hikvision no publica API.
 *
 * SALIDA
 * catalogo-src/imagenes-por-modelo.json  —  { "BVG900-LM": "UI717APC50 M.jpg" }
 *
 * Fuera del control de versiones, como todo lo que vive en catalogo-src.
 *
 *   npm run indexar-imagenes
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const ORIGEN = 'catalogo-src';
const SALIDA = `${ORIGEN}/imagenes-por-modelo.json`;
const BASE = 'https://store.intcomex.com';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36';

/** Categorias que cubren lo que publica el catalogo: redes y energia. */
const CATEGORIAS = [
  'ups.ups',
  'ups.regulator',
  'ups.surge',
  'ups.accessory',
  'net.router',
  'net.accpoint',
  'net.hubswitch',
  'net.nwadapter',
  'net.antenna',
  'net.expansion',
  'net.rackpanel',
  'net.nwconnect',
  'net.acc',
  'com.video',
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function pagina(categoria, p) {
  const r = await fetch(`${BASE}/es-XEC/ProductsAjax/ByCategory/${categoria}?p=${p}`, {
    headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
  });
  return r.ok ? r.text() : '';
}

/**
 * Extrae (numero de parte, archivo de imagen) de cada ficha.
 *
 * Se recorta ficha a ficha en lugar de buscar por toda la pagina a la vez: con
 * expresiones sueltas, los productos sin fotografia desplazan la correspondencia
 * y cada numero de parte acaba emparejado con la imagen del siguiente.
 *
 * El corte va en `js-pictureArea` y no en `productArea` porque la fotografia se
 * imprime ANTES del bloque de datos: cortando por el segundo, cada imagen queda
 * en la ficha anterior y no se empareja ninguna.
 */
function extraer(html) {
  const pares = [];
  for (const ficha of html.split('js-pictureArea').slice(1)) {
    const trozo = ficha.slice(0, 4000);
    const mpn = trozo.match(/MPN:[\s\S]*?class="value font-bold">([^<]+)</)?.[1]?.trim();
    const imagen = trozo.match(/\/images\/products\/([^"']+)/)?.[1];
    if (mpn && imagen && !/noimage/i.test(imagen)) pares.push([mpn, decodeURIComponent(imagen)]);
  }
  return pares;
}

const indice = {};
let fichas = 0;

for (const categoria of CATEGORIAS) {
  let enCategoria = 0;
  for (let p = 1; p <= 12; p += 1) {
    let html = '';
    try {
      html = await pagina(categoria, p);
    } catch {
      break; // red caida: se sigue con la categoria siguiente
    }
    if (!html.includes('productArea')) break;

    const pares = extraer(html);
    if (pares.length === 0) break;
    for (const [mpn, imagen] of pares) {
      if (!indice[mpn]) indice[mpn] = imagen;
      enCategoria += 1;
    }
    await esperar(250); // no conviene golpear el servidor de nadie
  }
  fichas += enCategoria;
  console.log(`  ${categoria.padEnd(18)} ${String(enCategoria).padStart(4)} con fotografía`);
}

await mkdir(ORIGEN, { recursive: true });

// Se fusiona con lo ya indexado: una ejecución con la red a medias no debe
// borrar el trabajo de la anterior.
let previo = {};
try {
  previo = JSON.parse(await readFile(SALIDA, 'utf8'));
} catch {
  // primera ejecución
}

const total = { ...previo, ...indice };

console.log(`\n  del distribuidor : ${Object.keys(indice).length} en esta pasada`);

// --- Segunda pasada: directamente del fabricante -----------------------------
//
// El distribuidor no fotografia todas las marcas: de APC y TP-Link devuelve
// "noimage". Para esas se va al fabricante, que si publica la suya.
//
// De cuatro marcas probadas solo dos resultaron automatizables. APC expone la
// ficha en una direccion deducible del numero de parte, y Ubiquiti la sirve en
// og:image con el modelo en minusculas. TP-Link movio su linea empresarial a
// otro dominio y la direccion lleva un segmento de categoria que no se deduce
// del modelo; Hikvision genera la ficha con JavaScript. Esas dos siguen
// pendientes del paquete oficial de fotografias.
// APC quedo fuera tras probarlo. Su ficha parecia resolver: devolvia una imagen
// para cada numero de parte y los diecisiete modelos del catalogo "funcionaron".
// Todos apuntaban a la MISMA fotografia. Schneider redirige cualquier modelo que
// no reconoce a una pagina general de productos, y de ahi salia una imagen
// promocional. Habria publicado diecisiete fichas con la foto equivocada sin que
// nada fallara. De ahi la comprobacion de mas abajo.
const resolvedores = {
  /**
   * Ubiquiti sirve la fotografia en og:image y su direccion lleva el modelo en
   * minusculas. Un modelo inexistente devuelve 404, no una pagina generica.
   */
  async Ubiquiti(modelo) {
    const slug = modelo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const r = await fetch(`https://store.ui.com/us/en/products/${slug}`, {
      headers: { 'User-Agent': UA },
    });
    if (!r.ok) return null;
    const html = await r.text();
    // La pagina debe hablar de este modelo. Sin esta comprobacion, cualquier
    // pagina de cortesia se cuela como si fuera la ficha.
    if (!new RegExp(modelo.replace(/[^A-Za-z0-9]/g, '.'), 'i').test(html)) return null;
    const og = html.match(/og:image[^>]+content=["']([^"']+)["']/)?.[1];
    return og?.startsWith('http') ? og.replace(/&amp;/g, '&') : null;
  },
};

/**
 * Trozos de la descripcion que pueden ser un numero de parte.
 *
 * Vale con digito —BVG900-LM— o con guiones en mayusculas —UVC-G5-Bullet—.
 * Exigir digito dejaba fuera media gama de Ubiquiti.
 */
const candidatos = (nombre) =>
  nombre
    .split(/[\s,()]+/)
    .map((t) => t.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9-]+$/g, ''))
    .filter(
      (t) =>
        t.length >= 4 &&
        t.length <= 24 &&
        /[A-Za-z]/.test(t) &&
        (/\d/.test(t) || (t.includes('-') && /[A-Z]/.test(t))),
    );

let delFabricante = 0;
try {
  const generado = await readFile('src/data/products.ts', 'utf8');
  const fichas = generado.split(/^ \{$/m).slice(1);

  for (const ficha of fichas) {
    if (/image_url:/.test(ficha)) continue;
    const nombre = ficha.match(/name: "([^"]+)"/)?.[1];
    if (!nombre) continue;

    const marca = Object.keys(resolvedores).find((m) => new RegExp(`\\b${m}\\b`, 'i').test(nombre));
    if (!marca) continue;

    for (const modelo of candidatos(nombre)) {
      if (total[modelo]) break; // ya indexado
      let url = null;
      try {
        url = await resolvedores[marca](modelo);
      } catch {
        // marca inaccesible en este momento: se prueba el candidato siguiente
      }
      await esperar(400);
      if (!url) continue;

      // Dos modelos distintos no pueden compartir fotografia. Cuando ocurre no
      // es coincidencia: es que la fuente devolvio una pagina generica.
      const yaUsada = Object.entries(total).find(([otro, u]) => u === url && otro !== modelo);
      if (yaUsada) {
        console.log(`  ${marca.padEnd(9)} ${modelo}  descartado: misma imagen que ${yaUsada[0]}`);
        break;
      }

      total[modelo] = url;
      delFabricante += 1;
      console.log(`  ${marca.padEnd(9)} ${modelo}`);
      break;
    }
  }
} catch {
  console.log('  (sin src/data/products.ts: se omite la pasada de fabricantes)');
}

await writeFile(SALIDA, JSON.stringify(total, null, 1), 'utf8');

console.log(`\n  del fabricante   : ${delFabricante}`);
console.log(`  acumulado        : ${Object.keys(total).length}`);
console.log(`\n  escrito en ${SALIDA}`);
