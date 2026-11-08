export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

// Roles del plantel fantasy, iguales a los del back (RolPlantelFantasy):
// capitan, sexto_hombre y normal.
export type TacticalRoleId = 'CAPTAIN' | 'SIXTH_MAN' | 'NORMAL';

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
    multiplier: 1.2,
    description: 'Multiplica sus puntos x1.2. Tiene que haber uno solo y debe ser titular.',
    tagColor: 'bg-[#FF5C00] text-black border-[#FF5C00]'
  },
  SIXTH_MAN: {
    id: 'SIXTH_MAN',
    name: 'Sexto Hombre',
    multiplier: 0.8,
    description: 'Suplente que suma x0.8 en vez de x0.5. Tiene que haber uno solo y debe ser suplente.',
    tagColor: 'bg-white text-black border-white'
  },
  NORMAL: {
    id: 'NORMAL',
    name: 'Normal',
    multiplier: 1.0,
    description: 'Titular suma x1.0 y suplente x0.5.',
    tagColor: 'bg-white/10 text-white/80 border-white/20'
  }
};

// Multiplicador real según el back: depende del rol y de si es titular
export const getRoleMultiplier = (role: TacticalRoleId, isStarter: boolean): number => {
  if (role === 'CAPTAIN') return 1.2;
  if (role === 'SIXTH_MAN') return 0.8;
  return isStarter ? 1.0 : 0.5;
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

