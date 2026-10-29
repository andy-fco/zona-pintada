package com.zonapintada.zona_pintada.entity;

import java.io.Serializable;
import java.util.Objects;

public class DTPartidoId implements Serializable {

    private Integer dt;
    private Integer partido;

    public DTPartidoId() {
    }

    public DTPartidoId(Integer dt, Integer partido) {
        this.dt = dt;
        this.partido = partido;
    }

    public Integer getDt() {
        return dt;
    }

    public Integer getPartido() {
        return partido;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DTPartidoId that)) return false;
        return Objects.equals(dt, that.dt)
                && Objects.equals(partido, that.partido);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dt, partido);
    }
}