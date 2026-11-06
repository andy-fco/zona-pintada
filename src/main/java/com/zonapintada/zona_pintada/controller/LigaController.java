package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.DestacadosSemanaResponse;
import com.zonapintada.zona_pintada.dto.PosicionLigaResponse;
import com.zonapintada.zona_pintada.service.LigaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LigaController {

    private final LigaService ligaService;

    public LigaController(LigaService ligaService) {
        this.ligaService = ligaService;
    }

    @GetMapping("/posiciones")
    public ResponseEntity<List<PosicionLigaResponse>> obtenerPosiciones(
            @RequestParam(required = false) Integer temporadaId) {
        return ResponseEntity.ok(ligaService.obtenerPosiciones(temporadaId));
    }

    @GetMapping("/semanas/{semanaId}/destacados")
    public ResponseEntity<DestacadosSemanaResponse> obtenerDestacados(
            @PathVariable Integer semanaId) {
        return ResponseEntity.ok(ligaService.obtenerDestacados(semanaId));
    }
}
