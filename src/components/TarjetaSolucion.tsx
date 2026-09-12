import { useState } from 'react';
import { Check, ChevronDown, MessageCircle, Package } from 'lucide-react';
import { CONTACTO, enlaceWhatsapp } from '../data/empresa';
import { formatearPrecio } from '../lib/precio';
import type { Solucion } from '../types';

/**
 * Tarjeta de solucion.
 *
 * Muestra el paquete completo —a quien va dirigido, que equipo lleva y que
 * trabajo incluye— porque el argumento de venta es precisamente que el cliente
 * no tiene que armar nada. El precio va como "desde": el alcance real depende
 * del sitio, y una cifra cerrada invita a comparar pieza por pieza, que es
 * justo lo que el paquete evita.
 */
export default function TarjetaSolucion({ solucion }: { solucion: Solucion }) {
  const [abierto, setAbierto] = useState(false);
  const mensaje = `Hola, me interesa la solución «${solucion.nombre}».`;
  const whatsapp = enlaceWhatsapp ? `${enlaceWhatsapp}?text=${encodeURIComponent(mensaje)}` : null;
  const correo = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent(
    `Cotización: ${solucion.nombre}`,
  )}&body=${encodeURIComponent(`${mensaje}\n\nTipo de organización:\nCiudad:\nTamaño aproximado:\n`)}`;

  return (
    <article className="tarjeta-solucion" data-revelar>
      <header>
        <Package aria-hidden="true" />
        <span className="solucion-para">{solucion.para}</span>
        <h3>{solucion.nombre}</h3>
        <p>{solucion.resumen}</p>
      </header>

      <div className="solucion-contenido">
        <h4>Equipo incluido</h4>
        <ul className="solucion-equipos">
          {solucion.equipos.map((equipo) => (
            <li key={equipo.nombre}>
              <span className="cantidad">{equipo.cantidad}&times;</span>
              {equipo.nombre}
            </li>
          ))}
        </ul>

        {/* El detalle completo va plegado: la tarjeta debe poder compararse de
            un golpe de vista, y quien quiera profundizar lo abre. */}
        <button
          type="button"
          className="ver-detalle"
          onClick={() => setAbierto((previo) => !previo)}
          aria-expanded={abierto}
        >
          {abierto ? 'Ocultar detalle' : 'Ver qué incluye en detalle'}
          <ChevronDown size={15} aria-hidden="true" className={abierto ? 'girado' : ''} />
        </button>

        {abierto && <p className="detalle-solucion">{solucion.descripcion}</p>}

        <h4>Trabajo incluido</h4>
        <ul className="solucion-servicios">
          {solucion.servicios.map((servicio) => (
            <li key={servicio}>
              <Check size={15} aria-hidden="true" />
              {servicio}
            </li>
          ))}
        </ul>
      </div>

      <footer>
        {typeof solucion.precioDesde === 'number' ? (
          <p className="solucion-precio">
            <span className="etiqueta-desde">Desde</span>
            <span className="cifra">{formatearPrecio(solucion.precioDesde)}</span>
            <span className="precio-nota">IVA incluido · instalación incluida</span>
          </p>
        ) : (
          <p className="solucion-precio">
            <span className="cifra sin-precio">Bajo cotización</span>
            <span className="precio-nota">El precio depende del tamaño y los accesos</span>
          </p>
        )}
        <div className="acciones-cotizacion">
          {whatsapp && (
            <a className="boton-primario" href={whatsapp} target="_blank" rel="noreferrer noopener">
              <MessageCircle size={18} aria-hidden="true" />
              Solicitar esta solución
            </a>
          )}
          <a className="boton-secundario" href={correo}>
            Pedir por correo
          </a>
        </div>
      </footer>
    </article>
  );
}
