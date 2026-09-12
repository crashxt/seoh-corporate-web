-- Soluciones: equipo mas servicio, vendido como paquete.
--
-- Se separan de "products" a proposito. Un producto es una referencia del
-- mayorista con su codigo y su precio; una solucion es una oferta propia de
-- SEOH que combina varias referencias con trabajo. Mezclarlas en una sola
-- tabla obligaria a llenar de nulos ambos casos.

create table if not exists public.soluciones (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  -- A quien va dirigida. Es lo primero que lee un cliente para descartarse.
  para text not null,
  resumen text not null,
  descripcion text not null default '',
  -- Equipo y servicios van como JSON: son listas cortas que solo se leen
  -- completas, nunca se consultan por elemento, y una tabla aparte obligaria
  -- a dos consultas mas por cada carga de la pagina.
  equipos jsonb not null default '[]'::jsonb,
  servicios jsonb not null default '[]'::jsonb,
  -- Precio orientativo, con IVA. Nulo significa "bajo cotizacion".
  precio_desde numeric(12,2),
  activa boolean not null default false,
  orden integer not null default 0,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

comment on table public.soluciones is
  'Paquetes de equipo mas instalacion. El precio se publica como "desde" porque el alcance depende del sitio.';

create index if not exists soluciones_activa_orden_idx
  on public.soluciones (activa, orden);

alter table public.soluciones enable row level security;

-- Cualquiera puede leer las publicadas: es el catalogo publico del sitio.
drop policy if exists soluciones_lectura_publica on public.soluciones;
create policy soluciones_lectura_publica
  on public.soluciones for select
  using (activa = true);

-- Escribir y ver las no publicadas queda reservado a administracion, con la
-- misma funcion que ya gobierna el catalogo de equipos.
drop policy if exists soluciones_administracion on public.soluciones;
create policy soluciones_administracion
  on public.soluciones for all
  using (public.is_admin())
  with check (public.is_admin());

-- Mantiene actualizado_en sin depender de que la aplicacion lo recuerde.
create or replace function public.tocar_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists soluciones_actualizado_en on public.soluciones;
create trigger soluciones_actualizado_en
  before update on public.soluciones
  for each row execute function public.tocar_actualizado_en();
