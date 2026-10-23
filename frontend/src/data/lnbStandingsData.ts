export interface LNBTeamStanding {
  pos: number;
  team: string;
  short: string;
  conference: 'Norte' | 'Sur';
  pj: number;
  pg: number;
  pp: number;
  pct: string;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
  streak: string;
}

export interface LNBStatLeader {
  category: string;
  statName: string;
  leaders: {
    rank: number;
    player: string;
    team: string;
    teamShort: string;
    position: string;
    value: string;
    photoInitial: string;
  }[];
}

export const LNB_OFFICIAL_STANDINGS: LNBTeamStanding[] = [
  { pos: 1, team: 'Quimsa', short: 'QUI', conference: 'Norte', pj: 24, pg: 19, pp: 5, pct: '79.2%', pointsFor: 2045, pointsAgainst: 1850, diff: +195, streak: '4G' },
  { pos: 2, team: 'Instituto ACC', short: 'INS', conference: 'Norte', pj: 24, pg: 18, pp: 6, pct: '75.0%', pointsFor: 1980, pointsAgainst: 1820, diff: +160, streak: '2G' },
  { pos: 3, team: 'Boca Juniors', short: 'BOC', conference: 'Sur', pj: 23, pg: 17, pp: 6, pct: '73.9%', pointsFor: 1910, pointsAgainst: 1775, diff: +135, streak: '3G' },
  { pos: 4, team: 'Olímpico (LB)', short: 'OLI', conference: 'Norte', pj: 23, pg: 16, pp: 7, pct: '69.6%', pointsFor: 1935, pointsAgainst: 1810, diff: +125, streak: '1P' },
  { pos: 5, team: 'Platense', short: 'PLA', conference: 'Sur', pj: 24, pg: 15, pp: 9, pct: '62.5%', pointsFor: 1890, pointsAgainst: 1835, diff: +55, streak: '1G' },
  { pos: 6, team: 'Obras Sanitarias', short: 'OBR', conference: 'Sur', pj: 23, pg: 14, pp: 9, pct: '60.9%', pointsFor: 1920, pointsAgainst: 1880, diff: +40, streak: '2G' },
  { pos: 7, team: 'San Lorenzo', short: 'SLO', conference: 'Sur', pj: 24, pg: 13, pp: 11, pct: '54.2%', pointsFor: 1840, pointsAgainst: 1810, diff: +30, streak: '1P' },
  { pos: 8, team: 'San Martín (C)', short: 'SMA', conference: 'Norte', pj: 23, pg: 12, pp: 11, pct: '52.2%', pointsFor: 1765, pointsAgainst: 1740, diff: +25, streak: '2P' },
  { pos: 9, team: 'Regatas Corrientes', short: 'REG', conference: 'Norte', pj: 24, pg: 12, pp: 12, pct: '50.0%', pointsFor: 1895, pointsAgainst: 1890, diff: +5, streak: '1G' },
  { pos: 10, team: 'Gimnasia (CR)', short: 'GIM', conference: 'Sur', pj: 23, pg: 11, pp: 12, pct: '47.8%', pointsFor: 1810, pointsAgainst: 1830, diff: -20, streak: '1P' },
  { pos: 11, team: 'Peñarol (MdP)', short: 'PEN', conference: 'Sur', pj: 24, pg: 11, pp: 13, pct: '45.8%', pointsFor: 1870, pointsAgainst: 1910, diff: -40, streak: '1G' },
  { pos: 12, team: 'Oberá TC', short: 'OTC', conference: 'Norte', pj: 24, pg: 11, pp: 13, pct: '45.8%', pointsFor: 1850, pointsAgainst: 1905, diff: -55, streak: '2P' },
  { pos: 13, team: 'Ferro Carril Oeste', short: 'FCO', conference: 'Sur', pj: 24, pg: 10, pp: 14, pct: '41.7%', pointsFor: 1830, pointsAgainst: 1895, diff: -65, streak: '1P' },
  { pos: 14, team: 'Riachuelo (LR)', short: 'RIA', conference: 'Norte', pj: 24, pg: 9, pp: 15, pct: '37.5%', pointsFor: 1880, pointsAgainst: 1960, diff: -80, streak: '3P' },
  { pos: 15, team: 'Zárate Basket', short: 'ZAR', conference: 'Sur', pj: 24, pg: 9, pp: 15, pct: '37.5%', pointsFor: 1740, pointsAgainst: 1870, diff: -130, streak: '2P' },
  { pos: 16, team: 'La Unión (F)', short: 'LAU', conference: 'Norte', pj: 24, pg: 8, pp: 16, pct: '33.3%', pointsFor: 1810, pointsAgainst: 1980, diff: -170, streak: '4P' }
];

