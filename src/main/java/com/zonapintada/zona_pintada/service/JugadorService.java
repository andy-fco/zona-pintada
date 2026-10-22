
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.JugadorRequest;
import com.zonapintada.zona_pintada.dto.JugadorResponse;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.entity.Jugador;
import com.zonapintada.zona_pintada.enums.ManoHabil;
import com.zonapintada.zona_pintada.enums.PosicionJugador;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import com.zonapintada.zona_pintada.repository.JugadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final EquipoRepository equipoRepository;

    public JugadorService(
            JugadorRepository jugadorRepository,
            EquipoRepository equipoRepository
    ) {
        this.jugadorRepository = jugadorRepository;
        this.equipoRepository = equipoRepository;
    }

    @Transactional(readOnly = true)
    public List<JugadorResponse> listar(Integer equipoId) {
        List<Jugador> jugadores;

        if (equipoId == null) {
            jugadores = jugadorRepository
                    .findAllByOrderByApellidoAscNombreAsc();
        } else {
            jugadores = jugadorRepository
                    .findAllByEquipo_IdOrderByApellidoAscNombreAsc(equipoId);
        }

        return jugadores.stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JugadorResponse buscarPorId(Integer id) {
        return convertirAResponse(obtenerJugador(id));
    }

    @Transactional
    public JugadorResponse crear(JugadorRequest request) {
        Jugador jugador = new Jugador();
        aplicarDatos(jugador, request);

        Jugador jugadorGuardado = jugadorRepository.save(jugador);

        return convertirAResponse(jugadorGuardado);
    }

    @Transactional
    public JugadorResponse actualizar(Integer id, JugadorRequest request) {
        Jugador jugador = obtenerJugador(id);
        aplicarDatos(jugador, request);

        Jugador jugadorActualizado = jugadorRepository.save(jugador);

        return convertirAResponse(jugadorActualizado);
    }

    @Transactional
    public void eliminar(Integer id) {
        Jugador jugador = obtenerJugador(id);
        jugadorRepository.delete(jugador);
    }

    private Jugador obtenerJugador(Integer id) {
        return jugadorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un jugador con el ID " + id
                ));
    }

    private Equipo obtenerEquipo(Integer equipoId) {
        return equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un equipo con el ID " + equipoId
                ));
    }

    private void aplicarDatos(Jugador jugador, JugadorRequest request) {
        jugador.setNombre(request.getNombre().trim());
        jugador.setApellido(request.getApellido().trim());
        jugador.setFotoUrl(limpiarOpcional(request.getFotoUrl()));
        jugador.setFechaNacimiento(request.getFechaNacimiento());
        jugador.setCiudad(limpiarOpcional(request.getCiudad()));
        jugador.setAltura(request.getAltura());

        jugador.setPosicion(
                PosicionJugador.fromValor(request.getPosicion())
        );

        jugador.setManoHabil(
                request.getManoHabil() == null
                        || request.getManoHabil().isBlank()
                        ? null
                        : ManoHabil.fromValor(request.getManoHabil())
        );

        jugador.setPais(limpiarOpcional(request.getPais()));
        jugador.setValor(request.getValor());
        jugador.setEquipo(obtenerEquipo(request.getEquipoId()));
    }

    private String limpiarOpcional(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor.trim();
    }

    private JugadorResponse convertirAResponse(Jugador jugador) {
        return new JugadorResponse(
                jugador.getId(),
                jugador.getNombre(),
                jugador.getApellido(),
                jugador.getFotoUrl(),
                jugador.getFechaNacimiento(),
                jugador.getCiudad(),
                jugador.getAltura(),
                jugador.getPosicion(),
                jugador.getManoHabil(),
                jugador.getPais(),
                jugador.getValor(),
                jugador.getEquipo().getId(),
                jugador.getEquipo().getNombre()
        );
    }
}
