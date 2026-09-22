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
    id: 'timbre-instalado',
    ambito: 'vivienda',
    slug: 'timbre-inteligente-instalado',
    nombre: 'Timbre inteligente instalado',
    para: 'Cualquier vivienda, sin obra',
    resumen: 'Vea y hable con quien toca la puerta desde el teléfono, esté donde esté.',
    descripcion:
      'Timbre con cámara de 2K y batería: no necesita cable ni obra, se fija en la entrada y funciona. Cuando alguien toca, el teléfono muestra quién es y permite hablar con esa persona, esté usted en casa o fuera. Distingue una persona de una rama que se mueve, así que no avisa por cualquier cosa.',
    equipos: [
      {
        nombre: 'Timbre de video con batería',
        cantidad: 1,
        marca: 'TP-Link',
        modelo: 'Tapo',
        especificaciones: [
          { etiqueta: 'Resolución', valor: '2K, 5 MP' },
          { etiqueta: 'Visión nocturna', valor: 'A color' },
          { etiqueta: 'Detección', valor: 'Distingue personas de movimiento cualquiera' },
          { etiqueta: 'Alimentación', valor: 'Batería extraíble, sin obra ni cableado' },
          { etiqueta: 'Audio', valor: 'Conversación en dos sentidos' },
        ],
      },
    ],
    servicios: [
      'Instalación inalámbrica sin costo',
      'Configuración en el teléfono de la familia',
      'Ajuste de zonas y sensibilidad de aviso',
      'Capacitación de uso',
    ],
    complementos: [
      {
        nombre: 'Central con timbre interior',
        marca: 'TP-Link',
        modelo: 'Tapo H200',
        // 22,80 de costo mas 25% y IVA. En las listas no hay H100; el H200 hace
        // lo mismo y ademas graba en microSD, asi que no depende de la nube.
        precio: 32.78,
        detalle:
          'Suena dentro de la casa cuando alguien toca, para no depender de tener el teléfono a mano. Además guarda la grabación en memoria propia, sin suscripción a la nube.',
      },
    ],
    // 72,00 de costo mas 25% y IVA. Sin cargo de instalacion: el timbre va con
    // bateria y adhesivo, son quince minutos. Regalarla es mas barato que el
    // descuento que habria que hacer para vender lo mismo sin ella, y es el
    // producto de entrada mas facil de cerrar del catalogo.
    precioDesde: 103.5,
    activa: true,
    orden: 4,
  },
  {
    id: 'luz-por-voz',
    ambito: 'vivienda',
    slug: 'luz-por-voz',
    nombre: 'Luz por voz',
    para: 'Primer paso en domótica, sin obra',
    resumen: 'Encienda y apague la luz hablando, o desde el teléfono cuando no está en casa.',
    descripcion:
      'Tres focos inteligentes en los puntos que más se usan y un altavoz con Alexa. Los focos se enroscan donde ya hay lámpara —no hay que tocar el tablero ni cambiar interruptores— y responden por voz, por horario o desde el teléfono. Es la forma más barata de probar domótica en casa, y todo lo que se añada después funciona con el mismo altavoz.',
    equipos: [
      {
        nombre: 'Altavoz con Alexa',
        cantidad: 1,
        marca: 'Amazon',
        modelo: 'Echo Dot 5.ª generación',
        especificaciones: [
          { etiqueta: 'Control', valor: 'Por voz, sin tocar nada' },
          { etiqueta: 'Además', valor: 'Música, alarmas, preguntas y recordatorios' },
        ],
      },
      {
        nombre: 'Foco inteligente multicolor',
        cantidad: 3,
        marca: 'TP-Link',
        modelo: 'Tapo',
        especificaciones: [
          { etiqueta: 'Brillo', valor: '1.055 lúmenes' },
          { etiqueta: 'Color', valor: 'Blanco regulable y multicolor' },
          { etiqueta: 'Conexión', valor: 'Wi-Fi directo, sin central adicional' },
          { etiqueta: 'Instalación', valor: 'Se enrosca en la lámpara existente' },
        ],
      },
    ],
    servicios: [
      'Configuración del altavoz y la cuenta',
      'Vinculación de los focos por voz',
      'Escenas y horarios según su rutina',
      'Capacitación de uso a la familia',
    ],
    complementos: [
      {
        nombre: 'Tira LED inteligente',
        marca: 'TP-Link',
        modelo: 'Tapo',
        // 15,90 de costo mas 25% y IVA.
        precio: 22.86,
        detalle:
          'Luz indirecta bajo un mueble, tras el televisor o en una escalera. Mismo control por voz y misma aplicación.',
      },
      {
        nombre: 'Foco adicional',
        marca: 'TP-Link',
        modelo: 'Tapo',
        // 6,00 de costo mas 25% y IVA.
        precio: 8.63,
        detalle: 'Para sumar una habitación más al mismo sistema.',
      },
    ],
    // 82,00 de costo mas 25% y IVA. Sin cargo de instalacion: no hay obra, solo
    // enroscar focos y configurar. Es el punto de entrada mas barato del
    // catalogo y la puerta natural a Casa conectada.
    precioDesde: 117.88,
    activa: true,
    orden: 5,
  },
  {
    id: 'casa-segura',
    ambito: 'vivienda',
    slug: 'casa-segura',
    nombre: 'Casa segura',
    para: 'Viviendas unifamiliares',
    resumen: 'Control de quién entra: abrir desde el teléfono y ver quién toca antes de abrir.',
    descripcion:
      'Cerradura inteligente en la puerta principal y timbre con cámara en la entrada. Se administra desde el teléfono: abrir a una visita, ver quién toca antes de abrir y recibir aviso cuando alguien se acerca, esté o no en casa. Ninguno de los dos requiere obra: el timbre funciona con batería.',
    equipos: [
      {
        nombre: 'Cerradura inteligente con código y huella',
        cantidad: 1,
        marca: 'EZVIZ',
        modelo: 'CS-L2S-11FCP',
        especificaciones: [
          { etiqueta: 'Apertura', valor: 'Código, huella y aplicación' },
          { etiqueta: 'Conexión', valor: 'Wi-Fi, con su propia aplicación' },
        ],
      },
      {
        nombre: 'Timbre de video con batería',
        cantidad: 1,
        marca: 'TP-Link',
        modelo: 'Tapo',
        especificaciones: [
          { etiqueta: 'Resolución', valor: '2K, 5 MP' },
          { etiqueta: 'Visión nocturna', valor: 'A color' },
          { etiqueta: 'Detección', valor: 'Distingue personas de movimiento cualquiera' },
          { etiqueta: 'Alimentación', valor: 'Batería extraíble, sin obra ni cableado' },
        ],
      },
    ],
    complementos: [
      {
        nombre: 'Central con timbre interior',
        marca: 'TP-Link',
        modelo: 'Tapo H200',
        // 22,80 de costo mas 25% y IVA.
        precio: 32.78,
        detalle:
          'Suena dentro de la casa cuando alguien toca, para no depender de tener el teléfono a mano. Además guarda la grabación en memoria propia, sin suscripción a la nube.',
      },
    ],
    servicios: [
      'Evaluación de la puerta y el punto de entrada',
      'Instalación de cerradura y timbre',
      'Configuración en el teléfono de la familia',
      'Capacitación de uso',
    ],
    // 270,72 de costo mas 25% y IVA, mas 15 de instalacion.
    //
    // Antes llevaba dos camaras analogicas y un monitor interior. Ninguna de las
    // dos cosas funcionaba: las camaras Turbo HD no graban sin un DVR, y un
    // monitor sin placa de calle no es un videoportero. Se sustituyen por un
    // timbre con camara, que es un producto completo por si solo, y la
    // vigilancia queda donde corresponde: en su propio paquete, con grabador.
    precioDesde: 404.16,
    activa: true,
    orden: 9,
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
    complementos: [
      {
        nombre: 'Altavoz con Alexa',
        marca: 'Amazon',
        modelo: 'Echo Dot 5.ª generación',
        // 64,00 de costo mas 25% y IVA.
        precio: 92.0,
        detalle:
          'Enciende y apaga por voz lo que el paquete ya controla desde el teléfono: «Alexa, apaga la sala». Útil cuando se tienen las manos ocupadas o se está saliendo.',
      },
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
    orden: 6,
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
    orden: 8,
  },
  {
    id: 'casa-con-alarma',
    ambito: 'vivienda',
    slug: 'casa-con-alarma',
    nombre: 'Casa con alarma',
    para: 'Viviendas que quieren aviso inmediato',
    resumen: 'Aviso al teléfono y sirena en la calle en cuanto alguien se mueve dentro de la casa vacía.',
    descripcion:
      'Central de alarma inalámbrica con detectores de movimiento en las áreas de paso y sirena exterior. Todos los equipos son de la misma familia AX Pro y hablan el protocolo del propio panel, que es lo que garantiza que se comuniquen. No requiere obra: se fijan sin cablear. Incluye botón de pánico portátil.',
    equipos: [
      {
        nombre: 'Central de alarma inalámbrica',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PWA48-Kit-WB',
      },
      {
        nombre: 'Detector de movimiento',
        cantidad: 3,
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PDP15P-EG2-WB',
        especificaciones: [
          { etiqueta: 'Conexión', valor: 'Inalámbrica, protocolo Tri-X del propio panel' },
          { etiqueta: 'Instalación', valor: 'Sin obra ni cableado' },
        ],
      },
      {
        nombre: 'Sirena exterior',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PS1-E-WB',
      },
      {
        nombre: 'Botón de pánico portátil',
        cantidad: 1,
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PDEBP1-EG2-WB',
      },
    ],
    complementos: [
      {
        nombre: 'Detector de fuga de agua',
        marca: 'Hikvision',
        modelo: 'AX Pro DS-PDWL-E-WB',
        // 24,33 de costo mas 25% y IVA.
        precio: 34.97,
        detalle:
          'Avisa al teléfono en cuanto detecta agua en el piso. Se coloca junto a la cisterna, el calefón o la lavadora, donde una fuga puede pasar días sin que nadie la vea.',
      },
    ],
    servicios: [
      'Evaluación de accesos y zonas de paso',
      'Instalación sin obra ni cableado',
      'Configuración de avisos en el teléfono',
      'Capacitación de uso',
    ],
    // 232,86 de costo mas 25% y IVA, mas 15 de instalacion.
    //
    // Llevaba tres sensores de apertura EZVIZ que NO se integran con este panel:
    // AX Pro usa el protocolo propietario Tri-X y EZVIZ es otro ecosistema. No
    // hay contacto magnetico AX Pro disponible en el distribuidor, asi que la
    // cobertura se resuelve con un detector de movimiento mas, y se anade sirena
    // exterior, que es lo que de verdad disuade.
    //
    // Al componer un paquete: comprobar que todo comparta familia y protocolo.
    precioDesde: 349.74,
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
    orden: 10,
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
    orden: 11,
  },
];
