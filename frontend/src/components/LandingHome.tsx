import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDatosLnb } from "../context/DatosLnbContext";
import { 
  Flame, 
  Trophy, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Sliders, 
  Calendar, 
  ArrowRight,
  Search,
  Users,
  Compass
} from "lucide-react";
import { TeamRoster, RosterSlot, formatSalary, TACTICAL_ROLES, getRoleMultiplier } from "../types/basketball";
import { TOTAL_BUDGET } from "../data/lnbData";
import { OfficialLnbHub } from "./Home/OfficialLnbHub";
import { loadRoster } from "../lib/rosterService";

interface LandingHomeProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onGoToDashboard: () => void;
  onGoToBuilder?: () => void;
  onOpenSearch?: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ 
  onOpenAuth, 
  onGoToDashboard, 
  onGoToBuilder,
  onOpenSearch 
}) => {
  const { user } = useAuth();
  const { temporada } = useDatosLnb();
  const [savedRoster, setSavedRoster] = useState<TeamRoster | null>(null);

  // Load saved roster from Cloud Firestore with local fallback
  useEffect(() => {
    let isMounted = true;
    loadRoster(user?.uid).then((saved) => {
      if (!isMounted || !saved) return;
      setSavedRoster(saved);
    }).catch((e) => {
      console.warn("Could not load stored roster on home", e);
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Calculate team stats if built
  const starterSlots: RosterSlot[] = savedRoster?.starters 
    ? (Object.values(savedRoster.starters) as RosterSlot[]) 
    : [];
  const starterCount = starterSlots.filter(s => s.player !== null).length;
  const benchCount = savedRoster?.bench ? savedRoster.bench.filter(s => s.player !== null).length : 0;
  const hasCoach = !!savedRoster?.coach?.coach;

  const hasAssembledTeam = starterCount >= 5;

  let spentBudget = 0;
  starterSlots.forEach((s) => {
    if (s.player) spentBudget += s.player.price;
  });
  if (savedRoster?.bench) {
    savedRoster.bench.forEach((b) => {
      if (b.player) spentBudget += b.player.price;
    });
  }
  if (savedRoster?.coach?.coach) {
    spentBudget += savedRoster.coach.coach.price;
  }
  const remainingBudget = TOTAL_BUDGET - spentBudget;

  let projectedValuation = 0;
  starterSlots.forEach((s) => {
    if (s.player) {
      const mult = getRoleMultiplier(s.role, true);
      projectedValuation += s.player.avgVal * mult;
    }
  });
  if (savedRoster?.bench) {
    savedRoster.bench.forEach((b) => {
      if (b.player) {
        const mult = getRoleMultiplier(b.role, false);
        projectedValuation += b.player.avgVal * mult;
      }
    });
  }
  if (hasCoach) projectedValuation += 7.5;

  return (
    <div className="w-full bg-[#0B0B0B] text-white selection:bg-[#FF5C00] selection:text-black">
      
      {/* 1. HERO SECTION */}
      {hasAssembledTeam ? (
        /* --- CALM, CLEAN COMMAND HERO (TEAM READY) --- */
        <section className="relative pt-12 pb-16 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#141414] to-[#0B0B0B]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            
            {/* Headline and Primary Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                  <span>Franquicia: {savedRoster?.teamName || "Mi Franquicia LNB"} • Fecha 18</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black italic uppercase text-white tracking-tight leading-tight">
                  {savedRoster?.teamName ? savedRoster.teamName : "Tu Equipo Está Listo para Competir"}
                </h1>
                <p className="text-white/60 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                  Tenés tu quinteto y rotación diagramados con los $110M. Podés ajustar tu alineación antes del cierre o explorar las posiciones de la LNB.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  id="hero-btn-edit-builder"
                  onClick={onGoToBuilder || onGoToDashboard}
                  className="px-5 py-3.5 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Ajustar Plantilla</span>
                </button>

                <button
                  id="hero-btn-view-franchise"
                  onClick={onGoToDashboard}
                  className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Mi Franquicia</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar (Clean, Unified) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#121212] border border-white/10 p-5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-xs text-white/40 font-medium block">Jugadores</span>
                <div className="text-xl sm:text-2xl font-black italic font-mono text-white">
                  5 Tit • {benchCount} Sup
                </div>
                <span className="text-xs text-white/50 block truncate">
                  DT: {hasCoach ? savedRoster?.coach?.coach?.name.split(" ")[0] : "Sin DT"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-white/40 font-medium block">Presupuesto Usado</span>
                <div className="text-xl sm:text-2xl font-black italic font-mono text-white">
                  {formatSalary(spentBudget)}
                </div>
                <span className="text-xs text-emerald-400 block">
                  Libre: {formatSalary(remainingBudget)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-white/40 font-medium block">Val. Proyectada</span>
                <div className="text-xl sm:text-2xl font-black italic font-mono text-[#FF5C00]">
                  {projectedValuation.toFixed(1)} <span className="text-xs text-white/50 font-normal">pts</span>
                </div>
                <span className="text-xs text-white/40 block">Con multiplicadores</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-white/40 font-medium block">Próximo Salto</span>
                <div className="text-xl sm:text-2xl font-black italic text-white">
                  Fecha 18
                </div>
                <span className="text-xs text-white/40 block">Viernes 20:00 hs</span>
              </div>
            </div>

            {/* Starting Five Preview (Lightweight, Friendly) */}
            <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="font-bold text-white uppercase tracking-wider">
                  Tu Quinteto Inicial
                </span>
                <button
                  onClick={onGoToBuilder || onGoToDashboard}
                  className="text-xs text-[#FF5C00] hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Modificar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {starterSlots.map((slot) => {
                  if (!slot.player) return null;
                  const role = TACTICAL_ROLES[slot.role] ?? TACTICAL_ROLES.NORMAL;
                  return (
                    <div 
                      key={slot.slotId}
                      className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#FF5C00]">{slot.requiredPosition}</span>
                        <span className="font-mono text-white/40 text-[11px]">{slot.player.teamShort}</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {slot.player.name}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {role.name} • <span className="text-[#FF5C00] font-mono">{getRoleMultiplier(slot.role, true)}x</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explore Community & Rankings Quick Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border border-[#FF5C00]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/15 flex items-center justify-center text-[#FF5C00] shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Explorá Ligas Comunitarias y el Ranking Nacional
                  </h4>
                  <p className="text-xs text-white/50">
                    Buscá franquicias de amigos, jugadores de la LNB o sumate a las ligas oficiales abiertas.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenSearch}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span>Buscar DTs, Ligas y Jugadores</span>
              </button>
            </div>

          </div>
        </section>
      ) : (
        /* --- VISITOR HERO: CALM, CLEAR, AIRY --- */
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full">
              <span>Temporada {temporada} • Oficial LNB</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black italic uppercase leading-none tracking-tight text-white">
              Dominá el<br />
              <span className="text-[#FF5C00]">Parquet.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              Armá tu equipo con las estrellas de la <strong className="text-white">Liga Nacional</strong>. Gestioná tu tope salarial de <strong className="text-white">$110.000.000</strong> y competí contra miles de entrenadores de todo el país.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {user ? (
                <>
                  <button
                    id="hero-btn-builder"
                    onClick={onGoToBuilder || onGoToDashboard}
                    className="w-full sm:w-auto px-8 py-4 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Armar Mi Equipo ($110M)</span>
                  </button>
                  <button
                    id="hero-btn-dashboard"
                    onClick={onGoToDashboard}
                    className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Mi Franquicia</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="hero-btn-builder-guest"
                    onClick={onGoToBuilder || (() => onOpenAuth("signup"))}
                    className="w-full sm:w-auto px-8 py-4 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Entrar a la Cancha ($110M)</span>
                  </button>
                  <button
                    id="hero-btn-login"
                    onClick={() => onOpenAuth("login")}
                    className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Iniciar Sesión</span>
                  </button>
                </>
              )}
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-white/5 max-w-2xl mx-auto">
              <div className="space-y-1">
                <span className="text-3xl font-black italic text-white">25K+</span>
                <span className="text-xs text-white/40 block">Entrenadores</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black italic text-[#FF5C00]">$110M</span>
                <span className="text-xs text-white/40 block">Presupuesto</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black italic text-white">$2M</span>
                <span className="text-xs text-white/40 block">En Premios</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black italic text-white">#1</span>
                <span className="text-xs text-white/40 block">Fantasy LNB</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. TABLA OFICIAL DE POSICIONES LNB & LÍDERES ESTADÍSTICOS */}
      <section className="bg-[#0B0B0B] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OfficialLnbHub onOpenSearch={onOpenSearch} />
        </div>
      </section>

      {/* 3. REGLAMENTO DE JUEGO (4 TIEMPOS) */}
      {!hasAssembledTeam && (
        <section className="py-20 border-b border-white/5 bg-[#0D0D0D]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00]">
                Reglamento Básico
              </span>
              <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-white mt-1">
                Cómo Funciona Zona Pintada
              </h2>
              <p className="text-white/50 text-sm mt-2">
                Cuatro conceptos simples para gestionar tu franquicia como un mánager profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
                <div className="text-3xl font-black italic text-[#FF5C00]">
                  01
                </div>
                <h3 className="text-base font-bold text-white">
                  Presupuesto $110M
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Armá tu quinteto titular, suplentes y DT sin exceder los $110.000.000. Los precios varían según la LNB.
                </p>
              </div>

              <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
                <div className="text-3xl font-black italic text-[#FF5C00]">
                  02
                </div>
                <h3 className="text-base font-bold text-white">
                  Multiplicadores
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Elegí un Capitán (1.20x) entre tus titulares y un Sexto Hombre (0.80x) entre tus suplentes para optimizar tu puntaje.
                </p>
              </div>

              <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
                <div className="text-3xl font-black italic text-[#FF5C00]">
                  03
                </div>
                <h3 className="text-base font-bold text-white">
                  Planilla Oficial
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Puntos, rebotes y asistencias suman; faltas y pérdidas restan. Directo del sistema oficial de la Liga.
                </p>
              </div>

              <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
                <div className="text-3xl font-black italic text-[#FF5C00]">
                  04
                </div>
                <h3 className="text-base font-bold text-white">
                  Ligas con Amigos
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Creá tu liga privada o unite a las ligas de la comunidad para competir mano a mano cada semana.
                </p>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 4. CALL TO ACTION FINAL */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold uppercase rounded-full">
            <span>Temporada Regular</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black italic uppercase text-white tracking-tight">
            La Jornada 18 Arranca Pronto
          </h2>

          <p className="text-sm sm:text-base text-white/50 max-w-lg mx-auto">
            {hasAssembledTeam ? (
              "Tu equipo ya está confirmado. Podés realizar ajustes tácticos antes del salto inicial o ver el fixture de la fecha."
            ) : (
              "Recibí tus $110.000.000 al registrarte y armá tu quinteto titular antes del inicio de los partidos."
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {hasAssembledTeam ? (
              <>
                <button
                  onClick={onGoToBuilder || onGoToDashboard}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Ajustar Plantilla
                </button>
                <button
                  onClick={onGoToDashboard}
                  className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-all cursor-pointer"
                >
                  Ir a Mi Franquicia
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onGoToBuilder || (() => onOpenAuth("signup"))}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Armar Equipo Ahora ($110M)
                </button>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-all cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
