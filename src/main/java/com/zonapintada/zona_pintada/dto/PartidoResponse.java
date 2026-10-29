package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.Partido;
import com.zonapintada.zona_pintada.enums.EstadoPartido;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public class PartidoResponse {

    private Integer id;
    private Integer equipoLocalId;
    private String equipoLocal;
    private Integer equipoVisitanteId;
    private String equipoVisitante;
    private Integer fechaCompetenciaId;
    private LocalDate fecha;
    private LocalTime hora;
    private Integer puntosLocal;
    private Integer puntosVisitante;
    private EstadoPartido estado;
    private Instant createdAt;
    private Instant updatedAt;

    public static PartidoResponse desde(Partido partido) {
        PartidoResponse response = new PartidoResponse();
        response.id = partido.getId();
        response.equipoLocalId = partido.getEquipoLocal().getId();
        response.equipoLocal = partido.getEquipoLocal().getNombre();
        response.equipoVisitanteId = partido.getEquipoVisitante().getId();
        response.equipoVisitante = partido.getEquipoVisitante().getNombre();
        response.fechaCompetenciaId = partido.getFechaCompetencia().getId();
        response.fecha = partido.getFecha();
        response.hora = partido.getHora();
        response.puntosLocal = partido.getPuntosLocal();
        response.puntosVisitante = partido.getPuntosVisitante();
        response.estado = partido.getEstado();
        response.createdAt = partido.getCreatedAt();
        response.updatedAt = partido.getUpdatedAt();
        return response;
    }

    public Integer getId() {
        return id;
    }

    public Integer getEquipoLocalId() {
        return equipoLocalId;
    }

    public String getEquipoLocal() {
        return equipoLocal;
    }

    public Integer getEquipoVisitanteId() {
        return equipoVisitanteId;
    }

    public String getEquipoVisitante() {
        return equipoVisitante;
    }

    public Integer getFechaCompetenciaId() {
        return fechaCompetenciaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public Integer getPuntosLocal() {
        return puntosLocal;
    }

    public Integer getPuntosVisitante() {
        return puntosVisitante;
    }

    public EstadoPartido getEstado() {
        return estado;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}