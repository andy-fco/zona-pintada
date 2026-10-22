package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.Fecha;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class FechaResponse {

    private Integer id;
    private Integer semanaId;
    private LocalDate fecha;
    private OffsetDateTime createdAt;

    public FechaResponse() {
    }

    public FechaResponse(
            Integer id,
            Integer semanaId,
            LocalDate fecha,
            OffsetDateTime createdAt
    ) {
        this.id = id;
        this.semanaId = semanaId;
        this.fecha = fecha;
        this.createdAt = createdAt;
    }

    public static FechaResponse desde(Fecha fecha) {
        return new FechaResponse(
                fecha.getId(),
                fecha.getSemana().getId(),
                fecha.getFecha(),
                fecha.getCreatedAt()
        );
    }

    public Integer getId() {
        return id;
    }

    public Integer getSemanaId() {
        return semanaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}