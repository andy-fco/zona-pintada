package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.ActualizarUsuarioRequest;
import com.zonapintada.zona_pintada.dto.CambiarPasswordRequest;
import com.zonapintada.zona_pintada.dto.CrearUsuarioRequest;
import com.zonapintada.zona_pintada.dto.UsuarioResponse;
import com.zonapintada.zona_pintada.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(
            @Valid @RequestBody CrearUsuarioRequest request
    ) {
        return usuarioService.registrar(request);
    }

    @GetMapping("/me")
    public UsuarioResponse obtenerUsuarioAutenticado(
            @AuthenticationPrincipal Jwt jwt
    ) {
        if (jwt == null || jwt.getSubject() == null) {
            throw new IllegalStateException(
                    "El token no contiene un identificador de usuario."
            );
        }

        Integer usuarioId = Integer.valueOf(jwt.getSubject());
        return usuarioService.obtenerPorId(usuarioId);
    }

    @PutMapping("/me")
    public UsuarioResponse actualizarPerfil(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ActualizarUsuarioRequest request
    ) {
        return usuarioService.actualizarPerfil(
                Integer.valueOf(jwt.getSubject()),
                request
        );
    }

    @PutMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cambiarPassword(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CambiarPasswordRequest request
    ) {
        usuarioService.cambiarPassword(
                Integer.valueOf(jwt.getSubject()),
                request
        );
    }
}