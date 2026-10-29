export interface LeagueMember {
  id: string;
  rank: number;
  userName: string;
  teamName: string;
  avatarLetter: string;
  totalPoints: number;
  matchdayPoints: number;
  isCurrentUser?: boolean;
}

export interface PrivateLeague {
  id: string;
  code: string;
  name: string;
  creator: string;
  membersCount: number;
  userRank: number;
  type: 'clasica' | 'head_to_head';
  members: LeagueMember[];
}

export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: string; // e.g. "4C 03:40" or "Final" or "Viernes 21:00"
  status: 'live' | 'finished' | 'upcoming';
  arena: string;
  tv: string;
  date: string;
  topPerformer?: {
    name: string;
    points: number;
    val: number;
    team: string;
  };
}

export interface GlobalRankingEntry {
  rank: number;
  teamName: string;
  ownerName: string;
  totalPoints: number;
  matchdayPoints: number;
  favoriteClub: string;
  isCurrentUser?: boolean;
}
