package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.FechaRequest;
import com.zonapintada.zona_pintada.dto.FechaResponse;
import com.zonapintada.zona_pintada.entity.Fecha;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.FechaRepository;
import com.zonapintada.zona_pintada.repository.PartidoRepository;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class FechaService {

    private final FechaRepository fechaRepository;
    private final SemanaCompetenciaRepository semanaRepository;
    private final PartidoRepository partidoRepository;

    public FechaService(
            FechaRepository fechaRepository,
            SemanaCompetenciaRepository semanaRepository,
            PartidoRepository partidoRepository
    ) {
        this.fechaRepository = fechaRepository;
        this.semanaRepository = semanaRepository;
        this.partidoRepository = partidoRepository;
    }

    @Transactional(readOnly = true)
    public List<FechaResponse> listarPorSemana(Integer semanaId) {
        verificarSemana(semanaId);

        return fechaRepository
                .findAllBySemana_IdOrderByFechaAsc(semanaId)
                .stream()
                .map(FechaResponse::desde)
                .toList();
    }

    @Transactional
    public List<FechaResponse> generarPorSemana(Integer semanaId) {
        SemanaCompetencia semana = verificarSemana(semanaId);
        LocalDate inicio = semana.getFechaInicio();

        for (int i = 0; i < 7; i++) {
            LocalDate fecha = inicio.plusDays(i);

            if (!fechaRepository.existsBySemana_IdAndFecha(semanaId, fecha)) {
                fechaRepository.save(new Fecha(semana, fecha));
            }
        }

        return fechaRepository
                .findAllBySemana_IdOrderByFechaAsc(semanaId)
                .stream()
                .map(FechaResponse::desde)
                .toList();
    }

    @Transactional
    public FechaResponse crear(Integer semanaId, FechaRequest request) {
        SemanaCompetencia semana = verificarSemana(semanaId);

        validarDentroDeSemana(semana, request.getFecha());
        validarFechaDisponible(request.getFecha());

        return FechaResponse.desde(
                fechaRepository.save(new Fecha(semana, request.getFecha())));
    }

    @Transactional
    public FechaResponse actualizar(
            Integer semanaId,
            Integer id,
            FechaRequest request) {

        Fecha fecha = buscarFecha(semanaId, id);

        if (fecha.getFecha().equals(request.getFecha())) {
            return FechaResponse.desde(fecha);
        }

        validarDentroDeSemana(fecha.getSemana(), request.getFecha());
        validarFechaDisponible(request.getFecha());

        if (partidoRepository.existsByFechaCompetencia_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cambiar una fecha que ya tiene partidos asignados."
            );
        }

        fecha.setFecha(request.getFecha());

        return FechaResponse.desde(fechaRepository.save(fecha));
    }

    @Transactional
    public void eliminar(Integer semanaId, Integer id) {
        fechaRepository.delete(buscarFecha(semanaId, id));
    }

    private Fecha buscarFecha(Integer semanaId, Integer id) {
        return fechaRepository.findById(id)
                .filter(f -> f.getSemana().getId().equals(semanaId))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la fecha indicada en esa semana."
                ));
    }

    private void validarDentroDeSemana(
            SemanaCompetencia semana,
            LocalDate fecha) {
        if (fecha.isBefore(semana.getFechaInicio())
                || fecha.isAfter(semana.getFechaFin())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha debe estar dentro de la semana indicada."
            );
        }
    }

    private void validarFechaDisponible(LocalDate fecha) {
        if (fechaRepository.findByFecha(fecha).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una fecha de competencia para ese día."
            );
        }
    }

    private SemanaCompetencia verificarSemana(Integer semanaId) {
        return semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada."
                ));
    }
}