import React, { createContext, useContext, useEffect, useState } from "react";
import { BasketballPlayer, BasketballCoach } from "../types/basketball";
import { LNB_PLAYERS, LNB_COACHES, LNB_TEAMS } from "../data/lnbData";
import { useAuth } from "./AuthContext";
import {
  getJugadores,
  getDts,
  getEquipos,
  toBasketballPlayer,
  toBasketballCoach,
  toEquipoLnb,
  EquipoLnb,
} from "../api/lnbApi";

interface DatosLnb {
  jugadores: BasketballPlayer[];
  dts: BasketballCoach[];
  equipos: EquipoLnb[];
  usandoDatosDePrueba: boolean;
}

const DATOS_DE_PRUEBA: DatosLnb = {
  jugadores: LNB_PLAYERS,
  dts: LNB_COACHES,
  equipos: LNB_TEAMS,
  usandoDatosDePrueba: true,
};

const DatosLnbContext = createContext<DatosLnb>(DATOS_DE_PRUEBA);

export const DatosLnbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [datos, setDatos] = useState<DatosLnb>(DATOS_DE_PRUEBA);

  
  useEffect(() => {
    if (!user) {
      setDatos(DATOS_DE_PRUEBA);
      return;
    }
    Promise.all([getJugadores(), getDts(), getEquipos()])
      .then(([js, ds, eqs]) =>
        setDatos({
          jugadores: js.map((j) => toBasketballPlayer(j, eqs)),
          dts: ds.map((d) => toBasketballCoach(d, eqs)),
          equipos: eqs.map(toEquipoLnb),
          usandoDatosDePrueba: false,
        })
      )
      .catch((err) => console.warn("Back no disponible, uso datos de prueba:", err.message));
  }, [user]);

  return <DatosLnbContext.Provider value={datos}>{children}</DatosLnbContext.Provider>;
};

export const useDatosLnb = () => useContext(DatosLnbContext);