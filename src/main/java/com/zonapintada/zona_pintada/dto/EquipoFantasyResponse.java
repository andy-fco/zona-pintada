package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;

import java.math.BigDecimal;
import java.util.List;

public class EquipoFantasyResponse {

    private final Integer id;
    private final String nombre;
    private final Integer usuarioId;
    private final String usuario;
    private final Integer temporadaId;
    private final String temporadaNombre;
    private final BigDecimal presupuestoMaximo;
    private final BigDecimal presupuestoUtilizado;
    private final BigDecimal presupuestoRestante;
    private final Integer tokensTraspaso;
    private final Integer puntosSemana;
    private final Integer puntosTotales;
    private final DTFantasyResponse dt;
    private final List<JugadorFantasyResponse> jugadores;

    public EquipoFantasyResponse(
            Integer id,
            String nombre,
            Integer usuarioId,
            String usuario,
            Integer temporadaId,
            String temporadaNombre,
            BigDecimal presupuestoMaximo,
            BigDecimal presupuestoUtilizado,
            BigDecimal presupuestoRestante,
            Integer tokensTraspaso,
            Integer puntosSemana,
            Integer puntosTotales,
            DTFantasyResponse dt,
            List<JugadorFantasyResponse> jugadores
    ) {
        this.id = id;
        this.nombre = nombre;
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.temporadaId = temporadaId;
        this.temporadaNombre = temporadaNombre;
        this.presupuestoMaximo = presupuestoMaximo;
        this.presupuestoUtilizado = presupuestoUtilizado;
        this.presupuestoRestante = presupuestoRestante;
        this.tokensTraspaso = tokensTraspaso;
        this.puntosSemana = puntosSemana;
        this.puntosTotales = puntosTotales;
        this.dt = dt;
        this.jugadores = jugadores;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public String getUsuario() {
        return usuario;
    }

    public BigDecimal getPresupuestoRestante() {
        return presupuestoRestante;
    }

    public Integer getTemporadaId() {
        return temporadaId;
    }

    public String getTemporadaNombre() {
        return temporadaNombre;
    }

    public BigDecimal getPresupuestoMaximo() {
        return presupuestoMaximo;
    }

    public BigDecimal getPresupuestoUtilizado() {
        return presupuestoUtilizado;
    }

    public Integer getTokensTraspaso() {
        return tokensTraspaso;
    }

    public Integer getPuntosSemana() {
        return puntosSemana;
    }

    public Integer getPuntosTotales() {
        return puntosTotales;
    }

    public DTFantasyResponse getDt() {
        return dt;
    }

    public List<JugadorFantasyResponse> getJugadores() {
        return jugadores;
    }

    public static class DTFantasyResponse {

        private final Integer id;
        private final String nombre;
        private final String apellido;
        private final BigDecimal valor;
        private final Integer equipoId;
        private final String equipoNombre;

        public DTFantasyResponse(
                Integer id,
                String nombre,
                String apellido,
                BigDecimal valor,
                Integer equipoId,
                String equipoNombre
        ) {
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.valor = valor;
            this.equipoId = equipoId;
            this.equipoNombre = equipoNombre;
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

        public BigDecimal getValor() {
            return valor;
        }

        public Integer getEquipoId() {
            return equipoId;
        }

        public String getEquipoNombre() {
            return equipoNombre;
        }
    }

    public static class JugadorFantasyResponse {

        private final Integer id;
        private final String nombre;
        private final String apellido;
        private final BigDecimal valor;
        private final Integer equipoId;
        private final String equipoNombre;
        private final boolean titular;
        private final RolPlantelFantasy rol;
        private final BigDecimal multiplicador;

        public JugadorFantasyResponse(
                Integer id,
                String nombre,
                String apellido,
                BigDecimal valor,
                Integer equipoId,
                String equipoNombre,
                boolean titular,
                RolPlantelFantasy rol,
                BigDecimal multiplicador
        ) {
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.valor = valor;
            this.equipoId = equipoId;
            this.equipoNombre = equipoNombre;
            this.titular = titular;
            this.rol = rol;
            this.multiplicador = multiplicador;
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

        public BigDecimal getValor() {
            return valor;
        }

        public Integer getEquipoId() {
            return equipoId;
        }

        public String getEquipoNombre() {
            return equipoNombre;
        }

        public boolean isTitular() {
            return titular;
        }

        public RolPlantelFantasy getRol() {
            return rol;
        }

        public BigDecimal getMultiplicador() {
            return multiplicador;
        }
    }
}