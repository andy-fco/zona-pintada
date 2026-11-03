
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.LoginRequest;
import com.zonapintada.zona_pintada.dto.LoginResponse;
import com.zonapintada.zona_pintada.entity.Usuario;
import com.zonapintada.zona_pintada.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    public LoginResponse login(LoginRequest request) {
        String identificador = request.getIdentificador().trim();


        Usuario usuario = usuarioRepository.findByUsuario(identificador)
                .or(() -> usuarioRepository.findByMail(identificador))
                .orElseThrow(CredencialesInvalidasException::new);

        boolean coincide = passwordEncoder.matches(
                request.getPassword(),
                usuario.getPasswordHash()
        );


        if (!coincide) {
            throw new CredencialesInvalidasException();
        }

        String token = jwtService.generarToken(
                usuario.getId(),
                usuario.getUsuario(),
                usuario.getRol()
        );


        return new LoginResponse(token, jwtService.getDuracionSegundos());
    }


    public static class CredencialesInvalidasException
            extends RuntimeException {
    }
}
