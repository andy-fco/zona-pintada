import React, { useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Tv, 
  Sparkles, 
  ArrowUpRight,
  Medal,
  ChevronRight,
  Users
} from "lucide-react";
import { 
  LNB_OFFICIAL_STANDINGS, 
  LNB_STAT_LEADERS 
} from "../../data/lnbStandingsData";
import { LNB_MATCHES_FECHA_18 } from "../../data/mockLeaguesAndMatches";
import { useDatosLnb } from "../../context/DatosLnbContext";

interface OfficialLnbHubProps {
  onOpenSearch?: () => void;
}

export const OfficialLnbHub: React.FC<OfficialLnbHubProps> = ({ onOpenSearch }) => {
  const { temporada } = useDatosLnb();
  const [standingFilter, setStandingFilter] = useState<"all" | "norte" | "sur">("all");
  const [activeStatCategory, setActiveStatCategory] = useState<number>(0);

  const filteredStandings = LNB_OFFICIAL_STANDINGS.filter((team) => {
    if (standingFilter === "norte") return team.conference === "Norte";
    if (standingFilter === "sur") return team.conference === "Sur";
    return true;
  });

  const currentStatCategory = LNB_STAT_LEADERS[activeStatCategory];

  return (
    <div className="space-y-16 py-12">
      
      {/* 1. LNB OFFICIAL STANDINGS TABLE */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Temporada Regular {temporada}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tight">
              Tabla de Posiciones Oficial
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Récords oficiales de la LNB. Puestos 1 al 4 clasifican directo a cuartos de final.
            </p>
          </div>

          {/* Conference Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-xl shrink-0">
            <button
              onClick={() => setStandingFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                standingFilter === "all"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setStandingFilter("norte")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                standingFilter === "norte"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Norte
            </button>
            <button
              onClick={() => setStandingFilter("sur")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                standingFilter === "sur"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sur
            </button>
          </div>
        </div>

        {/* Clean, Rounded Table */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-white/40 uppercase tracking-wider text-[11px] font-mono border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Pos</th>
                  <th className="py-3.5 px-4 font-bold">Club</th>
                  <th className="py-3.5 px-3 font-bold text-center">PJ</th>
                  <th className="py-3.5 px-3 font-bold text-center">PG</th>
                  <th className="py-3.5 px-3 font-bold text-center">PP</th>
                  <th className="py-3.5 px-3 font-bold text-center">% Vic</th>
                  <th className="py-3.5 px-3 font-bold text-center hidden sm:table-cell">Dif</th>
                  <th className="py-3.5 px-4 font-bold text-right">Racha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredStandings.map((team, idx) => {
                  const isTop4 = idx < 4;

                  return (
                    <tr 
                      key={team.short}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Position */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <span className={isTop4 ? "text-[#FF5C00] font-black" : "text-white/60"}>
                          #{team.pos}
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-6 bg-black/60 border border-white/10 text-[10px] font-mono font-bold flex items-center justify-center text-white/70 rounded shrink-0">
                            {team.short}
                          </span>
                          <span className="truncate">{team.team}</span>
                          {isTop4 && (
                            <span className="hidden md:inline text-[9px] font-bold text-[#FF5C00] bg-[#FF5C00]/10 px-2 py-0.5 rounded-full">
                              Cuartos
                            </span>
                          )}
                        </div>
                      </td>

                      {/* PJ, PG, PP */}
                      <td className="py-3.5 px-3 text-center font-mono text-white/70">{team.pj}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-white">{team.pg}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-white/40">{team.pp}</td>

                      {/* % Vic */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-[#FF5C00]">
                        {team.pct}
                      </td>

                      {/* Diff */}
                      <td className={`py-3.5 px-3 text-center font-mono font-bold text-[11px] hidden sm:table-cell ${
                        team.diff > 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {team.diff > 0 ? `+${team.diff}` : team.diff}
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          team.streak.includes('G') 
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {team.streak}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-3.5 bg-black/40 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-white/40 gap-3">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5C00]"></span> Puestos 1-4: Cuartos directos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/30"></span> Puestos 5-12: Reclasificación
              </span>
            </div>
            <span className="text-[11px]">Planilla Oficial • Asociación de Clubes (AdC)</span>
          </div>
        </div>
      </div>

      {/* 2. STATISTICAL LEADERS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Estadísticas Destacadas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tight">
              Líderes de la Liga
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Las figuras más determinantes de la temporada {temporada}.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl shrink-0">
            {LNB_STAT_LEADERS.map((cat, idx) => (
              <button
                key={cat.category}
                onClick={() => setActiveStatCategory(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeStatCategory === idx
                    ? "bg-[#FF5C00] text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Leaders Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentStatCategory.leaders.map((leader) => {
            const isFirst = leader.rank === 1;

            return (
              <div 
                key={leader.player}
                className={`p-5 bg-[#121212] border rounded-2xl transition-all ${
                  isFirst 
                    ? "border-[#FF5C00]/40 shadow-lg shadow-orange-500/5" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                    isFirst ? "bg-[#FF5C00] text-black" : "bg-white/10 text-white/80"
                  }`}>
                    #{leader.rank}
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    {leader.teamShort} • {leader.position}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-base font-bold text-white truncate">
                    {leader.player}
                  </h4>
                  <p className="text-xs text-white/50">
                    {leader.team}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-baseline justify-between">
                  <span className="text-xs text-white/40">
                    {currentStatCategory.statName}
                  </span>
                  <span className="font-mono text-xl font-black text-[#FF5C00]">
                    {leader.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PROXIMOS PARTIDOS FECHA 18 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Fecha 18</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">
              Partidos de la Jornada
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
            <Tv className="w-4 h-4 text-[#FF5C00]" />
            <span>En vivo por BasquetPass & TyC Sports</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LNB_MATCHES_FECHA_18.slice(0, 3).map((match) => (
            <div 
              key={match.id}
              className="p-5 bg-[#121212] border border-white/10 rounded-2xl hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 font-medium">{match.arena.split(",")[0]}</span>
                <span className="text-[#FF5C00] font-bold font-mono">{match.date}</span>
              </div>

              <div className="flex items-center justify-between py-2 text-sm font-bold text-white">
                <span className="truncate max-w-[120px]">{match.homeTeam.split(" ")[0]}</span>
                <span className="text-xs text-white/30 font-mono px-2 py-0.5 bg-black/40 rounded">
                  VS
                </span>
                <span className="truncate max-w-[120px] text-right">{match.awayTeam.split(" ")[0]}</span>
              </div>

              <div className="text-xs text-white/40 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>{match.tv}</span>
                <span className="text-white/60 font-medium">Salto inicial</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
