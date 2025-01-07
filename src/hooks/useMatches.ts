import { useState, useEffect } from 'react';
import { footballDataApi } from '../services/footballDataApi';
import type { Match } from '../types/matches';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictingMatchId, setPredictingMatchId] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await footballDataApi.getUpcomingMatches();
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        homeWin: Math.random(),
        draw: Math.random() * 0.3,
        awayWin: Math.random()
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