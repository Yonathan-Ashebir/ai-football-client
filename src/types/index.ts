import {TournamentTeam} from "./tournament.ts";
import {ModelType, ModelTypes} from "./model.ts";
import {DatasetTypes} from "./dataset.ts";

export interface Feature {
  id: string;
  name: string;
  optional: boolean;
  default?: number;
  minimum?: number;
  maximum?: number;
  prefix?: string;
  suffix?: string;
  isInteger?: boolean;
  score?: number;
}

export interface PlayerPositionPrediction {
  GK: number,
  DF: number,
  FW: number,
  MF: number
}

export const positions: Record<keyof PlayerPositionPrediction, string> = {
  FW: 'Striker',
  MF: 'Midfielder',
  DF: 'Defender',
  GK: 'Goad keeper'
};

export interface PairwiseStatistic {
  team1: TournamentTeam['id']
  team2: TournamentTeam['id'],
  winning_probabilities?: [number, number] | [number, number, number],
  expected_goals?: [number, number],
  both_teams_to_score_probability?: number
}

type MessageRole = 'user' | 'assistant';

export type Message = {
  role: MessageRole;
  content: string;
  error?: string;
}

export interface Layer {
  size: number;
  activation: 'ReLU' | 'Sigmoid' | 'Tanh' | 'Linear';
}

export interface TrainingConfig extends Record<string, unknown> {
  modelType: ModelType;
  datasets: string[];
  columns: string[];
  name: string;
}

export type TrainingType = 'match-prediction' | 'player-position'
export const MathPredictionAlgorismTypes = {ANN: "ANN", RANDOM_FOREST: "Random Forest", XG_BOOST: "XgBoost"} as const
export type MathPredictionAlgorismType = typeof MathPredictionAlgorismTypes[keyof typeof MathPredictionAlgorismTypes]
export const PlayerPositionAlgorismTypes = {ANN: "ANN", RANDOM_FOREST: "Random Forest"} as const
export type PlayerPositionAlgorismType = typeof PlayerPositionAlgorismTypes[keyof typeof PlayerPositionAlgorismTypes]
export const getCorrespondingModelTypes = (t: 'match-prediction' | 'player-position'): ModelType[] => {
  switch (t) {
    case 'match-prediction':
      return [ModelTypes.MATCH_WINNER_WITH_SCALER, ModelTypes.NUMBER_OF_GOALS_WITH_SCALER, ModelTypes.BOTH_TEAMS_TO_SCORE_WITH_SCALER]
    case 'player-position':
      return ['player_statistics_with_scaler']
    default:
      throw new Error(`Unknown training type ${t}`);
  }
}
export const getDatasetTypesForModelType = (modelType: string): string[] => {
  switch (modelType) {
    case 'match-prediction':
      return [DatasetTypes.MATCHES]
    default:
      return [DatasetTypes.PLAYER_STATS]
  }
}