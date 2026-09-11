# Supabase para SEOH

No hay ningún proyecto remoto enlazado ni se ejecutaron migraciones. Cree un proyecto exclusivo de SEOH, aplique `migrations/202608210001_products_admin.sql` y configure las variables de `.env.example`.

El alta administrativa es privada: cree el usuario desde el panel de Authentication y asigne su UUID con la sentencia comentada al final de la migración. Mantenga deshabilitado el registro público. Las imágenes admiten JPG/JPEG/PNG (y WebP generado) hasta 5 MB; los documentos PDF/DOC/DOCX/XLS/XLSX/PPT/PPTX hasta 25 MB. Los buckets son privados y RLS solo permite leer archivos vinculados a productos y documentos activos.

La `service_role_key` nunca debe añadirse al frontend ni a variables `VITE_*`.
