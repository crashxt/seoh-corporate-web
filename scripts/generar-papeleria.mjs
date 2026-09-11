/**
 * Genera la papeleria impresa a partir de la marca y la paleta del sitio.
 *
 * El logotipo va incrustado como imagen dentro del SVG para que el archivo sea
 * autonomo: la imprenta recibe un solo fichero y no hay enlaces que se rompan.
 *
 * Uso: node scripts/generar-papeleria.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { CONTACTO } from './datos-contacto.mjs';

const DESTINO = 'identidad/plantillas';

const CLARO = '#EEF3F9';
const BLANCO = '#FFFFFF';
const AZUL = '#0057B8';
const AZUL_PROFUNDO = '#003B7E';
const TINTA = '#0C1A2B';
const MEDIO = '#455C73';
const GRIS = '#5A6C80';

/** Incrusta un PNG como data URI, para que el SVG no dependa de archivos externos. */
async function incrustar(ruta, ancho) {
  const buffer = await sharp(ruta).resize({ width: ancho }).png({ compressionLevel: 9 }).toBuffer();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

const logotipo = await incrustar('brand-src/SEOH_logo_4K_4096px_transparente.png', 900);
const marcaS = await incrustar('brand-src/SEOH_S_limpia.png', 400);

// ---------------------------------------------------------------------------
// Tarjeta de presentacion — 90 x 50 mm, la medida habitual en Ecuador.
// ---------------------------------------------------------------------------
// Incluye 3 mm de sangrado por lado (arte de 96 x 56 mm). Ningun texto entra en
// los 5 mm interiores: el guillotinado tiene tolerancia.
const tarjeta = `<!--
  Tarjeta de presentación SEOH DESIGN TECH — 90 × 50 mm con 3 mm de sangrado.

  Antes de enviar a imprenta:
    1. Convertir el texto a curvas.
    2. Convertir el documento a CMYK. El azul #0057B8 equivale aproximadamente
       a C100 M65 Y0 K0 (Pantone 2935 C).
    3. Sustituir los datos entre corchetes.
-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="192mm" height="56mm" viewBox="0 0 192 56">
  <title>SEOH DESIGN TECH — tarjeta de presentación</title>

  <!-- ===================== CARA FRONTAL ===================== -->
  <rect x="0" y="0" width="96" height="56" fill="${CLARO}"/>
  <image href="${logotipo}" xlink:href="${logotipo}" x="20" y="16" width="56" height="18.65" preserveAspectRatio="xMidYMid meet"/>
  <rect x="0" y="52.4" width="96" height="3.6" fill="${AZUL}"/>

  <!-- ===================== CARA DE DATOS ===================== -->
  <g transform="translate(96 0)">
    <rect x="0" y="0" width="96" height="56" fill="${BLANCO}"/>
    <!-- Filete de marca en el canto: identifica sin gastar tinta en masa. -->
    <rect x="0" y="0" width="2" height="56" fill="${AZUL}"/>

    <image href="${marcaS}" xlink:href="${marcaS}" x="74" y="6" width="14" height="12.97" preserveAspectRatio="xMidYMid meet"/>

    <text x="9" y="17" fill="${TINTA}" font-family="'Segoe UI', Arial, sans-serif"
          font-size="5" font-weight="700">[Nombre y Apellido]</text>
    <text x="9" y="23" fill="${AZUL}" font-family="'Segoe UI', Arial, sans-serif"
          font-size="3.3" font-weight="600" letter-spacing="0.5">[CARGO]</text>

    <text x="9" y="34" fill="${MEDIO}" font-family="'Segoe UI', Arial, sans-serif" font-size="3.3">${CONTACTO.telefonoLegible}</text>
    <text x="9" y="39.5" fill="${MEDIO}" font-family="'Segoe UI', Arial, sans-serif" font-size="3.3">[nombre]@${CONTACTO.dominio}</text>
    <text x="9" y="45" fill="${AZUL_PROFUNDO}" font-family="'Segoe UI', Arial, sans-serif" font-size="3.3" font-weight="600">${CONTACTO.dominio}</text>
    <text x="9" y="50.5" fill="${GRIS}" font-family="'Segoe UI', Arial, sans-serif" font-size="3.3">[Ciudad], ${CONTACTO.ciudad}</text>
  </g>
</svg>
`;

// ---------------------------------------------------------------------------
// Firma de correo
// ---------------------------------------------------------------------------
// Tablas y estilos en linea: Outlook usa el motor de Word y descarta hojas de
// estilo, flexbox y grid. El logotipo es una imagen alojada porque muchos
// clientes de correo no renderizan SVG.
const firma = `<!doctype html>
<meta charset="utf-8">
<!--
  Firma de correo — SEOH DESIGN TECH

  Cómo usarla:
    1. Sustituir los datos entre corchetes.
    2. Abrir este archivo en el navegador, seleccionar la firma completa,
       copiarla y pegarla en Gmail, Outlook o el cliente que se use.

  El logotipo se carga desde el sitio publicado, así que no se adjunta una
  imagen en cada correo enviado.

  Si algún día cambia el dominio, esta firma dejaría de mostrar el logotipo en
  los correos ya enviados. Junto a este archivo queda SEOH_firma_marca.png: con
  solo apuntar el src a ese nombre, la imagen viaja incrustada en el mensaje y
  no depende de ningún servidor.
-->
<style>
  /* Solo para ver el archivo en el navegador. No forma parte de la firma: al
     seleccionar y copiar la tabla, estos estilos no viajan con ella. */
  body { background: #FFFFFF; margin: 24px; }
</style>
<table cellpadding="0" cellspacing="0" border="0"
       style="border-collapse:collapse;font-family:'Segoe UI',Arial,sans-serif;max-width:470px;">
  <tr>
    <td style="padding:0 18px 0 0;vertical-align:top;">
      <img src="https://${CONTACTO.dominio}/brand/firma-marca.png"
           alt="SEOH DESIGN TECH" width="72" height="72"
           style="display:block;border:0;outline:none;text-decoration:none;" />
    </td>
    <td style="vertical-align:top;border-left:3px solid ${AZUL};padding:0 0 0 18px;">
      <div style="font-size:16px;font-weight:700;color:${TINTA};line-height:1.3;">
        [Nombre y Apellido]
      </div>
      <div style="font-size:12px;font-weight:600;color:${AZUL};letter-spacing:1px;padding:2px 0 8px;">
        [CARGO]
      </div>

      <div style="font-size:13px;color:${MEDIO};line-height:1.7;">
        <a href="tel:${CONTACTO.telefono}" style="color:${MEDIO};text-decoration:none;">${CONTACTO.telefonoLegible}</a><br />
        <a href="mailto:[nombre]@${CONTACTO.dominio}" style="color:${MEDIO};text-decoration:none;">[nombre]@${CONTACTO.dominio}</a><br />
        <a href="https://${CONTACTO.dominio}" style="color:${AZUL};text-decoration:none;font-weight:600;">${CONTACTO.dominio}</a>
      </div>

      <div style="font-size:11px;color:${GRIS};padding-top:10px;font-style:italic;">
        ${CONTACTO.lema}
      </div>
    </td>
  </tr>
</table>
`;

await mkdir(DESTINO, { recursive: true });

// La imagen de la firma viaja junto al HTML. Sin ella la firma se queda sin
// logotipo, que es justo lo que ocurria apuntando a un dominio aun inactivo.
await sharp('brand-src/SEOH_S_limpia.png')
  .resize(216, 216, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(`${DESTINO}/SEOH_firma_marca.png`);

await writeFile(`${DESTINO}/SEOH_tarjeta_presentacion.svg`, tarjeta, 'utf8');
await writeFile(`${DESTINO}/SEOH_firma_correo.html`, firma, 'utf8');

console.log(`  ${DESTINO}/SEOH_tarjeta_presentacion.svg`);
console.log(`  ${DESTINO}/SEOH_firma_correo.html`);
console.log(`  ${DESTINO}/SEOH_firma_marca.png`);
