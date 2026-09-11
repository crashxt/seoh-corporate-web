import { useEffect, useState } from 'react';
import { ArrowRight, FileDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import NoEncontrada from './NoEncontrada';
import { getDocumentUrl, getProduct } from '../services/products';
import type { Product } from '../types';

export default function EquipoDetalle() {
  const { slug = '' } = useParams();
  const [equipo, setEquipo] = useState<Product>();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCargando(true);
    getProduct(slug)
      .then(setEquipo)
      .finally(() => setCargando(false));
  }, [slug]);

  if (cargando) {
    return (
      <section className="cabecera-pagina">
        <p>Cargando…</p>
      </section>
    );
  }

  if (!equipo) return <NoEncontrada />;

  const documentos = (equipo.documents ?? [])
    .filter((documento) => documento.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Los documentos se sirven con enlace firmado y de vida corta: nunca se
  // expone la ruta del almacenamiento.
  const descargar = async (ruta: string) => {
    try {
      const url = await getDocumentUrl(ruta);
      if (url) window.location.assign(url);
    } catch {
      setError('No fue posible preparar la descarga. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <Seo title={equipo.name} description={equipo.summary} />

      <PageHero antetitulo={equipo.category} titulo={equipo.name}>
        {equipo.summary}
      </PageHero>

      <section className="seccion detalle-equipo">
        <div>
          <h2>Descripción</h2>
          <p>{equipo.description}</p>
          <Link className="boton-primario" to="/contacto">
            Solicitar información
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <aside>
          <h2>Documentos</h2>
          {documentos.length > 0 ? (
            documentos.map((documento) => (
              <button
                type="button"
                className="enlace-documento"
                key={documento.id}
                onClick={() => descargar(documento.file_path)}
              >
                <FileDown aria-hidden="true" />
                {documento.name}
              </button>
            ))
          ) : (
            <p>No hay documentos publicados para este equipo.</p>
          )}
          {error && (
            <p className="aviso" role="alert">
              {error}
            </p>
          )}
        </aside>
      </section>
    </>
  );
}
