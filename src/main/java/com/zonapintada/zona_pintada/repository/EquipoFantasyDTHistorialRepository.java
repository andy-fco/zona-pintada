package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasyDTHistorial;
import com.zonapintada.zona_pintada.entity.EquipoFantasyDTHistorialId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoFantasyDTHistorialRepository
        extends JpaRepository<EquipoFantasyDTHistorial, EquipoFantasyDTHistorialId> {

    void deleteByEquipoFantasy_Id(Integer equipoFantasyId);
}