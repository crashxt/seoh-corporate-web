import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { CONTACTO, EMPRESA, REGISTRO, telefonoLegible } from '../data/empresa';

/**
 * Paginas legales.
 *
 * El contenido describe lo que este sitio hace realmente: no incorpora
 * analitica ni publicidad, no instala cookies de seguimiento y solo trata datos
 * personales cuando alguien decide escribir por los canales publicados.
 *
 * Esta redactado contra la Ley Organica de Proteccion de Datos Personales del
 * Ecuador, que exige identificar al responsable del tratamiento y enumerar los
 * derechos de la persona titular. Falta completar RUC y domicilio en
 * data/empresa.ts, y conviene que lo revise un profesional antes de publicar.
 */

/** Identificacion del responsable, omitiendo lo que aun no este confirmado. */
const identificacion = () => {
  const partes = [`${EMPRESA.nombre}`];
  if (REGISTRO.ruc) partes.push(`con RUC ${REGISTRO.ruc}`);
  partes.push(REGISTRO.direccion ? `y domicilio en ${REGISTRO.direccion}` : `con domicilio en ${CONTACTO.ciudad}`);
  return partes.join(', ');
};
type Documento = 'privacidad' | 'terminos';

const CONTENIDO: Record<
  Documento,
  { antetitulo: string; titulo: string; descripcion: string; secciones: { titulo: string; parrafos: string[] }[] }
> = {
  privacidad: {
    antetitulo: 'LEGAL',
    titulo: 'Política de privacidad',
    descripcion: `Cómo trata ${EMPRESA.nombre} los datos personales recogidos a través de este sitio.`,
    secciones: [
      {
        titulo: 'Responsable del tratamiento',
        parrafos: [
          `${identificacion()}, es responsable del tratamiento de los datos personales recogidos a través de este sitio web.`,
          `Para cualquier consulta relativa a esta política puedes escribir a ${CONTACTO.correo}${telefonoLegible ? ` o llamar al ${telefonoLegible}` : ''}.`,
        ],
      },
      {
        titulo: 'Qué datos recogemos',
        parrafos: [
          'Este sitio no incorpora formularios de registro ni herramientas de analítica o publicidad. No recogemos datos de navegación con fines de seguimiento ni elaboramos perfiles.',
          'Solo tratamos los datos personales que nos facilitas voluntariamente cuando te comunicas con nosotros por los canales publicados: tu nombre, tu dirección de correo o teléfono y el contenido de tu mensaje.',
        ],
      },
      {
        titulo: 'Con qué finalidad',
        parrafos: [
          'Utilizamos esos datos únicamente para responder a tu consulta, elaborar una propuesta si la solicitas y mantener el seguimiento comercial derivado de ese contacto.',
          'No cedemos tus datos a terceros ni los utilizamos para enviarte comunicaciones distintas de las relacionadas con tu solicitud.',
        ],
      },
      {
        titulo: 'Con qué base legal',
        parrafos: [
          'Tratamos tus datos sobre la base de tu consentimiento, que otorgas al escribirnos voluntariamente, y del interés legítimo en atender y dar seguimiento a la relación comercial que tú mismo inicias.',
          'Puedes retirar ese consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior.',
        ],
      },
      {
        titulo: 'Durante cuánto tiempo',
        parrafos: [
          'Conservamos la información mientras se mantenga la relación o el interés comercial, y después durante el plazo que exija la normativa aplicable.',
        ],
      },
      {
        titulo: 'Tus derechos',
        parrafos: [
          'La Ley Orgánica de Protección de Datos Personales del Ecuador te reconoce los derechos de acceso, rectificación, actualización, eliminación, oposición, portabilidad y a no ser objeto de decisiones automatizadas.',
          `Para ejercer cualquiera de ellos escribe a ${CONTACTO.correo} indicando el derecho que invocas. Responderemos en el plazo que fija la normativa.`,
          'Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar un reclamo ante la autoridad de protección de datos personales del Ecuador.',
        ],
      },
      {
        titulo: 'Seguridad de la información',
        parrafos: [
          'Aplicamos medidas técnicas y organizativas para proteger la información frente a accesos no autorizados, pérdida o alteración, incluyendo control de accesos por rol, cifrado en tránsito y registro de actividad.',
          'Si llegara a producirse una vulneración que afecte a tus datos, te lo comunicaremos y lo notificaremos a la autoridad competente conforme exige la normativa.',
        ],
      },
      {
        titulo: 'Acceso a las aplicaciones',
        parrafos: [
          'El acceso privado a las aplicaciones de la plataforma se rige por el acuerdo suscrito con cada organización cliente y por la política de privacidad que corresponda a ese servicio, distinta de la de este sitio informativo.',
        ],
      },
    ],
  },
  terminos: {
    antetitulo: 'LEGAL',
    titulo: 'Términos de uso',
    descripcion: `Condiciones de uso del sitio web de ${EMPRESA.nombre}.`,
    secciones: [
      {
        titulo: 'Objeto',
        parrafos: [
          `Este sitio tiene carácter informativo y presenta los servicios y productos de ${identificacion()}. Su consulta no genera por sí sola relación contractual alguna.`,
          `Para cualquier comunicación relacionada con estos términos: ${CONTACTO.correo}.`,
        ],
      },
      {
        titulo: 'Información sobre servicios y productos',
        parrafos: [
          'Las descripciones de soluciones, módulos y equipos son orientativas. El alcance concreto de cada proyecto, su precio y sus plazos se establecen en la propuesta y el contrato correspondientes.',
          'Los estados indicados para cada solución —operativo, en implementación o en diseño— reflejan su situación en el momento de la publicación y pueden variar.',
        ],
      },
      {
        titulo: 'Propiedad intelectual',
        parrafos: [
          `La marca, el logotipo, los textos y el diseño de este sitio son propiedad de ${EMPRESA.nombre} y no pueden reproducirse sin autorización expresa.`,
        ],
      },
      {
        titulo: 'Responsabilidad',
        parrafos: [
          'Procuramos que la información publicada sea exacta y esté actualizada, pero no podemos garantizar la ausencia de errores ni la disponibilidad ininterrumpida del sitio.',
        ],
      },
      {
        titulo: 'Legislación aplicable',
        parrafos: [
          'Estos términos se rigen por la legislación de la República del Ecuador. Para cualquier controversia derivada de su interpretación o aplicación, las partes se someten a los jueces competentes del domicilio de la empresa.',
        ],
      },
      {
        titulo: 'Enlaces y acceso privado',
        parrafos: [
          'El acceso a las aplicaciones de la plataforma está reservado a las organizaciones cliente y a las personas que estas autoricen, y se rige por sus propias condiciones.',
        ],
      },
    ],
  },
};

export default function Legal({ documento }: { documento: Documento }) {
  const { antetitulo, titulo, descripcion, secciones } = CONTENIDO[documento];

  return (
    <>
      <Seo title={titulo} description={descripcion} />

      <PageHero antetitulo={antetitulo} titulo={titulo}>
        {descripcion}
      </PageHero>

      <section className="seccion texto-legal">
        {secciones.map((seccion) => (
          <article key={seccion.titulo}>
            <h2>{seccion.titulo}</h2>
            {seccion.parrafos.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </article>
        ))}
      </section>
    </>
  );
}
