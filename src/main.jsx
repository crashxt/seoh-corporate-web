import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
  Code2,
  ShieldCheck,
  Smartphone,
  Cloud,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Camera,
  HousePlug,
  Network,
  KeyRound,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

import './styles.css';


const services = [
  {
    icon: Smartphone,
    title: 'Apps móviles',
    text:
      'Aplicaciones modernas, escalables y enfocadas en la experiencia del usuario.'
  },
  {
    icon: Code2,
    title: 'Software empresarial',
    text:
      'Soluciones web y de escritorio adaptadas a procesos reales de negocio.'
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad integrada',
    text:
      'Seguridad, control de acceso y protección de datos desde el diseño.'
  },
  {
    icon: Cloud,
    title: 'Cloud e integraciones',
    text:
      'Arquitecturas conectadas, APIs, automatización e integración con servicios cloud.'
  }
];


const products = [
  {
    id: 'camaras',
    icon: Camera,
    title: 'Cámaras de seguridad',
    text:
      'Soluciones de videovigilancia para hogares, condominios, comercios y empresas.'
  },
  {
    id: 'alarmas',
    icon: ShieldCheck,
    title: 'Alarmas',
    text:
      'Sistemas de seguridad, sensores y alertas para protección residencial y empresarial.'
  },
  {
    id: 'domotica',
    icon: HousePlug,
    title: 'Domótica',
    text:
      'Automatización de iluminación, seguridad, accesos y dispositivos inteligentes.'
  },
  {
    id: 'acceso',
    icon: KeyRound,
    title: 'Control de acceso',
    text:
      'Soluciones biométricas, tarjetas, cerraduras inteligentes y control de ingreso.'
  },
  {
    id: 'redes',
    icon: Network,
    title: 'Redes y conectividad',
    text:
      'Equipamiento e infraestructura para redes cableadas, Wi-Fi y conectividad empresarial.'
  }
];


