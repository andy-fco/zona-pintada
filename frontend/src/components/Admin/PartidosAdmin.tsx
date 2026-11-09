import React, { useEffect, useState } from "react";
import { EquipoResponse, PartidoResponse, SemanaCompetenciaResponse, EstadoPartido } from "../../api/lnbApi";
import {
  TemporadaAdmin,
  FechaCompetencia,
  ActualizarPartidoRequest,
  listarTemporadas,
  listarSemanas,
  listarFechas,
  listarEquipos,
  listarPartidos,
  crearPartido,
  editarPartido,
  borrarPartido,
} from "../../api/adminApi";
import { Tarjeta, Boton, Campo, Entrada, Selector, Tabla, Celda, useAccion, confirmar, fechaCorta } from "./ui";

const ESTADOS: { valor: EstadoPartido; texto: string }[] = [
  { valor: "programado", texto: "Programado" },
  { valor: "en_juego", texto: "En juego" },
  { valor: "finalizado", texto: "Finalizado" },
  { valor: "suspendido", texto: "Suspendido" },
];

/** Selector de semana de la temporada activa, compartido con la pestaña de estadísticas */
export function useSemanasActivas() {
  const [semanas, setSemanas] = useState<SemanaCompetenciaResponse[]>([]);
  const [semanaId, setSemanaId] = useState<number | null>(null);

  useEffect(() => {
    listarTemporadas()
      .then((ts: TemporadaAdmin[]) => {
        const activa = ts.find((t) => t.activa);
        return activa ? listarSemanas(activa.id) : [];
      })
      .then((ss) => {
        setSemanas(ss);
        // Por defecto, la primera semana abierta
        const abierta = ss.find((s) => !s.cerradaAt) ?? ss[0];
        setSemanaId(abierta?.id ?? null);
      })
      .catch(() => setSemanas([]));
  }, []);

  const SelectorSemana = () => (
    <Selector value={semanaId ?? ""} onChange={(e) => setSemanaId(Number(e.target.value))} className="sm:w-96">
      {semanas.length === 0 && <option value="">Sin semanas</option>}
      {semanas.map((s) => (
        <option key={s.id} value={s.id}>
          Semana {s.numeroSemana} ({fechaCorta(s.fechaInicio)} al {fechaCorta(s.fechaFin)}){s.cerradaAt ? " • cerrada" : ""}
        </option>
      ))}
    </Selector>
  );

  return { semanas, semanaId, setSemanaId, SelectorSemana };
}

const NUEVO_VACIO = { equipoLocalId: "", equipoVisitanteId: "", fechaCompetenciaId: "", hora: "21:00" };

