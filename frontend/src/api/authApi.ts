import { api, setToken } from "./client";

export type RolUsuario = "manager" | "administrador";

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
  rol: RolUsuario;
}

export interface RegistroRequest {
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
  password: string;
}

interface LoginResponse {
  token: string;
  tipo: string;
  expiraEn: number;
}

export async function login(identificador: string, password: string) {
  const res = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identificador, password }),
  });
  setToken(res.token);
}

export const registrar = (datos: RegistroRequest) =>
  api<UsuarioResponse>("/usuarios/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const obtenerUsuarioActual = () => api<UsuarioResponse>("/usuarios/me");

export const logout = () => setToken(null);