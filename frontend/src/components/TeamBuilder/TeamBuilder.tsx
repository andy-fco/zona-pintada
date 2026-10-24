import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  BasketballPlayer, 
  BasketballCoach, 
  PlayerPosition, 
  RosterSlot, 
  CoachSlot, 
  TeamRoster, 
  TACTICAL_ROLES, 
  TacticalRoleId, 
  formatSalary 
} from "../../types/basketball";
import { LNB_PLAYERS, LNB_COACHES, TOTAL_BUDGET } from "../../data/lnbData";
import { CourtView } from "./CourtView";
import { PlayerMarketList } from "./PlayerMarketList";
import { RosterSummaryBar } from "./RosterSummaryBar";
import { PlayerDetailModal } from "./PlayerDetailModal";
import { saveRoster, loadRoster, updateFranchiseName } from "../../lib/rosterService";
import { generateBudgetCompliantTeam } from "../../utils/teamSuggester";
import { useDatosLnb } from "../../context/DatosLnbContext";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Shield
} from "lucide-react";

interface TeamBuilderProps {
  onGoToDashboard: () => void;
}

const DEFAULT_INITIAL_ROSTER = (): {
  starters: {
    PG: RosterSlot;
    SG: RosterSlot;
    SF: RosterSlot;
    PF: RosterSlot;
    C: RosterSlot;
  };
  bench: RosterSlot[];
  coach: CoachSlot;
} => ({
  starters: {
    PG: { slotId: 'starter-pg', slotLabel: 'Base Titular', requiredPosition: 'PG', isStarter: true, player: null, role: 'CAPTAIN' },
    SG: { slotId: 'starter-sg', slotLabel: 'Escolta Titular', requiredPosition: 'SG', isStarter: true, player: null, role: 'CO_CAPTAIN' },
    SF: { slotId: 'starter-sf', slotLabel: 'Alero Titular', requiredPosition: 'SF', isStarter: true, player: null, role: 'DEFENSIVE' },
    PF: { slotId: 'starter-pf', slotLabel: 'Ala-Pívot Titular', requiredPosition: 'PF', isStarter: true, player: null, role: 'ROTATION' },
    C: { slotId: 'starter-c', slotLabel: 'Pívot Titular', requiredPosition: 'C', isStarter: true, player: null, role: 'DEFENSIVE' },
  },
  bench: [
    { slotId: 'bench-1', slotLabel: 'Sexto Hombre', isStarter: false, player: null, role: 'SIXTH_MAN' },
    { slotId: 'bench-2', slotLabel: 'Rotación 1', isStarter: false, player: null, role: 'ROTATION' },
    { slotId: 'bench-3', slotLabel: 'Suplente 2', isStarter: false, player: null, role: 'BENCH' },
    { slotId: 'bench-4', slotLabel: 'Suplente Profundo', isStarter: false, player: null, role: 'DEEP_BENCH' },
  ],
  coach: { coach: null }
});

