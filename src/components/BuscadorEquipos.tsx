import { Search, X } from 'lucide-react';

/**
 * Buscador del catalogo.
 *
 * Filtra en el navegador sobre el catalogo ya cargado, sin ir al servidor en
 * cada tecla. Con unos cientos de productos es instantaneo y evita depender de
 * la conexion, que es lo que mas falla en movil.
 */
export default function BuscadorEquipos({
  valor,
  alCambiar,
  resultados,
}: {
  valor: string;
  alCambiar: (texto: string) => void;
  resultados: number;
}) {
  return (
    <div className="buscador">
      <label className="buscador-campo">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={valor}
          onChange={(evento) => alCambiar(evento.target.value)}
          placeholder="Buscar por nombre, marca o código"
          aria-label="Buscar en el catálogo de equipos"
        />
        {valor && (
          <button type="button" onClick={() => alCambiar('')} aria-label="Limpiar búsqueda">
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </label>

      {/* El recuento se anuncia a lectores de pantalla: quien no ve la rejilla
          necesita saber que la busqueda tuvo efecto. */}
      <p className="buscador-recuento" role="status" aria-live="polite">
        {valor
          ? `${resultados} ${resultados === 1 ? 'resultado' : 'resultados'} para «${valor}»`
          : `${resultados} equipos`}
      </p>
    </div>
  );
}
