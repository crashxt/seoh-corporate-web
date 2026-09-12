import { HardDrive, Router, ShieldCheck, Wifi, Zap } from 'lucide-react';
import type { Product } from '../types';

/**
 * Imagen de un equipo del catalogo.
 *
 * Cuando el producto trae foto se muestra; cuando no, se dibuja un marcador
 * propio segun lo que sea, deducido de su descripcion.
 *
 * Por que un marcador dibujado y no una foto generica de internet: las
 * fotografias de producto pertenecen al fabricante o al vendedor que las
 * publico. Un catalogo ilustrado con imagenes ajenas es un riesgo legal y,
 * peor, suele acabar mostrando las fotos de la competencia. Las oficiales las
 * entrega el mayorista a sus distribuidores; hasta entonces, un marcador
 * coherente se ve mejor que un hueco.
 */
const PISTAS: [RegExp, typeof Wifi, string][] = [
  [/access point|\bap\b|wireless|wifi|wi-fi/i, Wifi, 'Punto de acceso'],
  [/router|switch|gateway|ont\b/i, Router, 'Equipo de red'],
  [/ups|regulador|bateria|batería/i, Zap, 'Respaldo eléctrico'],
  [/camara|cámara|nvr|dvr|vigilancia/i, ShieldCheck, 'Videovigilancia'],
];

export default function ImagenEquipo({ equipo }: { equipo: Product }) {
  if (equipo.image_url) {
    return <img src={equipo.image_url} alt="" loading="lazy" decoding="async" />;
  }

  const pista = PISTAS.find(([patron]) => patron.test(equipo.name));
  const Icono = pista?.[1] ?? HardDrive;
  const etiqueta = pista?.[2] ?? 'Equipo';

  return (
    <div className="marcador-imagen" role="img" aria-label={`${etiqueta}: sin fotografía`}>
      <Icono aria-hidden="true" />
      <span>{etiqueta}</span>
    </div>
  );
}
