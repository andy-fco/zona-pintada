package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.FechaResponse;
import com.zonapintada.zona_pintada.service.FechaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semanas/{semanaId}/fechas")
public class FechaController {

    private final FechaService fechaService;

    public FechaController(FechaService fechaService) {
        this.fechaService = fechaService;
    }

    @GetMapping
    public List<FechaResponse> listar(@PathVariable Integer semanaId) {
        return fechaService.listarPorSemana(semanaId);
    }

    @PostMapping("/generar")
    public List<FechaResponse> generar(@PathVariable Integer semanaId) {
        return fechaService.generarPorSemana(semanaId);
    }
}