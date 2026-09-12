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
    ambito: 'conjunto',
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
    ambito: 'conjunto',
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
    ambito: 'empresa',
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
  {
    id: 'casa-segura',
    ambito: 'vivienda',
    slug: 'casa-segura',
    nombre: 'Casa segura',
    para: 'Viviendas unifamiliares',
    resumen:
      'Control de quién entra y qué ocurre en casa, desde el teléfono y sin depender de estar presente.',
    descripcion:
      'Cerradura inteligente en la puerta principal, cámaras en los accesos y videoportero. Se administra desde el teléfono: abrir a una visita, revisar quién llegó o recibir aviso cuando alguien se acerca, esté o no en casa.',
    equipos: [
      { nombre: 'Cerradura inteligente con código y huella', cantidad: 1 },
      { nombre: 'Cámara de exterior con visión nocturna', cantidad: 2 },
      { nombre: 'Videoportero con apertura remota', cantidad: 1 },
    ],
    servicios: [
      'Evaluación de accesos y puntos ciegos',
      'Instalación de cerradura y cámaras',
      'Configuración en el teléfono de la familia',
      'Capacitación de uso',
    ],
    precioDesde: null,
    activa: true,
    orden: 4,
  },
  {
    id: 'casa-conectada',
    ambito: 'vivienda',
    slug: 'casa-conectada',
    nombre: 'Casa conectada',
    para: 'Viviendas que quieren automatizar lo cotidiano',
    resumen:
      'Iluminación y puntos de uso gobernados por horario, por voz o desde el teléfono.',
    descripcion:
      'Módulos inteligentes detrás de los interruptores que ya tiene —no hay que picar pared ni cambiar el tablero—, iluminación regulable y una central que los coordina. Se dejan configuradas las escenas de uso diario: encender el ingreso al anochecer, apagar todo al salir, o simular presencia durante un viaje.',
    equipos: [
      { nombre: 'Módulo de interruptor inteligente', cantidad: 4 },
      { nombre: 'Foco inteligente multicolor con control por voz', cantidad: 4 },
      { nombre: 'Tira LED inteligente Wi-Fi', cantidad: 1 },
      { nombre: 'Central de automatización', cantidad: 1 },
    ],
    servicios: [
      'Evaluación del tablero y los circuitos',
      'Instalación de los módulos y la central',
      'Configuración de escenas y horarios',
      'Capacitación de uso',
    ],
    // Unico de los tres paquetes de vivienda con precio cerrado: todo su equipo
    // esta en la lista del mes. Los otros dos siguen bajo cotizacion porque no
    // hay cerradura inteligente ni grabador en stock.
    // 105,50 de costo + 12% + IVA = 135,88, mas 15 de instalacion.
    precioDesde: 150.88,
    activa: true,
    orden: 5,
  },
  {
    id: 'vigilancia-vivienda',
    ambito: 'vivienda',
    slug: 'vigilancia-para-vivienda',
    nombre: 'Vigilancia para vivienda',
    para: 'Casas, locales y consultorios',
    resumen: 'Cámaras con grabación propia, revisables desde cualquier lugar.',
    descripcion:
      'Cámaras en los puntos que importan, con grabador y almacenamiento en el domicilio: la grabación no depende de una suscripción en la nube ni de que haya internet en ese momento. Se revisa desde el teléfono.',
    equipos: [
      { nombre: 'Cámara de vigilancia con visión nocturna', cantidad: 4 },
      { nombre: 'Grabador con disco de almacenamiento', cantidad: 1 },
      { nombre: 'Respaldo eléctrico para el grabador', cantidad: 1 },
    ],
    servicios: [
      'Evaluación de cobertura y puntos ciegos',
      'Instalación y cableado de las cámaras',
      'Configuración de grabación y acceso remoto',
      'Capacitación de uso',
    ],
    precioDesde: null,
    activa: true,
    orden: 6,
  },
];
