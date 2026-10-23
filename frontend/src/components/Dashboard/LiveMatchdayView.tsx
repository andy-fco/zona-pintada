import React, { useState } from "react";
import { 
  Flame, 
  Trophy, 
  Activity, 
  Clock, 
  Radio, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { LNB_MATCHES_FECHA_18, LIVE_PLAY_BY_PLAY_TICKER } from "../../data/mockLeaguesAndMatches";
import { TACTICAL_ROLES, TacticalRoleId, formatSalary, TeamRoster } from "../../types/basketball";

interface LiveMatchdayViewProps {
  roster: TeamRoster | null;
  onGoToTeamBuilder: () => void;
}

export const LiveMatchdayView: React.FC<LiveMatchdayViewProps> = ({ roster, onGoToTeamBuilder }) => {
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<string>("all");

  // Fallback demo players if user hasn't finished setting up their roster
  const startersList = roster?.starters ? [
    roster.starters.PG,
    roster.starters.SG,
    roster.starters.SF,
    roster.starters.PF,
    roster.starters.C,
  ] : [];

  const benchList = roster?.bench || [];
  const coachData = roster?.coach?.coach || null;

  // Calculate live fantasy total
  let calculatedLivePoints = 0;
  startersList.forEach((slot) => {
    if (slot.player) {
      const mult = TACTICAL_ROLES[slot.role]?.multiplier || 1.0;
      // Simulated live match performance (avgVal + random/fixed simulation factor)
      calculatedLivePoints += slot.player.avgVal * mult;
    }
  });

  benchList.forEach((slot) => {
    if (slot.player) {
      const mult = TACTICAL_ROLES[slot.role]?.multiplier || 0.5;
      calculatedLivePoints += slot.player.avgVal * mult;
    }
  });

  if (coachData) {
    // Coach bonus
    calculatedLivePoints += coachData.winBonusHome;
  }

  const roundedLivePoints = calculatedLivePoints > 0 ? calculatedLivePoints.toFixed(1) : "92.5";

  return (
    <div className="space-y-8">
      
      {/* Top Matchday Summary Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#111111] via-[#161616] to-[#111111] border border-white/10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest animate-pulse">
                <Radio className="w-3 h-3" />
                EN VIVO • JORNADA 18
              </span>
              <span className="text-white/40 text-xs font-mono">
                Actualizado hace 30 segundos
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white">
              Puntuación en Vivo
            </h2>
            <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider font-semibold mt-1">
              Seguimiento de valoraciones oficiales en tiempo real de la LNB
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-[#FF5C00] font-black block">
                Puntos de la Jornada
              </span>
              <div className="text-4xl sm:text-6xl font-black italic text-white font-mono tracking-tighter">
                {roundedLivePoints} <span className="text-lg text-[#FF5C00]">PTS</span>
              </div>
              <span className="text-[11px] text-white/40">
                Puesto parcial en LNB: <strong className="text-white">#142</strong>
              </span>
            </div>

            <button
              onClick={onGoToTeamBuilder}
              className="hidden sm:flex items-center gap-2 px-5 py-3 bg-[#FF5C00] text-black font-black uppercase italic tracking-widest hover:bg-white transition-colors text-xs cursor-pointer shadow-lg shadow-orange-500/20"
            >
              <span>Editar Plantilla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Roster Live Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Starting Five and Bench Scores */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FF5C00]" />
              <h3 className="text-xl font-black italic uppercase text-white">
                Rendimiento de tu Plantilla
              </h3>
            </div>
            <span className="text-xs text-white/40 font-mono">
              Multiplicadores tácticos activos
            </span>
          </div>

          {/* If no players picked yet */}
          {startersList.filter(s => s.player !== null).length === 0 ? (
            <div className="p-8 bg-[#111111] border border-dashed border-white/20 text-center space-y-4">
              <div className="w-12 h-12 bg-[#FF5C00]/10 border border-[#FF5C00] text-[#FF5C00] flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black italic uppercase text-white">
                  Aún no armaste tu quinteto para la Fecha 18
                </h4>
                <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
                  Tenés $110.000.000 disponibles. Elegí a tus 5 titulares, 4 suplentes y entrenador para sumar puntos.
                </p>
              </div>
              <button
                onClick={onGoToTeamBuilder}
                className="px-6 py-3 bg-[#FF5C00] text-black font-black uppercase italic tracking-widest text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Ir a Armar Equipo ($110M)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quinteto Titular */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] block">
                  Quinteto Titular
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {startersList.map((slot) => {
                    if (!slot.player) return null;
                    const roleInfo = TACTICAL_ROLES[slot.role];
                    const liveVal = (slot.player.avgVal * roleInfo.multiplier).toFixed(1);

                    return (
                      <div 
                        key={slot.slotId}
                        className="p-4 bg-[#111111] border border-white/10 hover:border-[#FF5C00]/50 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black border border-white/20 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-[#FF5C00]">{slot.requiredPosition}</span>
                            <span className="text-[8px] text-white/40">TIT</span>
                          </div>
                          <div>
                            <div className="text-sm font-black italic uppercase text-white truncate max-w-[130px]">
                              {slot.player.name}
                            </div>
                            <div className="text-[10px] text-white/50 flex items-center gap-1.5 mt-0.5">
                              <span>{slot.player.teamShort}</span>
                              <span>•</span>
                              <span className="text-[#FF5C00] font-black">{roleInfo.label} ({roleInfo.multiplier}x)</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-widest text-white/40 block">Puntaje</span>
                          <span className="text-xl font-black italic text-white font-mono">{liveVal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suplentes & DT */}
              <div className="space-y-2 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">
                  Banco de Suplentes & Entrenador
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benchList.map((slot) => {
                    if (!slot.player) return null;
                    const roleInfo = TACTICAL_ROLES[slot.role];
                    const liveVal = (slot.player.avgVal * roleInfo.multiplier).toFixed(1);

                    return (
                      <div 
                        key={slot.slotId}
                        className="p-3.5 bg-black/60 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-black text-white/40 px-2 py-1 bg-white/5">
                            {slot.player.position}
                          </span>
                          <div>
                            <div className="text-xs font-black uppercase text-white truncate max-w-[120px]">
                              {slot.player.name}
                            </div>
                            <div className="text-[9px] text-white/40">
                              {roleInfo.label} ({roleInfo.multiplier}x)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black italic text-white/90 font-mono">{liveVal}</span>
                        </div>
                      </div>
                    );
                  })}

                  {coachData && (
                    <div className="p-3.5 bg-black/60 border border-white/5 flex items-center justify-between gap-3 sm:col-span-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-black text-black px-2 py-1 bg-[#FF5C00]">
                          DT
                        </span>
                        <div>
                          <div className="text-xs font-black uppercase text-white truncate">
                            {coachData.name} ({coachData.teamShort})
                          </div>
                          <div className="text-[9px] text-white/40">
                            Bonus por triunfo: +{coachData.winBonusHome} pts (Local)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black italic text-[#FF5C00] font-mono">+{coachData.winBonusHome}.0</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Live Play-by-Play Ticker & Active Matches */}
        <div className="space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FF5C00]" />
              <h3 className="text-xl font-black italic uppercase text-white">
                Minuto a Minuto LNB
              </h3>
            </div>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </div>

          {/* Live Games Widget */}
          <div className="space-y-3">
            {LNB_MATCHES_FECHA_18.slice(0, 3).map((match) => (
              <div 
                key={match.id}
                className="p-4 bg-[#111111] border border-white/10 space-y-2.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/40 font-bold uppercase">{match.arena}</span>
                  {match.status === 'live' ? (
                    <span className="px-2 py-0.5 bg-red-600 text-white font-black uppercase text-[9px] tracking-wider animate-pulse">
                      {match.quarter}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-white/10 text-white font-bold uppercase text-[9px]">
                      {match.quarter}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm font-black italic uppercase">
                  <span className="text-white">{match.homeTeam.split(" ")[0]}</span>
                  <span className="font-mono text-lg text-[#FF5C00]">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <span className="text-white">{match.awayTeam.split(" ")[0]}</span>
                </div>

                {match.topPerformer && (
                  <div className="text-[10px] text-white/50 pt-1 border-t border-white/5 flex items-center justify-between">
                    <span>Figura: <strong className="text-white">{match.topPerformer.name}</strong></span>
                    <span className="text-[#FF5C00] font-mono font-bold">+{match.topPerformer.val} VAL</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Play by Play Events */}
          <div className="p-5 bg-black/60 border border-white/10 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] block mb-2">
              Jugadas Clave en Vivo
            </span>
            <div className="space-y-2.5">
              {LIVE_PLAY_BY_PLAY_TICKER.map((play) => (
                <div key={play.id} className="text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                    <span className="font-mono text-[#FF5C00]">{play.time}</span>
                    <span>{play.match}</span>
                  </div>
                  <p className="text-white/80 leading-snug">
                    {play.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
