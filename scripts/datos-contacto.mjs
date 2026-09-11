/**
 * Lee los datos de contacto desde src/data/empresa.ts.
 *
 * Los scripts de papeleria y plantillas los necesitan, pero duplicarlos aqui
 * garantizaria que antes o despues una tarjeta impresa lleve un telefono que
 * la web ya cambio. Se extraen del mismo archivo que usa el sitio, que queda
 * como unica fuente de verdad.
 */
import { readFile } from 'node:fs/promises';

const fuente = await readFile('src/data/empresa.ts', 'utf8');

const leer = (clave) => {
  const encontrado = fuente.match(new RegExp(`${clave}:\\s*'([^']*)'`));
  return encontrado ? encontrado[1] : '';
};

const telefono = leer('telefono');

export const CONTACTO = {
  nombre: leer('nombre'),
  lema: leer('lema'),
  dominio: leer('dominio'),
  correo: leer('correo'),
  telefono,
  /** Formato legible: +593 99 879 3588 */
  telefonoLegible: telefono.replace(/^(\+\d{3})(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4'),
  whatsapp: leer('whatsapp'),
  ciudad: leer('ciudad'),
};
