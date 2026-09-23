import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACTO, EMPRESA, enlaceWhatsapp, telefonoLegible } from '../data/empresa';
import { AVISO_PRECIOS, COMPLEMENTOS, PLANES, PLAN_TRANSPORTE } from '../data/planes';
import { ETIQUETA_ESTADO, VERTICALES } from '../data/verticales';
import { formatearPrecio } from '../lib/precio';

/**
 * SEOH, el asistente del sitio.
 *
 * POR QUE NO USA UN MODELO DE LENGUAJE
 * Responder con un modelo exigiria una clave de API, un backend y coste por
 * mensaje. Pero el motivo de fondo es otro: un modelo que improvisa un precio o
 * promete un producto que no existe genera una expectativa que alguien tendra
 * que desmontar por telefono. Aqui cada respuesta se arma con los mismos datos
 * que pinta el sitio —planes, verticales, catalogo, contacto—, asi que no puede
 * decir nada que la pagina no diga.
 *
 * Lo que no sabe, lo admite y ofrece WhatsApp. Un asistente que reconoce su
 * limite es mas util que uno que responde siempre.
 */

type Enlace = { texto: string; a: string };
type Mensaje = {
  de: 'seoh' | 'visitante';
  texto: string;
  enlaces?: Enlace[];
  externo?: { texto: string; href: string };
};

/** Normaliza para comparar: sin tildes, sin mayusculas, sin puntuacion. */
const limpiar = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** El nombre acaba en "S.A.", así que añadirle un punto produce "S.A..". */
const frase = (texto: string) => (texto.endsWith('.') ? texto : `${texto}.`);

const SALUDO: Mensaje = {
  de: 'seoh',
  texto: `Hola. Soy ${EMPRESA.nombreCorto}, el asistente de ${frase(
    EMPRESA.nombre,
  )} Puedo explicarle qué hacemos, cuánto cuesta y llevarle a la página que necesite. ¿En qué le ayudo?`,
};

const SUGERENCIAS = [
  '¿Qué hace SEOH?',
  '¿Cuánto cuesta la plataforma?',
  '¿Venden cámaras?',
  '¿Cómo los contacto?',
];

/**
 * Intenciones reconocidas.
 *
 * El orden importa: la primera que coincide responde. Las mas especificas van
 * antes que las generales, porque "cuanto cuesta una camara" debe caer en
 * catalogo y no en planes.
 */
type Intencion = {
  nombre: string;
  claves: RegExp;
  responder: () => Promise<Mensaje> | Mensaje;
};

