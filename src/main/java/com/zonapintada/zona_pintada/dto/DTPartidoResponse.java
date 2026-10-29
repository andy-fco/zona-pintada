package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.DTPartido;

import java.math.BigDecimal;

public class DTPartidoResponse {

    private Integer dtId;
    private String dtNombre;
    private String dtApellido;
    private Integer partidoId;
    private Integer equipoId;
    private String equipoNombre;
    private BigDecimal puntosFantasy;

    public DTPartidoResponse() {
    }

    public static DTPartidoResponse desde(DTPartido registro) {
        DTPartidoResponse response = new DTPartidoResponse();

        response.setDtId(registro.getDt().getId());
        response.setDtNombre(registro.getDt().getNombre());
        response.setDtApellido(registro.getDt().getApellido());
        response.setPartidoId(registro.getPartido().getId());
        response.setEquipoId(registro.getEquipo().getId());
        response.setEquipoNombre(registro.getEquipo().getNombre());
        response.setPuntosFantasy(registro.getPuntosFantasy());

        return response;
    }

    public Integer getDtId() {
        return dtId;
    }

    public void setDtId(Integer dtId) {
        this.dtId = dtId;
    }

    public String getDtNombre() {
        return dtNombre;
    }

    public void setDtNombre(String dtNombre) {
        this.dtNombre = dtNombre;
    }

    public String getDtApellido() {
        return dtApellido;
    }

    public void setDtApellido(String dtApellido) {
        this.dtApellido = dtApellido;
    }

    public Integer getPartidoId() {
        return partidoId;
    }

    public void setPartidoId(Integer partidoId) {
        this.partidoId = partidoId;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Integer equipoId) {
        this.equipoId = equipoId;
    }

    public String getEquipoNombre() {
        return equipoNombre;
    }

    public void setEquipoNombre(String equipoNombre) {
        this.equipoNombre = equipoNombre;
    }

    public BigDecimal getPuntosFantasy() {
        return puntosFantasy;
    }

    public void setPuntosFantasy(BigDecimal puntosFantasy) {
        this.puntosFantasy = puntosFantasy;
    }
}