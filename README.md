# SEOH DESIGN TECH S.A. — Web corporativa

## Local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run typecheck
```

## Arquitectura

La aplicación usa React Router y TypeScript para las páginas nuevas. El catálogo funciona con datos locales de respaldo hasta configurar un proyecto Supabase exclusivo de SEOH. Copie `.env.example` a `.env.local` y complete únicamente la URL y la clave anónima.

La migración en `supabase/migrations` crea productos, documentos, roles administrativos, `is_admin()`, RLS y buckets privados con límites de 5 MB para imágenes y 25 MB para documentos. No ha sido aplicada a ningún proyecto remoto.

## Cloudflare Workers
Conecte este repositorio a Workers Builds.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

El archivo `wrangler.jsonc` publica `./dist` como Static Assets.

## Antes de publicar
- Reemplace teléfono si corresponde.
- Confirme el correo corporativo.
- Defina la URL real de Condominio IA.
- Agregue Política de privacidad y Términos de uso.
