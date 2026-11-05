package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasyResultadoSemanal;
import com.zonapintada.zona_pintada.entity.EquipoFantasyResultadoSemanalId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

public interface EquipoFantasyResultadoSemanalRepository
        extends JpaRepository<EquipoFantasyResultadoSemanal, EquipoFantasyResultadoSemanalId> {

    interface PuntosEquipoSemana {
        Integer getEquipoFantasyId();

        Integer getSemanaId();

        BigDecimal getPuntos();
    }

    @EntityGraph(attributePaths = {"semana"})
    List<EquipoFantasyResultadoSemanal> findByEquipoFantasy_IdOrderBySemana_NumeroSemanaAsc(
            Integer equipoFantasyId);

    @EntityGraph(attributePaths = {"equipoFantasy", "equipoFantasy.usuario"})
    List<EquipoFantasyResultadoSemanal> findBySemana_Id(Integer semanaId);

    List<EquipoFantasyResultadoSemanal> findByEquipoFantasy_IdInAndSemana_NumeroSemanaGreaterThan(
            Collection<Integer> equipoFantasyIds,
            Integer numeroSemana);

    void deleteByEquipoFantasy_Id(Integer equipoFantasyId);

    @Query(nativeQuery = true, value = """
            select aportes.equipo_fantasy_id as "equipoFantasyId",
                   aportes.semana_id as "semanaId",
                   sum(aportes.puntos) as "puntos"
            from (
                select ef.id as equipo_fantasy_id,
                       s.id as semana_id,
                       jp.puntos_fantasy * efj.multiplicador as puntos
                from equipo_fantasy ef
                join equipo_fantasy_jugador efj on efj.equipo_fantasy_id = ef.id
                join jugador_partido jp on jp.jugador_id = efj.jugador_id
                join partido p on p.id = jp.partido_id
                join fecha f on f.id = p.jornada_id
                join semana_competencia s on s.id = f.semana_id
                    and s.temporada_id = ef.temporada_id
                where ef.id in (:equipoFantasyIds)
                  and s.cerrada_at is null
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at

                union all

                select ef.id,
                       s.id,
                       dp.puntos_fantasy
                from equipo_fantasy ef
                join equipo_fantasy_dt efd on efd.equipo_fantasy_id = ef.id
                join dt_partido dp on dp.dt_id = efd.dt_id
                join partido p on p.id = dp.partido_id
                join fecha f on f.id = p.jornada_id
                join semana_competencia s on s.id = f.semana_id
                    and s.temporada_id = ef.temporada_id
                where ef.id in (:equipoFantasyIds)
                  and s.cerrada_at is null
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at
            ) aportes
            group by aportes.equipo_fantasy_id, aportes.semana_id
            """)
    List<PuntosEquipoSemana> calcularSemanasAbiertas(
            @Param("equipoFantasyIds") Collection<Integer> equipoFantasyIds);

    @Query(nativeQuery = true, value = """
            select aportes.equipo_fantasy_id as "equipoFantasyId",
                   aportes.semana_id as "semanaId",
                   sum(aportes.puntos) as "puntos"
            from (
                select h.equipo_fantasy_id,
                       h.semana_id,
                       jp.puntos_fantasy * h.multiplicador as puntos
                from equipo_fantasy_jugador_historial h
                join equipo_fantasy ef on ef.id = h.equipo_fantasy_id
                join jugador_partido jp on jp.jugador_id = h.jugador_id
                join partido p on p.id = jp.partido_id
                join fecha f on f.id = p.jornada_id and f.semana_id = h.semana_id
                where h.semana_id = :semanaId
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at

                union all

                select h.equipo_fantasy_id,
                       h.semana_id,
                       dp.puntos_fantasy
                from equipo_fantasy_dt_historial h
                join equipo_fantasy ef on ef.id = h.equipo_fantasy_id
                join dt_partido dp on dp.dt_id = h.dt_id
                join partido p on p.id = dp.partido_id
                join fecha f on f.id = p.jornada_id and f.semana_id = h.semana_id
                where h.semana_id = :semanaId
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at
            ) aportes
            group by aportes.equipo_fantasy_id, aportes.semana_id
            """)
    List<PuntosEquipoSemana> calcularDesdeHistorial(@Param("semanaId") Integer semanaId);
}