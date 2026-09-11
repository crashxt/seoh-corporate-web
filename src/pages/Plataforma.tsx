import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import DiagramaModular from '../components/DiagramaModular';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { COMO_TRABAJAMOS, NUCLEO } from '../data/plataforma';
import { VERTICALES } from '../data/verticales';

/** Ventajas del modelo modular frente a un desarrollo a medida desde cero. */
const VENTAJAS = [
  'El proyecto arranca sobre funcionalidad ya probada en producción, no sobre una hoja en blanco.',
  'Lo que se corrige o mejora en el núcleo llega a todas las organizaciones.',
  'Se contrata por módulos: se amplía cuando la operación lo pide, sin rehacer lo anterior.',
  'El aislamiento entre organizaciones se verifica de forma automatizada, no por confianza.',
];

export default function Plataforma() {
  return (
    <>
      <Seo
        title="La plataforma"
        description="Cómo funciona la plataforma modular multi-tenant de SEOH: un núcleo común de identidad, permisos, tareas y auditoría, con módulos activables por organización."
      />

      <PageHero antetitulo="LA PLATAFORMA" titulo="Un núcleo común, módulos por organización">
        Cada cliente opera en su propio entorno aislado. Sobre esa base se activan únicamente los
        módulos que su operación necesita, con su marca y su estructura de permisos.
      </PageHero>

      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">CÓMO ENCAJA</span>
          <h2>Una base compartida, entornos separados</h2>
        </div>
        <div className="diagrama-envoltura">
          <DiagramaModular />
        </div>
      </section>

      <section className="seccion seccion-hundida">
        <div className="encabezado-seccion">
          <span className="antetitulo">QUÉ INCLUYE EL NÚCLEO</span>
          <h2>Resuelto una vez, disponible para todos los módulos</h2>
        </div>
        <div className="rejilla-nucleo">
          {NUCLEO.map((capacidad) => {
            const Icono = capacidad.icono;
            return (
              <article className="tarjeta-nucleo" key={capacidad.titulo}>
                <Icono aria-hidden="true" />
                <h3>{capacidad.titulo}</h3>
                <p>{capacidad.texto}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="seccion">
        <div className="bloque-ventajas">
          <div className="encabezado-seccion">
            <span className="antetitulo">POR QUÉ MODULAR</span>
            <h2>Qué gana tu organización con este modelo</h2>
          </div>
          <ul className="lista-marcada">
            {VENTAJAS.map((ventaja) => (
              <li key={ventaja}>
                <Check size={18} aria-hidden="true" />
                <span>{ventaja}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">CÓMO TRABAJAMOS</span>
          <h2>Del levantamiento a la puesta en marcha</h2>
        </div>
        <ol className="pasos">
          {COMO_TRABAJAMOS.map((paso) => (
            <li key={paso.paso}>
              <span className="numero-paso">{paso.paso}</span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="seccion llamada-final">
        <h2>{VERTICALES.length} verticales listas para adaptarse a tu operación</h2>
        <p>Y si la tuya no está entre ellas, se diseña sobre el mismo núcleo.</p>
        <Link className="boton-primario" to="/soluciones">
          Ver soluciones
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
