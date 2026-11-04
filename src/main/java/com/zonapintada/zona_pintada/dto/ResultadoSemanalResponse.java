package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.EquipoFantasyResultadoSemanal;

public class ResultadoSemanalResponse {

    private final Integer semanaId;
    private final Integer numeroSemana;
    private final Integer puntosSemana;
    private final Integer puntosAcumulados;

    public ResultadoSemanalResponse(
            Integer semanaId,
            Integer numeroSemana,
            Integer puntosSemana,
            Integer puntosAcumulados
    ) {
        this.semanaId = semanaId;
        this.numeroSemana = numeroSemana;
        this.puntosSemana = puntosSemana;
        this.puntosAcumulados = puntosAcumulados;
    }

    public Integer getSemanaId() {
        return semanaId;
    }

    public Integer getNumeroSemana() {
        return numeroSemana;
    }

    public Integer getPuntosSemana() {
        return puntosSemana;
    }

    public Integer getPuntosAcumulados() {
        return puntosAcumulados;
    }

    public static ResultadoSemanalResponse desde(EquipoFantasyResultadoSemanal resultado) {
        return new ResultadoSemanalResponse(
                resultado.getSemana().getId(),
                resultado.getSemana().getNumeroSemana(),
                resultado.getPuntosSemana(),
                resultado.getPuntosAcumulados()
        );
    }
}