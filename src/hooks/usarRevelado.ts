import { useEffect } from 'react';

/**
 * Aparicion suave al entrar en pantalla.
 *
 * Observa los elementos marcados con `data-revelar` dentro de la pagina. Se
 * resolvio asi, y no con un componente envoltorio, porque envolver una tarjeta
 * en un <div> la saca de la rejilla: el hijo del grid pasaria a ser el
 * envoltorio y las tarjetas dejarian de igualar su altura.
 *
 * Tres decisiones deliberadas:
 *
 * 1. El contenido nace visible. La clase que lo oculta la pone este hook, asi
 *    que si el script falla la pagina se lee igual. Dejar bloques en opacidad
 *    cero esperando a un observador es como se consigue una web en blanco
 *    cuando algo va mal.
 * 2. Se anima una sola vez; reaparecer al subir y bajar marea.
 * 3. Si el sistema pide menos movimiento, no se registra ni el observador.
 */
export function usarRevelado(dependencia?: unknown) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const nodos = Array.from(document.querySelectorAll<HTMLElement>('[data-revelar]'));
    if (nodos.length === 0) return;

    nodos.forEach((nodo, i) => {
      nodo.classList.add('revelar');
      // Escalonado corto entre hermanos, con tope para que el ultimo de una
      // rejilla larga no se haga esperar.
      nodo.style.transitionDelay = `${Math.min(i, 6) * 55}ms`;
    });

    const revelar = (nodo: Element) => nodo.classList.add('revelado');

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          revelar(entrada.target);
          observador.unobserve(entrada.target);
        }
      },
      // Se dispara algo antes de que el bloque toque el borde inferior, para
      // que la aparicion termine justo cuando el ojo llega.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    nodos.forEach((nodo) => observador.observe(nodo));

    // Red de seguridad 1: lo que ya esta en pantalla o por encima se revela de
    // inmediato. Sin esto, quien entra por un enlace con ancla o recarga a
    // media pagina se encuentra bloques invisibles que nunca vuelven a cruzar
    // el umbral.
    for (const nodo of nodos) {
      if (nodo.getBoundingClientRect().top < window.innerHeight) {
        revelar(nodo);
        observador.unobserve(nodo);
      }
    }

    // Red de seguridad 2: pase lo que pase, a los cuatro segundos todo es
    // visible. Un desplazamiento muy rapido puede saltarse el observador, y
    // ningun efecto justifica dejar contenido oculto de forma permanente.
    const rendicion = window.setTimeout(() => {
      nodos.forEach(revelar);
      observador.disconnect();
    }, 4000);

    return () => {
      window.clearTimeout(rendicion);
      observador.disconnect();
    };
  }, [dependencia]);
}
