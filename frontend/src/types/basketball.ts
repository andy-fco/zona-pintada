export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type TacticalRoleId = 
  | 'CAPTAIN'       // 1.20x
  | 'CO_CAPTAIN'    // 1.15x
  | 'SIXTH_MAN'     // 1.10x
  | 'DEFENSIVE'     // 1.05x
  | 'ROTATION'      // 0.75x
  | 'BENCH'         // 0.50x
  | 'DEEP_BENCH';   // 0.25x

export interface TacticalRole {
  id: TacticalRoleId;
  name: string;
  multiplier: number;
  description: string;
  tagColor: string;
}

export const TACTICAL_ROLES: Record<TacticalRoleId, TacticalRole> = {
  CAPTAIN: {
    id: 'CAPTAIN',
    name: 'Capitán',
    multiplier: 1.20,
    description: 'Estrella principal del quinteto. Multiplica el 100% de su valoración por 1.20.',
    tagColor: 'bg-[#FF5C00] text-black border-[#FF5C00]'
  },
  CO_CAPTAIN: {
    id: 'CO_CAPTAIN',
    name: 'Tirador Clave',
    multiplier: 1.15,
    description: 'Goleador principal del perímetro con 1.15x sobre su puntaje.',
    tagColor: 'bg-orange-500/20 text-[#FF5C00] border-orange-500/40'
  },
  SIXTH_MAN: {
    id: 'SIXTH_MAN',
    name: 'Sexto Hombre',
    multiplier: 1.10,
    description: 'Generador de puntos instantáneo desde el banco con 1.10x.',
    tagColor: 'bg-white text-black border-white'
  },
  DEFENSIVE: {
    id: 'DEFENSIVE',
    name: 'Especialista Defensivo',
    multiplier: 1.05,
    description: 'Rebotes y recuperos clave con 1.05x sobre su planilla oficial.',
    tagColor: 'bg-white/20 text-white border-white/30'
  },
  ROTATION: {
    id: 'ROTATION',
    name: 'Rotación',
    multiplier: 0.75,
    description: 'Minutos de aporte con coeficiente de 0.75x.',
    tagColor: 'bg-white/10 text-white/80 border-white/20'
  },
  BENCH: {
    id: 'BENCH',
    name: 'Suplente',
    multiplier: 0.50,
    description: 'Jugador económico de soporte con 0.50x.',
    tagColor: 'bg-white/5 text-white/60 border-white/10'
  },
  DEEP_BENCH: {
    id: 'DEEP_BENCH',
    name: 'Suplente Profundo',
    multiplier: 0.25,
    description: 'Jugador de salario mínimo para estirar el presupuesto de $110M.',
    tagColor: 'bg-black/60 text-white/40 border-white/5'
  }
};

export interface RecentGameStat {
  opponent: string;
  val: number;
  pts: number;
  reb: number;
  ast: number;
  date: string;
}

export interface BasketballPlayer {
  id: string;
  name: string;
  nickname?: string;
  number: number;
  team: string;
  teamShort: string;
  position: PlayerPosition;
  price: number; // e.g. 18500000 = $18.5M
  avgVal: number;
  pts: number;
  reb: number;
  ast: number;
  fgPct: string;
  height: string;
  status: 'available' | 'doubtful' | 'injured';
  nextOpponent: string;
  recentGames: RecentGameStat[];
}

export interface BasketballCoach {
  id: string;
  name: string;
  team: string;
  teamShort: string;
  price: number; // e.g. 9500000 = $9.5M
  winBonusHome: number; // +5 pts
  winBonusAway: number; // +10 pts
  recentRecord: string; // "14-4"
  tacticalStyle: string; // "Defensa Pick & Roll y Transición Rápida"
  nextOpponent: string;
}

export interface RosterSlot {
  slotId: string;
  slotLabel: string;
  requiredPosition?: PlayerPosition;
  isStarter: boolean;
  player: BasketballPlayer | null;
  role: TacticalRoleId;
}

export interface CoachSlot {
  coach: BasketballCoach | null;
}

export interface TeamRoster {
  teamName: string;
  starters: {
    PG: RosterSlot;
    SG: RosterSlot;
    SF: RosterSlot;
    PF: RosterSlot;
    C: RosterSlot;
  };
  bench: RosterSlot[];
  coach: CoachSlot;
  totalBudget: number; // 110_000_000
}

export const formatSalary = (val: number): string => {
  return `$${(val / 1_000_000).toFixed(1)}M`;
};

