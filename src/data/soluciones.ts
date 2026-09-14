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
      {
        nombre: 'Cerradura inteligente con código y huella',
        cantidad: 1,
        marca: 'EZVIZ',
        modelo: 'CS-L2S-11FCP',
      },
      {
        nombre: 'Cámara exterior con visión nocturna a color',
        cantidad: 2,
        marca: 'Hikvision',
        modelo: 'ColorVu DS-2CE10DF0T-LFS',
        especificaciones: [
          { etiqueta: 'Resolución', valor: '1080p' },
          { etiqueta: 'Visión nocturna', valor: 'A color, no en blanco y negro' },
          { etiqueta: 'Instalación', valor: 'Interior y exterior' },
        ],
      },
      {
        nombre: 'Monitor interior para videoportero',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'DS-KH6000-E1',
      },
    ],
    servicios: [
      'Evaluación de accesos y puntos ciegos',
      'Instalación de cerradura y cámaras',
      'Configuración en el teléfono de la familia',
      'Capacitación de uso',
    ],
    // 250,62 de costo mas 25% y IVA, mas 15 de instalacion.
    precioDesde: 375.27,
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
      {
        nombre: 'Cámara exterior con visión nocturna a color',
        cantidad: 4,
        marca: 'Hikvision',
        modelo: 'ColorVu DS-2CE10DF0T-LFS',
        especificaciones: [
          { etiqueta: 'Resolución', valor: '1080p' },
          { etiqueta: 'Visión nocturna', valor: 'A color, no en blanco y negro' },
          { etiqueta: 'Instalación', valor: 'Interior y exterior' },
        ],
      },
      {
        nombre: 'Grabador de ocho canales',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'iDS-7208HQHI-M1/XT',
        especificaciones: [
          { etiqueta: 'Canales', valor: 'Ocho' },
          { etiqueta: 'Resolución', valor: '1080p, compresión H.265' },
          { etiqueta: 'Detección', valor: 'AcuSense: distingue personas y vehículos' },
        ],
      },
      {
        nombre: 'Disco de vigilancia para grabación continua',
        cantidad: 1,
        marca: 'Western Digital',
        modelo: 'Purple WD11PURZ',
        especificaciones: [
          { etiqueta: 'Capacidad', valor: '1 TB' },
          { etiqueta: 'Uso', valor: 'Diseñado para grabar las 24 horas' },
        ],
      },
    ],
    servicios: [
      'Evaluación de cobertura y puntos ciegos',
      'Instalación y cableado de las cámaras',
      'Configuración de grabación y acceso remoto',
      'Capacitación de uso',
    ],
    // 258,45 de costo mas 25% y IVA, mas 15 de instalacion.
    //
    // El disco va dentro del precio a proposito: un grabador sin disco no
    // graba, y cobrarlo aparte es la sorpresa que arruina una instalacion.
    precioDesde: 386.52,
    activa: true,
    orden: 6,
  },
  {
    id: 'casa-con-alarma',
    ambito: 'vivienda',
    slug: 'casa-con-alarma',
    nombre: 'Casa con alarma',
    para: 'Viviendas que quieren aviso inmediato',
    resumen: 'Aviso al teléfono en cuanto alguien abre una puerta o se mueve dentro de la casa vacía.',
    descripcion:
      'Central de alarma inalámbrica con detectores de movimiento en las áreas de paso y sensores en las puertas de acceso. No requiere obra: los equipos se fijan sin cablear. Incluye botón de pánico portátil.',
    equipos: [
      {
        nombre: 'Central de alarma inalámbrica',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PWA48-Kit-WB',
      },
      {
        nombre: 'Detector de movimiento',
        cantidad: 2,
        marca: 'Hikvision',
        modelo: 'DS-PDP15P-EG2-WB',
      },
      {
        nombre: 'Sensor de apertura de puerta o ventana',
        cantidad: 3,
        marca: 'EZVIZ',
        modelo: 'CS-T6-A',
      },
      {
        nombre: 'Botón de pánico portátil',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'DS-PDEBP1-EG2-WB',
      },
    ],
    servicios: [
      'Evaluación de accesos y zonas de paso',
      'Instalación sin obra ni cableado',
      'Configuración de avisos en el teléfono',
      'Capacitación de uso',
    ],
    // 212,81 de costo mas 25% y IVA, mas 15 de instalacion.
    precioDesde: 320.91,
    activa: true,
    orden: 7,
  },
  {
    id: 'equipo-para-estudiar',
    ambito: 'personal',
    slug: 'equipo-para-estudiar',
    nombre: 'Equipo para estudiar',
    para: 'Colegio y universidad',
    resumen:
      'HP de 15,6" con Ryzen 5, 8 GB y SSD de 512 GB, más mochila y ratón, entregado configurado.',
    descripcion:
      'HP 15-fc0250la de 15,6 pulgadas, con Ryzen 5, 8 GB de memoria y disco sólido de 512 GB, acompañado de mochila Klip Xtreme del mismo tamaño y ratón inalámbrico. Llega con Windows 11 Home actualizado, las cuentas creadas y la ofimática instalada: se enciende y se trabaja.',
    equipos: [
      {
        nombre: 'Portátil 15,6"',
        cantidad: 1,
        marca: 'HP',
        modelo: '15-fc0250la',
        especificaciones: [
          { etiqueta: 'Pantalla', valor: '15,6 pulgadas' },
          { etiqueta: 'Procesador', valor: 'AMD Ryzen 5 7520U, hasta 4,3 GHz' },
          { etiqueta: 'Memoria', valor: '8 GB DDR5' },
          { etiqueta: 'Almacenamiento', valor: 'SSD de 512 GB' },
          { etiqueta: 'Gráficos', valor: 'AMD Radeon integrados, sin tarjeta dedicada' },
          { etiqueta: 'Sistema', valor: 'Windows 11 Home' },
          { etiqueta: 'Garantía', valor: '1 año del fabricante' },
        ],
      },
      {
        nombre: 'Mochila para portátil',
        cantidad: 1,
        marca: 'Klip Xtreme',
        modelo: 'KNB-467',
        especificaciones: [
          { etiqueta: 'Capacidad', valor: 'Portátiles de hasta 15,6 pulgadas' },
          { etiqueta: 'Material', valor: 'Nylon 1200D' },
        ],
      },
      {
        nombre: 'Ratón inalámbrico',
        cantidad: 1,
        marca: 'Klip Xtreme',
        modelo: 'KMW-330 Vector',
        especificaciones: [
          { etiqueta: 'Conexión', valor: 'Inalámbrica 2,4 GHz' },
          { etiqueta: 'Sensor', valor: 'Óptico, seis botones' },
        ],
      },
    ],
    servicios: [
      'Sistema actualizado y cuentas configuradas',
      'Ofimática y navegador instalados',
      'Configuración de respaldo en la nube',
      'Explicación de uso y cuidados',
    ],
    // 541,71 de costo mas 12% y IVA, mas 15 de puesta a punto.
    //
    // El portatil entra con precio promocional del distribuidor: 524 frente a
    // 584 de lista. Al vencer la promocion este paquete sube a unos 789, de ahi
    // el aviso.
    precioDesde: 712.72,
    aviso: 'Precio promocional. Confirme disponibilidad antes de cerrar la compra.',
    activa: true,
    orden: 8,
  },
  {
    id: 'equipo-para-trabajar',
    ambito: 'personal',
    slug: 'equipo-para-trabajar',
    nombre: 'Equipo para trabajar',
    para: 'Profesionales y trabajo desde casa',
    resumen:
      'HP de 15,6" con Ryzen 7, 16 GB y SSD de 512 GB, con Windows 11 Pro, funda y ratón.',
    descripcion:
      'HP 15-fc0371la con Ryzen 7, 16 GB de memoria y disco sólido de 512 GB, para quien tiene muchas ventanas abiertas a la vez: hojas de cálculo grandes, videollamada y navegador sin que se arrastre. Se entrega con Windows 11 Pro instalado, más funda de transporte y ratón inalámbrico.',
    equipos: [
      {
        nombre: 'Portátil 15,6"',
        cantidad: 1,
        marca: 'HP',
        modelo: '15-fc0371la',
        especificaciones: [
          { etiqueta: 'Pantalla', valor: '15,6 pulgadas' },
          { etiqueta: 'Procesador', valor: 'AMD Ryzen 7 7730U, hasta 4,5 GHz' },
          { etiqueta: 'Memoria', valor: '16 GB DDR4' },
          { etiqueta: 'Almacenamiento', valor: 'SSD de 512 GB' },
          { etiqueta: 'Gráficos', valor: 'AMD Radeon integrados, sin tarjeta dedicada' },
          { etiqueta: 'Sistema', valor: 'Windows 11 Pro' },
          { etiqueta: 'Garantía', valor: '1 año del fabricante' },
        ],
      },
      {
        nombre: 'Funda de transporte',
        cantidad: 1,
        marca: 'Klip Xtreme',
        modelo: 'SquareShield KNS-220',
        especificaciones: [
          { etiqueta: 'Capacidad', valor: 'Portátiles de hasta 15,6 pulgadas' },
        ],
      },
      {
        nombre: 'Ratón inalámbrico',
        cantidad: 1,
        marca: 'Klip Xtreme',
        modelo: 'KMW-330 Vector',
        especificaciones: [
          { etiqueta: 'Conexión', valor: 'Inalámbrica 2,4 GHz' },
          { etiqueta: 'Sensor', valor: 'Óptico, seis botones' },
        ],
      },
    ],
    servicios: [
      'Windows 11 Pro instalado y actualizado',
      'Ofimática, correo y navegador instalados',
      'Configuración de respaldo en la nube',
      'Traslado de archivos desde el equipo anterior',
    ],
    // 683,44 de costo mas 12% y IVA, mas 15 de puesta a punto.
    //
    // El equipo sale de fabrica sin sistema operativo y el precio NO incluye una
    // licencia comprada: se instala con la imagen propia que el acuerdo vigente
    // con el proveedor permite usar. Es tiempo de trabajo, no costo de material.
    // Si ese acuerdo cambiara, hay que volver a sumar la licencia aqui.
    precioDesde: 895.27,
    activa: true,
    orden: 9,
  },
];
