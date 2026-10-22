
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.DT;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DTRepository extends JpaRepository<DT, Integer> {

    List<DT> findAllByOrderByApellidoAscNombreAsc();

    List<DT> findAllByEquipo_IdOrderByApellidoAscNombreAsc(Integer equipoId);

    boolean existsByEquipo_Id(Integer equipoId);

    boolean existsByEquipo_IdAndIdNot(Integer equipoId, Integer id);
}
