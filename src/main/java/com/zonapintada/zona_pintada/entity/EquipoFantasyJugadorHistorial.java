package com.zonapintada.zona_pintada.entity;

import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;

@Entity
@Table(name = "equipo_fantasy_jugador_historial")
@IdClass(EquipoFantasyJugadorHistorialId.class)
public class EquipoFantasyJugadorHistorial {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_fantasy_id", nullable = false)
    private EquipoFantasy equipoFantasy;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "semana_id", nullable = false)
    private SemanaCompetencia semana;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "temporada_id", nullable = false)
    private Temporada temporada;

    @Column(nullable = false)
    private boolean titular;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "rol_plantel_fantasy")
    private RolPlantelFantasy rol;

    @Column(nullable = false)
    private BigDecimal multiplicador;

    @Column(nullable = false)
    private BigDecimal valor;

    public EquipoFantasyJugadorHistorial() {
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

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public Temporada getTemporada() {
        return temporada;
    }

    public void setTemporada(Temporada temporada) {
        this.temporada = temporada;
    }

    public boolean isTitular() {
        return titular;
    }

    public void setTitular(boolean titular) {
        this.titular = titular;
    }

    public RolPlantelFantasy getRol() {
        return rol;
    }

    public void setRol(RolPlantelFantasy rol) {
        this.rol = rol;
    }

    public BigDecimal getMultiplicador() {
        return multiplicador;
    }

    public void setMultiplicador(BigDecimal multiplicador) {
        this.multiplicador = multiplicador;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}