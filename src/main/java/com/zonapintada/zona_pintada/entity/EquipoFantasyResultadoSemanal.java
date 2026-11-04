package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "equipo_fantasy_resultado_semanal")
@IdClass(EquipoFantasyResultadoSemanalId.class)
public class EquipoFantasyResultadoSemanal {

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

    @Column(name = "puntos_semana", nullable = false)
    private Integer puntosSemana;

    @Column(name = "puntos_acumulados", nullable = false)
    private Integer puntosAcumulados;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public EquipoFantasyResultadoSemanal() {
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

    public Integer getPuntosSemana() {
        return puntosSemana;
    }

    public void setPuntosSemana(Integer puntosSemana) {
        this.puntosSemana = puntosSemana;
    }

    public Integer getPuntosAcumulados() {
        return puntosAcumulados;
    }

    public void setPuntosAcumulados(Integer puntosAcumulados) {
        this.puntosAcumulados = puntosAcumulados;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}