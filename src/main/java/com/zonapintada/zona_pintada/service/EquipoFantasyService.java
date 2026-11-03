package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.CrearEquipoFantasyRequest;
import com.zonapintada.zona_pintada.dto.EquipoFantasyResponse;
import com.zonapintada.zona_pintada.entity.*;
import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;
import com.zonapintada.zona_pintada.enums.RolUsuario;
import com.zonapintada.zona_pintada.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
public class EquipoFantasyService {

    private static final BigDecimal PRESUPUESTO_MAXIMO =
            new BigDecimal("110");

    private final EquipoFantasyRepository equipoFantasyRepository;
    private final EquipoFantasyJugadorRepository equipoFantasyJugadorRepository;
    private final EquipoFantasyDTRepository equipoFantasyDTRepository;
    private final UsuarioRepository usuarioRepository;
    private final TemporadaRepository temporadaRepository;
    private final JugadorRepository jugadorRepository;
    private final DTRepository dtRepository;

    public EquipoFantasyService(
            EquipoFantasyRepository equipoFantasyRepository,
            EquipoFantasyJugadorRepository equipoFantasyJugadorRepository,
            EquipoFantasyDTRepository equipoFantasyDTRepository,
            UsuarioRepository usuarioRepository,
            TemporadaRepository temporadaRepository,
            JugadorRepository jugadorRepository,
            DTRepository dtRepository
    ) {
        this.equipoFantasyRepository = equipoFantasyRepository;
        this.equipoFantasyJugadorRepository = equipoFantasyJugadorRepository;
        this.equipoFantasyDTRepository = equipoFantasyDTRepository;
        this.usuarioRepository = usuarioRepository;
        this.temporadaRepository = temporadaRepository;
        this.jugadorRepository = jugadorRepository;
        this.dtRepository = dtRepository;
    }

