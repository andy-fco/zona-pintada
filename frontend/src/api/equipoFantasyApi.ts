import { api, getToken } from "./client";
import { getEquipos, toBasketballPlayer, toBasketballCoach, toPlayerPosition, EquipoResponse } from "./lnbApi";
import {
  TeamRoster,
  RosterSlot,
  TacticalRoleId,
  PlayerPosition,
  BasketballPlayer,
  BasketballCoach,
  getRoleMultiplier,
} from "../types/basketball";
import { SuggestedTeam } from "../utils/teamSuggester";
import { TOTAL_BUDGET } from "../data/lnbData";

// Equipo fantasy contra el back de Spring (/api/equipos-fantasy).

type RolBack = "capitan" | "sexto_hombre" | "normal";

interface JugadorFantasyResponse {
  id: number;
  nombre: string;
  apellido: string;
  valor: number;
  equipoId: number;
  equipoNombre: string;
  titular: boolean;
  rol: RolBack;
  multiplicador: number;
  posicion: string;
}

interface DTFantasyResponse {
  id: number;
  nombre: string;
  apellido: string;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}

export interface EquipoFantasyResponse {
  id: number;
  nombre: string;
  usuarioId: number;
  usuario: string;
  temporadaId: number;
  temporadaNombre: string;
  presupuestoMaximo: number;
  presupuestoUtilizado: number;
  presupuestoRestante: number;
  tokensTraspaso: number;
  puntosSemana: number | null;
  puntosTotales: number | null;
  dt: DTFantasyResponse | null;
  jugadores: JugadorFantasyResponse[];
}

interface CrearEquipoFantasyRequest {
  nombre: string;
  dtId: number;
  jugadores: { jugadorId: number; titular: boolean; rol: RolBack }[];
}

const ROL_A_BACK: Record<TacticalRoleId, RolBack> = {
  CAPTAIN: "capitan",
  SIXTH_MAN: "sexto_hombre",
  NORMAL: "normal",
};

const ROL_A_FRONT: Record<RolBack, TacticalRoleId> = {
  capitan: "CAPTAIN",
  sexto_hombre: "SIXTH_MAN",
  normal: "NORMAL",
};

const POSICIONES: PlayerPosition[] = ["PG", "SG", "SF", "PF", "C"];

const NOMBRES: Record<PlayerPosition, string> = {
  PG: "Base",
  SG: "Escolta",
  SF: "Alero",
  PF: "Ala-Pívot",
  C: "Pívot",
};

export const getMiEquipo = () => api<EquipoFantasyResponse>("/equipos-fantasy/me");

// Convierte la respuesta del back al formato de plantilla que usan las pantallas
function toTeamRoster(equipo: EquipoFantasyResponse, equipos: EquipoResponse[]): TeamRoster {
  const slot = (pos: PlayerPosition, titular: boolean): RosterSlot => {
    const j = equipo.jugadores.find(
      (x) => x.titular === titular && toPlayerPosition(x.posicion) === pos
    );
    return {
      slotId: `${titular ? "starter" : "bench"}-${pos.toLowerCase()}`,
      slotLabel: `${NOMBRES[pos]} ${titular ? "Titular" : "Suplente"}`,
      requiredPosition: pos,
      isStarter: titular,
      role: j ? ROL_A_FRONT[j.rol] : "NORMAL",
      player: j
        ? toBasketballPlayer(
            {
              ...j,
              fotoUrl: null,
              fechaNacimiento: null,
              ciudad: null,
              altura: null,
              manoHabil: null,
              pais: null,
            },
            equipos
          )
        : null,
    };
  };

  return {
    teamName: equipo.nombre,
    starters: {
      PG: slot("PG", true),
      SG: slot("SG", true),
      SF: slot("SF", true),
      PF: slot("PF", true),
      C: slot("C", true),
    },
    bench: POSICIONES.map((pos) => slot(pos, false)),
    coach: {
      coach: equipo.dt
        ? toBasketballCoach(
            { ...equipo.dt, fotoUrl: null, fechaNacimiento: null, ciudad: null, pais: null },
            equipos
          )
        : null,
    },
    totalBudget: TOTAL_BUDGET,
  };
}

/**
 * Carga el equipo del usuario logueado.
 * Devuelve null si no hay sesión, si todavía no creó su equipo o si el back no responde.
 */
export async function loadRoster(userId: string | null | undefined): Promise<TeamRoster | null> {
  if (!userId || !getToken()) return null;
  try {
    const [equipo, equipos] = await Promise.all([
      getMiEquipo(),
      getEquipos().catch(() => [] as EquipoResponse[]),
    ]);
    return toTeamRoster(equipo, equipos);
  } catch {
    return null;
  }
}

/**
 * Crea el equipo en el back. El back lo permite UNA sola vez por temporada.
 * Si algo no cumple las reglas, tira un error con el mensaje para mostrar.
 */
