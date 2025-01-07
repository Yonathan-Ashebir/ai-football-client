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

export interface MatchesResponse {
  matches: Match[];
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  resultSet: {
    count: number;
    first: string;
    last: string;
    played: number;
  };
}