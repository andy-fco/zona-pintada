package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.PosicionRankingResponse;
import com.zonapintada.zona_pintada.dto.PuntosEquipoFantasy;
import com.zonapintada.zona_pintada.dto.RankingResponse;
import com.zonapintada.zona_pintada.entity.EquipoFantasy;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.EquipoFantasyRepository;
import com.zonapintada.zona_pintada.repository.EquipoFantasyResultadoSemanalRepository;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class RankingService {

    private static final int EQUIPOS_POR_PAGINA = 50;

    private static final Comparator<FilaRanking> ORDEN = Comparator
            .comparingInt(FilaRanking::puntos)
            .reversed()
            .thenComparing(fila -> fila.equipo().getCreatedAt())
            .thenComparing(fila -> fila.equipo().getNombre(), String.CASE_INSENSITIVE_ORDER)
            .thenComparing(fila -> fila.equipo().getId());

    private final EquipoFantasyRepository equipoFantasyRepository;
    private final EquipoFantasyResultadoSemanalRepository resultadoRepository;
    private final SemanaCompetenciaRepository semanaRepository;
    private final TemporadaRepository temporadaRepository;
    private final PuntosEquipoFantasyService puntosService;
    private final CierreSemanaService cierreSemanaService;

    public RankingService(
            EquipoFantasyRepository equipoFantasyRepository,
            EquipoFantasyResultadoSemanalRepository resultadoRepository,
            SemanaCompetenciaRepository semanaRepository,
            TemporadaRepository temporadaRepository,
            PuntosEquipoFantasyService puntosService,
            CierreSemanaService cierreSemanaService) {
        this.equipoFantasyRepository = equipoFantasyRepository;
        this.resultadoRepository = resultadoRepository;
        this.semanaRepository = semanaRepository;
        this.temporadaRepository = temporadaRepository;
        this.puntosService = puntosService;
        this.cierreSemanaService = cierreSemanaService;
    }

    @Transactional(readOnly = true)
    public RankingResponse obtenerGeneral(
            Integer usuarioId,
            Integer temporadaId,
            Integer pagina) {

        validarPagina(pagina);

        Integer id = temporadaId != null
                ? temporadaId
                : obtenerTemporadaActivaId();

        List<EquipoFantasy> equipos = equipoFantasyRepository.buscar(id, null);
        Map<Integer, PuntosEquipoFantasy> puntos = puntosService.calcularEnCurso(id, equipos);

        List<FilaRanking> filas = equipos.stream()
                .map(equipo -> new FilaRanking(
                        equipo,
                        puntos.get(equipo.getId()).getPuntosTotales()
                ))
                .toList();

        return armarRanking(filas, usuarioId, pagina);
    }

    @Transactional(readOnly = true)
    public RankingResponse obtenerSemanal(
            Integer usuarioId,
            Integer semanaId,
            Integer pagina) {

        validarPagina(pagina);

        SemanaCompetencia semana = semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada"
                ));

        List<FilaRanking> filas = semana.getCerradaAt() != null
                ? obtenerFilasSemanaCerrada(semanaId)
                : obtenerFilasSemanaAbierta(semana);

        return armarRanking(filas, usuarioId, pagina);
    }

    private List<FilaRanking> obtenerFilasSemanaCerrada(Integer semanaId) {
        return resultadoRepository.findBySemana_Id(semanaId)
                .stream()
                .map(resultado -> new FilaRanking(
                        resultado.getEquipoFantasy(),
                        resultado.getPuntosSemana()
                ))
                .toList();
    }

    private List<FilaRanking> obtenerFilasSemanaAbierta(SemanaCompetencia semana) {
        List<EquipoFantasy> equipos = cierreSemanaService.buscarEquiposDeSemana(semana);
        Map<Integer, Integer> puntos =
                puntosService.calcularSemanaAbierta(semana.getId(), equipos);

        return equipos.stream()
                .map(equipo -> new FilaRanking(
                        equipo,
                        puntos.getOrDefault(equipo.getId(), 0)
                ))
                .toList();
    }

    private RankingResponse armarRanking(
            List<FilaRanking> filas,
            Integer usuarioId,
            Integer pagina) {

        List<FilaRanking> ordenadas = filas.stream().sorted(ORDEN).toList();
        List<PosicionRankingResponse> posiciones = new ArrayList<>();
        PosicionRankingResponse miPosicion = null;

        long desde = (pagina - 1L) * EQUIPOS_POR_PAGINA;
        long hasta = desde + EQUIPOS_POR_PAGINA;

        for (int i = 0; i < ordenadas.size(); i++) {
            FilaRanking fila = ordenadas.get(i);
            boolean enPagina = i >= desde && i < hasta;
            boolean esDelUsuario = fila.equipo().getUsuario().getId().equals(usuarioId);

            if (!enPagina && !esDelUsuario) {
                continue;
            }

            PosicionRankingResponse posicion =
                    PosicionRankingResponse.desde(i + 1, fila.equipo(), fila.puntos());

            if (enPagina) {
                posiciones.add(posicion);
            }

            if (esDelUsuario) {
                miPosicion = posicion;
            }
        }

        int totalPaginas = (ordenadas.size() + EQUIPOS_POR_PAGINA - 1) / EQUIPOS_POR_PAGINA;

        return new RankingResponse(
                pagina,
                totalPaginas,
                ordenadas.size(),
                miPosicion,
                posiciones
        );
    }

    private void validarPagina(Integer pagina) {
        if (pagina < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La página debe ser mayor o igual a 1."
            );
        }
    }

    private Integer obtenerTemporadaActivaId() {
        return temporadaRepository.findByActivaTrue()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay una temporada activa."
                ))
                .getId();
    }

    private record FilaRanking(EquipoFantasy equipo, int puntos) {
    }
}