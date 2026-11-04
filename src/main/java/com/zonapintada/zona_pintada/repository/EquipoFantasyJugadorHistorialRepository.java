package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.EquipoFantasyJugadorHistorial;
import com.zonapintada.zona_pintada.entity.EquipoFantasyJugadorHistorialId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoFantasyJugadorHistorialRepository
        extends JpaRepository<EquipoFantasyJugadorHistorial, EquipoFantasyJugadorHistorialId> {

    void deleteByEquipoFantasy_Id(Integer equipoFantasyId);
}