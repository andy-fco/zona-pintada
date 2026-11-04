package com.zonapintada.zona_pintada.entity;

import java.io.Serializable;
import java.util.Objects;

public class EquipoFantasyJugadorHistorialId implements Serializable {

    private Integer equipoFantasy;
    private Integer semana;
    private Integer jugador;

    public EquipoFantasyJugadorHistorialId() {
    }

    public EquipoFantasyJugadorHistorialId(
            Integer equipoFantasy,
            Integer semana,
            Integer jugador
    ) {
        this.equipoFantasy = equipoFantasy;
        this.semana = semana;
        this.jugador = jugador;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EquipoFantasyJugadorHistorialId that)) return false;

        return Objects.equals(equipoFantasy, that.equipoFantasy)
                && Objects.equals(semana, that.semana)
                && Objects.equals(jugador, that.jugador);
    }

    @Override
    public int hashCode() {
        return Objects.hash(equipoFantasy, semana, jugador);
    }
}