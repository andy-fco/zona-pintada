package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public class CrearPartidoRequest {

    @NotNull
    @Positive
    private Integer equipoLocalId;

    @NotNull
    @Positive
    private Integer equipoVisitanteId;

    @NotNull
    @Positive
    private Integer fechaCompetenciaId;

    @NotNull
    private LocalDate fecha;

    @NotNull
    private LocalTime hora;

    public Integer getEquipoLocalId() {
        return equipoLocalId;
    }

    public void setEquipoLocalId(Integer equipoLocalId) {
        this.equipoLocalId = equipoLocalId;
    }

    public Integer getEquipoVisitanteId() {
        return equipoVisitanteId;
    }

    public void setEquipoVisitanteId(Integer equipoVisitanteId) {
        this.equipoVisitanteId = equipoVisitanteId;
    }

    public Integer getFechaCompetenciaId() {
        return fechaCompetenciaId;
    }

    public void setFechaCompetenciaId(Integer fechaCompetenciaId) {
        this.fechaCompetenciaId = fechaCompetenciaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }
}