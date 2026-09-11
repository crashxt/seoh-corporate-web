# SEOH DESIGN TECH S.A. — Web corporativa

Sitio de presentación de la empresa. Comunica dos líneas de negocio:

1. **Plataforma modular multi-tenant** — aplicaciones por vertical (condominios,
   mantenimiento, transporte, procesos, CRM) sobre un núcleo común.
2. **Equipos y domótica** — venta e instalación de equipamiento tecnológico,
   con catálogo administrable.

## Puesta en marcha

```bash
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run images` | Regenera los assets de marca desde `brand-src/`. |
| `npm run typecheck` | Comprueba tipos sin compilar. |
| `npm run build` | Verifica tipos y genera `dist/`. |
| `npm run preview` | Sirve `dist/` localmente. |
| `npm run deploy` | Compila y publica en Cloudflare Workers. |

## Estructura

```
brand-src/     Logotipos originales. NO se publican: pesan 3 MB entre los dos.
public/brand/  Assets generados por npm run images. Esto es lo que se sirve.
scripts/       Pipeline de optimización de imágenes.
src/data/      Contenido: verticales, núcleo de plataforma, contacto, equipos.
src/pages/     Una página por ruta; admin/ es el panel privado.
src/components/ Layout, Logo, Seo, PageHero.
supabase/      Migración del catálogo: productos, documentos, RLS y buckets.
```

### Contenido

Los textos de la web viven en `src/data/`, no repartidos por el JSX. Para
añadir una vertical o cambiar una descripción se edita ahí y aparece a la vez
en la portada, el menú, la página de soluciones y el pie.

### Imágenes de marca

Los logotipos originales traen el fondo negro incrustado, sin transparencia.
`npm run images` extrae la transparencia usando el brillo como canal alfa,
recorta el aire sobrante, reescala a la medida de presentación y emite WebP en
dos anchos con PNG de respaldo. El resultado: **79 KB en escritorio y 38 KB en
móvil**, frente a los 3,06 MB que se servían antes.

Si se sustituye un logotipo, se reemplaza el archivo en `brand-src/` y se
vuelve a ejecutar `npm run images`.

### Catálogo de equipos

Funciona con datos locales de respaldo (`src/data/products.ts`) mientras no
haya Supabase configurado. Para activarlo, copie `.env.example` a `.env.local`
y complete únicamente la URL y la clave anónima. **Nunca la `service_role`**:
el repositorio es público y todo lo que empieza por `VITE_` viaja al navegador.

La migración en `supabase/migrations` crea productos, documentos, roles
administrativos, `is_admin()`, RLS y buckets privados con límites de 5 MB para
imágenes y 25 MB para documentos.

## Cloudflare Workers

`wrangler.jsonc` publica `./dist` como Static Assets con reescritura de SPA.

> **Cuidado antes de desplegar.** `wrangler.jsonc` no declara ninguna ruta, así
> que parece que `npx wrangler deploy` solo afecta al subdominio de pruebas
> `seoh-corporate-web.crashxtedg.workers.dev`. **No es así.** El dominio
> `seohdesigntech.com` está atado a este mismo Worker desde el panel de
> Cloudflare, fuera de este archivo, de modo que **cualquier despliegue sale a
> producción de inmediato**.

Para publicar:

```bash
npm run deploy
```

Comprueba antes que `npm run build` pasa y que el CI está en verde.

## Pendiente antes de publicar

- [ ] **Teléfono y WhatsApp** en `src/data/empresa.ts`. Ahora están vacíos y por
      eso no se muestran; no hay ningún marcador de posición visible.
- [ ] **Confirmar el correo** `info@seohdesigntech.com`.
- [ ] **Revisión legal** de `/privacidad` y `/terminos`, y completar la
      identificación fiscal y el domicilio del responsable.
- [ ] **Dominio definitivo**: si no es `seohdesigntech.com`, actualizar
      `EMPRESA.dominio`, `index.html`, `public/robots.txt` y
      `public/sitemap.xml`.
- [ ] **URL de acceso a las aplicaciones** cuando la plataforma esté publicada,
      para enlazarla desde la navegación.
