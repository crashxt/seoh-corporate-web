import {
  Building2,
  ClipboardCheck,
  Car,
  Workflow,
  Handshake,
  type LucideIcon,
} from 'lucide-react';

/**
 * Verticales de la plataforma modular.
 *
 * Cada vertical es un conjunto de modulos que se activa por organizacion sobre
 * el mismo nucleo. El estado es informacion comercial sensible: describe con
 * honestidad en que punto esta cada uno, sin prometer lo que no existe.
 */
export type EstadoVertical = 'operativo' | 'implementacion' | 'diseno';

export type Vertical = {
  slug: string;
  nombre: string;
  icono: LucideIcon;
  /** Frase de una linea para tarjetas y menus. */
  resumen: string;
  /** Parrafo para la pagina de soluciones. */
  descripcion: string;
  /** Capacidades concretas; evitar adjetivos, nombrar funciones reales. */
  capacidades: string[];
  estado: EstadoVertical;
};

/**
 * Etiquetas visibles.
 *
 * 'operativo' se reserva para cuando haya clientes usando el vertical en
 * produccion. Prometer de mas trae al cliente equivocado y lo pierde en la
 * primera reunion.
 */
export const ETIQUETA_ESTADO: Record<EstadoVertical, string> = {
  operativo: 'Operativo',
  implementacion: 'En implementación',
  diseno: 'En diseño',
};

export const VERTICALES: Vertical[] = [
  {
    slug: 'condominios',
    nombre: 'Administración de condominios',
    icono: Building2,
    resumen: 'Conjuntos, unidades, incidencias, reservas, visitantes y finanzas.',
    descripcion:
      'Gestión completa de conjuntos residenciales: desde el registro de unidades y ocupaciones hasta la atención de incidencias, la reserva de áreas comunes y el control de visitantes. Residentes, conserjería y administración trabajan sobre la misma información, cada uno con el alcance que le corresponde.',
    capacidades: [
      'Conjuntos, unidades y ocupaciones',
      'Incidencias con bitácora, evidencias y notificaciones',
      'Plantillas de trabajo, checklists y sesiones',
      'Comunicados y reservas de áreas comunes',
      'Visitantes, autorizaciones y control de accesos',
      'Alícuotas, cuotas extraordinarias y estados de cuenta',
    ],
    estado: 'implementacion',
  },
  {
    slug: 'mantenimiento',
    nombre: 'Inventario y mantenimiento',
    icono: ClipboardCheck,
    resumen: 'Activos, órdenes de trabajo, checklists y evidencia de ejecución.',
    descripcion:
      'Control del ciclo de vida de equipos y activos: qué hay, dónde está, cuándo toca intervenirlo y quién lo hizo. Cada intervención deja evidencia verificable, con historial consultable por activo.',
    capacidades: [
      'Inventario de activos con ubicación y estado',
      'Programación de mantenimientos preventivos',
      'Órdenes de trabajo y asignación a técnicos',
      'Checklists de ejecución con evidencia fotográfica',
      'Historial y trazabilidad por activo',
    ],
    estado: 'diseno',
  },
  {
    slug: 'transporte',
    nombre: 'Cooperativas de transporte',
    icono: Car,
    resumen: 'Despacho, unidades, encomiendas y control financiero.',
    descripcion:
      'Operación diaria de cooperativas de taxis y transporte: despacho de servicios, gestión de unidades y socios, encomiendas y la liquidación económica que las sostiene.',
    capacidades: [
      'Despacho y asignación de servicios',
      'Registro de unidades, socios y conductores',
      'Encomiendas y seguimiento de envíos',
      'Liquidaciones, aportes y control financiero',
    ],
    estado: 'diseno',
  },
  {
    slug: 'procesos',
    nombre: 'Gestión de procesos (BPM)',
    icono: Workflow,
    resumen: 'Flujos, tareas, aprobaciones y trazabilidad documental.',
    descripcion:
      'Convierte procedimientos que hoy viven en correos y hojas de cálculo en flujos con responsables, plazos y evidencia. Construido sobre el núcleo de tareas y archivos de la plataforma.',
    capacidades: [
      'Tareas con responsables, plazos y comentarios',
      'Aprobaciones por rol y nivel de autoridad',
      'Archivos privados con permisos por organización',
      'Calendario y notificaciones dentro de la aplicación',
      'Auditoría de quién hizo qué y cuándo',
    ],
    estado: 'implementacion',
  },
  {
    slug: 'comercial',
    nombre: 'Relación con clientes (CRM)',
    icono: Handshake,
    resumen: 'Clientes, oportunidades y seguimiento comercial.',
    descripcion:
      'Seguimiento de la relación comercial sobre la misma base de organizaciones y permisos, sin duplicar catálogos de clientes entre herramientas.',
    capacidades: [
      'Registro unificado de clientes y contactos',
      'Oportunidades con etapas y responsables',
      'Actividades y recordatorios de seguimiento',
      'Planes, suscripciones y ciclo de vida comercial',
    ],
    estado: 'diseno',
  },
];

export const buscarVertical = (slug: string) => VERTICALES.find((v) => v.slug === slug);
