package com.zonapintada.zona_pintada.entity;

import java.io.Serializable;
import java.util.Objects;

public class EquipoFantasyDTHistorialId implements Serializable {

    private Integer equipoFantasy;
    private Integer semana;

    public EquipoFantasyDTHistorialId() {
    }

    public EquipoFantasyDTHistorialId(Integer equipoFantasy, Integer semana) {
        this.equipoFantasy = equipoFantasy;
        this.semana = semana;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EquipoFantasyDTHistorialId that)) return false;

        return Objects.equals(equipoFantasy, that.equipoFantasy)
                && Objects.equals(semana, that.semana);
    }

    @Override
    public int hashCode() {
        return Objects.hash(equipoFantasy, semana);
    }
}