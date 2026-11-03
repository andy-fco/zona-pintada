package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.FechaRequest;
import com.zonapintada.zona_pintada.dto.FechaResponse;
import com.zonapintada.zona_pintada.service.FechaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FechaResponse crear(
            @PathVariable Integer semanaId,
            @Valid @RequestBody FechaRequest request) {
        return fechaService.crear(semanaId, request);
    }

    @PutMapping("/{id}")
    public FechaResponse actualizar(
            @PathVariable Integer semanaId,
            @PathVariable Integer id,
            @Valid @RequestBody FechaRequest request) {
        return fechaService.actualizar(semanaId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(
            @PathVariable Integer semanaId,
            @PathVariable Integer id) {
        fechaService.eliminar(semanaId, id);
    }
}