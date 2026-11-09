import React, { useEffect, useState } from "react";
import { JugadorResponse, PartidoResponse, JugadorPartidoResponse } from "../../api/lnbApi";
import {
  EstadisticasJugador,
  listarPartidos,
  listarJugadores,
  listarEstadisticasPartido,
  registrarEstadisticas,
  editarEstadisticas,
  borrarEstadisticas,
} from "../../api/adminApi";
import { useSemanasActivas } from "./PartidosAdmin";
import { Tarjeta, Boton, Selector, useAccion, confirmar, fechaCorta } from "./ui";

// Columnas que carga el admin (el resto va en 0)
const COLUMNAS: { clave: keyof EstadisticasJugador; titulo: string }[] = [
  { clave: "doblesConvertidos", titulo: "2PC" },
  { clave: "doblesIntentados", titulo: "2PI" },
  { clave: "triplesConvertidos", titulo: "3PC" },
  { clave: "triplesIntentados", titulo: "3PI" },
  { clave: "libresConvertidos", titulo: "LC" },
  { clave: "libresIntentados", titulo: "LI" },
  { clave: "rebotesOfensivos", titulo: "RO" },
  { clave: "rebotesDefensivos", titulo: "RD" },
  { clave: "asistencias", titulo: "AST" },
  { clave: "recuperos", titulo: "REC" },
  { clave: "perdidas", titulo: "PER" },
  { clave: "tapones", titulo: "TAP" },
  { clave: "faltasPersonales", titulo: "FP" },
];

const VACIA: EstadisticasJugador = {
  titular: false,
  puntos: 0,
  doblesConvertidos: 0,
  doblesIntentados: 0,
  triplesConvertidos: 0,
  triplesIntentados: 0,
  libresConvertidos: 0,
  libresIntentados: 0,
  rebotesOfensivos: 0,
  rebotesDefensivos: 0,
  asistencias: 0,
  recuperos: 0,
  perdidas: 0,
  tapones: 0,
  taponesRecibidos: 0,
  faltasPersonales: 0,
  faltasRecibidas: 0,
  masMenos: 0,
  valoracion: 0,
};

// Puntos y valoración (fórmula FIBA) se calculan solos a partir de la planilla
function completar(e: EstadisticasJugador): EstadisticasJugador {
  const puntos = e.doblesConvertidos * 2 + e.triplesConvertidos * 3 + e.libresConvertidos;
  const fallados =
    e.doblesIntentados - e.doblesConvertidos +
    (e.triplesIntentados - e.triplesConvertidos) +
    (e.libresIntentados - e.libresConvertidos);
  const valoracion =
    puntos + e.rebotesOfensivos + e.rebotesDefensivos + e.asistencias + e.recuperos + e.tapones + e.faltasRecibidas -
    fallados - e.perdidas - e.taponesRecibidos - e.faltasPersonales;
  return { ...e, puntos, valoracion };
}

const desdeRespuesta = (r: JugadorPartidoResponse): EstadisticasJugador => {
  const base = { ...VACIA };
  (Object.keys(VACIA) as (keyof EstadisticasJugador)[]).forEach((k) => {
    const valor = (r as unknown as Record<string, unknown>)[k];
    if (valor !== null && valor !== undefined) (base as Record<string, unknown>)[k] = valor;
  });
  return base;
};

interface Fila {
  jugador: JugadorResponse;
  stats: EstadisticasJugador;
  guardada: boolean; // ya existe en el back
  jugo: boolean;
}

