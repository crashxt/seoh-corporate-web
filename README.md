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

### Cabeceras de seguridad

`public/_headers` viaja con el build y Cloudflare lo aplica solo. Se puede
comprobar en cualquier momento:

```bash
curl -sI https://seohdesigntech.com/ | grep -iE "security|x-frame|nosniff|referrer|permissions"
```

### Ajustes que NO están en este repositorio

Dos cosas dependen del panel de Cloudflare y no pueden corregirse desde aquí,
porque ni `_headers` ni `_redirects` distinguen esquema ni nombre de host:

**1. `http://` sirve el sitio en claro.** Hoy `http://seohdesigntech.com`
devuelve `200` con la página, no una redirección. Quien teclea el dominio sin
escribir `https://` recibe el sitio sin cifrar, legible y modificable por
cualquiera en esa red. HSTS no lo cubre: el navegador solo lo obedece *después*
de una primera visita correcta por HTTPS.

> Solución: **SSL/TLS → Edge Certificates → Always Use HTTPS: activado.**

**2. `www` no tiene cabeceras y por HTTP está roto.**
`https://www.seohdesigntech.com` responde `301` hacia la raíz, y esa respuesta
de redirección no lleva ninguna cabecera de seguridad; `http://www` devuelve
`522`. Los analizadores que prueban `www` califican esa redirección, no el
sitio, y dan una nota falsa.

> Se corrige con lo mismo de arriba, más una regla de redirección de `www` a la
> raíz que conserve el esquema.

Tras activarlo, las cuatro direcciones —con y sin `www`, por HTTP y por
HTTPS— deben acabar en `https://seohdesigntech.com` con las seis cabeceras.

Comprueba antes que `npm run build` pasa y que el CI está en verde.

## Pendiente

El sitio ya está publicado en `https://seohdesigntech.com`. Estos puntos siguen
abiertos y se asumieron de forma consciente al publicar:

- [ ] **Revisión legal** de `/privacidad` y `/terminos`. Están redactadas contra
      la Ley Orgánica de Protección de Datos Personales del Ecuador y describen
      con precisión lo que el sitio hace, pero no las ha revisado un
      profesional.
- [ ] **Identificación fiscal.** `REGISTRO.ruc` y `REGISTRO.direccion` en
      `src/data/empresa.ts` están vacíos, así que la página los omite en lugar
      de publicarlos a medias. La LOPDP exige identificar al responsable del
      tratamiento.
- [ ] **Estado de las verticales.** «Gestión de procesos (BPM)» figura como
      *Operativo*. Conviene confirmar que es exacto si todavía no hay clientes
      usándolo en producción.

Resuelto:

- [x] Teléfono, WhatsApp y correo reales, propagados a web y papelería.
- [x] Dominio activo y sirviendo el sitio.
