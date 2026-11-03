
package com.zonapintada.zona_pintada.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.EnumeratedValue;

public enum PosicionJugador {
    BASE("base"),
    ESCOLTA("escolta"),
    ALERO("alero"),
    ALA_PIVOT("ala-pivot"),
    PIVOT("pivot");

    @EnumeratedValue
    private final String valor;

    PosicionJugador(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    public static PosicionJugador fromValor(String valor) {
        for (PosicionJugador posicion : values()) {
            if (posicion.valor.equals(valor)) {
                return posicion;
            }
        }

        throw new IllegalArgumentException(
                "Posición de jugador no reconocida: " + valor
        );
    }
}
