
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.ActualizarEstadisticasJugadorRequest;
import com.zonapintada.zona_pintada.dto.JugadorPartidoResponse;
import com.zonapintada.zona_pintada.dto.RegistrarJugadorPartidoRequest;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.entity.Jugador;
import com.zonapintada.zona_pintada.entity.JugadorPartido;
import com.zonapintada.zona_pintada.entity.Partido;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import com.zonapintada.zona_pintada.repository.JugadorPartidoRepository;
import com.zonapintada.zona_pintada.repository.JugadorRepository;
import com.zonapintada.zona_pintada.repository.PartidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class JugadorPartidoService {

    private final JugadorPartidoRepository jugadorPartidoRepository;
    private final JugadorRepository jugadorRepository;
    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;
    private final PuntuacionFantasyService puntuacionFantasyService;

    public JugadorPartidoService(
            JugadorPartidoRepository jugadorPartidoRepository,
            JugadorRepository jugadorRepository,
            PartidoRepository partidoRepository,
            EquipoRepository equipoRepository,
            PuntuacionFantasyService puntuacionFantasyService) {
        this.jugadorPartidoRepository = jugadorPartidoRepository;
        this.jugadorRepository = jugadorRepository;
        this.partidoRepository = partidoRepository;
        this.equipoRepository = equipoRepository;
        this.puntuacionFantasyService = puntuacionFantasyService;
    }

    @Transactional(readOnly = true)
    public List<JugadorPartidoResponse> listarPorPartido(Integer partidoId) {
        buscarPartido(partidoId);

        return jugadorPartidoRepository
                .findByPartido_IdOrderByJugador_ApellidoAscJugador_NombreAsc(partidoId)
                .stream()
                .map(JugadorPartidoResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public JugadorPartidoResponse obtener(Integer partidoId, Integer jugadorId) {
        return JugadorPartidoResponse.desde(
                buscarEstadistica(partidoId, jugadorId));
    }

    public JugadorPartidoResponse registrar(
            Integer partidoId, RegistrarJugadorPartidoRequest request) {

        Partido partido = buscarPartido(partidoId);
        Jugador jugador = jugadorRepository.findById(request.getJugadorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Jugador no encontrado"));

        Equipo equipo = equipoRepository.findById(request.getEquipoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        validarEquipoDelPartido(partido, equipo);
        validarEquipoDelJugador(jugador, equipo);
        validarLanzamientos(
                request.getDoblesConvertidos(), request.getDoblesIntentados(),
                request.getTriplesConvertidos(), request.getTriplesIntentados(),
                request.getLibresConvertidos(), request.getLibresIntentados());

        if (jugadorPartidoRepository
                .findByJugador_IdAndPartido_Id(jugador.getId(), partidoId)
                .isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El jugador ya tiene estadísticas cargadas para este partido");
        }

        JugadorPartido estadistica = new JugadorPartido();
        estadistica.setJugador(jugador);
        estadistica.setPartido(partido);
        estadistica.setEquipo(equipo);

        copiarEstadisticas(
                estadistica,
                request.getTitular(),
                request.getPuntos(),
                request.getDoblesConvertidos(),
                request.getDoblesIntentados(),
                request.getTriplesConvertidos(),
                request.getTriplesIntentados(),
                request.getLibresConvertidos(),
                request.getLibresIntentados(),
                request.getRebotesOfensivos(),
                request.getRebotesDefensivos(),
                request.getAsistencias(),
                request.getRecuperos(),
                request.getPerdidas(),
                request.getTapones(),
                request.getTaponesRecibidos(),
                request.getFaltasPersonales(),
                request.getFaltasRecibidas(),
                request.getMasMenos(),
                request.getValoracion());

        estadistica.setPuntosFantasy(
                puntuacionFantasyService.calcular(estadistica));

        return JugadorPartidoResponse.desde(
                jugadorPartidoRepository.save(estadistica));
    }

    public JugadorPartidoResponse actualizar(
            Integer partidoId,
            Integer jugadorId,
            ActualizarEstadisticasJugadorRequest request) {

        JugadorPartido estadistica = buscarEstadistica(partidoId, jugadorId);

        validarLanzamientos(
                request.getDoblesConvertidos(), request.getDoblesIntentados(),
                request.getTriplesConvertidos(), request.getTriplesIntentados(),
                request.getLibresConvertidos(), request.getLibresIntentados());

        copiarEstadisticas(
                estadistica,
                request.getTitular(),
                request.getPuntos(),
                request.getDoblesConvertidos(),
                request.getDoblesIntentados(),
                request.getTriplesConvertidos(),
                request.getTriplesIntentados(),
                request.getLibresConvertidos(),
                request.getLibresIntentados(),
                request.getRebotesOfensivos(),
                request.getRebotesDefensivos(),
                request.getAsistencias(),
                request.getRecuperos(),
                request.getPerdidas(),
                request.getTapones(),
                request.getTaponesRecibidos(),
                request.getFaltasPersonales(),
                request.getFaltasRecibidas(),
                request.getMasMenos(),
                request.getValoracion());

        estadistica.setPuntosFantasy(
                puntuacionFantasyService.calcular(estadistica));

        return JugadorPartidoResponse.desde(
                jugadorPartidoRepository.save(estadistica));
    }

    public void eliminar(Integer partidoId, Integer jugadorId) {
        JugadorPartido estadistica = buscarEstadistica(partidoId, jugadorId);
        jugadorPartidoRepository.delete(estadistica);
    }

    private Partido buscarPartido(Integer partidoId) {
        return partidoRepository.findById(partidoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Partido no encontrado"));
    }

    private JugadorPartido buscarEstadistica(
            Integer partidoId, Integer jugadorId) {
        return jugadorPartidoRepository
                .findByJugador_IdAndPartido_Id(jugadorId, partidoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay estadísticas de ese jugador para este partido"));
    }

    private void validarEquipoDelPartido(Partido partido, Equipo equipo) {
        boolean participa =
                partido.getEquipoLocal().getId().equals(equipo.getId())
                        || partido.getEquipoVisitante().getId().equals(equipo.getId());

        if (!participa) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El equipo no participa en este partido");
        }
    }

    private void validarEquipoDelJugador(Jugador jugador, Equipo equipo) {
        if (jugador.getEquipo() == null
                || !jugador.getEquipo().getId().equals(equipo.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El jugador no pertenece actualmente al equipo indicado");
        }
    }

    private void validarLanzamientos(
            Integer doblesConvertidos, Integer doblesIntentados,
            Integer triplesConvertidos, Integer triplesIntentados,
            Integer libresConvertidos, Integer libresIntentados) {

        if (doblesConvertidos > doblesIntentados
                || triplesConvertidos > triplesIntentados
                || libresConvertidos > libresIntentados) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los lanzamientos convertidos no pueden superar los intentados");
        }
    }

    private void copiarEstadisticas(
            JugadorPartido jp,
            Boolean titular,
            Integer puntos,
            Integer doblesConvertidos,
            Integer doblesIntentados,
            Integer triplesConvertidos,
            Integer triplesIntentados,
            Integer libresConvertidos,
            Integer libresIntentados,
            Integer rebotesOfensivos,
            Integer rebotesDefensivos,
            Integer asistencias,
            Integer recuperos,
            Integer perdidas,
            Integer tapones,
            Integer taponesRecibidos,
            Integer faltasPersonales,
            Integer faltasRecibidas,
            Integer masMenos,
            Integer valoracion) {

        jp.setTitular(titular);
        jp.setPuntos(puntos);
        jp.setDoblesConvertidos(doblesConvertidos);
        jp.setDoblesIntentados(doblesIntentados);
        jp.setTriplesConvertidos(triplesConvertidos);
        jp.setTriplesIntentados(triplesIntentados);
        jp.setLibresConvertidos(libresConvertidos);
        jp.setLibresIntentados(libresIntentados);
        jp.setRebotesOfensivos(rebotesOfensivos);
        jp.setRebotesDefensivos(rebotesDefensivos);
        jp.setAsistencias(asistencias);
        jp.setRecuperos(recuperos);
        jp.setPerdidas(perdidas);
        jp.setTapones(tapones);
        jp.setTaponesRecibidos(taponesRecibidos);
        jp.setFaltasPersonales(faltasPersonales);
        jp.setFaltasRecibidas(faltasRecibidas);
        jp.setMasMenos(masMenos);
        jp.setValoracion(valoracion);
    }
}
