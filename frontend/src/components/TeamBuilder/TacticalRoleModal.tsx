import React from "react";
import { 
  RosterSlot, 
  TacticalRoleId, 
  TACTICAL_ROLES 
} from "../../types/basketball";
import { 
  Check, 
  X, 
  Info
} from "lucide-react";
import { TacticalRoleIcon } from "./TacticalRoleIcon";

interface TacticalRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: RosterSlot | null;
  onSelectRole: (slotId: string, newRole: TacticalRoleId) => void;
}

export const TacticalRoleModal: React.FC<TacticalRoleModalProps> = ({
  isOpen,
  onClose,
  slot,
  onSelectRole,
}) => {
  if (!isOpen || !slot || !slot.player) return null;

  const player = slot.player;
  const currentRole = slot.role;

  const roleKeys: TacticalRoleId[] = [
    'CAPTAIN',
    'CO_CAPTAIN',
    'SIXTH_MAN',
    'DEFENSIVE',
    'ROTATION',
    'BENCH',
    'DEEP_BENCH'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-white/[0.05] to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 flex items-center justify-center text-[#FF5C00] font-black text-sm">
              {player.position}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5C00]">
                  {slot.isStarter ? "Titular en Cancha" : "Rotación / Suplente"}
                </span>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-white/50 text-xs font-mono">#{player.number}</span>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                {player.name}
              </h3>
              <p className="text-xs text-white/50">
                {player.team} • Val. Promedio: <strong className="text-white font-mono">+{player.avgVal}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative description banner */}
        <div className="px-6 py-3 bg-[#FF5C00]/5 border-b border-[#FF5C00]/10 flex items-center gap-2 text-xs text-white/70">
          <Info className="w-4 h-4 text-[#FF5C00] shrink-0" />
          <span>
            El <strong>multiplicador táctico</strong> potencia los puntos fantasy obtenidos por el jugador según su rendimiento real en la fecha oficial de la LNB.
          </span>
        </div>

        {/* Roles List */}
        <div className="p-6 overflow-y-auto space-y-2.5 flex-1 divide-y-0">
          {roleKeys.map((key) => {
            const role = TACTICAL_ROLES[key];
            const isSelected = currentRole === key;

            return (
              <button
                key={key}
                onClick={() => {
                  onSelectRole(slot.slotId, key);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                  isSelected 
                    ? "bg-[#FF5C00]/15 border-[#FF5C00] shadow-lg shadow-orange-500/10" 
                    : "bg-[#181818] border-white/10 hover:border-white/25 hover:bg-[#1E1E1E]"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <TacticalRoleIcon roleId={key} size="lg" />
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black uppercase italic tracking-tight ${
                        isSelected ? "text-[#FF5C00]" : "text-white"
                      }`}>
                        {role.name}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase rounded-md">
                          Asignado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5 leading-snug">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl font-mono font-black text-sm text-center ${
                    isSelected 
                      ? "bg-[#FF5C00] text-black shadow-md shadow-orange-500/30" 
                      : "bg-white/10 text-white group-hover:bg-white/15"
                  }`}>
                    {role.multiplier.toFixed(2)}x
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected 
                      ? "border-[#FF5C00] bg-[#FF5C00] text-black" 
                      : "border-white/20 text-transparent group-hover:border-white/40"
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0F0F0F] border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>Seleccioná el rol para aplicar el cambio inmediatamente.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
