
package com.zonapintada.zona_pintada.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.EnumeratedValue;

public enum ManoHabil {
    IZQUIERDA("izquierda"),
    DERECHA("derecha");

    @EnumeratedValue
    private final String valor;

    ManoHabil(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    public static ManoHabil fromValor(String valor) {
        for (ManoHabil mano : values()) {
            if (mano.valor.equals(valor)) {
                return mano;
            }
        }

        throw new IllegalArgumentException(
                "Mano hábil no reconocida: " + valor
        );
    }
}
