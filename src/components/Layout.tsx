import AsistenteSeoh from './AsistenteSeoh';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { CONTACTO, EMPRESA, enlaceTelefono, telefonoLegible } from '../data/empresa';
import { VERTICALES } from '../data/verticales';
import { CATEGORIAS_EQUIPOS } from '../data/equipos';

/**
 * Navegacion principal.
 *
 * Cinco destinos y una llamada a la accion. Soluciones y Equipos despliegan sus
 * ramas porque son las dos lineas de negocio y conviene que se vean desde
 * cualquier pagina; el resto son enlaces directos.
 */
const NAVEGACION = [
  { etiqueta: 'Plataforma', ruta: '/plataforma' },
  {
    etiqueta: 'Soluciones',
    ruta: '/soluciones',
    ramas: VERTICALES.map((v) => ({ etiqueta: v.nombre, ruta: `/soluciones/${v.slug}` })),
  },
  {
    etiqueta: 'Equipos',
    ruta: '/equipos',
    ramas: CATEGORIAS_EQUIPOS.map((c) => ({
      etiqueta: c,
      ruta: `/equipos?categoria=${encodeURIComponent(c)}`,
    })),
  },
  { etiqueta: 'Empresa', ruta: '/empresa' },
  { etiqueta: 'Contacto', ruta: '/contacto' },
];

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ramaAbierta, setRamaAbierta] = useState<string | null>(null);
  const { pathname, search } = useLocation();
  const contenidoRef = useRef<HTMLElement>(null);

  // Al cambiar de pagina: cerrar el menu y volver arriba. Sin esto, una SPA
  // deja al visitante a media pagina en el destino.
  useEffect(() => {
    setMenuAbierto(false);
    setRamaAbierta(null);
    window.scrollTo(0, 0);
  }, [pathname, search]);

  // Bloquear el desplazamiento del fondo mientras el menu movil esta abierto.
  useEffect(() => {
    document.body.classList.toggle('menu-abierto', menuAbierto);
    return () => document.body.classList.remove('menu-abierto');
  }, [menuAbierto]);

  // Escape cierra el menu: es lo que espera quien navega con teclado.
  useEffect(() => {
    if (!menuAbierto) return;
    const alPulsar = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAbierto(false);
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [menuAbierto]);

  return (
    <div className="sitio">
      <a className="salto-contenido" href="#contenido">
        Saltar al contenido
      </a>

      <header className="barra-superior">
        <Link className="marca" to="/" aria-label={`${EMPRESA.nombre}, ir al inicio`}>
          <Logo variante="cabecera" ancho={300} prioridad decorativo />
        </Link>

        <nav className="nav-escritorio" aria-label="Navegación principal">
          {NAVEGACION.map((item) =>
            item.ramas ? (
              <div className="nav-desplegable" key={item.ruta}>
                <NavLink className="nav-disparador" to={item.ruta}>
                  {item.etiqueta}
                  <ChevronDown size={14} aria-hidden="true" />
                </NavLink>
                <div className="nav-panel">
                  {item.ramas.map((rama) => (
                    <Link key={rama.ruta} to={rama.ruta}>
                      {rama.etiqueta}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={item.ruta} to={item.ruta}>
                {item.etiqueta}
              </NavLink>
            ),
          )}
          <Link className="nav-cta" to="/contacto">
            Solicitar propuesta
          </Link>
        </nav>

        <button
          className="boton-menu"
          type="button"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuAbierto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <nav
        id="menu-movil"
        className={`menu-movil ${menuAbierto ? 'abierto' : ''}`}
        aria-label="Navegación móvil"
        hidden={!menuAbierto}
      >
        {NAVEGACION.map((item) =>
          item.ramas ? (
            <div className="movil-grupo" key={item.ruta}>
              <button
                type="button"
                className="movil-disparador"
                onClick={() => setRamaAbierta((actual) => (actual === item.ruta ? null : item.ruta))}
                aria-expanded={ramaAbierta === item.ruta}
              >
                {item.etiqueta}
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              {ramaAbierta === item.ruta && (
                <div className="movil-ramas">
                  <Link to={item.ruta}>Ver todo</Link>
                  {item.ramas.map((rama) => (
                    <Link key={rama.ruta} to={rama.ruta}>
                      {rama.etiqueta}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink key={item.ruta} to={item.ruta}>
              {item.etiqueta}
            </NavLink>
          ),
        )}
        <Link className="movil-cta" to="/contacto">
          Solicitar propuesta
        </Link>
      </nav>

      <main id="contenido" ref={contenidoRef} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="pie">
        <div className="pie-cuerpo">
          <div className="pie-marca">
            <Logo variante="cabecera" ancho={220} decorativo />
            <p>{EMPRESA.lema}</p>
          </div>

          <nav className="pie-columna" aria-label="Soluciones">
            <h2>Soluciones</h2>
            {VERTICALES.map((v) => (
              <Link key={v.slug} to={`/soluciones/${v.slug}`}>
                {v.nombre}
              </Link>
            ))}
          </nav>

          <nav className="pie-columna" aria-label="Compañía">
            <h2>Compañía</h2>
            <Link to="/plataforma">La plataforma</Link>
            <Link to="/equipos">Equipos y domótica</Link>
            <Link to="/empresa">Empresa</Link>
            <Link to="/soporte">Soporte</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>

          <div className="pie-columna">
            <h2>Contacto</h2>
            <a href={`mailto:${CONTACTO.correo}`}>
              <Mail size={16} aria-hidden="true" />
              {CONTACTO.correo}
            </a>
            {enlaceTelefono && telefonoLegible && (
              <a href={enlaceTelefono}>
                <Phone size={16} aria-hidden="true" />
                {telefonoLegible}
              </a>
            )}
            <span>
              <MapPin size={16} aria-hidden="true" />
              {CONTACTO.ciudad}
            </span>
          </div>
        </div>

        <div className="pie-legal">
          <p>
            © {new Date().getFullYear()} {EMPRESA.nombre}. Todos los derechos reservados.
          </p>
          <div>
            <Link to="/privacidad">Política de privacidad</Link>
            <Link to="/terminos">Términos de uso</Link>
          </div>
        </div>
      </footer>

      {/* Va en el Layout y no en cada página: el visitante puede tener una duda
          en cualquier punto del recorrido, y la más cara de perder es la que
          surge justo antes de cerrar la pestaña. */}
      <AsistenteSeoh />
    </div>
  );
}
