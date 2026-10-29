package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "jugador_partido")
@IdClass(JugadorPartidoId.class)
public class JugadorPartido {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "partido_id", nullable = false)
    private Partido partido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @Column(nullable = false)
    private boolean titular;

    @Column(nullable = false)
    private Integer puntos;

    @Column(name = "dobles_convertidos", nullable = false)
    private Integer doblesConvertidos;

    @Column(name = "dobles_intentados", nullable = false)
    private Integer doblesIntentados;

    @Column(name = "triples_convertidos", nullable = false)
    private Integer triplesConvertidos;

    @Column(name = "triples_intentados", nullable = false)
    private Integer triplesIntentados;

    @Column(name = "libres_convertidos", nullable = false)
    private Integer libresConvertidos;

    @Column(name = "libres_intentados", nullable = false)
    private Integer libresIntentados;

    @Column(name = "rebotes_ofensivos", nullable = false)
    private Integer rebotesOfensivos;

    @Column(name = "rebotes_defensivos", nullable = false)
    private Integer rebotesDefensivos;

    @Column(nullable = false)
    private Integer asistencias;

    @Column(nullable = false)
    private Integer recuperos;

    @Column(nullable = false)
    private Integer perdidas;

    @Column(nullable = false)
    private Integer tapones;

    @Column(name = "tapones_recibidos", nullable = false)
    private Integer taponesRecibidos;

    @Column(name = "faltas_personales", nullable = false)
    private Integer faltasPersonales;

    @Column(name = "faltas_recibidas", nullable = false)
    private Integer faltasRecibidas;

    @Column(name = "mas_menos", nullable = false)
    private Integer masMenos;

    @Column(nullable = false)
    private Integer valoracion;

    @Column(name = "puntos_fantasy", nullable = false)
    private BigDecimal puntosFantasy;

    public JugadorPartido() {
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public boolean isTitular() {
        return titular;
    }

    public boolean getTitular() {
        return titular;
    }

    public void setTitular(boolean titular) {
        this.titular = titular;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    public Integer getDoblesConvertidos() {
        return doblesConvertidos;
    }

    public void setDoblesConvertidos(Integer value) {
        this.doblesConvertidos = value;
    }

    public Integer getDoblesIntentados() {
        return doblesIntentados;
    }

    public void setDoblesIntentados(Integer value) {
        this.doblesIntentados = value;
    }

    public Integer getTriplesConvertidos() {
        return triplesConvertidos;
    }

    public void setTriplesConvertidos(Integer value) {
        this.triplesConvertidos = value;
    }

    public Integer getTriplesIntentados() {
        return triplesIntentados;
    }

    public void setTriplesIntentados(Integer value) {
        this.triplesIntentados = value;
    }

    public Integer getLibresConvertidos() {
        return libresConvertidos;
    }

    public void setLibresConvertidos(Integer value) {
        this.libresConvertidos = value;
    }

    public Integer getLibresIntentados() {
        return libresIntentados;
    }

    public void setLibresIntentados(Integer value) {
        this.libresIntentados = value;
    }

    public Integer getRebotesOfensivos() {
        return rebotesOfensivos;
    }

    public void setRebotesOfensivos(Integer value) {
        this.rebotesOfensivos = value;
    }

    public Integer getRebotesDefensivos() {
        return rebotesDefensivos;
    }

    public void setRebotesDefensivos(Integer value) {
        this.rebotesDefensivos = value;
    }

    public Integer getAsistencias() {
        return asistencias;
    }

    public void setAsistencias(Integer asistencias) {
        this.asistencias = asistencias;
    }

    public Integer getRecuperos() {
        return recuperos;
    }

    public void setRecuperos(Integer recuperos) {
        this.recuperos = recuperos;
    }

    public Integer getPerdidas() {
        return perdidas;
    }

    public void setPerdidas(Integer perdidas) {
        this.perdidas = perdidas;
    }

    public Integer getTapones() {
        return tapones;
    }

    public void setTapones(Integer tapones) {
        this.tapones = tapones;
    }

    public Integer getTaponesRecibidos() {
        return taponesRecibidos;
    }

    public void setTaponesRecibidos(Integer value) {
        this.taponesRecibidos = value;
    }

    public Integer getFaltasPersonales() {
        return faltasPersonales;
    }

    public void setFaltasPersonales(Integer value) {
        this.faltasPersonales = value;
    }

    public Integer getFaltasRecibidas() {
        return faltasRecibidas;
    }

    public void setFaltasRecibidas(Integer value) {
        this.faltasRecibidas = value;
    }

    public Integer getMasMenos() {
        return masMenos;
    }

    public void setMasMenos(Integer masMenos) {
        this.masMenos = masMenos;
    }

    public Integer getValoracion() {
        return valoracion;
    }

    public void setValoracion(Integer valoracion) {
        this.valoracion = valoracion;
    }

    public BigDecimal getPuntosFantasy() {
        return puntosFantasy;
    }

    public void setPuntosFantasy(BigDecimal puntosFantasy) {
        this.puntosFantasy = puntosFantasy;
    }
}