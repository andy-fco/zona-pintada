package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.CrearUsuarioRequest;
import com.zonapintada.zona_pintada.dto.UsuarioResponse;
import com.zonapintada.zona_pintada.entity.Usuario;
import com.zonapintada.zona_pintada.enums.RolUsuario;
import com.zonapintada.zona_pintada.exception.UsuarioDuplicadoException;
import com.zonapintada.zona_pintada.exception.UsuarioNoEncontradoException;
import com.zonapintada.zona_pintada.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioResponse registrar(CrearUsuarioRequest request) {
        if (usuarioRepository.findByMail(request.getMail()).isPresent()) {
            throw new UsuarioDuplicadoException(
                    "El correo electrónico ya está registrado."
            );
        }

        if (usuarioRepository.findByUsuario(request.getUsuario()).isPresent()) {
            throw new UsuarioDuplicadoException(
                    "El nombre de usuario ya está registrado."
            );
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setMail(request.getMail());
        usuario.setUsuario(request.getUsuario());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(RolUsuario.manager);

        Usuario guardado = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getApellido(),
                guardado.getMail(),
                guardado.getUsuario(),
                guardado.getRol()
        );
    }


    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(
                        "No se encontró el usuario."
                ));

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getMail(),
                usuario.getUsuario(),
                usuario.getRol()
        );
    }

}