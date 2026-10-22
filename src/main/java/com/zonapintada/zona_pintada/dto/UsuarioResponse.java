package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.enums.RolUsuario;

public class UsuarioResponse {

    private final Integer id;
    private final String nombre;
    private final String apellido;
    private final String mail;
    private final String usuario;
    private final RolUsuario rol;

    public UsuarioResponse(
            Integer id,
            String nombre,
            String apellido,
            String mail,
            String usuario,
            RolUsuario rol
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.usuario = usuario;
        this.rol = rol;
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

    public String getMail() {
        return mail;
    }

    public String getUsuario() {
        return usuario;
    }

    public RolUsuario getRol() {
        return rol;
    }
}