export const TeamBuilder: React.FC<TeamBuilderProps> = ({ onGoToDashboard }) => {
  const { user } = useAuth();
  const { jugadores, dts } = useDatosLnb();
  const storageKey = user ? `zona_pintada_roster_${user.uid}` : "zona_pintada_roster_guest";

  const [activeView, setActiveView] = useState<"court" | "market">("court");
  const [starters, setStarters] = useState(DEFAULT_INITIAL_ROSTER().starters);
  const [bench, setBench] = useState(DEFAULT_INITIAL_ROSTER().bench);
  const [coach, setCoach] = useState(DEFAULT_INITIAL_ROSTER().coach);
  const [teamName, setTeamName] = useState("Mi Franquicia LNB");

  // Modals & Slot target state
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<BasketballPlayer | null>(null);
  const [selectedCoachForDetail, setSelectedCoachForDetail] = useState<BasketballCoach | null>(null);
  const [detailRole, setDetailRole] = useState<TacticalRoleId | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Position filter to pre-activate when user clicks an empty slot in Court View
  const [marketPositionFilter, setMarketPositionFilter] = useState<PlayerPosition | 'ALL' | 'COACH'>('ALL');

  // Load saved lineup with Cloud Firestore and local fallback on mount
  useEffect(() => {
    let isMounted = true;
    loadRoster(user?.uid).then((saved) => {
      if (!isMounted || !saved) return;
      if (saved.starters) setStarters(saved.starters);
      if (saved.bench) setBench(saved.bench);
      if (saved.coach) setCoach(saved.coach);
      if (saved.teamName) setTeamName(saved.teamName);
    }).catch((e) => {
      console.warn("Could not load stored roster", e);
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Set of selected player IDs for quick lookup
  const selectedPlayerIds = useMemo(() => {
    const ids = new Set<string>();
    (Object.values(starters) as RosterSlot[]).forEach((slot) => {
      if (slot.player) ids.add(slot.player.id);
    });
    bench.forEach((slot) => {
      if (slot.player) ids.add(slot.player.id);
    });
    return ids;
  }, [starters, bench]);

  // Total spent budget calculation
  const spentBudget = useMemo(() => {
    let total = 0;
    (Object.values(starters) as RosterSlot[]).forEach((slot) => {
      if (slot.player) total += slot.player.price;
    });
    bench.forEach((slot) => {
      if (slot.player) total += slot.player.price;
    });
    if (coach.coach) total += coach.coach.price;
    return total;
  }, [starters, bench, coach]);

  // Tactical projected valuation with role multipliers
  const totalValuation = useMemo(() => {
    let total = 0;
    (Object.values(starters) as RosterSlot[]).forEach((slot) => {
      if (slot.player) {
        const mult = TACTICAL_ROLES[slot.role].multiplier;
        total += slot.player.avgVal * mult;
      }
    });
    bench.forEach((slot) => {
      if (slot.player) {
        const mult = TACTICAL_ROLES[slot.role].multiplier;
        total += slot.player.avgVal * mult;
      }
    });
    if (coach.coach) {
      // Coach adds average expected win bonus
      total += 7.5;
    }
    return total;
  }, [starters, bench, coach]);

  // Counts
  const starterCount = (Object.values(starters) as RosterSlot[]).filter((s) => s.player !== null).length;
  const benchCount = bench.filter((b) => b.player !== null).length;
  const hasCoach = coach.coach !== null;

  // Show transient alert
  const showAlert = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Add a player as a starter
  const handleSelectStarter = (player: BasketballPlayer) => {
    // Check if already in roster
    if (selectedPlayerIds.has(player.id)) {
      showAlert(`${player.name} ya está en tu plantilla.`);
      return;
    }

    const pos = player.position;
    const currentSlot = starters[pos];

    // Check budget
    const priceDiff = currentSlot.player ? player.price - currentSlot.player.price : player.price;
    if (spentBudget + priceDiff > TOTAL_BUDGET) {
      showAlert(`Presupuesto insuficiente para fichar a ${player.name}. Superarías los $110M.`);
    }

    setStarters((prev) => ({
      ...prev,
      [pos]: {
        ...prev[pos],
        player: player,
      },
    }));

    showAlert(`${player.name} fichado como ${pos} titular.`);
  };

  // Add a player to bench
  const handleSelectBench = (player: BasketballPlayer) => {
    if (selectedPlayerIds.has(player.id)) {
      showAlert(`${player.name} ya está en tu plantilla.`);
      return;
    }

    // Find first empty bench slot
    const emptyIndex = bench.findIndex((slot) => slot.player === null);
    if (emptyIndex === -1) {
      showAlert("El banco de suplentes ya tiene 4 jugadores. Quita uno antes de agregar.");
      return;
    }

    if (spentBudget + player.price > TOTAL_BUDGET) {
      showAlert(`Presupuesto insuficiente para fichar a ${player.name}.`);
    }

    const newBench = [...bench];
    newBench[emptyIndex] = {
      ...newBench[emptyIndex],
      player: player,
    };
    setBench(newBench);

    showAlert(`${player.name} añadido al banco de suplentes.`);
  };

  // Select coach
  const handleSelectCoach = (selectedCoach: BasketballCoach) => {
    const priceDiff = coach.coach ? selectedCoach.price - coach.coach.price : selectedCoach.price;
    if (spentBudget + priceDiff > TOTAL_BUDGET) {
      showAlert(`Presupuesto insuficiente para contratar a ${selectedCoach.name}.`);
    }

    setCoach({ coach: selectedCoach });
    showAlert(`DT ${selectedCoach.name} contratado para la temporada.`);
  };

  // Remove player from slot
  const handleRemovePlayer = (slotId: string) => {
    // Check if starter
    for (const key of ['PG', 'SG', 'SF', 'PF', 'C'] as PlayerPosition[]) {
      if (starters[key].slotId === slotId) {
        setStarters((prev) => ({
          ...prev,
          [key]: { ...prev[key], player: null },
        }));
        showAlert("Jugador retirado del quinteto.");
        return;
      }
    }

    // Check bench
    setBench((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, player: null } : slot))
    );
    showAlert("Jugador retirado del banco.");
  };

  // Remove coach
  const handleRemoveCoach = () => {
    setCoach({ coach: null });
    showAlert("Entrenador desvinculado.");
  };

  // Change tactical role of a slot
  const handleChangeRole = (slotId: string, newRole: TacticalRoleId) => {
    // Check starters
    for (const key of ['PG', 'SG', 'SF', 'PF', 'C'] as PlayerPosition[]) {
      if (starters[key].slotId === slotId) {
        setStarters((prev) => ({
          ...prev,
          [key]: { ...prev[key], role: newRole },
        }));
        return;
      }
    }

    // Check bench
    setBench((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, role: newRole } : slot))
    );
  };

  // Open detail modal for player
  const handleOpenPlayerDetail = (player: BasketballPlayer, currentRole?: TacticalRoleId) => {
    setSelectedPlayerForDetail(player);
    setSelectedCoachForDetail(null);
    setDetailRole(currentRole);
    setIsDetailModalOpen(true);
  };

  // Open detail modal for coach
  const handleOpenCoachDetail = (c: BasketballCoach) => {
    setSelectedCoachForDetail(c);
    setSelectedPlayerForDetail(null);
    setIsDetailModalOpen(true);
  };

  // Open slot picker directly filtered by position
  const handleOpenSlotPicker = (slotId: string, position?: PlayerPosition, isStarter?: boolean) => {
    if (position) {
      setMarketPositionFilter(position);
    } else if (slotId === 'coach-slot') {
      setMarketPositionFilter('COACH');
    } else {
      setMarketPositionFilter('ALL');
    }
    setActiveView("market");
  };

  // Autocomplete: Intelligently pick an optimal, balanced team strictly within $110M
  const handleAutoComplete = () => {
    const suggested = generateBudgetCompliantTeam(jugadores, dts);
    setStarters(suggested.starters);
    setBench(suggested.bench);
    setCoach(suggested.coach);

    const costFormatted = formatSalary(suggested.totalCost);
    showAlert(`¡Equipo sugerido generado con éxito! Inversión total: ${costFormatted} (dentro de los $110M).`);
  };

  // Clear entire roster
  const handleClearRoster = () => {
    setStarters(DEFAULT_INITIAL_ROSTER().starters);
    setBench(DEFAULT_INITIAL_ROSTER().bench);
    setCoach({ coach: null });
    showAlert("Plantilla vaciada por completo.");
  };

  // Save roster to Cloud Firestore and local cache
  const handleSaveRoster = async () => {
    if (spentBudget > TOTAL_BUDGET) {
      showAlert("No podés guardar un equipo que excede el tope de $110M.");
      return;
    }

    try {
      const rosterData: TeamRoster = {
        teamName,
        starters,
        bench,
        coach,
        totalBudget: TOTAL_BUDGET,
      };
      
      const result = await saveRoster(user?.uid, rosterData, user?.displayName || user?.email?.split('@')[0]);
      await updateFranchiseName(user?.uid, rosterData.teamName);
      setIsSavedSuccess(true);
      if (result.cloudSynced) {
        showAlert("¡Plantilla oficial guardada y sincronizada en la nube!");
      } else {
        showAlert("¡Plantilla oficial guardada con éxito!");
      }
      setTimeout(() => setIsSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      showAlert("Error al guardar la plantilla.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0B] text-white">
      
      {/* Floating Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#FF5C00] text-black font-black uppercase italic tracking-wider text-xs shadow-2xl flex items-center gap-3 border-2 border-black animate-in slide-in-from-bottom-5">
          <Info className="w-4 h-4 shrink-0 text-black" />
          <span>{notification}</span>
        </div>
      )}

      {/* Roster Summary Sticky Bar */}
      <RosterSummaryBar
        spentBudget={spentBudget}
        starterCount={starterCount}
        benchCount={benchCount}
        hasCoach={hasCoach}
        totalValuation={totalValuation}
        activeView={activeView}
        setActiveView={setActiveView}
        onAutoComplete={handleAutoComplete}
        onClearRoster={handleClearRoster}
        onSaveRoster={handleSaveRoster}
        isSavedSuccess={isSavedSuccess}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header of the Page */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#FF5C00] text-black font-black text-[10px] uppercase tracking-widest">
                TEMPORADA REGULAR 2024/25
              </span>
              <span className="text-white/40 text-xs font-mono">
                • Cierre Jornada: Viernes 20:00 hs
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">
              Armado de Equipo ($110M)
            </h1>
            <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider font-semibold mt-1">
              Definí tu quinteto titular, suplentes y DT oficial con sus roles tácticos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase italic tracking-wider transition-colors cursor-pointer flex items-center gap-2 rounded-xl"
            >
              <span>Ver Mi Franquicia</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF5C00]" />
            </button>
          </div>
        </div>

        {/* View Switcher: Court View vs Market List */}
        {activeView === "court" ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Cancha Táctica */}
            <CourtView
              starters={starters}
              bench={bench}
              coach={coach}
              onOpenSlotPicker={handleOpenSlotPicker}
              onOpenPlayerDetail={handleOpenPlayerDetail}
              onOpenCoachDetail={handleOpenCoachDetail}
              onRemovePlayer={handleRemovePlayer}
              onRemoveCoach={handleRemoveCoach}
              onChangeRole={handleChangeRole}
            />

            {/* Quick Market Access Banner */}
            <div className="p-6 bg-gradient-to-r from-[#141414] to-[#181818] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00] block mb-1">
                  Explorar Catálogo Completo
                </span>
                <h4 className="text-xl font-black italic uppercase text-white tracking-tight">
                  ¿Buscás jugadores por valoración o presupuesto?
                </h4>
                <p className="text-xs text-white/50 mt-1">
                  Accedé a los filtros avanzados de la LNB para encontrar gangas y figuras estelares.
                </p>
              </div>

              <button
                onClick={() => {
                  setMarketPositionFilter('ALL');
                  setActiveView("market");
                }}
                className="px-6 py-3 bg-[#FF5C00] text-black font-black uppercase italic tracking-wider hover:bg-white transition-all text-xs cursor-pointer rounded-xl shadow-lg shadow-orange-500/20 whitespace-nowrap"
              >
                Abrir Mercado LNB
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {/* Lista de Mercado */}
            <PlayerMarketList
              onSelectStarter={handleSelectStarter}
              onSelectBench={handleSelectBench}
              onSelectCoach={handleSelectCoach}
              onOpenPlayerDetail={handleOpenPlayerDetail}
              onOpenCoachDetail={handleOpenCoachDetail}
              selectedPlayerIds={selectedPlayerIds}
              selectedCoachId={coach.coach?.id || null}
              initialPositionFilter={marketPositionFilter}
            />
          </div>
        )}

      </div>

      {/* Player & Coach Detail Modal */}
      <PlayerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        player={selectedPlayerForDetail}
        coach={selectedCoachForDetail}
        onSelectStarter={handleSelectStarter}
        onSelectBench={handleSelectBench}
        onSelectCoach={handleSelectCoach}
        isAlreadySelected={
          selectedPlayerForDetail ? selectedPlayerIds.has(selectedPlayerForDetail.id) : false
        }
        currentRole={detailRole}
        onChangeRole={(newRole) => {
          if (selectedPlayerForDetail) {
            // Find slot
            for (const key of ['PG', 'SG', 'SF', 'PF', 'C'] as PlayerPosition[]) {
              if (starters[key].player?.id === selectedPlayerForDetail.id) {
                handleChangeRole(starters[key].slotId, newRole);
                setDetailRole(newRole);
                return;
              }
            }
            bench.forEach((b) => {
              if (b.player?.id === selectedPlayerForDetail.id) {
                handleChangeRole(b.slotId, newRole);
                setDetailRole(newRole);
              }
            });
          }
        }}
        onRemove={() => {
          if (selectedPlayerForDetail) {
            for (const key of ['PG', 'SG', 'SF', 'PF', 'C'] as PlayerPosition[]) {
              if (starters[key].player?.id === selectedPlayerForDetail.id) {
                handleRemovePlayer(starters[key].slotId);
                return;
              }
            }
            bench.forEach((b) => {
              if (b.player?.id === selectedPlayerForDetail.id) {
                handleRemovePlayer(b.slotId);
              }
            });
          }
        }}
      />

    </div>
  );
};
