
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.entity.JugadorPartido;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PuntuacionFantasyService {

    public BigDecimal calcular(JugadorPartido jp) {
        BigDecimal puntos = BigDecimal.valueOf(jp.getValoracion());

        puntos = puntos.add(bonificacionAnotacion(jp.getPuntos()));
        puntos = puntos.add(bonificacionRebotes(jp));
        puntos = puntos.add(bonificacionAsistencias(jp.getAsistencias()));
        puntos = puntos.add(bonificacionAsistenciasSinPerdidas(jp));
        puntos = puntos.add(bonificacionTirosLibres(jp));
        puntos = puntos.add(bonificacionTriples(jp));
        puntos = puntos.add(penalizacionTriples(jp));
        puntos = puntos.add(penalizacionPerdidas(jp.getPerdidas()));
        puntos = puntos.add(penalizacionFaltas(jp.getFaltasPersonales()));

        return puntos;
    }

    private BigDecimal bonificacionAnotacion(Integer puntosAnotados) {
        if (puntosAnotados >= 30) {
            return BigDecimal.valueOf(5);
        }
        if (puntosAnotados > 20) {
            return BigDecimal.valueOf(2);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal bonificacionRebotes(JugadorPartido jp) {
        int rebotes = jp.getRebotesOfensivos() + jp.getRebotesDefensivos();
        return rebotes >= 10 ? BigDecimal.valueOf(3) : BigDecimal.ZERO;
    }

    private BigDecimal bonificacionAsistencias(Integer asistencias) {
        if (asistencias >= 8) {
            return BigDecimal.valueOf(4);
        }
        if (asistencias >= 5) {
            return BigDecimal.valueOf(2);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal bonificacionAsistenciasSinPerdidas(JugadorPartido jp) {
        return jp.getAsistencias() > 4 && jp.getPerdidas() == 0
                ? BigDecimal.valueOf(2)
                : BigDecimal.ZERO;
    }

    private BigDecimal bonificacionTirosLibres(JugadorPartido jp) {
        return jp.getLibresIntentados() >= 3
                && jp.getLibresConvertidos().equals(jp.getLibresIntentados())
                ? BigDecimal.ONE
                : BigDecimal.ZERO;
    }

    private BigDecimal bonificacionTriples(JugadorPartido jp) {
        return jp.getTriplesIntentados() >= 3
                && jp.getTriplesConvertidos().equals(jp.getTriplesIntentados())
                ? BigDecimal.valueOf(2)
                : BigDecimal.ZERO;
    }

    private BigDecimal penalizacionTriples(JugadorPartido jp) {
        int intentados = jp.getTriplesIntentados();

        if (intentados < 7) {
            return BigDecimal.ZERO;
        }

        double porcentaje = (double) jp.getTriplesConvertidos() / intentados;

        return porcentaje <= 0.15
                ? BigDecimal.valueOf(-2)
                : BigDecimal.ZERO;
    }

    private BigDecimal penalizacionPerdidas(Integer perdidas) {
        return perdidas >= 5 ? BigDecimal.valueOf(-3) : BigDecimal.ZERO;
    }

    private BigDecimal penalizacionFaltas(Integer faltas) {
        return faltas >= 5 ? BigDecimal.valueOf(-2) : BigDecimal.ZERO;
    }
}
