-- =====================================================================
-- Zona Pintada - Seed de datos de la LNB (temporada 2026/27)
-- Borra equipos, jugadores, DT y equipos fantasy, y vuelve a crear los tres primeros.
-- Se puede ejecutar cuantas veces sea necesario: siempre deja el mismo estado.
-- ATENCION: TRUNCATE ... CASCADE tambien vacia las tablas que dependen de ellos
-- (partidos, estadisticas por partido, planteles fantasy y resultados semanales).
-- No toca usuario, temporada ni semana_competencia.
-- =====================================================================
BEGIN;

TRUNCATE public.equipo_fantasy, public.jugador, public.dt, public.equipo RESTART IDENTITY CASCADE;

-- Equipos
INSERT INTO public.equipo (nombre, nombre_corto, ciudad, estadio) VALUES
  ('Argentino', 'ARG', 'Junín', 'El Fortín de las Morochas'),
  ('Atenas', 'ATE', 'Córdoba', 'Estadio de Atenas'),
  ('Boca Juniors', 'BOC', 'Buenos Aires', 'Microestadio Luis Conde'),
  ('Ferro Carril Oeste', 'FCO', 'Buenos Aires', 'Héctor Etchart'),
  ('Gimnasia y Esgrima', 'GIM', 'Comodoro Rivadavia', 'Socios Fundadores'),
  ('Independiente de Oliva', 'IND', 'Oliva', 'El Gigante'),
  ('Instituto', 'INS', 'Córdoba', 'Ángel Sandrín'),
  ('Lanús', 'LAN', 'Lanús', 'Antonio Rotili'),
  ('La Unión de Formosa', 'LUF', 'Formosa', 'Estadio Cincuentenario'),
  ('Oberá Tenis Club', 'OTC', 'Oberá', 'Dr. Luis Augusto Derna'),
  ('Olímpico', 'OLI', 'La Banda', 'Vicente Rosales'),
  ('Peñarol', 'PEN', 'Mar del Plata', 'Polideportivo Islas Malvinas'),
  ('Platense', 'PLA', 'Vicente López', 'Microestadio Ciudad de Vicente López'),
  ('Quimsa', 'QUI', 'Santiago del Estero', 'Estadio Ciudad'),
  ('Racing de Chivilcoy', 'RAC', 'Chivilcoy', 'Grilon Arena'),
  ('Regatas Corrientes', 'REG', 'Corrientes', 'José Jorge Contte'),
  ('San Lorenzo', 'SLO', 'Buenos Aires', 'Polideportivo Roberto Pando'),
  ('San Martín de Corrientes', 'CSM', 'Corrientes', 'El Fortín Rojinegro');

-- Directores tecnicos (uno por equipo)
INSERT INTO public.dt (nombre, apellido, fecha_nacimiento, ciudad, pais, valor, equipo_id)
SELECT v.nombre, v.apellido, v.fecha_nacimiento::date, v.ciudad, v.pais, v.valor, e.id
FROM (VALUES
  ('ARG', 'Adrián', 'Capelli', '1969-07-05', 'Junín', 'Argentina', 6.00),
  ('ATE', 'Leonardo', 'Gutiérrez', '1978-05-16', 'Marcos Juárez', 'Argentina', 6.50),
  ('BOC', 'Nicolás', 'Casalánguida', '1979-03-11', 'Comodoro Rivadavia', 'Argentina', 15.00),
  ('FCO', 'Federico', 'Fernández', NULL, NULL, NULL, 12.50),
  ('GIM', 'Pablo', 'Favarel', NULL, NULL, NULL, 14.00),
  ('IND', 'Martín', 'González', NULL, NULL, NULL, 11.00),
  ('INS', 'Sebastián', 'González', NULL, NULL, NULL, 10.50),
  ('LAN', 'Manuel', 'Anglese', NULL, NULL, NULL, 6.00),
  ('LUF', 'Guillermo', 'Narvarte', '1965-04-29', 'Mar del Plata', 'Argentina', 11.50),
  ('OTC', 'Fabio', 'Demti', NULL, NULL, NULL, 13.00),
  ('OLI', 'Leonardo', 'Costa', NULL, NULL, NULL, 8.50),
  ('PEN', 'Leandro', 'Ramella', NULL, NULL, NULL, 10.00),
  ('PLA', 'Martín', 'Yangüela', NULL, NULL, NULL, 7.00),
  ('QUI', 'Lucas', 'Victoriano', '1977-11-05', 'San Miguel de Tucumán', 'Argentina', 15.00),
  ('RAC', 'Diego', 'D''Ambrosio', NULL, NULL, NULL, 8.00),
  ('REG', 'Martín', 'Villagrán', NULL, NULL, NULL, 13.50),
  ('SLO', 'Gonzalo', 'García', NULL, NULL, NULL, 7.50),
  ('CSM', 'Gabriel', 'Revidatti', NULL, NULL, NULL, 9.00)
) AS v(equipo, nombre, apellido, fecha_nacimiento, ciudad, pais, valor)
JOIN public.equipo e ON e.nombre_corto = v.equipo;

