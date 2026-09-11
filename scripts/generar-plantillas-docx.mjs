/**
 * Genera las plantillas de papeleria en Word.
 *
 * Dos archivos:
 *   SEOH_membrete.docx  hoja con membrete, vacia, para cualquier documento
 *   SEOH_oficio.docx    oficio formal con su estructura y campos a rellenar
 *
 * A4 porque es el formato vigente en Ecuador. La marca va en el encabezado y
 * los datos de contacto en el pie, asi que se repiten solos en cada hoja sin
 * que nadie tenga que copiarlos.
 *
 * Uso: node scripts/generar-plantillas-docx.mjs
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  PageNumber,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const DESTINO = 'identidad/plantillas';
// 512 px sobran para el tamano al que se imprime el membrete, y evitan
// arrastrar 300 KB dentro de cada documento que se cree a partir de la plantilla.
const LOGO = 'identidad/formatos/logotipo/SEOH_logotipo_web_512px_transparente.png';

const AZUL = '0057B8';
const AZUL_PROFUNDO = '003B7E';
const TINTA = '0C1A2B';
const GRIS = '5A6C80';

// A4 en DXA (1440 = 1 pulgada). 21 x 29,7 cm.
const A4 = { width: 11906, height: 16838 };

const logo = await readFile(LOGO);

/** Encabezado comun: marca a la izquierda y filete azul debajo. */
const encabezado = () =>
  new Header({
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: logo,
            type: 'png',
            transformation: { width: 165, height: 55 },
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60, after: 0 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: AZUL, space: 1 },
        },
        children: [],
      }),
    ],
  });

/** Pie comun: datos de contacto y numero de pagina. */
const pie = () =>
  new Footer({
    children: [
      new Paragraph({
        spacing: { before: 0, after: 60 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: 'C9D3E0', space: 1 },
        },
        children: [],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
        children: [
          new TextRun({
            text: 'SEOH DESIGN TECH S.A.  ·  info@seohdesigntech.com  ·  seohdesigntech.com',
            size: 15,
            color: GRIS,
          }),
          new TextRun({ text: '\t', size: 15 }),
          new TextRun({ text: 'Página ', size: 15, color: GRIS }),
          new TextRun({ children: [PageNumber.CURRENT], size: 15, color: GRIS }),
          new TextRun({ text: ' de ', size: 15, color: GRIS }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: GRIS }),
        ],
      }),
    ],
  });

const seccion = (children) => ({
  properties: {
    page: {
      size: A4,
      margin: { top: 2000, right: 1440, bottom: 1400, left: 1440, header: 720, footer: 560 },
    },
  },
  headers: { default: encabezado() },
  footers: { default: pie() },
  children,
});

const parrafo = (texto, opciones = {}) =>
  new Paragraph({
    spacing: { after: opciones.after ?? 160, line: 276 },
    alignment: opciones.alineacion,
    children: [
      new TextRun({
        text: texto,
        size: opciones.size ?? 21,
        bold: opciones.negrita,
        color: opciones.color ?? TINTA,
        italics: opciones.cursiva,
      }),
    ],
  });

const vacio = (after = 160) => new Paragraph({ spacing: { after }, children: [] });

// ---------------------------------------------------------------------------
// 1. Hoja con membrete, en blanco
// ---------------------------------------------------------------------------
const membrete = new Document({
  creator: 'SEOH DESIGN TECH S.A.',
  title: 'Hoja membretada SEOH',
  description: 'Plantilla de hoja con membrete para documentos institucionales.',
  sections: [
    seccion([
      parrafo('[Ciudad], [día] de [mes] de [año]', { alineacion: AlignmentType.RIGHT, after: 400 }),
      parrafo('[Título del documento]', { negrita: true, size: 26, color: AZUL_PROFUNDO, after: 280 }),
      parrafo('[Escriba aquí el contenido. Este párrafo conserva el interlineado y el tamaño de la plantilla; al sustituir el texto se mantiene el formato.]'),
      vacio(400),
      parrafo('Atentamente,', { after: 700 }),
      parrafo('[Nombre y Apellido]', { negrita: true, after: 0 }),
      parrafo('[Cargo]', { color: GRIS, size: 19, after: 0 }),
      parrafo('SEOH DESIGN TECH S.A.', { color: GRIS, size: 19 }),
    ]),
  ],
});

// ---------------------------------------------------------------------------
// 2. Oficio
// ---------------------------------------------------------------------------
const oficio = new Document({
  creator: 'SEOH DESIGN TECH S.A.',
  title: 'Oficio SEOH',
  description: 'Plantilla de oficio con la estructura formal completa.',
  sections: [
    seccion([
      parrafo('Oficio N.º [000]-[AÑO]-SEOH', { negrita: true, color: AZUL_PROFUNDO, after: 80 }),
      parrafo('[Ciudad], [día] de [mes] de [año]', { color: GRIS, size: 19, after: 400 }),

      parrafo('Señor / Señora', { after: 0 }),
      parrafo('[Nombre y Apellido]', { negrita: true, after: 0 }),
      parrafo('[Cargo]', { after: 0 }),
      parrafo('[Institución u organización]', { after: 0 }),
      parrafo('Presente.-', { after: 360 }),

      parrafo('Asunto: [Motivo del oficio en una línea]', { negrita: true, after: 360 }),

      parrafo('De mi consideración:', { after: 240 }),

      parrafo('[Primer párrafo: exponga el motivo del oficio de forma directa, indicando el antecedente que lo origina.]'),
      parrafo('[Segundo párrafo: desarrolle el contenido, la solicitud o la información que se comunica.]'),
      parrafo('[Tercer párrafo: indique la acción esperada, el plazo si corresponde y ofrezca la disponibilidad para ampliar la información.]'),

      parrafo('Con sentimientos de distinguida consideración.', { after: 500 }),

      parrafo('Atentamente,', { after: 700 }),
      parrafo('[Nombre y Apellido]', { negrita: true, after: 0 }),
      parrafo('[Cargo]', { color: GRIS, size: 19, after: 0 }),
      parrafo('SEOH DESIGN TECH S.A.', { color: GRIS, size: 19, after: 400 }),

      parrafo('Adjunto: [detalle de anexos, o eliminar esta línea si no los hay]', {
        size: 18,
        color: GRIS,
        cursiva: true,
      }),
    ]),
  ],
});

// ---------------------------------------------------------------------------
await mkdir(DESTINO, { recursive: true });

for (const [nombre, documento] of [
  ['SEOH_membrete.docx', membrete],
  ['SEOH_oficio.docx', oficio],
]) {
  await writeFile(`${DESTINO}/${nombre}`, await Packer.toBuffer(documento));
  console.log(`  ${DESTINO}/${nombre}`);
}
