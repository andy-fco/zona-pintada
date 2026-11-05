package com.zonapintada.zona_pintada.dto;

import java.util.List;

public class RankingResponse {

    private final Integer pagina;
    private final Integer totalPaginas;
    private final Integer totalEquipos;
    private final PosicionRankingResponse miPosicion;
    private final List<PosicionRankingResponse> posiciones;

    public RankingResponse(
            Integer pagina,
            Integer totalPaginas,
            Integer totalEquipos,
            PosicionRankingResponse miPosicion,
            List<PosicionRankingResponse> posiciones
    ) {
        this.pagina = pagina;
        this.totalPaginas = totalPaginas;
        this.totalEquipos = totalEquipos;
        this.miPosicion = miPosicion;
        this.posiciones = posiciones;
    }

    public Integer getPagina() {
        return pagina;
    }

    public Integer getTotalPaginas() {
        return totalPaginas;
    }

    public Integer getTotalEquipos() {
        return totalEquipos;
    }

    public PosicionRankingResponse getMiPosicion() {
        return miPosicion;
    }

    public List<PosicionRankingResponse> getPosiciones() {
        return posiciones;
    }
}