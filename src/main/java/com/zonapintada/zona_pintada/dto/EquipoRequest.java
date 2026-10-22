
package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EquipoRequest {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "El nombre corto es obligatorio.")
    @Size(max = 30, message = "El nombre corto no puede superar los 30 caracteres.")
    private String nombreCorto;

    @NotBlank(message = "La ciudad es obligatoria.")
    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres.")
    private String ciudad;

    @Size(max = 500, message = "La URL del escudo no puede superar los 500 caracteres.")
    private String escudoUrl;

    @NotBlank(message = "El estadio es obligatorio.")
    @Size(max = 150, message = "El estadio no puede superar los 150 caracteres.")
    private String estadio;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreCorto() {
        return nombreCorto;
    }

    public void setNombreCorto(String nombreCorto) {
        this.nombreCorto = nombreCorto;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getEscudoUrl() {
        return escudoUrl;
    }

    public void setEscudoUrl(String escudoUrl) {
        this.escudoUrl = escudoUrl;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }
}
