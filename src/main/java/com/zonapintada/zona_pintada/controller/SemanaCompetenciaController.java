
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.SemanaCompetenciaResponse;
import com.zonapintada.zona_pintada.service.SemanaCompetenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/semanas")
public class SemanaCompetenciaController {

    private final SemanaCompetenciaService semanaService;

    public SemanaCompetenciaController(
            SemanaCompetenciaService semanaService) {
        this.semanaService = semanaService;
    }

    @GetMapping
    public ResponseEntity<List<SemanaCompetenciaResponse>> listar() {
        return ResponseEntity.ok(
                semanaService.listarDeTemporadaActiva()
        );
    }

    @PostMapping("/generar")
    public ResponseEntity<List<SemanaCompetenciaResponse>> generar() {
        return ResponseEntity.ok(
                semanaService.generarDeTemporadaActiva()
        );
    }
}
