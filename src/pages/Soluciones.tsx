import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { ETIQUETA_ESTADO, VERTICALES } from '../data/verticales';

export default function Soluciones() {
  return (
    <>
      <Seo
        title="Soluciones"
        description="Verticales de la plataforma SEOH: administración de condominios, inventario y mantenimiento, cooperativas de transporte, gestión de procesos y CRM."
      />

      <PageHero antetitulo="SOLUCIONES" titulo="Módulos para operaciones concretas">
        Cada vertical resuelve el día a día de un tipo de organización. Todas comparten el mismo
        núcleo de identidad, permisos, tareas y auditoría.
      </PageHero>

      <section className="seccion">
        <div className="lista-verticales">
          {VERTICALES.map((vertical) => {
            const Icono = vertical.icono;
            return (
              <article className="fila-vertical" key={vertical.slug}>
                <div className="fila-icono">
                  <Icono aria-hidden="true" />
                </div>
                <div className="fila-cuerpo">
                  <span className={`estado estado-${vertical.estado}`}>
                    {ETIQUETA_ESTADO[vertical.estado]}
                  </span>
                  <h2>{vertical.nombre}</h2>
                  <p>{vertical.descripcion}</p>
                  <Link className="boton-secundario" to={`/soluciones/${vertical.slug}`}>
                    Ver capacidades
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="seccion llamada-final">
        <h2>¿Tu sector no está en la lista?</h2>
        <p>
          El núcleo no conoce de verticales: sirve igual a un condominio que a una cooperativa. Lo
          específico de tu operación se diseña encima.
        </p>
        <Link className="boton-primario" to="/contacto">
          Conversemos tu caso
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
