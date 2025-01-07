export type ModelType = 'team-prediction' | 'player-position';

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  status: 'training' | 'completed' | 'failed';
  columns: string[];
  datasetName: string;
  createdAt: string;
  completedAt?: string;
  trainingDuration?: number;
  accuracy?: number;
  trainingHistory?: Array<{
    epoch: number;
    accuracy: number;
    loss: number;
  }>;
}