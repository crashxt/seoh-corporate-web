import type { ReactNode } from 'react';

/** Cabecera comun de las paginas interiores. */
export default function PageHero({
  antetitulo,
  titulo,
  children,
}: {
  antetitulo: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <section className="cabecera-pagina">
      <span className="antetitulo">{antetitulo}</span>
      <h1>{titulo}</h1>
      {children && <p>{children}</p>}
    </section>
  );
}
