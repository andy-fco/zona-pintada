package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class SemanaCompetenciaRequest {

    @NotNull(message = "La temporada es obligatoria")
    @Positive(message = "El ID de la temporada debe ser positivo")
    private Integer temporadaId;

    @NotNull(message = "El número de semana es obligatorio")
    @Positive(message = "El número de semana debe ser positivo")
    private Integer numeroSemana;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    public Integer getTemporadaId() {
        return temporadaId;
    }

    public void setTemporadaId(Integer temporadaId) {
        this.temporadaId = temporadaId;
    }

    public Integer getNumeroSemana() {
        return numeroSemana;
    }

    public void setNumeroSemana(Integer numeroSemana) {
        this.numeroSemana = numeroSemana;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
}