
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.DTRequest;
import com.zonapintada.zona_pintada.dto.DTResponse;
import com.zonapintada.zona_pintada.service.DTService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dts")
public class DTController {

    private final DTService dtService;

    public DTController(DTService dtService) {
        this.dtService = dtService;
    }

    @GetMapping
    public List<DTResponse> listar(
            @RequestParam(required = false) Integer equipoId
    ) {
        return dtService.listar(equipoId);
    }

    @GetMapping("/{id}")
    public DTResponse buscarPorId(@PathVariable Integer id) {
        return dtService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DTResponse crear(
            @Valid @RequestBody DTRequest request
    ) {
        return dtService.crear(request);
    }

    @PutMapping("/{id}")
    public DTResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody DTRequest request
    ) {
        return dtService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        dtService.eliminar(id);
    }
}
