import React, { createContext, useContext, useEffect, useState } from "react";
import { BasketballPlayer, BasketballCoach } from "../types/basketball";
import { LiveMatch } from "../types/league";
import { LNB_PLAYERS, LNB_COACHES, LNB_TEAMS } from "../data/lnbData";
import { LNB_MATCHES_FECHA_18 } from "../data/mockLeaguesAndMatches";
import { LNB_OFFICIAL_STANDINGS, LNB_STAT_LEADERS, LNBTeamStanding, LNBStatLeader } from "../data/lnbStandingsData";
import { useAuth } from "./AuthContext";
import {
  getJugadores,
  getDts,
  getEquipos,
  getTemporadaActiva,
  getSemanaActual,
  getPartidosDeSemana,
  getPosiciones,
  getDestacados,
  toBasketballPlayer,
  toBasketballCoach,
  toEquipoLnb,
  toLiveMatch,
  toTeamStanding,
  toStatLeaders,
  EquipoLnb,
} from "../api/lnbApi";

interface DatosLnb {
  jugadores: BasketballPlayer[];
  dts: BasketballCoach[];
  equipos: EquipoLnb[];
  temporada: string;
  // Semana de competencia en curso (el front la muestra como "Fecha N")
  semanaActualId: number | null;
  numeroFecha: string;
  finSemana: string | null; // "2026-11-08"
  partidos: LiveMatch[];
  posiciones: LNBTeamStanding[];
  lideres: LNBStatLeader[];
  usandoDatosDePrueba: boolean;
}

const DATOS_DE_PRUEBA: DatosLnb = {
  jugadores: LNB_PLAYERS,
  dts: LNB_COACHES,
  equipos: LNB_TEAMS,
  temporada: "2024/25",
  semanaActualId: null,
  numeroFecha: "18",
  finSemana: null,
  partidos: LNB_MATCHES_FECHA_18,
  posiciones: LNB_OFFICIAL_STANDINGS,
  lideres: LNB_STAT_LEADERS,
  usandoDatosDePrueba: true,
};

const DatosLnbContext = createContext<DatosLnb>(DATOS_DE_PRUEBA);

export const DatosLnbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [datos, setDatos] = useState<DatosLnb>(DATOS_DE_PRUEBA);

  // Los endpoints de Spring piden login: se cargan cuando hay usuario.
  // Cada bloque va por separado: si uno falla (por ejemplo, no hay semana en curso),
  // lo demás se carga igual.
  useEffect(() => {
    if (!user) {
      setDatos(DATOS_DE_PRUEBA);
      return;
    }

    const actualizar = (cambios: Partial<DatosLnb>) =>
      setDatos((prev) => ({ ...prev, ...cambios, usandoDatosDePrueba: false }));

    const equiposPromise = getEquipos();

    Promise.all([getJugadores(), getDts(), equiposPromise])
      .then(([js, ds, eqs]) =>
        actualizar({
          jugadores: js.map((j) => toBasketballPlayer(j, eqs)),
          dts: ds.map((d) => toBasketballCoach(d, eqs)),
          equipos: eqs.map(toEquipoLnb),
        })
      )
      .catch((err) => console.warn("Back no disponible, uso datos de prueba:", err.message));

    getTemporadaActiva()
      .then((t) => actualizar({ temporada: t.nombre }))
      .catch(() => {});

    getPosiciones()
      .then((ps) => actualizar({ posiciones: ps.map(toTeamStanding) }))
      .catch(() => {});

    // Semana actual: sus partidos y sus destacados.
    // Si no hay semana en curso, se muestran vacíos (no datos inventados).
    Promise.all([getSemanaActual(), equiposPromise])
      .then(async ([semana, eqs]) => {
        actualizar({
          semanaActualId: semana.id,
          numeroFecha: String(semana.numeroSemana),
          finSemana: semana.fechaFin,
        });
        const [partidos, destacados] = await Promise.all([
          getPartidosDeSemana(semana.id).catch(() => []),
          getDestacados(semana.id).catch(() => null),
        ]);
        actualizar({
          partidos: partidos.map((p) => toLiveMatch(p, eqs)),
          lideres: destacados ? toStatLeaders(destacados, eqs) : [],
        });
      })
      .catch((err) => {
        // Si el back no responde, quedan los datos de prueba
        const backCaido = err instanceof TypeError || (err instanceof Error && err.message === "Error 500");
        if (!backCaido) {
          actualizar({ semanaActualId: null, numeroFecha: "-", finSemana: null, partidos: [], lideres: [] });
        }
      });
  }, [user]);

  return <DatosLnbContext.Provider value={datos}>{children}</DatosLnbContext.Provider>;
};

export const useDatosLnb = () => useContext(DatosLnbContext);
