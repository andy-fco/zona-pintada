import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Key, 
  Trophy, 
  Copy, 
  Check, 
  Crown, 
  ShieldCheck, 
  Sparkles,
  Info,
  Compass,
  ArrowRight
} from "lucide-react";
import { INITIAL_PRIVATE_LEAGUES, COMMUNITY_LEAGUES, CommunityLeague } from "../../data/mockLeaguesAndMatches";
import { PrivateLeague, LeagueMember } from "../../types/league";

interface PrivateLeaguesViewProps {
  franchiseName?: string;
}

export const PrivateLeaguesView: React.FC<PrivateLeaguesViewProps> = ({ franchiseName }) => {
  const [activeSubTab, setActiveSubTab] = useState<"my-leagues" | "community">("my-leagues");
  const [leagues, setLeagues] = useState<PrivateLeague[]>(INITIAL_PRIVATE_LEAGUES);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(INITIAL_PRIVATE_LEAGUES[0].id);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([]);

  const selectedLeague = leagues.find(l => l.id === selectedLeagueId) || leagues[0];

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showAlert(`¡Código ${code} copiado al portapapeles!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;

    const randomCode = `ZONA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLeague: PrivateLeague = {
      id: `league-${Date.now()}`,
      code: randomCode,
      name: newLeagueName.trim(),
      creator: "Tú",
      membersCount: 1,
      userRank: 1,
      type: "clasica",
      members: [
        {
          id: "u-curr",
          rank: 1,
          userName: "Mi Franquicia",
          teamName: "Zona Pintada BC",
          avatarLetter: "M",
          totalPoints: 1395.0,
          matchdayPoints: 92.5,
          isCurrentUser: true,
        }
      ]
    };

    setLeagues([newLeague, ...leagues]);
    setSelectedLeagueId(newLeague.id);
    setNewLeagueName("");
    setIsCreateModalOpen(false);
    showAlert(`¡Liga privada "${newLeague.name}" creada con código: ${randomCode}!`);
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (leagues.some(l => l.code === cleanCode)) {
      showAlert("Ya formás parte de esta liga.");
      setIsJoinModalOpen(false);
      return;
    }

    const joinedLeague: PrivateLeague = {
      id: `league-joined-${Date.now()}`,
      code: cleanCode,
      name: `Liga ${cleanCode} Básquet`,
      creator: "Comisionado LNB",
      membersCount: 6,
      userRank: 3,
      type: "clasica",
      members: [
        { id: "uj-1", rank: 1, userName: "Agustín DT", teamName: "Atenas Córdoba", avatarLetter: "A", totalPoints: 1410.0, matchdayPoints: 85.0 },
        { id: "uj-2", rank: 2, userName: "Matías", teamName: "Ferro Básquet", avatarLetter: "M", totalPoints: 1402.0, matchdayPoints: 88.0 },
        { id: "uj-curr", rank: 3, userName: "Mi Franquicia", teamName: "Zona Pintada BC", avatarLetter: "M", totalPoints: 1395.0, matchdayPoints: 92.5, isCurrentUser: true },
        { id: "uj-3", rank: 4, userName: "Pedro L.", teamName: "Regatas Play", avatarLetter: "P", totalPoints: 1360.5, matchdayPoints: 79.0 },
      ]
    };

    setLeagues([...leagues, joinedLeague]);
    setSelectedLeagueId(joinedLeague.id);
    setJoinCodeInput("");
    setIsJoinModalOpen(false);
    showAlert(`¡Te uniste con éxito a la liga ${cleanCode}!`);
  };

  const handleJoinCommunityLeague = (comLeague: CommunityLeague) => {
    if (joinedCommunityIds.includes(comLeague.id)) return;

    const newPrivateLeague: PrivateLeague = {
      id: `com-joined-${comLeague.id}`,
      code: comLeague.code,
      name: comLeague.name,
      creator: comLeague.creator,
      membersCount: comLeague.membersCount + 1,
      userRank: 12,
      type: "clasica",
      members: [
        { id: "cm-1", rank: 1, userName: "DT Líder", teamName: comLeague.leaderTeam, avatarLetter: "L", totalPoints: comLeague.leaderPoints, matchdayPoints: 98.0 },
        { id: "cm-2", rank: 2, userName: "Joaquín D.", teamName: "Xeneize Pentacampeón", avatarLetter: "J", totalPoints: 1528.0, matchdayPoints: 99.5 },
        { id: "cm-3", rank: 3, userName: "Emiliano T.", teamName: "La Fusión Santiagueña", avatarLetter: "E", totalPoints: 1515.0, matchdayPoints: 94.0 },
        { id: "u-curr", rank: 12, userName: "Mi Franquicia", teamName: "Zona Pintada BC", avatarLetter: "M", totalPoints: 1395.0, matchdayPoints: 92.5, isCurrentUser: true },
      ]
    };

    setLeagues(prev => [...prev, newPrivateLeague]);
    setJoinedCommunityIds(prev => [...prev, comLeague.id]);
    setSelectedLeagueId(newPrivateLeague.id);
    setActiveSubTab("my-leagues");
    showAlert(`¡Te uniste a "${comLeague.name}"! Ahora figura en tus ligas.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Transient feedback banner */}
      {alertMessage && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Info className="w-4 h-4 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Aviso: las ligas todavía no están en el back */}
      <div className="px-4 py-3 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-xl text-xs text-[#FF5C00] font-semibold">
        Próximamente: las ligas privadas todavía no están disponibles. Lo que ves es una demostración y no se guarda.
      </div>

      {/* Top Banner with Action Buttons */}
      <div className="p-6 bg-[#121212] border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] text-[10px] font-bold uppercase rounded-md">
              Torneos & Ligas
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            Ligas de la Comunidad y Amigos
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Competí mano a mano en tablas privadas o sumate a torneos comunitarios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Unirse con Código</span>
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-[#FF5C00] text-black hover:bg-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Liga</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs">
        <button
          onClick={() => setActiveSubTab("my-leagues")}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
            activeSubTab === "my-leagues"
              ? "bg-[#FF5C00] text-black"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          Mis Ligas ({leagues.length})
        </button>
        <button
          onClick={() => setActiveSubTab("community")}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "community"
              ? "bg-[#FF5C00] text-black"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#FF5C00]" />
          <span>Explorar Ligas de la Comunidad ({COMMUNITY_LEAGUES.length})</span>
        </button>
      </div>

      {/* CONTENT: EXPLORE COMMUNITY LEAGUES */}
      {activeSubTab === "community" && (
        <div className="space-y-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <h3 className="text-sm font-bold text-white">Ligas Abiertas Destacadas</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Unite a estas ligas públicas con un solo clic para competir con hinchas, periodistas y la comunidad oficial de la LNB.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMUNITY_LEAGUES.map((league) => {
              const alreadyJoined = leagues.some(l => l.code === league.code);

              return (
                <div 
                  key={league.id}
                  className="p-5 bg-[#121212] border border-white/10 rounded-2xl space-y-3 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-white/70 rounded-md">
                        {league.category}
                      </span>
                      <span className="text-xs font-mono text-white/40">
                        {league.membersCount.toLocaleString()} participantes
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {league.name}
                    </h4>

                    <p className="text-xs text-white/50 leading-relaxed">
                      {league.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[11px] text-white/40">
                      <span>Líder: </span>
                      <strong className="text-white font-medium">{league.leaderTeam}</strong>
                    </div>

                    <button
                      onClick={() => handleJoinCommunityLeague(league)}
                      disabled={alreadyJoined}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        alreadyJoined
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-[#FF5C00] text-black hover:bg-white"
                      }`}
                    >
                      {alreadyJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Unido</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Unirme</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT: MY LEAGUES AND STANDINGS */}
      {activeSubTab === "my-leagues" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Col: Leagues List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white/50 uppercase tracking-wider pb-1">
              Tus Ligas ({leagues.length})
            </div>

            <div className="space-y-2">
              {leagues.map((league) => {
                const isSelected = league.id === selectedLeagueId;
                return (
                  <div
                    key={league.id}
                    onClick={() => setSelectedLeagueId(league.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white/[0.06] border-[#FF5C00]/60 shadow-lg shadow-orange-500/5"
                        : "bg-[#121212] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate max-w-[170px]">
                        {league.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#FF5C00] font-bold">
                        #{league.userRank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span>{league.membersCount} DTs</span>
                      <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-[10px]">
                        {league.code}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 3 Cols: Active League Detail & Leaderboard Table */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Header of the Selected League */}
            <div className="p-5 bg-[#121212] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white">
                    {selectedLeague.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-white/5 text-white/70 text-[10px] font-bold uppercase rounded">
                    {selectedLeague.type === 'clasica' ? 'Modalidad Clásica' : 'Head to Head'}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Creada por <strong className="text-white">{selectedLeague.creator}</strong> • {selectedLeague.membersCount} participantes
                </p>
              </div>

              {/* Share Code Button */}
              <button
                onClick={() => handleCopyCode(selectedLeague.code)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold text-white cursor-pointer transition-colors"
                title="Copiar código de invitación"
              >
                <span>Código: {selectedLeague.code}</span>
                {copiedCode === selectedLeague.code ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/50" />
                )}
              </button>
            </div>

            {/* Standings Table */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-white/40 uppercase tracking-wider text-[10px] font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Pos</th>
                    <th className="py-3 px-4">Franquicia</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Entrenador</th>
                    <th className="py-3 px-4 text-center">Fecha 18</th>
                    <th className="py-3 px-4 text-right">Puntos Totales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedLeague.members.map((member) => (
                    <tr 
                      key={member.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        member.isCurrentUser ? "bg-[#FF5C00]/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={member.rank === 1 ? "text-[#FF5C00] font-black" : "text-white/60"}>
                          #{member.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{member.isCurrentUser ? (franchiseName || member.teamName) : member.teamName}</span>
                          {member.isCurrentUser && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-[#FF5C00] text-black font-black rounded">
                              Tú
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-white/60 hidden sm:table-cell">
                        {member.userName}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#FF5C00]">
                        +{member.matchdayPoints}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-black text-white">
                        {member.totalPoints.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* CREATE LEAGUE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Crear Nueva Liga Privada</h3>
            <p className="text-xs text-white/50">
              Asigná un nombre a tu torneo. Se generará un código único para invitar a tus amigos.
            </p>
            <form onSubmit={handleCreateLeague} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/70 block mb-1.5">Nombre de la Liga</label>
                <input
                  type="text"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="Ej: Amigos del Club Obras"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF5C00]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newLeagueName.trim()}
                  className="px-5 py-2 bg-[#FF5C00] text-black font-bold text-xs rounded-xl disabled:opacity-40"
                >
                  Crear Liga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN WITH CODE MODAL */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Unirse a una Liga con Código</h3>
            <p className="text-xs text-white/50">
              Ingresá el código de invitación que te compartió el creador de la liga.
            </p>
            <form onSubmit={handleJoinWithCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/70 block mb-1.5">Código de Invitación</label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="Ej: ZONA-8821"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#FF5C00] uppercase"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!joinCodeInput.trim()}
                  className="px-5 py-2 bg-[#FF5C00] text-black font-bold text-xs rounded-xl disabled:opacity-40"
                >
                  Unirse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
