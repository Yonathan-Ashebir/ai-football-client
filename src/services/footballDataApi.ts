import type { AxiosError } from 'axios';
import type { MatchesResponse } from '../types/matches';
import { createApiClient } from '../utils/apiClient';

const API_KEY = '0f3a523302814201bb92776918293cfd';
const BASE_URL = 'https://api.football-data.org/v4';

const api = createApiClient(BASE_URL, {
  'X-Auth-Token': API_KEY,
});

// Demo data to avoid API rate limits
const demoMatches: MatchesResponse = {
  matches: [
    {
      id: "1",
      homeTeam: {
        id: 1,
        name: "Arsenal",
        shortName: "ARS",
        crest: "https://resources.premierleague.com/premierleague/badges/t3.svg"
      },
      awayTeam: {
        id: 2,
        name: "Liverpool",
        shortName: "LIV",
        crest: "https://resources.premierleague.com/premierleague/badges/t14.svg"
      },
      utcDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "SCHEDULED",
      matchday: 24,
      competition: {
        id: 2021,
        name: "Premier League",
        emblem: "https://resources.premierleague.com/premierleague/badges/PL.svg"
      }
    },
    {
      id: "2",
      homeTeam: {
        id: 3,
        name: "Manchester City",
        shortName: "MCI",
        crest: "https://resources.premierleague.com/premierleague/badges/t43.svg"
      },
      awayTeam: {
        id: 4,
        name: "Chelsea",
        shortName: "CHE",
        crest: "https://resources.premierleague.com/premierleague/badges/t8.svg"
      },
      utcDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "SCHEDULED",
      matchday: 24,
      competition: {
        id: 2021,
        name: "Premier League",
        emblem: "https://resources.premierleague.com/premierleague/badges/PL.svg"
      }
    }
  ],
  competition: {
    id: 2021,
    name: 'Premier League',
    code: 'PL',
    emblem: 'https://resources.premierleague.com/premierleague/badges/PL.svg'
  },
  resultSet: {
    count: 2,
    first: new Date().toISOString(),
    last: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    played: 0
  }
};

export const footballDataApi = {
  getUpcomingMatches: async (): Promise<MatchesResponse> => {
    try {
      // Return demo data instead of making API call
      return demoMatches;
    } catch (error) {
      console.error('Football API Error:', error);
      return demoMatches; // Fallback to demo data on error
    }
  }
};