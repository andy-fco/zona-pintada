
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.ActualizarTemporadaRequest;
import com.zonapintada.zona_pintada.dto.CrearTemporadaRequest;
import com.zonapintada.zona_pintada.dto.TemporadaResponse;
import com.zonapintada.zona_pintada.entity.Temporada;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class TemporadaService {

    private final TemporadaRepository temporadaRepository;
    private final SemanaCompetenciaRepository semanaRepository;

    public TemporadaService(
            TemporadaRepository temporadaRepository,
            SemanaCompetenciaRepository semanaRepository) {
        this.temporadaRepository = temporadaRepository;
        this.semanaRepository = semanaRepository;
    }

    @Transactional(readOnly = true)
    public TemporadaResponse obtenerPorId(Integer id) {
        return TemporadaResponse.desde(buscarTemporada(id));
    }

    @Transactional(readOnly = true)
    public List<TemporadaResponse> listarTodas() {
        return temporadaRepository
                .findAllByOrderByFechaInicioDesc()
                .stream()
                .map(TemporadaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public TemporadaResponse obtenerActiva() {
        Temporada temporada = temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa"
                ));

        return TemporadaResponse.desde(temporada);
    }

    @Transactional
    public TemporadaResponse crearYActivar(
            CrearTemporadaRequest request) {

        if (request.getFechaFin() != null
                && request.getFechaFin()
                .isBefore(request.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }

        if (temporadaRepository.existsByNombre(request.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una temporada con ese nombre"
            );
        }

        temporadaRepository.findByActivaTrue().ifPresent(temporadaActiva -> {
            temporadaActiva.setActiva(false);
            temporadaRepository.saveAndFlush(temporadaActiva);
        });

        Temporada nuevaTemporada = new Temporada(
                request.getNombre(),
                request.getFechaInicio(),
                request.getFechaFin(),
                true
        );

        Temporada temporadaGuardada =
                temporadaRepository.save(nuevaTemporada);

        return TemporadaResponse.desde(temporadaGuardada);
    }

    @Transactional
    public TemporadaResponse actualizar(
            Integer id,
            ActualizarTemporadaRequest request) {

        Temporada temporada = buscarTemporada(id);

        if (request.getFechaFin() != null
                && request.getFechaFin()
                .isBefore(request.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }

        if (temporadaRepository.existsByNombreAndIdNot(request.getNombre(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una temporada con ese nombre"
            );
        }

        boolean cambianFechas =
                !temporada.getFechaInicio().equals(request.getFechaInicio())
                        || !Objects.equals(temporada.getFechaFin(), request.getFechaFin());

        if (cambianFechas && semanaRepository.existsByTemporada_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pueden cambiar las fechas de una temporada con semanas generadas"
            );
        }

        temporada.setNombre(request.getNombre());
        temporada.setFechaInicio(request.getFechaInicio());
        temporada.setFechaFin(request.getFechaFin());

        return TemporadaResponse.desde(
                temporadaRepository.saveAndFlush(temporada));
    }

    @Transactional
    public TemporadaResponse activar(Integer id) {
        Temporada temporada = buscarTemporada(id);

        temporadaRepository.findByActivaTrue()
                .filter(activa -> !activa.getId().equals(id))
                .ifPresent(activa -> {
                    activa.setActiva(false);
                    temporadaRepository.saveAndFlush(activa);
                });

        temporada.setActiva(true);

        return TemporadaResponse.desde(
                temporadaRepository.saveAndFlush(temporada));
    }

    @Transactional
    public void eliminar(Integer id) {
        temporadaRepository.delete(buscarTemporada(id));
    }

    private Temporada buscarTemporada(Integer id) {
        return temporadaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la temporada solicitada"
                ));
    }
}
