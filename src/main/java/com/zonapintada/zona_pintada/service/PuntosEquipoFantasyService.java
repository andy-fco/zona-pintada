package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.PuntosEquipoFantasy;
import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.EquipoFantasyResultadoSemanalRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyResultadoSemanalRepository.PuntosEquipoSemana;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PuntosEquipoFantasyService {

    private final EquipoFantasyResultadoSemanalRepository resultadoRepository;
    private final SemanaCompetenciaRepository semanaRepository;

    public PuntosEquipoFantasyService(
            EquipoFantasyResultadoSemanalRepository resultadoRepository,
            SemanaCompetenciaRepository semanaRepository) {
        this.resultadoRepository = resultadoRepository;
        this.semanaRepository = semanaRepository;
    }

    @Transactional(readOnly = true)
    public Map<Integer, PuntosEquipoFantasy> calcularEnCurso(
            Integer temporadaId,
            List<EquipoFantasy> equipos) {

        if (equipos.isEmpty()) {
            return Map.of();
        }

        Integer semanaEnCursoId = semanaRepository
                .findFirstByTemporada_IdAndCerradaAtIsNullOrderByNumeroSemanaAsc(temporadaId)
                .map(SemanaCompetencia::getId)
                .orElse(null);

        List<Integer> ids = equipos.stream().map(EquipoFantasy::getId).toList();

        Map<Integer, Integer> puntosSemana = new HashMap<>();
        Map<Integer, Integer> puntosAbiertos = new HashMap<>();

        for (PuntosEquipoSemana fila : resultadoRepository.calcularSemanasAbiertas(ids)) {
            int puntos = redondear(fila.getPuntos());

            puntosAbiertos.merge(fila.getEquipoFantasyId(), puntos, Integer::sum);

            if (fila.getSemanaId().equals(semanaEnCursoId)) {
                puntosSemana.put(fila.getEquipoFantasyId(), puntos);
            }
        }

        Map<Integer, PuntosEquipoFantasy> resultado = new HashMap<>();

        for (EquipoFantasy equipo : equipos) {
            Integer id = equipo.getId();

            resultado.put(id, new PuntosEquipoFantasy(
                    puntosSemana.getOrDefault(id, 0),
                    equipo.getPuntosTotales() + puntosAbiertos.getOrDefault(id, 0)
            ));
        }

        return resultado;
    }

    @Transactional(readOnly = true)
    public Map<Integer, Integer> calcularSemanaAbierta(
            Integer semanaId,
            List<EquipoFantasy> equipos) {

        if (equipos.isEmpty()) {
            return Map.of();
        }

        List<Integer> ids = equipos.stream().map(EquipoFantasy::getId).toList();
        Map<Integer, Integer> resultado = new HashMap<>();

        for (PuntosEquipoSemana fila : resultadoRepository.calcularSemanasAbiertas(ids)) {
            if (fila.getSemanaId().equals(semanaId)) {
                resultado.put(fila.getEquipoFantasyId(), redondear(fila.getPuntos()));
            }
        }

        return resultado;
    }

    @Transactional(readOnly = true)
    public Map<Integer, Integer> calcularSemanaCerrada(Integer semanaId) {
        Map<Integer, Integer> resultado = new HashMap<>();

        for (PuntosEquipoSemana fila : resultadoRepository.calcularDesdeHistorial(semanaId)) {
            resultado.put(fila.getEquipoFantasyId(), redondear(fila.getPuntos()));
        }

        return resultado;
    }

    private int redondear(BigDecimal puntos) {
        return puntos.setScale(0, RoundingMode.HALF_UP).intValue();
    }
}