import { ArrowRight, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import NoEncontrada from './NoEncontrada';
import { ETIQUETA_ESTADO, buscarVertical } from '../data/verticales';
import { NUCLEO } from '../data/plataforma';

export default function SolucionDetalle() {
  const { slug = '' } = useParams();
  const vertical = buscarVertical(slug);

  if (!vertical) return <NoEncontrada />;

  const Icono = vertical.icono;

  return (
    <>
      <Seo title={vertical.nombre} description={vertical.resumen} />

      <PageHero antetitulo="SOLUCIÓN" titulo={vertical.nombre}>
        {vertical.descripcion}
      </PageHero>

      <section className="seccion detalle-vertical">
        <div>
          <span className={`estado estado-${vertical.estado}`}>
            {ETIQUETA_ESTADO[vertical.estado]}
          </span>
          <h2>Capacidades</h2>
          <ul className="lista-marcada">
            {vertical.capacidades.map((capacidad) => (
              <li key={capacidad}>
                <Check size={18} aria-hidden="true" />
                <span>{capacidad}</span>
              </li>
            ))}
          </ul>
          <Link className="boton-primario" to="/contacto">
            Solicitar una demostración
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <aside className="panel-nucleo">
          <Icono aria-hidden="true" />
          <h2>Además, sobre el núcleo</h2>
          <p>Todo lo anterior se apoya en capacidades que ya vienen resueltas:</p>
          <ul>
            {NUCLEO.slice(0, 5).map((capacidad) => (
              <li key={capacidad.titulo}>{capacidad.titulo}</li>
            ))}
          </ul>
          <Link to="/plataforma">
            Cómo funciona la plataforma
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </>
  );
}
