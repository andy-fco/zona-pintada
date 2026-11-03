package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class FechaRequest {

    @NotNull(message = "La fecha es obligatoria.")
    private LocalDate fecha;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}