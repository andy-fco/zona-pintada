package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Partido;
import com.zonapintada.zona_pintada.enums.EstadoPartido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface PartidoRepository extends JpaRepository<Partido, Integer> {

    boolean existsByFechaCompetencia_Id(Integer fechaId);

    boolean existsByFechaCompetencia_Semana_IdAndEstadoIn(
            Integer semanaId,
            Collection<EstadoPartido> estados);

    @EntityGraph(attributePaths = {"equipoLocal", "equipoVisitante"})
    @Query("""
            select p from Partido p
            where (:semanaId is null or p.fechaCompetencia.semana.id = :semanaId)
              and (:fechaId is null or p.fechaCompetencia.id = :fechaId)
              and (:equipoId is null
                   or p.equipoLocal.id = :equipoId
                   or p.equipoVisitante.id = :equipoId)
            order by p.fecha asc, p.hora asc
            """)
    List<Partido> buscar(
            @Param("semanaId") Integer semanaId,
            @Param("fechaId") Integer fechaId,
            @Param("equipoId") Integer equipoId
    );
}