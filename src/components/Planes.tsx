import { Check, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPLEMENTOS, PLANES } from '../data/planes';

/**
 * Planes de la plataforma.
 *
 * El gratuito va primero y con el mismo peso visual que el de pago: para una
 * empresa que aun no tiene cartera, quitarle el riesgo al cliente vale mas que
 * empujar la venta.
 *
 * Los limites del plan gratuito se enseñan, no se esconden. Un cliente que
 * descubre el tope despues de cargar sus datos se va enfadado; uno que lo sabe
 * de entrada y entra igual, entra convencido.
 */
export default function Planes() {
  return (
    <>
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

            <div>
              <ul className="lista-marcada">
                {plan.incluye.map((punto) => (
                  <li key={punto}>
                    <Check size={17} aria-hidden="true" />
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>

              {plan.limita.length > 0 && (
                <ul className="lista-limites">
                  {plan.limita.map((punto) => (
                    <li key={punto}>
                      <Minus size={15} aria-hidden="true" />
                      <span>{punto}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link className={plan.destacado ? 'boton-primario' : 'boton-secundario'} to="/contacto">
              {plan.accion}
            </Link>
          </article>
        ))}
      </div>

      <div className="complementos">
        <h3>Complementos</h3>
        <p>Se añaden al plan completo solo si hacen falta.</p>
        <ul>
          {COMPLEMENTOS.map((extra) => (
            <li key={extra.nombre}>
              <Plus size={16} aria-hidden="true" />
              <div>
                <span className="complemento-nombre">{extra.nombre}</span>
                <span className="complemento-precio">+{extra.precio} USD / mes</span>
                <p>{extra.detalle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
