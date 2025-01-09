import type { TournamentTeam } from '../types/tournament';

export const teamsApi = {
  getTeams: async (): Promise<TournamentTeam[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return demo data
    return [
      {
        id: '1',
        name: 'Arsenal',
        logoUrl: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
        stats: {
          winProbability: 0.75,
          goalsScored: 45
        }
      },
      {
        id: '2',
        name: 'Manchester City',
        logoUrl: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
        stats: {
          winProbability: 0.82,
          goalsScored: 52
        }
      },
      {
        id: '3',
        name: 'Liverpool',
        logoUrl: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
        stats: {
          winProbability: 0.78,
          goalsScored: 48
        }
      },
      {
        id: '4',
        name: 'Chelsea',
        logoUrl: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
        stats: {
          winProbability: 0.71,
          goalsScored: 42
        }
      }
    ];
  }
};