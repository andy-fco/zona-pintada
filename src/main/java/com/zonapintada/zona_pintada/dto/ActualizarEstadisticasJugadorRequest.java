package com.zonapintada.zona_pintada.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ActualizarEstadisticasJugadorRequest {

    @NotNull private Boolean titular;
    @NotNull @PositiveOrZero private Integer puntos;
    @NotNull @PositiveOrZero private Integer doblesConvertidos;
    @NotNull @PositiveOrZero private Integer doblesIntentados;
    @NotNull @PositiveOrZero private Integer triplesConvertidos;
    @NotNull @PositiveOrZero private Integer triplesIntentados;
    @NotNull @PositiveOrZero private Integer libresConvertidos;
    @NotNull @PositiveOrZero private Integer libresIntentados;
    @NotNull @PositiveOrZero private Integer rebotesOfensivos;
    @NotNull @PositiveOrZero private Integer rebotesDefensivos;
    @NotNull @PositiveOrZero private Integer asistencias;
    @NotNull @PositiveOrZero private Integer recuperos;
    @NotNull @PositiveOrZero private Integer perdidas;
    @NotNull @PositiveOrZero private Integer tapones;
    @NotNull @PositiveOrZero private Integer taponesRecibidos;
    @NotNull @PositiveOrZero private Integer faltasPersonales;
    @NotNull @PositiveOrZero private Integer faltasRecibidas;
    @NotNull private Integer masMenos;
    @NotNull private Integer valoracion;

    public Boolean getTitular() { return titular; }
    public void setTitular(Boolean titular) { this.titular = titular; }
    public Integer getPuntos() { return puntos; }
    public void setPuntos(Integer v) { this.puntos = v; }
    public Integer getDoblesConvertidos() { return doblesConvertidos; }
    public void setDoblesConvertidos(Integer v) { this.doblesConvertidos = v; }
    public Integer getDoblesIntentados() { return doblesIntentados; }
    public void setDoblesIntentados(Integer v) { this.doblesIntentados = v; }
    public Integer getTriplesConvertidos() { return triplesConvertidos; }
    public void setTriplesConvertidos(Integer v) { this.triplesConvertidos = v; }
    public Integer getTriplesIntentados() { return triplesIntentados; }
    public void setTriplesIntentados(Integer v) { this.triplesIntentados = v; }
    public Integer getLibresConvertidos() { return libresConvertidos; }
    public void setLibresConvertidos(Integer v) { this.libresConvertidos = v; }
    public Integer getLibresIntentados() { return libresIntentados; }
    public void setLibresIntentados(Integer v) { this.libresIntentados = v; }
    public Integer getRebotesOfensivos() { return rebotesOfensivos; }
    public void setRebotesOfensivos(Integer v) { this.rebotesOfensivos = v; }
    public Integer getRebotesDefensivos() { return rebotesDefensivos; }
    public void setRebotesDefensivos(Integer v) { this.rebotesDefensivos = v; }
    public Integer getAsistencias() { return asistencias; }
    public void setAsistencias(Integer v) { this.asistencias = v; }
    public Integer getRecuperos() { return recuperos; }
    public void setRecuperos(Integer v) { this.recuperos = v; }
    public Integer getPerdidas() { return perdidas; }
    public void setPerdidas(Integer v) { this.perdidas = v; }
    public Integer getTapones() { return tapones; }
    public void setTapones(Integer v) { this.tapones = v; }
    public Integer getTaponesRecibidos() { return taponesRecibidos; }
    public void setTaponesRecibidos(Integer v) { this.taponesRecibidos = v; }
    public Integer getFaltasPersonales() { return faltasPersonales; }
    public void setFaltasPersonales(Integer v) { this.faltasPersonales = v; }
    public Integer getFaltasRecibidas() { return faltasRecibidas; }
    public void setFaltasRecibidas(Integer v) { this.faltasRecibidas = v; }
    public Integer getMasMenos() { return masMenos; }
    public void setMasMenos(Integer v) { this.masMenos = v; }
    public Integer getValoracion() { return valoracion; }
    public void setValoracion(Integer v) { this.valoracion = v; }
}