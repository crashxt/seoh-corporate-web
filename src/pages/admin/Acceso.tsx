import { useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Seo from '../../components/Seo';
import { supabase } from '../../lib/supabase';

/** Acceso privado al panel de administracion del catalogo de equipos. */
export default function Acceso() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();

    if (!supabase) {
      setMensaje('Configura Supabase para habilitar el acceso administrativo.');
      return;
    }

    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
    setEnviando(false);

    // El mensaje no distingue entre correo inexistente y clave incorrecta:
    // decirlo permitiria enumerar cuentas validas.
    if (error) setMensaje('Credenciales inválidas o acceso no autorizado.');
    else navegar('/admin/equipos');
  };

  return (
    <section className="pagina-acceso">
      <Seo title="Acceso administrativo" description="Acceso privado de administración SEOH." />

      <form className="tarjeta-acceso" onSubmit={enviar}>
        <KeyRound aria-hidden="true" />
        <h1>Administración</h1>
        <p>Acceso privado para personal autorizado.</p>

        <label>
          Correo
          <input
            type="email"
            required
            autoComplete="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
          />
        </label>

        <button className="boton-primario" disabled={enviando}>
          {enviando ? 'Verificando…' : 'Ingresar'}
        </button>

        {mensaje && (
          <p className="aviso" role="alert">
            {mensaje}
          </p>
        )}
      </form>
    </section>
  );
}
