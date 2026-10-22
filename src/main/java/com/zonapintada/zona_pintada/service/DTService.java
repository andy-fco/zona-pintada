
package com.zonapintada.zona_pintada.service;

import com.zonapintada.zona_pintada.dto.DTRequest;
import com.zonapintada.zona_pintada.dto.DTResponse;
import com.zonapintada.zona_pintada.entity.DT;
import com.zonapintada.zona_pintada.entity.Equipo;
import com.zonapintada.zona_pintada.repository.DTRepository;
import com.zonapintada.zona_pintada.repository.EquipoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DTService {

    private final DTRepository dtRepository;
    private final EquipoRepository equipoRepository;

    public DTService(
            DTRepository dtRepository,
            EquipoRepository equipoRepository
    ) {
        this.dtRepository = dtRepository;
        this.equipoRepository = equipoRepository;
    }

    @Transactional(readOnly = true)
    public List<DTResponse> listar(Integer equipoId) {
        List<DT> dts;

        if (equipoId == null) {
            dts = dtRepository.findAllByOrderByApellidoAscNombreAsc();
        } else {
            dts = dtRepository.findAllByEquipo_IdOrderByApellidoAscNombreAsc(
                    equipoId
            );
        }

        return dts.stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DTResponse buscarPorId(Integer id) {
        return convertirAResponse(obtenerDT(id));
    }

    @Transactional
    public DTResponse crear(DTRequest request) {
        Equipo equipo = obtenerEquipo(request.getEquipoId());

        validarEquipoDisponible(request.getEquipoId(), null);

        DT dt = new DT();
        aplicarDatos(dt, request, equipo);

        try {
            return convertirAResponse(dtRepository.saveAndFlush(dt));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pudo asignar el DT. Verificá que el equipo no tenga otro DT asignado."
            );
        }
    }

    @Transactional
    public DTResponse actualizar(Integer id, DTRequest request) {
        DT dt = obtenerDT(id);
        Equipo equipo = obtenerEquipo(request.getEquipoId());

        validarEquipoDisponible(request.getEquipoId(), id);

        aplicarDatos(dt, request, equipo);

        try {
            return convertirAResponse(dtRepository.saveAndFlush(dt));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pudo actualizar el DT. Verificá que el equipo no tenga otro DT asignado."
            );
        }
    }

    @Transactional
    public void eliminar(Integer id) {
        DT dt = obtenerDT(id);
        dtRepository.delete(dt);
    }

    private DT obtenerDT(Integer id) {
        return dtRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un DT con el ID " + id
                ));
    }

    private Equipo obtenerEquipo(Integer equipoId) {
        return equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un equipo con el ID " + equipoId
                ));
    }

    private void validarEquipoDisponible(Integer equipoId, Integer dtId) {
        boolean ocupado;

        if (dtId == null) {
            ocupado = dtRepository.existsByEquipo_Id(equipoId);
        } else {
            ocupado = dtRepository.existsByEquipo_IdAndIdNot(
                    equipoId,
                    dtId
            );
        }

        if (ocupado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El equipo con ID " + equipoId + " ya tiene un DT asignado."
            );
        }
    }

    private void aplicarDatos(
            DT dt,
            DTRequest request,
            Equipo equipo
    ) {
        dt.setNombre(request.getNombre().trim());
        dt.setApellido(request.getApellido().trim());
        dt.setFotoUrl(limpiarOpcional(request.getFotoUrl()));
        dt.setFechaNacimiento(request.getFechaNacimiento());
        dt.setCiudad(limpiarOpcional(request.getCiudad()));
        dt.setPais(limpiarOpcional(request.getPais()));
        dt.setValor(request.getValor());
        dt.setEquipo(equipo);
    }

    private String limpiarOpcional(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor.trim();
    }

    private DTResponse convertirAResponse(DT dt) {
        return new DTResponse(
                dt.getId(),
                dt.getNombre(),
                dt.getApellido(),
                dt.getFotoUrl(),
                dt.getFechaNacimiento(),
                dt.getCiudad(),
                dt.getPais(),
                dt.getValor(),
                dt.getEquipo().getId(),
                dt.getEquipo().getNombre(),
                dt.getCreatedAt(),
                dt.getUpdatedAt()
        );
    }
}