const INTENCIONES: Intencion[] = [
  {
    nombre: 'saludo',
    claves: /\b(hola|buenas|buenos dias|buenas tardes|buenas noches|que tal)\b/,
    responder: () => ({
      de: 'seoh',
      texto: 'Hola. Dígame qué necesita y le oriento.',
    }),
  },

  {
    nombre: 'agradecimiento',
    claves: /\b(gracias|muchas gracias|perfecto|listo|ok|vale)\b/,
    responder: () => ({
      de: 'seoh',
      texto: 'A la orden. Si le queda algo pendiente, aquí sigo.',
    }),
  },

  {
    nombre: 'contacto',
    // Sin `\b` de cierre: son raices, no palabras. "contact" tiene que casar
    // con "contacto", "contactar" y "contactarlos"; exigiendo final de palabra
    // no casaba con ninguna de las tres.
    claves: /\b(contact|telefono|celular|numero|correo|email|mail|escrib|llamar|whatsapp|hablar con|asesor|vendedor|donde estan|ubicacion|direccion|atencion)/,
    responder: () => ({
      de: 'seoh',
      texto: `Puede escribirnos a ${CONTACTO.correo}${
        telefonoLegible ? ` o llamar al ${telefonoLegible}` : ''
      }. Estamos en ${CONTACTO.ciudad}. La visita de levantamiento y la asesoría previa no tienen costo.`,
      enlaces: [{ texto: 'Ver formas de contacto', a: '/contacto' }],
      ...(enlaceWhatsapp
        ? { externo: { texto: 'Escribir por WhatsApp', href: enlaceWhatsapp } }
        : {}),
    }),
  },

  {
    nombre: 'precio-plataforma',
    claves: /\b(precio|cuesta|costo|valor|tarifa|mensualidad|plan|suscripcion|cuanto).*\b(plataforma|software|sistema|app|aplicacion|modulo|licencia)|\b(plan|planes|suscripcion|mensualidad|free|pro|enterprise)\b/,
    responder: () => {
      const lista = PLANES.map((p) => `${p.nombre}: ${p.precio} — ${p.para}`).join('\n');
      const extras = COMPLEMENTOS.map(
        (c) => `${c.nombre}: ${formatearPrecio(c.precio)} al mes`,
      ).join('\n');
      return {
        de: 'seoh',
        texto: `Hay tres planes:\n\n${lista}\n\nComplementos que se suman aparte:\n${extras}\n\nLas cooperativas de transporte van por flota: ${formatearPrecio(
          PLAN_TRANSPORTE.base.precio,
        )} al mes hasta ${PLAN_TRANSPORTE.base.unidades} unidades, y ${formatearPrecio(
          PLAN_TRANSPORTE.porUnidad,
        )} por cada unidad adicional.\n\n${AVISO_PRECIOS}`,
        enlaces: [{ texto: 'Ver los planes en detalle', a: '/plataforma' }],
      };
    },
  },

  {
    nombre: 'instalacion',
    claves: /\b(instala|montaje|configur|soporte|garantia|visita|cotiza|presupuesto)/,
    responder: () => ({
      de: 'seoh',
      texto:
        'La instalación de un equipo o kit cuesta 15 USD e incluye el material: canaleta, cable de red y cable de poder. La visita de levantamiento y la asesoría previa a la compra no tienen costo, y la configuración va incluida.\n\nQuedan aparte las estructuras metálicas y los brazos para cámaras, que se cotizan según el caso.',
      enlaces: [{ texto: 'Pedir una cotización', a: '/contacto' }],
    }),
  },

  {
    nombre: 'catalogo',
    // Sin "tienen": aparece en casi cualquier pregunta —"tienen sucursal en
    // Peru"— y se tragaba consultas que no van de producto.
    claves: /\b(camara|cerradura|chapa|alarma|sensor|videoportero|timbre|grabador|dvr|nvr|ups|regulador|router|switch|access point|wifi|foco|domotica|alexa|equipo|producto|catalogo|vend)/,
    responder: async () => {
      // El catalogo pesa y solo hace falta si preguntan por el: se carga aqui.
      const { getProducts } = await import('../services/products');
      const equipos = await getProducts().catch(() => []);
      const porCategoria = new Map<string, number>();
      for (const e of equipos) porCategoria.set(e.category, (porCategoria.get(e.category) ?? 0) + 1);
      const resumen = [...porCategoria.entries()]
        .map(([c, n]) => `${c}: ${n} referencias`)
        .join('\n');
      return {
        de: 'seoh',
        texto: `Sí. El catálogo tiene ${equipos.length} equipos publicados con precio:\n\n${resumen}\n\nTambién armamos paquetes que incluyen el equipo, la instalación y la puesta en marcha, desde ${formatearPrecio(
          103.5,
        )}. Puede filtrar por marca y ordenar por precio.`,
        enlaces: [{ texto: 'Ver equipos y paquetes', a: '/equipos' }],
      };
    },
  },

  {
    nombre: 'que-hace',
    claves: /\b(que hace|a que se dedica|quienes son|que es seoh|de que trata|que ofrece|servicio|informacion|empresa|sobre ustedes)/,
    responder: () => ({
      de: 'seoh',
      texto: `${EMPRESA.nombre} hace dos cosas.\n\nLa primera es una plataforma modular para organizaciones: se activan solo los módulos que su operación necesita y se paga por ellos. La segunda es venta e instalación de equipamiento técnico: seguridad, redes, respaldo eléctrico y domótica.\n\nLo que nos diferencia en la segunda es que no vendemos la caja: entregamos el equipo instalado, configurado y con su personal capacitado.`,
      enlaces: [
        { texto: 'Conocer la plataforma', a: '/plataforma' },
        { texto: 'Ver equipos', a: '/equipos' },
        { texto: 'Sobre la empresa', a: '/empresa' },
      ],
    }),
  },

  {
    nombre: 'verticales',
    claves: /\b(condominio|conjunto|alicuota|residencial|taxi|transporte|cooperativa|bpm|proceso|crm|mantenimiento|inventario|extintor|vertical)/,
    responder: () => {
      const lista = VERTICALES.map(
        (v) => `${v.nombre} — ${ETIQUETA_ESTADO[v.estado]}`,
      ).join('\n');
      return {
        de: 'seoh',
        texto: `Estas son las verticales y su estado real, sin adornos:\n\n${lista}\n\nCada una se apoya en la misma base: usuarios, permisos, auditoría y notificaciones resueltos una sola vez.`,
        enlaces: [{ texto: 'Ver las verticales', a: '/soluciones' }],
      };
    },
  },
];

