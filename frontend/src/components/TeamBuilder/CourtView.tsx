import React, { useState } from "react";
import { 
  BasketballPlayer, 
  BasketballCoach, 
  RosterSlot, 
  CoachSlot, 
  PlayerPosition, 
  TACTICAL_ROLES, 
  TacticalRoleId, 
  formatSalary,
  getRoleMultiplier
} from "../../types/basketball";
import { 
  Plus, 
  X, 
  Eye, 
  Repeat, 
  UserPlus, 
  ChevronDown,
  Info
} from "lucide-react";
import { TacticalRoleModal } from "./TacticalRoleModal";
import { TacticalRoleIcon } from "./TacticalRoleIcon";

interface CourtViewProps {
  starters: {
    PG: RosterSlot;
    SG: RosterSlot;
    SF: RosterSlot;
    PF: RosterSlot;
    C: RosterSlot;
  };
  bench: RosterSlot[];
  coach: CoachSlot;
  onOpenSlotPicker: (slotId: string, position?: PlayerPosition, isStarter?: boolean) => void;
  onOpenPlayerDetail: (player: BasketballPlayer, currentRole?: TacticalRoleId) => void;
  onOpenCoachDetail: (coach: BasketballCoach) => void;
  onRemovePlayer: (slotId: string) => void;
  onRemoveCoach: () => void;
  onChangeRole: (slotId: string, newRole: TacticalRoleId) => void;
}

