package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.ActualizarUsuarioRequest;
import com.zonapintada.zona_pintada.dto.CambiarPasswordRequest;
import com.zonapintada.zona_pintada.dto.CrearUsuarioAdminRequest;
import com.zonapintada.zona_pintada.dto.CrearUsuarioRequest;
import com.zonapintada.zona_pintada.dto.UsuarioResponse;
import com.zonapintada.zona_pintada.entity.Usuario;
import com.zonapintada.zona_pintada.enums.RolUsuario;
import com.zonapintada.zona_pintada.exception.UsuarioDuplicadoException;
import com.zonapintada.zona_pintada.exception.UsuarioNoEncontradoException;
import com.zonapintada.zona_pintada.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
        return crear(request, RolUsuario.manager);
    }

    @Transactional
    public UsuarioResponse crearComoAdmin(CrearUsuarioAdminRequest request) {
        return crear(request, request.getRol());
    }

    private UsuarioResponse crear(CrearUsuarioRequest request, RolUsuario rol) {
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
        usuario.setRol(rol);

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

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll(Sort.by("apellido", "nombre"))
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(
            Integer id,
            ActualizarUsuarioRequest request
    ) {
        Usuario usuario = buscarUsuario(id);

        boolean mailOcupado = usuarioRepository.findByMail(request.getMail())
                .filter(otro -> !otro.getId().equals(id))
                .isPresent();

        if (mailOcupado) {
            throw new UsuarioDuplicadoException(
                    "El correo electrónico ya está registrado."
            );
        }

        boolean usuarioOcupado = usuarioRepository.findByUsuario(request.getUsuario())
                .filter(otro -> !otro.getId().equals(id))
                .isPresent();

        if (usuarioOcupado) {
            throw new UsuarioDuplicadoException(
                    "El nombre de usuario ya está registrado."
            );
        }

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setMail(request.getMail());
        usuario.setUsuario(request.getUsuario());

        return convertirAResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void cambiarPassword(Integer id, CambiarPasswordRequest request) {
        Usuario usuario = buscarUsuario(id);

        if (!passwordEncoder.matches(
                request.getPasswordActual(),
                usuario.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La contraseña actual es incorrecta."
            );
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminar(Integer administradorId, Integer id) {
        if (administradorId.equals(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un administrador no puede eliminar su propia cuenta."
            );
        }

        usuarioRepository.delete(buscarUsuario(id));
    }

    private Usuario buscarUsuario(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(
                        "No se encontró el usuario."
                ));
    }

    private UsuarioResponse convertirAResponse(Usuario usuario) {
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