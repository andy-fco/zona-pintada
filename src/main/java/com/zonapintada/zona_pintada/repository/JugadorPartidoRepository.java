package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.JugadorPartido;
import com.zonapintada.zona_pintada.entity.JugadorPartidoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JugadorPartidoRepository
        extends JpaRepository<JugadorPartido, JugadorPartidoId> {

    List<JugadorPartido> findByPartido_IdOrderByJugador_ApellidoAscJugador_NombreAsc(
            Integer partidoId);

    Optional<JugadorPartido> findByJugador_IdAndPartido_Id(
            Integer jugadorId, Integer partidoId);
}