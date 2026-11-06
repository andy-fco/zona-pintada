package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EquipoFantasyRepository extends JpaRepository<EquipoFantasy, Integer> {

    interface FilaDetallePuntos {
        Integer getIntegranteId();

        String getNombre();

        String getApellido();

        String getPosicion();

        String getEquipoNombre();

        Boolean getTitular();

        String getRol();

        BigDecimal getMultiplicador();

        Integer getPartidoId();

        LocalDate getFecha();

        String getRival();

        BigDecimal getPuntosFantasy();

        BigDecimal getPuntosAportados();
    }

    List<EquipoFantasy> findByUsuario_Id(Integer usuarioId);

    boolean existsByUsuario_IdAndTemporada_Id(Integer usuarioId, Integer temporadaId);

    Optional<EquipoFantasy> findByUsuario_IdAndTemporada_Id(Integer usuarioId, Integer temporadaId);

    @EntityGraph(attributePaths = {"usuario"})
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

    @Query(nativeQuery = true, value = """
            with plantel as (
                select efj.jugador_id, efj.titular,
                       cast(efj.rol as text) as rol, efj.multiplicador
                from equipo_fantasy_jugador efj
                where efj.equipo_fantasy_id = :equipoFantasyId
                  and :cerrada = false

                union all

                select h.jugador_id, h.titular,
                       cast(h.rol as text), h.multiplicador
                from equipo_fantasy_jugador_historial h
                where h.equipo_fantasy_id = :equipoFantasyId
                  and h.semana_id = :semanaId
                  and :cerrada = true
            ),
            aportes as (
                select jp.jugador_id, p.id as partido_id, p.fecha, p.hora,
                       case when p.equipo_local_id = jp.equipo_id
                            then ev.nombre else el.nombre end as rival,
                       jp.puntos_fantasy
                from jugador_partido jp
                join partido p on p.id = jp.partido_id
                join fecha f on f.id = p.jornada_id
                join equipo el on el.id = p.equipo_local_id
                join equipo ev on ev.id = p.equipo_visitante_id
                join equipo_fantasy ef on ef.id = :equipoFantasyId
                where f.semana_id = :semanaId
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at
            )
            select j.id as "integranteId",
                   j.nombre as "nombre",
                   j.apellido as "apellido",
                   cast(j.posicion as text) as "posicion",
                   e.nombre as "equipoNombre",
                   pl.titular as "titular",
                   pl.rol as "rol",
                   pl.multiplicador as "multiplicador",
                   a.partido_id as "partidoId",
                   a.fecha as "fecha",
                   a.rival as "rival",
                   a.puntos_fantasy as "puntosFantasy",
                   a.puntos_fantasy * pl.multiplicador as "puntosAportados"
            from plantel pl
            join jugador j on j.id = pl.jugador_id
            join equipo e on e.id = j.equipo_id
            left join aportes a on a.jugador_id = pl.jugador_id
            order by pl.titular desc, j.apellido, j.id, a.fecha, a.hora
            """)
    List<FilaDetallePuntos> detallarJugadoresEnSemana(
            @Param("equipoFantasyId") Integer equipoFantasyId,
            @Param("semanaId") Integer semanaId,
            @Param("cerrada") boolean cerrada
    );

    @Query(nativeQuery = true, value = """
            with asignacion as (
                select efd.dt_id
                from equipo_fantasy_dt efd
                where efd.equipo_fantasy_id = :equipoFantasyId
                  and :cerrada = false

                union all

                select h.dt_id
                from equipo_fantasy_dt_historial h
                where h.equipo_fantasy_id = :equipoFantasyId
                  and h.semana_id = :semanaId
                  and :cerrada = true
            ),
            aportes as (
                select dp.dt_id, p.id as partido_id, p.fecha, p.hora,
                       case when p.equipo_local_id = dp.equipo_id
                            then ev.nombre else el.nombre end as rival,
                       dp.puntos_fantasy
                from dt_partido dp
                join partido p on p.id = dp.partido_id
                join fecha f on f.id = p.jornada_id
                join equipo el on el.id = p.equipo_local_id
                join equipo ev on ev.id = p.equipo_visitante_id
                join equipo_fantasy ef on ef.id = :equipoFantasyId
                where f.semana_id = :semanaId
                  and p.estado = 'finalizado'
                  and (p.fecha + p.hora) at time zone 'America/Argentina/Buenos_Aires' > ef.created_at
            )
            select d.id as "integranteId",
                   d.nombre as "nombre",
                   d.apellido as "apellido",
                   cast(null as text) as "posicion",
                   e.nombre as "equipoNombre",
                   cast(null as boolean) as "titular",
                   cast(null as text) as "rol",
                   cast(1 as numeric) as "multiplicador",
                   a.partido_id as "partidoId",
                   a.fecha as "fecha",
                   a.rival as "rival",
                   a.puntos_fantasy as "puntosFantasy",
                   a.puntos_fantasy as "puntosAportados"
            from asignacion asg
            join dt d on d.id = asg.dt_id
            join equipo e on e.id = d.equipo_id
            left join aportes a on a.dt_id = asg.dt_id
            order by a.fecha, a.hora
            """)
    List<FilaDetallePuntos> detallarDTEnSemana(
            @Param("equipoFantasyId") Integer equipoFantasyId,
            @Param("semanaId") Integer semanaId,
            @Param("cerrada") boolean cerrada
    );
}
