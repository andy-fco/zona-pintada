package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.entity.JugadorPartido;
import java.math.BigDecimal;

public class JugadorPartidoResponse {

    private Integer jugadorId;
    private String jugadorNombre;
    private Integer partidoId;
    private Integer equipoId;
    private String equipoNombre;
    private Boolean titular;
    private Integer puntos;
    private Integer doblesConvertidos;
    private Integer doblesIntentados;
    private Integer triplesConvertidos;
    private Integer triplesIntentados;
    private Integer libresConvertidos;
    private Integer libresIntentados;
    private Integer rebotesOfensivos;
    private Integer rebotesDefensivos;
    private Integer asistencias;
    private Integer recuperos;
    private Integer perdidas;
    private Integer tapones;
    private Integer taponesRecibidos;
    private Integer faltasPersonales;
    private Integer faltasRecibidas;
    private Integer masMenos;
    private Integer valoracion;
    private BigDecimal puntosFantasy;

    public static JugadorPartidoResponse desde(JugadorPartido jp) {
        JugadorPartidoResponse dto = new JugadorPartidoResponse();
        dto.jugadorId = jp.getJugador().getId();
        dto.jugadorNombre = jp.getJugador().getNombre() + " " + jp.getJugador().getApellido();
        dto.partidoId = jp.getPartido().getId();
        dto.equipoId = jp.getEquipo().getId();
        dto.equipoNombre = jp.getEquipo().getNombre();
        dto.titular = jp.getTitular();
        dto.puntos = jp.getPuntos();
        dto.doblesConvertidos = jp.getDoblesConvertidos();
        dto.doblesIntentados = jp.getDoblesIntentados();
        dto.triplesConvertidos = jp.getTriplesConvertidos();
        dto.triplesIntentados = jp.getTriplesIntentados();
        dto.libresConvertidos = jp.getLibresConvertidos();
        dto.libresIntentados = jp.getLibresIntentados();
        dto.rebotesOfensivos = jp.getRebotesOfensivos();
        dto.rebotesDefensivos = jp.getRebotesDefensivos();
        dto.asistencias = jp.getAsistencias();
        dto.recuperos = jp.getRecuperos();
        dto.perdidas = jp.getPerdidas();
        dto.tapones = jp.getTapones();
        dto.taponesRecibidos = jp.getTaponesRecibidos();
        dto.faltasPersonales = jp.getFaltasPersonales();
        dto.faltasRecibidas = jp.getFaltasRecibidas();
        dto.masMenos = jp.getMasMenos();
        dto.valoracion = jp.getValoracion();
        dto.puntosFantasy = jp.getPuntosFantasy();
        return dto;
    }

    public Integer getJugadorId() { return jugadorId; }
    public String getJugadorNombre() { return jugadorNombre; }
    public Integer getPartidoId() { return partidoId; }
    public Integer getEquipoId() { return equipoId; }
    public String getEquipoNombre() { return equipoNombre; }
    public Boolean getTitular() { return titular; }
    public Integer getPuntos() { return puntos; }
    public Integer getDoblesConvertidos() { return doblesConvertidos; }
    public Integer getDoblesIntentados() { return doblesIntentados; }
    public Integer getTriplesConvertidos() { return triplesConvertidos; }
    public Integer getTriplesIntentados() { return triplesIntentados; }
    public Integer getLibresConvertidos() { return libresConvertidos; }
    public Integer getLibresIntentados() { return libresIntentados; }
    public Integer getRebotesOfensivos() { return rebotesOfensivos; }
    public Integer getRebotesDefensivos() { return rebotesDefensivos; }
    public Integer getAsistencias() { return asistencias; }
    public Integer getRecuperos() { return recuperos; }
    public Integer getPerdidas() { return perdidas; }
    public Integer getTapones() { return tapones; }
    public Integer getTaponesRecibidos() { return taponesRecibidos; }
    public Integer getFaltasPersonales() { return faltasPersonales; }
    public Integer getFaltasRecibidas() { return faltasRecibidas; }
    public Integer getMasMenos() { return masMenos; }
    public Integer getValoracion() { return valoracion; }
    public BigDecimal getPuntosFantasy() { return puntosFantasy; }
}