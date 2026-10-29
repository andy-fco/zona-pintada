package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.ActualizarPartidoRequest;
import com.zonapintada.zona_pintada.dto.CrearPartidoRequest;
import com.zonapintada.zona_pintada.dto.PartidoResponse;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.entity.Fecha;
import com.zonapintada.zona_pintada.entity.Partido;
import com.zonapintada.zona_pintada.enums.EstadoPartido;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import com.zonapintada.zona_pintada.repository.FechaRepository;
import com.zonapintada.zona_pintada.repository.PartidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PartidoService {

    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;
    private final FechaRepository fechaRepository;
    private final DTPartidoService dtPartidoService;

    public PartidoService(
            PartidoRepository partidoRepository,
            EquipoRepository equipoRepository,
            FechaRepository fechaRepository,
            DTPartidoService dtPartidoService) {
        this.partidoRepository = partidoRepository;
        this.equipoRepository = equipoRepository;
        this.fechaRepository = fechaRepository;
        this.dtPartidoService = dtPartidoService;
    }

    @Transactional(readOnly = true)
    public List<PartidoResponse> listarTodos() {
        return partidoRepository.findAllByOrderByFechaAscHoraAsc()
                .stream()
                .map(PartidoResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public PartidoResponse obtenerPorId(Integer id) {
        Partido partido = buscarPartido(id);
        return PartidoResponse.desde(partido);
    }

    @Transactional
    public PartidoResponse crear(CrearPartidoRequest request) {
        if (request.getEquipoLocalId().equals(request.getEquipoVisitanteId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El equipo local y el visitante deben ser distintos"
            );
        }

        Equipo equipoLocal = equipoRepository.findById(request.getEquipoLocalId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No existe el equipo local"
                ));

        Equipo equipoVisitante = equipoRepository.findById(request.getEquipoVisitanteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No existe el equipo visitante"
                ));

        Fecha fechaCompetencia = fechaRepository
                .findById(request.getFechaCompetenciaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No existe la fecha de competencia"
                ));

        Partido partido = new Partido();
        partido.setEquipoLocal(equipoLocal);
        partido.setEquipoVisitante(equipoVisitante);
        partido.setFechaCompetencia(fechaCompetencia);
        partido.setFecha(request.getFecha());
        partido.setHora(request.getHora());
        partido.setEstado(EstadoPartido.programado);

        return PartidoResponse.desde(partidoRepository.save(partido));
    }

    @Transactional
    public PartidoResponse actualizar(
            Integer id,
            ActualizarPartidoRequest request) {

        validarMarcador(request);

        if (request.getEstado() == EstadoPartido.finalizado
                && request.getPuntosLocal() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Un partido finalizado debe tener ambos puntajes cargados"
            );
        }

        Partido partido = buscarPartido(id);
        partido.setFecha(request.getFecha());
        partido.setHora(request.getHora());
        partido.setPuntosLocal(request.getPuntosLocal());
        partido.setPuntosVisitante(request.getPuntosVisitante());
        partido.setEstado(request.getEstado());

        Partido partidoGuardado = partidoRepository.save(partido);
        dtPartidoService.procesarResultado(partidoGuardado);

        return PartidoResponse.desde(partidoGuardado);
    }

    private void validarMarcador(ActualizarPartidoRequest request) {
        if ((request.getPuntosLocal() == null)
                != (request.getPuntosVisitante() == null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los puntos de ambos equipos deben informarse juntos"
            );
        }
    }

    private Partido buscarPartido(Integer id) {
        return partidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe el partido solicitado"
                ));
    }
}