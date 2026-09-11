import { MessageCircle, Mail } from 'lucide-react';
import { CONTACTO, enlaceWhatsapp } from '../data/empresa';
import type { Product } from '../types';

/**
 * Llamada a la accion de la ficha de equipo.
 *
 * No hay carrito a proposito. SEOH compra a los mismos mayoristas que venden
 * al publico, asi que competir precio a precio sobre el equipo suelto es una
 * batalla perdida de antemano. El equipo se vende dentro de una solucion
 * —instalacion, configuracion y la plataforma que lo administra—, y esa
 * conversacion empieza con una cotizacion, no con un boton de comprar.
 *
 * El mensaje va prerrellenado con el producto: quien escribe no tiene que
 * explicar qué está mirando, y quien responde sabe de qué se trata.
 */
export default function SolicitarCotizacion({ equipo }: { equipo: Product }) {
  const referencia = equipo.code ? `${equipo.name} (cód. ${equipo.code})` : equipo.name;
  const mensaje = `Hola, me interesa una cotización de: ${referencia}.`;

  const whatsapp = enlaceWhatsapp ? `${enlaceWhatsapp}?text=${encodeURIComponent(mensaje)}` : null;
  const correo = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent(
    `Cotización: ${equipo.name}`,
  )}&body=${encodeURIComponent(`${mensaje}\n\nCantidad aproximada:\nCiudad:\n`)}`;

  return (
    <div className="acciones-cotizacion">
      {whatsapp && (
        <a className="boton-primario" href={whatsapp} target="_blank" rel="noreferrer noopener">
          <MessageCircle size={18} aria-hidden="true" />
          Cotizar por WhatsApp
        </a>
      )}
      <a className="boton-secundario" href={correo}>
        <Mail size={18} aria-hidden="true" />
        Cotizar por correo
      </a>
    </div>
  );
}
