
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.SemanaCompetenciaRequest;
import com.zonapintada.zona_pintada.dto.SemanaCompetenciaResponse;
import com.zonapintada.zona_pintada.service.SemanaCompetenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<List<SemanaCompetenciaResponse>> listar(
            @RequestParam(required = false) Integer temporadaId) {
        return ResponseEntity.ok(
                semanaService.listar(temporadaId)
        );
    }

    @GetMapping("/actual")
    public ResponseEntity<SemanaCompetenciaResponse> obtenerActual() {
        return ResponseEntity.ok(semanaService.obtenerActual());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SemanaCompetenciaResponse> obtenerPorId(
            @PathVariable Integer id) {
        return ResponseEntity.ok(semanaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<SemanaCompetenciaResponse> crear(
            @Valid @RequestBody SemanaCompetenciaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(semanaService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SemanaCompetenciaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody SemanaCompetenciaRequest request) {
        return ResponseEntity.ok(semanaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        semanaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generar")
    public ResponseEntity<List<SemanaCompetenciaResponse>> generar() {
        return ResponseEntity.ok(
                semanaService.generarDeTemporadaActiva()
        );
    }
}