const PlanillaEquipo: React.FC<{
  titulo: string;
  filas: Fila[];
  onCambiar: (jugadorId: number, cambios: Partial<Fila> & { stats?: EstadisticasJugador }) => void;
  onBorrar: (jugadorId: number) => void;
  bloqueado: boolean;
}> = ({ titulo, filas, onCambiar, onBorrar, bloqueado }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-black uppercase text-[#FF5C00]">{titulo}</h4>
    <div className="overflow-x-auto border border-white/10 rounded-xl">
      <table className="w-full text-xs">
        <thead className="bg-white/[0.03] text-[10px] uppercase text-white/40">
          <tr>
            <th className="px-2 py-2 text-left">Jugó</th>
            <th className="px-2 py-2 text-left">Jugador</th>
            <th className="px-2 py-2">Tit.</th>
            {COLUMNAS.map((c) => <th key={c.clave} className="px-1 py-2">{c.titulo}</th>)}
            <th className="px-2 py-2">PTS</th>
            <th className="px-2 py-2">VAL</th>
            <th className="px-2 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {filas.length === 0 && (
            <tr><td colSpan={COLUMNAS.length + 6} className="px-3 py-4 text-center text-white/40">El equipo no tiene jugadores cargados.</td></tr>
          )}
          {filas.map(({ jugador, stats, guardada, jugo }) => (
            <tr key={jugador.id} className={jugo ? "text-white" : "text-white/30"}>
              <td className="px-2 py-1.5">
                <input type="checkbox" checked={jugo} disabled={bloqueado || guardada}
                  onChange={(e) => onCambiar(jugador.id, { jugo: e.target.checked })} />
              </td>
              <td className="px-2 py-1.5 whitespace-nowrap font-bold">
                {jugador.apellido}, {jugador.nombre}
                {guardada && <span className="ml-1.5 text-[9px] text-emerald-400 uppercase">cargado</span>}
              </td>
              <td className="px-2 py-1.5 text-center">
                <input type="checkbox" checked={stats.titular} disabled={bloqueado || !jugo}
                  onChange={(e) => onCambiar(jugador.id, { stats: { ...stats, titular: e.target.checked } })} />
              </td>
              {COLUMNAS.map((c) => (
                <td key={c.clave} className="px-1 py-1.5">
                  <input
                    type="number"
                    min={0}
                    disabled={bloqueado || !jugo}
                    value={stats[c.clave] as number}
                    onChange={(e) =>
                      onCambiar(jugador.id, {
                        stats: completar({ ...stats, [c.clave]: Math.max(0, Number(e.target.value) || 0) }),
                      })
                    }
                    className="w-12 bg-black/60 border border-white/10 rounded px-1.5 py-1 text-center text-white disabled:opacity-30 focus:outline-none focus:border-[#FF5C00]"
                  />
                </td>
              ))}
              <td className="px-2 py-1.5 text-center font-mono font-bold">{stats.puntos}</td>
              <td className="px-2 py-1.5 text-center font-mono font-bold text-[#FF5C00]">{stats.valoracion}</td>
              <td className="px-2 py-1.5 text-right">
                {guardada && !bloqueado && (
                  <Boton chico variante="peligro" onClick={() => onBorrar(jugador.id)}>Borrar</Boton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const EstadisticasAdmin: React.FC = () => {
  const { semanas, semanaId, SelectorSemana } = useSemanasActivas();
  const [partidos, setPartidos] = useState<PartidoResponse[]>([]);
  const [partidoId, setPartidoId] = useState<number | null>(null);
  const [filas, setFilas] = useState<Fila[]>([]);
  const { ejecutar, Aviso, ocupado } = useAccion();

  const semana = semanas.find((s) => s.id === semanaId);
  const partido = partidos.find((p) => p.id === partidoId);
  const bloqueado = !!semana?.cerradaAt;

  useEffect(() => {
    if (!semanaId) return;
    listarPartidos(semanaId)
      .then((ps) => {
        setPartidos(ps);
        setPartidoId(ps[0]?.id ?? null);
      })
      .catch(() => setPartidos([]));
  }, [semanaId]);

  const cargarPlanilla = async () => {
    if (!partido) {
      setFilas([]);
      return;
    }
    const [locales, visitantes, existentes] = await Promise.all([
      listarJugadores(partido.equipoLocalId).catch(() => []),
      listarJugadores(partido.equipoVisitanteId).catch(() => []),
      listarEstadisticasPartido(partido.id).catch(() => []),
    ]);
    setFilas(
      [...locales, ...visitantes].map((jugador) => {
        const previa = existentes.find((x) => x.jugadorId === jugador.id);
        return {
          jugador,
          stats: previa ? desdeRespuesta(previa) : { ...VACIA },
          guardada: !!previa,
          jugo: !!previa,
        };
      })
    );
  };

  useEffect(() => {
    cargarPlanilla();
  }, [partidoId, partidos]);

  const cambiar = (jugadorId: number, cambios: Partial<Fila>) =>
    setFilas((prev) => prev.map((f) => (f.jugador.id === jugadorId ? { ...f, ...cambios } : f)));

  const guardarPlanilla = () => {
    if (!partido) return;
    const aGuardar = filas.filter((f) => f.jugo);
    ejecutar(
      async () => {
        for (const f of aGuardar) {
          const datos = completar(f.stats);
          if (f.guardada) await editarEstadisticas(partido.id, f.jugador.id, datos);
          else await registrarEstadisticas(partido.id, { ...datos, jugadorId: f.jugador.id, equipoId: f.jugador.equipoId });
        }
      },
      `Planilla guardada (${aGuardar.length} jugadores).`,
      cargarPlanilla
    );
  };

  const borrar = (jugadorId: number) => {
    if (!partido || !confirmar("¿Borrar las estadísticas de este jugador en el partido?")) return;
    ejecutar(() => borrarEstadisticas(partido.id, jugadorId), "Estadísticas borradas.", cargarPlanilla);
  };

  const locales = filas.filter((f) => f.jugador.equipoId === partido?.equipoLocalId);
  const visitantes = filas.filter((f) => f.jugador.equipoId === partido?.equipoVisitanteId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold uppercase text-white/40">Semana</span>
        <SelectorSemana />
        <span className="text-xs font-bold uppercase text-white/40">Partido</span>
        <Selector value={partidoId ?? ""} onChange={(e) => setPartidoId(Number(e.target.value))} className="sm:w-80">
          {partidos.length === 0 && <option value="">Sin partidos</option>}
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              {fechaCorta(p.fecha)} • {p.equipoLocal} vs {p.equipoVisitante}
            </option>
          ))}
        </Selector>
      </div>
      <Aviso />

      {partido && (
        <Tarjeta
          titulo={`${partido.equipoLocal} vs ${partido.equipoVisitante}`}
          acciones={!bloqueado && (
            <Boton variante="primario" disabled={ocupado} onClick={guardarPlanilla}>Guardar planilla</Boton>
          )}
        >
          <p className="text-xs text-white/50">
            Tildá <strong className="text-white">Jugó</strong> en cada jugador que participó y cargá su planilla.
            Los <strong className="text-white">puntos</strong> y la <strong className="text-white">valoración</strong> se calculan solos.
            {bloqueado && " La semana está cerrada: solo lectura."}
          </p>
          <PlanillaEquipo titulo={`Local • ${partido.equipoLocal}`} filas={locales} onCambiar={cambiar} onBorrar={borrar} bloqueado={bloqueado} />
          <PlanillaEquipo titulo={`Visitante • ${partido.equipoVisitante}`} filas={visitantes} onCambiar={cambiar} onBorrar={borrar} bloqueado={bloqueado} />
        </Tarjeta>
      )}
    </div>
  );
};
