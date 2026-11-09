import { api } from "./client";
import {
  EquipoResponse,
  JugadorResponse,
  DTResponse,
  PartidoResponse,
  SemanaCompetenciaResponse,
  JugadorPartidoResponse,
  EstadoPartido,
} from "./lnbApi";
import { UsuarioResponse, RolUsuario } from "./authApi";
import { EquipoFantasyResponse } from "./equipoFantasyApi";

// Endpoints de administración del back (solo rol administrador)

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

// ---------- Temporadas ----------

export interface TemporadaAdmin {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string | null;
  activa: boolean;
}

export interface TemporadaRequest {
  nombre: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export const listarTemporadas = () => api<TemporadaAdmin[]>("/temporadas");
// Crear una temporada la deja activa
export const crearTemporada = (datos: TemporadaRequest) => api<TemporadaAdmin>("/admin/temporadas", json("POST", datos));
export const editarTemporada = (id: number, datos: TemporadaRequest) =>
  api<TemporadaAdmin>(`/admin/temporadas/${id}`, json("PUT", datos));
export const activarTemporada = (id: number) => api<TemporadaAdmin>(`/admin/temporadas/${id}/activar`, json("POST"));
export const borrarTemporada = (id: number) => api<void>(`/admin/temporadas/${id}`, json("DELETE"));

// ---------- Semanas y fechas ----------

export interface FechaCompetencia {
  id: number;
  semanaId: number;
  fecha: string;
}

export const listarSemanas = (temporadaId: number) =>
  api<SemanaCompetenciaResponse[]>(`/semanas?temporadaId=${temporadaId}`);
// Genera todas las semanas (lunes a domingo) de la temporada activa
export const generarSemanas = () => api<SemanaCompetenciaResponse[]>("/semanas/generar", json("POST"));
export const crearSemana = (datos: { temporadaId: number; numeroSemana: number; fechaInicio: string }) =>
  api<SemanaCompetenciaResponse>("/semanas", json("POST", datos));
export const borrarSemana = (id: number) => api<void>(`/semanas/${id}`, json("DELETE"));
export const cerrarSemana = (id: number) => api<SemanaCompetenciaResponse>(`/semanas/${id}/cierre`, json("POST"));
export const recalcularSemana = (id: number) =>
  api<SemanaCompetenciaResponse>(`/semanas/${id}/recalculo`, json("POST"));

export const listarFechas = (semanaId: number) => api<FechaCompetencia[]>(`/semanas/${semanaId}/fechas`);
// Genera los 7 días de la semana
export const generarFechas = (semanaId: number) =>
  api<FechaCompetencia[]>(`/semanas/${semanaId}/fechas/generar`, json("POST"));

// ---------- Partidos ----------

export interface CrearPartidoRequest {
  equipoLocalId: number;
  equipoVisitanteId: number;
  fechaCompetenciaId: number;
  fecha: string;
  hora: string; // "21:00"
}

export interface ActualizarPartidoRequest {
  fecha: string;
  hora: string;
  puntosLocal: number | null;
  puntosVisitante: number | null;
  estado: EstadoPartido;
}

export const listarPartidos = (semanaId: number) => api<PartidoResponse[]>(`/partidos?semanaId=${semanaId}`);
export const crearPartido = (datos: CrearPartidoRequest) => api<PartidoResponse>("/admin/partidos", json("POST", datos));
export const editarPartido = (id: number, datos: ActualizarPartidoRequest) =>
  api<PartidoResponse>(`/admin/partidos/${id}`, json("PUT", datos));
export const borrarPartido = (id: number) => api<void>(`/admin/partidos/${id}`, json("DELETE"));

// ---------- Estadísticas de jugadores por partido ----------

export interface EstadisticasJugador {
  titular: boolean;
  puntos: number;
  doblesConvertidos: number;
  doblesIntentados: number;
  triplesConvertidos: number;
  triplesIntentados: number;
  libresConvertidos: number;
  libresIntentados: number;
  rebotesOfensivos: number;
  rebotesDefensivos: number;
  asistencias: number;
  recuperos: number;
  perdidas: number;
  tapones: number;
  taponesRecibidos: number;
  faltasPersonales: number;
  faltasRecibidas: number;
  masMenos: number;
  valoracion: number;
}

export const listarEstadisticasPartido = (partidoId: number) =>
  api<JugadorPartidoResponse[]>(`/partidos/${partidoId}/estadisticas/jugadores`);
export const registrarEstadisticas = (
  partidoId: number,
  datos: EstadisticasJugador & { jugadorId: number; equipoId: number }
) => api<JugadorPartidoResponse>(`/admin/partidos/${partidoId}/estadisticas/jugadores`, json("POST", datos));
export const editarEstadisticas = (partidoId: number, jugadorId: number, datos: EstadisticasJugador) =>
  api<JugadorPartidoResponse>(`/admin/partidos/${partidoId}/estadisticas/jugadores/${jugadorId}`, json("PUT", datos));
export const borrarEstadisticas = (partidoId: number, jugadorId: number) =>
  api<void>(`/admin/partidos/${partidoId}/estadisticas/jugadores/${jugadorId}`, json("DELETE"));

// ---------- Equipos, jugadores y DTs de la LNB ----------

export type EquipoRequest = Omit<EquipoResponse, "id">;

export interface JugadorRequest {
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  altura: number | null;
  posicion: string; // base | escolta | alero | ala-pivot | pivot
  manoHabil: string | null; // izquierda | derecha
  pais: string | null;
  valor: number; // en millones
  equipoId: number;
}

export interface DTRequest {
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  pais: string | null;
  valor: number; // en millones
  equipoId: number;
}

export const listarEquipos = () => api<EquipoResponse[]>("/equipos");
export const crearEquipo = (d: EquipoRequest) => api<EquipoResponse>("/equipos", json("POST", d));
export const editarEquipo = (id: number, d: EquipoRequest) => api<EquipoResponse>(`/equipos/${id}`, json("PUT", d));
export const borrarEquipo = (id: number) => api<void>(`/equipos/${id}`, json("DELETE"));

export const listarJugadores = (equipoId?: number) =>
  api<JugadorResponse[]>(equipoId ? `/jugadores?equipoId=${equipoId}` : "/jugadores");
export const crearJugador = (d: JugadorRequest) => api<JugadorResponse>("/jugadores", json("POST", d));
export const editarJugador = (id: number, d: JugadorRequest) => api<JugadorResponse>(`/jugadores/${id}`, json("PUT", d));
export const borrarJugador = (id: number) => api<void>(`/jugadores/${id}`, json("DELETE"));

export const listarDts = () => api<DTResponse[]>("/dts");
export const crearDt = (d: DTRequest) => api<DTResponse>("/dts", json("POST", d));
export const editarDt = (id: number, d: DTRequest) => api<DTResponse>(`/dts/${id}`, json("PUT", d));
export const borrarDt = (id: number) => api<void>(`/dts/${id}`, json("DELETE"));

// ---------- Usuarios ----------

export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
}

export const listarUsuarios = () => api<UsuarioResponse[]>("/admin/usuarios");
export const crearUsuario = (d: UsuarioRequest & { password: string; rol: RolUsuario }) =>
  api<UsuarioResponse>("/admin/usuarios", json("POST", d));
export const editarUsuario = (id: number, d: UsuarioRequest) =>
  api<UsuarioResponse>(`/admin/usuarios/${id}`, json("PUT", d));
export const borrarUsuario = (id: number) => api<void>(`/admin/usuarios/${id}`, json("DELETE"));

// ---------- Equipos fantasy (moderación) ----------

export const listarEquiposFantasy = () => api<EquipoFantasyResponse[]>("/equipos-fantasy");
export const renombrarEquipoFantasy = (id: number, nombre: string) =>
  api<EquipoFantasyResponse>(`/admin/equipos-fantasy/${id}/nombre`, json("PUT", { nombre }));
export const borrarEquipoFantasy = (id: number) => api<void>(`/admin/equipos-fantasy/${id}`, json("DELETE"));
