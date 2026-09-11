import { useEffect, useState } from 'react';
import { FileDown } from 'lucide-react';
import { useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';
import NoEncontrada from './NoEncontrada';
import SolicitarCotizacion from '../components/SolicitarCotizacion';
import { formatearPrecio } from '../lib/precio';
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
          <div className="bloque-precio">
            {typeof equipo.price === 'number' ? (
              <>
                <span className="precio">{formatearPrecio(equipo.price)}</span>
                <span className="precio-nota">IVA incluido · precio referencial</span>
              </>
            ) : (
              <span className="precio-nota">Precio bajo cotización</span>
            )}
          </div>

          {(equipo.brand || equipo.code) && (
            <dl className="ficha-datos">
              {equipo.brand && (
                <>
                  <dt>Marca</dt>
                  <dd>{equipo.brand}</dd>
                </>
              )}
              {equipo.code && (
                <>
                  <dt>Código</dt>
                  <dd>{equipo.code}</dd>
                </>
              )}
            </dl>
          )}

          <h2>Descripción</h2>
          <p>{equipo.description}</p>

          <SolicitarCotizacion equipo={equipo} />
          <p className="aviso-cotizacion">
            El equipo se instala y configura como parte de la solución. En la cotización se
            incluye la instalación, la puesta en marcha y el soporte.
          </p>
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
