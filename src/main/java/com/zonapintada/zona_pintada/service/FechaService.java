package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.FechaResponse;
import com.zonapintada.zona_pintada.entity.Fecha;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.FechaRepository;
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

    public FechaService(
            FechaRepository fechaRepository,
            SemanaCompetenciaRepository semanaRepository
    ) {
        this.fechaRepository = fechaRepository;
        this.semanaRepository = semanaRepository;
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

    private SemanaCompetencia verificarSemana(Integer semanaId) {
        return semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada."
                ));
    }
}