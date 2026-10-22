
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Jugador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JugadorRepository extends JpaRepository<Jugador, Integer> {

    @EntityGraph(attributePaths = "equipo")
    List<Jugador> findAllByOrderByApellidoAscNombreAsc();

    @EntityGraph(attributePaths = "equipo")
    List<Jugador> findAllByEquipo_IdOrderByApellidoAscNombreAsc(Integer equipoId);
}
