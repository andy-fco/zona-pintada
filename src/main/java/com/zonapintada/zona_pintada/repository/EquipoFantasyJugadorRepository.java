package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasyJugador;
import com.zonapintada.zona_pintada.entity.EquipoFantasyJugadorId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EquipoFantasyJugadorRepository
        extends JpaRepository<EquipoFantasyJugador, EquipoFantasyJugadorId> {

    @EntityGraph(attributePaths = {"jugador"})
    List<EquipoFantasyJugador> findByEquipoFantasy_IdIn(Collection<Integer> equipoFantasyIds);

    @EntityGraph(attributePaths = {"jugador", "jugador.equipo"})
    List<EquipoFantasyJugador> findByEquipoFantasy_IdOrderByTitularDesc(Integer equipoFantasyId);

    void deleteByEquipoFantasy_Id(Integer equipoFantasyId);
}