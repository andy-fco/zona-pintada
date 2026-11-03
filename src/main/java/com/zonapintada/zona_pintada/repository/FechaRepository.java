package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Fecha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FechaRepository extends JpaRepository<Fecha, Integer> {

    List<Fecha> findAllBySemana_IdOrderByFechaAsc(Integer semanaId);

    boolean existsBySemana_IdAndFecha(Integer semanaId, LocalDate fecha);

    Optional<Fecha> findByFecha(LocalDate fecha);

    boolean existsBySemana_Id(Integer semanaId);
}