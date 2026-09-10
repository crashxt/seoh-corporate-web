import { ArrowRight, Headphones, LifeBuoy, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { CONTACTO } from '../data/empresa';

const VIAS = [
  {
    icono: Headphones,
    titulo: 'Soporte de aplicaciones',
    texto:
      'Para organizaciones que ya operan sobre la plataforma. Incidencias de uso, permisos, datos o comportamiento inesperado de un módulo.',
  },
  {
    icono: Wrench,
    titulo: 'Asistencia técnica',
    texto:
      'Para equipamiento instalado por SEOH: cámaras, alarmas, control de acceso, domótica y redes.',
  },
  {
    icono: LifeBuoy,
    titulo: 'Consultas de alcance',
    texto:
      'Si necesitas algo que hoy la plataforma no hace, cuéntanos el caso: puede ser configuración, un módulo existente o desarrollo nuevo.',
  },
];

export default function Soporte() {
  return (
    <>
      <Seo
        title="Soporte"
        description="Acompañamiento técnico para las aplicaciones y el equipamiento implementados por SEOH DESIGN TECH."
      />

      <PageHero antetitulo="SOPORTE" titulo="Acompañamiento cuando lo necesitas">
        Atendemos las soluciones que hemos desarrollado o implementado. Escríbenos indicando tu
        organización y el módulo o equipo afectado.
      </PageHero>

      <section className="seccion">
        <div className="rejilla-nucleo">
          {VIAS.map((via) => {
            const Icono = via.icono;
            return (
              <article className="tarjeta-nucleo" key={via.titulo}>
                <Icono aria-hidden="true" />
                <h3>{via.titulo}</h3>
                <p>{via.texto}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="seccion llamada-final">
        <h2>Abrir una solicitud</h2>
        <p>
          Escríbenos a <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a> con el nombre de
          tu organización, el módulo o equipo afectado y una descripción de lo que ocurre.
        </p>
        <Link className="boton-primario" to="/contacto">
          Ver canales de contacto
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
