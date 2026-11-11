import * as cheerio from 'cheerio';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const LNB = 'https://www.laliganacional.com.ar';
const API = process.env.ZP_API_URL ?? 'http://localhost:8080/api';

const MAPA_EQUIPOS = {
  'LA UNION FSA': 'La Unión de Formosa',
};

const MINUTOS_REGLAMENTARIOS = 200;
const MINUTOS_SUPLEMENTARIO = 25;

let token = null;

function leerArgumentos() {
  const argumentos = process.argv.slice(2);
  const valor = (nombre) => {
    const indice = argumentos.indexOf(nombre);
    return indice >= 0 ? argumentos[indice + 1] : null;
  };

  const desde = valor('--desde');
  const hasta = valor('--hasta');
  if (!desde || !hasta) {
    console.error('Uso: node cargar.js --desde AAAA-MM-DD --hasta AAAA-MM-DD [--simular] [--cerrar]');
    process.exit(1);
  }

  return {
    desde,
    hasta,
    simular: argumentos.includes('--simular'),
    cerrar: argumentos.includes('--cerrar'),
  };
}

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function api(ruta, opciones = {}) {
  const respuesta = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null);
    throw new Error(`${opciones.method ?? 'GET'} ${ruta} → ${respuesta.status} ${cuerpo?.mensaje ?? ''}`);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

function enviar(ruta, metodo, cuerpo) {
  return api(ruta, { method: metodo, body: JSON.stringify(cuerpo) });
}

function preguntarOculto(pregunta) {
  if (!stdin.isTTY) {
    throw new Error('Para ingresar la contraseña, ejecutá el script en una terminal o definí ZP_ADMIN_PASSWORD.');
  }

  return new Promise((resolver) => {
    let texto = '';

    const terminar = () => {
      stdin.off('data', alTeclear);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
    };

    const alTeclear = (teclas) => {
      for (const tecla of teclas) {
        if (tecla === '\r' || tecla === '\n') {
          terminar();
          resolver(texto);
          return;
        }
        if (tecla === '\u0003') {
          terminar();
          process.exit(1);
        }
        if (tecla === '\u0008' || tecla === '\u007f') {
          if (texto.length > 0) {
            texto = texto.slice(0, -1);
            stdout.write('\b \b');
          }
          continue;
        }
        texto += tecla;
        stdout.write('*');
      }
    };

    stdout.write(pregunta);
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.resume();
    stdin.on('data', alTeclear);
  });
}

async function iniciarSesion() {
  let identificador = process.env.ZP_ADMIN_USUARIO;
  if (!identificador) {
    const consola = createInterface({ input: stdin, output: stdout });
    identificador = await consola.question('Usuario administrador: ');
    consola.close();
  }
  const password = process.env.ZP_ADMIN_PASSWORD ?? (await preguntarOculto('Contraseña: '));

  const respuesta = await enviar('/auth/login', 'POST', { identificador, password });
  token = respuesta.token;
}

