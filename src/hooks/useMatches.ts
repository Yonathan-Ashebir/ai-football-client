import {useEffect, useRef, useState} from 'react';
import {DEFAULT_UPCOMING_MATCH_DAYS_END, Match} from '../types/matches';
import {FuzzyPairwiseStatisticsPayload, knockoutsApi} from "../utils/api.ts";
import {ModelTypes} from "../types/model.ts";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictingMatchId, setPredictingMatchId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => new Date(startDate!.getFullYear(), startDate!.getMonth(), startDate!.getDate() + DEFAULT_UPCOMING_MATCH_DAYS_END));
  const latestRequest = useRef<Promise<Match[]> | null>(null);

  const fetchMatches = async () => {
    if (!startDate && !endDate) return
    setLoading(true);
    setError(null);

    const request = knockoutsApi.getUpcomingMatches({
      dateFrom: startDate ?? undefined,
      dateTo: endDate ?? undefined,
    });
    latestRequest.current = request;
    let req: Promise<Match[]> | null = null;
    do {
      try {
        req = latestRequest.current
        const data = await req
        if (req === request) setMatches(data)
      } catch {
        if (req === request) setError('Failed to fetch upcoming matches. Please try again later.');
      } finally {
        if (req === request)
          setLoading(false);
      }
    } while (latestRequest.current !== req);
  };


  interface PredictionResult {
    homeWin: number;
    draw: number;
    awayWin: number;
  }


  const predictMatch = async (match: Match): Promise<PredictionResult> => {
    setPredictingMatchId(match.id);
    try {
      // Prepare the payload for the fuzzy pairwise statistics API
      const payload: FuzzyPairwiseStatisticsPayload = {
        teams: [match.homeTeam.name, match.awayTeam.name], // Use the home and away team names
        previous_matches_count: 2, // Optional: Number of previous matches to consider
        no_draw: false, // Include draw probabilities
        required_prediction_types: [ModelTypes.MATCH_WINNER_WITH_SCALER]
      };

      // Call the fuzzy pairwise statistics API
      const results = await knockoutsApi.getFuzzyPairwiseStatistics(payload);

      // Extract the prediction for the specific match
      const prediction = results.find(
        (result) =>
          result.team1 === match.homeTeam.name && result.team2 === match.awayTeam.name
      );

      if (!prediction || !prediction.winning_probabilities) {
        throw new Error("No prediction found for the match.");
      }

      // Return the prediction result
      return {
        homeWin: prediction.winning_probabilities[0],
        draw: prediction.winning_probabilities[1],
        awayWin: prediction.winning_probabilities[2],
      };
    } catch (error) {
      console.error("Error predicting match:", error);
      throw error; // Re-throw the error for further handling
    } finally {
      setPredictingMatchId(null); // Reset the predicting match ID
    }
  };

  useEffect(() => {
    fetchMatches().then();
  }, [startDate, endDate]);

  return {
    matches,
    loading,
    error,
    predictMatch,
    predictingMatchId,
    refreshMatches: fetchMatches,
    startDate,
    endDate,
    setStartDate, setEndDate
  };
}