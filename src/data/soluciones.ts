import type { Solucion } from '../types';

/**
 * Soluciones de respaldo.
 *
 * Se usan mientras no haya Supabase configurado, igual que el catalogo de
 * equipos. En cuanto la base este conectada, estas se sustituyen por las que
 * se administren desde el panel.
 *
 * Por que existen las soluciones y no solo productos sueltos: SEOH compra a
 * los mismos mayoristas que venden al publico, asi que el equipo suelto deja
 * entre 2 y 10 dolares por unidad. Empaquetado con instalacion y puesta en
 * marcha, el servicio es el 66-76% del precio y ya no hay con que compararlo.
 */
export const solucionesRespaldo: Solucion[] = [
  {
    id: 'wifi-areas-comunes',
    slug: 'wifi-areas-comunes',
    nombre: 'Wi-Fi para áreas comunes',
    para: 'Conjuntos residenciales de hasta 60 unidades',
    resumen: 'Cobertura estable en ingreso, salón comunal y áreas deportivas, con red independiente para visitas.',
    descripcion:
      'Evaluamos la cobertura real del conjunto, instalamos los puntos de acceso donde se requieren y dejamos configurada una red de visitas independiente de la administración. Se entrega en funcionamiento y con el personal capacitado.',
    equipos: [
      { nombre: 'Access Point TP-Link EAP653 AX3000', cantidad: 3 },
      { nombre: 'Router de borde doble banda', cantidad: 1 },
    ],
    servicios: [
      'Evaluación y diseño de cobertura',
      'Instalación y cableado de los puntos',
      'Configuración y red de visitas',
      'Capacitación a la administración',
    ],
    precioDesde: 889.46,
    activa: true,
    orden: 1,
  },
  {
    id: 'proteccion-electrica',
    slug: 'proteccion-electrica-cuarto-equipos',
    nombre: 'Protección eléctrica del cuarto de equipos',
    para: 'Conserjerías, cuartos de rack y puntos de control',
    resumen: 'Respaldo y regulación para que cámaras, grabador y red mantengan servicio ante cortes y variaciones de voltaje.',
    descripcion:
      'Revisamos la carga conectada, dimensionamos el respaldo necesario e instalamos regulación y UPS. Se entregan por escrito las pruebas de autonomía, para que la administración conozca el tiempo de respaldo disponible.',
    equipos: [
      { nombre: 'UPS APC BVG900-LM 900VA', cantidad: 1 },
      { nombre: 'Regulador CDP AVR1808 1800VA', cantidad: 1 },
    ],
    servicios: [
      'Revisión de carga y dimensionamiento',
      'Instalación y puesta en marcha',
      'Pruebas de autonomía y entrega de documentación',
    ],
    precioDesde: 354.19,
    activa: true,
    orden: 2,
  },
  {
    id: 'conectividad-oficina',
    slug: 'conectividad-oficina-pequena',
    nombre: 'Conectividad para oficina pequeña',
    para: 'Cooperativas y pymes de hasta 15 puestos',
    resumen: 'Conexión estable, respaldo eléctrico y red de visitas independiente de la interna.',
    descripcion:
      'Diseñamos el direccionamiento, organizamos el rack e instalamos la red completa con respaldo eléctrico. Incluye treinta días de soporte para realizar los ajustes que surjan con el uso.',
    equipos: [
      { nombre: 'Access Point TP-Link EAP653 AX3000', cantidad: 2 },
      { nombre: 'Router de borde doble banda', cantidad: 1 },
      { nombre: 'UPS APC BV500', cantidad: 1 },
    ],
    servicios: [
      'Diseño de red y direccionamiento',
      'Instalación y organización del rack',
      'Configuración y red de visitas',
      'Soporte durante los primeros treinta días',
    ],
    precioDesde: 784.3,
    activa: true,
    orden: 3,
  },
];
