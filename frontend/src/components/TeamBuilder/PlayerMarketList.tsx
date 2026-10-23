import React, { useState, useMemo } from "react";
import { 
  BasketballPlayer, 
  BasketballCoach, 
  PlayerPosition, 
  formatSalary 
} from "../../types/basketball";
import { LNB_PLAYERS, LNB_COACHES, LNB_TEAMS } from "../../data/lnbData";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Eye, 
  Check, 
  Shield, 
  UserCheck,
  Award,
  ChevronRight
} from "lucide-react";

interface PlayerMarketListProps {
  onSelectStarter: (player: BasketballPlayer) => void;
  onSelectBench: (player: BasketballPlayer) => void;
  onSelectCoach: (coach: BasketballCoach) => void;
  onOpenPlayerDetail: (player: BasketballPlayer) => void;
  onOpenCoachDetail: (coach: BasketballCoach) => void;
  selectedPlayerIds: Set<string>;
  selectedCoachId: string | null;
  initialPositionFilter?: PlayerPosition | 'ALL' | 'COACH';
}

type SortOption = 'price_desc' | 'price_asc' | 'val_desc' | 'pts_desc' | 'reb_desc' | 'ast_desc';

export const PlayerMarketList: React.FC<PlayerMarketListProps> = ({
  onSelectStarter,
  onSelectBench,
  onSelectCoach,
  onOpenPlayerDetail,
  onOpenCoachDetail,
  selectedPlayerIds,
  selectedCoachId,
  initialPositionFilter = 'ALL',
}) => {
  const [activeCategory, setActiveCategory] = useState<PlayerPosition | 'ALL' | 'COACH'>(initialPositionFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>('val_desc');

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    if (activeCategory === 'COACH') return [];

    return LNB_PLAYERS.filter((player) => {
      // Position filter
      if (activeCategory !== 'ALL' && player.position !== activeCategory) {
        return false;
      }
      // Team filter
      if (selectedTeam !== 'ALL' && player.team !== selectedTeam) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = player.name.toLowerCase().includes(q);
        const matchNick = player.nickname?.toLowerCase().includes(q);
        const matchTeam = player.team.toLowerCase().includes(q);
        if (!matchName && !matchNick && !matchTeam) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_desc':
          return b.price - a.price;
        case 'price_asc':
          return a.price - b.price;
        case 'val_desc':
          return b.avgVal - a.avgVal;
        case 'pts_desc':
          return b.pts - a.pts;
        case 'reb_desc':
          return b.reb - a.reb;
        case 'ast_desc':
          return b.ast - a.ast;
        default:
          return b.avgVal - a.avgVal;
      }
    });
  }, [activeCategory, selectedTeam, searchQuery, sortBy]);

  // Filter coaches
  const filteredCoaches = useMemo(() => {
    if (activeCategory !== 'ALL' && activeCategory !== 'COACH') return [];

    return LNB_COACHES.filter((coach) => {
      if (selectedTeam !== 'ALL' && coach.team !== selectedTeam) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = coach.name.toLowerCase().includes(q);
        const matchTeam = coach.team.toLowerCase().includes(q);
        if (!matchName && !matchTeam) return false;
      }
      return true;
    }).sort((a, b) => b.price - a.price);
  }, [activeCategory, selectedTeam, searchQuery]);

  return (
    <div className="w-full bg-[#0E0E0E] border border-white/10 p-4 sm:p-6 shadow-2xl space-y-6">
      
      {/* 1. Header & Position Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] block">
            MERCADO OFICIAL DE PASES
          </span>
          <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight">
            Jugadores & Entrenadores LNB
          </h3>
        </div>

        {/* Position Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'PG', label: 'Bases (PG)' },
            { id: 'SG', label: 'Escoltas (SG)' },
            { id: 'SF', label: 'Aleros (SF)' },
            { id: 'PF', label: 'Ala-Pívots (PF)' },
            { id: 'C', label: 'Pívots (C)' },
            { id: 'COACH', label: 'DTs (Coach)' },
          ].map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-black uppercase italic tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF5C00] text-black shadow-md shadow-orange-500/20'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por jugador, apodo o equipo..."
            className="w-full bg-[#111111] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF5C00] transition-colors"
          />
        </div>

        {/* Team Filter Dropdown */}
        <div className="sm:col-span-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 px-3 py-2.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-[#FF5C00] transition-colors cursor-pointer"
          >
            <option value="ALL">Todos los Clubes (LNB)</option>
            {LNB_TEAMS.map((t) => (
              <option key={t.id} value={t.name} className="bg-[#111111] text-white">
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full bg-[#111111] border border-white/10 px-3 py-2.5 text-xs text-[#FF5C00] uppercase font-black focus:outline-none focus:border-[#FF5C00] transition-colors cursor-pointer"
          >
            <option value="val_desc">Mayor Valoración</option>
            <option value="price_desc">Mayor Precio ($M)</option>
            <option value="price_asc">Menor Precio ($M)</option>
            <option value="pts_desc">Más Puntos (PTS)</option>
            <option value="reb_desc">Más Rebotes (REB)</option>
            <option value="ast_desc">Más Asistencias (AST)</option>
          </select>
        </div>
      </div>

      {/* 3. Results Count */}
      <div className="flex items-center justify-between text-[11px] text-white/50 uppercase tracking-wider font-mono">
        <span>
          Mostrando {filteredPlayers.length + filteredCoaches.length} figuras disponibles
        </span>
        <span className="text-[#FF5C00]">Tope salarial activo: $110.000.000</span>
      </div>

      {/* 4. PLAYERS GRID / LIST */}
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPlayers.map((player) => {
            const isSelected = selectedPlayerIds.has(player.id);

            return (
              <div
                key={player.id}
                className={`relative bg-[#111111] border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FF5C00] bg-[#1a1410]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Top: Position, Number, and Status */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FF5C00] text-black font-black text-xs">
                        {player.position}
                      </span>
                      <span className="text-xs font-mono font-bold text-white/50">
                        #{player.number}
                      </span>
                      {player.nickname && (
                        <span className="text-[11px] font-black uppercase text-[#FF5C00] italic">
                          "{player.nickname}"
                        </span>
                      )}
                    </div>

                    <span className="text-base font-black italic font-mono text-[#FF5C00]">
                      {formatSalary(player.price)}
                    </span>
                  </div>

                  <h4 className="text-lg font-black italic uppercase text-white tracking-tight">
                    {player.name}
                  </h4>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">
                    {player.team}
                  </p>
                </div>

                {/* Stats row */}
                <div className="my-3 py-2 px-2.5 bg-black/60 border border-white/5 grid grid-cols-4 gap-1 text-center font-mono">
                  <div>
                    <span className="text-[8px] uppercase text-[#FF5C00] font-black block">VAL</span>
                    <span className="text-xs font-black text-white">+{player.avgVal}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-white/40 font-bold block">PTS</span>
                    <span className="text-xs font-black text-white">{player.pts}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-white/40 font-bold block">REB</span>
                    <span className="text-xs font-black text-white">{player.reb}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-white/40 font-bold block">AST</span>
                    <span className="text-xs font-black text-white">{player.ast}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onOpenPlayerDetail(player)}
                    title="Ver ficha completa"
                    className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {isSelected ? (
                    <div className="flex-1 py-1.5 px-3 bg-[#FF5C00]/20 border border-[#FF5C00] text-[#FF5C00] text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>En Tu Plantilla</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectBench(player)}
                        className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase italic tracking-wider transition-colors cursor-pointer"
                      >
                        + Banco
                      </button>
                      <button
                        onClick={() => onSelectStarter(player)}
                        className="flex-1 py-1.5 px-2 bg-[#FF5C00] hover:bg-white text-black text-[10px] font-black uppercase italic tracking-wider transition-colors cursor-pointer shadow-md shadow-orange-500/10"
                      >
                        + Titular
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. COACHES SECTION (WHEN VIEWING ALL OR COACH) */}
      {filteredCoaches.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FF5C00] text-black font-black text-[10px] uppercase tracking-widest">
              DIRECTORES TÉCNICOS OFICIALES
            </span>
            <span className="text-xs text-white/50 uppercase font-mono">
              Bonus por victorias de local (+5) y visitante (+10)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCoaches.map((coach) => {
              const isSelected = selectedCoachId === coach.id;

              return (
                <div
                  key={coach.id}
                  className={`bg-[#111111] border p-4 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#FF5C00] bg-[#1a1410]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-0.5 bg-white/10 text-white font-mono font-bold text-xs">
                        DT
                      </span>
                      <span className="text-base font-black italic font-mono text-[#FF5C00]">
                        {formatSalary(coach.price)}
                      </span>
                    </div>
                    <h4 className="text-lg font-black italic uppercase text-white tracking-tight">
                      {coach.name}
                    </h4>
                    <p className="text-[11px] text-white/50 uppercase font-semibold">
                      {coach.team} • Récord: {coach.recentRecord}
                    </p>
                    <p className="text-[10px] text-white/60 mt-2 line-clamp-2">
                      {coach.tacticalStyle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/10">
                    <button
                      onClick={() => onOpenCoachDetail(coach)}
                      title="Ver detalles"
                      className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {isSelected ? (
                      <div className="flex-1 py-2 px-3 bg-[#FF5C00]/20 border border-[#FF5C00] text-[#FF5C00] text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>DT Contratado</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectCoach(coach)}
                        className="flex-1 py-2 px-3 bg-[#FF5C00] hover:bg-white text-black text-[10px] font-black uppercase italic tracking-widest transition-colors cursor-pointer shadow-md shadow-orange-500/10"
                      >
                        Contratar Entrenador
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
