package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.PuntosSemanaEquipoResponse;
import com.zonapintada.zona_pintada.dto.PuntosSemanaEquipoResponse.IntegranteResponse;
import com.zonapintada.zona_pintada.dto.PuntosSemanaEquipoResponse.PartidoPuntosResponse;
import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.EquipoFantasyRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyRepository.FilaDetallePuntos;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DetallePuntosSemanaService {

    private final EquipoFantasyRepository equipoFantasyRepository;
    private final SemanaCompetenciaRepository semanaRepository;
    private final PuntosEquipoFantasyService puntosService;

    public DetallePuntosSemanaService(
            EquipoFantasyRepository equipoFantasyRepository,
            SemanaCompetenciaRepository semanaRepository,
            PuntosEquipoFantasyService puntosService) {
        this.equipoFantasyRepository = equipoFantasyRepository;
        this.semanaRepository = semanaRepository;
        this.puntosService = puntosService;
    }

    @Transactional(readOnly = true)
    public PuntosSemanaEquipoResponse obtenerDelUsuario(Integer usuarioId, Integer semanaId) {
        SemanaCompetencia semana = semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada."
                ));

        EquipoFantasy equipo = equipoFantasyRepository
                .findByUsuario_IdAndTemporada_Id(usuarioId, semana.getTemporada().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No tenés un equipo fantasy en la temporada de esa semana."
                ));

        Integer equipoId = equipo.getId();
        boolean cerrada = semana.getCerradaAt() != null;

        List<IntegranteResponse> jugadores = agrupar(
                equipoFantasyRepository.detallarJugadoresEnSemana(equipoId, semanaId, cerrada));
        List<IntegranteResponse> dts = agrupar(
                equipoFantasyRepository.detallarDTEnSemana(equipoId, semanaId, cerrada));

        int puntosEquipo = cerrada
                ? puntosService.calcularSemanaCerrada(semanaId).getOrDefault(equipoId, 0)
                : puntosService.calcularSemanaAbierta(semanaId, List.of(equipo)).getOrDefault(equipoId, 0);

        return new PuntosSemanaEquipoResponse(
                semana.getId(),
                semana.getNumeroSemana(),
                cerrada,
                puntosEquipo,
                jugadores,
                dts.isEmpty() ? null : dts.get(0)
        );
    }

    private List<IntegranteResponse> agrupar(List<FilaDetallePuntos> filas) {
        Map<Integer, List<FilaDetallePuntos>> porIntegrante = new LinkedHashMap<>();
        for (FilaDetallePuntos fila : filas) {
            porIntegrante.computeIfAbsent(fila.getIntegranteId(), id -> new ArrayList<>()).add(fila);
        }

        List<IntegranteResponse> resultado = new ArrayList<>();
        for (List<FilaDetallePuntos> grupo : porIntegrante.values()) {
            List<PartidoPuntosResponse> partidos = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;

            for (FilaDetallePuntos fila : grupo) {
                if (fila.getPartidoId() == null) {
                    continue;
                }
                partidos.add(new PartidoPuntosResponse(
                        fila.getPartidoId(),
                        fila.getFecha(),
                        fila.getRival(),
                        fila.getPuntosFantasy(),
                        redondear(fila.getPuntosAportados())
                ));
                total = total.add(fila.getPuntosAportados());
            }

            FilaDetallePuntos datos = grupo.get(0);
            resultado.add(new IntegranteResponse(
                    datos.getIntegranteId(),
                    datos.getNombre(),
                    datos.getApellido(),
                    datos.getPosicion(),
                    datos.getEquipoNombre(),
                    datos.getTitular(),
                    datos.getRol(),
                    datos.getMultiplicador(),
                    redondear(total),
                    partidos
            ));
        }
        return resultado;
    }

    private BigDecimal redondear(BigDecimal valor) {
        return valor.setScale(1, RoundingMode.HALF_UP);
    }
}
