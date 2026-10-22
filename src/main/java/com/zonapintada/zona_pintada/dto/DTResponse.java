
package com.zonapintada.zona_pintada.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class DTResponse {

    private final Integer id;
    private final String nombre;
    private final String apellido;
    private final String fotoUrl;
    private final LocalDate fechaNacimiento;
    private final String ciudad;
    private final String pais;
    private final BigDecimal valor;
    private final Integer equipoId;
    private final String equipoNombre;
    private final Instant createdAt;
    private final Instant updatedAt;

    public DTResponse(
            Integer id,
            String nombre,
            String apellido,
            String fotoUrl,
            LocalDate fechaNacimiento,
            String ciudad,
            String pais,
            BigDecimal valor,
            Integer equipoId,
            String equipoNombre,
            Instant createdAt,
            Instant updatedAt
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fotoUrl = fotoUrl;
        this.fechaNacimiento = fechaNacimiento;
        this.ciudad = ciudad;
        this.pais = pais;
        this.valor = valor;
        this.equipoId = equipoId;
        this.equipoNombre = equipoNombre;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public String getCiudad() {
        return ciudad;
    }

    public String getPais() {
        return pais;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public String getEquipoNombre() {
        return equipoNombre;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
