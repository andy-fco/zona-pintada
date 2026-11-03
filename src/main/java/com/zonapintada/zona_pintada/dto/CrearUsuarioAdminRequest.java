package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.enums.RolUsuario;
import jakarta.validation.constraints.NotNull;

public class CrearUsuarioAdminRequest extends CrearUsuarioRequest {

    @NotNull
    private RolUsuario rol;

    public RolUsuario getRol() {
        return rol;
    }

    public void setRol(RolUsuario rol) {
        this.rol = rol;
    }
}