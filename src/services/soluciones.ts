import { solucionesRespaldo } from '../data/soluciones';
import { supabase } from '../lib/supabase';
import type { Solucion } from '../types';

/**
 * Soluciones publicadas.
 *
 * Mismo patron que el catalogo de equipos: si no hay Supabase configurado se
 * sirven las de respaldo, de modo que el sitio nunca aparece vacio mientras se
 * termina de conectar la base.
 */
export async function obtenerSoluciones(incluirInactivas = false): Promise<Solucion[]> {
  if (!supabase) return solucionesRespaldo.filter((s) => incluirInactivas || s.activa);

  let consulta = supabase.from('soluciones').select('*').order('orden');
  if (!incluirInactivas) consulta = consulta.eq('activa', true);

  const { data, error } = await consulta;
  // Ante un fallo de red se muestran las de respaldo antes que una pagina
  // vacia: el visitante no tiene por que pagar un problema de infraestructura.
  if (error) return solucionesRespaldo.filter((s) => incluirInactivas || s.activa);
  return (data ?? []) as Solucion[];
}

export async function obtenerSolucion(slug: string): Promise<Solucion | undefined> {
  if (!supabase) return solucionesRespaldo.find((s) => s.slug === slug);

  const { data, error } = await supabase
    .from('soluciones')
    .select('*')
    .eq('slug', slug)
    .eq('activa', true)
    .single();

  return error ? solucionesRespaldo.find((s) => s.slug === slug) : (data as Solucion);
}
