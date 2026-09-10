/**
 * Marca SEOH.
 *
 * Sirve WebP con dos anchos y deja un PNG de respaldo. Las medidas intrinsecas
 * evitan que el texto salte cuando la imagen termina de cargar.
 */
type Props = {
  variante: 'cabecera' | 'hero';
  /** Ancho de presentacion en CSS px; alimenta `sizes` y el atributo width. */
  ancho: number;
  className?: string;
  /** La cabecera y el pie repiten la marca: solo la primera necesita anunciarse. */
  decorativo?: boolean;
  prioridad?: boolean;
};

const FUENTES = {
  cabecera: {
    base: '/brand/logo-header',
    anchos: [400, 800],
    proporcion: 810 / 2916,
  },
  hero: {
    base: '/brand/logo-hero',
    anchos: [640, 1100],
    proporcion: 678 / 1536,
  },
} as const;

export default function Logo({ variante, ancho, className, decorativo, prioridad }: Props) {
  const { base, anchos, proporcion } = FUENTES[variante];
  const srcSet = anchos.map((a) => `${base}-${a}.webp ${a}w`).join(', ');

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet} sizes={`${ancho}px`} />
      <img
        src={`${base}.png`}
        alt={decorativo ? '' : 'SEOH DESIGN TECH'}
        aria-hidden={decorativo || undefined}
        width={ancho}
        height={Math.round(ancho * proporcion)}
        loading={prioridad ? 'eager' : 'lazy'}
        // fetchPriority ayuda al LCP cuando la marca es lo primero que se ve.
        fetchPriority={prioridad ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  );
}