async function obtenerHtml(ruta) {
  const respuesta = await fetch(`${LNB}${ruta}`, {
    headers: { 'User-Agent': 'ZonaPintada/1.0 (proyecto academico)' },
  });
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${ruta} de la LNB (${respuesta.status})`);
  }
  return respuesta.text();
}

async function listarPartidosLnb(desde, hasta) {
  const $ = cheerio.load(
    await obtenerHtml(`/laliga/fixture?handler=ProximosPartidos&fechaInicio=${desde}&fechaFin=${hasta}`),
  );
  const partidos = [];

  $('tr').each((_, fila) => {
    const celdas = $(fila)
      .children()
      .map((_, celda) => $(celda).text().replace(/\s+/g, ' ').trim())
      .get();
    const enlace = $(fila).find('a[href*="/partido/"]').attr('href');
    const fechaHora = celdas[6]?.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/);
    if (!enlace || !fechaHora) {
      return;
    }

    partidos.push({
      local: celdas[1],
      visitante: celdas[4],
      fecha: `${fechaHora[3]}-${fechaHora[2]}-${fechaHora[1]}`,
      hora: fechaHora[4],
      enlace,
    });
  });

  return partidos.filter((partido) => partido.fecha >= desde && partido.fecha <= hasta);
}

function numero(texto) {
  return Number((texto.match(/-?\d+/) ?? ['0'])[0]);
}

function convertidosIntentados(texto) {
  const coincidencia = texto.match(/(\d+)\/(\d+)/);
  return coincidencia ? [Number(coincidencia[1]), Number(coincidencia[2])] : [0, 0];
}

function minutos(texto) {
  const coincidencia = texto.match(/(\d+):(\d{2})/);
  return coincidencia ? Number(coincidencia[1]) + Number(coincidencia[2]) / 60 : 0;
}

function tiempoCompleto(minutosJugados) {
  const periodos = Math.round((minutosJugados - MINUTOS_REGLAMENTARIOS) / MINUTOS_SUPLEMENTARIO);
  const esperado = MINUTOS_REGLAMENTARIOS + Math.max(periodos, 0) * MINUTOS_SUPLEMENTARIO;
  return minutosJugados >= MINUTOS_REGLAMENTARIOS - 1 && Math.abs(minutosJugados - esperado) <= 1;
}

function leerEstado(texto) {
  const estado = normalizar(texto);
  if (!estado) {
    return null;
  }
  if (estado === 'FINALIZADO') {
    return 'finalizado';
  }
  if (estado === 'NO COMENZADO') {
    return 'programado';
  }
  return 'en_juego';
}

async function leerPlanilla(enlace) {
  const $ = cheerio.load(await obtenerHtml(enlace));
  const planteles = [];
  const minutosTotales = [];

  $('table')
    .filter((_, tabla) => $(tabla).text().includes('Tiros 2P'))
    .slice(0, 2)
    .each((_, tabla) => {
      const jugadores = [];

      $(tabla)
        .find('tr')
        .each((_, fila) => {
          const c = $(fila)
            .children()
            .map((_, celda) => $(celda).text().replace(/\s+/g, ' ').trim())
            .get();
          if (c.length < 23 || !c[2].includes(',')) {
            return;
          }

          const [doblesConvertidos, doblesIntentados] = convertidosIntentados(c[5]);
          const [triplesConvertidos, triplesIntentados] = convertidosIntentados(c[7]);
          const [libresConvertidos, libresIntentados] = convertidosIntentados(c[9]);

          const nombreCompleto = ($(fila).attr('onclick') ?? '').match(/"NombreCompleto":"([^"]*)"/)?.[1] ?? '';

          jugadores.push({
            nombre: c[2],
            nombreCompleto,
            jugo: c[3] !== '00:00',
            titular: c[1].includes('*'),
            puntos: numero(c[4]),
            doblesConvertidos,
            doblesIntentados,
            triplesConvertidos,
            triplesIntentados,
            libresConvertidos,
            libresIntentados,
            rebotesDefensivos: numero(c[11]),
            rebotesOfensivos: numero(c[12]),
            asistencias: numero(c[14]),
            recuperos: numero(c[15]),
            perdidas: numero(c[16]),
            tapones: numero(c[17]),
            taponesRecibidos: numero(c[18]),
            faltasPersonales: numero(c[19]),
            faltasRecibidas: numero(c[20]),
            valoracion: numero(c[21]),
            masMenos: numero(c[22]),
          });
        });

      planteles.push(jugadores);
      const totales = $(tabla)
        .find('tr.footer-tabla-estadistica')
        .children()
        .map((_, celda) => $(celda).text().trim())
        .get();
      minutosTotales.push(minutos(totales.find((texto) => /^\d+:\d{2}$/.test(texto)) ?? ''));
    });

  const puntosLocal = numero($('#score-local').text());
  const puntosVisitante = numero($('#score-visitante').text());
  const estadoLnb = leerEstado($('#status-partido').text());
  const estadoMinutos = estadoPorMinutos(minutosTotales, puntosLocal, puntosVisitante);

  return {
    estado: estadoLnb ?? estadoMinutos,
    aviso: compararEstados(estadoLnb, estadoMinutos, minutosTotales, puntosLocal, puntosVisitante),
    puntosLocal,
    puntosVisitante,
    plantelLocal: planteles[0] ?? [],
    plantelVisitante: planteles[1] ?? [],
  };
}

function estadoPorMinutos(minutosTotales, puntosLocal, puntosVisitante) {
  if (minutosTotales.every((minutosJugados) => minutosJugados === 0)) {
    return 'programado';
  }
  const completo = minutosTotales.length === 2 && minutosTotales.every(tiempoCompleto);
  return completo && puntosLocal !== puntosVisitante ? 'finalizado' : 'en_juego';
}

function compararEstados(estadoLnb, estadoMinutos, minutosTotales, puntosLocal, puntosVisitante) {
  const detalle = `minutos ${minutosTotales.map((m) => m.toFixed(0)).join(' / ')}, marcador ${puntosLocal}-${puntosVisitante}`;
  if (!estadoLnb) {
    return `No se encontró el estado en la planilla. Se usa el que indican los minutos: ${estadoMinutos} (${detalle}).`;
  }
  if (estadoLnb !== estadoMinutos) {
    return `La LNB indica ${estadoLnb}, pero los minutos indican ${estadoMinutos} (${detalle}). Se usa el de la LNB.`;
  }
  return null;
}

function buscarEquipo(nombreLnb, equipos) {
  if (MAPA_EQUIPOS[nombreLnb]) {
    return equipos.find((equipo) => equipo.nombre === MAPA_EQUIPOS[nombreLnb]) ?? null;
  }

  const buscado = normalizar(nombreLnb);
  const exacto = equipos.find((equipo) =>
    [equipo.nombre, equipo.nombreCorto].filter(Boolean).some((nombre) => normalizar(nombre) === buscado),
  );
  if (exacto) {
    return exacto;
  }

  const sinSigla = normalizar(nombreLnb.replace(/\(.*\)/, ''));
  const parciales = equipos.filter((equipo) =>
    normalizar(`${equipo.nombre} ${equipo.nombreCorto ?? ''}`).includes(sinSigla),
  );
  return parciales.length === 1 ? parciales[0] : null;
}

function resolverEquipos(partidos, equipos) {
  const nombres = [...new Set(partidos.flatMap((partido) => [partido.local, partido.visitante]))].sort();
  const resultado = new Map();
  const faltantes = [];

  for (const nombreLnb of nombres) {
    const equipo = buscarEquipo(nombreLnb, equipos);
    if (equipo) {
      resultado.set(nombreLnb, equipo);
    } else {
      faltantes.push(nombreLnb);
    }
  }

  console.log('\nEquipos LNB → base de datos');
  for (const [nombreLnb, equipo] of resultado) {
    console.log(`   ${nombreLnb.padEnd(20)} → ${equipo.nombre}`);
  }

  if (faltantes.length > 0) {
    console.error(`\nNo se encontró equivalencia para: ${faltantes.join(', ')}`);
    console.error('Equipos de la base:');
    for (const equipo of equipos) {
      console.error(`   ${equipo.nombre}${equipo.nombreCorto ? ` (${equipo.nombreCorto})` : ''}`);
    }
    console.error('Agregalos en MAPA_EQUIPOS, por ejemplo: { "LA UNION FSA": "La Unión de Formosa" }');
    process.exit(1);
  }

  return resultado;
}

function coincideNombre(nombreBase, nombresLnb, inicial) {
  if (nombreBase.startsWith(inicial)) {
    return true;
  }
  const partes = nombreBase.split(' ');
  return nombresLnb.some((nombre) => partes.some((parte) => nombre.startsWith(parte) || parte.startsWith(nombre)));
}

function candidatosPara(jugadoresDelEquipo, estadistica) {
  const [apellidoLnb, nombreInicial = ''] = estadistica.nombre.split(',');
  const apellido = normalizar(apellidoLnb);
  const inicial = normalizar(nombreInicial).charAt(0);
  const nombresLnb = normalizar(estadistica.nombreCompleto.split(',')[1] ?? '')
    .split(' ')
    .filter(Boolean);

  return jugadoresDelEquipo.filter((jugador) => {
    const apellidoBase = normalizar(jugador.apellido);
    const coincideApellido =
      apellidoBase === apellido || apellidoBase.startsWith(`${apellido} `) || apellido.startsWith(`${apellidoBase} `);
    return coincideApellido && coincideNombre(normalizar(jugador.nombre), nombresLnb, inicial);
  });
}

function vincular(plantel, equipo, jugadores) {
  const jugadoresDelEquipo = jugadores.filter((jugador) => jugador.equipoId === equipo.id);
  const filas = [];
  const ambiguos = [];

  for (const estadistica of plantel) {
    const candidatos = candidatosPara(jugadoresDelEquipo, estadistica);
    if (candidatos.length === 1) {
      filas.push({ jugador: candidatos[0], equipo, estadistica });
    } else if (candidatos.length > 1) {
      ambiguos.push({ nombre: estadistica.nombre, candidatos });
    }
  }

  const vinculados = new Set(filas.map((fila) => fila.jugador.id));
  const enDuda = new Set(ambiguos.flatMap((ambiguo) => ambiguo.candidatos.map((jugador) => jugador.id)));
  const sinVincular = jugadoresDelEquipo.filter((jugador) => !vinculados.has(jugador.id) && !enDuda.has(jugador.id));
  const nombresLibres = plantel
    .filter((estadistica) => !filas.some((fila) => fila.estadistica === estadistica))
    .map((estadistica) => estadistica.nombre);

  return { filas, ambiguos, sinVincular, nombresLibres };
}

function mostrarAvisos(vinculacion, equipo) {
  let cantidad = 0;

  for (const jugador of vinculacion.sinVincular) {
    console.warn(`   ⚠ Sin coincidencia en la planilla: ${jugador.nombre} ${jugador.apellido} (${equipo.nombre})`);
    cantidad++;
  }
  if (vinculacion.sinVincular.length > 0 && vinculacion.nombresLibres.length > 0) {
    console.warn(`     Nombres sin vincular en la planilla: ${vinculacion.nombresLibres.join(' · ')}`);
  }

  for (const { nombre, candidatos } of vinculacion.ambiguos) {
    const nombres = candidatos.map((jugador) => `${jugador.nombre} ${jugador.apellido}`).join(', ');
    console.warn(`   ⚠ Varios candidatos para ${nombre}: ${nombres} (${equipo.nombre})`);
    cantidad += candidatos.length;
  }

  return cantidad;
}

const fechasPorSemana = new Map();

async function obtenerFechaCompetencia(semana, dia) {
  if (!fechasPorSemana.has(semana.id)) {
    let fechas = await api(`/semanas/${semana.id}/fechas`);
    if (fechas.length === 0) {
      fechas = await enviar(`/semanas/${semana.id}/fechas/generar`, 'POST', {});
    }
    fechasPorSemana.set(semana.id, fechas);
  }

  const fecha = fechasPorSemana.get(semana.id).find((item) => item.fecha === dia);
  if (!fecha) {
    throw new Error(`La semana ${semana.numeroSemana} no tiene fecha de competencia para el ${dia}`);
  }
  return fecha;
}

async function buscarExistente(fecha, local, visitante) {
  const partidos = await api(`/partidos?fechaId=${fecha.id}`);
  return (
    partidos.find((item) => item.equipoLocalId === local.id && item.equipoVisitanteId === visitante.id) ?? null
  );
}

function crearPartido(partido, local, visitante, fecha) {
  return enviar('/admin/partidos', 'POST', {
    equipoLocalId: local.id,
    equipoVisitanteId: visitante.id,
    fechaCompetenciaId: fecha.id,
    fecha: partido.fecha,
    hora: partido.hora,
  });
}

function describir(partido, local, visitante, semana, planilla) {
  const marcador = planilla.estado === 'programado' ? 'vs' : `${planilla.puntosLocal}-${planilla.puntosVisitante}`;
  const estado = { programado: 'programado', en_juego: 'en juego', finalizado: 'finalizado' }[planilla.estado];
  return `\nSemana ${semana.numeroSemana} · ${partido.fecha} ${partido.hora} · ${local.nombre} ${marcador} ${visitante.nombre} · ${estado}`;
}

const SIN_CAMBIOS = { resultado: 'omitido', estadisticas: 0, avisos: 0 };

async function cargarProgramado(partido, local, visitante, semana, simular) {
  if (simular) {
    return SIN_CAMBIOS;
  }

  const fecha = await obtenerFechaCompetencia(semana, partido.fecha);
  if (await buscarExistente(fecha, local, visitante)) {
    console.log('   Ya estaba cargado, se omite.');
    return SIN_CAMBIOS;
  }

  const creado = await crearPartido(partido, local, visitante, fecha);
  console.log(`   Cargado: partido ${creado.id}, programado.`);
  return { ...SIN_CAMBIOS, resultado: 'programado' };
}

async function cargarEnJuego(partido, local, visitante, semana, planilla, simular) {
  if (simular) {
    return SIN_CAMBIOS;
  }

  const fecha = await obtenerFechaCompetencia(semana, partido.fecha);
  const existente = await buscarExistente(fecha, local, visitante);
  if (existente?.estado === 'finalizado') {
    console.log('   Ya estaba finalizado en la base, se omite.');
    return SIN_CAMBIOS;
  }

  const destino = existente ?? (await crearPartido(partido, local, visitante, fecha));
  await enviar(`/admin/partidos/${destino.id}`, 'PUT', {
    fecha: partido.fecha,
    hora: partido.hora,
    puntosLocal: planilla.puntosLocal,
    puntosVisitante: planilla.puntosVisitante,
    estado: 'en_juego',
  });

  console.log(`   Actualizado: partido ${destino.id}, en juego, sin estadísticas.`);
  return { ...SIN_CAMBIOS, resultado: 'en_juego' };
}

async function cargarFinalizado(partido, local, visitante, semana, planilla, jugadores, simular) {
  const vinculacionLocal = vincular(planilla.plantelLocal, local, jugadores);
  const vinculacionVisitante = vincular(planilla.plantelVisitante, visitante, jugadores);
  const filas = [...vinculacionLocal.filas, ...vinculacionVisitante.filas].filter(
    ({ estadistica }) => estadistica.jugo,
  );

  console.log(`   ${filas.length} jugadores de la base jugaron este partido.`);
  const avisos = mostrarAvisos(vinculacionLocal, local) + mostrarAvisos(vinculacionVisitante, visitante);

  if (simular) {
    for (const { jugador, estadistica } of filas) {
      console.log(
        `   ${jugador.nombre} ${jugador.apellido} ← ${estadistica.nombre} · ${estadistica.puntos} pts · val ${estadistica.valoracion}`,
      );
    }
    return { ...SIN_CAMBIOS, avisos };
  }

  const fecha = await obtenerFechaCompetencia(semana, partido.fecha);
  const existente = await buscarExistente(fecha, local, visitante);
  const destino = existente ?? (await crearPartido(partido, local, visitante, fecha));
  const yaCargadas = existente ? await api(`/partidos/${destino.id}/estadisticas/jugadores`) : [];
  const pendientes = filas.filter(({ jugador }) => !yaCargadas.some((item) => item.jugadorId === jugador.id));

  if (existente?.estado === 'finalizado' && pendientes.length === 0) {
    console.log('   Ya estaba cargado, se omite.');
    return { ...SIN_CAMBIOS, avisos };
  }

  for (const { jugador, equipo, estadistica } of pendientes) {
    const { nombre, nombreCompleto, jugo, ...valores } = estadistica;
    await enviar(`/admin/partidos/${destino.id}/estadisticas/jugadores`, 'POST', {
      jugadorId: jugador.id,
      equipoId: equipo.id,
      ...valores,
    });
  }

  if (existente?.estado === 'finalizado') {
    console.log(`   Completado: partido ${destino.id}, ${pendientes.length} estadísticas agregadas.`);
    return { resultado: 'completado', estadisticas: pendientes.length, avisos };
  }

  await enviar(`/admin/partidos/${destino.id}`, 'PUT', {
    fecha: partido.fecha,
    hora: partido.hora,
    puntosLocal: planilla.puntosLocal,
    puntosVisitante: planilla.puntosVisitante,
    estado: 'finalizado',
  });

  const origen = existente ? ` (estaba ${existente.estado.replace('_', ' ')})` : '';
  console.log(`   Cargado: partido ${destino.id}${origen}, ${pendientes.length} estadísticas, finalizado.`);
  return { resultado: 'finalizado', estadisticas: pendientes.length, avisos };
}

async function cerrarSemanas(semanas, hasta) {
  const pendientes = semanas
    .filter((semana) => !semana.cerradaAt && semana.fechaFin <= hasta)
    .sort((a, b) => a.numeroSemana - b.numeroSemana);

  for (const semana of pendientes) {
    await enviar(`/semanas/${semana.id}/cierre`, 'POST', {});
    console.log(`Semana ${semana.numeroSemana} cerrada.`);
  }
}

async function main() {
  const { desde, hasta, simular, cerrar } = leerArgumentos();
  await iniciarSesion();

  const [equipos, jugadores, semanas] = await Promise.all([api('/equipos'), api('/jugadores'), api('/semanas')]);
  const partidosLnb = await listarPartidosLnb(desde, hasta);
  console.log(`Partidos en la LNB entre ${desde} y ${hasta}: ${partidosLnb.length}`);

  const equipoPorNombre = resolverEquipos(partidosLnb, equipos);
  const totales = { finalizado: 0, completado: 0, en_juego: 0, programado: 0, estadisticas: 0, avisos: 0 };

  for (const partido of partidosLnb) {
    const semana = semanas.find((item) => item.fechaInicio <= partido.fecha && partido.fecha <= item.fechaFin);
    if (!semana) {
      console.warn(`\n${partido.fecha}: no hay semana de competencia para esa fecha, se omite.`);
      continue;
    }
    if (semana.cerradaAt) {
      console.warn(`\n${partido.fecha}: la semana ${semana.numeroSemana} ya está cerrada, se omite.`);
      continue;
    }

    const local = equipoPorNombre.get(partido.local);
    const visitante = equipoPorNombre.get(partido.visitante);
    const planilla = await leerPlanilla(partido.enlace);

    console.log(describir(partido, local, visitante, semana, planilla));
    if (planilla.aviso) {
      console.warn(`   ⚠ ${planilla.aviso}`);
    }

    const { resultado, estadisticas, avisos } =
      planilla.estado === 'finalizado'
        ? await cargarFinalizado(partido, local, visitante, semana, planilla, jugadores, simular)
        : planilla.estado === 'en_juego'
          ? await cargarEnJuego(partido, local, visitante, semana, planilla, simular)
          : await cargarProgramado(partido, local, visitante, semana, simular);

    if (resultado !== 'omitido') {
      totales[resultado]++;
    }
    totales.estadisticas += estadisticas;
    totales.avisos += avisos + (planilla.aviso ? 1 : 0);
  }

  if (totales.avisos > 0) {
    console.warn(`\nAvisos: ${totales.avisos} (revisar arriba)`);
  }

  if (simular) {
    console.log('\nSimulación terminada: no se modificó la base.');
    return;
  }

  console.log(
    `\nFinalizados: ${totales.finalizado} · Completados: ${totales.completado} · En juego: ${totales.en_juego} · Programados: ${totales.programado} · Estadísticas cargadas: ${totales.estadisticas}`,
  );

  if (cerrar) {
    await cerrarSemanas(semanas, hasta);
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