export async function saveRoster(
  _userId: string | null | undefined,
  roster: TeamRoster,
  _userDisplayName?: string | null
): Promise<{ success: boolean; cloudSynced: boolean }> {
  const slots = [...(Object.values(roster.starters) as RosterSlot[]), ...roster.bench];

  if (slots.some((s) => !s.player) || !roster.coach.coach) {
    throw new Error("Completá los 5 titulares, los 5 suplentes y el DT antes de guardar.");
  }

  const dtId = Number(roster.coach.coach.id.replace("dt-", ""));
  const jugadores = slots.map((s) => ({
    jugadorId: Number(s.player!.id),
    titular: s.isStarter,
    rol: ROL_A_BACK[s.role],
  }));

  if (Number.isNaN(dtId) || jugadores.some((j) => Number.isNaN(j.jugadorId))) {
    throw new Error("El equipo tiene jugadores de prueba. Armalo con los jugadores reales del back.");
  }

  const request: CrearEquipoFantasyRequest = {
    nombre: roster.teamName?.trim() || "Mi Franquicia LNB",
    dtId,
    jugadores,
  };

  await api<EquipoFantasyResponse>("/equipos-fantasy", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return { success: true, cloudSynced: true };
}

/** Cambia el nombre del equipo del usuario logueado. */
export async function updateFranchiseName(
  _userId: string | null | undefined,
  nombre: string
): Promise<{ success: boolean; cloudSynced: boolean }> {
  try {
    await api<EquipoFantasyResponse>("/equipos-fantasy/me/nombre", {
      method: "PUT",
      body: JSON.stringify({ nombre }),
    });
    return { success: true, cloudSynced: true };
  } catch (err) {
    console.warn("No se pudo cambiar el nombre del equipo:", err);
    return { success: false, cloudSynced: false };
  }
}

// ---------- Puntos de la semana ----------

export interface IntegranteSemanaResponse {
  id: number;
  nombre: string;
  apellido: string;
  posicion: string;
  equipoNombre: string;
  titular: boolean | null;
  rol: string | null;
  multiplicador: number | null;
  puntosSemana: number;
}

export interface PuntosSemanaEquipoResponse {
  semanaId: number;
  numeroSemana: number;
  cerrada: boolean;
  puntosEquipo: number;
  jugadores: IntegranteSemanaResponse[];
  dt: IntegranteSemanaResponse | null;
}

/** Puntos del equipo del usuario logueado en una semana (ya con multiplicadores). */
export const getPuntosSemana = (semanaId: number) =>
  api<PuntosSemanaEquipoResponse>(`/equipos-fantasy/me/semanas/${semanaId}`);

// ---------- Sugerencia de equipo (la arma el back) ----------

interface SugerenciaEquipoResponse {
  dtId: number;
  jugadores: { jugadorId: number; titular: boolean; rol: RolBack }[];
}

/**
 * Pide al back un equipo sugerido y lo arma con los jugadores y DTs que ya tiene el front.
 * Tira error con el mensaje del back si no puede armarlo.
 */
export async function sugerirEquipoDesdeBack(
  jugadores: BasketballPlayer[],
  dts: BasketballCoach[]
): Promise<SuggestedTeam> {
  const sugerencia = await api<SugerenciaEquipoResponse>("/equipos-fantasy/sugerencia");

  const slot = (pos: PlayerPosition, titular: boolean): RosterSlot => {
    const elegido = sugerencia.jugadores
      .filter((j) => j.titular === titular)
      .map((j) => ({ ...j, jugador: jugadores.find((x) => x.id === String(j.jugadorId)) }))
      .find((j) => j.jugador?.position === pos);
    return {
      slotId: `${titular ? "starter" : "bench"}-${pos.toLowerCase()}`,
      slotLabel: `${NOMBRES[pos]} ${titular ? "Titular" : "Suplente"}`,
      requiredPosition: pos,
      isStarter: titular,
      role: elegido ? ROL_A_FRONT[elegido.rol] : "NORMAL",
      player: elegido?.jugador ?? null,
    };
  };

  const starters = {
    PG: slot("PG", true),
    SG: slot("SG", true),
    SF: slot("SF", true),
    PF: slot("PF", true),
    C: slot("C", true),
  };
  const bench = POSICIONES.map((pos) => slot(pos, false));
  const dt = dts.find((d) => d.id === `dt-${sugerencia.dtId}`) ?? null;

  const todos = [...Object.values(starters), ...bench];
  if (todos.some((s) => !s.player) || !dt) {
    throw new Error("La sugerencia del back no coincide con los jugadores cargados. Recargá la página.");
  }

  return {
    starters,
    bench,
    coach: { coach: dt },
    totalCost: dt.price + todos.reduce((suma, s) => suma + (s.player?.price ?? 0), 0),
    projectedValuation: todos.reduce(
      (suma, s) => suma + (s.player ? s.player.avgVal * getRoleMultiplier(s.role, s.isStarter) : 0),
      0
    ),
  };
}