export const PartidosAdmin: React.FC = () => {
  const { semanas, semanaId, SelectorSemana } = useSemanasActivas();
  const [equipos, setEquipos] = useState<EquipoResponse[]>([]);
  const [fechas, setFechas] = useState<FechaCompetencia[]>([]);
  const [partidos, setPartidos] = useState<PartidoResponse[]>([]);
  const [nuevo, setNuevo] = useState(NUEVO_VACIO);
  const [edicion, setEdicion] = useState<{ id: number; datos: ActualizarPartidoRequest } | null>(null);
  const { ejecutar, Aviso, ocupado } = useAccion();

  const semana = semanas.find((s) => s.id === semanaId);
  const nombreEquipo = (id: number) => equipos.find((e) => e.id === id)?.nombre ?? `#${id}`;

  useEffect(() => {
    listarEquipos().then(setEquipos).catch(() => setEquipos([]));
  }, []);

  const recargar = () => {
    if (!semanaId) return;
    listarPartidos(semanaId).then(setPartidos).catch(() => setPartidos([]));
    listarFechas(semanaId).then(setFechas).catch(() => setFechas([]));
  };

  useEffect(() => {
    setEdicion(null);
    recargar();
  }, [semanaId]);

  const crear = () => {
    const fecha = fechas.find((f) => f.id === Number(nuevo.fechaCompetenciaId));
    if (!fecha) return;
    ejecutar(
      () =>
        crearPartido({
          equipoLocalId: Number(nuevo.equipoLocalId),
          equipoVisitanteId: Number(nuevo.equipoVisitanteId),
          fechaCompetenciaId: fecha.id,
          fecha: fecha.fecha,
          hora: nuevo.hora,
        }),
      "Partido creado.",
      () => {
        setNuevo({ ...NUEVO_VACIO, fechaCompetenciaId: nuevo.fechaCompetenciaId, hora: nuevo.hora });
        recargar();
      }
    );
  };

  const empezarEdicion = (p: PartidoResponse) =>
    setEdicion({
      id: p.id,
      datos: {
        fecha: p.fecha,
        hora: (p.hora ?? "21:00").slice(0, 5),
        puntosLocal: p.puntosLocal,
        puntosVisitante: p.puntosVisitante,
        estado: p.estado,
      },
    });

  const guardarEdicion = () => {
    if (!edicion) return;
    ejecutar(() => editarPartido(edicion.id, edicion.datos), "Partido actualizado.", () => {
      setEdicion(null);
      recargar();
    });
  };

  const numero = (v: string) => (v === "" ? null : Number(v));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold uppercase text-white/40">Semana</span>
        <SelectorSemana />
      </div>
      <Aviso />

      {semana && !semana.cerradaAt && (
        <Tarjeta titulo="Nuevo partido">
          {fechas.length === 0 ? (
            <p className="text-sm text-white/50">
              Esta semana no tiene días generados. Generalos en la pestaña <strong className="text-white">Temporada y semanas</strong>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <Campo etiqueta="Local">
                <Selector value={nuevo.equipoLocalId} onChange={(e) => setNuevo({ ...nuevo, equipoLocalId: e.target.value })}>
                  <option value="">Elegí...</option>
                  {equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </Selector>
              </Campo>
              <Campo etiqueta="Visitante">
                <Selector value={nuevo.equipoVisitanteId} onChange={(e) => setNuevo({ ...nuevo, equipoVisitanteId: e.target.value })}>
                  <option value="">Elegí...</option>
                  {equipos.filter((e) => String(e.id) !== nuevo.equipoLocalId).map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </Selector>
              </Campo>
              <Campo etiqueta="Día">
                <Selector value={nuevo.fechaCompetenciaId} onChange={(e) => setNuevo({ ...nuevo, fechaCompetenciaId: e.target.value })}>
                  <option value="">Elegí...</option>
                  {fechas.map((f) => <option key={f.id} value={f.id}>{fechaCorta(f.fecha)}</option>)}
                </Selector>
              </Campo>
              <Campo etiqueta="Hora">
                <Entrada type="time" value={nuevo.hora} onChange={(e) => setNuevo({ ...nuevo, hora: e.target.value })} />
              </Campo>
              <Boton
                variante="primario"
                disabled={ocupado || !nuevo.equipoLocalId || !nuevo.equipoVisitanteId || !nuevo.fechaCompetenciaId || !nuevo.hora}
                onClick={crear}
              >
                Crear partido
              </Boton>
            </div>
          )}
        </Tarjeta>
      )}

      <Tarjeta titulo={semana ? `Partidos de la semana ${semana.numeroSemana}` : "Partidos"}>
        <p className="text-xs text-white/50">
          Para que un partido sume puntos, cargá el resultado y pasalo a <strong className="text-white">Finalizado</strong>.
          Los puntos del DT se calculan solos con el resultado.
        </p>
        <Tabla columnas={["Día", "Hora", "Local", "Resultado", "Visitante", "Estado", ""]} filas={partidos.length} vacio="No hay partidos en esta semana.">
          {partidos.map((p) =>
            edicion?.id === p.id ? (
              <tr key={p.id} className="bg-[#FF5C00]/5">
                <Celda>
                  <Selector value={edicion.datos.fecha} onChange={(e) => setEdicion({ ...edicion, datos: { ...edicion.datos, fecha: e.target.value } })}>
                    {fechas.map((f) => <option key={f.id} value={f.fecha}>{fechaCorta(f.fecha)}</option>)}
                  </Selector>
                </Celda>
                <Celda>
                  <Entrada type="time" value={edicion.datos.hora} onChange={(e) => setEdicion({ ...edicion, datos: { ...edicion.datos, hora: e.target.value } })} />
                </Celda>
                <Celda className="font-bold text-white">{nombreEquipo(p.equipoLocalId)}</Celda>
                <Celda>
                  <div className="flex items-center gap-1">
                    <Entrada type="number" min={0} className="w-20" value={edicion.datos.puntosLocal ?? ""}
                      onChange={(e) => setEdicion({ ...edicion, datos: { ...edicion.datos, puntosLocal: numero(e.target.value) } })} />
                    <span>-</span>
                    <Entrada type="number" min={0} className="w-20" value={edicion.datos.puntosVisitante ?? ""}
                      onChange={(e) => setEdicion({ ...edicion, datos: { ...edicion.datos, puntosVisitante: numero(e.target.value) } })} />
                  </div>
                </Celda>
                <Celda className="font-bold text-white">{nombreEquipo(p.equipoVisitanteId)}</Celda>
                <Celda>
                  <Selector value={edicion.datos.estado} onChange={(e) => setEdicion({ ...edicion, datos: { ...edicion.datos, estado: e.target.value as EstadoPartido } })}>
                    {ESTADOS.map((s) => <option key={s.valor} value={s.valor}>{s.texto}</option>)}
                  </Selector>
                </Celda>
                <Celda className="text-right space-x-2">
                  <Boton chico variante="primario" disabled={ocupado} onClick={guardarEdicion}>Guardar</Boton>
                  <Boton chico onClick={() => setEdicion(null)}>Cancelar</Boton>
                </Celda>
              </tr>
            ) : (
              <tr key={p.id}>
                <Celda>{fechaCorta(p.fecha)}</Celda>
                <Celda>{p.hora?.slice(0, 5) ?? "-"}</Celda>
                <Celda className="font-bold text-white">{p.equipoLocal}</Celda>
                <Celda className="font-mono text-[#FF5C00]">
                  {p.puntosLocal !== null ? `${p.puntosLocal} - ${p.puntosVisitante}` : "-"}
                </Celda>
                <Celda className="font-bold text-white">{p.equipoVisitante}</Celda>
                <Celda>{ESTADOS.find((s) => s.valor === p.estado)?.texto ?? p.estado}</Celda>
                <Celda className="text-right space-x-2">
                  {!semana?.cerradaAt && (
                    <>
                      <Boton chico onClick={() => empezarEdicion(p)}>Resultado / editar</Boton>
                      <Boton
                        chico
                        variante="peligro"
                        onClick={() =>
                          confirmar(`¿Borrar ${p.equipoLocal} vs ${p.equipoVisitante}?`) &&
                          ejecutar(() => borrarPartido(p.id), "Partido borrado.", recargar)
                        }
                      >
                        Borrar
                      </Boton>
                    </>
                  )}
                </Celda>
              </tr>
            )
          )}
        </Tabla>
      </Tarjeta>
    </div>
  );
};
