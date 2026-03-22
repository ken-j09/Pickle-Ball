
export interface Team {
  id: string;
  name: string;
  players: string[];
  rank?: number; // Optional seed/rank
  color?: string; // Hex color code for team identity
}

export type TournamentType = 'single-elimination' | 'double-elimination' | 'round-robin' | 'single-round-robin';

export interface Match {
  id: string;
  round: number;
  leg?: 1 | 2; // For Round Robin
  position?: number; // For Brackets
  bracketType?: 'winners' | 'losers' | 'finals'; // For Double Elimination
  team1Id: string | null;
  team2Id: string | null;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  nextMatchId?: string | null; // For Brackets
  nextLoserMatchId?: string | null; // For Double Elimination
  isCompleted: boolean;
}

export interface StandingsEntry {
  teamId: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  differential: number;
}

export type ViewType = 'teams' | 'tournament' | 'standings' | 'ai-insights' | 'live-scoring' | 'rules' | 'live-audience';
