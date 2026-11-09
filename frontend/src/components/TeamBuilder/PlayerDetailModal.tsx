import React from "react";
import { BasketballPlayer, BasketballCoach, formatSalary, TACTICAL_ROLES, TacticalRoleId } from "../../types/basketball";
import { X, Trophy, TrendingUp, Calendar, Shield, Activity, Award, UserCheck, Flame } from "lucide-react";
import { TacticalRoleIcon } from "./TacticalRoleIcon";
import { useEstadisticasJugador } from "../../hooks/useEstadisticasJugador";

interface PlayerDetailModalProps {
  player: BasketballPlayer | null;
  coach: BasketballCoach | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStarter?: (player: BasketballPlayer) => void;
  onSelectBench?: (player: BasketballPlayer) => void;
  onSelectCoach?: (coach: BasketballCoach) => void;
  isAlreadySelected?: boolean;
  currentRole?: TacticalRoleId;
  onChangeRole?: (role: TacticalRoleId) => void;
  onRemove?: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player: jugadorBase,
  coach,
  isOpen,
  onClose,
  onSelectStarter,
  onSelectBench,
  onSelectCoach,
  isAlreadySelected,
  currentRole,
  onChangeRole,
  onRemove
}) => {
  // Le suma al jugador sus estadísticas reales del back (si las hay)
  const player = useEstadisticasJugador(jugadorBase, isOpen);

  if (!isOpen || (!player && !coach)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Orange Header Stripe */}
        <div className="h-1.5 w-full bg-[#FF5C00] shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* PLAYER VIEW */}
          {player && (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  {/* Position Badge */}
                  <div className="w-14 h-14 bg-[#FF5C00] text-black font-black text-xl flex items-center justify-center shrink-0">
                    {player.position}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-white/50 bg-white/5 px-2 py-0.5 border border-white/10">
                        #{player.number}
                      </span>
                      <span className="text-xs font-mono font-bold text-white/50 bg-white/5 px-2 py-0.5 border border-white/10">
                        {player.height}
                      </span>
                      {player.nickname && (
                        <span className="text-xs font-black uppercase text-[#FF5C00] italic">
                          "{player.nickname}"
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">
                      {player.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-white/60 font-semibold mt-1">
                      {player.team} • LNB Oficial
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-white/5 p-3 sm:p-0 sm:bg-transparent border border-white/10 sm:border-0">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                    VALOR DE FICHAJE
                  </span>
                  <span className="text-2xl sm:text-3xl font-black italic font-mono text-[#FF5C00]">
                    {formatSalary(player.price)}
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono">
                    Próximo: {player.nextOpponent}
                  </span>
                </div>
              </div>

              {/* Core Season Stats Grid */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3 block">
                  PROMEDIOS OFICIALES DE TEMPORADA
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="bg-black/50 border border-[#FF5C00]/40 p-3 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[#FF5C00] font-black block">
                      VALORACIÓN
                    </span>
                    <span className="text-2xl font-black italic text-white font-mono">
                      +{player.avgVal}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">
                      PUNTOS
                    </span>
                    <span className="text-2xl font-black italic text-white font-mono">
                      {player.pts}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">
                      REBOTES
                    </span>
                    <span className="text-2xl font-black italic text-white font-mono">
                      {player.reb}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">
                      ASISTENCIAS
                    </span>
                    <span className="text-2xl font-black italic text-white font-mono">
                      {player.ast}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">
                      TIRO CAMPO
                    </span>
                    <span className="text-2xl font-black italic text-white font-mono">
                      {player.fgPct}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Games Log */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3 block">
                  HISTORIAL ÚLTIMAS 4 JORNADAS LNB
                </span>
                <div className="space-y-2">
                  {player.recentGames.map((game, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:border-white/20 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-white/40 text-[11px]">{game.date}</span>
                        <span className="font-bold text-white uppercase">{game.opponent}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-white/60">{game.pts} PTS</span>
                        <span className="text-white/60">{game.reb} REB</span>
                        <span className="text-white/60">{game.ast} AST</span>
                        <span className="px-2 py-0.5 bg-[#FF5C00]/20 text-[#FF5C00] font-black">
                          Val: +{game.val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Selection if already on team */}
              {isAlreadySelected && onChangeRole && currentRole && (
                <div className="p-4 bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00]">
                      Asignar Rol Táctico & Multiplicador
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      Actual: {TACTICAL_ROLES[currentRole].name} ({TACTICAL_ROLES[currentRole].multiplier.toFixed(2)}x)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(Object.keys(TACTICAL_ROLES) as TacticalRoleId[]).map((roleKey) => {
                      const r = TACTICAL_ROLES[roleKey];
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => onChangeRole(roleKey)}
                          className={`p-2.5 rounded-xl text-left border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                            isSelected 
                              ? 'bg-[#FF5C00]/20 text-[#FF5C00] border-[#FF5C00] font-black shadow-md' 
                              : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                        >
                          <TacticalRoleIcon roleId={roleKey} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] uppercase font-bold text-white leading-tight break-words">{r.name}</div>
                            <div className="text-xs font-mono font-black italic mt-0.5 text-[#FF5C00]">{r.multiplier.toFixed(2)}x</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                {isAlreadySelected ? (
                  <>
                    <div className="text-xs text-[#FF5C00] font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Jugador actualmente en tu plantilla</span>
                    </div>
                    {onRemove && (
                      <button
                        onClick={() => {
                          onRemove();
                          onClose();
                        }}
                        className="w-full sm:w-auto px-5 py-3 bg-red-950/80 text-red-300 border border-red-500/40 text-xs font-black uppercase italic tracking-widest hover:bg-red-900 transition-colors cursor-pointer"
                      >
                        Quitar del Equipo
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-white transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {onSelectBench && (
                        <button
                          onClick={() => {
                            onSelectBench(player);
                            onClose();
                          }}
                          className="flex-1 sm:flex-initial px-5 py-3 bg-white/10 text-white border border-white/20 text-xs font-black uppercase italic tracking-widest hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          Al Banco
                        </button>
                      )}
                      {onSelectStarter && (
                        <button
                          onClick={() => {
                            onSelectStarter(player);
                            onClose();
                          }}
                          className="flex-1 sm:flex-initial px-6 py-3 bg-[#FF5C00] text-black text-xs font-black uppercase italic tracking-widest hover:bg-white transition-colors cursor-pointer shadow-lg shadow-orange-500/20"
                        >
                          A Titulares ({player.position})
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* COACH VIEW */}
          {coach && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#FF5C00] text-black font-black text-xl flex items-center justify-center shrink-0">
                    DT
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] block mb-1">
                      DIRECTOR TÉCNICO OFICIAL LNB
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">
                      {coach.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-white/60 font-semibold mt-1">
                      {coach.team} • Récord: {coach.recentRecord}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-white/5 p-3 sm:p-0 sm:bg-transparent border border-white/10 sm:border-0">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                    VALOR SALARIAL
                  </span>
                  <span className="text-2xl sm:text-3xl font-black italic font-mono text-[#FF5C00]">
                    {formatSalary(coach.price)}
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono">
                    Próximo: {coach.nextOpponent}
                  </span>
                </div>
              </div>

              {/* Coach Rules & Bonuses */}
              <div className="p-5 bg-white/5 border border-white/10 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] block">
                  SISTEMA DE PUNTUACIÓN DE ENTRENADOR
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-black/50 border border-white/10">
                    <span className="text-xs font-black uppercase text-white block mb-1">
                      Victoria de Local
                    </span>
                    <span className="text-3xl font-black italic text-[#FF5C00] font-mono block">
                      +{coach.winBonusHome} PTS
                    </span>
                    <p className="text-[11px] text-white/50 mt-1">
                      Si el equipo gana en su cancha en la fecha real.
                    </p>
                  </div>

                  <div className="p-4 bg-black/50 border border-white/10">
                    <span className="text-xs font-black uppercase text-white block mb-1">
                      Victoria de Visitante
                    </span>
                    <span className="text-3xl font-black italic text-[#FF5C00] font-mono block">
                      +{coach.winBonusAway} PTS
                    </span>
                    <p className="text-[11px] text-white/50 mt-1">
                      Bonus duplicado por triunfo fuera de casa.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-white/5 text-xs text-white/70">
                  <strong className="text-white font-black uppercase">Estilo Táctico:</strong> {coach.tacticalStyle}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-white transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                {onSelectCoach && (
                  <button
                    onClick={() => {
                      onSelectCoach(coach);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#FF5C00] text-black text-xs font-black uppercase italic tracking-widest hover:bg-white transition-colors cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    Contratar como DT Principal
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
