
package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.Temporada;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class TemporadaResponse {

    private Integer id;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private boolean activa;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public TemporadaResponse() {
    }

    public TemporadaResponse(
            Integer id,
            String nombre,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            boolean activa,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt) {
        this.id = id;
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.activa = activa;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static TemporadaResponse desde(Temporada temporada) {
        return new TemporadaResponse(
                temporada.getId(),
                temporada.getNombre(),
                temporada.getFechaInicio(),
                temporada.getFechaFin(),
                temporada.isActiva(),
                temporada.getCreatedAt(),
                temporada.getUpdatedAt()
        );
    }
}
