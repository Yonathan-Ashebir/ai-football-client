import type { HistoricalMatch, HeadToHeadStats } from '../types';

export function calculateHeadToHeadStats(
  matches: HistoricalMatch[],
  homeTeam: string,
  awayTeam: string
): HeadToHeadStats {
  const stats: HeadToHeadStats = {
    totalMatches: 0,
    homeTeamWins: 0,
    awayTeamWins: 0,
    draws: 0,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
  };

  matches.forEach(match => {
    const isHomeTeamHome = match.homeTeam === homeTeam;
    const isAwayTeamAway = match.awayTeam === awayTeam;
    
    if ((isHomeTeamHome && isAwayTeamAway) || 
        (match.homeTeam === awayTeam && match.awayTeam === homeTeam)) {
      stats.totalMatches++;
      
      const homeScore = isHomeTeamHome ? match.homeScore : match.awayScore;
      const awayScore = isHomeTeamHome ? match.awayScore : match.homeScore;
      
      stats.homeTeamGoals += homeScore;
      stats.awayTeamGoals += awayScore;
      
      if (homeScore > awayScore) {
        stats.homeTeamWins++;
      } else if (awayScore > homeScore) {
        stats.awayTeamWins++;
      } else {
        stats.draws++;
      }
    }
  });

  return stats;
}