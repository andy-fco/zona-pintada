package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.SugerenciaEquipoResponse;
import com.zonapintada.zona_pintada.dto.SugerenciaEquipoResponse.JugadorSugeridoResponse;
import com.zonapintada.zona_pintada.entity.DT;
import com.zonapintada.zona_pintada.entity.Jugador;
import com.zonapintada.zona_pintada.enums.PosicionJugador;
import com.zonapintada.zona_pintada.enums.RolPlantelFantasy;
import com.zonapintada.zona_pintada.repository.DTRepository;
import com.zonapintada.zona_pintada.repository.JugadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class SugerenciaEquipoService {

    private static final BigDecimal PRESUPUESTO_MAXIMO = new BigDecimal("110");
    private static final int INTENTOS = 20;

    private final JugadorRepository jugadorRepository;
    private final DTRepository dtRepository;
    private final Random random = new Random();

    public SugerenciaEquipoService(
            JugadorRepository jugadorRepository,
            DTRepository dtRepository
    ) {
        this.jugadorRepository = jugadorRepository;
        this.dtRepository = dtRepository;
    }

    @Transactional(readOnly = true)
    public SugerenciaEquipoResponse sugerir() {
        Map<PosicionJugador, List<Jugador>> porPosicion = new EnumMap<>(PosicionJugador.class);
        for (Jugador jugador : jugadorRepository.findAll()) {
            porPosicion.computeIfAbsent(jugador.getPosicion(), posicion -> new ArrayList<>()).add(jugador);
        }

        List<DT> dts = dtRepository.findAll();
        if (dts.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No hay DTs cargados para armar un equipo."
            );
        }

        for (int intento = 0; intento < INTENTOS; intento++) {
            SugerenciaEquipoResponse sugerencia = intentarArmar(porPosicion, dts);
            if (sugerencia != null) {
                return sugerencia;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "No se pudo generar un equipo dentro del presupuesto."
        );
    }

    private SugerenciaEquipoResponse intentarArmar(
            Map<PosicionJugador, List<Jugador>> porPosicion,
            List<DT> dts
    ) {
        List<PosicionJugador> puestos = new ArrayList<>(List.of(PosicionJugador.values()));
        puestos.addAll(List.of(PosicionJugador.values()));
        int cantidadTitulares = PosicionJugador.values().length;

        BigDecimal minimoDt = dts.stream()
                .map(DT::getValor)
                .min(Comparator.naturalOrder())
                .orElseThrow();

        List<Jugador> titulares = new ArrayList<>();
        List<Jugador> suplentes = new ArrayList<>();
        List<Jugador> elegidos = new ArrayList<>();
        BigDecimal restante = PRESUPUESTO_MAXIMO;

        for (int i = 0; i < puestos.size(); i++) {
            BigDecimal reserva = minimoDt;
            for (int j = i + 1; j < puestos.size(); j++) {
                reserva = reserva.add(valorMinimoDisponible(porPosicion.get(puestos.get(j)), elegidos));
            }

            BigDecimal limite = restante.subtract(reserva);
            List<Jugador> candidatos = porPosicion.getOrDefault(puestos.get(i), List.of())
                    .stream()
                    .filter(jugador -> !elegidos.contains(jugador))
                    .filter(jugador -> jugador.getValor().compareTo(limite) <= 0)
                    .sorted(Comparator.comparing(Jugador::getValor).reversed())
                    .toList();

            if (candidatos.isEmpty()) {
                return null;
            }

            boolean titular = i < cantidadTitulares;
            Jugador elegido = titular
                    ? elegirEntreLosMejores(candidatos)
                    : candidatos.get(random.nextInt(candidatos.size()));

            elegidos.add(elegido);
            (titular ? titulares : suplentes).add(elegido);
            restante = restante.subtract(elegido.getValor());
        }

        BigDecimal disponibleDt = restante;
        List<DT> dtsPosibles = dts.stream()
                .filter(dt -> dt.getValor().compareTo(disponibleDt) <= 0)
                .sorted(Comparator.comparing(DT::getValor).reversed())
                .toList();

        if (dtsPosibles.isEmpty()) {
            return null;
        }

        DT dt = elegirEntreLosMejores(dtsPosibles);
        Jugador capitan = masValioso(titulares);
        Jugador sextoHombre = masValioso(suplentes);

        List<JugadorSugeridoResponse> jugadores = new ArrayList<>();
        for (Jugador jugador : titulares) {
            jugadores.add(new JugadorSugeridoResponse(
                    jugador.getId(),
                    true,
                    jugador == capitan ? RolPlantelFantasy.capitan : RolPlantelFantasy.normal
            ));
        }
        for (Jugador jugador : suplentes) {
            jugadores.add(new JugadorSugeridoResponse(
                    jugador.getId(),
                    false,
                    jugador == sextoHombre ? RolPlantelFantasy.sexto_hombre : RolPlantelFantasy.normal
            ));
        }

        return new SugerenciaEquipoResponse(dt.getId(), jugadores);
    }

    private BigDecimal valorMinimoDisponible(List<Jugador> jugadores, List<Jugador> elegidos) {
        if (jugadores == null) {
            return BigDecimal.ZERO;
        }
        return jugadores.stream()
                .filter(jugador -> !elegidos.contains(jugador))
                .map(Jugador::getValor)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
    }

    private <T> T elegirEntreLosMejores(List<T> ordenados) {
        int tercio = Math.max(1, ordenados.size() / 3);
        return ordenados.get(random.nextInt(tercio));
    }

    private Jugador masValioso(List<Jugador> jugadores) {
        return jugadores.stream()
                .max(Comparator.comparing(Jugador::getValor))
                .orElseThrow();
    }
}
