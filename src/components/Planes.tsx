import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLANES } from '../data/planes';

/**
 * Planes de la plataforma.
 *
 * El gratuito va primero y con el mismo peso visual que el de pago: para una
 * empresa que aun no tiene cartera, quitarle el riesgo al cliente vale mas que
 * empujar la venta. "Empiece gratis" no le pide nada; "solicite una propuesta"
 * le pide una confianza que todavia no se ha ganado.
 */
export default function Planes() {
  return (
    <div className="rejilla-planes">
      {PLANES.map((plan) => (
        <article
          className={`tarjeta-plan${plan.destacado ? ' plan-destacado' : ''}`}
          key={plan.nombre}
          data-revelar
        >
          <header>
            <h3>{plan.nombre}</h3>
            <p className="plan-precio">{plan.precio}</p>
            <p className="plan-para">{plan.para}</p>
          </header>

          <p>{plan.detalle}</p>

          <ul className="lista-marcada">
            {plan.incluye.map((punto) => (
              <li key={punto}>
                <Check size={17} aria-hidden="true" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>

          <Link className={plan.destacado ? 'boton-primario' : 'boton-secundario'} to="/contacto">
            {plan.destacado ? 'Hablemos de su operación' : 'Empezar sin costo'}
          </Link>
        </article>
      ))}
    </div>
  );
}