export const CourtView: React.FC<CourtViewProps> = ({
  starters,
  bench,
  coach,
  onOpenSlotPicker,
  onOpenPlayerDetail,
  onOpenCoachDetail,
  onRemovePlayer,
  onRemoveCoach,
  onChangeRole,
}) => {
  const [selectedRoleSlot, setSelectedRoleSlot] = useState<RosterSlot | null>(null);

  const getRoleBadgeStyle = (roleId: TacticalRoleId) => {
    switch (roleId) {
      case "CAPTAIN":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-500/15";
      case "SIXTH_MAN":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-500/15";
      case "NORMAL":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/15";
      default:
        return "bg-white/5 border-white/10 text-white/80 hover:border-white/30 hover:bg-white/10";
    }
  };

  const renderPlayerCard = (slot: RosterSlot) => {
    const player = slot.player;
    const roleInfo = TACTICAL_ROLES[slot.role];

    // Empty Slot Card
    if (!player) {
      return (
        <div 
          onClick={() => onOpenSlotPicker(slot.slotId, slot.requiredPosition, slot.isStarter)}
          className="group relative flex flex-col items-center justify-center p-5 bg-[#121212]/75 hover:bg-[#181818] border-2 border-dashed border-white/15 hover:border-[#FF5C00] rounded-2xl transition-all cursor-pointer min-h-[175px] text-center shadow-lg hover:shadow-orange-500/10"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#FF5C00] group-hover:text-black text-white/50 flex items-center justify-center transition-all mb-2.5">
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00] block mb-0.5">
            {slot.slotLabel}
          </span>
          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
            {slot.requiredPosition ? `+ Fichar ${slot.requiredPosition}` : "+ Fichar Suplente"}
          </span>
          <span className="text-[10px] text-white/40 mt-1.5 flex items-center gap-1">
            <span>Tocar para elegir</span>
          </span>
        </div>
      );
    }

    // Filled Player Card
    return (
      <div className="relative bg-[#141414] border border-white/10 hover:border-[#FF5C00]/60 transition-all rounded-2xl p-4 shadow-xl flex flex-col justify-between group space-y-3">
        
        {/* Top bar: Position Pill and Action buttons */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FF5C00]/15 border border-[#FF5C00]/30 text-[#FF5C00] font-black text-xs rounded-lg">
              {player.position}
            </span>
            <span className="text-xs text-white/40 font-mono font-bold">
              #{player.number}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenPlayerDetail(player, slot.role)}
              title="Ver ficha técnica"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenSlotPicker(slot.slotId, slot.requiredPosition, slot.isStarter)}
              title="Reemplazar jugador"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#FF5C00]/20 text-white/60 hover:text-[#FF5C00] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onRemovePlayer(slot.slotId)}
              title="Quitar de la plantilla"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Player Name and Club */}
        <div>
          <h4 className="text-sm font-black italic uppercase text-white truncate tracking-tight">
            {player.name}
          </h4>
          <p className="text-[11px] text-white/50 truncate font-medium">
            {player.teamShort} • {player.team}
          </p>
        </div>

        {/* Key Fantasy Stats (Price & Average Valuation) */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 border border-white/5 rounded-xl text-xs font-mono">
          <div>
            <span className="text-[9px] text-white/40 uppercase block leading-tight font-sans font-bold">
              PRECIO
            </span>
            <span className="font-black text-[#FF5C00] text-xs sm:text-sm">
              {formatSalary(player.price)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-white/40 uppercase block leading-tight font-sans font-bold">
              PROM. VAL
            </span>
            <span className="font-black text-white text-xs sm:text-sm">
              +{player.avgVal}
            </span>
          </div>
        </div>

        {/* Tactical Role Button with Multiplier - Clearly Clickable, Never Cut Off */}
        <div>
          <button
            type="button"
            onClick={() => setSelectedRoleSlot(slot)}
            title="Tocar para cambiar rol táctico y multiplicador"
            className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 group/btn text-left shadow-sm ${getRoleBadgeStyle(slot.role)}`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <TacticalRoleIcon roleId={slot.role} size="sm" />
                <span className="px-2 py-0.5 text-[11px] font-mono font-black bg-black/60 border border-white/10 rounded-md tracking-tight text-white">
                  {getRoleMultiplier(slot.role, slot.isStarter).toFixed(2)}x
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover/btn:text-white flex items-center gap-0.5 transition-colors">
                <span>Rol</span>
                <ChevronDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform opacity-70 group-hover/btn:opacity-100" />
              </span>
            </div>

            <div className="text-[11px] sm:text-xs font-black uppercase tracking-tight text-white leading-snug break-words">
              {roleInfo.name}
            </div>
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      
      {/* 1. VISUAL COURT (QUINTETO TITULAR) */}
      <div className="relative w-full bg-[#0D0D0D] border border-white/10 rounded-3xl p-5 sm:p-8 overflow-hidden shadow-2xl">
        
        {/* Subtle, elegant floor watermark */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(#FF5C00 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        ></div>

        {/* Soft basketball court perimeter markings */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 opacity-10">
          <div className="w-full border-b border-white relative h-10">
            <div className="w-28 h-28 border border-white rounded-full absolute -top-14 left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="w-full h-64 relative flex justify-center">
            <div className="w-[85%] max-w-xl h-72 border-t border-x border-white rounded-t-full absolute bottom-0"></div>
            <div className="w-44 h-48 border border-white/60 absolute bottom-0"></div>
          </div>
        </div>

        {/* Header of the Court */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] font-black text-[10px] uppercase tracking-wider rounded-md">
                Quinteto Inicial
              </span>
              <span className="text-white/40 text-xs font-mono">
                Reglamentario LNB
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight">
              Alineación en Cancha
            </h3>
          </div>
          <div className="text-xs text-white/50 flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Tocá cualquier multiplicador para ajustar Capitán y roles.</span>
          </div>
        </div>

        {/* Tactical 5-Starters Grid on Court */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Base (PG) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center justify-between px-1">
              <span>Base (PG)</span>
              <span className="text-[9px] text-white/40 font-mono">1</span>
            </div>
            {renderPlayerCard(starters.PG)}
          </div>

          {/* 2. Escolta (SG) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center justify-between px-1">
              <span>Escolta (SG)</span>
              <span className="text-[9px] text-white/40 font-mono">2</span>
            </div>
            {renderPlayerCard(starters.SG)}
          </div>

          {/* 3. Alero (SF) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center justify-between px-1">
              <span>Alero (SF)</span>
              <span className="text-[9px] text-white/40 font-mono">3</span>
            </div>
            {renderPlayerCard(starters.SF)}
          </div>

          {/* 4. Ala-Pívot (PF) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center justify-between px-1">
              <span>Ala-Pívot (PF)</span>
              <span className="text-[9px] text-white/40 font-mono">4</span>
            </div>
            {renderPlayerCard(starters.PF)}
          </div>

          {/* 5. Pívot (C) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center justify-between px-1">
              <span>Pívot (C)</span>
              <span className="text-[9px] text-white/40 font-mono">5</span>
            </div>
            {renderPlayerCard(starters.C)}
          </div>

        </div>

      </div>

      {/* 2. BANCO DE SUPLENTES & CUERPO TÉCNICO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bench (5 Slots, uno por posición) - 8 cols */}
        <div className="lg:col-span-8 bg-[#0D0D0D] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block">
                Rotación de Apoyo
              </span>
              <h3 className="text-lg font-black italic uppercase text-white">
                Banco de Suplentes (5 Fichas)
              </h3>
            </div>
            <span className="text-[10px] text-white/40 uppercase font-mono px-2 py-0.5 bg-white/5 rounded-md">
              Uno por Posición
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bench.map((benchSlot) => (
              <div key={benchSlot.slotId} className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-white/50 px-1">
                  {benchSlot.slotLabel}
                </div>
                {renderPlayerCard(benchSlot)}
              </div>
            ))}
          </div>
        </div>

        {/* Coach / DT (1 Slot) - 4 cols */}
        <div className="lg:col-span-4 bg-[#0D0D0D] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00] block">
                Estrategia Oficial
              </span>
              <h3 className="text-lg font-black italic uppercase text-white">
                Director Técnico (DT)
              </h3>
            </div>
            <span className="text-[10px] text-[#FF5C00] font-black font-mono px-2 py-0.5 bg-[#FF5C00]/10 rounded-md">
              1 Ficha
            </span>
          </div>

          {coach.coach ? (
            <div className="p-4 bg-[#141414] border border-white/10 hover:border-[#FF5C00]/60 rounded-2xl transition-all space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FF5C00] text-black rounded-md">
                    DT Oficial LNB
                  </span>
                  <h4 className="text-lg font-black italic uppercase text-white mt-1.5">
                    {coach.coach.name}
                  </h4>
                  <p className="text-xs text-white/50 uppercase font-semibold">
                    {coach.coach.team}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenCoachDetail(coach.coach!)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Ver ficha técnica"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenSlotPicker("coach-slot", undefined, false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#FF5C00]/20 text-white/60 hover:text-[#FF5C00] flex items-center justify-center transition-colors cursor-pointer"
                    title="Cambiar DT"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onRemoveCoach}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Quitar DT"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2 bg-black/40 rounded-xl">
                <div>
                  <span className="text-[9px] text-white/40 uppercase block font-sans font-bold">SALARIO</span>
                  <span className="font-black text-[#FF5C00]">{formatSalary(coach.coach.price)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-white/40 uppercase block font-sans font-bold">BONUS VISITA</span>
                  <span className="font-black text-white">+{coach.coach.winBonusAway} PTS</span>
                </div>
              </div>

              <p className="text-[11px] text-white/50 leading-snug">
                {coach.coach.tacticalStyle}
              </p>
            </div>
          ) : (
            <div 
              onClick={() => onOpenSlotPicker("coach-slot", undefined, false)}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-[#121212]/75 hover:bg-[#181818] border-2 border-dashed border-white/15 hover:border-[#FF5C00] rounded-2xl transition-all cursor-pointer text-center group min-h-[170px]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#FF5C00] group-hover:text-black text-white/50 flex items-center justify-center transition-all mb-2.5">
                <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xs font-black uppercase italic text-white group-hover:text-[#FF5C00] transition-colors">
                Contratar Director Técnico
              </span>
              <span className="text-[10px] text-white/40 mt-1">
                Bonifica triunfos de local (+5) y visitante (+10)
              </span>
            </div>
          )}

        </div>

      </div>

      {/* Tactical Role Selection Modal */}
      <TacticalRoleModal
        isOpen={selectedRoleSlot !== null}
        onClose={() => setSelectedRoleSlot(null)}
        slot={selectedRoleSlot}
        onSelectRole={onChangeRole}
      />

    </div>
  );
};
