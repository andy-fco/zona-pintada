package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "equipo_fantasy_dt")
public class EquipoFantasyDT {

    @Id
    @Column(name = "equipo_fantasy_id")
    private Integer equipoFantasyId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_fantasy_id", nullable = false)
    private EquipoFantasy equipoFantasy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dt_id", nullable = false)
    private DT dt;

    public EquipoFantasyDT() {
    }

    public Integer getEquipoFantasyId() {
        return equipoFantasyId;
    }

    public EquipoFantasy getEquipoFantasy() {
        return equipoFantasy;
    }

    public void setEquipoFantasy(EquipoFantasy equipoFantasy) {
        this.equipoFantasy = equipoFantasy;
    }

    public DT getDt() {
        return dt;
    }

    public void setDt(DT dt) {
        this.dt = dt;
    }
}