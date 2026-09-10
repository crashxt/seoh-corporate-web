import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';

const IMAGENES_PERMITIDAS = ['image/jpeg', 'image/png', 'image/webp'];
const MAXIMO_IMAGEN = 5 * 1024 * 1024;

const DOCUMENTOS_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const MAXIMO_DOCUMENTO = 25 * 1024 * 1024;

/** Normaliza el nombre de archivo: Storage no admite acentos ni espacios. */
const nombreSeguro = (nombre: string) =>
  nombre
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-');

/**
 * Gestion de imagen y documentos de un equipo.
 *
 * Las validaciones de tipo y tamano se repiten en el servidor mediante RLS y
 * politicas de Storage: lo de aqui es comodidad, no la barrera de seguridad.
 */
export default function GestorArchivos({
  equipo,
  alCambiar,
}: {
  equipo: Product;
  alCambiar: () => void;
}) {
  const [mensaje, setMensaje] = useState('');

  const subirImagen = async (archivo?: File) => {
    if (!archivo || !supabase) return;

    if (archivo.size > MAXIMO_IMAGEN || !IMAGENES_PERMITIDAS.includes(archivo.type)) {
      setMensaje('Imagen inválida: JPG, PNG o WebP, máximo 5 MB.');
      return;
    }

    const ruta = `${equipo.id}/${Date.now()}-${nombreSeguro(archivo.name)}`;
    const { error } = await supabase.storage.from('product-images').upload(ruta, archivo);
    if (error) {
      setMensaje(error.message);
      return;
    }

    // Se borra la anterior solo despues de que la nueva quede subida.
    if (equipo.image_path) {
      await supabase.storage.from('product-images').remove([equipo.image_path]);
    }
    await supabase.from('products').update({ image_path: ruta }).eq('id', equipo.id);

    setMensaje('Imagen actualizada.');
    alCambiar();
  };

  const subirDocumentos = async (archivos: FileList | null) => {
    if (!archivos || !supabase) return;

    for (const archivo of Array.from(archivos)) {
      if (archivo.size > MAXIMO_DOCUMENTO || !DOCUMENTOS_PERMITIDOS.includes(archivo.type)) {
        setMensaje(`${archivo.name}: formato no permitido o supera 25 MB.`);
        continue;
      }

      const ruta = `${equipo.id}/${Date.now()}-${nombreSeguro(archivo.name)}`;
      const { error } = await supabase.storage.from('product-documents').upload(ruta, archivo);
      if (error) continue;

      // Entra despublicado a proposito: se revisa antes de mostrarlo.
      await supabase.from('product_documents').insert({
        product_id: equipo.id,
        name: archivo.name,
        file_path: ruta,
        mime_type: archivo.type,
        file_size: archivo.size,
        is_active: false,
        sort_order: (equipo.documents?.length ?? 0) + 1,
      });
    }

    setMensaje('Documentos procesados; actívalos cuando estén listos.');
    alCambiar();
  };

  const actualizarDocumento = async (id: string, valores: Record<string, unknown>) => {
    await supabase?.from('product_documents').update(valores).eq('id', id);
    alCambiar();
  };

  const eliminarDocumento = async (id: string, ruta: string) => {
    if (!supabase || !confirm('¿Eliminar este documento?')) return;
    await supabase.storage.from('product-documents').remove([ruta]);
    await supabase.from('product_documents').delete().eq('id', id);
    alCambiar();
  };

  return (
    <div className="gestor-archivos">
      <h2>Archivos</h2>

      <label>
        Imagen principal (JPG, PNG o WebP; máx. 5 MB)
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(evento) => subirImagen(evento.target.files?.[0])}
        />
      </label>

      <label>
        Documentos (máx. 25 MB por archivo)
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={(evento) => subirDocumentos(evento.target.files)}
        />
      </label>

      {mensaje && <p role="status">{mensaje}</p>}

      <div className="documentos-admin">
        {(equipo.documents ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((documento) => (
            <div key={documento.id}>
              <span>{documento.name}</span>
              <label>
                <input
                  type="checkbox"
                  checked={documento.is_active}
                  onChange={(evento) =>
                    actualizarDocumento(documento.id, { is_active: evento.target.checked })
                  }
                />
                Publicado
              </label>
              <input
                aria-label={`Orden de ${documento.name}`}
                type="number"
                min="0"
                value={documento.sort_order}
                onChange={(evento) =>
                  actualizarDocumento(documento.id, { sort_order: Number(evento.target.value) })
                }
              />
              <button
                type="button"
                onClick={() => eliminarDocumento(documento.id, documento.file_path)}
                aria-label={`Eliminar ${documento.name}`}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
