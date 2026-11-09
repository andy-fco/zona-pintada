import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDatosLnb } from "../context/DatosLnbContext";
import { getMiRankingGeneral } from "../api/rankingApi";
import { 
  LogOut, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  User, 
  Trophy, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  Radio, 
  Users, 
  Flame, 
  Tv, 
  Search,
  Sliders,
  Edit3,
  X,
  Info
} from "lucide-react";
import { TeamRoster, RosterSlot, formatSalary } from "../types/basketball";
import { TOTAL_BUDGET } from "../data/lnbData";
import { LiveMatchdayView } from "./Dashboard/LiveMatchdayView";
import { PrivateLeaguesView } from "./Dashboard/PrivateLeaguesView";
import { GlobalRankingsView } from "./Dashboard/GlobalRankingsView";
import { FixtureView } from "./Dashboard/FixtureView";
import { loadRoster, updateFranchiseName } from "../api/equipoFantasyApi";

interface ProtectedDashboardProps {
  onBackToLanding: () => void;
  onGoToTeamBuilder?: () => void;
  onOpenSearch?: () => void;
}

export const ProtectedDashboard: React.FC<ProtectedDashboardProps> = ({ 
  onBackToLanding, 
  onGoToTeamBuilder,
  onOpenSearch
}) => {
  const { user, signOut } = useAuth();
  const { numeroFecha, finSemana, usandoDatosDePrueba } = useDatosLnb();
  const [activeTab, setActiveTab] = useState<"live" | "leagues" | "rankings" | "fixture">("live");
  const [savedRoster, setSavedRoster] = useState<TeamRoster | null>(null);

  // Posición real en el ranking general
  const [miRanking, setMiRanking] = useState<{ posicion: number; puntos: number; total: number } | null>(null);
  useEffect(() => {
    if (!user) return;
    getMiRankingGeneral().then(setMiRanking);
  }, [user, savedRoster]);

  // Franchise Name state
  const [franchiseName, setFranchiseName] = useState<string>(() => {
    if (user) {
      const stored = localStorage.getItem(`zona_pintada_team_name_${user.uid}`);
      if (stored) return stored;
    }
    const guest = localStorage.getItem("zona_pintada_team_name_guest");
    return guest || "Mi Franquicia LNB";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Load saved roster from Cloud Firestore with local fallback
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    loadRoster(user.uid).then((saved) => {
      if (!isMounted || !saved) return;
      setSavedRoster(saved);
      if (saved.teamName) {
        setFranchiseName(saved.teamName);
      }
    }).catch((e) => {
      console.warn("Could not load stored roster", e);
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = editNameInput.trim();
    if (!clean) return;

    setIsSavingName(true);
    setFranchiseName(clean);
    setIsEditingName(false);

    if (savedRoster) {
      setSavedRoster({ ...savedRoster, teamName: clean });
    }

    await updateFranchiseName(user?.uid, clean);
    setIsSavingName(false);
    setFeedbackToast(`¡Nombre de franquicia cambiado a "${clean}"!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 bg-[#121212] border border-white/10 rounded-2xl space-y-4">
          <AlertCircle className="w-10 h-10 text-[#FF5C00] mx-auto" />
          <h2 className="text-xl font-bold text-white">
            Acceso Protegido
          </h2>
          <p className="text-white/60 text-xs">
            Debés iniciar sesión para acceder a tu franquicia en Zona Pintada.
          </p>
          <button
            onClick={onBackToLanding}
            className="px-6 py-2.5 font-bold text-xs uppercase bg-[#FF5C00] text-black rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const dtName = user.displayName || user.email?.split("@")[0] || "Director Técnico";

  // Calculate budget stats
  let spent = 0;
  let starterCount = 0;
  let benchCount = 0;
  let hasCoach = false;

  if (savedRoster) {
    if (savedRoster.starters) {
      (Object.values(savedRoster.starters) as RosterSlot[]).forEach((slot) => {
        if (slot.player) {
          spent += slot.player.price;
          starterCount++;
        }
      });
    }
    if (savedRoster.bench) {
      savedRoster.bench.forEach((slot) => {
        if (slot.player) {
          spent += slot.player.price;
          benchCount++;
        }
      });
    }
    if (savedRoster.coach?.coach) {
      spent += savedRoster.coach.coach.price;
      hasCoach = true;
    }
  }

  const remaining = TOTAL_BUDGET - spent;

  return (
    <div className="min-h-[85vh] bg-[#0B0B0B] py-8 px-4 sm:px-6 lg:px-8 relative text-white">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Feedback notification toast */}
        {feedbackToast && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Info className="w-4 h-4 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Top Welcome Banner */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-xs font-bold uppercase text-[#FF5C00] rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Director Técnico Oficial LNB</span>
              </div>

              {/* Franchise Name with Quick Edit Button */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
                  {franchiseName}
                </h1>
                <button
                  onClick={() => {
                    setEditNameInput(franchiseName);
                    setIsEditingName(true);
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Cambiar el nombre de tu franquicia"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span>Cambiar nombre</span>
                </button>
              </div>

              <p className="text-white/50 text-xs flex flex-wrap items-center gap-2">
                <span>DT: <strong className="text-white">{dtName}</strong></span>
                <span>•</span>
                <span>Cuenta: <strong className="text-white font-mono">{user.email}</strong></span>
                <span>•</span>
                <span className="text-[#FF5C00] font-bold">
                  {starterCount === 5 && benchCount === 5 && hasCoach 
                    ? "Plantilla Completa (11/11 Fichados)" 
                    : `${starterCount + benchCount + (hasCoach ? 1 : 0)}/11 Jugadores Confirmados`}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span className="hidden sm:inline">Buscar DTs & Ligas</span>
                </button>
              )}

              {onGoToTeamBuilder && (
                <button
                  id="btn-dashboard-go-builder"
                  onClick={onGoToTeamBuilder}
                  className="px-4 py-2.5 text-xs font-bold uppercase bg-[#FF5C00] text-black hover:bg-white rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{starterCount > 0 ? "Ajustar Plantilla" : "Armar Plantilla"}</span>
                </button>
              )}

              <button
                onClick={onBackToLanding}
                className="px-4 py-2.5 text-xs font-bold uppercase bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                Ver Inicio
              </button>

              <button
                id="btn-dashboard-logout"
                onClick={async () => {
                  await signOut();
                  onBackToLanding();
                }}
                className="p-2.5 text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-white/40 uppercase">
              Saldo Remanente
            </span>
            <div className="text-xl font-bold font-mono text-white">
              {formatSalary(remaining)}
            </div>
            <p className="text-[11px] text-white/40 truncate">
              Invertido: {formatSalary(spent)}
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-white/40 uppercase">
              Roster Activo
            </span>
            <div className="text-xl font-bold font-mono text-white">
              {starterCount}/5 Titulares
            </div>
            <p className="text-[11px] text-white/40">
              {benchCount} suplentes • {hasCoach ? "1 DT" : "Sin DT"}
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-white/40 uppercase">
              Ranking Global
            </span>
            <div className="text-xl font-bold font-mono text-[#FF5C00]">
              {usandoDatosDePrueba ? "#142" : miRanking ? `#${miRanking.posicion}` : "-"}
            </div>
            <p className="text-[11px] text-white/40 truncate">
              {usandoDatosDePrueba
                ? `${franchiseName} (Top 1%)`
                : miRanking
                ? `${miRanking.puntos} pts • de ${miRanking.total} equipos`
                : "Sin equipo en el ranking"}
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-white/40 uppercase">
              Fecha {numeroFecha} LNB
            </span>
            <div className="text-xl font-bold font-mono text-white">
              Activa
            </div>
            <p className="text-[11px] text-white/40">
              {finSemana
                ? `Cierre: ${finSemana.split("-").reverse().slice(0, 2).join("/")}`
                : "Cierre: Viernes 20:00 hs"}
            </p>
          </div>

        </div>

        {/* Navigation Tabs for Franchise Hub */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121212] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "live"
                ? "bg-[#FF5C00] text-black shadow-md shadow-orange-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Jornada en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab("leagues")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "leagues"
                ? "bg-[#FF5C00] text-black shadow-md shadow-orange-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ligas & Comunidad</span>
          </button>

          <button
            onClick={() => setActiveTab("rankings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "rankings"
                ? "bg-[#FF5C00] text-black shadow-md shadow-orange-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranking Nacional</span>
          </button>

          <button
            onClick={() => setActiveTab("fixture")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "fixture"
                ? "bg-[#FF5C00] text-black shadow-md shadow-orange-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Partidos & Fixture</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === "live" && (
            <LiveMatchdayView 
              roster={savedRoster} 
              onGoToTeamBuilder={onGoToTeamBuilder || onBackToLanding} 
            />
          )}

          {activeTab === "leagues" && (
            <PrivateLeaguesView franchiseName={franchiseName} />
          )}

          {activeTab === "rankings" && (
            <GlobalRankingsView 
              franchiseName={franchiseName} 
              onOpenEditName={() => {
                setEditNameInput(franchiseName);
                setIsEditingName(true);
              }}
            />
          )}

          {activeTab === "fixture" && (
            <FixtureView />
          )}
        </div>

      </div>

      {/* MODAL TO EDIT FRANCHISE NAME */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#FF5C00]" />
                <span>Cambiar Nombre de Franquicia</span>
              </h3>
              <button
                onClick={() => setIsEditingName(false)}
                className="text-white/40 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/50">
              Elegí cómo querés que se llame tu equipo en la Liga Nacional Fantasy. Se actualizará en el Ranking General y en todas tus ligas.
            </p>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/70 block mb-1.5">Nombre del Equipo</label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  placeholder="Ej: Quilmes Triples, Atenas Glory..."
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-[#FF5C00]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!editNameInput.trim() || isSavingName}
                  className="px-5 py-2 bg-[#FF5C00] text-black font-bold text-xs rounded-xl hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {isSavingName ? "Guardando..." : "Guardar Nombre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