    @Transactional
    public EquipoFantasyResponse crearEquipoFantasy(
            Integer usuarioId,
            CrearEquipoFantasyRequest request
    ) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No se encontró el usuario."
                ));

        if (usuario.getRol() != RolUsuario.manager) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo los managers pueden crear equipos fantasy."
            );
        }

        Temporada temporada = temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa."
                ));

        if (equipoFantasyRepository.existsByUsuario_IdAndTemporada_Id(
                usuarioId, temporada.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya tenés un equipo fantasy creado para esta temporada."
            );
        }

        validarCantidadYRoles(request.getJugadores());

        Set<Integer> jugadoresIds = new HashSet<>();

        for (CrearEquipoFantasyRequest.JugadorFantasyRequest jugadorRequest
                : request.getJugadores()) {

            if (!jugadoresIds.add(jugadorRequest.getJugadorId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No podés incluir al mismo jugador más de una vez."
                );
            }
        }

        List<Jugador> jugadores = jugadorRepository.findAllById(jugadoresIds);

        if (jugadores.size() != 10) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Uno o más jugadores seleccionados no existen."
            );
        }

        Map<Integer, Jugador> jugadoresPorId = new HashMap<>();

        for (Jugador jugador : jugadores) {
            jugadoresPorId.put(jugador.getId(), jugador);
        }

        validarComposicion(request.getJugadores(), jugadoresPorId);

        DT dt = dtRepository.findById(request.getDtId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el director técnico seleccionado."
                ));

        BigDecimal presupuestoUtilizado = dt.getValor();

        for (Jugador jugador : jugadores) {
            presupuestoUtilizado = presupuestoUtilizado.add(jugador.getValor());
        }

        if (presupuestoUtilizado.compareTo(PRESUPUESTO_MAXIMO) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El plantel supera el presupuesto máximo de 110 millones."
            );
        }

        EquipoFantasy equipoFantasy = new EquipoFantasy();
        equipoFantasy.setNombre(request.getNombre().trim());
        equipoFantasy.setUsuario(usuario);
        equipoFantasy.setTemporada(temporada);
        equipoFantasy.setPresupuestoMaximo(PRESUPUESTO_MAXIMO);
        equipoFantasy.setTokensTraspaso(1);
        equipoFantasy.setPuntosTotales(0);

        equipoFantasy = equipoFantasyRepository.save(equipoFantasy);

        List<EquipoFantasyJugador> plantel = new ArrayList<>();

        for (CrearEquipoFantasyRequest.JugadorFantasyRequest jugadorRequest
                : request.getJugadores()) {

            Jugador jugador = jugadoresPorId.get(jugadorRequest.getJugadorId());
            boolean titular = jugadorRequest.getTitular();
            RolPlantelFantasy rol = jugadorRequest.getRol();

            BigDecimal multiplicador = calcularMultiplicador(titular, rol);

            EquipoFantasyJugador equipoFantasyJugador = new EquipoFantasyJugador();
            equipoFantasyJugador.setEquipoFantasy(equipoFantasy);
            equipoFantasyJugador.setJugador(jugador);
            equipoFantasyJugador.setTitular(titular);
            equipoFantasyJugador.setRol(rol);
            equipoFantasyJugador.setMultiplicador(multiplicador);

            plantel.add(equipoFantasyJugador);
        }

        equipoFantasyJugadorRepository.saveAll(plantel);

        EquipoFantasyDT equipoFantasyDT = new EquipoFantasyDT();
        equipoFantasyDT.setEquipoFantasy(equipoFantasy);
        equipoFantasyDT.setDt(dt);

        equipoFantasyDTRepository.save(equipoFantasyDT);

        return convertirAResponse(equipoFantasy, plantel, dt);
    }

    @Transactional(readOnly = true)
    public List<EquipoFantasyResponse> listar(
            Integer usuarioId,
            Integer temporadaId
    ) {
        Integer id = temporadaId != null
                ? temporadaId
                : obtenerTemporadaActiva().getId();

        return equipoFantasyRepository.buscar(id, usuarioId)
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipoFantasyResponse obtenerPorId(Integer id) {
        return convertirAResponse(buscarEquipo(id));
    }

    @Transactional(readOnly = true)
    public EquipoFantasyResponse obtenerDelUsuario(Integer usuarioId) {
        return convertirAResponse(buscarEquipoDelUsuario(usuarioId));
    }

    @Transactional
    public EquipoFantasyResponse actualizarNombreDelUsuario(
            Integer usuarioId,
            String nombre
    ) {
        EquipoFantasy equipoFantasy = buscarEquipoDelUsuario(usuarioId);
        equipoFantasy.setNombre(nombre.trim());

        return convertirAResponse(equipoFantasyRepository.save(equipoFantasy));
    }

    @Transactional
    public EquipoFantasyResponse actualizarNombre(Integer id, String nombre) {
        EquipoFantasy equipoFantasy = buscarEquipo(id);
        equipoFantasy.setNombre(nombre.trim());

        return convertirAResponse(equipoFantasyRepository.save(equipoFantasy));
    }

    @Transactional
    public void eliminar(Integer id) {
        EquipoFantasy equipoFantasy = buscarEquipo(id);

        equipoFantasyJugadorRepository.deleteByEquipoFantasy_Id(id);
        equipoFantasyDTRepository.deleteById(id);
        equipoFantasyRepository.delete(equipoFantasy);
    }

    private EquipoFantasy buscarEquipo(Integer id) {
        return equipoFantasyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe el equipo fantasy solicitado."
                ));
    }

    private EquipoFantasy buscarEquipoDelUsuario(Integer usuarioId) {
        return equipoFantasyRepository
                .findByUsuario_IdAndTemporada_Id(
                        usuarioId,
                        obtenerTemporadaActiva().getId()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No tenés un equipo fantasy en la temporada activa."
                ));
    }

    private Temporada obtenerTemporadaActiva() {
        return temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa."
                ));
    }

    private EquipoFantasyResponse convertirAResponse(EquipoFantasy equipoFantasy) {
        Integer id = equipoFantasy.getId();

        List<EquipoFantasyJugador> plantel = equipoFantasyJugadorRepository
                .findByEquipoFantasy_IdOrderByTitularDesc(id);

        DT dt = equipoFantasyDTRepository.findById(id)
                .map(EquipoFantasyDT::getDt)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El equipo fantasy no tiene un DT asignado."
                ));

        return convertirAResponse(equipoFantasy, plantel, dt);
    }

    private EquipoFantasyResponse convertirAResponse(
            EquipoFantasy equipoFantasy,
            List<EquipoFantasyJugador> plantel,
            DT dt
    ) {
        BigDecimal presupuestoUtilizado = dt.getValor();

        List<EquipoFantasyResponse.JugadorFantasyResponse> jugadoresResponse =
                new ArrayList<>();

        for (EquipoFantasyJugador integrante : plantel) {
            Jugador jugador = integrante.getJugador();

            presupuestoUtilizado = presupuestoUtilizado.add(jugador.getValor());

            jugadoresResponse.add(new EquipoFantasyResponse.JugadorFantasyResponse(
                    jugador.getId(),
                    jugador.getNombre(),
                    jugador.getApellido(),
                    jugador.getValor(),
                    jugador.getEquipo().getId(),
                    jugador.getEquipo().getNombre(),
                    integrante.isTitular(),
                    integrante.getRol(),
                    integrante.getMultiplicador()
            ));
        }

        EquipoFantasyResponse.DTFantasyResponse dtResponse =
                new EquipoFantasyResponse.DTFantasyResponse(
                        dt.getId(),
                        dt.getNombre(),
                        dt.getApellido(),
                        dt.getValor(),
                        dt.getEquipo().getId(),
                        dt.getEquipo().getNombre()
                );

        return new EquipoFantasyResponse(
                equipoFantasy.getId(),
                equipoFantasy.getNombre(),
                equipoFantasy.getUsuario().getId(),
                equipoFantasy.getUsuario().getUsuario(),
                equipoFantasy.getTemporada().getId(),
                equipoFantasy.getTemporada().getNombre(),
                equipoFantasy.getPresupuestoMaximo(),
                presupuestoUtilizado,
                equipoFantasy.getPresupuestoMaximo().subtract(presupuestoUtilizado),
                equipoFantasy.getTokensTraspaso(),
                equipoFantasy.getPuntosTotales(),
                dtResponse,
                jugadoresResponse
        );
    }

    private void validarCantidadYRoles(
            List<CrearEquipoFantasyRequest.JugadorFantasyRequest> jugadores
    ) {
        long titulares = jugadores.stream()
                .filter(j -> Boolean.TRUE.equals(j.getTitular()))
                .count();

        long suplentes = jugadores.size() - titulares;

        long capitanes = jugadores.stream()
                .filter(j -> j.getRol() == RolPlantelFantasy.capitan)
                .count();

        long sextosHombres = jugadores.stream()
                .filter(j -> j.getRol() == RolPlantelFantasy.sexto_hombre)
                .count();

        long normales = jugadores.stream()
                .filter(j -> j.getRol() == RolPlantelFantasy.normal)
                .count();

        if (titulares != 5 || suplentes != 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El plantel debe tener exactamente 5 titulares y 5 suplentes."
            );
        }

        if (capitanes != 1 || sextosHombres != 1 || normales != 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El plantel debe tener 1 capitán, 1 sexto hombre y 8 jugadores normales."
            );
        }

        for (CrearEquipoFantasyRequest.JugadorFantasyRequest jugador : jugadores) {

            if (jugador.getRol() == RolPlantelFantasy.capitan
                    && !Boolean.TRUE.equals(jugador.getTitular())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El capitán debe ser titular."
                );
            }

            if (jugador.getRol() == RolPlantelFantasy.sexto_hombre
                    && Boolean.TRUE.equals(jugador.getTitular())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El sexto hombre debe ser suplente."
                );
            }
        }
    }

    private void validarComposicion(
            List<CrearEquipoFantasyRequest.JugadorFantasyRequest> jugadores,
            Map<Integer, Jugador> jugadoresPorId
    ) {
        Set<String> puestosCubiertos = new HashSet<>();

        for (CrearEquipoFantasyRequest.JugadorFantasyRequest jugadorRequest : jugadores) {
            Jugador jugador = jugadoresPorId.get(jugadorRequest.getJugadorId());
            String puesto = jugador.getPosicion().getValor()
                    + "-" + jugadorRequest.getTitular();

            if (!puestosCubiertos.add(puesto)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El plantel debe tener un titular y un suplente por cada posición."
                );
            }
        }
    }

    private BigDecimal calcularMultiplicador(
            boolean titular,
            RolPlantelFantasy rol
    ) {
        if (rol == RolPlantelFantasy.capitan) {
            return new BigDecimal("1.2");
        }

        if (rol == RolPlantelFantasy.sexto_hombre) {
            return new BigDecimal("0.8");
        }

        return titular
                ? new BigDecimal("1.0")
                : new BigDecimal("0.5");
    }
}