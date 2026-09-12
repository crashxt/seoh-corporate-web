/**
 * Difumina datos de terceros antes de tomar capturas de la plataforma.
 *
 * COMO USARLO
 *   1. Abra la plataforma e inicie sesión.
 *   2. Vaya a la pantalla que quiere capturar.
 *   3. Pulse F12, abra la pestaña «Consola».
 *   4. Pegue este archivo completo y pulse Enter.
 *   5. Tome la captura con la herramienta de recortes de Windows.
 *
 * Difumina nombres de conjuntos, correos, teléfonos y cédulas. Se aplica sobre
 * el elemento que contiene el texto, no sobre el bloque entero, para que la
 * pantalla siga entendiéndose.
 *
 * Al recargar la página el efecto desaparece: no modifica ningún dato, solo lo
 * tapa mientras se toma la fotografía.
 */
(() => {
  /**
   * Añada aquí los nombres propios que aparezcan en su entorno.
   * Todo lo que coincida se difumina.
   */
  const NOMBRES = [
    'Solar del Rio',
    'Solar del Río',
    // 'Nombre del conjunto',
    // 'Nombre de la cooperativa',
  ];

  const PATRONES = [
    ...NOMBRES.map((n) => new RegExp(n.replace(/\s+/g, '\\s+'), 'i')),
    /[\w.+-]+@[\w-]+\.[\w.]+/, // correos
    /\+?593\s?\d[\d\s-]{7,}/, // teléfonos
    /\b\d{10}\b/, // cédulas
  ];

  const contieneDatoSensible = (texto) => PATRONES.some((p) => p.test(texto));

  let tapados = 0;

  // 1. Elementos hoja cuyo texto completo es sensible.
  const recorrer = (nodo) => {
    for (const hijo of nodo.children) {
      if (hijo.children.length === 0) {
        if (contieneDatoSensible(hijo.textContent || '')) {
          hijo.style.filter = 'blur(5px)';
          hijo.style.userSelect = 'none';
          tapados++;
        }
      } else {
        recorrer(hijo);
      }
    }
  };
  recorrer(document.body);

  // 2. Nodos de texto sueltos dentro de elementos que sí tienen hijos. Se
  //    envuelven en un span propio para no emborronar a sus hermanos.
  const iterador = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  const pendientes = [];
  let nodo;
  while ((nodo = iterador.nextNode())) {
    if (!contieneDatoSensible(nodo.textContent || '')) continue;
    let ancestro = nodo.parentElement;
    let yaTapado = false;
    while (ancestro) {
      if ((ancestro.style?.filter || '').includes('blur')) {
        yaTapado = true;
        break;
      }
      ancestro = ancestro.parentElement;
    }
    if (!yaTapado) pendientes.push(nodo);
  }
  for (const texto of pendientes) {
    const envoltura = document.createElement('span');
    envoltura.style.filter = 'blur(5px)';
    envoltura.style.userSelect = 'none';
    texto.parentNode.replaceChild(envoltura, texto);
    envoltura.appendChild(texto);
    tapados++;
  }

  // 3. Las opciones de un desplegable no admiten filtros CSS: se sustituye su
  //    texto, que es lo único que sale en la captura.
  document.querySelectorAll('option').forEach((opcion) => {
    if (contieneDatoSensible(opcion.textContent || '')) {
      opcion.textContent = 'Conjunto Los Álamos';
      tapados++;
    }
  });

  // 4. Comprobación: si algo quedó legible, se avisa en lugar de dar por hecho
  //    que salió bien.
  const revision = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  let legible = 0;
  let n;
  while ((n = revision.nextNode())) {
    if (!contieneDatoSensible(n.textContent || '')) continue;
    let a = n.parentElement;
    let tapado = false;
    while (a) {
      if ((a.style?.filter || '').includes('blur')) {
        tapado = true;
        break;
      }
      a = a.parentElement;
    }
    if (!tapado) legible++;
  }

  console.log(
    legible === 0
      ? `✅ ${tapados} elementos difuminados. No queda ningún dato legible: puede capturar.`
      : `⚠️ ${tapados} difuminados, pero quedan ${legible} sin tapar. Añada ese nombre a la lista NOMBRES y vuelva a ejecutar.`,
  );
})();
