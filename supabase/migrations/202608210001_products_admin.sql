-- Ejecutar únicamente en el proyecto Supabase exclusivo de SEOH DESIGN TECH.
create extension if not exists pgcrypto;

create type public.app_role as enum ('admin');
create table public.user_roles (user_id uuid primary key references auth.users(id) on delete cascade, role public.app_role not null default 'admin', created_at timestamptz not null default now());
create table public.products (
  id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (length(name) between 2 and 120), category text not null check (length(category) between 2 and 80),
  summary text not null check (length(summary) <= 500), description text not null,
  image_path text, image_url text, is_active boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_documents (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (length(name) between 1 and 180), file_path text not null unique, mime_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 26214400), is_active boolean not null default false,
  sort_order integer not null default 0, created_at timestamptz not null default now()
);
create index products_public_order_idx on public.products(is_active,sort_order);
create index product_documents_public_idx on public.product_documents(product_id,is_active,sort_order);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public,auth as $$
  select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin');
$$;
revoke all on function public.is_admin() from public; grant execute on function public.is_admin() to anon,authenticated;
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now();return new;end $$;
create trigger products_touch_updated_at before update on public.products for each row execute function public.touch_updated_at();

alter table public.user_roles enable row level security; alter table public.products enable row level security; alter table public.product_documents enable row level security;
create policy "admins read roles" on public.user_roles for select to authenticated using (public.is_admin());
create policy "public read active products" on public.products for select to anon,authenticated using (is_active or public.is_admin());
create policy "admins insert products" on public.products for insert to authenticated with check (public.is_admin());
create policy "admins update products" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete products" on public.products for delete to authenticated using (public.is_admin());
create policy "public read active documents" on public.product_documents for select to anon,authenticated using ((is_active and exists(select 1 from public.products p where p.id=product_id and p.is_active)) or public.is_admin());
create policy "admins insert documents" on public.product_documents for insert to authenticated with check (public.is_admin());
create policy "admins update documents" on public.product_documents for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete documents" on public.product_documents for delete to authenticated using (public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('product-images','product-images',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('product-documents','product-documents',false,26214400,array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "public active product images" on storage.objects for select to anon,authenticated using (bucket_id='product-images' and (exists(select 1 from public.products p where p.image_path=name and p.is_active) or public.is_admin()));
create policy "public active product documents" on storage.objects for select to anon,authenticated using (bucket_id='product-documents' and (exists(select 1 from public.product_documents d join public.products p on p.id=d.product_id where d.file_path=name and d.is_active and p.is_active) or public.is_admin()));
create policy "admins upload product files" on storage.objects for insert to authenticated with check (bucket_id in ('product-images','product-documents') and public.is_admin());
create policy "admins update product files" on storage.objects for update to authenticated using (bucket_id in ('product-images','product-documents') and public.is_admin()) with check (public.is_admin());
create policy "admins delete product files" on storage.objects for delete to authenticated using (bucket_id in ('product-images','product-documents') and public.is_admin());

-- Alta privada inicial (después de crear el usuario en Authentication):
-- insert into public.user_roles(user_id,role) values ('UUID_DEL_USUARIO','admin');
