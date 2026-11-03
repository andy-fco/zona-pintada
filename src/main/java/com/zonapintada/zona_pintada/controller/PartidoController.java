package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.ActualizarPartidoRequest;
import com.zonapintada.zona_pintada.dto.CrearPartidoRequest;
import com.zonapintada.zona_pintada.dto.PartidoResponse;
import com.zonapintada.zona_pintada.service.PartidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PartidoController {

    private final PartidoService partidoService;

    public PartidoController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    @GetMapping("/partidos")
    public ResponseEntity<List<PartidoResponse>> listar(
            @RequestParam(required = false) Integer semanaId,
            @RequestParam(required = false) Integer fechaId,
            @RequestParam(required = false) Integer equipoId) {
        return ResponseEntity.ok(
                partidoService.listar(semanaId, fechaId, equipoId));
    }

    @GetMapping("/partidos/{id}")
    public ResponseEntity<PartidoResponse> obtenerPorId(
            @PathVariable Integer id) {
        return ResponseEntity.ok(partidoService.obtenerPorId(id));
    }

    @PostMapping("/admin/partidos")
    public ResponseEntity<PartidoResponse> crear(
            @Valid @RequestBody CrearPartidoRequest request) {
        PartidoResponse response = partidoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/admin/partidos/{id}")
    public ResponseEntity<PartidoResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ActualizarPartidoRequest request) {
        return ResponseEntity.ok(partidoService.actualizar(id, request));
    }

    @DeleteMapping("/admin/partidos/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        partidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}