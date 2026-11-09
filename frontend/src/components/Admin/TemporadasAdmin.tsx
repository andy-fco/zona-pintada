import React, { useEffect, useState } from "react";
import { SemanaCompetenciaResponse } from "../../api/lnbApi";
import {
  TemporadaAdmin,
  TemporadaRequest,
  listarTemporadas,
  crearTemporada,
  editarTemporada,
  activarTemporada,
  borrarTemporada,
  listarSemanas,
  generarSemanas,
  borrarSemana,
  cerrarSemana,
  recalcularSemana,
  listarFechas,
  generarFechas,
} from "../../api/adminApi";
import { Tarjeta, Boton, Campo, Entrada, Tabla, Celda, useAccion, confirmar, fechaCorta } from "./ui";

const FORM_VACIO: TemporadaRequest = { nombre: "", fechaInicio: "", fechaFin: "" };

export const TemporadasAdmin: React.FC = () => {
  const [temporadas, setTemporadas] = useState<TemporadaAdmin[]>([]);
  const [semanas, setSemanas] = useState<SemanaCompetenciaResponse[]>([]);
  const [diasPorSemana, setDiasPorSemana] = useState<Record<number, number>>({});
  const [form, setForm] = useState<TemporadaRequest>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const { ejecutar, Aviso, ocupado } = useAccion();

  const activa = temporadas.find((t) => t.activa) ?? null;

  const recargar = async () => {
    const ts = await listarTemporadas().catch(() => [] as TemporadaAdmin[]);
    setTemporadas(ts);
    const act = ts.find((t) => t.activa);
    if (!act) {
      setSemanas([]);
      return;
    }
    const ss = await listarSemanas(act.id).catch(() => [] as SemanaCompetenciaResponse[]);
    setSemanas(ss);
    // Cuántos días (fechas de competencia) tiene cargados cada semana
    const conteos = await Promise.all(ss.map((s) => listarFechas(s.id).then((f) => f.length).catch(() => 0)));
    setDiasPorSemana(Object.fromEntries(ss.map((s, i) => [s.id, conteos[i]])));
  };

  useEffect(() => {
    recargar();
  }, []);

  const guardarTemporada = () => {
    const datos = { ...form, fechaFin: form.fechaFin || null };
    ejecutar(
      () => (editandoId ? editarTemporada(editandoId, datos) : crearTemporada(datos)),
      editandoId ? "Temporada actualizada." : "Temporada creada y activada.",
      () => {
        setForm(FORM_VACIO);
        setEditandoId(null);
        recargar();
      }
    );
  };

  const empezarEdicion = (t: TemporadaAdmin) => {
    setEditandoId(t.id);
    setForm({ nombre: t.nombre, fechaInicio: t.fechaInicio, fechaFin: t.fechaFin ?? "" });
  };

  const generarDiasDeTodas = () =>
    ejecutar(
      async () => {
        const pendientes = semanas.filter((s) => !diasPorSemana[s.id] && !s.cerradaAt);
        for (const s of pendientes) await generarFechas(s.id);
        return pendientes.length;
      },
      "Días generados en todas las semanas.",
      recargar
    );

  return (
    <div className="space-y-6">
      <Aviso />

      <Tarjeta titulo={editandoId ? "Editar temporada" : "Nueva temporada"}>
        <p className="text-xs text-white/50">
          Al crear una temporada queda como <strong className="text-white">activa</strong>. La fecha de fin es necesaria
          para generar las semanas, y no se puede cambiar una vez generadas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <Campo etiqueta="Nombre (ej: 2026/27)">
            <Entrada value={form.nombre} maxLength={20} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </Campo>
          <Campo etiqueta="Inicio">
            <Entrada type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
          </Campo>
          <Campo etiqueta="Fin">
            <Entrada type="date" value={form.fechaFin ?? ""} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} />
          </Campo>
          <div className="flex gap-2">
            <Boton variante="primario" disabled={ocupado || !form.nombre || !form.fechaInicio} onClick={guardarTemporada}>
              {editandoId ? "Guardar" : "Crear"}
            </Boton>
            {editandoId && (
              <Boton onClick={() => { setEditandoId(null); setForm(FORM_VACIO); }}>Cancelar</Boton>
            )}
          </div>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Temporadas">
        <Tabla columnas={["Nombre", "Inicio", "Fin", "Estado", ""]} filas={temporadas.length}>
          {temporadas.map((t) => (
            <tr key={t.id}>
              <Celda className="font-bold text-white">{t.nombre}</Celda>
              <Celda>{fechaCorta(t.fechaInicio)}</Celda>
              <Celda>{fechaCorta(t.fechaFin)}</Celda>
              <Celda>{t.activa ? <span className="text-[#FF5C00] font-bold">Activa</span> : "Inactiva"}</Celda>
              <Celda className="text-right space-x-2">
                <Boton chico onClick={() => empezarEdicion(t)}>Editar</Boton>
                {!t.activa && (
                  <Boton chico onClick={() => ejecutar(() => activarTemporada(t.id), "Temporada activada.", recargar)}>
                    Activar
                  </Boton>
                )}
                <Boton
                  chico
                  variante="peligro"
                  onClick={() =>
                    confirmar(`¿Borrar la temporada ${t.nombre}?`) &&
                    ejecutar(() => borrarTemporada(t.id), "Temporada borrada.", recargar)
                  }
                >
                  Borrar
                </Boton>
              </Celda>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>

      <Tarjeta
        titulo={activa ? `Semanas de ${activa.nombre}` : "Semanas"}
        acciones={
          activa && (
            <>
              <Boton
                variante="primario"
                disabled={ocupado}
                onClick={() => ejecutar(generarSemanas, "Semanas generadas.", recargar)}
              >
                Generar semanas
              </Boton>
              <Boton disabled={ocupado || semanas.length === 0} onClick={generarDiasDeTodas}>
                Generar días de todas
              </Boton>
            </>
          )
        }
      >
        {!activa ? (
          <p className="text-sm text-white/50">No hay temporada activa. Creá o activá una arriba.</p>
        ) : (
          <>
            <p className="text-xs text-white/50">
              Cada semana va de lunes a domingo. Para cargar partidos, la semana necesita sus <strong className="text-white">días</strong> generados.
              Al <strong className="text-white">cerrar</strong> una semana se calculan los puntos fantasy (no puede tener partidos sin terminar
              y la anterior tiene que estar cerrada).
            </p>
            <Tabla columnas={["Semana", "Desde", "Hasta", "Días", "Estado", ""]} filas={semanas.length} vacio="Todavía no hay semanas. Tocá «Generar semanas».">
              {semanas.map((s) => (
                <tr key={s.id}>
                  <Celda className="font-bold text-white">Semana {s.numeroSemana}</Celda>
                  <Celda>{fechaCorta(s.fechaInicio)}</Celda>
                  <Celda>{fechaCorta(s.fechaFin)}</Celda>
                  <Celda>{diasPorSemana[s.id] ?? 0}</Celda>
                  <Celda>{s.cerradaAt ? <span className="text-emerald-400 font-bold">Cerrada</span> : "Abierta"}</Celda>
                  <Celda className="text-right space-x-2">
                    {!diasPorSemana[s.id] && !s.cerradaAt && (
                      <Boton chico onClick={() => ejecutar(() => generarFechas(s.id), "Días generados.", recargar)}>
                        Generar días
                      </Boton>
                    )}
                    {s.cerradaAt ? (
                      <Boton chico onClick={() => ejecutar(() => recalcularSemana(s.id), "Puntos recalculados.", recargar)}>
                        Recalcular
                      </Boton>
                    ) : (
                      <Boton
                        chico
                        variante="primario"
                        onClick={() =>
                          confirmar(`¿Cerrar la semana ${s.numeroSemana}? Se calculan los puntos y ya no se puede modificar.`) &&
                          ejecutar(() => cerrarSemana(s.id), "Semana cerrada y puntos calculados.", recargar)
                        }
                      >
                        Cerrar
                      </Boton>
                    )}
                    {!s.cerradaAt && (
                      <Boton
                        chico
                        variante="peligro"
                        onClick={() =>
                          confirmar(`¿Borrar la semana ${s.numeroSemana}?`) &&
                          ejecutar(() => borrarSemana(s.id), "Semana borrada.", recargar)
                        }
                      >
                        Borrar
                      </Boton>
                    )}
                  </Celda>
                </tr>
              ))}
            </Tabla>
          </>
        )}
      </Tarjeta>
    </div>
  );
};
