import {
  Boxes,
  Building,
  Fingerprint,
  BellRing,
  FolderLock,
  Palette,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/**
 * El nucleo comun de la plataforma: lo que toda organizacion recibe antes de
 * activar un solo modulo. Es el argumento diferenciador frente a encargar un
 * desarrollo desde cero.
 */
export type Capacidad = {
  icono: LucideIcon;
  titulo: string;
  texto: string;
};

export const NUCLEO: Capacidad[] = [
  {
    icono: Fingerprint,
    titulo: 'Identidad y accesos',
    texto:
      'Autenticación, invitaciones con caducidad, recuperación de contraseña y control de sesión, resueltos una sola vez para todos los módulos.',
  },
  {
    icono: ShieldCheck,
    titulo: 'Roles y permisos',
    texto:
      'Permisos agrupados por aplicación y jerarquía de delegación: cada persona ve exactamente lo que su rol permite, ni más ni menos.',
  },
  {
    icono: Building,
    titulo: 'Organizaciones aisladas',
    texto:
      'Cada cliente opera en su propio entorno. Los datos de una organización no son alcanzables desde otra, y así se verifica de forma automatizada.',
  },
  {
    icono: Boxes,
    titulo: 'Módulos activables',
    texto:
      'Las aplicaciones y funcionalidades se habilitan por organización. Se contrata lo que se usa y se amplía sin rehacer nada.',
  },
  {
    icono: FolderLock,
    titulo: 'Archivos y evidencias',
    texto:
      'Almacenamiento privado con permisos por organización, para documentos, respaldos y evidencia fotográfica de trabajos.',
  },
  {
    icono: BellRing,
    titulo: 'Tareas y notificaciones',
    texto:
      'Tareas con responsables y plazos, comentarios, calendario y avisos dentro de la aplicación, disponibles para cualquier módulo.',
  },
  {
    icono: Palette,
    titulo: 'Identidad visual propia',
    texto:
      'Cada organización presenta la plataforma con su propia marca ante sus usuarios.',
  },
  {
    icono: ScrollText,
    titulo: 'Auditoría',
    texto:
      'Registro de quién hizo qué y cuándo, incluido el acceso de soporte, que es temporal y queda asentado.',
  },
];

/** Como se traduce el modelo modular en un proyecto real. */
export const COMO_TRABAJAMOS = [
  {
    paso: '01',
    titulo: 'Entendemos la operación',
    texto:
      'Levantamos cómo funciona hoy la organización: quién hace qué, con qué información y dónde se pierde tiempo.',
  },
  {
    paso: '02',
    titulo: 'Definimos los módulos',
    texto:
      'Elegimos qué se resuelve con lo que la plataforma ya tiene y qué requiere desarrollo específico para ese negocio.',
  },
  {
    paso: '03',
    titulo: 'Configuramos el entorno',
    texto:
      'Se crea la organización con sus roles, permisos e identidad visual, y se activan únicamente los módulos acordados.',
  },
  {
    paso: '04',
    titulo: 'Acompañamos la puesta en marcha',
    texto:
      'Migración de información, formación al equipo y soporte durante la adopción, con ajustes sobre uso real.',
  },
];
