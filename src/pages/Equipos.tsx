import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Cpu, Network, ShieldCheck, Wifi, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import BuscadorEquipos from '../components/BuscadorEquipos';
import ImagenEquipo from '../components/ImagenEquipo';
import TarjetaSolucion from '../components/TarjetaSolucion';
import { obtenerSoluciones } from '../services/soluciones';
import type { AmbitoSolucion, Solucion } from '../types';
import { usarRevelado } from '../hooks/usarRevelado';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { getProducts } from '../services/products';
import type { Product } from '../types';
import { formatearPrecio } from '../lib/precio';

const TODAS = 'Todos';

/** Ambitos de las soluciones, en el orden en que se ofrecen. */
const AMBITOS: [AmbitoSolucion | 'todas', string][] = [
  ['todas', 'Todas'],
  ['vivienda', 'Para su casa'],
  ['conjunto', 'Para conjuntos'],
  ['empresa', 'Para empresas'],
];

/** Icono por categoria. Las que no esten aqui caen en el generico. */
const ICONOS: Record<string, typeof Network> = {
  Seguridad: ShieldCheck,
  'Automatización': Cpu,
  Infraestructura: Network,
  Redes: Wifi,
  'Energía': Zap,
};

export default function Equipos() {
  const [equipos, setEquipos] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [params, setParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [soluciones, setSoluciones] = useState<Solucion[]>([]);
  const [ambito, setAmbito] = useState<AmbitoSolucion | 'todas'>('todas');

  const categoriaActiva = params.get('categoria') ?? TODAS;

  useEffect(() => {
    obtenerSoluciones().then(setSoluciones).catch(() => setSoluciones([]));
  }, []);

  usarRevelado(soluciones.length);

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

  // Se busca sobre nombre, resumen, marca y codigo: un cliente que llega con
  // la referencia del proveedor en la mano debe encontrarla.
  const termino = busqueda.trim().toLowerCase();
  const visibles = equipos
    .filter((equipo) => categoriaActiva === TODAS || equipo.category === categoriaActiva)
    .filter((equipo) =>
      !termino
        ? true
        : [equipo.name, equipo.summary, equipo.brand, equipo.code]
            .filter(Boolean)
            .some((campo) => String(campo).toLowerCase().includes(termino)),
    );

  // Recuento por categoria, para la rejilla de entrada.
  const conteo = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const equipo of equipos) mapa.set(equipo.category, (mapa.get(equipo.category) ?? 0) + 1);
    return mapa;
  }, [equipos]);

  return (
    <>
      <Seo
        title="Equipos y domótica"
        description="Catálogo de equipamiento tecnológico: domótica, videovigilancia, redes y respaldo eléctrico para viviendas, condominios y empresas."
      />

      <PageHero antetitulo="EQUIPOS Y DOMÓTICA" titulo="Tecnología para proteger, conectar y automatizar">
        Seleccionamos, instalamos y damos soporte a equipamiento técnico. Revise las categorías y el
        detalle de cada solución.
      </PageHero>

      {soluciones.length > 0 && (
        <section className="seccion seccion-hundida">
          <div className="encabezado-seccion">
            <span className="antetitulo">SOLUCIONES</span>
            <h2>Instalado y funcionando, no solo el equipo</h2>
            <p>
              Cada solución incluye el equipo, la evaluación técnica, la instalación y la puesta en
              marcha. Se entrega en funcionamiento y con su personal capacitado.
            </p>
          </div>

          {/* Una casa y un conjunto son clientes distintos: quien busca una
              cerradura para su vivienda no debe tener que leer sobre áreas
              comunes para encontrarla. */}
          <div className="filtros" role="group" aria-label="Filtrar soluciones por tipo de cliente">
            {AMBITOS.map(([clave, etiqueta]) => {
              const total =
                clave === 'todas'
                  ? soluciones.length
                  : soluciones.filter((s) => s.ambito === clave).length;
              if (total === 0) return null;
              return (
                <button
                  type="button"
                  key={clave}
                  className={clave === ambito ? 'activo' : ''}
                  aria-pressed={clave === ambito}
                  onClick={() => setAmbito(clave)}
                >
                  {etiqueta} <span className="conteo-filtro">{total}</span>
                </button>
              );
            })}
          </div>

          <div className="rejilla-soluciones">
            {soluciones
              .filter((s) => ambito === 'todas' || s.ambito === ambito)
              .map((solucion) => (
                <TarjetaSolucion key={solucion.id} solucion={solucion} />
              ))}
          </div>
        </section>
      )}

      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">EQUIPOS SUELTOS</span>
          <h2>O seleccione equipo por equipo</h2>
        </div>

        {/* Rejilla de entrada: deja ver de un vistazo que lineas hay y cuantos
            equipos tiene cada una. Se oculta al buscar, que ya es otro modo. */}
        {!termino && categoriaActiva === TODAS && conteo.size > 0 && (
          <div className="rejilla-categorias">
            {[...conteo.entries()].map(([nombre, total]) => {
              const Icono = ICONOS[nombre] ?? Network;
              return (
                <button
                  type="button"
                  className="tarjeta-categoria"
                  key={nombre}
                  onClick={() => setParams({ categoria: nombre })}
                >
                  <Icono aria-hidden="true" />
                  <span className="nombre-categoria">{nombre}</span>
                  <span className="conteo-categoria">
                    {total} {total === 1 ? 'equipo' : 'equipos'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <BuscadorEquipos valor={busqueda} alCambiar={setBusqueda} resultados={visibles.length} />

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
          <p className="aviso">
            {termino
              ? `Ningún equipo coincide con «${busqueda}». Pruebe con la marca o el código.`
              : 'No hay equipos publicados en esta categoría.'}
          </p>
        )}

        <div className="catalogo">
          {visibles.map((equipo) => (
            <article className="tarjeta-catalogo" key={equipo.id}>
              <ImagenEquipo equipo={equipo} />
              <span className="categoria">{equipo.category}</span>
              <h2>{equipo.name}</h2>
              <p>{equipo.summary}</p>
              <span className="precio-tarjeta">
                {typeof equipo.price === 'number'
                  ? formatearPrecio(equipo.price)
                  : 'Bajo cotización'}
              </span>
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
