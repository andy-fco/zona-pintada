import React from "react";
import { useAuth } from "../context/AuthContext";
import { Flame, LogIn, LogOut, User as UserIcon, Shield, ShieldCheck, Trophy, LayoutDashboard, Search } from "lucide-react";
import type { AppView } from "../App";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAuth, 
  currentView, 
  setCurrentView,
  onOpenSearch 
}) => {
  const { user, signOut } = useAuth();
  const esAdmin = user?.rol === "administrador";
  // Para el admin, el botón de la derecha alterna entre el inicio y su panel
  const vistaPrivada: AppView = esAdmin ? "admin" : "dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B0B]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView("landing")}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          id="brand-logo"
        >
          <div className="w-9 h-9 bg-[#FF5C00] rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 border-2 border-black rounded-full"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight italic uppercase text-white group-hover:text-[#FF5C00] transition-colors">
                Zona Pintada
              </span>
              <span className="px-1.5 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase rounded">
                LNB
              </span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold hidden sm:block">
              Fantasy Oficial
            </p>
          </div>
        </div>

        {/* Center: Search Button (Quick Discovery) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl text-xs text-white/50 hover:text-white transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#FF5C00] shrink-0" />
              <span className="truncate">Buscar usuarios, DTs, jugadores, ligas...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-white/10 text-white/40 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setCurrentView("landing")}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer rounded-lg ${
              currentView === "landing"
                ? "text-[#FF5C00] bg-[#FF5C00]/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Inicio & LNB
          </button>

          {!esAdmin && (
          <button
            id="btn-nav-builder"
            onClick={() => setCurrentView("builder")}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer rounded-lg flex items-center gap-1.5 ${
              currentView === "builder"
                ? "bg-[#FF5C00] text-black"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Mi Equipo</span>
          </button>
          )}

          {esAdmin && (
            <button
              onClick={() => setCurrentView("admin")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer rounded-lg flex items-center gap-1.5 ${
                currentView === "admin"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
            </button>
          )}

          {user && !esAdmin && (
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer rounded-lg ${
                currentView === "dashboard"
                  ? "text-[#FF5C00] bg-[#FF5C00]/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Mi Franquicia
            </button>
          )}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-dashboard"
                onClick={() => setCurrentView(currentView === vistaPrivada ? "landing" : vistaPrivada)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                  currentView === vistaPrivada
                    ? "bg-[#FF5C00] text-black shadow-lg shadow-orange-500/20"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentView === vistaPrivada ? "Inicio" : esAdmin ? "Admin" : "Franquicia"}
                </span>
              </button>

              <button
                id="btn-logout"
                onClick={() => signOut()}
                title="Cerrar Sesión"
                className="flex items-center gap-1 p-2 text-xs text-white/40 hover:text-[#FF5C00] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-login"
                onClick={() => onOpenAuth("login")}
                className="px-3 py-2 text-xs font-bold uppercase text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                Ingresar
              </button>
              <button
                id="btn-nav-signup"
                onClick={() => onOpenAuth("signup")}
                className="px-4 py-2 bg-[#FF5C00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-colors cursor-pointer shadow-md shadow-orange-500/20"
              >
                Registrate
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
