package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "equipo_fantasy_dt_historial")
@IdClass(EquipoFantasyDTHistorialId.class)
public class EquipoFantasyDTHistorial {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_fantasy_id", nullable = false)
    private EquipoFantasy equipoFantasy;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "semana_id", nullable = false)
    private SemanaCompetencia semana;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "temporada_id", nullable = false)
    private Temporada temporada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dt_id", nullable = false)
    private DT dt;

    @Column(nullable = false)
    private BigDecimal valor;

    public EquipoFantasyDTHistorial() {
    }

    public EquipoFantasy getEquipoFantasy() {
        return equipoFantasy;
    }

    public void setEquipoFantasy(EquipoFantasy equipoFantasy) {
        this.equipoFantasy = equipoFantasy;
    }

    public SemanaCompetencia getSemana() {
        return semana;
    }

    public void setSemana(SemanaCompetencia semana) {
        this.semana = semana;
    }

    public Temporada getTemporada() {
        return temporada;
    }

    public void setTemporada(Temporada temporada) {
        this.temporada = temporada;
    }

    public DT getDt() {
        return dt;
    }

    public void setDt(DT dt) {
        this.dt = dt;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}