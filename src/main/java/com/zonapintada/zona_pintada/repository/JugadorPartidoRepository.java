package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.JugadorPartido;
import com.zonapintada.zona_pintada.entity.JugadorPartidoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;

public interface JugadorPartidoRepository
        extends JpaRepository<JugadorPartido, JugadorPartidoId> {

    interface FilaRendimientoSemana {
        Integer getJugadorId();

        String getNombre();

        String getApellido();

        String getFotoUrl();

        String getPosicion();

        String getEquipoNombre();

        Long getPartidosJugados();

        BigDecimal getPuntosFantasy();
    }

    List<JugadorPartido> findByPartido_IdOrderByJugador_ApellidoAscJugador_NombreAsc(
            Integer partidoId);

    Optional<JugadorPartido> findByJugador_IdAndPartido_Id(
            Integer jugadorId, Integer partidoId);

    List<JugadorPartido> findByJugador_IdOrderByPartido_FechaDescPartido_HoraDesc(
            Integer jugadorId);

    boolean existsByPartido_Id(Integer partidoId);

    @Query(nativeQuery = true, value = """
            select j.id as "jugadorId",
                   j.nombre as "nombre",
                   j.apellido as "apellido",
                   j.foto_url as "fotoUrl",
                   cast(j.posicion as text) as "posicion",
                   e.nombre as "equipoNombre",
                   count(*) as "partidosJugados",
                   sum(jp.puntos_fantasy) as "puntosFantasy"
            from jugador_partido jp
            join partido p on p.id = jp.partido_id
            join fecha f on f.id = p.jornada_id
            join jugador j on j.id = jp.jugador_id
            join equipo e on e.id = j.equipo_id
            where f.semana_id = :semanaId
              and p.estado = 'finalizado'
            group by j.id, j.nombre, j.apellido, j.foto_url, j.posicion, e.nombre
            order by sum(jp.puntos_fantasy) desc, j.apellido, j.nombre
            """)
    List<FilaRendimientoSemana> rendimientoPorSemana(@Param("semanaId") Integer semanaId);
}
