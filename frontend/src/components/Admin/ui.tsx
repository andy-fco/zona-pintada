import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

// Piezas visuales compartidas por las pestañas del panel de admin

export const Tarjeta: React.FC<{ titulo: string; acciones?: React.ReactNode; children: React.ReactNode }> = ({
  titulo,
  acciones,
  children,
}) => (
  <section className="bg-[#111111] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-black italic uppercase text-white">{titulo}</h3>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </div>
    {children}
  </section>
);

type Variante = "primario" | "secundario" | "peligro";

export const Boton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; chico?: boolean }
> = ({ variante = "secundario", chico, className = "", ...props }) => {
  const estilos: Record<Variante, string> = {
    primario: "bg-[#FF5C00] text-black hover:bg-white",
    secundario: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    peligro: "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
  };
  return (
    <button
      {...props}
      className={`${chico ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-2 text-xs"} font-bold uppercase rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
    />
  );
};

const claseInput =
  "w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF5C00]";

export const Campo: React.FC<{ etiqueta: string; children: React.ReactNode; className?: string }> = ({
  etiqueta,
  children,
  className = "",
}) => (
  <label className={`block space-y-1 ${className}`}>
    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">{etiqueta}</span>
    {children}
  </label>
);

export const Entrada: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input {...props} className={`${claseInput} ${className}`} />
);

export const Selector: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", ...props }) => (
  <select {...props} className={`${claseInput} ${className}`} />
);

export const Tabla: React.FC<{ columnas: string[]; children: React.ReactNode; vacio?: string; filas: number }> = ({
  columnas,
  children,
  vacio = "No hay datos cargados.",
  filas,
}) => (
  <div className="overflow-x-auto border border-white/10 rounded-xl">
    <table className="w-full text-sm">
      <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/40">
        <tr>
          {columnas.map((c) => (
            <th key={c} className="text-left font-bold px-3 py-2.5 whitespace-nowrap">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5 text-white/80">
        {filas === 0 ? (
          <tr>
            <td colSpan={columnas.length} className="px-3 py-6 text-center text-white/40">
              {vacio}
            </td>
          </tr>
        ) : (
          children
        )}
      </tbody>
    </table>
  </div>
);

export const Celda: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = "", ...props }) => (
  <td {...props} className={`px-3 py-2 whitespace-nowrap ${className}`} />
);

/**
 * Ejecuta acciones contra el back mostrando "cargando", el error del back o un mensaje de éxito.
 * Uso: const { ejecutar, Aviso, ocupado } = useAccion();
 *      ejecutar(() => crearPartido(...), "Partido creado", recargar)
 */
export function useAccion() {
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const ejecutar = async <T,>(accion: () => Promise<T>, exito?: string, despues?: (r: T) => void) => {
    setOcupado(true);
    setAviso(null);
    try {
      const resultado = await accion();
      if (exito) setAviso({ tipo: "ok", texto: exito });
      despues?.(resultado);
      return true;
    } catch (err) {
      setAviso({ tipo: "error", texto: err instanceof Error ? err.message : "Ocurrió un error." });
      return false;
    } finally {
      setOcupado(false);
    }
  };

  const Aviso = () =>
    ocupado ? (
      <div className="flex items-center gap-2 text-xs text-white/50">
        <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
      </div>
    ) : aviso ? (
      <div
        className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${
          aviso.tipo === "ok"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-red-500/10 border-red-500/30 text-red-300"
        }`}
      >
        {aviso.tipo === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
        <span>{aviso.texto}</span>
      </div>
    ) : null;

  return { ejecutar, Aviso, ocupado };
}

/** Pide confirmación antes de una acción que no se puede deshacer */
export const confirmar = (texto: string) => window.confirm(texto);

/** "2026-11-08" -> "08/11/2026" */
export const fechaCorta = (fecha: string | null | undefined) =>
  fecha ? fecha.split("-").reverse().join("/") : "-";
