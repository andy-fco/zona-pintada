
package com.zonapintada.zona_pintada.dto;

public class EquipoResponse {

    private final Integer id;
    private final String nombre;
    private final String nombreCorto;
    private final String ciudad;
    private final String escudoUrl;
    private final String estadio;

    public EquipoResponse(
            Integer id,
            String nombre,
            String nombreCorto,
            String ciudad,
            String escudoUrl,
            String estadio
    ) {
        this.id = id;
        this.nombre = nombre;
        this.nombreCorto = nombreCorto;
        this.ciudad = ciudad;
        this.escudoUrl = escudoUrl;
        this.estadio = estadio;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getNombreCorto() {
        return nombreCorto;
    }

    public String getCiudad() {
        return ciudad;
    }

    public String getEscudoUrl() {
        return escudoUrl;
    }

    public String getEstadio() {
        return estadio;
    }
}
