import { 
  BasketballPlayer, 
  BasketballCoach, 
  RosterSlot, 
  CoachSlot, 
  PlayerPosition,
  TacticalRoleId 
} from "../types/basketball";
import { LNB_PLAYERS, LNB_COACHES, TOTAL_BUDGET } from "../data/lnbData";

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

/**
 * Intelligently generates a balanced, competitive fantasy team that
 * GUARANTEES the total expenditure is <= TOTAL_BUDGET ($110M).
 */
export function generateBudgetCompliantTeam(): SuggestedTeam {
  // 1. Pick a coach within a reasonable price (7.5M to 9M)
  const affordableCoaches = LNB_COACHES.filter((c) => c.price <= 9500000);
  const selectedCoach = affordableCoaches[Math.floor(Math.random() * affordableCoaches.length)] || LNB_COACHES[LNB_COACHES.length - 1];

  let coachCost = selectedCoach.price;
  let remainingBudget = TOTAL_BUDGET - coachCost; // typically ~101.4M to 102.5M

  // 2. Separate players by position
  const pgs = LNB_PLAYERS.filter((p) => p.position === "PG");
  const sgs = LNB_PLAYERS.filter((p) => p.position === "SG");
  const sfs = LNB_PLAYERS.filter((p) => p.position === "SF");
  const pfs = LNB_PLAYERS.filter((p) => p.position === "PF");
  const cs = LNB_PLAYERS.filter((p) => p.position === "C");

  // Pick 4 economical bench players first or reserve ~25M for bench
  // Sub players in data have prices 4.5M - 7.5M
  const benchPool = [...LNB_PLAYERS.filter((p) => p.price <= 8000000)]
    .sort(() => 0.5 - Math.random()); // randomize

  // Select 4 bench players
  const selectedBenchPlayers: BasketballPlayer[] = [];
  const usedPlayerIds = new Set<string>();

  for (const player of benchPool) {
    if (selectedBenchPlayers.length >= 4) break;
    if (!usedPlayerIds.has(player.id)) {
      selectedBenchPlayers.push(player);
      usedPlayerIds.add(player.id);
    }
  }

  // Fallback if not enough bench pool
  if (selectedBenchPlayers.length < 4) {
    const cheapSorted = [...LNB_PLAYERS]
      .filter((p) => !usedPlayerIds.has(p.id))
      .sort((a, b) => a.price - b.price);
    while (selectedBenchPlayers.length < 4 && cheapSorted.length > 0) {
      const p = cheapSorted.shift()!;
      selectedBenchPlayers.push(p);
      usedPlayerIds.add(p.id);
    }
  }

  const benchCost = selectedBenchPlayers.reduce((sum, p) => sum + p.price, 0);
  let starterBudget = remainingBudget - benchCost;

  // Function to pick starter from a position pool within budget limit
  const pickStarter = (pool: BasketballPlayer[], maxAllowed: number): BasketballPlayer => {
    const available = pool.filter((p) => !usedPlayerIds.has(p.id));
    const affordable = available.filter((p) => p.price <= maxAllowed);
    
    if (affordable.length > 0) {
      // Pick top performers or weighted random among affordable
      affordable.sort((a, b) => b.avgVal - a.avgVal);
      // Pick randomly among top 2 affordable
      const choice = affordable[Math.floor(Math.random() * Math.min(2, affordable.length))];
      usedPlayerIds.add(choice.id);
      return choice;
    }

    // If none under maxAllowed, pick the cheapest available
    available.sort((a, b) => a.price - b.price);
    const fallback = available[0] || pool[0];
    usedPlayerIds.add(fallback.id);
    return fallback;
  };

  // Average per starter ~ starterBudget / 5 (around 14.5M - 15.5M)
  const avgStarterBudget = starterBudget / 5;

  let chosenPG = pickStarter(pgs, avgStarterBudget + 3000000);
  let chosenSG = pickStarter(sgs, avgStarterBudget + 2500000);
  let chosenSF = pickStarter(sfs, avgStarterBudget + 1500000);
  let chosenPF = pickStarter(pfs, avgStarterBudget + 1000000);
  let chosenC = pickStarter(cs, avgStarterBudget + 1000000);

  // 3. STRICT GUARANTEE LOOP: Ensure totalCost <= TOTAL_BUDGET ($110M)
  let startersList = [
    { pos: 'PG' as PlayerPosition, p: chosenPG, pool: pgs },
    { pos: 'SG' as PlayerPosition, p: chosenSG, pool: sgs },
    { pos: 'SF' as PlayerPosition, p: chosenSF, pool: sfs },
    { pos: 'PF' as PlayerPosition, p: chosenPF, pool: pfs },
    { pos: 'C' as PlayerPosition, p: chosenC, pool: cs }
  ];

  let currentTotalCost = 
    coachCost +
    selectedBenchPlayers.reduce((s, b) => s + b.price, 0) +
    startersList.reduce((s, item) => s + item.p.price, 0);

  // If over budget, iteratively replace the most expensive starter or bench player with a cheaper alternative
  let iterations = 0;
  while (currentTotalCost > TOTAL_BUDGET && iterations < 30) {
    iterations++;

    // Try downgrading the most expensive starter that has a cheaper alternative
    let maxStarterIdx = -1;
    let maxPrice = 0;
    for (let i = 0; i < startersList.length; i++) {
      const item = startersList[i];
      const cheaperAvailable = item.pool.filter(
        (p) => p.price < item.p.price && !usedPlayerIds.has(p.id)
      );
      if (cheaperAvailable.length > 0 && item.p.price > maxPrice) {
        maxPrice = item.p.price;
        maxStarterIdx = i;
      }
    }

    if (maxStarterIdx !== -1) {
      const target = startersList[maxStarterIdx];
      usedPlayerIds.delete(target.p.id);
      const cheaperList = target.pool
        .filter((p) => !usedPlayerIds.has(p.id) && p.price < target.p.price)
        .sort((a, b) => b.avgVal - a.avgVal);

      if (cheaperList.length > 0) {
        target.p = cheaperList[0];
        usedPlayerIds.add(target.p.id);
      }
    } else {
      // If starters cannot be downgraded further, downgrade the most expensive bench player
      let maxBenchIdx = 0;
      for (let i = 1; i < selectedBenchPlayers.length; i++) {
        if (selectedBenchPlayers[i].price > selectedBenchPlayers[maxBenchIdx].price) {
          maxBenchIdx = i;
        }
      }
      
      const currentBenchP = selectedBenchPlayers[maxBenchIdx];
      usedPlayerIds.delete(currentBenchP.id);
      const cheaperBenchCandidates = LNB_PLAYERS
        .filter((p) => !usedPlayerIds.has(p.id) && p.price < currentBenchP.price)
        .sort((a, b) => a.price - b.price);

      if (cheaperBenchCandidates.length > 0) {
        selectedBenchPlayers[maxBenchIdx] = cheaperBenchCandidates[0];
        usedPlayerIds.add(cheaperBenchCandidates[0].id);
      } else {
        break; // Can't downgrade further
      }
    }

    currentTotalCost = 
      coachCost +
      selectedBenchPlayers.reduce((s, b) => s + b.price, 0) +
      startersList.reduce((s, item) => s + item.p.price, 0);
  }

  // Final emergency check: If still somehow slightly over (e.g. coach), pick cheapest coach
  if (currentTotalCost > TOTAL_BUDGET) {
    const cheapestCoach = [...LNB_COACHES].sort((a, b) => a.price - b.price)[0];
    coachCost = cheapestCoach.price;
    selectedCoach.id = cheapestCoach.id;
    selectedCoach.name = cheapestCoach.name;
    selectedCoach.price = cheapestCoach.price;
    selectedCoach.team = cheapestCoach.team;
    selectedCoach.teamShort = cheapestCoach.teamShort;
    selectedCoach.winBonusHome = cheapestCoach.winBonusHome;
    selectedCoach.winBonusAway = cheapestCoach.winBonusAway;
    selectedCoach.recentRecord = cheapestCoach.recentRecord;
    selectedCoach.tacticalStyle = cheapestCoach.tacticalStyle;
    selectedCoach.nextOpponent = cheapestCoach.nextOpponent;

    currentTotalCost = 
      coachCost +
      selectedBenchPlayers.reduce((s, b) => s + b.price, 0) +
      startersList.reduce((s, item) => s + item.p.price, 0);
  }

  // 4. Assign smart tactical roles
  // Find highest avgVal starter -> CAPTAIN
  const sortedStarters = [...startersList].sort((a, b) => b.p.avgVal - a.p.avgVal);
  const captainPos = sortedStarters[0].pos;
  const coCaptainPos = sortedStarters[1].pos;

  const finalStarters = {
    PG: {
      slotId: 'starter-pg',
      slotLabel: 'Base Titular',
      requiredPosition: 'PG' as PlayerPosition,
      isStarter: true,
      player: startersList.find(s => s.pos === 'PG')!.p,
      role: (captainPos === 'PG' ? 'CAPTAIN' : coCaptainPos === 'PG' ? 'CO_CAPTAIN' : 'ROTATION') as TacticalRoleId
    },
    SG: {
      slotId: 'starter-sg',
      slotLabel: 'Escolta Titular',
      requiredPosition: 'SG' as PlayerPosition,
      isStarter: true,
      player: startersList.find(s => s.pos === 'SG')!.p,
      role: (captainPos === 'SG' ? 'CAPTAIN' : coCaptainPos === 'SG' ? 'CO_CAPTAIN' : 'ROTATION') as TacticalRoleId
    },
    SF: {
      slotId: 'starter-sf',
      slotLabel: 'Alero Titular',
      requiredPosition: 'SF' as PlayerPosition,
      isStarter: true,
      player: startersList.find(s => s.pos === 'SF')!.p,
      role: (captainPos === 'SF' ? 'CAPTAIN' : coCaptainPos === 'SF' ? 'CO_CAPTAIN' : 'DEFENSIVE') as TacticalRoleId
    },
    PF: {
      slotId: 'starter-pf',
      slotLabel: 'Ala-Pívot Titular',
      requiredPosition: 'PF' as PlayerPosition,
      isStarter: true,
      player: startersList.find(s => s.pos === 'PF')!.p,
      role: (captainPos === 'PF' ? 'CAPTAIN' : coCaptainPos === 'PF' ? 'CO_CAPTAIN' : 'DEFENSIVE') as TacticalRoleId
    },
    C: {
      slotId: 'starter-c',
      slotLabel: 'Pívot Titular',
      requiredPosition: 'C' as PlayerPosition,
      isStarter: true,
      player: startersList.find(s => s.pos === 'C')!.p,
      role: (captainPos === 'C' ? 'CAPTAIN' : coCaptainPos === 'C' ? 'CO_CAPTAIN' : 'DEFENSIVE') as TacticalRoleId
    }
  };

  const finalBench: RosterSlot[] = [
    {
      slotId: 'bench-1',
      slotLabel: 'Sexto Hombre',
      isStarter: false,
      player: selectedBenchPlayers[0] || null,
      role: 'SIXTH_MAN'
    },
    {
      slotId: 'bench-2',
      slotLabel: 'Rotación 1',
      isStarter: false,
      player: selectedBenchPlayers[1] || null,
      role: 'ROTATION'
    },
    {
      slotId: 'bench-3',
      slotLabel: 'Suplente 2',
      isStarter: false,
      player: selectedBenchPlayers[2] || null,
      role: 'BENCH'
    },
    {
      slotId: 'bench-4',
      slotLabel: 'Suplente Profundo',
      isStarter: false,
      player: selectedBenchPlayers[3] || null,
      role: 'DEEP_BENCH'
    }
  ];

  // Calculate projected valuation
  let projectedValuation = 0;
  Object.values(finalStarters).forEach(s => {
    if (s.player) {
      const mult = s.role === 'CAPTAIN' ? 2.0 : s.role === 'CO_CAPTAIN' ? 1.5 : 1.0;
      projectedValuation += s.player.avgVal * mult;
    }
  });
  finalBench.forEach(b => {
    if (b.player) {
      const mult = b.role === 'SIXTH_MAN' ? 1.2 : 1.0;
      projectedValuation += b.player.avgVal * mult;
    }
  });

  return {
    starters: finalStarters,
    bench: finalBench,
    coach: { coach: selectedCoach },
    totalCost: currentTotalCost,
    projectedValuation: Math.round(projectedValuation * 10) / 10
  };
}
