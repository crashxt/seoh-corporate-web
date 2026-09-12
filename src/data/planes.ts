/**
 * Modelo comercial de la plataforma.
 *
 * Es la razon de ser de la arquitectura modular: se cobra por modulo porque el
 * producto se activa por modulo.
 *
 * El plan gratuito no es una version recortada de prueba: cubre la operacion
 * financiera completa de un condominio pequeno. Es deliberado. Una empresa sin
 * cartera necesita que el cliente entre sin riesgo, y el condominio que crece
 * por encima de 50 unidades o necesita WhatsApp ya esta dentro.
 */

export type Complemento = { nombre: string; precio: number; detalle: string };

export const PLAN_COMPLETO = 40;

export const COMPLEMENTOS: Complemento[] = [
  {
    nombre: 'WhatsApp',
    precio: 6,
    detalle:
      'Avisos y notificaciones por WhatsApp además del correo. Se cobra aparte porque el envío tiene coste por mensaje.',
  },
  {
    nombre: 'Reportería avanzada',
    precio: 5,
    detalle: 'Informes detallados y cruces de datos más allá de los reportes incluidos.',
  },
];

export const PLANES = [
  {
    nombre: 'Gratuito',
    precio: 'Sin costo',
    para: 'Condominios de hasta 50 unidades',
    detalle:
      'La operación financiera completa, sin plazo ni tarjeta. Al superar los límites se pasa al plan completo sin migrar nada.',
    incluye: [
      'Hasta 50 unidades: casas o departamentos',
      'Alícuotas, pagos, ingresos y egresos',
      'Reportes generales y cierre mensual',
      'Hasta 25 incidencias',
      'Avisos por correo electrónico',
    ],
    limita: [
      'Los demás módulos quedan en 2 usuarios',
      'Sin notificaciones por WhatsApp',
    ],
    destacado: false,
    accion: 'Empezar sin costo',
  },
  {
    nombre: 'Completo',
    precio: `${PLAN_COMPLETO} USD / mes`,
    para: 'Para operar sin límites de volumen',
    detalle:
      'Todos los módulos activos y sin los topes del plan gratuito. Los complementos se añaden solo si se necesitan.',
    incluye: [
      'Todos los módulos, sin límite de unidades',
      'Incidencias, tareas, reservas y visitantes',
      'Usuarios sin restricción',
      'Su identidad visual en la plataforma',
      'Soporte y acompañamiento',
    ],
    limita: [],
    destacado: true,
    accion: 'Hablemos de su operación',
  },
] as const;
