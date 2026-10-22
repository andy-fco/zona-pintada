
package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.EquipoRequest;
import com.zonapintada.zona_pintada.dto.EquipoResponse;
import com.zonapintada.zona_pintada.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @GetMapping
    public List<EquipoResponse> listar() {
        return equipoService.listarTodos();
    }

    @GetMapping("/{id}")
    public EquipoResponse buscarPorId(@PathVariable Integer id) {
        return equipoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipoResponse crear(
            @Valid @RequestBody EquipoRequest request
    ) {
        return equipoService.crear(request);
    }

    @PutMapping("/{id}")
    public EquipoResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody EquipoRequest request
    ) {
        return equipoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        equipoService.eliminar(id);
    }
}
