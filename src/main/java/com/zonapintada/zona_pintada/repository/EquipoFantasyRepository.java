package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface EquipoFantasyRepository extends JpaRepository<EquipoFantasy, Integer> {

    boolean existsByUsuario_IdAndTemporada_Id(Integer usuarioId, Integer temporadaId);

    Optional<EquipoFantasy> findByUsuario_IdAndTemporada_Id(Integer usuarioId, Integer temporadaId);

    List<EquipoFantasy> findByTemporada_IdAndCreatedAtBefore(Integer temporadaId, Instant limite);

    @EntityGraph(attributePaths = {"usuario", "temporada"})
    @Query("""
            select e from EquipoFantasy e
            where e.temporada.id = :temporadaId
              and (:usuarioId is null or e.usuario.id = :usuarioId)
            order by e.puntosTotales desc, e.nombre asc
            """)
    List<EquipoFantasy> buscar(
            @Param("temporadaId") Integer temporadaId,
            @Param("usuarioId") Integer usuarioId
    );
}