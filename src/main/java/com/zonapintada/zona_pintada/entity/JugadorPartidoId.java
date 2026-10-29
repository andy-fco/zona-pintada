package com.zonapintada.zona_pintada.entity;

import java.io.Serializable;
import java.util.Objects;

public class JugadorPartidoId implements Serializable {

    private Integer jugador;
    private Integer partido;

    public JugadorPartidoId() {
    }

    public JugadorPartidoId(Integer jugador, Integer partido) {
        this.jugador = jugador;
        this.partido = partido;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof JugadorPartidoId that)) return false;
        return Objects.equals(jugador, that.jugador)
                && Objects.equals(partido, that.partido);
    }

    @Override
    public int hashCode() {
        return Objects.hash(jugador, partido);
    }
}