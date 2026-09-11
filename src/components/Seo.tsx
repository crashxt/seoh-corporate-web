import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EMPRESA } from '../data/empresa';

const SITIO = `https://${EMPRESA.dominio}`;
const IMAGEN_SOCIAL = `${SITIO}/brand/og-image.jpg`;

/**
 * Metadatos por pagina.
 *
 * Al ser una SPA, el titulo y las etiquetas Open Graph no cambian solos al
 * navegar: hay que reescribirlos en cada ruta para que compartir un enlace
 * interno muestre la informacion de esa pagina y no la de la portada.
 */
function fijarMeta(selector: string, atributo: string, valor: string, crear: () => HTMLElement) {
  let nodo = document.head.querySelector(selector);
  if (!nodo) {
    nodo = crear();
    document.head.appendChild(nodo);
  }
  nodo.setAttribute(atributo, valor);
}

const meta = (propiedad: string, contenido: string, porNombre = false) => {
  const clave = porNombre ? 'name' : 'property';
  fijarMeta(`meta[${clave}="${propiedad}"]`, 'content', contenido, () => {
    const nodo = document.createElement('meta');
    nodo.setAttribute(clave, propiedad);
    return nodo;
  });
};

type Props = {
  title: string;
  description: string;
  /** Titulo completo sin sufijo de marca; util en la portada. */
  titleAbsoluto?: boolean;
};

export default function Seo({ title, description, titleAbsoluto }: Props) {
  const { pathname } = useLocation();

  useEffect(() => {
    const completo = titleAbsoluto ? title : `${title} | ${EMPRESA.nombreCorto} DESIGN TECH`;
    const url = `${SITIO}${pathname}`;

    document.title = completo;
    meta('description', description, true);
    meta('og:title', completo);
    meta('og:description', description);
    meta('og:url', url);
    meta('og:image', IMAGEN_SOCIAL);
    meta('twitter:title', completo, true);
    meta('twitter:description', description, true);
    meta('twitter:image', IMAGEN_SOCIAL, true);

    fijarMeta('link[rel="canonical"]', 'href', url, () => {
      const nodo = document.createElement('link');
      nodo.setAttribute('rel', 'canonical');
      return nodo;
    });
  }, [title, description, titleAbsoluto, pathname]);

  return null;
}
