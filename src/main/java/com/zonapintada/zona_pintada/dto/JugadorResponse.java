
package com.zonapintada.zona_pintada.dto;

import com.zonapintada.zona_pintada.enums.ManoHabil;
import com.zonapintada.zona_pintada.enums.PosicionJugador;

import java.math.BigDecimal;
import java.time.LocalDate;

public class JugadorResponse {

    private final Integer id;
    private final String nombre;
    private final String apellido;
    private final String fotoUrl;
    private final LocalDate fechaNacimiento;
    private final String ciudad;
    private final BigDecimal altura;
    private final PosicionJugador posicion;
    private final ManoHabil manoHabil;
    private final String pais;
    private final BigDecimal valor;
    private final Integer equipoId;
    private final String equipoNombre;

    public JugadorResponse(
            Integer id,
            String nombre,
            String apellido,
            String fotoUrl,
            LocalDate fechaNacimiento,
            String ciudad,
            BigDecimal altura,
            PosicionJugador posicion,
            ManoHabil manoHabil,
            String pais,
            BigDecimal valor,
            Integer equipoId,
            String equipoNombre
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fotoUrl = fotoUrl;
        this.fechaNacimiento = fechaNacimiento;
        this.ciudad = ciudad;
        this.altura = altura;
        this.posicion = posicion;
        this.manoHabil = manoHabil;
        this.pais = pais;
        this.valor = valor;
        this.equipoId = equipoId;
        this.equipoNombre = equipoNombre;
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

    public String getFotoUrl() {
        return fotoUrl;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public String getCiudad() {
        return ciudad;
    }

    public BigDecimal getAltura() {
        return altura;
    }

    public PosicionJugador getPosicion() {
        return posicion;
    }

    public ManoHabil getManoHabil() {
        return manoHabil;
    }

    public String getPais() {
        return pais;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public String getEquipoNombre() {
        return equipoNombre;
    }
}
