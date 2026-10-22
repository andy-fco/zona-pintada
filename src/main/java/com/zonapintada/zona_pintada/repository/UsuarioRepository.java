package com.zonapintada.zona_pintada.repository;

import com.zonapintada.zona_pintada.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByMail(String mail);

    Optional<Usuario> findByUsuario(String usuario);
}