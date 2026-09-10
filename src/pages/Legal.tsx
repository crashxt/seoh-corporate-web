import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import { CONTACTO, EMPRESA } from '../data/empresa';

/**
 * Paginas legales.
 *
 * El contenido describe lo que este sitio hace realmente: no incorpora
 * analitica ni publicidad, no instala cookies de seguimiento y solo trata datos
 * personales cuando alguien decide escribir por los canales publicados. Antes
 * de la puesta en produccion debe revisarlo un profesional y completarse la
 * identificacion fiscal del responsable.
 */
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
          `${EMPRESA.nombre}, con domicilio en ${CONTACTO.ciudad}, es responsable del tratamiento de los datos personales recogidos a través de este sitio web.`,
          `Para cualquier consulta relativa a esta política puedes escribir a ${CONTACTO.correo}.`,
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
        titulo: 'Durante cuánto tiempo',
        parrafos: [
          'Conservamos la información mientras se mantenga la relación o el interés comercial, y después durante el plazo que exija la normativa aplicable.',
        ],
      },
      {
        titulo: 'Tus derechos',
        parrafos: [
          `Puedes solicitar el acceso, la rectificación o la supresión de tus datos, así como oponerte a su tratamiento, escribiendo a ${CONTACTO.correo}.`,
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
          `Este sitio tiene carácter informativo y presenta los servicios y productos de ${EMPRESA.nombre}. Su consulta no genera por sí sola relación contractual alguna.`,
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
