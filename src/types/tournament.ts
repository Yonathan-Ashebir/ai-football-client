export interface TournamentTeam {
  id: string;
  name: string;
  logoUrl?: string;
  stats?: {
    winProbability: number;
    goalsScored: number;
  };
}

export interface MatchPrediction {
  id: string;
  round: 'quarterfinal' | 'semifinal' | 'final';
  homeTeam: TournamentTeam;
  awayTeam: TournamentTeam;
  message?: string;
  winner?: string;
}

export interface UserPredictionScore {
  userId: string;
  username: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
}

export const getPreviousRounds = (round: string) => {
  const rounds = ['quarterfinal', 'semifinal', 'final', 'results']
  return rounds.slice(0, rounds.indexOf(round))
}