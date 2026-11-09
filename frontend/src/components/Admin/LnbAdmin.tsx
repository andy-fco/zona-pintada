import React, { useEffect, useState } from "react";
import { EquipoResponse, JugadorResponse, DTResponse } from "../../api/lnbApi";
import {
  EquipoRequest,
  JugadorRequest,
  DTRequest,
  listarEquipos,
  crearEquipo,
  editarEquipo,
  borrarEquipo,
  listarJugadores,
  crearJugador,
  editarJugador,
  borrarJugador,
  listarDts,
  crearDt,
  editarDt,
  borrarDt,
} from "../../api/adminApi";
import { Tarjeta, Boton, Campo, Entrada, Selector, Tabla, Celda, useAccion, confirmar } from "./ui";

type Seccion = "equipos" | "jugadores" | "dts";

const POSICIONES = [
  { valor: "base", texto: "Base" },
  { valor: "escolta", texto: "Escolta" },
  { valor: "alero", texto: "Alero" },
  { valor: "ala-pivot", texto: "Ala-Pívot" },
  { valor: "pivot", texto: "Pívot" },
];

const EQUIPO_VACIO: EquipoRequest = { nombre: "", nombreCorto: "", ciudad: "", escudoUrl: null, estadio: "" };
const JUGADOR_VACIO = {
  nombre: "", apellido: "", posicion: "base", valor: "", equipoId: "",
  altura: "", manoHabil: "", pais: "", ciudad: "", fechaNacimiento: "",
};
const DT_VACIO = { nombre: "", apellido: "", valor: "", equipoId: "", pais: "", ciudad: "", fechaNacimiento: "" };

const textoONull = (v: string) => (v.trim() === "" ? null : v.trim());

