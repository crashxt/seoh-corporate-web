/**
 * Modelo comercial de la plataforma.
 *
 * Es la razon de ser de la arquitectura modular: se cobra por modulo porque el
 * producto se activa por modulo. Una organizacion empieza gratis con lo basico
 * y paga solo lo que enciende.
 *
 * Las cifras concretas de cada modulo estan por definir. Hasta entonces se
 * comunica lo que si esta decidido —que hay plan gratuito y desde cuanto
 * arranca el de pago— en lugar de inventar una tabla de precios que luego
 * habria que desdecir.
 */
export const PLANES = [
  {
    nombre: 'Gratuito',
    precio: 'Sin costo',
    para: 'Para empezar y probar con su propia operación',
    detalle:
      'Acceso a las aplicaciones con límites de uso. Sin tarjeta, sin plazo y sin compromiso de permanencia.',
    incluye: [
      'Su propia organización, aislada del resto',
      'Identidad, roles y permisos',
      'Tareas, archivos y notificaciones',
      'Límites de volumen y de usuarios',
    ],
    destacado: false,
  },
  {
    nombre: 'Por módulos',
    precio: 'Desde 20 USD / mes',
    para: 'Para operar de verdad, activando solo lo que usa',
    detalle:
      'Se activa el módulo que su operación necesita y se paga por él. Si mañana hace falta otro, se enciende sin rehacer nada.',
    incluye: [
      'Todo lo del plan gratuito, sin límites',
      'Los módulos que decida activar',
      'Su identidad visual en la plataforma',
      'Soporte y acompañamiento',
    ],
    destacado: true,
  },
] as const;
