export interface Match {
  id: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  utcDate: string;
  status: string;
  matchday: number;
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  venue?: string;
}

export const MAXIMUM_UPCOMING_MATCH_DAYS = 300
export const DEFAULT_UPCOMING_MATCH_DAYS_END = 7