export const LnbAdmin: React.FC = () => {
  const [seccion, setSeccion] = useState<Seccion>("jugadores");
  const [equipos, setEquipos] = useState<EquipoResponse[]>([]);
  const [jugadores, setJugadores] = useState<JugadorResponse[]>([]);
  const [dts, setDts] = useState<DTResponse[]>([]);
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEquipo, setFormEquipo] = useState<EquipoRequest>(EQUIPO_VACIO);
  const [formJugador, setFormJugador] = useState(JUGADOR_VACIO);
  const [formDt, setFormDt] = useState(DT_VACIO);
  const { ejecutar, Aviso, ocupado } = useAccion();

  const recargar = () => {
    listarEquipos().then(setEquipos).catch(() => setEquipos([]));
    listarJugadores().then(setJugadores).catch(() => setJugadores([]));
    listarDts().then(setDts).catch(() => setDts([]));
  };

  useEffect(recargar, []);

  const limpiar = () => {
    setEditandoId(null);
    setFormEquipo(EQUIPO_VACIO);
    setFormJugador(JUGADOR_VACIO);
    setFormDt(DT_VACIO);
  };

  const cambiarSeccion = (s: Seccion) => {
    limpiar();
    setSeccion(s);
  };

  const alTerminar = () => {
    limpiar();
    recargar();
  };

  // ----- Guardar -----
  const guardarEquipo = () => {
    const d = { ...formEquipo, escudoUrl: textoONull(formEquipo.escudoUrl ?? "") };
    ejecutar(() => (editandoId ? editarEquipo(editandoId, d) : crearEquipo(d)), "Equipo guardado.", alTerminar);
  };

  const guardarJugador = () => {
    const f = formJugador;
    const d: JugadorRequest = {
      nombre: f.nombre.trim(),
      apellido: f.apellido.trim(),
      fotoUrl: null,
      fechaNacimiento: textoONull(f.fechaNacimiento),
      ciudad: textoONull(f.ciudad),
      altura: f.altura ? Number(f.altura) : null,
      posicion: f.posicion,
      manoHabil: textoONull(f.manoHabil),
      pais: textoONull(f.pais),
      valor: Number(f.valor),
      equipoId: Number(f.equipoId),
    };
    ejecutar(() => (editandoId ? editarJugador(editandoId, d) : crearJugador(d)), "Jugador guardado.", alTerminar);
  };

  const guardarDt = () => {
    const f = formDt;
    const d: DTRequest = {
      nombre: f.nombre.trim(),
      apellido: f.apellido.trim(),
      fotoUrl: null,
      fechaNacimiento: textoONull(f.fechaNacimiento),
      ciudad: textoONull(f.ciudad),
      pais: textoONull(f.pais),
      valor: Number(f.valor),
      equipoId: Number(f.equipoId),
    };
    ejecutar(() => (editandoId ? editarDt(editandoId, d) : crearDt(d)), "DT guardado.", alTerminar);
  };

  // ----- Editar -----
  const editarFilaEquipo = (e: EquipoResponse) => {
    setEditandoId(e.id);
    setFormEquipo({ nombre: e.nombre, nombreCorto: e.nombreCorto, ciudad: e.ciudad, escudoUrl: e.escudoUrl, estadio: e.estadio });
  };
  const editarFilaJugador = (j: JugadorResponse) => {
    setEditandoId(j.id);
    setFormJugador({
      nombre: j.nombre, apellido: j.apellido, posicion: j.posicion.toLowerCase().replace("_", "-"),
      valor: String(j.valor), equipoId: String(j.equipoId), altura: j.altura ? String(j.altura) : "",
      manoHabil: j.manoHabil?.toLowerCase() ?? "", pais: j.pais ?? "", ciudad: j.ciudad ?? "",
      fechaNacimiento: j.fechaNacimiento ?? "",
    });
  };
  const editarFilaDt = (d: DTResponse) => {
    setEditandoId(d.id);
    setFormDt({
      nombre: d.nombre, apellido: d.apellido, valor: String(d.valor), equipoId: String(d.equipoId),
      pais: d.pais ?? "", ciudad: d.ciudad ?? "", fechaNacimiento: d.fechaNacimiento ?? "",
    });
  };

  const selectorEquipo = (valor: string, onChange: (v: string) => void) => (
    <Selector value={valor} onChange={(e) => onChange(e.target.value)}>
      <option value="">Elegí...</option>
      {equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
    </Selector>
  );

  const botonesForm = (guardar: () => void, valido: boolean) => (
    <div className="flex gap-2">
      <Boton variante="primario" disabled={ocupado || !valido} onClick={guardar}>
        {editandoId ? "Guardar cambios" : "Crear"}
      </Boton>
      {editandoId && <Boton onClick={limpiar}>Cancelar</Boton>}
    </div>
  );

  const jugadoresFiltrados = filtroEquipo ? jugadores.filter((j) => String(j.equipoId) === filtroEquipo) : jugadores;
  const dtsFiltrados = filtroEquipo ? dts.filter((d) => String(d.equipoId) === filtroEquipo) : dts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["jugadores", "dts", "equipos"] as Seccion[]).map((s) => (
          <Boton key={s} variante={seccion === s ? "primario" : "secundario"} onClick={() => cambiarSeccion(s)}>
            {s === "dts" ? "DTs" : s === "equipos" ? "Equipos" : "Jugadores"}
          </Boton>
        ))}
      </div>
      <Aviso />

      {seccion === "equipos" && (
        <>
          <Tarjeta titulo={editandoId ? "Editar equipo" : "Nuevo equipo"}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <Campo etiqueta="Nombre"><Entrada value={formEquipo.nombre} onChange={(e) => setFormEquipo({ ...formEquipo, nombre: e.target.value })} /></Campo>
              <Campo etiqueta="Nombre corto"><Entrada value={formEquipo.nombreCorto} maxLength={30} onChange={(e) => setFormEquipo({ ...formEquipo, nombreCorto: e.target.value })} /></Campo>
              <Campo etiqueta="Ciudad"><Entrada value={formEquipo.ciudad} onChange={(e) => setFormEquipo({ ...formEquipo, ciudad: e.target.value })} /></Campo>
              <Campo etiqueta="Estadio"><Entrada value={formEquipo.estadio} onChange={(e) => setFormEquipo({ ...formEquipo, estadio: e.target.value })} /></Campo>
              <Campo etiqueta="URL del escudo (opcional)"><Entrada value={formEquipo.escudoUrl ?? ""} onChange={(e) => setFormEquipo({ ...formEquipo, escudoUrl: e.target.value })} /></Campo>
              {botonesForm(guardarEquipo, !!(formEquipo.nombre && formEquipo.nombreCorto && formEquipo.ciudad && formEquipo.estadio))}
            </div>
          </Tarjeta>
          <Tarjeta titulo={`Equipos (${equipos.length})`}>
            <Tabla columnas={["Nombre", "Corto", "Ciudad", "Estadio", ""]} filas={equipos.length}>
              {equipos.map((e) => (
                <tr key={e.id}>
                  <Celda className="font-bold text-white">{e.nombre}</Celda>
                  <Celda>{e.nombreCorto}</Celda>
                  <Celda>{e.ciudad}</Celda>
                  <Celda>{e.estadio}</Celda>
                  <Celda className="text-right space-x-2">
                    <Boton chico onClick={() => editarFilaEquipo(e)}>Editar</Boton>
                    <Boton chico variante="peligro" onClick={() => confirmar(`¿Borrar ${e.nombre}?`) && ejecutar(() => borrarEquipo(e.id), "Equipo borrado.", recargar)}>Borrar</Boton>
                  </Celda>
                </tr>
              ))}
            </Tabla>
          </Tarjeta>
        </>
      )}

      {seccion === "jugadores" && (
        <>
          <Tarjeta titulo={editandoId ? "Editar jugador" : "Nuevo jugador"}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <Campo etiqueta="Nombre"><Entrada value={formJugador.nombre} onChange={(e) => setFormJugador({ ...formJugador, nombre: e.target.value })} /></Campo>
              <Campo etiqueta="Apellido"><Entrada value={formJugador.apellido} onChange={(e) => setFormJugador({ ...formJugador, apellido: e.target.value })} /></Campo>
              <Campo etiqueta="Posición">
                <Selector value={formJugador.posicion} onChange={(e) => setFormJugador({ ...formJugador, posicion: e.target.value })}>
                  {POSICIONES.map((p) => <option key={p.valor} value={p.valor}>{p.texto}</option>)}
                </Selector>
              </Campo>
              <Campo etiqueta="Equipo">{selectorEquipo(formJugador.equipoId, (v) => setFormJugador({ ...formJugador, equipoId: v }))}</Campo>
              <Campo etiqueta="Valor (millones, ej: 9.5)"><Entrada type="number" step="0.01" min={0} value={formJugador.valor} onChange={(e) => setFormJugador({ ...formJugador, valor: e.target.value })} /></Campo>
              <Campo etiqueta="Altura (m, ej: 1.98)"><Entrada type="number" step="0.01" min={0} value={formJugador.altura} onChange={(e) => setFormJugador({ ...formJugador, altura: e.target.value })} /></Campo>
              <Campo etiqueta="Mano hábil">
                <Selector value={formJugador.manoHabil} onChange={(e) => setFormJugador({ ...formJugador, manoHabil: e.target.value })}>
                  <option value="">-</option>
                  <option value="derecha">Derecha</option>
                  <option value="izquierda">Izquierda</option>
                </Selector>
              </Campo>
              <Campo etiqueta="País"><Entrada value={formJugador.pais} onChange={(e) => setFormJugador({ ...formJugador, pais: e.target.value })} /></Campo>
              <Campo etiqueta="Ciudad"><Entrada value={formJugador.ciudad} onChange={(e) => setFormJugador({ ...formJugador, ciudad: e.target.value })} /></Campo>
              <Campo etiqueta="Nacimiento"><Entrada type="date" value={formJugador.fechaNacimiento} onChange={(e) => setFormJugador({ ...formJugador, fechaNacimiento: e.target.value })} /></Campo>
              {botonesForm(guardarJugador, !!(formJugador.nombre && formJugador.apellido && formJugador.equipoId && formJugador.valor !== ""))}
            </div>
          </Tarjeta>
          <Tarjeta
            titulo={`Jugadores (${jugadoresFiltrados.length})`}
            acciones={
              <Selector value={filtroEquipo} onChange={(e) => setFiltroEquipo(e.target.value)} className="sm:w-56">
                <option value="">Todos los equipos</option>
                {equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </Selector>
            }
          >
            <Tabla columnas={["Jugador", "Posición", "Equipo", "Valor", ""]} filas={jugadoresFiltrados.length}>
              {jugadoresFiltrados.map((j) => (
                <tr key={j.id}>
                  <Celda className="font-bold text-white">{j.apellido}, {j.nombre}</Celda>
                  <Celda>{POSICIONES.find((p) => p.valor === j.posicion.toLowerCase().replace("_", "-"))?.texto ?? j.posicion}</Celda>
                  <Celda>{j.equipoNombre}</Celda>
                  <Celda className="font-mono">${Number(j.valor).toFixed(2)}M</Celda>
                  <Celda className="text-right space-x-2">
                    <Boton chico onClick={() => editarFilaJugador(j)}>Editar</Boton>
                    <Boton chico variante="peligro" onClick={() => confirmar(`¿Borrar a ${j.nombre} ${j.apellido}?`) && ejecutar(() => borrarJugador(j.id), "Jugador borrado.", recargar)}>Borrar</Boton>
                  </Celda>
                </tr>
              ))}
            </Tabla>
          </Tarjeta>
        </>
      )}

      {seccion === "dts" && (
        <>
          <Tarjeta titulo={editandoId ? "Editar DT" : "Nuevo DT"}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <Campo etiqueta="Nombre"><Entrada value={formDt.nombre} onChange={(e) => setFormDt({ ...formDt, nombre: e.target.value })} /></Campo>
              <Campo etiqueta="Apellido"><Entrada value={formDt.apellido} onChange={(e) => setFormDt({ ...formDt, apellido: e.target.value })} /></Campo>
              <Campo etiqueta="Equipo">{selectorEquipo(formDt.equipoId, (v) => setFormDt({ ...formDt, equipoId: v }))}</Campo>
              <Campo etiqueta="Valor (millones)"><Entrada type="number" step="0.01" min={0} value={formDt.valor} onChange={(e) => setFormDt({ ...formDt, valor: e.target.value })} /></Campo>
              <Campo etiqueta="País"><Entrada value={formDt.pais} onChange={(e) => setFormDt({ ...formDt, pais: e.target.value })} /></Campo>
              <Campo etiqueta="Ciudad"><Entrada value={formDt.ciudad} onChange={(e) => setFormDt({ ...formDt, ciudad: e.target.value })} /></Campo>
              <Campo etiqueta="Nacimiento"><Entrada type="date" value={formDt.fechaNacimiento} onChange={(e) => setFormDt({ ...formDt, fechaNacimiento: e.target.value })} /></Campo>
              {botonesForm(guardarDt, !!(formDt.nombre && formDt.apellido && formDt.equipoId && formDt.valor !== ""))}
            </div>
          </Tarjeta>
          <Tarjeta
            titulo={`DTs (${dtsFiltrados.length})`}
            acciones={
              <Selector value={filtroEquipo} onChange={(e) => setFiltroEquipo(e.target.value)} className="sm:w-56">
                <option value="">Todos los equipos</option>
                {equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </Selector>
            }
          >
            <Tabla columnas={["DT", "Equipo", "Valor", ""]} filas={dtsFiltrados.length}>
              {dtsFiltrados.map((d) => (
                <tr key={d.id}>
                  <Celda className="font-bold text-white">{d.apellido}, {d.nombre}</Celda>
                  <Celda>{d.equipoNombre}</Celda>
                  <Celda className="font-mono">${Number(d.valor).toFixed(2)}M</Celda>
                  <Celda className="text-right space-x-2">
                    <Boton chico onClick={() => editarFilaDt(d)}>Editar</Boton>
                    <Boton chico variante="peligro" onClick={() => confirmar(`¿Borrar a ${d.nombre} ${d.apellido}?`) && ejecutar(() => borrarDt(d.id), "DT borrado.", recargar)}>Borrar</Boton>
                  </Celda>
                </tr>
              ))}
            </Tabla>
          </Tarjeta>
        </>
      )}
    </div>
  );
};
