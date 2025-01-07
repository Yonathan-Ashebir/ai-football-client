import axios from 'axios';
import type { Match, MatchesResponse } from '../types/matches';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export const matchesApi = {
  getUpcoming: async (): Promise<MatchesResponse> => {
    // In production, replace with actual API call
    const response = await axios.get(`${API_BASE_URL}/matches/upcoming`);
    return response.data;
  },

  predictMatch: async (matchId: string, homeTeam: string, awayTeam: string): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/predictions`, {
      matchId,
      homeTeam,
      awayTeam
    });
    return response.data;
  }
};