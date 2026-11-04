
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Temporada;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TemporadaRepository
        extends JpaRepository<Temporada, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select t from Temporada t
            where t.id = (
                select s.temporada.id from SemanaCompetencia s where s.id = :semanaId
            )
            """)
    Optional<Temporada> bloquearPorSemana(@Param("semanaId") Integer semanaId);

    Optional<Temporada> findByActivaTrue();

    List<Temporada> findAllByOrderByFechaInicioDesc();

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);
}
