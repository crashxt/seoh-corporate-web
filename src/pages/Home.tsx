import { ArrowRight, Cpu, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Seo from '../components/Seo';
import { usarRevelado } from '../hooks/usarRevelado';
import { EMPRESA } from '../data/empresa';
import { COMO_TRABAJAMOS, NUCLEO } from '../data/plataforma';
import { ETIQUETA_ESTADO, VERTICALES } from '../data/verticales';
import { CATEGORIAS_EQUIPOS, DESCRIPCION_CATEGORIA } from '../data/equipos';

export default function Home() {
  usarRevelado();

  return (
    <>
      <Seo
        titleAbsoluto
        title={`${EMPRESA.nombre} — Plataforma modular para organizaciones`}
        description="Diseñamos y operamos software modular multi-tenant: condominios, mantenimiento, transporte, procesos y CRM sobre una base común. También equipamiento tecnológico y domótica."
      />

      {/* Portada ---------------------------------------------------------- */}
      <section className="portada">
        <div className="portada-texto">
          <span className="antetitulo">PLATAFORMA MODULAR MULTI-TENANT</span>
          <h1>
            Una plataforma.
            <br />
            <span>Las aplicaciones que tu organización necesita.</span>
          </h1>
          <p>
            No empezamos de cero en cada proyecto. Construimos sobre un núcleo probado —identidad,
            permisos, tareas, archivos y auditoría— y activamos sobre él los módulos que tu operación
            realmente usa.
          </p>
          <div className="portada-acciones">
            <Link className="boton-primario" to="/plataforma">
              Cómo funciona
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="boton-secundario" to="/plataforma">
              Empezar sin costo
            </Link>
          </div>
        </div>

        <div className="portada-marca">
          <Logo variante="hero" ancho={360} prioridad />
          {/* El lema venia incrustado dentro del PNG del logotipo: ni Google lo
              leia ni un lector de pantalla lo anunciaba. Ahora es texto. */}
          <p className="lema">{EMPRESA.lema}</p>
        </div>
      </section>

      {/* Las dos lineas de negocio ---------------------------------------- */}
      <section className="seccion lineas">
        <article className="linea linea-principal" data-revelar>
          <Layers aria-hidden="true" />
          <h2>Software modular por vertical</h2>
          <p>
            Aplicaciones diseñadas para el sector de cada cliente, sobre una base compartida. Cada
            organización trabaja en su propio entorno aislado, con su marca y sus permisos.
          </p>
          <Link to="/soluciones">
            Explorar verticales
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>

        <article className="linea" data-revelar>
          <Cpu aria-hidden="true" />
          <h2>Equipos y domótica</h2>
          <p>
            Venta e instalación de tecnología para seguridad, automatización y conectividad, con la
            misma exigencia técnica que aplicamos al software.
          </p>
          <Link to="/equipos">
            Ver catálogo
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>
      </section>

      {/* Verticales -------------------------------------------------------- */}
      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">SOLUCIONES</span>
          <h2>Un módulo para cada operación</h2>
          <p>
            Cinco verticales sobre el mismo núcleo. Si tu sector no está aquí, se diseña — esa es
            exactamente la ventaja de trabajar con módulos.
          </p>
        </div>

        <div className="rejilla-verticales">
          {VERTICALES.map((vertical) => {
            const Icono = vertical.icono;
            return (
              <Link className="tarjeta-vertical" data-revelar key={vertical.slug} to={`/soluciones/${vertical.slug}`}>
                <span className={`estado estado-${vertical.estado}`}>
                  {ETIQUETA_ESTADO[vertical.estado]}
                </span>
                <Icono aria-hidden="true" />
                <h3>{vertical.nombre}</h3>
                <p>{vertical.resumen}</p>
                <span className="enlace-tarjeta">
                  Ver detalle
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* El nucleo comun --------------------------------------------------- */}
      <section className="seccion seccion-nucleo">
        <div className="encabezado-seccion">
          <span className="antetitulo">EL NÚCLEO</span>
          <h2>Lo que toda organización recibe desde el primer día</h2>
          <p>
            Antes de activar un solo módulo, esto ya está resuelto y verificado. Es la diferencia
            entre encargar un desarrollo desde cero y partir de una base en producción.
          </p>
        </div>

        <div className="rejilla-nucleo">
          {NUCLEO.map((capacidad) => {
            const Icono = capacidad.icono;
            return (
              <article className="tarjeta-nucleo" data-revelar key={capacidad.titulo}>
                <Icono aria-hidden="true" />
                <h3>{capacidad.titulo}</h3>
                <p>{capacidad.texto}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Metodo ------------------------------------------------------------ */}
      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">CÓMO TRABAJAMOS</span>
          <h2>De la operación real al sistema que la sostiene</h2>
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

      {/* Equipos ----------------------------------------------------------- */}
      <section className="seccion seccion-equipos">
        <div className="encabezado-seccion">
          <span className="antetitulo">EQUIPOS Y DOMÓTICA</span>
          <h2>También equipamos el espacio físico</h2>
        </div>

        <div className="rejilla-equipos">
          {CATEGORIAS_EQUIPOS.map((categoria) => (
            <Link
              className="tarjeta-equipo"
              key={categoria}
              to={`/equipos?categoria=${encodeURIComponent(categoria)}`}
            >
              <h3>{categoria}</h3>
              <p>{DESCRIPCION_CATEGORIA[categoria]}</p>
              <span className="enlace-tarjeta">
                Ver equipos
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cierre ------------------------------------------------------------ */}
      <section className="seccion llamada-final">
        <ShieldCheck aria-hidden="true" />
        <h2>Cuéntanos cómo opera tu organización</h2>
        <p>
          Revisamos tu caso y te decimos con franqueza qué se resuelve con lo que ya existe y qué
          necesita desarrollo. Sin compromiso.
        </p>
        <Link className="boton-primario" to="/contacto">
          Solicitar propuesta
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
