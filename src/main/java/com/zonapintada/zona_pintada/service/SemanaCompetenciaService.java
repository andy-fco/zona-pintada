
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.SemanaCompetenciaRequest;
import com.zonapintada.zona_pintada.dto.SemanaCompetenciaResponse;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.entity.Temporada;
import com.zonapintada.zona_pintada.repository.FechaRepository;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class SemanaCompetenciaService {

    private static final ZoneId ZONA_LIGA =
            ZoneId.of("America/Argentina/Buenos_Aires");

    private final SemanaCompetenciaRepository semanaRepository;
    private final TemporadaRepository temporadaRepository;
    private final FechaRepository fechaRepository;

    public SemanaCompetenciaService(
            SemanaCompetenciaRepository semanaRepository,
            TemporadaRepository temporadaRepository,
            FechaRepository fechaRepository) {
        this.semanaRepository = semanaRepository;
        this.temporadaRepository = temporadaRepository;
        this.fechaRepository = fechaRepository;
    }

    @Transactional(readOnly = true)
    public List<SemanaCompetenciaResponse> listar(Integer temporadaId) {

        Integer id = temporadaId != null
                ? temporadaId
                : obtenerTemporadaActiva().getId();

        return semanaRepository
                .findAllByTemporada_IdOrderByNumeroSemanaAsc(id)
                .stream()
                .map(SemanaCompetenciaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public SemanaCompetenciaResponse obtenerPorId(Integer id) {
        return SemanaCompetenciaResponse.desde(buscarSemana(id));
    }

    @Transactional(readOnly = true)
    public SemanaCompetenciaResponse obtenerActual() {
        LocalDate hoy = LocalDate.now(ZONA_LIGA);

        SemanaCompetencia semana = semanaRepository
                .findByTemporada_IdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        obtenerTemporadaActiva().getId(),
                        hoy,
                        hoy)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una semana de competencia en curso"
                ));

        return SemanaCompetenciaResponse.desde(semana);
    }



    @Transactional
    public SemanaCompetenciaResponse crear(SemanaCompetenciaRequest request) {
        Temporada temporada = buscarTemporada(request.getTemporadaId());
        validarInicioEnLunes(request.getFechaInicio());

        if (semanaRepository.existsByTemporada_IdAndNumeroSemana(
                temporada.getId(), request.getNumeroSemana())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La temporada ya tiene una semana con ese número"
            );
        }

        if (semanaRepository.existsByTemporada_IdAndFechaInicio(
                temporada.getId(), request.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La temporada ya tiene una semana que inicia en esa fecha"
            );
        }

        SemanaCompetencia semana = new SemanaCompetencia(
                temporada,
                request.getNumeroSemana(),
                request.getFechaInicio(),
                request.getFechaInicio().plusDays(6)
        );

        return SemanaCompetenciaResponse.desde(semanaRepository.save(semana));
    }

    @Transactional
    public SemanaCompetenciaResponse actualizar(
            Integer id,
            SemanaCompetenciaRequest request) {

        SemanaCompetencia semana = buscarSemana(id);
        Temporada temporada = buscarTemporada(request.getTemporadaId());
        validarInicioEnLunes(request.getFechaInicio());

        if (semanaRepository.existsByTemporada_IdAndNumeroSemanaAndIdNot(
                temporada.getId(), request.getNumeroSemana(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La temporada ya tiene una semana con ese número"
            );
        }

        if (semanaRepository.existsByTemporada_IdAndFechaInicioAndIdNot(
                temporada.getId(), request.getFechaInicio(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La temporada ya tiene una semana que inicia en esa fecha"
            );
        }

        boolean cambiaUbicacion =
                !semana.getFechaInicio().equals(request.getFechaInicio())
                        || !semana.getTemporada().getId().equals(temporada.getId());

        if (cambiaUbicacion && fechaRepository.existsBySemana_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede mover una semana que ya tiene fechas cargadas"
            );
        }

        semana.setTemporada(temporada);
        semana.setNumeroSemana(request.getNumeroSemana());
        semana.setFechaInicio(request.getFechaInicio());
        semana.setFechaFin(request.getFechaInicio().plusDays(6));

        return SemanaCompetenciaResponse.desde(semanaRepository.save(semana));
    }

    @Transactional
    public void eliminar(Integer id) {
        semanaRepository.delete(buscarSemana(id));
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

    private void validarInicioEnLunes(LocalDate fechaInicio) {
        if (fechaInicio.getDayOfWeek() != DayOfWeek.MONDAY) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La semana debe iniciar un lunes"
            );
        }
    }

    private Temporada buscarTemporada(Integer id) {
        return temporadaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la temporada indicada"
                ));
    }

    private SemanaCompetencia buscarSemana(Integer id) {
        return semanaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada"
                ));
    }

    private Temporada obtenerTemporadaActiva() {
        return temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa"
                ));
    }
}
