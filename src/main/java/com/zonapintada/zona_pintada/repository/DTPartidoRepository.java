package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.DTPartido;
import com.zonapintada.zona_pintada.entity.DTPartidoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DTPartidoRepository
        extends JpaRepository<DTPartido, DTPartidoId> {

    List<DTPartido> findByPartido_IdOrderByDt_ApellidoAscDt_NombreAsc(
            Integer partidoId
    );

    Optional<DTPartido> findByDt_IdAndPartido_Id(
            Integer dtId,
            Integer partidoId
    );

    void deleteByPartido_Id(Integer partidoId);
}