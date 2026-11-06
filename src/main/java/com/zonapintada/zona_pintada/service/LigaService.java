package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.DestacadosSemanaResponse;
import com.zonapintada.zona_pintada.dto.DestacadosSemanaResponse.JugadorDestacadoResponse;
import com.zonapintada.zona_pintada.dto.PosicionLigaResponse;
import com.zonapintada.zona_pintada.entity.SemanaCompetencia;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import com.zonapintada.zona_pintada.repository.EquipoRepository.FilaPosicion;
import com.zonapintada.zona_pintada.repository.JugadorPartidoRepository;
import com.zonapintada.zona_pintada.repository.JugadorPartidoRepository.FilaRendimientoSemana;
import com.zonapintada.zona_pintada.repository.SemanaCompetenciaRepository;
import com.zonapintada.zona_pintada.repository.TemporadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class LigaService {

    private static final int PUNTOS_POR_VICTORIA = 2;
    private static final int PUNTOS_POR_DERROTA = 1;
    private static final int CANTIDAD_LIDERES = 10;
    private static final List<String> POSICIONES_QUINTETO =
            List.of("base", "escolta", "alero", "ala-pivot", "pivot");

    private final EquipoRepository equipoRepository;
    private final JugadorPartidoRepository jugadorPartidoRepository;
    private final TemporadaRepository temporadaRepository;
    private final SemanaCompetenciaRepository semanaRepository;

    public LigaService(
            EquipoRepository equipoRepository,
            JugadorPartidoRepository jugadorPartidoRepository,
            TemporadaRepository temporadaRepository,
            SemanaCompetenciaRepository semanaRepository) {
        this.equipoRepository = equipoRepository;
        this.jugadorPartidoRepository = jugadorPartidoRepository;
        this.temporadaRepository = temporadaRepository;
        this.semanaRepository = semanaRepository;
    }

    @Transactional(readOnly = true)
    public List<PosicionLigaResponse> obtenerPosiciones(Integer temporadaId) {
        Integer id = temporadaId != null
                ? temporadaId
                : temporadaRepository.findByActivaTrue()
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "No hay una temporada activa."
                        ))
                        .getId();

        List<FilaPosicion> filas = new ArrayList<>(equipoRepository.calcularPosiciones(id));
        filas.sort(Comparator
                .comparingInt(this::puntosDeTabla).reversed()
                .thenComparing(Comparator.comparingInt(this::diferencia).reversed())
                .thenComparing(Comparator.comparingLong(FilaPosicion::getPuntosAFavor).reversed())
                .thenComparing(FilaPosicion::getEquipoNombre));

        List<PosicionLigaResponse> tabla = new ArrayList<>();
        int posicion = 1;
        for (FilaPosicion fila : filas) {
            tabla.add(new PosicionLigaResponse(
                    posicion++,
                    fila.getEquipoId(),
                    fila.getEquipoNombre(),
                    fila.getNombreCorto(),
                    fila.getEscudoUrl(),
                    fila.getPartidosJugados().intValue(),
                    fila.getGanados().intValue(),
                    fila.getPerdidos().intValue(),
                    fila.getPuntosAFavor().intValue(),
                    fila.getPuntosEnContra().intValue(),
                    diferencia(fila),
                    puntosDeTabla(fila)
            ));
        }
        return tabla;
    }

    @Transactional(readOnly = true)
    public DestacadosSemanaResponse obtenerDestacados(Integer semanaId) {
        SemanaCompetencia semana = semanaRepository.findById(semanaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe la semana indicada."
                ));

        // La consulta ya viene ordenada de mayor a menor puntaje fantasy.
        List<JugadorDestacadoResponse> ranking = jugadorPartidoRepository
                .rendimientoPorSemana(semanaId)
                .stream()
                .map(this::convertir)
                .toList();

        List<JugadorDestacadoResponse> quinteto = new ArrayList<>();
        for (String posicion : POSICIONES_QUINTETO) {
            ranking.stream()
                    .filter(jugador -> posicion.equals(jugador.getPosicion()))
                    .findFirst()
                    .ifPresent(quinteto::add);
        }

        // El mejor de toda la semana es necesariamente el mejor de su posicion,
        // por lo tanto siempre forma parte del quinteto.
        JugadorDestacadoResponse mvp = ranking.isEmpty() ? null : ranking.get(0);

        return new DestacadosSemanaResponse(
                semana.getId(),
                semana.getNumeroSemana(),
                mvp,
                quinteto,
                ranking.stream().limit(CANTIDAD_LIDERES).toList()
        );
    }

    private int puntosDeTabla(FilaPosicion fila) {
        return fila.getGanados().intValue() * PUNTOS_POR_VICTORIA
                + fila.getPerdidos().intValue() * PUNTOS_POR_DERROTA;
    }

    private int diferencia(FilaPosicion fila) {
        return fila.getPuntosAFavor().intValue() - fila.getPuntosEnContra().intValue();
    }

    private JugadorDestacadoResponse convertir(FilaRendimientoSemana fila) {
        return new JugadorDestacadoResponse(
                fila.getJugadorId(),
                fila.getNombre(),
                fila.getApellido(),
                fila.getFotoUrl(),
                fila.getPosicion(),
                fila.getEquipoNombre(),
                fila.getPartidosJugados().intValue(),
                fila.getPuntosFantasy().setScale(1, RoundingMode.HALF_UP)
        );
    }
}
