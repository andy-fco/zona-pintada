package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.CrearEquipoFantasyRequest;
import com.zonapintada.zona_pintada.dto.EquipoFantasyResponse;
import com.zonapintada.zona_pintada.dto.NombreEquipoFantasyRequest;
import com.zonapintada.zona_pintada.service.EquipoFantasyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos-fantasy")
public class EquipoFantasyController {

    private final EquipoFantasyService equipoFantasyService;

    public EquipoFantasyController(EquipoFantasyService equipoFantasyService) {
        this.equipoFantasyService = equipoFantasyService;
    }

    @PostMapping
    public ResponseEntity<EquipoFantasyResponse> crear(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CrearEquipoFantasyRequest request
    ) {
        Integer usuarioId = Integer.valueOf(jwt.getSubject());

        EquipoFantasyResponse response =
                equipoFantasyService.crearEquipoFantasy(usuarioId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EquipoFantasyResponse>> listar(
            @RequestParam(required = false) Integer usuarioId,
            @RequestParam(required = false) Integer temporadaId
    ) {
        return ResponseEntity.ok(
                equipoFantasyService.listar(usuarioId, temporadaId)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<EquipoFantasyResponse> obtenerDelUsuario(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(
                equipoFantasyService.obtenerDelUsuario(
                        Integer.valueOf(jwt.getSubject())
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoFantasyResponse> obtenerPorId(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(equipoFantasyService.obtenerPorId(id));
    }

    @PutMapping("/me/nombre")
    public ResponseEntity<EquipoFantasyResponse> actualizarNombreDelUsuario(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody NombreEquipoFantasyRequest request
    ) {
        return ResponseEntity.ok(
                equipoFantasyService.actualizarNombreDelUsuario(
                        Integer.valueOf(jwt.getSubject()),
                        request.getNombre()
                )
        );
    }
}