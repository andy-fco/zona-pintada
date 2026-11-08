import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0B0B0B] py-12 px-4 sm:px-6 lg:px-8 text-white/50 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF5C00] rounded-full flex items-center justify-center text-black font-black text-xs">
            <div className="w-5 h-5 border-2 border-black rounded-full"></div>
          </div>
          <div>
            <div className="text-xl font-black italic text-white tracking-tight uppercase">
              Zona Pintada
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Fantasy Oficial de la Liga Nacional de Básquet (LNB)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-widest font-semibold text-white/40">
          <span>$110M Presupuesto</span>
          <span className="text-white/20">•</span>
          <span>0.50x - 1.20x Multiplicadores</span>
          <span className="text-white/20">•</span>
          <span className="text-[#FF5C00]">Temporada Regular 2024/25</span>
        </div>

        <div className="text-center md:text-right text-white/30 text-[10px] uppercase tracking-widest font-bold">
          Temporada 2024/25 • Prototipo Oficial
        </div>

      </div>
    </footer>
  );
};
