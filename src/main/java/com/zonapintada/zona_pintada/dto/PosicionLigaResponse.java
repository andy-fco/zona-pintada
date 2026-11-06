package com.zonapintada.zona_pintada.dto;

public class PosicionLigaResponse {

    private final Integer posicion;
    private final Integer equipoId;
    private final String equipoNombre;
    private final String nombreCorto;
    private final String escudoUrl;
    private final Integer partidosJugados;
    private final Integer ganados;
    private final Integer perdidos;
    private final Integer puntosAFavor;
    private final Integer puntosEnContra;
    private final Integer diferencia;
    private final Integer puntos;

    public PosicionLigaResponse(
        Integer posicion,
        Integer equipoId,
        String equipoNombre,
        String nombreCorto,
        String escudoUrl,
        Integer partidosJugados,
        Integer ganados,
        Integer perdidos,
        Integer puntosAFavor,
        Integer puntosEnContra,
        Integer diferencia,
        Integer puntos
    ) {
        this.posicion = posicion;
        this.equipoId = equipoId;
        this.equipoNombre = equipoNombre;
        this.nombreCorto = nombreCorto;
        this.escudoUrl = escudoUrl;
        this.partidosJugados = partidosJugados;
        this.ganados = ganados;
        this.perdidos = perdidos;
        this.puntosAFavor = puntosAFavor;
        this.puntosEnContra = puntosEnContra;
        this.diferencia = diferencia;
        this.puntos = puntos;
    }

    public Integer getPosicion() {
        return posicion;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public String getEquipoNombre() {
        return equipoNombre;
    }

    public String getNombreCorto() {
        return nombreCorto;
    }

    public String getEscudoUrl() {
        return escudoUrl;
    }

    public Integer getPartidosJugados() {
        return partidosJugados;
    }

    public Integer getGanados() {
        return ganados;
    }

    public Integer getPerdidos() {
        return perdidos;
    }

    public Integer getPuntosAFavor() {
        return puntosAFavor;
    }

    public Integer getPuntosEnContra() {
        return puntosEnContra;
    }

    public Integer getDiferencia() {
        return diferencia;
    }

    public Integer getPuntos() {
        return puntos;
    }
}
