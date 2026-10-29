package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "dt_partido")
@IdClass(DTPartidoId.class)
public class DTPartido {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dt_id", nullable = false)
    private DT dt;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "partido_id", nullable = false)
    private Partido partido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Column(name = "puntos_fantasy", nullable = false)
    private BigDecimal puntosFantasy;

    public DTPartido() {
    }

    public DT getDt() {
        return dt;
    }

    public void setDt(DT dt) {
        this.dt = dt;
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public BigDecimal getPuntosFantasy() {
        return puntosFantasy;
    }

    public void setPuntosFantasy(BigDecimal puntosFantasy) {
        this.puntosFantasy = puntosFantasy;
    }
}