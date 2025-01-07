// Add to existing types
export interface TeamMetrics {
  bothTeamsScoring: number;
  homeXG: number;
  awayXG: number;
}

export interface PredictionParams {
  homeTeam: string;
  awayTeam: string;
  matchHistory: number;
}