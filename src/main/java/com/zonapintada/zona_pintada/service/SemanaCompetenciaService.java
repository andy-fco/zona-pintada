
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.SemanaCompetenciaResponse;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.entity.Temporada;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class SemanaCompetenciaService {

    private final SemanaCompetenciaRepository semanaRepository;
    private final TemporadaRepository temporadaRepository;

    public SemanaCompetenciaService(
            SemanaCompetenciaRepository semanaRepository,
            TemporadaRepository temporadaRepository) {
        this.semanaRepository = semanaRepository;
        this.temporadaRepository = temporadaRepository;
    }

    @Transactional(readOnly = true)
    public List<SemanaCompetenciaResponse> listarDeTemporadaActiva() {

        Temporada temporada = obtenerTemporadaActiva();

        return semanaRepository
                .findAllByTemporada_IdOrderByNumeroSemanaAsc(
                        temporada.getId())
                .stream()
                .map(SemanaCompetenciaResponse::desde)
                .toList();
    }

    @Transactional
    public List<SemanaCompetenciaResponse> generarDeTemporadaActiva() {

        Temporada temporada = obtenerTemporadaActiva();

        LocalDate fechaInicio = temporada.getFechaInicio();
        LocalDate fechaFin = temporada.getFechaFin();

        if (fechaFin == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La temporada activa debe tener fecha de fin para generar sus semanas"
            );
        }

        if (fechaFin.isBefore(fechaInicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }

        LocalDate inicioSemana = fechaInicio.with(
                TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)
        );

        int numeroSemana = 1;

        while (!inicioSemana.isAfter(fechaFin)) {

            if (!semanaRepository
                    .existsByTemporada_IdAndNumeroSemana(
                            temporada.getId(),
                            numeroSemana)) {

                LocalDate finSemana = inicioSemana.plusDays(6);

                SemanaCompetencia semana = new SemanaCompetencia(
                        temporada,
                        numeroSemana,
                        inicioSemana,
                        finSemana
                );

                semanaRepository.save(semana);
            }

            inicioSemana = inicioSemana.plusWeeks(1);
            numeroSemana++;
        }

        return semanaRepository
                .findAllByTemporada_IdOrderByNumeroSemanaAsc(
                        temporada.getId())
                .stream()
                .map(SemanaCompetenciaResponse::desde)
                .toList();
    }

    private Temporada obtenerTemporadaActiva() {
        return temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa"
                ));
    }
}
