import { api } from "./client";
import { BasketballPlayer, BasketballCoach, PlayerPosition } from "../types/basketball";

export interface EquipoResponse {
  id: number;
  nombre: string;
  nombreCorto: string;
  ciudad: string;
  escudoUrl: string | null;
  estadio: string;
}

export interface JugadorResponse {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  altura: number | null;
  posicion: string;
  manoHabil: string | null;
  pais: string | null;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}

export interface DTResponse {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  pais: string | null;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}

export interface EquipoLnb {
  id: string;
  name: string;
  short: string;
  city: string;
}

export const getEquipos = () => api<EquipoResponse[]>("/equipos");
export const getJugadores = () => api<JugadorResponse[]>("/jugadores");
export const getDts = () => api<DTResponse[]>("/dts");


const POSICIONES: Record<string, PlayerPosition> = {
  BASE: "PG",
  ESCOLTA: "SG",
  ALERO: "SF",
  ALA_PIVOT: "PF",
  PIVOT: "C",
};

export const toEquipoLnb = (e: EquipoResponse): EquipoLnb => ({
  id: String(e.id),
  name: e.nombre,
  short: e.nombreCorto,
  city: e.ciudad,
});

export function toBasketballPlayer(j: JugadorResponse, equipos: EquipoResponse[]): BasketballPlayer {
  const equipo = equipos.find((e) => e.id === j.equipoId);
  const posicion = j.posicion.toUpperCase().replace("-", "_");
  return {
    id: String(j.id),
    name: `${j.nombre} ${j.apellido}`,
    number: 0,
    team: j.equipoNombre,
    teamShort: equipo?.nombreCorto ?? "",
    position: POSICIONES[posicion] ?? "SF",
    price: Number(j.valor) * 1_000_000,
    height: j.altura ? `${j.altura}m` : "-",
    avgVal: 0,
    pts: 0,
    reb: 0,
    ast: 0,
    fgPct: "-",
    status: "available",
    nextOpponent: "-",
    recentGames: [],
  };
}

export function toBasketballCoach(d: DTResponse, equipos: EquipoResponse[]): BasketballCoach {
  const equipo = equipos.find((e) => e.id === d.equipoId);
  return {
    id: `dt-${d.id}`,
    name: `${d.nombre} ${d.apellido}`,
    team: d.equipoNombre,
    teamShort: equipo?.nombreCorto ?? "",
    price: Number(d.valor) * 1_000_000,
    winBonusHome: 5,
    winBonusAway: 10,
    recentRecord: "-",
    tacticalStyle: "-",
    nextOpponent: "-",
  };
}

export interface TemporadaResponse {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string | null;
  activa: boolean;
}

export const getTemporadaActiva = () => api<TemporadaResponse>("/temporadas/activa");