-- Jugadores
INSERT INTO public.jugador (nombre, apellido, posicion, fecha_nacimiento, ciudad, pais, altura, mano_habil, valor, equipo_id)
SELECT v.nombre, v.apellido, v.posicion::public.posicion_jugador, v.fecha_nacimiento::date, v.ciudad, v.pais, v.altura, v.mano_habil::public.mano_habil_enum, v.valor, e.id
FROM (VALUES
  ('ARG', 'Cristian', 'Cardo', 'alero', '1999-01-17', 'Villa Carlos Paz', 'Argentina', 1.98, 'derecha', 9.50),
  ('ARG', 'Leandro', 'Cerminato', 'ala-pivot', '1998-06-09', 'El Palomar', 'Argentina', 2.02, 'derecha', 11.00),
  ('ARG', 'Rómulo', 'Gusmao', 'pivot', '1995-10-01', 'Brasilia', 'Brasil', 2.07, 'derecha', 5.00),
  ('ATE', 'Franco', 'Balbi', 'base', '1989-08-21', 'Junín', 'Argentina', 1.85, 'derecha', 12.00),
  ('ATE', 'Facundo', 'Vázquez', 'base', '1998-04-23', 'Buenos Aires', 'Argentina', 1.85, 'derecha', 11.50),
  ('ATE', 'Santiago', 'Ferreyra', 'escolta', '1997-03-11', 'Hernando', 'Argentina', 1.89, 'derecha', 7.00),
  ('ATE', 'Adonys', 'Henríquez', 'alero', '1994-11-13', 'Orlando', 'Estados Unidos', 1.98, 'derecha', 9.50),
  ('ATE', 'Tomás', 'Cavallero', 'alero', '1998-05-24', 'Buenos Aires', 'Argentina', 1.96, 'derecha', 8.50),
  ('ATE', 'Bryan', 'Carabalí', 'ala-pivot', '1999-08-24', 'San Lorenzo', 'Ecuador', 2.15, 'derecha', 14.00),
  ('ATE', 'Gonzalo', 'Bressan', 'pivot', '2001-11-16', 'Córdoba', 'Argentina', 2.10, 'derecha', 13.50),
  ('BOC', 'José', 'Vildoza', 'base', '1996-01-15', 'Córdoba', 'Argentina', 1.90, 'izquierda', 18.00),
  ('BOC', 'Francisco', 'Cáffaro', 'ala-pivot', '2000-05-19', 'Santa Fe', 'Argentina', 2.16, 'derecha', 16.00),
  ('BOC', 'Leonardo', 'Lema', 'alero', '1998-06-20', 'General Pico', 'Argentina', 2.03, 'derecha', 15.00),
  ('BOC', 'Lucas', 'Faggiano', 'base', '1989-03-21', 'Bahía Blanca', 'Argentina', 1.88, 'derecha', 7.00),
  ('BOC', 'Martín', 'Cuello', 'escolta', '1993-03-12', 'Ramos Mejía', 'Argentina', 1.93, 'derecha', 8.00),
  ('BOC', 'Tomás', 'Monacchi', 'alero', '1997-11-10', 'Mar del Plata', 'Argentina', 1.96, 'derecha', 8.00),
  ('BOC', 'Agustín', 'Barreiro', 'ala-pivot', '1999-02-02', 'Cañuelas', 'Argentina', 2.03, 'derecha', 11.50),
  ('FCO', 'Emiliano', 'Lezcano', 'escolta', '2001-05-02', 'Tafí Viejo', 'Argentina', 1.86, 'derecha', 17.00),
  ('FCO', 'Facundo', 'Piñero', 'ala-pivot', '1988-09-26', 'Mar del Plata', 'Argentina', 1.98, 'derecha', 14.00),
  ('FCO', 'Felipe', 'Rodríguez', 'alero', '2003-03-12', 'Ramos Mejía', 'Argentina', 1.95, 'derecha', 13.00),
  ('FCO', 'Rodrigo', 'Gallegos', 'base', '1991-01-28', 'Arroyo Seco', 'Argentina', 1.88, 'derecha', 6.00),
  ('FCO', 'Valentín', 'Bettiga', 'alero', '1999-10-09', 'Coronel Pringles', 'Argentina', 1.93, 'derecha', 10.50),
  ('FCO', 'Federico', 'Zezular', 'alero', '2001-11-09', 'Córdoba', 'Argentina', 1.97, 'izquierda', 7.50),
  ('FCO', 'Kevin', 'Hernández', 'pivot', '1991-03-28', 'Buenos Aires', 'Argentina', 2.05, 'derecha', 13.00),
  ('GIM', 'Sebastián', 'Carrasco', 'base', '2000-01-11', 'Ancud', 'Chile', 1.80, 'derecha', 6.50),
  ('GIM', 'Felipe', 'Inyaco', 'escolta', '2002-02-05', 'Penco', 'Chile', 1.92, 'derecha', 7.50),
  ('GIM', 'Marcos', 'Chacón', 'alero', '2003-06-24', 'La Habana', 'Cuba', 1.94, 'derecha', 12.00),
  ('IND', 'Juan Martín', 'Guerrero', 'base', '2003-03-12', 'San Juan', 'Argentina', 1.88, 'derecha', 9.50),
  ('IND', 'Patricio', 'Tabarez', 'alero', '1991-06-26', 'Presidente Derqui', 'Argentina', 2.00, 'derecha', 10.00),
  ('IND', 'Agustín', 'Cáffaro', 'pivot', '1995-02-06', 'Piamonte', 'Argentina', 2.11, 'derecha', 18.00),
  ('IND', 'Enzo', 'Filippetti', 'pivot', '2001-05-27', 'Junín', 'Argentina', 2.01, 'derecha', 7.00),
  ('INS', 'Leandro', 'Vildoza', 'base', '1994-11-02', 'Tafí Viejo', 'Argentina', 1.80, 'derecha', 7.00),
  ('INS', 'Gastón', 'Whelan', 'base', '1994-10-06', 'Córdoba', 'Argentina', 1.88, 'derecha', 13.00),
  ('INS', 'Juan Pablo', 'Corbalán', 'escolta', '1998-08-22', 'Resistencia', 'Argentina', 1.85, 'derecha', 11.00),
  ('INS', 'Xavier', 'Carreras', 'alero', '1994-10-09', 'Bayaguana', 'República Dominicana', 1.98, 'derecha', 7.50),
  ('INS', 'Federico', 'Aguerre', 'alero', '1988-10-27', 'Godoy Cruz', 'Argentina', 2.03, 'derecha', 10.00),
  ('INS', 'Bautista', 'Lugarini', 'ala-pivot', '2001-01-31', 'San Nicolás de los Arroyos', 'Argentina', 2.03, 'derecha', 14.00),
  ('LAN', 'Juan Ignacio', 'Brussino', 'base', '1991-03-14', 'Cañada de Gómez', 'Argentina', 1.85, 'derecha', 11.00),
  ('LAN', 'Lucas', 'Andújar', 'base', '1996-11-25', 'Quilmes', 'Argentina', 1.87, 'derecha', 8.00),
  ('LAN', 'Melvin', 'Johnson', 'escolta', '1993-06-17', 'Nueva York', 'Estados Unidos', 1.93, 'derecha', 7.50),
  ('LAN', 'Christian', 'James', 'alero', '1996-10-23', 'Houston', 'Estados Unidos', 1.93, 'derecha', 7.50),
  ('LAN', 'Pedro', 'Bombino', 'pivot', '2000-03-21', 'Ciego de Ávila', 'Cuba', 2.08, 'derecha', 13.00),
  ('LUF', 'Agustín', 'Facello', 'base', '1999-08-18', 'Paraná', 'Argentina', 1.83, 'derecha', 8.50),
  ('LUF', 'Alexis', 'Elsener', 'alero', '1988-02-23', 'Villa María', 'Argentina', 1.95, 'derecha', 12.50),
  ('LUF', 'Sebastián', 'Acevedo', 'ala-pivot', '1990-09-13', 'Santiago del Estero', 'Argentina', 1.98, 'derecha', 9.50),
  ('LUF', 'Franco', 'Alorda', 'ala-pivot', '1999-02-24', 'Sauce', 'Argentina', 2.04, 'derecha', 5.00),
  ('LUF', 'Windi', 'Graterol', 'pivot', '1986-09-10', 'Caracas', 'Venezuela', 2.06, 'derecha', 16.00),
  ('OTC', 'Bruno', 'Sansimoni', 'base', '1996-04-22', 'Olavarría', 'Argentina', 1.93, 'derecha', 10.50),
  ('OTC', 'Víctor', 'Fernández', 'base', '1999-09-16', 'San Nicolás de los Arroyos', 'Argentina', 1.76, 'derecha', 6.50),
  ('OTC', 'Agustín', 'Brocal', 'escolta', '1997-10-09', 'Resistencia', 'Argentina', 1.91, 'derecha', 9.50),
  ('OTC', 'Jonatan', 'Torresi', 'escolta', '1994-05-13', 'Casilda', 'Argentina', 1.90, 'derecha', 8.00),
  ('OTC', 'Will', 'Vorhees', 'pivot', '1995-12-18', 'Lima', 'Estados Unidos', 2.03, 'derecha', 11.00),
  ('OLI', 'Guido', 'Mariani', 'alero', '1994-08-18', 'Rosario', 'Argentina', 1.95, 'derecha', 5.50),
  ('OLI', 'Hall', 'Elisias', 'pivot', '1998-01-20', 'Valley Stream', 'Estados Unidos', 2.03, 'derecha', 10.00),
  ('PEN', 'Andrés', 'Jaime', 'base', '2000-03-13', 'Santa Fe', 'Argentina', 1.85, 'derecha', 13.50),
  ('PEN', 'Luciano', 'Guerra', 'base', '1997-09-02', 'Colonia Caroya', 'Argentina', 1.85, 'izquierda', 12.00),
  ('PEN', 'Agustín', 'Pérez Tapia', 'escolta', '1999-03-19', 'Neuquén', 'Argentina', 1.87, 'derecha', 13.50),
  ('PEN', 'Selem', 'Safar', 'escolta', '1987-05-06', 'Mar del Plata', 'Argentina', 1.92, 'izquierda', 7.50),
  ('PEN', 'Sebastián', 'Vega', 'alero', '1988-07-09', 'Gualeguaychú', 'Argentina', 2.00, 'derecha', 8.50),
  ('PEN', 'Franco', 'Giorgetti', 'ala-pivot', '1992-12-02', 'Resistencia', 'Argentina', 2.03, 'derecha', 8.00),
  ('PEN', 'Iván', 'Basualdo', 'pivot', '1990-01-16', 'Santa Fe', 'Argentina', 2.03, 'izquierda', 12.00),
  ('PLA', 'Federico', 'Grun', 'escolta', '1996-11-13', 'Carmen de Patagones', 'Argentina', 1.91, 'derecha', 11.00),
  ('PLA', 'Julián', 'Morales', 'alero', '1995-06-01', 'Goya', 'Argentina', 1.95, 'izquierda', 10.00),
  ('PLA', 'Mauro', 'Cosolito', 'alero', '1988-12-18', 'Santa Fe', 'Argentina', 1.95, 'derecha', 7.50),
  ('PLA', 'Erik', 'Copes', 'ala-pivot', '1993-01-29', 'Filadelfia', 'Estados Unidos', 2.06, 'derecha', 13.00),
  ('QUI', 'Juan Ignacio', 'Laterza', 'base', '1997-05-07', 'Necochea', 'Argentina', 1.85, 'derecha', 6.00),
  ('QUI', 'Francisco', 'Conrradi', 'base', '2003-11-20', 'Hermoso Campo', 'Argentina', 1.92, 'derecha', 8.50),
  ('QUI', 'Matías', 'Solanas', 'escolta', '1998-12-17', 'Paraná', 'Argentina', 1.93, 'derecha', 12.50),
  ('QUI', 'Facundo', 'Rutenberg', 'escolta', '2001-01-06', 'Tres de Febrero', 'Argentina', 1.95, 'derecha', 11.50),
  ('QUI', 'Nicolás', 'Copello', 'alero', '1992-02-11', 'Santa Fe', 'Argentina', 1.94, 'izquierda', 10.50),
  ('QUI', 'Tyren', 'Johnson', 'ala-pivot', '1988-07-24', 'Edgard', 'Estados Unidos', 2.03, 'derecha', 8.50),
  ('QUI', 'Tayavek', 'Gallizzi', 'pivot', '1993-02-08', 'Santa Fe', 'Argentina', 2.06, 'derecha', 9.50),
  ('RAC', 'Pedro', 'Barral', 'base', '1994-10-20', 'Morón', 'Argentina', 1.87, 'derecha', 10.50),
  ('RAC', 'Juan', 'Bocca', 'base', '2005-03-18', 'Capilla del Señor', 'Argentina', 1.98, 'derecha', 6.00),
  ('RAC', 'Mateo', 'Chiarini', 'escolta', '1998-09-04', 'Córdoba', 'Argentina', 1.88, 'derecha', 11.50),
  ('RAC', 'Nicolás', 'Romano', 'alero', '1987-11-01', 'Junín', 'Argentina', 2.00, 'derecha', 15.00),
  ('RAC', 'Emilio', 'Stucky', 'ala-pivot', '1994-04-23', 'Campo Quijano', 'Argentina', 1.98, 'derecha', 7.00),
  ('RAC', 'Marcos', 'Delía', 'pivot', '1992-04-08', 'Saladillo', 'Argentina', 2.08, 'derecha', 13.00),
  ('REG', 'Sebastián', 'Orresta', 'base', '1993-05-06', 'Tafí Viejo', 'Argentina', 1.88, 'derecha', 9.50),
  ('REG', 'Francisco', 'Farabello', 'base', '2000-11-01', 'Olavarría', 'Argentina', 1.91, 'derecha', 9.50),
  ('REG', 'Iván', 'Gramajo', 'alero', '1996-02-02', 'San Miguel de Tucumán', 'Argentina', 1.93, 'derecha', 13.50),
  ('REG', 'Fausto', 'Ruesga', 'alero', '2000-07-18', 'Bahía Blanca', 'Argentina', 1.98, 'derecha', 10.50),
  ('REG', 'Roberto', 'Acuña', 'pivot', '1990-09-14', 'Rafaela', 'Argentina', 2.08, 'derecha', 12.50),
  ('REG', 'Keith', 'Stone', 'pivot', '1997-08-25', 'Deerfield Beach', 'Estados Unidos', 2.03, 'derecha', 5.00),
  ('SLO', 'Nicolás', 'Aguirre', 'base', '1988-03-31', 'Santiago del Estero', 'Argentina', 1.89, 'derecha', 11.00),
  ('SLO', 'Eric', 'Flor', 'escolta', '1993-05-10', 'Merlo', 'Argentina', 1.90, 'derecha', 6.50),
  ('SLO', 'Leonel', 'Schattmann', 'escolta', '1987-05-14', 'Viedma', 'Argentina', 1.94, 'derecha', 11.00),
  ('SLO', 'Marcos', 'Mata', 'alero', '1986-08-01', 'Mar del Plata', 'Argentina', 2.01, 'derecha', 12.50),
  ('SLO', 'Lucas', 'Gargallo', 'alero', '1995-02-20', 'Bernal', 'Argentina', 1.95, 'derecha', 7.50),
  ('SLO', 'Raynere', 'Thornton', 'alero', '1995-09-14', 'Marietta', 'Estados Unidos', 1.98, 'derecha', 14.00),
  ('CSM', 'Gastón', 'García', 'base', '1998-12-15', 'Reconquista', 'Argentina', 1.88, 'derecha', 7.50),
  ('CSM', 'Sebastián', 'Lugo', 'alero', '1998-03-26', 'Resistencia', 'Argentina', 1.97, 'derecha', 13.00),
  ('CSM', 'Lautaro', 'Berra', 'pivot', '1998-01-09', 'Firmat', 'Argentina', 2.08, 'derecha', 10.00)
) AS v(equipo, nombre, apellido, posicion, fecha_nacimiento, ciudad, pais, altura, mano_habil, valor)
JOIN public.equipo e ON e.nombre_corto = v.equipo;

-- Control: deben quedar 18 equipos, 18 DT y 93 jugadores.
SELECT (SELECT COUNT(*) FROM public.equipo) AS equipos, (SELECT COUNT(*) FROM public.dt) AS dts, (SELECT COUNT(*) FROM public.jugador) AS jugadores;

COMMIT;
