
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.EquipoRequest;
import com.zonapintada.zona_pintada.dto.EquipoResponse;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> listarTodos() {
        return equipoRepository.findAll(
                        Sort.by(Sort.Direction.ASC, "nombre")
                )
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipoResponse buscarPorId(Integer id) {
        Equipo equipo = obtenerEquipo(id);
        return convertirAResponse(equipo);
    }

    @Transactional
    public EquipoResponse crear(EquipoRequest request) {
        Equipo equipo = new Equipo();

        aplicarDatos(equipo, request);

        Equipo equipoGuardado = equipoRepository.save(equipo);

        return convertirAResponse(equipoGuardado);
    }

    @Transactional
    public EquipoResponse actualizar(Integer id, EquipoRequest request) {
        Equipo equipo = obtenerEquipo(id);

        aplicarDatos(equipo, request);

        Equipo equipoActualizado = equipoRepository.save(equipo);

        return convertirAResponse(equipoActualizado);
    }

    @Transactional
    public void eliminar(Integer id) {
        Equipo equipo = obtenerEquipo(id);
        equipoRepository.delete(equipo);
    }

    private Equipo obtenerEquipo(Integer id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un equipo con el ID " + id
                ));
    }

    private void aplicarDatos(
            Equipo equipo,
            EquipoRequest request
    ) {
        equipo.setNombre(request.getNombre().trim());
        equipo.setNombreCorto(request.getNombreCorto().trim());
        equipo.setCiudad(request.getCiudad().trim());
        equipo.setEscudoUrl(
                request.getEscudoUrl() == null || request.getEscudoUrl().isBlank()
                        ? null
                        : request.getEscudoUrl().trim()
        );
        equipo.setEstadio(request.getEstadio().trim());
    }

    private EquipoResponse convertirAResponse(Equipo equipo) {
        return new EquipoResponse(
                equipo.getId(),
                equipo.getNombre(),
                equipo.getNombreCorto(),
                equipo.getCiudad(),
                equipo.getEscudoUrl(),
                equipo.getEstadio()
        );
    }
}
