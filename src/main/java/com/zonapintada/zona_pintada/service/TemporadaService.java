
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.CrearTemporadaRequest;
import com.zonapintada.zona_pintada.dto.TemporadaResponse;
import com.zonapintada.zona_pintada.entity.Temporada;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TemporadaService {

    private final TemporadaRepository temporadaRepository;

    public TemporadaService(TemporadaRepository temporadaRepository) {
        this.temporadaRepository = temporadaRepository;
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
}
