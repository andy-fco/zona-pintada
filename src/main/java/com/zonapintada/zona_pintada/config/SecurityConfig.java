package com.zonapintada.zona_pintada.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Locale;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/usuarios/registro",
                                "/api/auth/login"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/temporadas/activa"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/temporadas"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                "/api/admin/temporadas",
                                "/api/admin/temporadas/**",
                                "/api/temporadas",
                                "/api/temporadas/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/semanas"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/semanas/generar"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/semanas/*/fechas"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/semanas/*/fechas/generar"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/equipos/**",
                                "/api/jugadores/**",
                                "/api/dts/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/equipos/**",
                                "/api/jugadores/**",
                                "/api/dts/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/equipos/**",
                                "/api/jugadores/**",
                                "/api/dts/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/equipos/**",
                                "/api/jugadores/**",
                                "/api/dts/**"
                        ).hasRole("ADMINISTRADOR")

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                jwtAuthenticationConverter()
                        ))
                );

        return http.build();
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken>
    jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            String rol = jwt.getClaimAsString("rol");

            if (rol != null && !rol.isBlank()) {
                authorities.add(new SimpleGrantedAuthority(
                        "ROLE_" + rol.toUpperCase(Locale.ROOT)
                ));
            }

            return authorities;
        });

        return converter;
    }
}