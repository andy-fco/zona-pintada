import React from "react";
import { formatSalary, TOTAL_BUDGET } from "../../data/lnbData";
import { 
  Sparkles, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  LayoutGrid, 
  SlidersHorizontal
} from "lucide-react";

interface RosterSummaryBarProps {
  spentBudget: number;
  starterCount: number;
  benchCount: number;
  hasCoach: boolean;
  totalValuation: number;
  activeView: "court" | "market";
  setActiveView: (view: "court" | "market") => void;
  onAutoComplete: () => void;
  onClearRoster: () => void;
  onSaveRoster: () => void;
  isSavedSuccess: boolean;
}

export const RosterSummaryBar: React.FC<RosterSummaryBarProps> = ({
  spentBudget,
  starterCount,
  benchCount,
  hasCoach,
  totalValuation,
  activeView,
  setActiveView,
  onAutoComplete,
  onClearRoster,
  onSaveRoster,
  isSavedSuccess,
}) => {
  const remainingBudget = TOTAL_BUDGET - spentBudget;
  const isOverBudget = remainingBudget < 0;
  const budgetPercentage = Math.min(100, Math.round((spentBudget / TOTAL_BUDGET) * 100));
  const totalPlayersCount = starterCount + benchCount + (hasCoach ? 1 : 0);

  return (
    <div className="sticky top-20 z-30 w-full bg-[#0E0E0E]/95 backdrop-blur-xl border-b border-white/10 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Financial / Cap Bar */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5C00]">
                Tope $110M
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="text-white/60 hidden sm:inline font-mono text-xs">
                Invertido: {formatSalary(spentBudget)} ({budgetPercentage}%)
              </span>
            </div>

            <div className="font-mono text-xs sm:text-sm">
              {isOverBudget ? (
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Exceso: {formatSalary(Math.abs(remainingBudget))}</span>
                </span>
              ) : (
                <span className="text-white/80">
                  Disponible: <strong className="text-[#FF5C00] font-black">{formatSalary(remainingBudget)}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Salary Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                isOverBudget ? "bg-red-500" : "bg-gradient-to-r from-orange-600 to-[#FF5C00]"
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Center: Roster Metrics */}
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 border-y sm:border-y-0 sm:border-x border-white/10 py-2.5 sm:py-0 sm:px-6">
          {/* Players Count */}
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block">
              FICHAS
            </span>
            <span className={`text-base sm:text-lg font-black italic font-mono ${
              totalPlayersCount === 10 ? "text-[#FF5C00]" : "text-white"
            }`}>
              {totalPlayersCount}/10
            </span>
            <span className="text-[9px] text-white/40 font-mono hidden sm:block">
              {starterCount}T • {benchCount}S • {hasCoach ? "1DT" : "0DT"}
            </span>
          </div>

          {/* Projected Valuation */}
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block">
              VAL. PROYECTADA
            </span>
            <span className="text-base sm:text-lg font-black italic font-mono text-[#FF5C00]">
              +{totalValuation.toFixed(1)}
            </span>
            <span className="text-[9px] text-white/40 font-mono hidden sm:block">
              Con multiplicadores
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-black/60 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveView("court")}
              className={`px-3 py-1.5 text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-lg ${
                activeView === "court"
                  ? "bg-[#FF5C00] text-black shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              title="Alineación en Cancha"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cancha</span>
            </button>
            <button
              onClick={() => setActiveView("market")}
              className={`px-3 py-1.5 text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-lg ${
                activeView === "market"
                  ? "bg-[#FF5C00] text-black shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              title="Catálogo de Mercado"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mercado</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Autocomplete Button */}
          <button
            onClick={onAutoComplete}
            title="Generar alineación recomendada de $110M"
            className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-[#FF5C00]/30 hover:border-[#FF5C00] text-white text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer flex items-center gap-1.5 rounded-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span className="hidden sm:inline">Sugerir</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onClearRoster}
            title="Limpiar plantilla"
            className="p-2.5 sm:px-3 sm:py-2.5 bg-white/5 border border-white/10 hover:border-red-500/40 text-white/60 hover:text-red-300 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Limpiar</span>
          </button>

          {/* Save Button */}
          <button
            onClick={onSaveRoster}
            disabled={isOverBudget}
            className={`px-5 py-2.5 text-xs font-black uppercase italic tracking-wider flex items-center gap-2 transition-all cursor-pointer rounded-xl ${
              isOverBudget
                ? "bg-red-950/80 text-red-300 border border-red-500/40 opacity-50 cursor-not-allowed"
                : isSavedSuccess
                ? "bg-white text-black font-black"
                : "bg-[#FF5C00] text-black hover:bg-white hover:text-black shadow-lg shadow-orange-500/20"
            }`}
          >
            {isSavedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