export const LNB_STAT_LEADERS: LNBStatLeader[] = [
  {
    category: 'Valoración Oficial',
    statName: 'VAL Promedio',
    leaders: [
      { rank: 1, player: 'Franco Balbi', team: 'Boca Juniors', teamShort: 'BOC', position: 'Base', value: '25.8', photoInitial: 'FB' },
      { rank: 2, player: 'José Vildoza', team: 'Boca Juniors', teamShort: 'BOC', position: 'Escolta', value: '25.2', photoInitial: 'JV' },
      { rank: 3, player: 'Nicolás Aguirre', team: 'Regatas', teamShort: 'REG', position: 'Base', value: '24.6', photoInitial: 'NA' },
      { rank: 4, player: 'Brandon Robinson', team: 'Quimsa', teamShort: 'QUI', position: 'Alero', value: '23.8', photoInitial: 'BR' }
    ]
  },
  {
    category: 'Goleadores',
    statName: 'Puntos por Partido',
    leaders: [
      { rank: 1, player: 'José Vildoza', team: 'Boca Juniors', teamShort: 'BOC', position: 'Escolta', value: '18.9', photoInitial: 'JV' },
      { rank: 2, player: 'Brandon Robinson', team: 'Quimsa', teamShort: 'QUI', position: 'Alero', value: '18.2', photoInitial: 'BR' },
      { rank: 3, player: 'Nicolás Aguirre', team: 'Regatas', teamShort: 'REG', position: 'Base', value: '17.8', photoInitial: 'NA' },
      { rank: 4, player: 'Pedro Barral', team: 'Obras', teamShort: 'OBR', position: 'Base', value: '16.5', photoInitial: 'PB' }
    ]
  },
  {
    category: 'Asistidores',
    statName: 'Asistencias por Partido',
    leaders: [
      { rank: 1, player: 'Franco Balbi', team: 'Boca Juniors', teamShort: 'BOC', position: 'Base', value: '8.5', photoInitial: 'FB' },
      { rank: 2, player: 'Nicolás Aguirre', team: 'Regatas', teamShort: 'REG', position: 'Base', value: '7.2', photoInitial: 'NA' },
      { rank: 3, player: 'Pedro Barral', team: 'Obras', teamShort: 'OBR', position: 'Base', value: '6.8', photoInitial: 'PB' },
      { rank: 4, player: 'Juan Brussino', team: 'Quimsa', teamShort: 'QUI', position: 'Base', value: '6.4', photoInitial: 'JB' }
    ]
  },
  {
    category: 'Reboteadores',
    statName: 'Rebotes por Partido',
    leaders: [
      { rank: 1, player: 'Tayavek Gallizzi', team: 'Quimsa', teamShort: 'QUI', position: 'Pívot', value: '9.1', photoInitial: 'TG' },
      { rank: 2, player: 'Roberto Acuña', team: 'Instituto', teamShort: 'INS', position: 'Pívot', value: '8.8', photoInitial: 'RA' },
      { rank: 3, player: 'Marcos Mata', team: 'Boca Juniors', teamShort: 'BOC', position: 'Alero', value: '8.2', photoInitial: 'MM' },
      { rank: 4, player: 'Fabian Ramirez Barrios', team: 'Regatas', teamShort: 'REG', position: 'Ala-Pívot', value: '7.6', photoInitial: 'FR' }
    ]
  }
];
