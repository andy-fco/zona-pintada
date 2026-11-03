package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.DTPartidoResponse;
import com.zonapintada.zona_pintada.service.DTPartidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DTPartidoController {

    private final DTPartidoService dtPartidoService;

    public DTPartidoController(DTPartidoService dtPartidoService) {
        this.dtPartidoService = dtPartidoService;
    }

    @GetMapping("/api/partidos/{partidoId}/estadisticas/dt")
    public List<DTPartidoResponse> listarPorPartido(
            @PathVariable Integer partidoId) {
        return dtPartidoService.listarPorPartido(partidoId);
    }

    @GetMapping("/api/partidos/{partidoId}/estadisticas/dt/{dtId}")
    public DTPartidoResponse obtenerPorPartidoYDT(
            @PathVariable Integer partidoId,
            @PathVariable Integer dtId) {
        return dtPartidoService.obtenerPorPartidoYDT(partidoId, dtId);
    }

    @GetMapping("/api/dts/{dtId}/estadisticas")
    public List<DTPartidoResponse> listarPorDT(
            @PathVariable Integer dtId) {
        return dtPartidoService.listarPorDT(dtId);
    }

    @PostMapping("/api/admin/partidos/{partidoId}/estadisticas/dt/recalcular")
    public List<DTPartidoResponse> recalcular(
            @PathVariable Integer partidoId) {
        return dtPartidoService.recalcular(partidoId);
    }
}