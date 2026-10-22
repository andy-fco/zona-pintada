
package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "El usuario o correo electrónico es obligatorio.")
    private String identificador;

    @NotBlank(message = "La contraseña es obligatoria.")
    private String password;

    public LoginRequest() {
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
