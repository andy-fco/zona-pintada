package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.ActualizarUsuarioRequest;
import com.zonapintada.zona_pintada.dto.CrearUsuarioAdminRequest;
import com.zonapintada.zona_pintada.dto.UsuarioResponse;
import com.zonapintada.zona_pintada.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
public class UsuarioAdminController {

    private final UsuarioService usuarioService;

    public UsuarioAdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtenerPorId(@PathVariable Integer id) {
        return usuarioService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(
            @Valid @RequestBody CrearUsuarioAdminRequest request
    ) {
        return usuarioService.crearComoAdmin(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ActualizarUsuarioRequest request
    ) {
        return usuarioService.actualizarPerfil(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer id
    ) {
        usuarioService.eliminar(Integer.valueOf(jwt.getSubject()), id);
    }
}