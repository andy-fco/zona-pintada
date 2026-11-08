import { useEffect, useState } from "react";
import { BasketballPlayer, RecentGameStat } from "../types/basketball";
import { getToken } from "../api/client";
import { getEstadisticasJugador, getPartido, JugadorPartidoResponse } from "../api/lnbApi";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const n = (valor: number | null | undefined) => Number(valor ?? 0);
const rebotes = (x: JugadorPartidoResponse) => n(x.rebotesOfensivos) + n(x.rebotesDefensivos);
const redondear = (valor: number) => Math.round(valor * 10) / 10;

/**
 * Devuelve el jugador con sus estadísticas reales del back (promedios y últimos partidos).
 * Mientras carga, o si no hay datos, devuelve el jugador tal cual.
 */
export function useEstadisticasJugador(
  player: BasketballPlayer | null,
  activo: boolean
): BasketballPlayer | null {
  const [stats, setStats] = useState<{ id: string; datos: Partial<BasketballPlayer> } | null>(null);

  useEffect(() => {
    if (!activo || !player || Number.isNaN(Number(player.id)) || !getToken()) return;
    let vigente = true;

    getEstadisticasJugador(Number(player.id))
      .then(async (lista) => {
        if (!vigente || lista.length === 0) return;
        const cantidad = lista.length;
        const promedio = (f: (x: JugadorPartidoResponse) => number) =>
          redondear(lista.reduce((suma, x) => suma + f(x), 0) / cantidad);

        const convertidos = lista.reduce((s, x) => s + n(x.doblesConvertidos) + n(x.triplesConvertidos), 0);
        const intentados = lista.reduce((s, x) => s + n(x.doblesIntentados) + n(x.triplesIntentados), 0);

        // Últimos 4 partidos, con el rival y la fecha de cada uno
        const ultimos = [...lista].sort((a, b) => b.partidoId - a.partidoId).slice(0, 4);
        const partidos = await Promise.all(ultimos.map((x) => getPartido(x.partidoId).catch(() => null)));
        const recentGames: RecentGameStat[] = ultimos.map((x, i) => {
          const p = partidos[i];
          const esLocal = p?.equipoLocalId === x.equipoId;
          const [, mes, dia] = (p?.fecha ?? "").split("-").map(Number);
          return {
            opponent: p ? (esLocal ? `vs ${p.equipoVisitante}` : `@ ${p.equipoLocal}`) : `Partido ${x.partidoId}`,
            val: n(x.valoracion),
            pts: n(x.puntos),
            reb: rebotes(x),
            ast: n(x.asistencias),
            date: p ? `${String(dia).padStart(2, "0")} ${MESES[mes - 1]}` : "",
          };
        });

        if (!vigente) return;
        setStats({
          id: player.id,
          datos: {
            avgVal: promedio((x) => n(x.valoracion)),
            pts: promedio((x) => n(x.puntos)),
            reb: promedio(rebotes),
            ast: promedio((x) => n(x.asistencias)),
            fgPct: intentados > 0 ? `${((convertidos / intentados) * 100).toFixed(1)}%` : "-",
            recentGames,
          },
        });
      })
      .catch(() => {});

    return () => {
      vigente = false;
    };
  }, [activo, player?.id]);

  if (!player) return null;
  return stats && stats.id === player.id ? { ...player, ...stats.datos } : player;
}
