package com.zonapintada.zona_pintada.entity;

import java.io.Serializable;
import java.util.Objects;

public class EquipoFantasyJugadorId implements Serializable {

    private Integer equipoFantasy;
    private Integer jugador;

    public EquipoFantasyJugadorId() {
    }

    public EquipoFantasyJugadorId(Integer equipoFantasy, Integer jugador) {
        this.equipoFantasy = equipoFantasy;
        this.jugador = jugador;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EquipoFantasyJugadorId that)) return false;

        return Objects.equals(equipoFantasy, that.equipoFantasy)
                && Objects.equals(jugador, that.jugador);
    }

    @Override
    public int hashCode() {
        return Objects.hash(equipoFantasy, jugador);
    }
}