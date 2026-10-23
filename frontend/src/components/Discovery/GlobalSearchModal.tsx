import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  X, 
  Users, 
  Trophy, 
  Flame, 
  ExternalLink, 
  Check, 
  Plus, 
  ShieldCheck, 
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Crown
} from "lucide-react";
import { LNB_PLAYERS } from "../../data/lnbData";
import { formatSalary, BasketballPlayer } from "../../types/basketball";
import { COMMUNITY_LEAGUES, CommunityLeague } from "../../data/mockLeaguesAndMatches";
import { fetchRealUsersAndFranchises, RealRankingUser } from "../../lib/rosterService";
import { useAuth } from "../../context/AuthContext";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer?: (player: BasketballPlayer) => void;
  onGoToBuilder?: () => void;
  onGoToDashboard?: () => void;
}

type SearchTab = "all" | "players" | "users" | "leagues" | "rankings";

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlayer,
  onGoToBuilder,
  onGoToDashboard
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [joinedLeagues, setJoinedLeagues] = useState<string[]>([]);
  const [joinSuccessMessage, setJoinSuccessMessage] = useState<string | null>(null);
  const [realUsers, setRealUsers] = useState<RealRankingUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // Load real registered users from Firestore whenever modal is open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoadingUsers(true);
    fetchRealUsersAndFranchises(user?.uid)
      .then((data) => {
        if (isMounted) {
          setRealUsers(data);
          setLoadingUsers(false);
        }
      })
      .catch((err) => {
        console.warn("Could not load users for search modal:", err);
        if (isMounted) setLoadingUsers(false);
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  // Filter Players
  const matchedPlayers = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && activeTab !== "players") return LNB_PLAYERS.slice(0, 4);
    return LNB_PLAYERS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.nickname?.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      p.teamShort.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    );
  }, [query, activeTab]);

  // Filter Real Fantasy Users & Teams from Firestore
  const matchedUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && activeTab !== "users") return realUsers.slice(0, 4);
    return realUsers.filter(u => 
      u.teamName.toLowerCase().includes(q) ||
      u.ownerName.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  }, [query, activeTab, realUsers]);

  // Filter Community Leagues
  const matchedLeagues = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && activeTab !== "leagues") return COMMUNITY_LEAGUES.slice(0, 4);
    return COMMUNITY_LEAGUES.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.creator.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  }, [query, activeTab]);

  const handleJoinCommunityLeague = (league: CommunityLeague) => {
    if (joinedLeagues.includes(league.id)) return;
    setJoinedLeagues(prev => [...prev, league.id]);
    setJoinSuccessMessage(`¡Te has unido a "${league.name}"!`);
    setTimeout(() => setJoinSuccessMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Box */}
      <div 
        className="w-full max-w-4xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Search Input */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#161616] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF5C00] rounded-full"></span>
              <span className="text-xs uppercase tracking-widest text-[#FF5C00] font-black">
                Explorar & Búsqueda Global
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar jugadores LNB, franquicias, directores técnicos o ligas..."
              className="w-full pl-12 pr-10 py-3.5 bg-black/60 border border-white/10 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#FF5C00] text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setActiveTab("players")}
              className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === "players"
                  ? "bg-[#FF5C00] text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Jugadores LNB
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#FF5C00] text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Franquicias / DTs
            </button>
            <button
              onClick={() => setActiveTab("leagues")}
              className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === "leagues"
                  ? "bg-[#FF5C00] text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Ligas Comunitarias
            </button>
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === "rankings"
                  ? "bg-[#FF5C00] text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Ranking Total
            </button>
          </div>
        </div>

        {/* Join Notification Banner */}
        {joinSuccessMessage && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-400">
            <span className="font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {joinSuccessMessage}
            </span>
            <button 
              onClick={() => {
                onClose();
                onGoToDashboard?.();
              }}
              className="underline text-emerald-300 hover:text-white font-bold cursor-pointer"
            >
              Ver en Mi Franquicia
            </button>
          </div>
        )}

        {/* Results Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* TAB: RANKING TOTAL (DEDICATED FULL TABLE) */}
          {activeTab === "rankings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black italic uppercase text-white">
                    Ranking Nacional de Entrenadores Fantasy
                  </h3>
                  <p className="text-xs text-white/50">
                    {realUsers.length} entrenadores registrados compitiendo en vivo.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#FF5C00] bg-[#FF5C00]/10 px-2.5 py-1 rounded-lg border border-[#FF5C00]/20">
                  En Vivo
                </span>
              </div>

              {loadingUsers ? (
                <div className="p-8 text-center text-xs text-white/40 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#FF5C00] animate-spin" />
                  <span>Cargando ranking de Firestore...</span>
                </div>
              ) : realUsers.length === 0 ? (
                <div className="p-8 text-center text-xs text-white/40 bg-white/[0.02] rounded-xl border border-white/5">
                  No hay usuarios registrados aún.
                </div>
              ) : (
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-white/40 uppercase text-[10px] font-mono border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">Pos</th>
                        <th className="py-3 px-4">Franquicia</th>
                        <th className="py-3 px-4 hidden sm:table-cell">Entrenador (DT)</th>
                        <th className="py-3 px-4 hidden md:table-cell">Club</th>
                        <th className="py-3 px-4 text-center">Fecha 18</th>
                        <th className="py-3 px-4 text-right">Puntos Totales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {realUsers.map((entry) => (
                        <tr 
                          key={entry.id}
                          className={`hover:bg-white/5 transition-colors ${
                            entry.isCurrentUser ? "bg-[#FF5C00]/10 border-l-2 border-l-[#FF5C00]" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold">
                            <span className={entry.rank <= 3 ? "text-[#FF5C00] font-black" : "text-white/60"}>
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{entry.teamName}</span>
                              {entry.isCurrentUser && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-[#FF5C00] text-black font-black rounded">
                                  Tú
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white/60 hidden sm:table-cell">
                            {entry.ownerName}
                          </td>
                          <td className="py-3 px-4 text-white/40 hidden md:table-cell">
                            {entry.favoriteClub}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-[#FF5C00]">
                            +{entry.matchdayPoints.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-white">
                            {entry.totalPoints.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: PLAYERS OR ALL */}
          {(activeTab === "all" || activeTab === "players") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-widest text-[#FF5C00] font-black flex items-center gap-2">
                  <span>Jugadores de la Liga Nacional</span>
                </h4>
                {activeTab === "all" && matchedPlayers.length > 4 && (
                  <button 
                    onClick={() => setActiveTab("players")}
                    className="text-xs text-white/40 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {matchedPlayers.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/40 bg-white/[0.02] rounded-xl border border-white/5">
                  No se encontraron jugadores que coincidan con "{query}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedPlayers.slice(0, activeTab === "players" ? 20 : 4).map((p) => (
                    <div 
                      key={p.id}
                      className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/15 flex items-center justify-center font-mono font-black text-xs text-[#FF5C00] shrink-0">
                          {p.position}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate group-hover:text-[#FF5C00] transition-colors">
                            {p.name}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            {p.team} • #{p.number}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="text-xs font-mono font-bold text-white">
                          {formatSalary(p.price)}
                        </div>
                        <div className="text-[11px] font-mono text-[#FF5C00]">
                          {p.avgVal} VAL
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: FANTASY USERS / TEAMS */}
          {(activeTab === "all" || activeTab === "users") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-widest text-[#FF5C00] font-black flex items-center gap-2">
                  <span>Franquicias y Entrenadores Fantasy</span>
                </h4>
                {activeTab === "all" && matchedUsers.length > 4 && (
                  <button 
                    onClick={() => setActiveTab("users")}
                    className="text-xs text-white/40 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {matchedUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/40 bg-white/[0.02] rounded-xl border border-white/5">
                  No se encontraron usuarios o equipos que coincidan con "{query}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedUsers.slice(0, activeTab === "users" ? 20 : 4).map((u) => (
                    <div 
                      key={u.id}
                      className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center font-mono font-black text-xs text-[#FF5C00] shrink-0">
                          #{u.rank}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">
                            {u.teamName}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            DT: {u.ownerName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="text-xs font-mono font-bold text-white">
                          {u.totalPoints.toFixed(1)} pts
                        </div>
                        <div className="text-[10px] text-white/40">
                          {u.favoriteClub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: COMMUNITY & FEATURED LEAGUES */}
          {(activeTab === "all" || activeTab === "leagues") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#FF5C00] font-black flex items-center gap-2">
                    <span>Ligas Públicas y Comunitarias Destacadas</span>
                  </h4>
                  <p className="text-xs text-white/50 mt-0.5">
                    Unite a ligas abiertas para medirte con miles de fanáticos en todo el país.
                  </p>
                </div>
                {activeTab === "all" && matchedLeagues.length > 4 && (
                  <button 
                    onClick={() => setActiveTab("leagues")}
                    className="text-xs text-white/40 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <span>Ver todas</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedLeagues.map((league) => {
                  const isJoined = joinedLeagues.includes(league.id);

                  return (
                    <div 
                      key={league.id}
                      className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {league.name}
                            </span>
                            {league.isOfficial && (
                              <span className="px-1.5 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase rounded">
                                Oficial
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-1 line-clamp-2">
                            {league.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-white/60">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#FF5C00]" />
                            <span>{league.membersCount.toLocaleString()} DTs</span>
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {league.code}
                          </span>
                        </div>

                        <button
                          onClick={() => handleJoinCommunityLeague(league)}
                          disabled={isJoined}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            isJoined 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-[#FF5C00] hover:bg-white text-black"
                          }`}
                        >
                          {isJoined ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Unido</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Unirme</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
            <span>Base de datos oficial de la Liga Nacional y Fantasy</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onGoToBuilder?.();
              }}
              className="text-[#FF5C00] hover:text-white font-bold cursor-pointer"
            >
              Ir a Armar Equipo ($110M) →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
