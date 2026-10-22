
package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TemporadaRepository
        extends JpaRepository<Temporada, Integer> {

    Optional<Temporada> findByActivaTrue();

    List<Temporada> findAllByOrderByFechaInicioDesc();

    boolean existsByNombre(String nombre);
}
