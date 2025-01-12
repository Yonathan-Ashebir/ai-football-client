import {useState} from 'react';
import {knockoutsApi} from "../utils/api.ts";
import {Model, ModelType} from "../types/model.ts";

interface PredictionResult {
  homeTeamProbability: number,
  drawProbability: number
  awayTeamProbability: number,
}

interface PredictionParams {
  homeTeam: string;
  awayTeam: string;
  matchHistory: number;
  models: { [K in ModelType]? : Model['id'] };
}

// Add to existing types
export interface TeamMetrics {
  bothTeamsScoring: number;
  homeXG: number;
  awayXG: number;
}

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);

  const getPrediction = async (params: PredictionParams) => {
    setLoading(true);
    setError(null);

    try {
      const firstPrediction = (await knockoutsApi.getPairwiseStatistics({
        teams: [params.homeTeam, params.awayTeam],
        no_draw: false,
        previous_matches_count: params.matchHistory,
        models: params.models
      }))[0]

      setResult({
        homeTeamProbability: firstPrediction.winning_probabilities![0],
        drawProbability: firstPrediction!.winning_probabilities![1],
        awayTeamProbability: firstPrediction!.winning_probabilities![2]!
      });

      setMetrics({
        bothTeamsScoring: firstPrediction.both_teams_to_score_probability!,
        homeXG: firstPrediction.expected_goals![0],
        awayXG: firstPrediction.expected_goals![1],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
      setResult(null);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    metrics,
    getPrediction
  };
}