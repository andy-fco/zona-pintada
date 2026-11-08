import { 
  BasketballPlayer, 
  BasketballCoach, 
  RosterSlot, 
  CoachSlot, 
  PlayerPosition,
  getRoleMultiplier
} from "../types/basketball";
import { LNB_PLAYERS as JUGADORES_PRUEBA, LNB_COACHES as DTS_PRUEBA, TOTAL_BUDGET } from "../data/lnbData";

export interface SuggestedTeam {
  starters: {
    PG: RosterSlot;
    SG: RosterSlot;
    SF: RosterSlot;
    PF: RosterSlot;
    C: RosterSlot;
  };
  bench: RosterSlot[];
  coach: CoachSlot;
  totalCost: number;
  projectedValuation: number;
}

const POSICIONES: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C'];

const NOMBRES: Record<PlayerPosition, string> = {
  PG: 'Base',
  SG: 'Escolta',
  SF: 'Alero',
  PF: 'Ala-Pívot',
  C: 'Pívot',
};

// Elige al azar entre los primeros N de una lista ya ordenada
const elegirEntreLosPrimeros = <T,>(lista: T[], n: number): T | undefined =>
  lista[Math.floor(Math.random() * Math.min(n, lista.length))];

/**
 * Arma un equipo que cumple las reglas del back:
 * 5 titulares y 5 suplentes (uno por posición en cada grupo), 1 DT,
 * 1 capitán titular, 1 sexto hombre suplente y costo total <= $110M.
 */
export function generateBudgetCompliantTeam(
  LNB_PLAYERS: BasketballPlayer[] = JUGADORES_PRUEBA,
  LNB_COACHES: BasketballCoach[] = DTS_PRUEBA
): SuggestedTeam {
  const usados = new Set<string>();
  const porPrecio = (a: { price: number }, b: { price: number }) => a.price - b.price;
  const disponibles = (pos: PlayerPosition) =>
    LNB_PLAYERS.filter((p) => p.position === pos && !usados.has(p.id));

  // 1. DT: uno de los 3 más baratos, para dejar presupuesto a los jugadores
  const dt = elegirEntreLosPrimeros([...LNB_COACHES].sort(porPrecio), 3) ?? null;
  let restante = TOTAL_BUDGET - (dt?.price ?? 0);

  // 2. Suplentes: uno barato por posición
  const suplentes = {} as Record<PlayerPosition, BasketballPlayer | null>;
  for (const pos of POSICIONES) {
    const elegido = elegirEntreLosPrimeros(disponibles(pos).sort(porPrecio), 2) ?? null;
    if (elegido) {
      usados.add(elegido.id);
      restante -= elegido.price;
    }
    suplentes[pos] = elegido;
  }

  // 3. Titulares: el mejor posible en cada posición, guardando plata
  //    para poder cubrir las posiciones que faltan con el más barato
  const titulares = {} as Record<PlayerPosition, BasketballPlayer | null>;
  POSICIONES.forEach((pos, i) => {
    const reserva = POSICIONES.slice(i + 1).reduce((suma, otra) => {
      const masBarato = disponibles(otra).sort(porPrecio)[0];
      return suma + (masBarato?.price ?? 0);
    }, 0);
    const pagables = disponibles(pos)
      .filter((p) => p.price <= restante - reserva)
      .sort((a, b) => b.avgVal - a.avgVal || b.price - a.price);
    const elegido =
      elegirEntreLosPrimeros(pagables, 2) ?? disponibles(pos).sort(porPrecio)[0] ?? null;
    if (elegido) {
      usados.add(elegido.id);
      restante -= elegido.price;
    }
    titulares[pos] = elegido;
  });

  // 4. Roles: capitán = mejor titular, sexto hombre = mejor suplente
  const mejor = (grupo: Record<PlayerPosition, BasketballPlayer | null>) =>
    POSICIONES.reduce((mejorPos, pos) =>
      (grupo[pos]?.avgVal ?? -1) > (grupo[mejorPos]?.avgVal ?? -1) ? pos : mejorPos
    , 'PG' as PlayerPosition);
  const posCapitan = mejor(titulares);
  const posSextoHombre = mejor(suplentes);

  const slotTitular = (pos: PlayerPosition): RosterSlot => ({
    slotId: `starter-${pos.toLowerCase()}`,
    slotLabel: `${NOMBRES[pos]} Titular`,
    requiredPosition: pos,
    isStarter: true,
    player: titulares[pos],
    role: pos === posCapitan ? 'CAPTAIN' : 'NORMAL',
  });

  const slotSuplente = (pos: PlayerPosition): RosterSlot => ({
    slotId: `bench-${pos.toLowerCase()}`,
    slotLabel: `${NOMBRES[pos]} Suplente`,
    requiredPosition: pos,
    isStarter: false,
    player: suplentes[pos],
    role: pos === posSextoHombre ? 'SIXTH_MAN' : 'NORMAL',
  });

  const starters = {
    PG: slotTitular('PG'),
    SG: slotTitular('SG'),
    SF: slotTitular('SF'),
    PF: slotTitular('PF'),
    C: slotTitular('C'),
  };
  const bench = POSICIONES.map(slotSuplente);

  const todos = [...Object.values(starters), ...bench];
  const totalCost =
    (dt?.price ?? 0) + todos.reduce((suma, slot) => suma + (slot.player?.price ?? 0), 0);
  const projectedValuation = todos.reduce(
    (suma, slot) =>
      suma + (slot.player ? slot.player.avgVal * getRoleMultiplier(slot.role, slot.isStarter) : 0),
    0
  );

  return {
    starters,
    bench,
    coach: { coach: dt },
    totalCost,
    projectedValuation,
  };
}
