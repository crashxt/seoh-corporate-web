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
