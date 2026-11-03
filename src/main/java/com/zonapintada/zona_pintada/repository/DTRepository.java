
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.DT;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DTRepository extends JpaRepository<DT, Integer> {

    @EntityGraph(attributePaths = "equipo")
    List<DT> findAllByOrderByApellidoAscNombreAsc();

    @EntityGraph(attributePaths = "equipo")
    List<DT> findAllByEquipo_IdOrderByApellidoAscNombreAsc(Integer equipoId);

    @EntityGraph(attributePaths = "equipo")
    List<DT> findAllByEquipo_IdIn(Collection<Integer> equipoIds);

    boolean existsByEquipo_Id(Integer equipoId);

    boolean existsByEquipo_IdAndIdNot(Integer equipoId, Integer id);
}
