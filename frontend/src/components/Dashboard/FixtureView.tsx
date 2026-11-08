import React from "react";
import { Calendar, MapPin, Tv, Clock, Radio, Shield, CheckCircle2 } from "lucide-react";
import { useDatosLnb } from "../../context/DatosLnbContext";

export const FixtureView: React.FC = () => {
  const { temporada, partidos, numeroFecha } = useDatosLnb();
  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#111111] via-[#161616] to-[#111111] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#FF5C00] text-black font-black text-[10px] uppercase tracking-widest">
              LIGA NACIONAL DE BÁSQUET
            </span>
            <span className="text-white/40 text-xs font-mono">
              Temporada {temporada}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
            Fixture & Televisación • Fecha {numeroFecha}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider font-semibold mt-1">
            Horarios, estadios y transmisiones oficiales para seguir el rendimiento de tus jugadores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 text-xs text-white/80 flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#FF5C00]" />
            <span className="font-bold">BasquetPass & TyC Sports</span>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      {partidos.length === 0 && (
        <div className="p-8 bg-[#111111] border border-white/10 text-center text-sm text-white/50">
          Todavía no hay partidos cargados para esta fecha.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partidos.map((match) => {
          const isLive = match.status === 'live';
          const isFinished = match.status === 'finished';

          return (
            <div 
              key={match.id}
              className={`p-5 border transition-colors ${
                isLive 
                  ? "bg-[#161616] border-[#FF5C00] shadow-lg shadow-orange-500/10" 
                  : "bg-[#111111] border-white/10"
              }`}
            >
              {/* Header with Stadium & TV */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px]">
                <div className="flex items-center gap-1.5 text-white/50">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span className="truncate max-w-[180px]">{match.arena}</span>
                </div>
                
                {isLive ? (
                  <span className="px-2 py-0.5 bg-red-600 text-white font-black uppercase text-[9px] tracking-wider animate-pulse flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5" />
                    EN VIVO • {match.quarter}
                  </span>
                ) : isFinished ? (
                  <span className="px-2 py-0.5 bg-white/10 text-white font-bold uppercase text-[9px]">
                    FINALIZADO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-white/5 text-[#FF5C00] font-black uppercase text-[9px]">
                    {match.quarter}
                  </span>
                )}
              </div>

              {/* Match Teams & Score */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1 text-left">
                  <div className="text-sm sm:text-base font-black italic uppercase text-white">
                    {match.homeTeam}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Local</span>
                </div>

                <div className="text-center px-4 py-1.5 bg-black border border-white/10 min-w-[90px]">
                  {isLive || isFinished ? (
                    <div className="font-mono text-xl sm:text-2xl font-black text-[#FF5C00]">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  ) : (
                    <div className="text-xs font-mono font-bold text-white/50">
                      VS
                    </div>
                  )}
                  <div className="text-[8px] uppercase tracking-widest text-white/40 mt-0.5">
                    {match.date}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="text-sm sm:text-base font-black italic uppercase text-white">
                    {match.awayTeam}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Visitante</span>
                </div>
              </div>

              {/* Broadcast & Highlight */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                <div className="flex items-center gap-1.5">
                  {match.tv && (
                    <>
                      <Tv className="w-3 h-3 text-white/60" />
                      <span>{match.tv}</span>
                    </>
                  )}
                </div>

                {match.topPerformer && (
                  <div className="text-white/70">
                    MVP: <strong className="text-white">{match.topPerformer.name}</strong> ({match.topPerformer.points} pts)
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
