
package com.zonapintada.zona_pintada.config;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
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
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(this::responderNoAutenticado)
                        .accessDeniedHandler(this::responderAccesoDenegado)
                )
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()

                        .requestMatchers(
                                "/api/usuarios/registro",
                                "/api/auth/login"
                        ).permitAll()

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/temporadas/activa"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/temporadas"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                "/api/temporadas",
                                "/api/temporadas/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/semanas",
                                "/api/semanas/*/fechas"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/semanas/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/semanas/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/semanas/**"
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

                        // Creación de equipos fantasy: solo managers.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/equipos-fantasy"
                        ).hasRole("MANAGER")

                        // Escritura de partidos y estadísticas: solo administrador.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/partidos/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/partidos/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/partidos/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/partidos/**"
                        ).hasRole("ADMINISTRADOR")

                        // Lectura de partidos y estadísticas: usuarios autenticados.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/partidos",
                                "/api/partidos/**"
                        ).authenticated()

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(this::responderNoAutenticado)
                        .accessDeniedHandler(this::responderAccesoDenegado)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                jwtAuthenticationConverter()
                        ))
                );

        return http.build();
    }

    private void responderNoAutenticado(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException {
        escribirMensaje(
                response,
                HttpStatus.UNAUTHORIZED,
                "Debés iniciar sesión para acceder a este recurso."
        );
    }

    private void responderAccesoDenegado(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException exception
    ) throws IOException {
        escribirMensaje(
                response,
                HttpStatus.FORBIDDEN,
                "No tenés permisos para realizar esta acción."
        );
    }

    private void escribirMensaje(
            HttpServletResponse response,
            HttpStatus status,
            String mensaje
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"mensaje\":\"" + mensaje + "\"}");
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken>
    jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

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
