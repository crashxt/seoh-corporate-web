/**
 * Modelo comercial de la plataforma.
 *
 * Es la razon de ser de la arquitectura modular: se cobra por modulo porque el
 * producto se activa por modulo.
 *
 * NOTA SOBRE ESTAS CIFRAS
 * Son provisionales. La empresa esta en construccion y aun no hay clientes con
 * los que medir el coste real de operar. Cuando los haya, es probable que haya
 * que ajustarlas. Por eso se presentan como precios de lanzamiento.
 *
 * Criterio que no cambia: si mañana sube el coste de la infraestructura
 * —Supabase, Cloudflare, mensajeria—, no se traslada al cliente que ya confio.
 * Se absorbe repartiendolo entre mas clientes.
 */

export type Complemento = { nombre: string; precio: number; detalle: string };

export const COMPLEMENTOS: Complemento[] = [
  {
    nombre: 'WhatsApp',
    precio: 6,
    detalle:
      'Avisos por WhatsApp además del correo. Va aparte porque el envío tiene coste por mensaje.',
  },
  {
    nombre: 'Reportería avanzada',
    precio: 5,
    detalle: 'Informes detallados y cruce de datos, más allá de los reportes incluidos.',
  },
];

export const PLANES = [
  {
    nombre: 'Free',
    precio: 'Sin costo',
    para: 'Condominios de hasta 25 unidades',
    detalle:
      'La gestión financiera completa, sin plazo ni tarjeta. Al superar los límites se pasa de plan sin migrar nada ni perder el historial.',
    incluye: [
      'Hasta 25 unidades: casas o departamentos',
      'Alícuotas, pagos, ingresos y egresos',
      'Reportes generales y cierre mensual',
      'Hasta 25 incidencias',
      'Avisos por correo electrónico',
    ],
    // El tope de usuarios por modulo es una restriccion de la plataforma, no
    // un argumento de venta: al cliente le dice poco y solo genera dudas antes
    // de tiempo. Se conversa en la demostracion, no en la tabla de precios.
    limita: ['Sin notificaciones por WhatsApp'],
    destacado: false,
    accion: 'Empezar sin costo',
  },
  {
    nombre: 'Pro',
    precio: '20 USD / mes',
    para: 'Para activar solo los módulos que use',
    detalle:
      'Se encienden los módulos que su operación necesita —condominio, mantenimiento, procesos, inventario— y se paga por ellos. Si mañana hace falta otro, se añade sin rehacer nada.',
    incluye: [
      'Los módulos que decida activar',
      'Sin los topes del plan gratuito',
      'Usuarios según su operación',
      'Su identidad visual en la plataforma',
    ],
    limita: [],
    destacado: true,
    accion: 'Hablemos de su operación',
  },
  {
    nombre: 'Enterprise',
    precio: '40 USD / mes',
    para: 'Toda la plataforma, sin límites',
    detalle:
      'Todos los módulos activos desde el primer día, sin topes de volumen ni de usuarios, con acompañamiento en la puesta en marcha.',
    incluye: [
      'Todos los módulos, sin excepción',
      'Sin límite de unidades ni de usuarios',
      'Acompañamiento en la implantación',
      'Soporte prioritario',
    ],
    limita: [],
    destacado: false,
    accion: 'Solicitar propuesta',
  },
] as const;

/**
 * Cooperativas de transporte.
 *
 * Esquema aparte porque el negocio es distinto: aqui el tamaño se mide en
 * unidades y la operacion no funciona a medias, asi que no hay version
 * gratuita. Se paga por flota.
 */
export const PLAN_TRANSPORTE = {
  base: { unidades: 100, precio: 25 },
  /**
   * Por unidad adicional, no por bloques.
   *
   * Con bloques de 25 a 10 USD el coste por unidad subia con el tamaño de la
   * flota —de 0,25 a 0,35—, penalizando a las cooperativas grandes, que son
   * las mejores clientes, y desincentivando crecer. Ademas "25 centavos por
   * taxi al mes" se entiende de inmediato y se repite solo entre dirigentes.
   */
  porUnidad: 0.25,
  incluye: [
    'Despacho y asignación de servicios',
    'Registro de unidades, socios y conductores',
    'Encomiendas y seguimiento',
    'Liquidaciones y control financiero',
  ],
};

/** Precio mensual para una flota de N unidades. */
export const precioTransporte = (unidades: number) => {
  const { base, porUnidad } = PLAN_TRANSPORTE;
  if (unidades <= base.unidades) return base.precio;
  return Math.round((base.precio + (unidades - base.unidades) * porUnidad) * 100) / 100;
};

/**
 * Aviso de precios de lanzamiento.
 *
 * Los clientes anclan en el precio que ven: bajarlo despues es facil, subirlo
 * quema. Decir de entrada que son de lanzamiento deja margen para ajustar
 * cuando haya costes reales, sin que parezca una subida a traicion.
 */
export const AVISO_PRECIOS =
  'Precios de lanzamiento. Se mantienen para quien contrate durante esta etapa.';
