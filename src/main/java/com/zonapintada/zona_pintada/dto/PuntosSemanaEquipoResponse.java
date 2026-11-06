package com.zonapintada.zona_pintada.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PuntosSemanaEquipoResponse {

    private final Integer semanaId;
    private final Integer numeroSemana;
    private final boolean cerrada;
    private final Integer puntosEquipo;
    private final List<IntegranteResponse> jugadores;
    private final IntegranteResponse dt;

    public PuntosSemanaEquipoResponse(
        Integer semanaId,
        Integer numeroSemana,
        boolean cerrada,
        Integer puntosEquipo,
        List<IntegranteResponse> jugadores,
        IntegranteResponse dt
    ) {
        this.semanaId = semanaId;
        this.numeroSemana = numeroSemana;
        this.cerrada = cerrada;
        this.puntosEquipo = puntosEquipo;
        this.jugadores = jugadores;
        this.dt = dt;
    }

    public Integer getSemanaId() {
        return semanaId;
    }

    public Integer getNumeroSemana() {
        return numeroSemana;
    }

    public boolean isCerrada() {
        return cerrada;
    }

    public Integer getPuntosEquipo() {
        return puntosEquipo;
    }

    public List<IntegranteResponse> getJugadores() {
        return jugadores;
    }

    public IntegranteResponse getDt() {
        return dt;
    }

    public static class IntegranteResponse {

        private final Integer id;
        private final String nombre;
        private final String apellido;
        private final String posicion;
        private final String equipoNombre;
        private final Boolean titular;
        private final String rol;
        private final BigDecimal multiplicador;
        private final BigDecimal puntosSemana;
        private final List<PartidoPuntosResponse> partidos;

        public IntegranteResponse(
            Integer id,
            String nombre,
            String apellido,
            String posicion,
            String equipoNombre,
            Boolean titular,
            String rol,
            BigDecimal multiplicador,
            BigDecimal puntosSemana,
            List<PartidoPuntosResponse> partidos
        ) {
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.posicion = posicion;
            this.equipoNombre = equipoNombre;
            this.titular = titular;
            this.rol = rol;
            this.multiplicador = multiplicador;
            this.puntosSemana = puntosSemana;
            this.partidos = partidos;
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

        public String getPosicion() {
            return posicion;
        }

        public String getEquipoNombre() {
            return equipoNombre;
        }

        public Boolean getTitular() {
            return titular;
        }

        public String getRol() {
            return rol;
        }

        public BigDecimal getMultiplicador() {
            return multiplicador;
        }

        public BigDecimal getPuntosSemana() {
            return puntosSemana;
        }

        public List<PartidoPuntosResponse> getPartidos() {
            return partidos;
        }
    }

    public static class PartidoPuntosResponse {

        private final Integer partidoId;
        private final LocalDate fecha;
        private final String rival;
        private final BigDecimal puntosFantasy;
        private final BigDecimal puntosAportados;

        public PartidoPuntosResponse(
            Integer partidoId,
            LocalDate fecha,
            String rival,
            BigDecimal puntosFantasy,
            BigDecimal puntosAportados
        ) {
            this.partidoId = partidoId;
            this.fecha = fecha;
            this.rival = rival;
            this.puntosFantasy = puntosFantasy;
            this.puntosAportados = puntosAportados;
        }

        public Integer getPartidoId() {
            return partidoId;
        }

        public LocalDate getFecha() {
            return fecha;
        }

        public String getRival() {
            return rival;
        }

        public BigDecimal getPuntosFantasy() {
            return puntosFantasy;
        }

        public BigDecimal getPuntosAportados() {
            return puntosAportados;
        }
    }
}
