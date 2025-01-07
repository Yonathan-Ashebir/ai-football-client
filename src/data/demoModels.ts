import type { Model } from '../types/model';

export const demoModels: Model[] = [
  {
    id: 'model-001',
    name: 'Premier League Predictor v1',
    type: 'team-prediction',
    status: 'completed',
    columns: [
      'Home Team',
      'Away Team',
      'Home Form',
      'Away Form',
      'Head to Head',
      'Goals Scored',
      'Goals Conceded'
    ],
    datasetName: 'Match Results 2023/24 Season',
    createdAt: '2024-03-15T10:30:00Z',
    completedAt: '2024-03-15T11:45:00Z',
    trainingDuration: 4500,
    accuracy: 0.86,
    trainingHistory: Array.from({ length: 10 }, (_, i) => ({
      epoch: i,
      accuracy: 0.70 + (i * 0.02),
      loss: 0.40 - (i * 0.03)
    }))
  },
  {
    id: 'model-002',
    name: 'Player Position Analyzer',
    type: 'player-position',
    status: 'training',
    columns: [
      'Pass Completion %',
      'Tackles',
      'Interceptions',
      'Goals',
      'Assists',
      'Distance Covered'
    ],
    datasetName: 'Premier League Player Stats 2024',
    createdAt: '2024-03-16T09:15:00Z',
    trainingDuration: 1800,
    accuracy: 0.65,
    trainingHistory: Array.from({ length: 5 }, (_, i) => ({
      epoch: i,
      accuracy: 0.55 + (i * 0.02),
      loss: 0.50 - (i * 0.02)
    }))
  },
  {
    id: 'model-003',
    name: 'Team Performance Predictor',
    type: 'team-prediction',
    status: 'failed',
    columns: [
      'Previous Results',
      'Player Injuries',
      'Team Formation',
      'Weather Conditions'
    ],
    datasetName: 'Team Performance Analytics 2024',
    createdAt: '2024-03-14T16:20:00Z',
    completedAt: '2024-03-14T16:25:00Z',
    trainingDuration: 300
  },
  {
    id: 'model-004',
    name: 'Position Recommendation Engine',
    type: 'player-position',
    status: 'completed',
    columns: [
      'Sprint Speed',
      'Stamina',
      'Ball Control',
      'Shooting Accuracy',
      'Defensive Awareness'
    ],
    datasetName: 'Premier League Player Stats 2024',
    createdAt: '2024-03-13T14:00:00Z',
    completedAt: '2024-03-13T15:30:00Z',
    trainingDuration: 5400,
    accuracy: 0.92,
    trainingHistory: Array.from({ length: 15 }, (_, i) => ({
      epoch: i,
      accuracy: 0.75 + (i * 0.012),
      loss: 0.35 - (i * 0.015)
    }))
  },
  {
    id: 'model-005',
    name: 'Match Outcome Predictor',
    type: 'team-prediction',
    status: 'training',
    columns: [
      'Recent Form',
      'Home/Away Advantage',
      'Team Rankings',
      'Historical Matchups'
    ],
    datasetName: 'Match Results 2023/24 Season',
    createdAt: '2024-03-16T11:00:00Z',
    trainingDuration: 900,
    accuracy: 0.78,
    trainingHistory: Array.from({ length: 8 }, (_, i) => ({
      epoch: i,
      accuracy: 0.65 + (i * 0.018),
      loss: 0.45 - (i * 0.02)
    }))
  }
];