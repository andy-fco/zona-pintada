import React, { useEffect, useState } from "react";
import { UsuarioResponse, RolUsuario } from "../../api/authApi";
import { EquipoFantasyResponse } from "../../api/equipoFantasyApi";
import {
  listarUsuarios,
  crearUsuario,
  editarUsuario,
  borrarUsuario,
  listarEquiposFantasy,
  renombrarEquipoFantasy,
  borrarEquipoFantasy,
} from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { Tarjeta, Boton, Campo, Entrada, Selector, Tabla, Celda, useAccion, confirmar } from "./ui";

const FORM_VACIO = { nombre: "", apellido: "", mail: "", usuario: "", password: "", rol: "manager" as RolUsuario };

export const UsuariosAdmin: React.FC = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [equipos, setEquipos] = useState<EquipoFantasyResponse[]>([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [renombrando, setRenombrando] = useState<{ id: number; nombre: string } | null>(null);
  const { ejecutar, Aviso, ocupado } = useAccion();

  const recargar = () => {
    listarUsuarios().then(setUsuarios).catch(() => setUsuarios([]));
    listarEquiposFantasy().then(setEquipos).catch(() => setEquipos([]));
  };

  useEffect(recargar, []);

  const limpiar = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
  };

  const guardar = () => {
    const datos = { nombre: form.nombre.trim(), apellido: form.apellido.trim(), mail: form.mail.trim(), usuario: form.usuario.trim() };
    ejecutar(
      () => (editandoId ? editarUsuario(editandoId, datos) : crearUsuario({ ...datos, password: form.password, rol: form.rol })),
      editandoId ? "Usuario actualizado." : "Usuario creado.",
      () => {
        limpiar();
        recargar();
      }
    );
  };

  const valido =
    form.nombre && form.apellido && form.mail && form.usuario.length >= 3 && (editandoId || form.password.length >= 8);

  return (
    <div className="space-y-6">
      <Aviso />

      <Tarjeta titulo={editandoId ? "Editar usuario" : "Nuevo usuario"}>
        <p className="text-xs text-white/50">
          El rol se elige al crear el usuario y después no se puede cambiar. Para sumar otro administrador, creálo acá con rol administrador.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <Campo etiqueta="Nombre"><Entrada value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Campo>
          <Campo etiqueta="Apellido"><Entrada value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} /></Campo>
          <Campo etiqueta="Mail"><Entrada type="email" value={form.mail} onChange={(e) => setForm({ ...form, mail: e.target.value })} /></Campo>
          <Campo etiqueta="Usuario"><Entrada value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} /></Campo>
          {!editandoId && (
            <>
              <Campo etiqueta="Contraseña (mín. 8)"><Entrada type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Campo>
              <Campo etiqueta="Rol">
                <Selector value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as RolUsuario })}>
                  <option value="manager">Manager (juega)</option>
                  <option value="administrador">Administrador</option>
                </Selector>
              </Campo>
            </>
          )}
          <div className="flex gap-2">
            <Boton variante="primario" disabled={ocupado || !valido} onClick={guardar}>
              {editandoId ? "Guardar cambios" : "Crear"}
            </Boton>
            {editandoId && <Boton onClick={limpiar}>Cancelar</Boton>}
          </div>
        </div>
      </Tarjeta>

      <Tarjeta titulo={`Usuarios (${usuarios.length})`}>
        <Tabla columnas={["Usuario", "Nombre", "Mail", "Rol", ""]} filas={usuarios.length}>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <Celda className="font-bold text-white">{u.usuario}</Celda>
              <Celda>{u.nombre} {u.apellido}</Celda>
              <Celda>{u.mail}</Celda>
              <Celda>{u.rol === "administrador" ? <span className="text-[#FF5C00] font-bold">Administrador</span> : "Manager"}</Celda>
              <Celda className="text-right space-x-2">
                <Boton
                  chico
                  onClick={() => {
                    setEditandoId(u.id);
                    setForm({ ...FORM_VACIO, nombre: u.nombre, apellido: u.apellido, mail: u.mail, usuario: u.usuario, rol: u.rol });
                  }}
                >
                  Editar
                </Boton>
                {u.rol !== "administrador" && String(u.id) !== user?.uid && (
                  <Boton
                    chico
                    variante="peligro"
                    onClick={() =>
                      confirmar(`¿Borrar a ${u.usuario}? También se borra su equipo fantasy.`) &&
                      ejecutar(() => borrarUsuario(u.id), "Usuario borrado.", recargar)
                    }
                  >
                    Borrar
                  </Boton>
                )}
              </Celda>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>

      <Tarjeta titulo={`Equipos fantasy (${equipos.length})`}>
        <Tabla columnas={["Equipo", "Usuario", "Temporada", "Puntos", ""]} filas={equipos.length} vacio="Ningún usuario creó su equipo todavía.">
          {equipos.map((e) => (
            <tr key={e.id}>
              <Celda className="font-bold text-white">
                {renombrando?.id === e.id ? (
                  <Entrada value={renombrando.nombre} onChange={(ev) => setRenombrando({ id: e.id, nombre: ev.target.value })} />
                ) : (
                  e.nombre
                )}
              </Celda>
              <Celda>{e.usuario}</Celda>
              <Celda>{e.temporadaNombre}</Celda>
              <Celda className="font-mono">{e.puntosTotales ?? 0}</Celda>
              <Celda className="text-right space-x-2">
                {renombrando?.id === e.id ? (
                  <>
                    <Boton
                      chico
                      variante="primario"
                      disabled={ocupado || !renombrando.nombre.trim()}
                      onClick={() =>
                        ejecutar(() => renombrarEquipoFantasy(e.id, renombrando.nombre.trim()), "Equipo renombrado.", () => {
                          setRenombrando(null);
                          recargar();
                        })
                      }
                    >
                      Guardar
                    </Boton>
                    <Boton chico onClick={() => setRenombrando(null)}>Cancelar</Boton>
                  </>
                ) : (
                  <Boton chico onClick={() => setRenombrando({ id: e.id, nombre: e.nombre })}>Renombrar</Boton>
                )}
                <Boton
                  chico
                  variante="peligro"
                  onClick={() =>
                    confirmar(`¿Borrar el equipo ${e.nombre}?`) && ejecutar(() => borrarEquipoFantasy(e.id), "Equipo borrado.", recargar)
                  }
                >
                  Borrar
                </Boton>
              </Celda>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>
    </div>
  );
};
