package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.ActualizarEstadisticasJugadorRequest;
import com.zonapintada.zona_pintada.dto.JugadorPartidoResponse;
import com.zonapintada.zona_pintada.dto.RegistrarJugadorPartidoRequest;
import com.zonapintada.zona_pintada.service.JugadorPartidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JugadorPartidoController {

    private final JugadorPartidoService jugadorPartidoService;

    public JugadorPartidoController(
            JugadorPartidoService jugadorPartidoService) {
        this.jugadorPartidoService = jugadorPartidoService;
    }

    @GetMapping("/partidos/{partidoId}/estadisticas/jugadores")
    public ResponseEntity<List<JugadorPartidoResponse>> listarPorPartido(
            @PathVariable Integer partidoId) {
        return ResponseEntity.ok(
                jugadorPartidoService.listarPorPartido(partidoId));
    }

    @GetMapping("/partidos/{partidoId}/estadisticas/jugadores/{jugadorId}")
    public ResponseEntity<JugadorPartidoResponse> obtener(
            @PathVariable Integer partidoId,
            @PathVariable Integer jugadorId) {
        return ResponseEntity.ok(
                jugadorPartidoService.obtener(partidoId, jugadorId));
    }

    @GetMapping("/jugadores/{jugadorId}/estadisticas")
    public ResponseEntity<List<JugadorPartidoResponse>> listarPorJugador(
            @PathVariable Integer jugadorId) {
        return ResponseEntity.ok(
                jugadorPartidoService.listarPorJugador(jugadorId));
    }

    @PostMapping("/admin/partidos/{partidoId}/estadisticas/jugadores")
    public ResponseEntity<JugadorPartidoResponse> registrar(
            @PathVariable Integer partidoId,
            @Valid @RequestBody RegistrarJugadorPartidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jugadorPartidoService.registrar(partidoId, request));
    }

    @PutMapping("/admin/partidos/{partidoId}/estadisticas/jugadores/{jugadorId}")
    public ResponseEntity<JugadorPartidoResponse> actualizar(
            @PathVariable Integer partidoId,
            @PathVariable Integer jugadorId,
            @Valid @RequestBody ActualizarEstadisticasJugadorRequest request) {
        return ResponseEntity.ok(
                jugadorPartidoService.actualizar(partidoId, jugadorId, request));
    }

    @DeleteMapping("/admin/partidos/{partidoId}/estadisticas/jugadores/{jugadorId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer partidoId,
            @PathVariable Integer jugadorId) {
        jugadorPartidoService.eliminar(partidoId, jugadorId);
        return ResponseEntity.noContent().build();
    }
}