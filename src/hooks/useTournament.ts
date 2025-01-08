import {useState, useCallback} from 'react';
import type {MatchPrediction, TournamentTeam} from '../types/tournament';

export function useTournament() {
  const [matches, setMatches] = useState<MatchPrediction[]>([]);
  const [currentRound, setCurrentRound] = useState<'quarterfinal' | 'semifinal' | 'final'| 'results'>('quarterfinal');
  const [winner, setWinner] = useState<TournamentTeam | null>(null);
  const [progress, setProgress] = useState(0);
  const [favouriteTeam, setFavouriteTeam] =useState<string | null>(null);
  const [loosingMatch, setLoosingMatch] = useState<MatchPrediction | null>(null);

  const resetTournament = useCallback(() => {
    setMatches([]);
    setWinner(null);
    setCurrentRound('quarterfinal');
    setProgress(0);
  }, []);

  const createQuarterFinals = useCallback((teams: TournamentTeam[]) => {
    const quarterFinals: MatchPrediction[] = [];
    for (let i = 0; i < teams.length; i += 2) {
      quarterFinals.push({
        id: `qf-${i / 2}`,
        round: 'quarterfinal',
        homeTeam: teams[i],
        awayTeam: teams[i + 1],
      });
    }
    setMatches(quarterFinals);
  }, []);

  const proceedToNextRound = async () => {
    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const favouriteTeamsMatch = currentRoundMatches.find(m => m.homeTeam.id === favouriteTeam || m.awayTeam.id === favouriteTeam)!;
    if (favouriteTeamsMatch.winner === favouriteTeam) {
      const winners = currentRoundMatches.map(m => m.winner == m.homeTeam.id ? m.homeTeam : m.awayTeam);
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
    } else {
      setLoosingMatch(favouriteTeamsMatch)
      setCurrentRound('results')
    }
  };

  const createNextRound = (winners: TournamentTeam[], round: 'semifinal' | 'final'): MatchPrediction[] => {
    if (round === 'semifinal') {
      //TODO: api call here
      return winners.reduce<MatchPrediction[]>((acc, winner, i, arr) => {
        if (i % 2 === 0) {
          acc.push({
            id: `sf-${i / 2}`,
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
    createQuarterFinals,
    proceedToNextRound,
    resetTournament,
    favoriteTeam: favouriteTeam,
    setFavoriteTeam: setFavouriteTeam,
    loosingMatch
  };
}