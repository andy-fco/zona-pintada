
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SemanaCompetenciaRepository
        extends JpaRepository<SemanaCompetencia, Integer> {

    List<SemanaCompetencia> findAllByTemporada_IdOrderByNumeroSemanaAsc(
            Integer temporadaId);

    boolean existsByTemporada_IdAndNumeroSemana(
            Integer temporadaId,
            Integer numeroSemana);

    boolean existsByTemporada_IdAndNumeroSemanaAndIdNot(
            Integer temporadaId,
            Integer numeroSemana,
            Integer id);

    boolean existsByTemporada_IdAndFechaInicio(
            Integer temporadaId,
            LocalDate fechaInicio);

    boolean existsByTemporada_IdAndFechaInicioAndIdNot(
            Integer temporadaId,
            LocalDate fechaInicio,
            Integer id);

    boolean existsByTemporada_Id(Integer temporadaId);

    Optional<SemanaCompetencia> findByTemporada_IdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Integer temporadaId,
            LocalDate fechaDesde,
            LocalDate fechaHasta);
}
