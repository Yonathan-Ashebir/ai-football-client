export interface TournamentTeam {
  id: string;
  name: string;
  logoUrl?: string;
  stats: {
    winProbability: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

export interface MatchPrediction {
  id: string;
  round: 'quarterfinal' | 'semifinal' | 'final';
  homeTeam: TournamentTeam;
  awayTeam: TournamentTeam;
  userPrediction?: string; // Team ID
  aiPrediction?: string; // Team ID
  winner?: string; // Team ID
}

export interface UserPredictionScore {
  userId: string;
  username: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
}