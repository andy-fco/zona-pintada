import { api } from "./client";
import { BasketballPlayer, BasketballCoach, PlayerPosition } from "../types/basketball";
import { LiveMatch } from "../types/league";
import { LNBTeamStanding, LNBStatLeader } from "../data/lnbStandingsData";

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

// Convierte la posición del back ("base", "ala-pivot", "BASE"...) al código del front
export const toPlayerPosition = (posicion: string): PlayerPosition =>
  POSICIONES[posicion.toUpperCase().replace("-", "_")] ?? "SF";

export function toBasketballPlayer(j: JugadorResponse, equipos: EquipoResponse[]): BasketballPlayer {
  const equipo = equipos.find((e) => e.id === j.equipoId);
  return {
    id: String(j.id),
    name: `${j.nombre} ${j.apellido}`,
    number: 0,
    team: j.equipoNombre,
    teamShort: equipo?.nombreCorto ?? "",
    position: toPlayerPosition(j.posicion),
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
// ---------- Calendario, partidos, posiciones y destacados ----------

export interface SemanaCompetenciaResponse {
  id: number;
  temporadaId: number;
  numeroSemana: number;
  fechaInicio: string;
  fechaFin: string;
  cerradaAt: string | null;
}

export type EstadoPartido = "programado" | "en_juego" | "finalizado" | "suspendido";

export interface PartidoResponse {
  id: number;
  equipoLocalId: number;
  equipoLocal: string;
  equipoVisitanteId: number;
  equipoVisitante: string;
  fechaCompetenciaId: number;
  fecha: string; // "2026-11-08"
  hora: string | null; // "21:00:00"
  puntosLocal: number | null;
  puntosVisitante: number | null;
  estado: EstadoPartido;
}

export interface PosicionLigaResponse {
  posicion: number;
  equipoId: number;
  equipoNombre: string;
  nombreCorto: string;
  escudoUrl: string | null;
  partidosJugados: number;
  ganados: number;
  perdidos: number;
  puntosAFavor: number;
  puntosEnContra: number;
  diferencia: number;
  puntos: number;
}

export interface JugadorDestacadoResponse {
  jugadorId: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  posicion: string;
  equipoNombre: string;
  partidosJugados: number;
  puntosFantasy: number;
}

export interface DestacadosSemanaResponse {
  semanaId: number;
  numeroSemana: number;
  mvp: JugadorDestacadoResponse | null;
  quintetoIdeal: JugadorDestacadoResponse[];
  lideres: JugadorDestacadoResponse[];
}

export const getSemanaActual = () => api<SemanaCompetenciaResponse>("/semanas/actual");
export const getPartidosDeSemana = (semanaId: number) =>
  api<PartidoResponse[]>(`/partidos?semanaId=${semanaId}`);
export const getPosiciones = () => api<PosicionLigaResponse[]>("/posiciones");
export const getDestacados = (semanaId: number) =>
  api<DestacadosSemanaResponse>(`/semanas/${semanaId}/destacados`);

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// "2026-11-08" + "21:00:00" -> "Dom 08/11 21:00 hs"
const formatearFecha = (fecha: string, hora: string | null) => {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const diaSemana = DIAS[new Date(anio, mes - 1, dia).getDay()];
  const textoHora = hora ? ` ${hora.slice(0, 5)} hs` : "";
  return `${diaSemana} ${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}${textoHora}`;
};

const NOMBRES_POSICION: Record<PlayerPosition, string> = {
  PG: "Base",
  SG: "Escolta",
  SF: "Alero",
  PF: "Ala-Pívot",
  C: "Pívot",
};

export function toLiveMatch(p: PartidoResponse, equipos: EquipoResponse[]): LiveMatch {
  const estadio = equipos.find((e) => e.id === p.equipoLocalId)?.estadio ?? "";
  const fecha = formatearFecha(p.fecha, p.hora);
  const estados: Record<EstadoPartido, { status: LiveMatch["status"]; quarter: string }> = {
    en_juego: { status: "live", quarter: "En juego" },
    finalizado: { status: "finished", quarter: "Final" },
    programado: { status: "upcoming", quarter: fecha },
    suspendido: { status: "upcoming", quarter: "Suspendido" },
  };
  return {
    id: String(p.id),
    homeTeam: p.equipoLocal,
    awayTeam: p.equipoVisitante,
    homeScore: p.puntosLocal ?? 0,
    awayScore: p.puntosVisitante ?? 0,
    quarter: estados[p.estado].quarter,
    status: estados[p.estado].status,
    arena: estadio,
    tv: "",
    date: fecha,
  };
}

export function toTeamStanding(p: PosicionLigaResponse): LNBTeamStanding {
  const pct = p.partidosJugados > 0 ? (p.ganados / p.partidosJugados) * 100 : 0;
  return {
    pos: p.posicion,
    team: p.equipoNombre,
    short: p.nombreCorto,
    conference: "Norte", // el back no tiene conferencias
    pj: p.partidosJugados,
    pg: p.ganados,
    pp: p.perdidos,
    pct: `${pct.toFixed(1)}%`,
    pointsFor: p.puntosAFavor,
    pointsAgainst: p.puntosEnContra,
    diff: p.diferencia,
    streak: "-", // el back no calcula rachas
  };
}

export function toStatLeaders(
  d: DestacadosSemanaResponse,
  equipos: EquipoResponse[]
): LNBStatLeader[] {
  const convertir = (lista: JugadorDestacadoResponse[]) =>
    lista.map((j, i) => ({
      rank: i + 1,
      player: `${j.nombre} ${j.apellido}`,
      team: j.equipoNombre,
      teamShort: equipos.find((e) => e.nombre === j.equipoNombre)?.nombreCorto ?? "",
      position: NOMBRES_POSICION[toPlayerPosition(j.posicion)],
      value: Number(j.puntosFantasy).toFixed(1),
      photoInitial: `${j.nombre[0] ?? ""}${j.apellido[0] ?? ""}`,
    }));
  return [
    { category: "Líderes Fantasy", statName: "Puntos Fantasy", leaders: convertir(d.lideres.slice(0, 4)) },
    { category: "Quinteto Ideal", statName: "Puntos Fantasy", leaders: convertir(d.quintetoIdeal) },
  ];
}

// ---------- Estadísticas por partido ----------

export interface JugadorPartidoResponse {
  jugadorId: number;
  jugadorNombre: string;
  partidoId: number;
  equipoId: number;
  equipoNombre: string;
  titular: boolean | null;
  puntos: number | null;
  doblesConvertidos: number | null;
  doblesIntentados: number | null;
  triplesConvertidos: number | null;
  triplesIntentados: number | null;
  libresConvertidos: number | null;
  libresIntentados: number | null;
  rebotesOfensivos: number | null;
  rebotesDefensivos: number | null;
  asistencias: number | null;
  recuperos: number | null;
  perdidas: number | null;
  tapones: number | null;
  valoracion: number | null;
  puntosFantasy: number | null;
}

export const getEstadisticasJugador = (jugadorId: number) =>
  api<JugadorPartidoResponse[]>(`/jugadores/${jugadorId}/estadisticas`);
export const getPartido = (partidoId: number) => api<PartidoResponse>(`/partidos/${partidoId}`);
