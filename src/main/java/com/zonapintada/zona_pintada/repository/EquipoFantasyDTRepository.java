package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasyDT;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EquipoFantasyDTRepository extends JpaRepository<EquipoFantasyDT, Integer> {

    @EntityGraph(attributePaths = {"dt"})
    List<EquipoFantasyDT> findByEquipoFantasyIdIn(Collection<Integer> equipoFantasyIds);
}