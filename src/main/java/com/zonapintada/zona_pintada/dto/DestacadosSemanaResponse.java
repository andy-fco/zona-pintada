package com.zonapintada.zona_pintada.dto;

import java.math.BigDecimal;
import java.util.List;

public class DestacadosSemanaResponse {

    private final Integer semanaId;
    private final Integer numeroSemana;
    private final JugadorDestacadoResponse mvp;
    private final List<JugadorDestacadoResponse> quintetoIdeal;
    private final List<JugadorDestacadoResponse> lideres;

    public DestacadosSemanaResponse(
        Integer semanaId,
        Integer numeroSemana,
        JugadorDestacadoResponse mvp,
        List<JugadorDestacadoResponse> quintetoIdeal,
        List<JugadorDestacadoResponse> lideres
    ) {
        this.semanaId = semanaId;
        this.numeroSemana = numeroSemana;
        this.mvp = mvp;
        this.quintetoIdeal = quintetoIdeal;
        this.lideres = lideres;
    }

    public Integer getSemanaId() {
        return semanaId;
    }

    public Integer getNumeroSemana() {
        return numeroSemana;
    }

    public JugadorDestacadoResponse getMvp() {
        return mvp;
    }

    public List<JugadorDestacadoResponse> getQuintetoIdeal() {
        return quintetoIdeal;
    }

    public List<JugadorDestacadoResponse> getLideres() {
        return lideres;
    }

    public static class JugadorDestacadoResponse {

        private final Integer jugadorId;
        private final String nombre;
        private final String apellido;
        private final String fotoUrl;
        private final String posicion;
        private final String equipoNombre;
        private final Integer partidosJugados;
        private final BigDecimal puntosFantasy;

        public JugadorDestacadoResponse(
            Integer jugadorId,
            String nombre,
            String apellido,
            String fotoUrl,
            String posicion,
            String equipoNombre,
            Integer partidosJugados,
            BigDecimal puntosFantasy
        ) {
            this.jugadorId = jugadorId;
            this.nombre = nombre;
            this.apellido = apellido;
            this.fotoUrl = fotoUrl;
            this.posicion = posicion;
            this.equipoNombre = equipoNombre;
            this.partidosJugados = partidosJugados;
            this.puntosFantasy = puntosFantasy;
        }

        public Integer getJugadorId() {
            return jugadorId;
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

        public String getPosicion() {
            return posicion;
        }

        public String getEquipoNombre() {
            return equipoNombre;
        }

        public Integer getPartidosJugados() {
            return partidosJugados;
        }

        public BigDecimal getPuntosFantasy() {
            return puntosFantasy;
        }
    }
}
