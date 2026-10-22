
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.JugadorRequest;
import com.zonapintada.zona_pintada.dto.JugadorResponse;
import com.zonapintada.zona_pintada.service.JugadorService;
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
@RequestMapping("/api/jugadores")
public class JugadorController {

    private final JugadorService jugadorService;

    public JugadorController(JugadorService jugadorService) {
        this.jugadorService = jugadorService;
    }

    @GetMapping
    public List<JugadorResponse> listar(
            @RequestParam(required = false) Integer equipoId
    ) {
        return jugadorService.listar(equipoId);
    }

    @GetMapping("/{id}")
    public JugadorResponse buscarPorId(@PathVariable Integer id) {
        return jugadorService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JugadorResponse crear(
            @Valid @RequestBody JugadorRequest request
    ) {
        return jugadorService.crear(request);
    }

    @PutMapping("/{id}")
    public JugadorResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody JugadorRequest request
    ) {
        return jugadorService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        jugadorService.eliminar(id);
    }
}
