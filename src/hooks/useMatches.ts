import {useEffect, useRef, useState} from 'react';
import {DEFAULT_UPCOMING_MATCH_DAYS_END, Match} from '../types/matches';
import {knockoutsApi, modelsApi} from "../utils/api.ts";
import {Model, ModelStatus} from "../types/model.ts";
import {matchString} from "../utils";

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
      } catch (err) {
        if (req === request) setError('Failed to fetch upcoming matches. Please try again later.');
      } finally {
        if (req === request)
          setLoading(false);
      }
    } while (latestRequest.current !== req);
  };

  const predictMatch = async (match: Match) => {
    setPredictingMatchId(match.id);
    try {
      // Mock prediction for demo - replace with actual ML model call
      const models = (await modelsApi.list(['match_winner_with_scaler'])).filter(m => m.status === ModelStatus.READY)

      if (models.length === 0) { // TODO: may be add a model selection option for the user, filtering/auto filtered by leagues ..., make it a server side thing (aliasing per model, per user, or globally ...)?
        throw new Error("No sufficient data to predict the match")
      }

      const requiredTeamNames = [[match.homeTeam.shortName, match.homeTeam.name], [match.awayTeam.shortName, match.awayTeam.name]]
      let bestSimilarityScore = Infinity
      let bestMatchModel: Model | null = null
      let bestMatchingTeams: string[] | null = null
      for (const model of models) {
        const modelTeams = (await modelsApi.getModelTeams(model.id)).map(t => [t.name, t.id]); // Get teams for the current model

        // Calculate total similarity score between model teams and required team names
        let totalSimilarityScore = 0;
        const matchingTeams: string[] = [];

        for (const requiredTeam of requiredTeamNames) {
          const match = matchString(requiredTeam, modelTeams, 0.4)!
          if (!match) continue;
            totalSimilarityScore += match.bestScore
            matchingTeams.push(match.matchedArray[0]);
        }

        // Update the best match if this model has a higher total similarity score
        if (totalSimilarityScore < bestSimilarityScore && matchingTeams.length === requiredTeamNames.length) {
          bestSimilarityScore = totalSimilarityScore;
          bestMatchModel = model;
          bestMatchingTeams = matchingTeams;
        }
      }

      if (!bestMatchModel || !bestMatchingTeams) {
        throw new Error(`No models found for these teams`);
      }

      console.log(`Predicting for ${bestMatchingTeams[0]} vs ${bestMatchingTeams[1]}`);

      const prediciton = (await knockoutsApi.getPairwiseStatistics({
        teams: bestMatchingTeams,
        no_draw: false,
        previous_matches_count: 2,
        models: {[bestMatchModel.type]: bestMatchModel.id}
      }))[0] /* TODO: do not hard code*/

      return {
        homeWin: prediciton.winning_probabilities![0],
        draw: prediciton.winning_probabilities![1],
        awayWin: prediciton.winning_probabilities![2],
      };
    } finally {
      setPredictingMatchId(null);
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