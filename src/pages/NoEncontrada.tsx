import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NoEncontrada() {
  return (
    <section className="cabecera-pagina">
      <Seo title="Página no encontrada" description="La dirección solicitada no existe." />
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no existe o cambió de ubicación.</p>
      <Link className="boton-primario" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
