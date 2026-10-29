import { LiveMatch, PrivateLeague, GlobalRankingEntry } from "../types/league";

export interface CommunityLeague {
  id: string;
  code: string;
  name: string;
  description: string;
  creator: string;
  membersCount: number;
  leaderTeam: string;
  leaderPoints: number;
  category: "Oficial" | "Prensa" | "Clubes" | "General";
  isOfficial?: boolean;
}

export const LNB_MATCHES_FECHA_18: LiveMatch[] = [
  {
    id: "m-1",
    homeTeam: "Instituto de Córdoba",
    awayTeam: "Quimsa de Santiago del Estero",
    homeScore: 78,
    awayScore: 74,
    quarter: "4C 02:45",
    status: "live",
    arena: "Ángel Sandrín, Córdoba",
    tv: "TyC Sports / BasquetPass",
    date: "Hoy 21:10 hs",
    topPerformer: {
      name: "Nicolás Copello",
      points: 21,
      val: 26.5,
      team: "Instituto"
    }
  },
  {
    id: "m-2",
    homeTeam: "Boca Juniors",
    awayTeam: "San Lorenzo",
    homeScore: 82,
    awayScore: 80,
    quarter: "Final",
    status: "finished",
    arena: "Luis Conde 'La Bombonerita', CABA",
    tv: "DirecTV Sports / BasquetPass",
    date: "Ayer 20:00 hs",
    topPerformer: {
      name: "José Vildoza",
      points: 24,
      val: 28.0,
      team: "Boca Juniors"
    }
  },
  {
    id: "m-3",
    homeTeam: "Peñarol de Mar del Plata",
    awayTeam: "Obras Sanitarias",
    homeScore: 65,
    awayScore: 68,
    quarter: "3C 04:10",
    status: "live",
    arena: "Polideportivo Islas Malvinas, Mar del Plata",
    tv: "BasquetPass",
    date: "Hoy 20:00 hs",
    topPerformer: {
      name: "Pedro Barral",
      points: 17,
      val: 22.0,
      team: "Obras Sanitarias"
    }
  },
  {
    id: "m-4",
    homeTeam: "Gimnasia y Esgrima (CR)",
    awayTeam: "Regatas Corrientes",
    homeScore: 0,
    awayScore: 0,
    quarter: "Sábado 21:00",
    status: "upcoming",
    arena: "Socios Fundadores, Comodoro Rivadavia",
    tv: "BasquetPass",
    date: "Mañana 21:00 hs"
  },
  {
    id: "m-5",
    homeTeam: "San Martín de Corrientes",
    awayTeam: "Ferro Carril Oeste",
    homeScore: 0,
    awayScore: 0,
    quarter: "Domingo 20:00",
    status: "upcoming",
    arena: "El Fortín Rojinegro, Corrientes",
    tv: "TyC Sports Play",
    date: "Domingo 20:00 hs"
  }
];

export const COMMUNITY_LEAGUES: CommunityLeague[] = [
  {
    id: "com-1",
    code: "OFICIAL-LNB",
    name: "Liga Oficial LNB 2024/25",
    description: "La liga oficial abierta a todos los entrenadores de Argentina con premios por fecha.",
    creator: "Asociación de Clubes (LNB)",
    membersCount: 3420,
    leaderTeam: "La Gloria Invicta",
    leaderPoints: 1540.5,
    category: "Oficial",
    isOfficial: true
  },
  {
    id: "com-2",
    code: "PRENSA-BP",
    name: "Torneo Prensa & Streaming BásquetPass",
    description: "Compite con periodistas, relatores y comentaristas de la Liga Nacional.",
    creator: "BásquetPass TV",
    membersCount: 840,
    leaderTeam: "Triple en Suspensión",
    leaderPoints: 1510.0,
    category: "Prensa",
    isOfficial: true
  },
  {
    id: "com-3",
    code: "BOCA-BASKET",
    name: "Fans de Boca Básquet",
    description: "Comunidad de socios e hinchas xeneizes que siguen la campaña en La Bombonerita.",
    creator: "Boca Básquet Comunidad",
    membersCount: 910,
    leaderTeam: "Xeneize Pentacampeón",
    leaderPoints: 1528.0,
    category: "Clubes"
  },
  {
    id: "com-4",
    code: "TRIPLES-NORTE",
    name: "Comunidad Triples & Tableros",
    description: "Entrenadores de Córdoba, Santiago del Estero y Santa Fe compitiendo fecha a fecha.",
    creator: "Fusión & Atenas Fans",
    membersCount: 1250,
    leaderTeam: "La Fusión Santiagueña",
    leaderPoints: 1515.0,
    category: "General"
  },
  {
    id: "com-5",
    code: "SUR-PENAROL",
    name: "Clásicos del Básquet Argentino",
    description: "Amantes de los equipos históricos y campeones de la Liga Nacional.",
    creator: "Peñarol & Ferro Pasión",
    membersCount: 780,
    leaderTeam: "Milrayitas del Sur",
    leaderPoints: 1502.5,
    category: "Clubes"
  },
  {
    id: "com-6",
    code: "FEDERAL-DTS",
    name: "Torneo Federal de DTs de Barrio",
    description: "Entrenadores de clubes de barrio y formativas demostrando su táctica.",
    creator: "Unión de DTs",
    membersCount: 620,
    leaderTeam: "Remeros de Paraná",
    leaderPoints: 1442.5,
    category: "General"
  }
];

