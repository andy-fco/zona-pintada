
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.CrearTemporadaRequest;
import com.zonapintada.zona_pintada.dto.TemporadaResponse;
import com.zonapintada.zona_pintada.service.TemporadaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TemporadaController {

    private final TemporadaService temporadaService;

    public TemporadaController(TemporadaService temporadaService) {
        this.temporadaService = temporadaService;
    }

    @GetMapping("/temporadas")
    public ResponseEntity<List<TemporadaResponse>> listarTodas() {
        return ResponseEntity.ok(temporadaService.listarTodas());
    }

    @GetMapping("/temporadas/activa")
    public ResponseEntity<TemporadaResponse> obtenerActiva() {
        return ResponseEntity.ok(temporadaService.obtenerActiva());
    }

    @PostMapping("/admin/temporadas")
    public ResponseEntity<TemporadaResponse> crearYActivar(
            @Valid @RequestBody CrearTemporadaRequest request) {

        TemporadaResponse response =
                temporadaService.crearYActivar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