function App() {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileProductsOpen, setMobileProductsOpen] =
    useState(false);


  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  };


  return (

    <div className="site">


      {/* ==================================================
          CABECERA
      ================================================== */}

      <header className="topbar">

        <a
          className="brand"
          href="#inicio"
          aria-label="SEOH DESIGN TECH"
          onClick={closeMobileMenu}
        >

          <img
            src="/logo-seoh-header-2x.png"
            alt="SEOH DESIGN TECH"
          />

        </a>


        {/* MENÚ ESCRITORIO */}

        <nav className="desktop-nav">

          <a href="#empresa">
            Empresa
          </a>

          <a href="#servicios">
            Servicios
          </a>

          <a href="#soluciones">
            Soluciones
          </a>


          <div className="nav-dropdown">

            <a
              href="#productos"
              className="dropdown-trigger"
            >
              Productos

              <ChevronDown
                size={14}
              />
            </a>


            <div className="dropdown-menu">

              <a href="#camaras">
                Cámaras de seguridad
              </a>

              <a href="#alarmas">
                Alarmas
              </a>

              <a href="#domotica">
                Domótica
              </a>

              <a href="#acceso">
                Control de acceso
              </a>

              <a href="#redes">
                Redes y conectividad
              </a>

            </div>

          </div>


          <a href="#soporte">
            Soporte
          </a>

          <a href="#contacto">
            Contacto
          </a>

          <a
            className="nav-cta"
            href="#soluciones"
          >
            Acceso a apps
          </a>

        </nav>


        {/* CONTROLES MÓVILES */}

        <div className="mobile-header-actions">

          <a
            className="mobile-apps-button"
            href="#soluciones"
            onClick={closeMobileMenu}
          >
            Apps
          </a>


          <button
            className="mobile-menu-button"
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >

            {
              mobileMenuOpen
                ? <X size={26}/>
                : <Menu size={26}/>
            }

          </button>

        </div>


        {/* MENÚ MÓVIL */}

        <div
          className={
            mobileMenuOpen
              ? 'mobile-menu open'
              : 'mobile-menu'
          }
        >

          <a
            href="#empresa"
            onClick={closeMobileMenu}
          >
            Empresa
          </a>


          <a
            href="#servicios"
            onClick={closeMobileMenu}
          >
            Servicios
          </a>


          <a
            href="#soluciones"
            onClick={closeMobileMenu}
          >
            Soluciones
          </a>


          <button
            className="mobile-products-trigger"
            type="button"
            onClick={() =>
              setMobileProductsOpen(
                !mobileProductsOpen
              )
            }
          >

            <span>
              Productos
            </span>

            <ChevronDown
              size={18}
              className={
                mobileProductsOpen
                  ? 'rotate'
                  : ''
              }
            />

          </button>


          {
            mobileProductsOpen && (

              <div className="mobile-products-menu">

                <a
                  href="#camaras"
                  onClick={closeMobileMenu}
                >
                  Cámaras de seguridad
                </a>

                <a
                  href="#alarmas"
                  onClick={closeMobileMenu}
                >
                  Alarmas
                </a>

                <a
                  href="#domotica"
                  onClick={closeMobileMenu}
                >
                  Domótica
                </a>

                <a
                  href="#acceso"
                  onClick={closeMobileMenu}
                >
                  Control de acceso
                </a>

                <a
                  href="#redes"
                  onClick={closeMobileMenu}
                >
                  Redes y conectividad
                </a>

              </div>

            )
          }


          <a
            href="#soporte"
            onClick={closeMobileMenu}
          >
            Soporte
          </a>


          <a
            href="#contacto"
            onClick={closeMobileMenu}
          >
            Contacto
          </a>


          <a
            className="mobile-menu-apps"
            href="#soluciones"
            onClick={closeMobileMenu}
          >
            Acceso a aplicaciones
          </a>

        </div>

      </header>



      <main>


        {/* ==================================================
            HERO
        ================================================== */}

        <section
          className="hero"
          id="inicio"
        >

          <div className="hero-copy">

            <span className="eyebrow">
              TECNOLOGÍA · SEGURIDAD · DISEÑO
            </span>


            <h1>

              Diseñamos soluciones.

              <br/>

              <span>
                Construimos confianza.
              </span>

            </h1>


            <p>

              Creamos aplicaciones móviles,
              web y de escritorio, integrando
              diseño, seguridad y tecnología
              para resolver necesidades reales.

            </p>


            <div className="hero-actions">

              <a
                className="primary"
                href="#servicios"
              >

                Conoce nuestros servicios

                <ArrowRight size={18}/>

              </a>


              <a
                className="secondary"
                href="#soluciones"
              >

                Ver soluciones

              </a>

            </div>

          </div>


          <div className="hero-card">

            <img
              src="/logo-seoh.png"
              alt="Logo SEOH DESIGN TECH"
            />

          </div>

        </section>



        {/* ==================================================
            EMPRESA
        ================================================== */}

        <section
          className="section"
          id="empresa"
        >

          <div className="section-heading">

            <span>
              SEOH DESIGN TECH S.A.
            </span>

            <h2>
              Tecnología pensada para crecer
              con nuestros clientes
            </h2>

          </div>


          <div className="company-grid">


            <div className="copy-card">

              <Building2 size={30}/>

              <h3>
                Una empresa,
                múltiples soluciones
              </h3>

              <p>

                SEOH DESIGN TECH S.A. es la
                empresa matriz desde la que
                desarrollamos, operamos y damos
                soporte a nuestras soluciones
                digitales y tecnológicas.

              </p>

            </div>


            <div className="copy-card">

              <ShieldCheck size={30}/>

              <h3>
                Seguridad desde el diseño
              </h3>

              <p>

                Diseñamos cada solución
                considerando identidad,
                permisos, disponibilidad,
                trazabilidad y protección de
                la información.

              </p>

            </div>

          </div>

        </section>



        {/* ==================================================
            SERVICIOS
        ================================================== */}

        <section
          className="section"
          id="servicios"
        >

          <div className="section-heading">

            <span>
              NUESTROS SERVICIOS
            </span>

            <h2>
              Construimos soluciones completas
            </h2>

          </div>


          <div className="service-grid">

            {
              services.map(
                ({
                  icon: Icon,
                  title,
                  text
                }) => (

                  <article
                    className="service-card"
                    key={title}
                  >

                    <div className="icon-wrap">

                      <Icon/>

                    </div>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                  </article>

                )
              )
            }

          </div>

        </section>



        {/* ==================================================
            SOLUCIONES
        ================================================== */}

        <section
          className="section"
          id="soluciones"
        >

          <div className="section-heading">

            <span>
              NUESTRAS SOLUCIONES
            </span>

            <h2>
              Productos digitales desarrollados
              por SEOH
            </h2>

          </div>


          <article className="product-card">

            <div>

              <span className="status">

                SOLUCIÓN EN DESARROLLO /
                IMPLEMENTACIÓN

              </span>


              <h3>
                Condominio IA
              </h3>


              <p>

                Plataforma integral para la
                administración de condominios,
                orientada a gestión administrativa,
                obligaciones, pagos, conserjería
                y futura expansión a servicios
                móviles y automatización inteligente.

              </p>


              <div className="product-actions">

                <a
                  className="primary"
                  href="#contacto"
                >

                  Solicitar información

                  <ArrowRight size={18}/>

                </a>


                <button
                  className="secondary"
                  type="button"
                  disabled
                >

                  Acceso próximamente

                </button>

              </div>

            </div>


            <div className="product-side">

              <span>
                Web
              </span>

              <span>
                Móvil
              </span>

              <span>
                Cloud
              </span>

              <span>
                Seguridad
              </span>

            </div>

          </article>

        </section>



        {/* ==================================================
            PRODUCTOS
        ================================================== */}

        <section
          className="section"
          id="productos"
        >

          <div className="section-heading">

            <span>
              PRODUCTOS TECNOLÓGICOS
            </span>

            <h2>
              Tecnología para proteger,
              conectar y automatizar
            </h2>

          </div>


          <div className="product-catalog">

            {
              products.map(
                ({
                  id,
                  icon: Icon,
                  title,
                  text
                }) => (

                  <article
                    className="catalog-card"
                    id={id}
                    key={id}
                  >

                    <Icon size={32}/>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                    <a href="#contacto">

                      Solicitar cotización →

                    </a>

                  </article>

                )
              )
            }

          </div>

        </section>



        {/* ==================================================
            SOPORTE
        ================================================== */}

        <section
          className="section"
          id="soporte"
        >

          <div className="section-heading">

            <span>
              SOPORTE
            </span>

            <h2>
              Acompañamiento técnico para
              nuestras soluciones
            </h2>

          </div>


          <div className="company-grid">


            <div className="copy-card">

              <ShieldCheck size={30}/>

              <h3>
                Soporte de aplicaciones
              </h3>

              <p>

                Atención para clientes que
                utilizan soluciones desarrolladas
                o implementadas por
                SEOH DESIGN TECH.

              </p>

              <a href="#contacto">
                Solicitar soporte →
              </a>

            </div>


            <div className="copy-card">

              <Code2 size={30}/>

              <h3>
                Asistencia técnica
              </h3>

              <p>

                Diagnóstico, acompañamiento y
                soporte para soluciones de
                software, seguridad, redes y
                automatización.

              </p>

              <a href="#contacto">
                Crear solicitud →
              </a>

            </div>

          </div>

        </section>



        {/* ==================================================
            CONTACTO
        ================================================== */}

        <section
          className="section contact"
          id="contacto"
        >

          <div className="section-heading">

            <span>
              HABLEMOS DE TU PROYECTO
            </span>

            <h2>
              ¿Necesitas software, seguridad
              o infraestructura tecnológica?
            </h2>

          </div>


          <p className="contact-intro">

            Conversemos sobre la solución más
            adecuada para tu empresa, condominio,
            negocio u hogar.

          </p>


          <div className="contact-grid">


            <div>

              <Mail size={22}/>

              <span>
                info@seohdesigntech.com
              </span>

            </div>


            <div>

              <Phone size={22}/>

              <span>
                +593 XXX XXX XXX
              </span>

            </div>


            <div>

              <MapPin size={22}/>

              <span>
                Ecuador
              </span>

            </div>


          </div>


          <p className="note">

            Los datos de contacto pueden
            reemplazarse antes de la
            publicación definitiva.

          </p>

        </section>


      </main>



      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <img
          src="/logo-seoh-header-2x.png"
          alt="SEOH DESIGN TECH"
        />

        <p>

          © {new Date().getFullYear()}
          {' '}
          SEOH DESIGN TECH S.A.
          {' '}
          Todos los derechos reservados.

        </p>

      </footer>


    </div>

  );

}


createRoot(
  document.getElementById('root')
).render(
  <App/>
);