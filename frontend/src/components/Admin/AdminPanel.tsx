import React, { useState } from "react";
import { CalendarDays, Swords, ClipboardList, Shirt, Users, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { TemporadasAdmin } from "./TemporadasAdmin";
import { PartidosAdmin } from "./PartidosAdmin";
import { EstadisticasAdmin } from "./EstadisticasAdmin";
import { LnbAdmin } from "./LnbAdmin";
import { UsuariosAdmin } from "./UsuariosAdmin";

type Pestania = "temporadas" | "partidos" | "estadisticas" | "lnb" | "usuarios";

const PESTANIAS: { id: Pestania; texto: string; icono: React.ElementType }[] = [
  { id: "temporadas", texto: "Temporada y semanas", icono: CalendarDays },
  { id: "partidos", texto: "Partidos", icono: Swords },
  { id: "estadisticas", texto: "Estadísticas", icono: ClipboardList },
  { id: "lnb", texto: "Equipos, jugadores y DTs", icono: Shirt },
  { id: "usuarios", texto: "Usuarios", icono: Users },
];

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [pestania, setPestania] = useState<Pestania>("temporadas");

  if (user?.rol !== "administrador") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-white/60">
        Esta sección es solo para administradores.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-xs font-bold uppercase text-[#FF5C00] rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Administrador
        </div>
        <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white">Panel de Administración</h1>
        <p className="text-sm text-white/50 mt-1">
          Cargá la temporada, las semanas, los partidos y las estadísticas. Con eso se calculan los puntos del fantasy.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 p-1 bg-[#121212] border border-white/10 rounded-2xl">
        {PESTANIAS.map(({ id, texto, icono: Icono }) => (
          <button
            key={id}
            onClick={() => setPestania(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
              pestania === id ? "bg-[#FF5C00] text-black" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icono className="w-4 h-4" />
            {texto}
          </button>
        ))}
      </div>

      {pestania === "temporadas" && <TemporadasAdmin />}
      {pestania === "partidos" && <PartidosAdmin />}
      {pestania === "estadisticas" && <EstadisticasAdmin />}
      {pestania === "lnb" && <LnbAdmin />}
      {pestania === "usuarios" && <UsuariosAdmin />}
    </div>
  );
};
