package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Integer> {

    interface FilaPosicion {
        Integer getEquipoId();

        String getEquipoNombre();

        String getNombreCorto();

        String getEscudoUrl();

        Long getPartidosJugados();

        Long getGanados();

        Long getPerdidos();

        Long getPuntosAFavor();

        Long getPuntosEnContra();
    }

    @Query(nativeQuery = true, value = """
            with resultados as (
                select p.equipo_local_id as equipo_id,
                       p.puntos_local as a_favor,
                       p.puntos_visitante as en_contra
                from partido p
                join fecha f on f.id = p.jornada_id
                join semana_competencia s on s.id = f.semana_id
                where s.temporada_id = :temporadaId
                  and p.estado = 'finalizado'
                  and p.puntos_local is not null
                  and p.puntos_visitante is not null

                union all

                select p.equipo_visitante_id,
                       p.puntos_visitante,
                       p.puntos_local
                from partido p
                join fecha f on f.id = p.jornada_id
                join semana_competencia s on s.id = f.semana_id
                where s.temporada_id = :temporadaId
                  and p.estado = 'finalizado'
                  and p.puntos_local is not null
                  and p.puntos_visitante is not null
            )
            select e.id as "equipoId",
                   e.nombre as "equipoNombre",
                   e.nombre_corto as "nombreCorto",
                   e.escudo_url as "escudoUrl",
                   count(r.equipo_id) as "partidosJugados",
                   count(*) filter (where r.a_favor > r.en_contra) as "ganados",
                   count(*) filter (where r.a_favor < r.en_contra) as "perdidos",
                   coalesce(sum(r.a_favor), 0) as "puntosAFavor",
                   coalesce(sum(r.en_contra), 0) as "puntosEnContra"
            from equipo e
            left join resultados r on r.equipo_id = e.id
            group by e.id, e.nombre, e.nombre_corto, e.escudo_url
            """)
    List<FilaPosicion> calcularPosiciones(@Param("temporadaId") Integer temporadaId);
}
