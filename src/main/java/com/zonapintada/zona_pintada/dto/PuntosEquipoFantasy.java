package com.zonapintada.zona_pintada.dto;

public class PuntosEquipoFantasy {

    private final Integer puntosSemana;
    private final Integer puntosTotales;

    public PuntosEquipoFantasy(Integer puntosSemana, Integer puntosTotales) {
        this.puntosSemana = puntosSemana;
        this.puntosTotales = puntosTotales;
    }

    public Integer getPuntosSemana() {
        return puntosSemana;
    }

    public Integer getPuntosTotales() {
        return puntosTotales;
    }
}