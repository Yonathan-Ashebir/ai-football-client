import {useState, useCallback} from 'react';
import type {MatchPrediction, TournamentTeam} from '../types/tournament';
import {knockoutsApi} from "../utils/api.ts";
import {Model} from "../types/model.ts";

export function useTournament() {
  const [matches, setMatches] = useState<MatchPrediction[]>([]);
  const [currentRound, setCurrentRound] = useState<'quarterfinal' | 'semifinal' | 'final' | 'results'>('quarterfinal');
  const [winner, setWinner] = useState<TournamentTeam | null>(null);
  const [progress, setProgress] = useState(0);
  const [favouriteTeam, setFavouriteTeam] = useState<string | null>(null);
  const [loosingMatch, setLoosingMatch] = useState<MatchPrediction | null>(null);

  const resetTournament = useCallback(() => {
    setMatches([]);
    setWinner(null);
    setCurrentRound('quarterfinal');
    setFavouriteTeam(null);
    setLoosingMatch(null);
    setProgress(0);
  }, []);

  const createQuarterFinals = useCallback(async (teams: TournamentTeam[], model: Model, matchHistory: number) => {
    const probablites = await knockoutsApi.getPairwiseStatistics({
      teams: teams.map(t => t.id),
      no_draw: true,
      previous_matches_count: matchHistory,
      models: {
        [model.type]: model.id
      }
    })
    const quarterFinals: MatchPrediction[] = [];
    for (let i = 0; i < teams.length; i += 2) {
      const matchPrediction = probablites[Math.floor(i / 2)]
      quarterFinals.push({
        id: `qf-${i / 2}`,
        round: 'quarterfinal',
        homeTeam: {...teams[i], stats: {goalsScored: matchPrediction.expected_goals![0]}},
        awayTeam: {...teams[i + 1], stats: {goalsScored: matchPrediction.expected_goals![1]}},
        winner: matchPrediction.expected_goals![0] > matchPrediction.expected_goals![1] ? teams[i].id : teams[i + 1].id
      });
    }
    setMatches(quarterFinals);
  }, []);

  const proceedToNextRound = async (model: Model, matchHistory: number) => {
    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const favouriteTeamsMatch = currentRoundMatches.find(m => m.homeTeam.id === favouriteTeam || m.awayTeam.id === favouriteTeam)!;
    if (favouriteTeamsMatch.winner === favouriteTeam) {
      const winners = currentRoundMatches.map(m => m.winner == m.homeTeam.id ? m.homeTeam : m.awayTeam);
      if (currentRound === 'quarterfinal') {
        const semiFinals = await createNextRound(winners, currentRound, model, matchHistory);
        setCurrentRound('semifinal');
        setProgress(33);
        setMatches(prev => [...prev, ...semiFinals]);
      } else if (currentRound === 'semifinal') {
        const final = await createNextRound(winners, currentRound, model, matchHistory);
        setCurrentRound('final');
        setProgress(66);
        setMatches(prev => [...prev, ...final]);
      } else if (currentRound === 'final') {
        setWinner(winners[0]);
        setProgress(100);
        setCurrentRound('results')
      }
    } else {
      setLoosingMatch(favouriteTeamsMatch)
      setCurrentRound('results')
    }
  };

  const createNextRound = async (winners: TournamentTeam[], currentRound: 'semifinal' | 'quarterfinal', model: Model, matchHistory: number) => {

    const probablites = await knockoutsApi.getPairwiseStatistics({
      teams: winners.map(t => t.id),
      no_draw: true,
      previous_matches_count: matchHistory,
      models: {
        [model.type]: model.id
      }
    })

    return winners.reduce<MatchPrediction[]>((acc, winner, i, arr) => {
      if (i % 2 === 0) {
        const matchPrediction = probablites[Math.floor(i / 2)]
        acc.push({
          id: `sf-${i / 2}`,
          round: {
            quarterfinal: 'semifinal',
            semifinal: 'final'
          }[currentRound] as MatchPrediction['round'],
          homeTeam: {...winner, stats: {goalsScored: matchPrediction.expected_goals![0]}},
          awayTeam: {...arr[i + 1], stats: {goalsScored: matchPrediction.expected_goals![1]}},
          winner: matchPrediction.expected_goals![0] > matchPrediction.expected_goals![1] ? arr[i].id : arr[i + 1].id
        });
      }
      return acc;
    }, []);
  }


  return {
    matches,
    winner,
    currentRound,
    progress,
    createQuarterFinals,
    proceedToNextRound,
    resetTournament,
    favoriteTeam: favouriteTeam,
    setFavoriteTeam: setFavouriteTeam,
    loosingMatch
  };
}