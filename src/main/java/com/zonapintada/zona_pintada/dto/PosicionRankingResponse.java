package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.EquipoFantasy;

public class PosicionRankingResponse {

    private final Integer posicion;
    private final Integer equipoFantasyId;
    private final String nombreEquipo;
    private final Integer usuarioId;
    private final String usuario;
    private final Integer puntos;

    public PosicionRankingResponse(
            Integer posicion,
            Integer equipoFantasyId,
            String nombreEquipo,
            Integer usuarioId,
            String usuario,
            Integer puntos
    ) {
        this.posicion = posicion;
        this.equipoFantasyId = equipoFantasyId;
        this.nombreEquipo = nombreEquipo;
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.puntos = puntos;
    }

    public Integer getPosicion() {
        return posicion;
    }

    public Integer getEquipoFantasyId() {
        return equipoFantasyId;
    }

    public String getNombreEquipo() {
        return nombreEquipo;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public String getUsuario() {
        return usuario;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public static PosicionRankingResponse desde(
            Integer posicion,
            EquipoFantasy equipo,
            Integer puntos
    ) {
        return new PosicionRankingResponse(
                posicion,
                equipo.getId(),
                equipo.getNombre(),
                equipo.getUsuario().getId(),
                equipo.getUsuario().getUsuario(),
                puntos
        );
    }
}