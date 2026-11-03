package com.zonapintada.zona_pintada.entity;

import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;

@Entity
@Table(name = "equipo_fantasy_jugador")
@IdClass(EquipoFantasyJugadorId.class)
public class EquipoFantasyJugador {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_fantasy_id", nullable = false)
    private EquipoFantasy equipoFantasy;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;

    @Column(nullable = false)
    private boolean titular;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "rol_plantel_fantasy")
    private RolPlantelFantasy rol;

    @Column(nullable = false)
    private BigDecimal multiplicador;

    public EquipoFantasyJugador() {
    }

    public EquipoFantasy getEquipoFantasy() {
        return equipoFantasy;
    }

    public void setEquipoFantasy(EquipoFantasy equipoFantasy) {
        this.equipoFantasy = equipoFantasy;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
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
}