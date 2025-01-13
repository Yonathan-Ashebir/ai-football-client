import {useEffect, useState} from 'react';
import {footballDataApi} from '../services/footballDataApi';
import type {Match} from '../types/matches';
import {knockoutsApi, modelsApi} from "../utils/api.ts";
import stringSimilarity from "string-similarity"
import {Model} from "../types/model.ts";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictingMatchId, setPredictingMatchId] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await footballDataApi.getPremierLeagueMatches();
      if (data.matches.length === 0) {
        setError('No upcoming matches found. Please try again later.');
      } else {
        setMatches(data.matches);
      }
    } catch (err) {
      setError('Failed to fetch upcoming matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const predictMatch = async (match: Match) => {
    setPredictingMatchId(match.id);
    try {
      // Mock prediction for demo - replace with actual ML model call
      const models = await modelsApi.list(['match_winner_with_scaler'])
      if (models.length === 0) { // TODO: may be add a model selection option for the user, filtering/auto filtered by leagues ..., make it a server side thing (aliasing per model, per user, or globally ...)?
        throw "No match prediction models found"
      }

      const requiredTeamNames = [match.homeTeam.name, match.awayTeam.name]
      let highestSimilarityScore = 0
      let bestMatchModel: Model | null = null
      let bestMatchingTeams: string[] | null = null
      for (const model of models) {
        const modelTeams = (await modelsApi.getModelTeams(model.id)).map(t => t.name); // Get teams for the current model

        // Calculate total similarity score between model teams and required team names
        let totalSimilarityScore = 0;
        const matchingTeams: string[] = [];

        for (const requiredTeam of requiredTeamNames) {
          const {bestMatch, bestMatchIndex} = stringSimilarity.findBestMatch(
            requiredTeam,
            modelTeams
          );

          if (bestMatch.rating > 0.5) { // Only consider matches with a similarity rating above a threshold
            totalSimilarityScore += bestMatch.rating;
            matchingTeams.push(modelTeams[bestMatchIndex]);
          }
        }

        // Update the best match if this model has a higher total similarity score
        if (totalSimilarityScore > highestSimilarityScore) {
          highestSimilarityScore = totalSimilarityScore;
          bestMatchModel = model;
          bestMatchingTeams = matchingTeams;
        }
      }

      if (!bestMatchModel || !bestMatchingTeams) {
        throw `No models found for these teams`;
      }

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
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    predictMatch,
    predictingMatchId,
    refreshMatches: fetchMatches,
  };
}