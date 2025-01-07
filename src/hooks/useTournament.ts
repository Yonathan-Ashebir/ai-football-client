import { useState, useCallback } from 'react';
import type { MatchPrediction, TournamentTeam } from '../types/tournament';

interface MatchResult {
  homeGoals: number;
  awayGoals: number;
}

export function useTournament() {
  const [matches, setMatches] = useState<MatchPrediction[]>([]);
  const [currentRound, setCurrentRound] = useState<'quarterfinal' | 'semifinal' | 'final'>('quarterfinal');
  const [winner, setWinner] = useState<TournamentTeam | null>(null);
  const [matchResults, setMatchResults] = useState<Record<string, MatchResult>>({});
  const [progress, setProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const resetTournament = useCallback(() => {
    setMatches([]);
    setWinner(null);
    setMatchResults({});
    setCurrentRound('quarterfinal');
    setProgress(0);
    setIsSimulating(false);
  }, []);

  const createQuarterFinals = useCallback((teams: TournamentTeam[]) => {
    const quarterFinals: MatchPrediction[] = [];
    for (let i = 0; i < teams.length; i += 2) {
      quarterFinals.push({
        id: `qf-${i/2}`,
        round: 'quarterfinal',
        homeTeam: teams[i],
        awayTeam: teams[i + 1],
      });
    }
    setMatches(quarterFinals);
  }, []);

  const simulateMatch = async (match: MatchPrediction): Promise<MatchResult> => {
    setIsSimulating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random goals based on team stats
      const homeTeamStrength = match.homeTeam.stats.winProbability;
      const awayTeamStrength = match.awayTeam.stats.winProbability;
      
      // Calculate goals using team strengths to influence probabilities
      const homeGoals = Math.floor(Math.random() * 4 + homeTeamStrength * 2);
      const awayGoals = Math.floor(Math.random() * 4 + awayTeamStrength * 2);
      
      // Ensure no draws in knockout stages
      if (homeGoals === awayGoals) {
        return homeTeamStrength > awayTeamStrength
          ? { homeGoals: homeGoals + 1, awayGoals }
          : { homeGoals, awayGoals: awayGoals + 1 };
      }
      
      return { homeGoals, awayGoals };
    } finally {
      setIsSimulating(false);
    }
  };

  const proceedToNextRound = async () => {
    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const winners = currentRoundMatches.map(match => {
      const result = matchResults[match.id];
      return result.homeGoals > result.awayGoals ? match.homeTeam : match.awayTeam;
    });

    // Add 3-second delay before proceeding
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (currentRound === 'quarterfinal') {
      const semiFinals = createNextRound(winners, 'semifinal');
      setCurrentRound('semifinal');
      setProgress(33);
      setMatches(prev => [...prev, ...semiFinals]);
    } else if (currentRound === 'semifinal') {
      const final = createNextRound(winners, 'final');
      setCurrentRound('final');
      setProgress(66);
      setMatches(prev => [...prev, ...final]);
    } else if (currentRound === 'final') {
      setWinner(winners[0]);
      setProgress(100);
    }
  };

  const createNextRound = (winners: TournamentTeam[], round: 'semifinal' | 'final'): MatchPrediction[] => {
    if (round === 'semifinal') {
      return winners.reduce<MatchPrediction[]>((acc, winner, i, arr) => {
        if (i % 2 === 0) {
          acc.push({
            id: `sf-${i/2}`,
            round: 'semifinal',
            homeTeam: winner,
            awayTeam: arr[i + 1],
          });
        }
        return acc;
      }, []);
    }

    return [{
      id: 'final',
      round: 'final',
      homeTeam: winners[0],
      awayTeam: winners[1],
    }];
  };

  return {
    matches,
    winner,
    currentRound,
    progress,
    matchResults,
    isSimulating,
    createQuarterFinals,
    simulateMatch,
    proceedToNextRound,
    resetTournament,
  };
}