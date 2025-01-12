import {TournamentTeam} from "./tournament.ts";

export interface Feature {
  id: string;
  name: string;
  optional: boolean;
  minimum?: number;
  maximum?: number;
  prefix?: string;
  suffix?: string;
}

export interface PlayerPositionPrediction {
  GK: number,
  BF: number,
  FW: number,
  MF: number
}


export interface PairwiseStatistic {
  team1: TournamentTeam['id']
  team2: TournamentTeam['id'],
  winning_probabilities?: [number, number] | [number, number, number],
  expected_goals?: [number, number],
  both_teams_to_score_probability?: number
}