/** Cuando nada coincide. Admitirlo vale más que forzar una respuesta. */
const noSe = (): Mensaje => ({
  de: 'seoh',
  texto:
    'Eso no sabría respondérselo con certeza, y prefiero no inventarlo. Le paso con una persona, que le va a servir más.',
  enlaces: [{ texto: 'Ver formas de contacto', a: '/contacto' }],
  ...(enlaceWhatsapp ? { externo: { texto: 'Escribir por WhatsApp', href: enlaceWhatsapp } } : {}),
});

async function responder(pregunta: string): Promise<Mensaje> {
  const texto = limpiar(pregunta);
  const intencion = INTENCIONES.find((i) => i.claves.test(texto));
  if (!intencion) return noSe();
  try {
    return await intencion.responder();
  } catch {
    return noSe();
  }
}

export default function AsistenteSeoh() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO]);
  const [entrada, setEntrada] = useState('');
  const [pensando, setPensando] = useState(false);

  const panel = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const fondo = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  // Al abrir, el foco entra al campo; al cerrar, vuelve al botón. Sin esto,
  // quien navega con teclado queda perdido al final del documento.
  useEffect(() => {
    if (abierto) campo.current?.focus();
    else disparador.current?.focus({ preventScroll: true });
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [abierto]);

  // El último mensaje siempre a la vista.
  useEffect(() => {
    fondo.current?.scrollIntoView({ block: 'end' });
  }, [mensajes, pensando]);

  const preguntar = async (texto: string) => {
    const limpio = texto.trim();
    if (!limpio || pensando) return;
    setMensajes((previos) => [...previos, { de: 'visitante', texto: limpio }]);
    setEntrada('');
    setPensando(true);
    const respuesta = await responder(limpio);
    setPensando(false);
    setMensajes((previos) => [...previos, respuesta]);
  };

  const sinConversar = useMemo(() => mensajes.length === 1, [mensajes]);

  return (
    <>
      <button
        ref={disparador}
        type="button"
        className="asistente-disparador"
        aria-expanded={abierto}
        aria-controls="panel-asistente"
        onClick={() => setAbierto((p) => !p)}
      >
        {abierto ? <X size={20} aria-hidden="true" /> : <MessageCircle size={20} aria-hidden="true" />}
        <span>{abierto ? 'Cerrar' : 'Pregúntele a SEOH'}</span>
      </button>

      {abierto && (
        <div
          id="panel-asistente"
          className="asistente-panel"
          role="dialog"
          aria-label="Asistente SEOH"
          ref={panel}
        >
          <header>
            <span className="asistente-marca">SEOH</span>
            <span className="asistente-estado">Responde con la información del sitio</span>
          </header>

          <div className="asistente-conversacion">
            {mensajes.map((m, i) => (
              <div key={`${m.de}-${i}`} className={`asistente-mensaje ${m.de}`}>
                <p>{m.texto}</p>

                {m.enlaces?.map((e) => (
                  <Link key={e.a + e.texto} to={e.a} onClick={() => setAbierto(false)}>
                    {e.texto}
                  </Link>
                ))}

                {m.externo && (
                  <a href={m.externo.href} target="_blank" rel="noreferrer noopener">
                    {m.externo.texto}
                  </a>
                )}
              </div>
            ))}

            {pensando && (
              <div className="asistente-mensaje seoh">
                <p aria-live="polite">Un momento…</p>
              </div>
            )}

            {sinConversar && (
              <div className="asistente-sugerencias">
                {SUGERENCIAS.map((s) => (
                  <button type="button" key={s} onClick={() => preguntar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={fondo} />
          </div>

          <form
            className="asistente-entrada"
            onSubmit={(e) => {
              e.preventDefault();
              preguntar(entrada);
            }}
          >
            <input
              ref={campo}
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Escriba su pregunta"
              aria-label="Escriba su pregunta"
              maxLength={200}
            />
            <button type="submit" aria-label="Enviar" disabled={!entrada.trim() || pensando}>
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
