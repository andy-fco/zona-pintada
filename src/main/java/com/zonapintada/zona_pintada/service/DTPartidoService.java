package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.DTPartidoResponse;
import com.zonapintada.zona_pintada.entity.DT;
import com.zonapintada.zona_pintada.entity.DTPartido;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.entity.Partido;
import com.zonapintada.zona_pintada.enums.EstadoPartido;
import com.zonapintada.zona_pintada.repository.DTPartidoRepository;
import com.zonapintada.zona_pintada.repository.DTRepository;
import com.zonapintada.zona_pintada.repository.PartidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DTPartidoService {

    private final DTPartidoRepository dtPartidoRepository;
    private final DTRepository dtRepository;
    private final PartidoRepository partidoRepository;

    public DTPartidoService(
            DTPartidoRepository dtPartidoRepository,
            DTRepository dtRepository,
            PartidoRepository partidoRepository) {
        this.dtPartidoRepository = dtPartidoRepository;
        this.dtRepository = dtRepository;
        this.partidoRepository = partidoRepository;
    }

    @Transactional(readOnly = true)
    public List<DTPartidoResponse> listarPorPartido(Integer partidoId) {
        buscarPartido(partidoId);

        return dtPartidoRepository
                .findByPartido_IdOrderByDt_ApellidoAscDt_NombreAsc(partidoId)
                .stream()
                .map(DTPartidoResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public DTPartidoResponse obtenerPorPartidoYDT(
            Integer partidoId,
            Integer dtId) {

        DTPartido registro = dtPartidoRepository
                .findByDt_IdAndPartido_Id(dtId, partidoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existen estadísticas fantasy para ese DT y partido"
                ));

        return DTPartidoResponse.desde(registro);
    }

    @Transactional
    public List<DTPartidoResponse> recalcular(Integer partidoId) {
        Partido partido = buscarPartido(partidoId);

        if (partido.getEstado() != EstadoPartido.finalizado) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo se pueden calcular puntos de un partido finalizado"
            );
        }

        procesarResultado(partido);

        return listarPorPartido(partidoId);
    }

    @Transactional
    public void procesarResultado(Partido partido) {
        if (partido.getId() == null) {
            return;
        }

        if (partido.getEstado() != EstadoPartido.finalizado) {
            dtPartidoRepository.deleteByPartido_Id(partido.getId());
            return;
        }

        if (partido.getPuntosLocal() == null
                || partido.getPuntosVisitante() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El partido finalizado debe tener ambos puntajes cargados"
            );
        }

        dtPartidoRepository.deleteByPartido_Id(partido.getId());
        dtPartidoRepository.flush();

        List<DT> entrenadores = dtRepository.findAll();

        for (DT dt : entrenadores) {
            Equipo equipoDT = dt.getEquipo();

            boolean esLocal = equipoDT.getId().equals(
                    partido.getEquipoLocal().getId()
            );

            boolean esVisitante = equipoDT.getId().equals(
                    partido.getEquipoVisitante().getId()
            );

            if (!esLocal && !esVisitante) {
                continue;
            }

            int puntosDT = esLocal
                    ? partido.getPuntosLocal()
                    : partido.getPuntosVisitante();

            int puntosRival = esLocal
                    ? partido.getPuntosVisitante()
                    : partido.getPuntosLocal();

            int puntosFantasy = calcularPuntos(
                    esLocal,
                    puntosDT,
                    puntosRival
            );

            DTPartido registro = new DTPartido();
            registro.setDt(dt);
            registro.setPartido(partido);
            registro.setEquipo(equipoDT);
            registro.setPuntosFantasy(BigDecimal.valueOf(puntosFantasy));

            dtPartidoRepository.save(registro);
        }
    }

    private int calcularPuntos(
            boolean esLocal,
            int puntosDT,
            int puntosRival) {

        if (puntosDT == puntosRival) {
            return 0;
        }

        boolean gano = puntosDT > puntosRival;
        int diferencia = Math.abs(puntosDT - puntosRival);

        int puntos;

        if (gano) {
            puntos = esLocal ? 3 : 5;
        } else {
            puntos = esLocal ? -5 : -3;
        }

        if (diferencia >= 20) {
            puntos += gano ? 3 : -3;
        }

        return puntos;
    }

    private Partido buscarPartido(Integer partidoId) {
        return partidoRepository.findById(partidoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe el partido solicitado"
                ));
    }
}