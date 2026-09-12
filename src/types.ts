export type ProductDocument = {
  id: string;
  name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  is_active: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  image_url?: string | null;
  image_path?: string | null;
  is_active: boolean;
  sort_order: number;
  documents?: ProductDocument[];

  /** Marca comercial, para filtrar y para la ficha. */
  brand?: string | null;
  /** Codigo del proveedor. Es lo que pide un cliente al cotizar. */
  code?: string | null;
  /**
   * Precio de venta al publico, con IVA incluido.
   *
   * Se muestra como referencia, no para cerrar una compra en linea: el equipo
   * se vende dentro de una solucion —instalacion, configuracion y la
   * plataforma que lo administra— y el precio final sale de la cotizacion.
   * Sin precio, la ficha lo indica en lugar de mostrar un cero.
   */
  price?: number | null;
};

/** Equipo incluido en una solucion, con su cantidad. */
export type EquipoDeSolucion = { nombre: string; cantidad: number };

/**
 * Solucion: equipo mas servicio, vendido como paquete.
 *
 * El precio se publica como "desde" porque el alcance real depende del sitio
 * —metros, puntos, unidades—, y porque una cifra cerrada invita a comparar
 * pieza por pieza, que es justo lo que el paquete evita.
 */
export type Solucion = {
  id: string;
  slug: string;
  nombre: string;
  /** A quien va dirigida. Es lo primero que lee un cliente para descartarse. */
  para: string;
  resumen: string;
  descripcion: string;
  equipos: EquipoDeSolucion[];
  servicios: string[];
  precioDesde?: number | null;
  activa: boolean;
  orden: number;
};
