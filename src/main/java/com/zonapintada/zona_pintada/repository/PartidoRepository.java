package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidoRepository extends JpaRepository<Partido, Integer> {

    List<Partido> findAllByOrderByFechaAscHoraAsc();
}