/**
 * Presentacion de precios.
 *
 * Ecuador usa el dolar estadounidense y el formato es-EC: punto para los
 * miles y coma para los decimales.
 */
export const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(valor);

/** El IVA vigente en Ecuador. Los precios se publican ya con el incluido. */
export const IVA = 0.15;
