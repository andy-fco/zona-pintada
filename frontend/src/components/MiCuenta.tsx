import React, { useState } from "react";
import { UserCog, KeyRound, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { actualizarPerfil, cambiarPassword, eliminarCuenta } from "../api/authApi";
import { Tarjeta, Boton, Campo, Entrada, useAccion } from "./Admin/ui";

interface MiCuentaProps {
  onCuentaEliminada: () => void;
}

export const MiCuenta: React.FC<MiCuentaProps> = ({ onCuentaEliminada }) => {
  const { user, setUsuarioActual, signOut } = useAuth();

  // Cada tarjeta tiene su propio aviso de éxito o error
  const perfil = useAccion();
  const clave = useAccion();
  const baja = useAccion();

  const [datos, setDatos] = useState({
    nombre: user?.nombre ?? "",
    apellido: user?.apellido ?? "",
    mail: user?.email ?? "",
    usuario: user?.displayName ?? "",
  });
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", repetida: "" });
  const [confirmacionBaja, setConfirmacionBaja] = useState("");

  if (!user) return null;

  const esAdmin = user.rol === "administrador";
  const huboCambios =
    datos.nombre !== user.nombre ||
    datos.apellido !== user.apellido ||
    datos.mail !== user.email ||
    datos.usuario !== user.displayName;
  const perfilValido = datos.nombre.trim() && datos.apellido.trim() && datos.mail.trim() && datos.usuario.trim().length >= 3;

  const guardarPerfil = () =>
    perfil.ejecutar(
      () =>
        actualizarPerfil({
          nombre: datos.nombre.trim(),
          apellido: datos.apellido.trim(),
          mail: datos.mail.trim(),
          usuario: datos.usuario.trim(),
        }),
      "Datos actualizados.",
      setUsuarioActual
    );

  const errorPassword =
    passwords.nueva && passwords.nueva.length < 8
      ? "La contraseña nueva tiene que tener al menos 8 caracteres."
      : passwords.repetida && passwords.nueva !== passwords.repetida
      ? "Las contraseñas nuevas no coinciden."
      : null;

  const guardarPassword = () =>
    clave.ejecutar(() => cambiarPassword(passwords.actual, passwords.nueva), "Contraseña actualizada.", () =>
      setPasswords({ actual: "", nueva: "", repetida: "" })
    );

  const borrarCuenta = () =>
    baja.ejecutar(eliminarCuenta, undefined, async () => {
      await signOut();
      onCuentaEliminada();
    });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-xs font-bold uppercase text-[#FF5C00] rounded-full mb-3">
          <UserCog className="w-3.5 h-3.5" />
          {esAdmin ? "Administrador" : "Director Técnico"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white">Mi Cuenta</h1>
        <p className="text-sm text-white/50 mt-1">
          @{user.displayName} • {user.email}
        </p>
      </div>

      <Tarjeta titulo="Datos personales">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo etiqueta="Nombre">
            <Entrada value={datos.nombre} maxLength={100} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
          </Campo>
          <Campo etiqueta="Apellido">
            <Entrada value={datos.apellido} maxLength={100} onChange={(e) => setDatos({ ...datos, apellido: e.target.value })} />
          </Campo>
          <Campo etiqueta="Mail">
            <Entrada type="email" value={datos.mail} onChange={(e) => setDatos({ ...datos, mail: e.target.value })} />
          </Campo>
          <Campo etiqueta="Usuario (mín. 3 caracteres)">
            <Entrada value={datos.usuario} maxLength={50} onChange={(e) => setDatos({ ...datos, usuario: e.target.value })} />
          </Campo>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Boton variante="primario" disabled={perfil.ocupado || !huboCambios || !perfilValido} onClick={guardarPerfil}>
            Guardar cambios
          </Boton>
          <perfil.Aviso />
        </div>
      </Tarjeta>

      <Tarjeta titulo="Cambiar contraseña">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <KeyRound className="w-4 h-4 text-[#FF5C00]" />
          Para cambiarla necesitás tu contraseña actual.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Campo etiqueta="Contraseña actual">
            <Entrada type="password" value={passwords.actual} onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })} />
          </Campo>
          <Campo etiqueta="Nueva (mín. 8)">
            <Entrada type="password" maxLength={72} value={passwords.nueva} onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })} />
          </Campo>
          <Campo etiqueta="Repetir nueva">
            <Entrada type="password" maxLength={72} value={passwords.repetida} onChange={(e) => setPasswords({ ...passwords, repetida: e.target.value })} />
          </Campo>
        </div>
        {errorPassword && <p className="text-xs text-red-300">{errorPassword}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <Boton
            variante="primario"
            disabled={clave.ocupado || !passwords.actual || !passwords.nueva || !!errorPassword || passwords.nueva !== passwords.repetida}
            onClick={guardarPassword}
          >
            Cambiar contraseña
          </Boton>
          <clave.Aviso />
        </div>
      </Tarjeta>

      <section className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-black italic uppercase text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Eliminar cuenta
        </h3>
        {esAdmin ? (
          <p className="text-sm text-white/60">
            Las cuentas de administrador no se pueden eliminar desde acá.
          </p>
        ) : (
          <>
            <p className="text-sm text-white/60">
              Se borran tu cuenta y tu equipo fantasy con todos sus puntos. <strong className="text-white">No se puede deshacer.</strong>
            </p>
            <Campo etiqueta={`Para confirmar, escribí tu usuario: ${user.displayName}`} className="sm:w-96">
              <Entrada value={confirmacionBaja} onChange={(e) => setConfirmacionBaja(e.target.value)} />
            </Campo>
            <div className="flex flex-wrap items-center gap-3">
              <Boton variante="peligro" disabled={baja.ocupado || confirmacionBaja !== user.displayName} onClick={borrarCuenta}>
                Eliminar mi cuenta
              </Boton>
              <baja.Aviso />
            </div>
          </>
        )}
      </section>
    </div>
  );
};
