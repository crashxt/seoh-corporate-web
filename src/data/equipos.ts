/**
 * Segunda linea de negocio: venta e instalacion de equipos tecnologicos.
 *
 * El catalogo real vive en Supabase (ver services/products.ts) y cae en
 * `fallbackProducts` cuando no hay conexion configurada. Aqui solo se fija el
 * orden en que se presentan las categorias, que no debe depender de como
 * vuelvan ordenadas de la base.
 */
export const CATEGORIAS_EQUIPOS = ['Seguridad', 'Automatización', 'Infraestructura'] as const;

export type CategoriaEquipo = (typeof CATEGORIAS_EQUIPOS)[number];

export const DESCRIPCION_CATEGORIA: Record<CategoriaEquipo, string> = {
  Seguridad: 'Videovigilancia, alarmas y control de acceso para hogares, condominios y empresas.',
  Automatización: 'Domótica e integración de dispositivos para iluminación, clima y accesos.',
  Infraestructura: 'Redes cableadas, Wi-Fi y equipamiento para sostener la operación.',
};
