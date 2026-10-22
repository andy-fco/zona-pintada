
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SemanaCompetenciaRepository
        extends JpaRepository<SemanaCompetencia, Integer> {

    List<SemanaCompetencia> findAllByTemporada_IdOrderByNumeroSemanaAsc(
            Integer temporadaId);

    boolean existsByTemporada_IdAndNumeroSemana(
            Integer temporadaId,
            Integer numeroSemana);
}
