import React, { useState, useEffect, useMemo } from "react";
import { 
  Trophy, 
  Crown, 
  Award, 
  Search, 
  X, 
  ShieldCheck, 
  Sparkles,
  Users,
  Edit3,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { fetchRealUsersAndFranchises, RealRankingUser } from "../../api/rankingApi";
import { useAuth } from "../../context/AuthContext";

interface GlobalRankingsViewProps {
  franchiseName?: string;
  onOpenEditName?: () => void;
}

export const GlobalRankingsView: React.FC<GlobalRankingsViewProps> = ({
  franchiseName,
  onOpenEditName
}) => {
  const { user } = useAuth();
  const [activePeriod, setActivePeriod] = useState<"acumulado" | "jornada" | "mes">("acumulado");
  const [searchFilter, setSearchFilter] = useState("");
  const [realUsers, setRealUsers] = useState<RealRankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const currentFranchiseDisplayName = franchiseName?.trim() || "Mi Franquicia LNB";

  const loadRankings = async () => {
    setLoading(true);
    try {
      const data = await fetchRealUsersAndFranchises(user?.uid);
      setRealUsers(data);
    } catch (e) {
      console.warn("Could not load real users rankings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
  }, [user]);

  const filteredRankings = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return realUsers;
    return realUsers.filter(entry => {
      const nameToMatch = entry.isCurrentUser ? currentFranchiseDisplayName : entry.teamName;
      return (
        nameToMatch.toLowerCase().includes(q) ||
        entry.ownerName.toLowerCase().includes(q) ||
        (entry.email && entry.email.toLowerCase().includes(q))
      );
    });
  }, [searchFilter, realUsers, currentFranchiseDisplayName]);

  // Current user's rank
  const currentUserEntry = realUsers.find(u => u.isCurrentUser);
  const userRankNumber = currentUserEntry ? `#${currentUserEntry.rank}` : `#1`;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse"></span>
              Ranking Oficial en Vivo
            </span>
            <span className="text-white/40 text-xs font-mono">
              {realUsers.length} {realUsers.length === 1 ? "Franquicia Registrada" : "Franquicias Registradas"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            Clasificación General LNB
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Puntuación en tiempo real de los entrenadores registrados en la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <button
            onClick={loadRankings}
            disabled={loading}
            title="Actualizar ranking"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#FF5C00]" : ""}`} />
          </button>

          {/* User Rank Quick Badge */}
          <div className="p-3.5 bg-black/60 border border-[#FF5C00]/30 rounded-xl flex items-center gap-3 flex-1 sm:flex-initial">
            <div className="w-10 h-10 bg-[#FF5C00] text-black flex items-center justify-center font-black text-lg italic rounded-lg shrink-0">
              {userRankNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#FF5C00] font-bold block">
                  Tu Franquicia
                </span>
                {onOpenEditName && (
                  <button
                    onClick={onOpenEditName}
                    title="Editar nombre"
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[130px] block">
                {currentFranchiseDisplayName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 bg-[#121212] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Period Selector Tabs */}
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setActivePeriod("acumulado")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activePeriod === "acumulado"
                ? "bg-[#FF5C00] text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            General Acumulado
          </button>
          <button
            onClick={() => setActivePeriod("jornada")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activePeriod === "jornada"
                ? "bg-[#FF5C00] text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Fecha Activa
          </button>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por DT, usuario o franquicia..."
            className="w-full pl-10 pr-8 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF5C00]"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-white/40 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-[#FF5C00] animate-spin" />
            <span>Consultando usuarios en Firestore...</span>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/40 space-y-2">
            <UserCheck className="w-8 h-8 text-white/20 mx-auto" />
            <p className="text-white/60 font-bold">
              {searchFilter ? `No se encontraron usuarios para "${searchFilter}".` : "No hay usuarios registrados aún."}
            </p>
            <p className="text-[11px] text-white/40">
              Registrate o invita amigos para aparecer en el ranking oficial en vivo.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-white/40 uppercase tracking-wider border-b border-white/10 text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4 font-bold">Puesto</th>
                <th className="py-3 px-4 font-bold">Franquicia</th>
                <th className="py-3 px-4 font-bold hidden sm:table-cell">Entrenador (DT)</th>
                <th className="py-3 px-4 font-bold hidden md:table-cell">Club</th>
                <th className="py-3 px-4 font-bold text-center">Pts Fecha</th>
                <th className="py-3 px-4 font-bold text-right">Pts Totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRankings.map((entry) => {
                const displayName = entry.isCurrentUser ? currentFranchiseDisplayName : entry.teamName;

                return (
                  <tr 
                    key={entry.id}
                    className={entry.isCurrentUser ? "bg-[#FF5C00]/10 border-l-2 border-l-[#FF5C00]" : "hover:bg-white/[0.02]"}
                  >
                    <td className="py-3.5 px-4 font-bold text-sm font-mono">
                      {entry.rank === 1 ? (
                        <div className="flex items-center gap-1 text-amber-400 font-black">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>1</span>
                        </div>
                      ) : entry.rank === 2 ? (
                        <span className="text-white/90 font-bold">#2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-500 font-bold">#3</span>
                      ) : (
                        <span className={entry.isCurrentUser ? "text-[#FF5C00] font-black" : "text-white/60"}>
                          #{entry.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {displayName}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="px-1.5 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase rounded">
                            Tú
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40 block sm:hidden">
                        DT: {entry.ownerName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-white/70 hidden sm:table-cell font-medium">
                      {entry.ownerName}
                    </td>

                    <td className="py-3.5 px-4 text-white/50 hidden md:table-cell">
                      {entry.favoriteClub}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#FF5C00]">
                      +{entry.matchdayPoints.toFixed(1)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-white">
                      {entry.totalPoints.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
