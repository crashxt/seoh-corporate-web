import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import {
  CONTACTO,
  enlaceTelefono,
  enlaceWhatsapp,
  telefonoLegible,
} from '../data/empresa';

/**
 * Contacto.
 *
 * Cada canal es accionable: `mailto:` y `tel:` abren la aplicacion
 * correspondiente en lugar de obligar a copiar el dato a mano. Un canal sin
 * confirmar sencillamente no se muestra.
 */
export default function Contacto() {
  return (
    <>
      <Seo
        title="Contacto"
        description="Conversemos sobre la solución adecuada para tu organización: plataforma modular, desarrollo por vertical o equipamiento tecnológico."
      />

      <PageHero antetitulo="HABLEMOS DE TU PROYECTO" titulo="Construyamos la solución adecuada">
        Cuéntanos cómo opera tu organización y qué quieres mejorar. Revisamos el caso y te decimos
        con franqueza qué se resuelve con lo que ya existe y qué requiere desarrollo.
      </PageHero>

      <section className="seccion">
        <div className="rejilla-contacto">
          <a className="canal" href={`mailto:${CONTACTO.correo}`}>
            <Mail aria-hidden="true" />
            <span className="canal-etiqueta">Correo</span>
            <span className="canal-valor">{CONTACTO.correo}</span>
            <span className="enlace-tarjeta">
              Escribir
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>

          {enlaceTelefono && telefonoLegible && (
            <a className="canal" href={enlaceTelefono}>
              <Phone aria-hidden="true" />
              <span className="canal-etiqueta">Teléfono</span>
              <span className="canal-valor">{telefonoLegible}</span>
              <span className="enlace-tarjeta">
                Llamar
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </a>
          )}

          {enlaceWhatsapp && (
            <a className="canal" href={enlaceWhatsapp} target="_blank" rel="noreferrer noopener">
              <MessageCircle aria-hidden="true" />
              <span className="canal-etiqueta">WhatsApp</span>
              <span className="canal-valor">Mensaje directo</span>
              <span className="enlace-tarjeta">
                Abrir
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </a>
          )}

          <div className="canal canal-estatico">
            <MapPin aria-hidden="true" />
            <span className="canal-etiqueta">Ubicación</span>
            <span className="canal-valor">{CONTACTO.ciudad}</span>
          </div>
        </div>

        <div className="nota-contacto">
          <h2>¿Qué nos ayuda a responderte mejor?</h2>
          <ul>
            <li>Qué tipo de organización eres y a cuántas personas atiende.</li>
            <li>Qué proceso concreto quieres resolver primero.</li>
            <li>Con qué herramientas trabajan hoy, aunque sean hojas de cálculo.</li>
            <li>Si además necesitas equipamiento técnico o solo software.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
