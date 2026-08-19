import React from 'react';
import { createRoot } from 'react-dom/client';
import { Code2, ShieldCheck, Smartphone, Cloud, ArrowRight, Building2, Mail, Phone, MapPin } from 'lucide-react';
import './styles.css';

const services=[
{icon:Smartphone,title:'Apps móviles',text:'Aplicaciones modernas, escalables y enfocadas en la experiencia del usuario.'},
{icon:Code2,title:'Software empresarial',text:'Soluciones web y de escritorio adaptadas a procesos reales de negocio.'},
{icon:ShieldCheck,title:'Seguridad integrada',text:'Seguridad, control de acceso y protección de datos desde el diseño.'},
{icon:Cloud,title:'Cloud e integraciones',text:'Arquitecturas conectadas, APIs, automatización e integración cloud.'}
];

function App(){
return <div className="site">
<header className="topbar">
<a className="brand" href="#inicio"><img src="/logo-seoh.png" alt="SEOH DESIGN TECH"/></a>
<nav><a href="#empresa">Empresa</a><a href="#servicios">Servicios</a><a href="#soluciones">Soluciones</a><a href="#contacto">Contacto</a><a className="nav-cta" href="#soluciones">Acceso a apps</a></nav>
</header>
<main>
<section className="hero" id="inicio">
<div className="hero-copy"><span className="eyebrow">TECNOLOGÍA · SEGURIDAD · DISEÑO</span>
<h1>Diseñamos soluciones.<br/><span>Construimos confianza.</span></h1>
<p>Creamos aplicaciones móviles, web y de escritorio, integrando diseño, seguridad y tecnología para resolver necesidades reales.</p>
<div className="hero-actions"><a className="primary" href="#servicios">Conoce nuestros servicios <ArrowRight size={18}/></a><a className="secondary" href="#soluciones">Ver soluciones</a></div>
</div>
<div className="hero-card"><img src="/logo-seoh.png" alt="Logo SEOH DESIGN TECH"/></div>
</section>

<section className="section" id="empresa"><div className="section-heading"><span>SEOH DESIGN TECH S.A.</span><h2>Tecnología pensada para crecer con nuestros clientes</h2></div>
<div className="company-grid">
<div className="copy-card"><Building2 size={30}/><h3>Una empresa, múltiples soluciones</h3><p>SEOH DESIGN TECH S.A. es la empresa matriz desde la que desarrollamos, operamos y damos soporte a nuestras soluciones digitales.</p></div>
<div className="copy-card"><ShieldCheck size={30}/><h3>Seguridad desde el diseño</h3><p>Diseñamos cada solución considerando identidad, permisos, disponibilidad, trazabilidad y protección de la información.</p></div>
</div></section>

<section className="section" id="servicios"><div className="section-heading"><span>NUESTROS SERVICIOS</span><h2>Construimos soluciones completas</h2></div>
<div className="service-grid">{services.map(({icon:Icon,title,text})=><article className="service-card" key={title}><div className="icon-wrap"><Icon/></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>

<section className="section" id="soluciones"><div className="section-heading"><span>NUESTRAS SOLUCIONES</span><h2>Productos desarrollados por SEOH</h2></div>
<article className="product-card"><div><span className="status">SOLUCIÓN EN DESARROLLO / IMPLEMENTACIÓN</span><h3>Condominio IA</h3><p>Plataforma integral para la administración de condominios, orientada a gestión administrativa, obligaciones, pagos, conserjería y futura expansión móvil.</p>
<div className="product-actions"><a className="primary" href="#contacto">Conocer más <ArrowRight size={18}/></a><button className="secondary" disabled>Acceso próximamente</button></div></div>
<div className="product-side"><span>Web</span><span>Móvil</span><span>Cloud</span><span>Seguridad</span></div></article></section>

<section className="section contact" id="contacto"><div className="section-heading"><span>CONTACTO</span><h2>Conversemos sobre tu próxima solución</h2></div>
<div className="contact-grid"><div><Mail size={22}/><span>info@seohdesigntech.com</span></div><div><Phone size={22}/><span>+593 XXX XXX XXX</span></div><div><MapPin size={22}/><span>Ecuador</span></div></div>
<p className="note">Los datos de contacto pueden reemplazarse antes de publicar.</p></section>
</main>
<footer><img src="/logo-seoh.png" alt="SEOH DESIGN TECH"/><p>© {new Date().getFullYear()} SEOH DESIGN TECH S.A. Todos los derechos reservados.</p></footer>
</div>}
createRoot(document.getElementById('root')).render(<App/>);
