package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.SemanaCompetenciaResponse;
import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import com.zonapintada.zona_pintada.entity.EquipoFantasyDT;
import com.zonapintada.zona_pintada.entity.EquipoFantasyDTHistorial;
import com.zonapintada.zona_pintada.entity.EquipoFantasyJugador;
import com.zonapintada.zona_pintada.entity.EquipoFantasyJugadorHistorial;
import com.zonapintada.zona_pintada.entity.EquipoFantasyResultadoSemanal;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.enums.EstadoPartido;
import com.zonapintada.zona_pintada.repository.EquipoFantasyDTHistorialRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyDTRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyJugadorHistorialRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyJugadorRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyResultadoSemanalRepository;
import com.zonapintada.zona_pintada.repository.PartidoRepository;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CierreSemanaService {

    private static final ZoneId ZONA_LIGA =
            ZoneId.of("America/Argentina/Buenos_Aires");

    private static final List<EstadoPartido> ESTADOS_PENDIENTES =
            List.of(EstadoPartido.programado, EstadoPartido.en_juego);

    private final SemanaCompetenciaRepository semanaRepository;
    private final TemporadaRepository temporadaRepository;
    private final PartidoRepository partidoRepository;
    private final EquipoFantasyRepository equipoFantasyRepository;
    private final EquipoFantasyJugadorRepository equipoFantasyJugadorRepository;
    private final EquipoFantasyDTRepository equipoFantasyDTRepository;
    private final EquipoFantasyJugadorHistorialRepository jugadorHistorialRepository;
    private final EquipoFantasyDTHistorialRepository dtHistorialRepository;
    private final EquipoFantasyResultadoSemanalRepository resultadoRepository;
    private final PuntosEquipoFantasyService puntosService;

    public CierreSemanaService(
            SemanaCompetenciaRepository semanaRepository,
            TemporadaRepository temporadaRepository,
            PartidoRepository partidoRepository,
            EquipoFantasyRepository equipoFantasyRepository,
            EquipoFantasyJugadorRepository equipoFantasyJugadorRepository,
            EquipoFantasyDTRepository equipoFantasyDTRepository,
            EquipoFantasyJugadorHistorialRepository jugadorHistorialRepository,
            EquipoFantasyDTHistorialRepository dtHistorialRepository,
            EquipoFantasyResultadoSemanalRepository resultadoRepository,
            PuntosEquipoFantasyService puntosService) {
        this.semanaRepository = semanaRepository;
        this.temporadaRepository = temporadaRepository;
        this.partidoRepository = partidoRepository;
        this.equipoFantasyRepository = equipoFantasyRepository;
        this.equipoFantasyJugadorRepository = equipoFantasyJugadorRepository;
        this.equipoFantasyDTRepository = equipoFantasyDTRepository;
        this.jugadorHistorialRepository = jugadorHistorialRepository;
        this.dtHistorialRepository = dtHistorialRepository;
        this.resultadoRepository = resultadoRepository;
        this.puntosService = puntosService;
    }

    @Transactional
    public SemanaCompetenciaResponse cerrar(Integer semanaId) {
        SemanaCompetencia semana = bloquearYBuscarSemana(semanaId);

        validarCierre(semana);

        List<EquipoFantasy> equipos = buscarEquiposDeSemana(semana);

        if (!equipos.isEmpty()) {
            guardarHistoriales(semana, equipos);
            guardarResultados(semana, equipos);
        }

        semana.setCerradaAt(OffsetDateTime.now(ZONA_LIGA));

        return SemanaCompetenciaResponse.desde(semanaRepository.save(semana));
    }

    @Transactional
    public SemanaCompetenciaResponse recalcular(Integer semanaId) {
        SemanaCompetencia semana = bloquearYBuscarSemana(semanaId);

        if (semana.getCerradaAt() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se puede recalcular una semana cerrada"
            );
        }

        Map<Integer, Integer> puntos = puntosService.calcularSemanaCerrada(semanaId);
        Map<Integer, Integer> diferencias = new HashMap<>();

        for (EquipoFantasyResultadoSemanal resultado
                : resultadoRepository.findBySemana_Id(semanaId)) {

            EquipoFantasy equipo = resultado.getEquipoFantasy();
            int puntosSemana = puntos.getOrDefault(equipo.getId(), 0);
            int diferencia = puntosSemana - resultado.getPuntosSemana();

            if (diferencia == 0) {
                continue;
            }

            resultado.setPuntosSemana(puntosSemana);
            resultado.setPuntosAcumulados(resultado.getPuntosAcumulados() + diferencia);
            equipo.setPuntosTotales(equipo.getPuntosTotales() + diferencia);
            diferencias.put(equipo.getId(), diferencia);
        }

        if (!diferencias.isEmpty()) {
            for (EquipoFantasyResultadoSemanal posterior : resultadoRepository
                    .findByEquipoFantasy_IdInAndSemana_NumeroSemanaGreaterThan(
                            diferencias.keySet(),
                            semana.getNumeroSemana())) {

                posterior.setPuntosAcumulados(
                        posterior.getPuntosAcumulados()
                                + diferencias.get(posterior.getEquipoFantasy().getId())
                );
            }
        }

        return SemanaCompetenciaResponse.desde(semana);
    }

    public List<EquipoFantasy> buscarEquiposDeSemana(SemanaCompetencia semana) {
        Instant finDeSemana = semana.getFechaFin()
                .plusDays(1)
                .atStartOfDay(ZONA_LIGA)
                .toInstant();

        return equipoFantasyRepository.findByTemporada_IdAndCreatedAtBefore(
                semana.getTemporada().getId(),
                finDeSemana
        );
    }

    private SemanaCompetencia bloquearYBuscarSemana(Integer semanaId) {
        temporadaRepository.bloquearPorSemana(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada"
                ));

        return semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada"
                ));
    }

    private void validarCierre(SemanaCompetencia semana) {
        if (semana.getCerradaAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La semana ya está cerrada"
            );
        }

        if (semanaRepository.existsByTemporada_IdAndNumeroSemanaLessThanAndCerradaAtIsNull(
                semana.getTemporada().getId(),
                semana.getNumeroSemana())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Hay una semana anterior sin cerrar"
            );
        }

        if (partidoRepository.existsByFechaCompetencia_Semana_IdAndEstadoIn(
                semana.getId(),
                ESTADOS_PENDIENTES)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La semana tiene partidos programados o en juego"
            );
        }
    }

    private void guardarHistoriales(
            SemanaCompetencia semana,
            List<EquipoFantasy> equipos) {

        List<Integer> ids = equipos.stream().map(EquipoFantasy::getId).toList();

        List<EquipoFantasyJugadorHistorial> jugadores = new ArrayList<>();

        for (EquipoFantasyJugador integrante
                : equipoFantasyJugadorRepository.findByEquipoFantasy_IdIn(ids)) {

            EquipoFantasyJugadorHistorial historial = new EquipoFantasyJugadorHistorial();
            historial.setEquipoFantasy(integrante.getEquipoFantasy());
            historial.setSemana(semana);
            historial.setTemporada(semana.getTemporada());
            historial.setJugador(integrante.getJugador());
            historial.setTitular(integrante.isTitular());
            historial.setRol(integrante.getRol());
            historial.setMultiplicador(integrante.getMultiplicador());
            historial.setValor(integrante.getJugador().getValor());

            jugadores.add(historial);
        }

        List<EquipoFantasyDTHistorial> dts = new ArrayList<>();

        for (EquipoFantasyDT asignacion : equipoFantasyDTRepository.findByEquipoFantasyIdIn(ids)) {
            EquipoFantasyDTHistorial historial = new EquipoFantasyDTHistorial();
            historial.setEquipoFantasy(asignacion.getEquipoFantasy());
            historial.setSemana(semana);
            historial.setTemporada(semana.getTemporada());
            historial.setDt(asignacion.getDt());
            historial.setValor(asignacion.getDt().getValor());

            dts.add(historial);
        }

        jugadorHistorialRepository.saveAllAndFlush(jugadores);
        dtHistorialRepository.saveAllAndFlush(dts);
    }

    private void guardarResultados(
            SemanaCompetencia semana,
            List<EquipoFantasy> equipos) {

        Map<Integer, Integer> puntos = puntosService.calcularSemanaCerrada(semana.getId());
        List<EquipoFantasyResultadoSemanal> resultados = new ArrayList<>();

        for (EquipoFantasy equipo : equipos) {
            int puntosSemana = puntos.getOrDefault(equipo.getId(), 0);
            int puntosAcumulados = equipo.getPuntosTotales() + puntosSemana;

            EquipoFantasyResultadoSemanal resultado = new EquipoFantasyResultadoSemanal();
            resultado.setEquipoFantasy(equipo);
            resultado.setSemana(semana);
            resultado.setTemporada(semana.getTemporada());
            resultado.setPuntosSemana(puntosSemana);
            resultado.setPuntosAcumulados(puntosAcumulados);

            resultados.add(resultado);
            equipo.setPuntosTotales(puntosAcumulados);
        }

        resultadoRepository.saveAll(resultados);
    }
}