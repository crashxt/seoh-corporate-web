import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Plataforma from './pages/Plataforma';
import Soluciones from './pages/Soluciones';
import SolucionDetalle from './pages/SolucionDetalle';
import Empresa from './pages/Empresa';
import Soporte from './pages/Soporte';
import Contacto from './pages/Contacto';
import NoEncontrada from './pages/NoEncontrada';

/**
 * Las paginas que hablan con Supabase se cargan aparte.
 *
 * El cliente de Supabase pesa mas que todo el resto del sitio junto, y solo lo
 * necesitan el catalogo de equipos y la administracion. Cargandolas bajo
 * demanda, quien entra a la portada no descarga nada de eso.
 */
const Equipos = lazy(() => import('./pages/Equipos'));
const EquipoDetalle = lazy(() => import('./pages/EquipoDetalle'));
const Acceso = lazy(() => import('./pages/admin/Acceso'));
const Catalogo = lazy(() => import('./pages/admin/Catalogo'));
const Legal = lazy(() => import('./pages/Legal'));

const Cargando = () => (
  <section className="cabecera-pagina">
    <p>Cargando…</p>
  </section>
);

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="plataforma" element={<Plataforma />} />

          <Route path="soluciones" element={<Soluciones />} />
          <Route path="soluciones/:slug" element={<SolucionDetalle />} />

          <Route path="equipos" element={<Equipos />} />
          <Route path="equipos/:slug" element={<EquipoDetalle />} />

          <Route path="empresa" element={<Empresa />} />
          <Route path="soporte" element={<Soporte />} />
          <Route path="contacto" element={<Contacto />} />

          <Route path="privacidad" element={<Legal documento="privacidad" />} />
          <Route path="terminos" element={<Legal documento="terminos" />} />

          <Route path="admin/acceso" element={<Acceso />} />
          <Route path="admin/equipos" element={<Catalogo />} />

          {/* Rutas de la version anterior: se redirigen para no romper enlaces
              ya compartidos ni lo que tenga indexado un buscador. */}
          <Route path="servicios" element={<Navigate to="/plataforma" replace />} />
          <Route path="productos" element={<Navigate to="/equipos" replace />} />
          <Route path="productos/:slug" element={<Navigate to="/equipos" replace />} />
          <Route path="admin/login" element={<Navigate to="/admin/acceso" replace />} />
          <Route path="admin/productos" element={<Navigate to="/admin/equipos" replace />} />

          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
