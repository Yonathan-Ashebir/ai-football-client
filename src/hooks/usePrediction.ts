import { useState } from 'react';
import type { PredictionResult, TeamMetrics, PredictionParams } from '../types';

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);

  const getPrediction = async (params: PredictionParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/knockouts/get_pairwise_statistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teams: [params.homeTeam, params.awayTeam],
          no_draw: false,
          previous_matches_count: params.matchHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const firstPrediction = data[0];

      setResult({
        homeTeamProbability: firstPrediction.winning_probabilities[0],
        drawProbability: firstPrediction.winning_probabilities[1],
        awayTeamProbability: firstPrediction.winning_probabilities[2]
      });

      setMetrics({
        bothTeamsScoring: firstPrediction.both_teams_to_score_probability,
        homeXG: firstPrediction.expected_goals[0],
        awayXG: firstPrediction.expected_goals[1],
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