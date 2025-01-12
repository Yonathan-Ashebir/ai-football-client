import axios from 'axios';
import {Model, ModelType} from "../types/model.ts";
import {Feature, PairwiseStatistic, PlayerPositionPrediction} from "../types";
import {TournamentTeam} from "../types/tournament.ts";
import {Dataset} from "../types/dataset.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type DatasetType = 'Match Results' | 'Player Statistics'
export const datasetTypeMap = {'Player Statistics': 'player_statistics', 'Match Results': 'match'}

export interface Message {
  message: string;
}

// Datasets
export const datasetsApi = {
  list: (datasetTypes: string[] = []): Promise<Dataset[]> => api.get('/datasets/list', {
    params: {'dataset_types': datasetTypes.join(',')}
  }).then(res => res.data),

  preview: (id: string,
            {
              startRow: start_row,
              endRow: end_row,
              columns,
              sortColumns: sort_columns,
              sortOrders: sort_orders
            }: {
              startRow: number;
              endRow: number;
              columns: string[];
              sortColumns: string[];
              sortOrders: string[];
            }):Promise<{rows: string[][], total_count: number}> =>
    api.get(`/datasets/preview/${id}`, {
      params: {
        start_row,
        end_row,
        columns: columns.join(','),
        sort_columns: sort_columns.join(','),
        sort_orders: sort_orders.join(',')
      }
    }).then(resp => resp.data),

  upload: async (file: File, newName: string, type: DatasetType): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('new_name', newName);
    formData.append('type', datasetTypeMap[type]);
    let resp = await api.post('/datasets/upload_one', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return await resp.data['new_dataset'];
  },

  delete: (id: string): Promise<Message> => api.post(`/datasets/delete/${id}`).then(resp => resp.data),

  download: (id: string) => api.get(`/datasets/download/${id}`, {responseType: 'blob'}).then(resp => resp.data),

  getDownloadLink: (id: string) => `${API_BASE_URL}datasets/download/${id}`,
};

// Models
export const modelsApi = {
  create: (data: {
    datasetId: string;
    modelType: 'match-prediction' | 'player-position';
    parameters?: Record<string, any>;
  }): Promise<Model> => api.post('/models/create_one', data),

  /**
   * Fetch the list of models for the current user.
   * @returns {Promise} Resolves with the list of models.
   */
  async list(modelTypes?: ModelType[]): Promise<Model[]> {
    let response = await api.get('/models/list', {
      params: {'model_types': modelTypes?.join(',')}
    });
    return (await response.data)['models'];
  },

  /**
   * Delete a specific model by ID.
   * @param {number} modelId - The ID of the model to delete.
   * @returns {Promise} Resolves with a success message.
   */

  async delete(modelId: string): Promise<Message> {
    let response = await api.delete(`/models/delete/${modelId}`);
    return await response.data;
  },

  getModelTeams: async (modelId: string): Promise<TournamentTeam[]> => {
    const response = await api.get(`/models/get_model_teams/${modelId}`);
    return response.data.teams;
  },
};

export const knockoutsApi = {
  getPairwiseStatistics: (payload: {
    teams: string[],
    no_draw: boolean,
    previous_matches_count: number,
    models: { [K in ModelType]?: Model['id'] },
  }): Promise<PairwiseStatistic[]> => api.post("/knockouts/get_pairwise_statistics", payload).then(resp => resp.data),
}

// Error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    // You can implement a global error notification system here
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export const playerStatisticsApi = {
  getPlayerBestPosition: (payload: {
    measurements: Record<string, number>,
    model_id: string
  }): Promise<PlayerPositionPrediction> => api.post("/player/get_player_best_position", payload).then(resp => resp.data),
  getAdjustableFeatures: (modelID: string): Promise<Feature[]> => api.get(`/player/get_adjustable_features_for_model`, {params: {model_id: modelID}}).then(resp => {
    return resp.data['adjustable_features']
  }),
  extractPlayerMeasurements: async (file: File): Promise<Record<Feature['id'], number>> => {
    const formData = new FormData();
    formData.append('file', file);
    let resp = await api.post('/player/extract_measurements', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return resp.data['measurements'];
  },
}

export default api;