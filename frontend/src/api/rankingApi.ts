import { api, getToken } from "./client";
import { getSemanaActual } from "./lnbApi";

// Ranking de equipos fantasy contra el back (/api/rankings).
// Mantiene el nombre y el formato de la función vieja de Firebase (lib/rosterService)
// para que las pantallas solo tengan que cambiar el import.

interface PosicionRankingResponse {
  posicion: number;
  equipoFantasyId: number;
  nombreEquipo: string;
  usuarioId: number;
  usuario: string;
  puntos: number;
}

interface RankingResponse {
  pagina: number;
  totalPaginas: number;
  totalEquipos: number;
  miPosicion: PosicionRankingResponse | null;
  posiciones: PosicionRankingResponse[];
}

export interface RealRankingUser {
  id: string;
  rank: number;
  teamName: string;
  ownerName: string;
  totalPoints: number;
  matchdayPoints: number;
  favoriteClub: string;
  isCurrentUser?: boolean;
  email?: string;
}

// El back devuelve 50 equipos por página: se traen como máximo las primeras 5 páginas
const MAX_PAGINAS = 5;

async function traerRankingCompleto(ruta: string): Promise<PosicionRankingResponse[]> {
  const primera = await api<RankingResponse>(`${ruta}?pagina=1`);
  const resto = await Promise.all(
    Array.from({ length: Math.min(primera.totalPaginas, MAX_PAGINAS) - 1 }, (_, i) =>
      api<RankingResponse>(`${ruta}?pagina=${i + 2}`)
    )
  );
  return [primera, ...resto].flatMap((r) => r.posiciones);
}

/**
 * Ranking general de la temporada, con los puntos de la semana en curso.
 * Devuelve [] si no hay sesión o si el back no responde.
 */
export async function fetchRealUsersAndFranchises(
  currentUserId?: string | null
): Promise<RealRankingUser[]> {
  if (!currentUserId || !getToken()) return [];
  try {
    const general = await traerRankingCompleto("/rankings/general");

    // Puntos de la semana actual (si hay semana en curso)
    const puntosSemana = new Map<number, number>();
    try {
      const semana = await getSemanaActual();
      const semanal = await traerRankingCompleto(`/rankings/semanas/${semana.id}`);
      semanal.forEach((p) => puntosSemana.set(p.equipoFantasyId, p.puntos));
    } catch {
      // Sin semana en curso: los puntos de la semana quedan en 0
    }

    return general.map((p) => ({
      id: String(p.equipoFantasyId),
      rank: p.posicion,
      teamName: p.nombreEquipo,
      ownerName: p.usuario,
      totalPoints: p.puntos ?? 0,
      matchdayPoints: puntosSemana.get(p.equipoFantasyId) ?? 0,
      favoriteClub: "-",
      isCurrentUser: String(p.usuarioId) === currentUserId,
    }));
  } catch (err) {
    console.warn("No se pudo cargar el ranking:", err);
    return [];
  }
}

/** Posición del usuario logueado en el ranking de una semana (null si no figura). */
export async function getMiPosicionSemanal(semanaId: number): Promise<number | null> {
  try {
    const r = await api<RankingResponse>(`/rankings/semanas/${semanaId}?pagina=1`);
    return r.miPosicion?.posicion ?? null;
  } catch {
    return null;
  }
}

/** Posición y puntos del usuario logueado en el ranking general (null si no tiene equipo). */
export async function getMiRankingGeneral(): Promise<{ posicion: number; puntos: number; total: number } | null> {
  try {
    const r = await api<RankingResponse>("/rankings/general?pagina=1");
    return r.miPosicion
      ? { posicion: r.miPosicion.posicion, puntos: r.miPosicion.puntos ?? 0, total: r.totalEquipos }
      : null;
  } catch {
    return null;
  }
}
