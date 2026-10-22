
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.enums.RolUsuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long duracionSegundos;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.duration-seconds:3600}") long duracionSegundos
    ) {
        this.jwtEncoder = jwtEncoder;
        this.duracionSegundos = duracionSegundos;
    }

    public String generarToken(
            Integer usuarioId,
            String nombreUsuario,
            RolUsuario rol
    ) {
        Instant ahora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("zona-pintada")
                .issuedAt(ahora)
                .expiresAt(ahora.plusSeconds(duracionSegundos))
                .subject(usuarioId.toString())
                .claim("username", nombreUsuario)
                .claim("rol", rol.name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
    }

    public long getDuracionSegundos() {
        return duracionSegundos;
    }
}
