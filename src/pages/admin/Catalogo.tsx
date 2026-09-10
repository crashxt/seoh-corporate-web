import { useEffect, useState, type FormEvent } from 'react';
import { Check, PenLine, Plus, Trash2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Seo from '../../components/Seo';
import GestorArchivos from './GestorArchivos';
import { supabase } from '../../lib/supabase';
import { getProducts } from '../../services/products';
import type { Product } from '../../types';

const EQUIPO_NUEVO = (orden: number): Product => ({
  id: '',
  slug: '',
  name: '',
  category: '',
  summary: '',
  description: '',
  is_active: true,
  sort_order: orden,
});

/** Administracion del catalogo de equipos. */
export default function Catalogo() {
  // null = todavia verificando; el guardado se decide con el RPC del servidor,
  // no con la sola existencia de sesion.
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [equipos, setEquipos] = useState<Product[]>([]);
  const [editando, setEditando] = useState<Product | null>(null);

  const refrescar = async () => {
    const siguientes = await getProducts(true);
    setEquipos(siguientes);
    // Si habia un equipo abierto, se recarga su version fresca.
    setEditando((actual) =>
      actual?.id ? (siguientes.find((e) => e.id === actual.id) ?? null) : actual,
    );
  };

  useEffect(() => {
    if (!supabase) {
      setAutorizado(false);
      return;
    }
    supabase.rpc('is_admin').then(({ data }) => {
      setAutorizado(Boolean(data));
      if (data) refrescar();
    });
  }, []);

  const guardar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!supabase || !editando) return;

    const formulario = new FormData(evento.currentTarget);
    const registro = {
      name: String(formulario.get('name')),
      slug: String(formulario.get('slug')),
      category: String(formulario.get('category')),
      summary: String(formulario.get('summary')),
      description: String(formulario.get('description')),
      is_active: formulario.get('is_active') === 'on',
      sort_order: Number(formulario.get('sort_order')),
    };

    const consulta = editando.id
      ? supabase.from('products').update(registro).eq('id', editando.id)
      : supabase.from('products').insert(registro);

    const { error } = await consulta;
    if (!error) {
      setEditando(null);
      refrescar();
    }
  };

  const eliminar = async (id: string) => {
    if (!supabase || !confirm('¿Eliminar este equipo y sus documentos?')) return;
    await supabase.from('products').delete().eq('id', id);
    refrescar();
  };

  if (autorizado === null) {
    return (
      <section className="pagina-admin">
        <p>Verificando permisos…</p>
      </section>
    );
  }

  if (!autorizado) return <Navigate to="/admin/acceso" replace />;

  return (
    <section className="pagina-admin">
      <Seo title="Administrar catálogo" description="Panel privado SEOH." />

      <div className="encabezado-admin">
        <div>
          <span className="antetitulo">ADMINISTRACIÓN</span>
          <h1>Catálogo de equipos</h1>
        </div>
        <button
          type="button"
          className="boton-primario"
          onClick={() => setEditando(EQUIPO_NUEVO(equipos.length + 1))}
        >
          <Plus aria-hidden="true" />
          Nuevo equipo
        </button>
      </div>

      {editando && (
        <>
          <form className="formulario-admin" onSubmit={guardar}>
            <label>
              Nombre
              <input name="name" required defaultValue={editando.name} />
            </label>
            <label>
              Slug
              <input name="slug" required pattern="[a-z0-9-]+" defaultValue={editando.slug} />
            </label>
            <label>
              Categoría
              <input name="category" required defaultValue={editando.category} />
            </label>
            <label>
              Orden
              <input name="sort_order" type="number" min="0" defaultValue={editando.sort_order} />
            </label>
            <label className="completo">
              Resumen
              <textarea name="summary" required defaultValue={editando.summary} />
            </label>
            <label className="completo">
              Descripción
              <textarea name="description" required defaultValue={editando.description} />
            </label>
            <label className="casilla">
              <input name="is_active" type="checkbox" defaultChecked={editando.is_active} />
              Activo
            </label>
            <div className="acciones-formulario">
              <button className="boton-primario">
                <Check aria-hidden="true" />
                Guardar
              </button>
              <button type="button" className="boton-secundario" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </form>

          {editando.id && <GestorArchivos equipo={editando} alCambiar={refrescar} />}
        </>
      )}

      <div className="lista-admin">
        {equipos.map((equipo) => (
          <article key={equipo.id}>
            <div>
              <span className={equipo.is_active ? 'insignia-activo' : 'insignia-inactivo'}>
                {equipo.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <h2>{equipo.name}</h2>
              <p>
                {equipo.category} · Orden {equipo.sort_order}
              </p>
            </div>
            <div>
              <button
                type="button"
                aria-label={`Editar ${equipo.name}`}
                onClick={() => setEditando(equipo)}
              >
                <PenLine aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={`Eliminar ${equipo.name}`}
                onClick={() => eliminar(equipo.id)}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="nota-admin">
        Los equipos y documentos se publican de forma independiente. Storage y RLS aplican los
        límites y permisos también fuera de esta interfaz.
      </p>
    </section>
  );
}
