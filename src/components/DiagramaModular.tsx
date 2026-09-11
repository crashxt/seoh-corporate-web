/**
 * Diagrama del modelo modular multi-tenant.
 *
 * "Plataforma modular multi-tenant" no significa nada para un administrador de
 * condominio o un directivo de cooperativa. Este dibujo lo enseña en un
 * vistazo: un nucleo compartido a la izquierda, organizaciones aisladas a la
 * derecha, y cada una con sus propios modulos activados.
 *
 * Va como SVG en linea para que herede los colores del tema y escale sin
 * pixelarse. El texto se dibuja como <text>, asi que un lector de pantalla lo
 * recorre y un buscador lo indexa.
 */
const NUCLEO = [
  'Identidad y accesos',
  'Roles y permisos',
  'Tareas y archivos',
  'Notificaciones',
  'Auditoría',
];

const ORGANIZACIONES = [
  { nombre: 'Conjunto Los Álamos', tipo: 'Condominio', modulos: ['Incidencias', 'Reservas', 'Visitantes'] },
  { nombre: 'Coop. San Rafael', tipo: 'Transporte', modulos: ['Despacho', 'Encomiendas'] },
  { nombre: 'Industrias Vega', tipo: 'Mantenimiento', modulos: ['Activos', 'Órdenes', 'Checklists'] },
];

/** Ancho aproximado de una etiqueta, para dimensionar su pastilla. */
const anchoChip = (texto: string, tamano: number) => texto.length * tamano * 0.56 + 18;

export default function DiagramaModular() {
  const FILA_ALTO = 92;
  const ALTO = ORGANIZACIONES.length * FILA_ALTO + 36;

  return (
    <figure className="diagrama-modular">
      <svg
        viewBox={`0 0 880 ${ALTO}`}
        role="img"
        aria-labelledby="diag-titulo diag-desc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="diag-titulo">Modelo modular multi-tenant de SEOH</title>
        <desc id="diag-desc">
          Un núcleo común de identidad, permisos, tareas, archivos, notificaciones y auditoría
          alimenta a varias organizaciones aisladas entre sí. Cada organización activa únicamente
          los módulos que su operación necesita.
        </desc>

        {/* --- Núcleo compartido --- */}
        <rect
          x="2"
          y="2"
          width="252"
          height={ALTO - 4}
          rx="16"
          fill="var(--acento-tenue)"
          stroke="var(--acento-borde)"
        />
        <text x="24" y="34" className="diag-rotulo" fill="var(--acento)">
          NÚCLEO COMÚN
        </text>
        {NUCLEO.map((capacidad, i) => (
          <g key={capacidad} transform={`translate(24 ${52 + i * 34})`}>
            <rect
              width={anchoChip(capacidad, 12)}
              height="24"
              rx="12"
              fill="var(--fondo-elevado)"
              stroke="var(--borde)"
            />
            <text x="12" y="16" className="diag-chip" fill="var(--texto-medio)">
              {capacidad}
            </text>
          </g>
        ))}
        <text x="24" y={ALTO - 18} className="diag-pie" fill="var(--texto-tenue)">
          Resuelto una vez, para todas
        </text>

        {/* --- Organizaciones --- */}
        {ORGANIZACIONES.map((org, i) => {
          const y = 18 + i * FILA_ALTO;
          const centro = y + 32;
          return (
            <g key={org.nombre}>
              {/* Conexión desde el núcleo, curva para que no parezca jerarquía. */}
              <path
                d={`M 254 ${ALTO / 2} C 300 ${ALTO / 2}, 300 ${centro}, 344 ${centro}`}
                fill="none"
                stroke="var(--acento-borde)"
                strokeWidth="1.5"
              />
              <circle cx="344" cy={centro} r="3.5" fill="var(--acento)" />

              <rect
                x="356"
                y={y}
                width="520"
                height="64"
                rx="12"
                fill="var(--fondo-elevado)"
                stroke="var(--borde)"
              />
              <text x="376" y={y + 26} className="diag-org" fill="var(--texto)">
                {org.nombre}
              </text>
              <text x="376" y={y + 44} className="diag-tipo" fill="var(--texto-tenue)">
                {org.tipo}
              </text>

              {/* Módulos activados en esta organización, y solo en esta. */}
              {(() => {
                let x = 600;
                return org.modulos.map((modulo) => {
                  const ancho = anchoChip(modulo, 11);
                  const actual = x;
                  x += ancho + 8;
                  return (
                    <g key={modulo} transform={`translate(${actual} ${y + 20})`}>
                      <rect
                        width={ancho}
                        height="24"
                        rx="12"
                        fill="var(--acento-tenue)"
                        stroke="var(--acento-borde)"
                      />
                      <text x={ancho / 2} y="16" className="diag-modulo" fill="var(--acento)">
                        {modulo}
                      </text>
                    </g>
                  );
                });
              })()}
            </g>
          );
        })}
      </svg>

      <figcaption>
        Cada organización opera en su propio entorno, con su marca y sus permisos. Los datos de una
        no son alcanzables desde otra. Lo que cambia entre ellas son los módulos activados.
      </figcaption>
    </figure>
  );
}
