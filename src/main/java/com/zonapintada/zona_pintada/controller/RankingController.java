package com.zonapintada.zona_pintada.controller;

import com.zonapintada.zona_pintada.dto.RankingResponse;
import com.zonapintada.zona_pintada.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping("/general")
    public ResponseEntity<RankingResponse> obtenerGeneral(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Integer temporadaId,
            @RequestParam(defaultValue = "1") Integer pagina) {
        return ResponseEntity.ok(
                rankingService.obtenerGeneral(
                        Integer.valueOf(jwt.getSubject()),
                        temporadaId,
                        pagina
                )
        );
    }

    @GetMapping("/semanas/{semanaId}")
    public ResponseEntity<RankingResponse> obtenerSemanal(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer semanaId,
            @RequestParam(defaultValue = "1") Integer pagina) {
        return ResponseEntity.ok(
                rankingService.obtenerSemanal(
                        Integer.valueOf(jwt.getSubject()),
                        semanaId,
                        pagina
                )
        );
    }
}