
package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.SemanaCompetencia;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class SemanaCompetenciaResponse {

    private Integer id;
    private Integer temporadaId;
    private Integer numeroSemana;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private OffsetDateTime createdAt;

    public SemanaCompetenciaResponse() {
    }

    public SemanaCompetenciaResponse(
            Integer id,
            Integer temporadaId,
            Integer numeroSemana,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            OffsetDateTime createdAt) {
        this.id = id;
        this.temporadaId = temporadaId;
        this.numeroSemana = numeroSemana;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static SemanaCompetenciaResponse desde(
            SemanaCompetencia semana) {
        return new SemanaCompetenciaResponse(
                semana.getId(),
                semana.getTemporada().getId(),
                semana.getNumeroSemana(),
                semana.getFechaInicio(),
                semana.getFechaFin(),
                semana.getCreatedAt()
        );
    }
}