export const INITIAL_PRIVATE_LEAGUES: PrivateLeague[] = [
  {
    id: "league-1",
    code: "ZONA-8821",
    name: "Liga Asado & Triple LNB",
    creator: "Felipe M.",
    membersCount: 8,
    userRank: 2,
    type: "clasica",
    members: [
      { id: "u-1", rank: 1, userName: "Lucas Básquet", teamName: "Triple a la Tabla", avatarLetter: "L", totalPoints: 1420.5, matchdayPoints: 89.0 },
      { id: "u-curr", rank: 2, userName: "Mi Franquicia", teamName: "Zona Pintada BC", avatarLetter: "M", totalPoints: 1395.0, matchdayPoints: 92.5, isCurrentUser: true },
      { id: "u-2", rank: 3, userName: "Nico 'La Bomba'", teamName: "Quimsa Fanáticos", avatarLetter: "N", totalPoints: 1350.2, matchdayPoints: 76.0 },
      { id: "u-3", rank: 4, userName: "Matías DT", teamName: "Boca Triunfador", avatarLetter: "M", totalPoints: 1312.0, matchdayPoints: 81.0 },
      { id: "u-4", rank: 5, userName: "Gonzalo", teamName: "Peñarol de Primera", avatarLetter: "G", totalPoints: 1280.0, matchdayPoints: 69.5 },
      { id: "u-5", rank: 6, userName: "Santi C.", teamName: "Instituto Campeón", avatarLetter: "S", totalPoints: 1245.0, matchdayPoints: 74.0 },
      { id: "u-6", rank: 7, userName: "Agustín P.", teamName: "Tacheros de Núñez", avatarLetter: "A", totalPoints: 1190.5, matchdayPoints: 60.0 },
      { id: "u-7", rank: 8, userName: "Julián V.", teamName: "San Lorenzo Garra", avatarLetter: "J", totalPoints: 1110.0, matchdayPoints: 55.0 },
    ]
  },
  {
    id: "league-2",
    code: "CORDOBA-35",
    name: "Torneo La Docta LNB",
    creator: "Esteban R.",
    membersCount: 12,
    userRank: 4,
    type: "clasica",
    members: [
      { id: "u-10", rank: 1, userName: "Facu Campazzo Fan", teamName: "Atenas Glory", avatarLetter: "F", totalPoints: 1455.0, matchdayPoints: 96.0 },
      { id: "u-11", rank: 2, userName: "Ramiro C.", teamName: "Instituto Gloria", avatarLetter: "R", totalPoints: 1410.0, matchdayPoints: 88.0 },
      { id: "u-12", rank: 3, userName: "Marcos L.", teamName: "Albi-Rojos", avatarLetter: "M", totalPoints: 1398.0, matchdayPoints: 85.0 },
      { id: "u-curr-2", rank: 4, userName: "Mi Franquicia", teamName: "Zona Pintada BC", avatarLetter: "M", totalPoints: 1395.0, matchdayPoints: 92.5, isCurrentUser: true },
      { id: "u-13", rank: 5, userName: "Tito", teamName: "Barrio San Martín", avatarLetter: "T", totalPoints: 1340.0, matchdayPoints: 71.0 },
    ]
  }
];

