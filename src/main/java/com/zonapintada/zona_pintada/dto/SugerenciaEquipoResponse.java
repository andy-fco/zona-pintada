package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;

import java.util.List;

public class SugerenciaEquipoResponse {

    private final Integer dtId;
    private final List<JugadorSugeridoResponse> jugadores;

    public SugerenciaEquipoResponse(
            Integer dtId,
            List<JugadorSugeridoResponse> jugadores
    ) {
        this.dtId = dtId;
        this.jugadores = jugadores;
    }

    public Integer getDtId() {
        return dtId;
    }

    public List<JugadorSugeridoResponse> getJugadores() {
        return jugadores;
    }

    public static class JugadorSugeridoResponse {

        private final Integer jugadorId;
        private final boolean titular;
        private final RolPlantelFantasy rol;

        public JugadorSugeridoResponse(
                Integer jugadorId,
                boolean titular,
                RolPlantelFantasy rol
        ) {
            this.jugadorId = jugadorId;
            this.titular = titular;
            this.rol = rol;
        }

        public Integer getJugadorId() {
            return jugadorId;
        }

        public boolean isTitular() {
            return titular;
        }

        public RolPlantelFantasy getRol() {
            return rol;
        }
    }
}
