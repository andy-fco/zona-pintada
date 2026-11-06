package com.zonapintada.zona_pintada.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PuntosSemanaEquipoResponse(
        Integer semanaId,
        Integer numeroSemana,
        boolean cerrada,
        Integer puntosEquipo,
        List<IntegranteResponse> jugadores,
        IntegranteResponse dt
) {

    public record IntegranteResponse(
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
    }

    public record PartidoPuntosResponse(
            Integer partidoId,
            LocalDate fecha,
            String rival,
            BigDecimal puntosFantasy,
            BigDecimal puntosAportados
    ) {
    }
}
