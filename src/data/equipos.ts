/**
 * Segunda linea de negocio: venta e instalacion de equipos tecnologicos.
 *
 * Las categorias ya no se escriben aqui a mano. Antes esta lista decia
 * "Seguridad, Automatizacion, Infraestructura" mientras el catalogo publicado
 * solo tenia "Redes" y "Energia": las tres entradas del menu y las tres
 * tarjetas de la portada llevaban a una pagina vacia, en produccion.
 *
 * Ahora salen de categorias-equipos.ts, que escribe `npm run catalogo` con las
 * categorias que de verdad tienen producto. Si una se queda sin stock el mes
 * que viene, desaparece del menu sin que nadie tenga que acordarse.
 */
export { CATEGORIAS_EQUIPOS, DESCRIPCION_CATEGORIA } from './categorias-equipos';

export type CategoriaEquipo = string;
