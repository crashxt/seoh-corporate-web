/**
 * Sello de generacion.
 *
 * Toda la papeleria sale de scripts, pero en cuanto alguien copia un archivo a
 * su escritorio y lo renombra "Final", deja de haber forma de saber cual es el
 * vigente. Ya paso: circularon tres plantillas anteriores a las correcciones
 * del telefono y la codificacion.
 *
 * Este sello va dentro de cada archivo generado para poder comprobarlo de un
 * vistazo.
 */
import { execSync } from 'node:child_process';

const commit = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'sin-git';
  }
})();

const fecha = new Date().toISOString().slice(0, 10);

export const SELLO = `Generado el ${fecha} desde el commit ${commit}.
  No edite este archivo a mano: se regenera con los scripts del repositorio y
  cualquier cambio manual se perderia. Si necesita un ajuste permanente, pidalo
  sobre el generador.`;

export const SELLO_CORTO = `generado ${fecha} · ${commit}`;
