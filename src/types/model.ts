interface DatasetMini {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  type_label: string;
  status: string;
  columns: string[];
  datasets: DatasetMini[];
  created_at: string;
  finished_training_at?: string;
  information?: {
    accuracy?: string;
    accuracy_description?: string;
  }
  model_description?: string;
}

export type ModelType =
  "match_winner"
  | "match_winner_with_scaler"
  | "player_statistics_with_scaler"
  | "both_teams_to_score_with_scaler"
  | "number_of_goals_with_scaler";

export const ModelTypes : Record<string, ModelType>= {
  MATCH_WINNER: "match_winner",
  MATCH_WINNER_WITH_SCALER: "match_winner_with_scaler",
  PLAYER_STATISTICS_WITH_SCALER: "player_statistics_with_scaler",
  BOTH_TEAMS_TO_SCORE_WITH_SCALER: "both_teams_to_score_with_scaler",
  NUMBER_OF_GOALS_WITH_SCALER: "number_of_goals_with_scaler",
} as const


export class ModelStatus {
  static readonly TRAINING = "training";
  static readonly READY = "ready";
  static readonly ERROR = /error:/y;
}

