package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.EquipoFantasyResponse;
import com.zonapintada.zona_pintada.dto.NombreEquipoFantasyRequest;
import com.zonapintada.zona_pintada.service.EquipoFantasyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/equipos-fantasy")
public class EquipoFantasyAdminController {

    private final EquipoFantasyService equipoFantasyService;

    public EquipoFantasyAdminController(EquipoFantasyService equipoFantasyService) {
        this.equipoFantasyService = equipoFantasyService;
    }

    @PutMapping("/{id}/nombre")
    public EquipoFantasyResponse actualizarNombre(
            @PathVariable Integer id,
            @Valid @RequestBody NombreEquipoFantasyRequest request
    ) {
        return equipoFantasyService.actualizarNombre(id, request.getNombre());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        equipoFantasyService.eliminar(id);
    }
}