import { Compass, Layers, ShieldCheck, Users } from 'lucide-react';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { EMPRESA } from '../data/empresa';

const PRINCIPIOS = [
  {
    icono: Layers,
    titulo: 'Una base, muchas operaciones',
    texto:
      'Trabajamos sobre un núcleo compartido en lugar de reinventar cada proyecto. Lo que aprendemos con un cliente mejora el sistema de todos.',
  },
  {
    icono: ShieldCheck,
    titulo: 'Seguridad desde el diseño',
    texto:
      'Identidad, permisos, aislamiento entre organizaciones y auditoría no son añadidos posteriores: son parte de la arquitectura desde el primer día.',
  },
  {
    icono: Compass,
    titulo: 'Franqueza sobre el alcance',
    texto:
      'Decimos qué está operativo, qué está en implementación y qué está en diseño. Preferimos una conversación honesta a una promesa que no podamos sostener.',
  },
  {
    icono: Users,
    titulo: 'Acompañamiento real',
    texto:
      'El sistema no termina cuando se publica. Migración, formación y ajustes sobre uso real son parte del trabajo.',
  },
];

export default function Empresa() {
  return (
    <>
      <Seo
        title="Empresa"
        description={`${EMPRESA.nombre}: diseñamos y operamos software modular multi-tenant y equipamiento tecnológico desde Ecuador.`}
      />

      <PageHero antetitulo={EMPRESA.nombre} titulo="Diseñamos soluciones. Construimos confianza.">
        Desarrollamos, implementamos y acompañamos soluciones digitales desde Ecuador, combinando
        visión de negocio, diseño y seguridad. Dos líneas de trabajo: la plataforma modular que
        sostiene las aplicaciones de nuestros clientes, y el equipamiento tecnológico que acompaña
        sus espacios.
      </PageHero>

      <section className="seccion">
        <div className="encabezado-seccion">
          <span className="antetitulo">CÓMO TRABAJAMOS</span>
          <h2>Cuatro principios que ordenan las decisiones</h2>
        </div>

        <div className="rejilla-nucleo">
          {PRINCIPIOS.map((principio) => {
            const Icono = principio.icono;
            return (
              <article className="tarjeta-nucleo" key={principio.titulo}>
                <Icono aria-hidden="true" />
                <h3>{principio.titulo}</h3>
                <p>{principio.texto}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
