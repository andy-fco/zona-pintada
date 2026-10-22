package com.zonapintada.zona_pintada.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "fecha")
public class Fecha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "semana_id", nullable = false)
    private SemanaCompetencia semana;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Fecha() {
    }

    public Fecha(SemanaCompetencia semana, LocalDate fecha) {
        this.semana = semana;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public SemanaCompetencia getSemana() {
        return semana;
    }

    public void setSemana(SemanaCompetencia semana) {
        this.semana = semana;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}