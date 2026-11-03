package com.zonapintada.zona_pintada.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CrearEquipoFantasyRequest {

    @NotBlank(message = "El nombre del equipo es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotNull(message = "El ID del DT es obligatorio.")
    @Positive(message = "El ID del DT debe ser positivo.")
    private Integer dtId;

    @NotEmpty(message = "El plantel debe contener 10 jugadores.")
    @Size(min = 10, max = 10, message = "El plantel debe contener exactamente 10 jugadores.")
    @Valid
    private List<JugadorFantasyRequest> jugadores;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getDtId() {
        return dtId;
    }

    public void setDtId(Integer dtId) {
        this.dtId = dtId;
    }

    public List<JugadorFantasyRequest> getJugadores() {
        return jugadores;
    }

    public void setJugadores(List<JugadorFantasyRequest> jugadores) {
        this.jugadores = jugadores;
    }

    public static class JugadorFantasyRequest {

        @NotNull(message = "El ID del jugador es obligatorio.")
        @Positive(message = "El ID del jugador debe ser positivo.")
        private Integer jugadorId;

        @NotNull(message = "Debe indicarse si el jugador es titular.")
        private Boolean titular;

        @NotNull(message = "El rol del jugador es obligatorio.")
        private com.zonapintada.zona_pintada.enums.RolPlantelFantasy rol;

        public Integer getJugadorId() {
            return jugadorId;
        }

        public void setJugadorId(Integer jugadorId) {
            this.jugadorId = jugadorId;
        }

        public Boolean getTitular() {
            return titular;
        }

        public void setTitular(Boolean titular) {
            this.titular = titular;
        }

        public com.zonapintada.zona_pintada.enums.RolPlantelFantasy getRol() {
            return rol;
        }

        public void setRol(com.zonapintada.zona_pintada.enums.RolPlantelFantasy rol) {
            this.rol = rol;
        }
    }
}