export const GLOBAL_RANKINGS_MOCK: GlobalRankingEntry[] = [
  { rank: 1, teamName: "La Gloria Invicta", ownerName: "Martín Benítez (Córdoba)", totalPoints: 1540.5, matchdayPoints: 104.0, favoriteClub: "Instituto" },
  { rank: 2, teamName: "Xeneize Pentacampeón", ownerName: "Joaquín Díaz (CABA)", totalPoints: 1528.0, matchdayPoints: 99.5, favoriteClub: "Boca Juniors" },
  { rank: 3, teamName: "La Fusión Santiagueña", ownerName: "Emiliano Torresi (Santiago del Estero)", totalPoints: 1515.0, matchdayPoints: 94.0, favoriteClub: "Quimsa" },
  { rank: 4, teamName: "Triple en Suspensión", ownerName: "Hernán Casanova (Rosario)", totalPoints: 1510.0, matchdayPoints: 95.0, favoriteClub: "Obras" },
  { rank: 5, teamName: "Milrayitas del Sur", ownerName: "Diego Ferrari (Mar del Plata)", totalPoints: 1502.5, matchdayPoints: 91.0, favoriteClub: "Peñarol" },
  { rank: 6, teamName: "Obras Rock & Dunk", ownerName: "Mariano Soria (Vicente López)", totalPoints: 1495.0, matchdayPoints: 96.5, favoriteClub: "Obras Sanitarias" },
  { rank: 7, teamName: "Cuervos de Boedo", ownerName: "Tomás Rossi (Boedo, CABA)", totalPoints: 1482.0, matchdayPoints: 88.0, favoriteClub: "San Lorenzo" },
  { rank: 8, teamName: "Fantasma Correntino", ownerName: "Rodrigo Valdéz (Corrientes)", totalPoints: 1470.5, matchdayPoints: 85.5, favoriteClub: "Regatas" },
  { rank: 9, teamName: "Verde de Caballito", ownerName: "Hernán Morales (Caballito, CABA)", totalPoints: 1461.0, matchdayPoints: 89.0, favoriteClub: "Ferro" },
  { rank: 10, teamName: "Magia Petrolera", ownerName: "Pablo Kaczor (Comodoro Rivadavia)", totalPoints: 1450.0, matchdayPoints: 82.0, favoriteClub: "Gimnasia (CR)" },
  { rank: 11, teamName: "Calamar Estratégico", ownerName: "Gonzalo Varela (Vicente López)", totalPoints: 1446.0, matchdayPoints: 86.0, favoriteClub: "Platense" },
  { rank: 12, teamName: "Remeros de Paraná", ownerName: "Federico Luna (Paraná)", totalPoints: 1442.5, matchdayPoints: 84.0, favoriteClub: "Echagüe" },
  { rank: 13, teamName: "Misiones Mágica", ownerName: "Matías Oberá (Posadas)", totalPoints: 1438.0, matchdayPoints: 79.5, favoriteClub: "Oberá TC" },
  { rank: 14, teamName: "Rojinegro Correntino", ownerName: "Santiago Romero (Corrientes)", totalPoints: 1431.5, matchdayPoints: 81.0, favoriteClub: "San Martín" },
  { rank: 15, teamName: "Bandeños de Primera", ownerName: "Carlos Albarracín (La Banda)", totalPoints: 1425.0, matchdayPoints: 83.5, favoriteClub: "Olímpico" },
  { rank: 16, teamName: "La Unión Formoseña", ownerName: "Facundo Cáceres (Formosa)", totalPoints: 1419.0, matchdayPoints: 78.0, favoriteClub: "La Unión" },
  { rank: 17, teamName: "Eterno Riachuelo", ownerName: "Franco Mercado (La Rioja)", totalPoints: 1412.5, matchdayPoints: 76.5, favoriteClub: "Riachuelo" },
  { rank: 18, teamName: "Zárate Quinteto", ownerName: "Bruno Pereyra (Zárate)", totalPoints: 1405.0, matchdayPoints: 80.0, favoriteClub: "Zárate Basket" },
  { rank: 19, teamName: "Básquet Champagne", ownerName: "Guillermo P. (CABA)", totalPoints: 1400.0, matchdayPoints: 79.0, favoriteClub: "Boca Juniors" },
  { rank: 20, teamName: "Zona Pintada BC", ownerName: "Tu Franquicia (Tú)", totalPoints: 1395.0, matchdayPoints: 92.5, favoriteClub: "LNB Oficial", isCurrentUser: true }
];

export const LIVE_PLAY_BY_PLAY_TICKER = [
  { id: "p-1", time: "4C 02:45", match: "Instituto vs Quimsa", event: "Triple de Nicolás Copello desde la esquina (+3 pts, +3.5 val)", impact: "+3.5 val" },
  { id: "p-2", time: "4C 01:50", match: "Instituto vs Quimsa", event: "Tapa espectacular de Roberto Acuña en la pintura (+2 val)", impact: "+2.0 val" },
  { id: "p-3", time: "3C 04:10", match: "Peñarol vs Obras", event: "Asistencia de Pedro Barral para volcada (+2 pts, +2.5 val)", impact: "+2.5 val" },
  { id: "p-4", time: "Final", match: "Boca 82 - 80 San Lorenzo", event: "José Vildoza sentenció el clásico con doble en suspensión (+4 val)", impact: "+4.0 val" }
];
