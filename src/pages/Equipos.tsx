import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Network } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { getProducts } from '../services/products';
import type { Product } from '../types';

const TODAS = 'Todos';

export default function Equipos() {
  const [equipos, setEquipos] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [params, setParams] = useSearchParams();

  const categoriaActiva = params.get('categoria') ?? TODAS;

  useEffect(() => {
    getProducts()
      .then(setEquipos)
      .catch(() => setError('No fue posible cargar el catálogo. Inténtalo de nuevo más tarde.'))
      .finally(() => setCargando(false));
  }, []);

  // Las categorias salen del propio catalogo: si se agrega una en la base, el
  // filtro aparece solo, sin tocar el codigo.
  const categorias = useMemo(
    () => [TODAS, ...new Set(equipos.map((equipo) => equipo.category))],
    [equipos],
  );

  const visibles =
    categoriaActiva === TODAS
      ? equipos
      : equipos.filter((equipo) => equipo.category === categoriaActiva);

  return (
    <>
      <Seo
        title="Equipos y domótica"
        description="Catálogo de equipamiento tecnológico: videovigilancia, alarmas, control de acceso, domótica y redes para hogares, condominios y empresas."
      />

      <PageHero antetitulo="EQUIPOS Y DOMÓTICA" titulo="Tecnología para proteger, conectar y automatizar">
        Seleccionamos, instalamos y damos soporte a equipamiento técnico. Consulta las categorías y
        entra al detalle de cada solución.
      </PageHero>

      <section className="seccion">
        <div className="filtros" role="group" aria-label="Filtrar por categoría">
          {categorias.map((categoria) => (
            <button
              type="button"
              key={categoria}
              className={categoria === categoriaActiva ? 'activo' : ''}
              aria-pressed={categoria === categoriaActiva}
              onClick={() => setParams(categoria === TODAS ? {} : { categoria })}
            >
              {categoria}
            </button>
          ))}
        </div>

        {error && (
          <p className="aviso" role="alert">
            {error}
          </p>
        )}

        {cargando && <p className="aviso">Cargando catálogo…</p>}

        {!cargando && !error && visibles.length === 0 && (
          <p className="aviso">No hay equipos publicados en esta categoría.</p>
        )}

        <div className="catalogo">
          {visibles.map((equipo) => (
            <article className="tarjeta-catalogo" key={equipo.id}>
              {equipo.image_url ? (
                <img src={equipo.image_url} alt="" loading="lazy" decoding="async" />
              ) : (
                <div className="marcador-imagen" aria-hidden="true">
                  <Network />
                </div>
              )}
              <span className="categoria">{equipo.category}</span>
              <h2>{equipo.name}</h2>
              <p>{equipo.summary}</p>
              <Link className="enlace-tarjeta" to={`/equipos/${equipo.slug}`}>
                Ver equipo
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
