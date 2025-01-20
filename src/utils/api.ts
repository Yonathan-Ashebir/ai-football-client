import axios from 'axios';
import {Model, ModelType} from "../types/model.ts";
import {Feature, Message, PairwiseStatistic, PlayerPositionPrediction} from "../types";
import {TournamentTeam} from "../types/tournament.ts";
import {Dataset} from "../types/dataset.ts";
import {DEFAULT_UPCOMING_MATCH_DAYS_END, Match} from "../types/matches.ts";
import {formatDateToYYYYMMDD, getFromDate} from "./dateUtils.ts";
import {createManagedPromise} from "./index.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

export type DatasetType = 'Match Results' | 'Player Statistics'
export const datasetTypeMap = {'Player Statistics': 'player_statistics', 'Match Results': 'match'}

export interface SuccessMessage {
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
            }): Promise<{ rows: string[][], total_count: number }> =>
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

  delete: (id: string): Promise<SuccessMessage> => api.post(`/datasets/delete/${id}`).then(resp => resp.data),

  download: (id: string) => api.get(`/datasets/download/${id}`, {responseType: 'blob'}).then(resp => resp.data),

  getDownloadLink: (id: string) => `${API_BASE_URL}datasets/download/${id}`,

  getViableInputColumns: (datasetIDs: string[], targetModelType: ModelType) => api.get('/datasets/get_viable_input_columns', {
    params: {
      datasets: datasetIDs.join(','),
      model_type: targetModelType,
    }
  }).then(resp => resp.data['columns'] as string[])
};

// Models
export const modelsApi = {
  create: ({modelType, ...rest}: {
    datasets: string[];
    modelType: ModelType;
    columns: string[];
    name: string;
    parameters?: Record<string, any>;
  }): Promise<Model> => api.post('/models/create_one', {model_type: modelType, ...rest}).then(resp => resp.data['model']),

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

  async delete(modelId: string): Promise<SuccessMessage> {
    let response = await api.delete(`/models/delete/${modelId}`);
    return await response.data;
  },

  getModelTeams: async (modelId: string): Promise<TournamentTeam[]> => {
    const response = await api.get(`/models/get_model_teams/${modelId}`);
    return response.data.teams;
  },
};
const transformMatchesData = (matches: any) => {
  return matches.map((match: any) => ({
    id: String(match.id), // Ensure ID is a string
    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      shortName: match.homeTeam.shortName,
      crest: match.homeTeam.crest,
    },
    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      shortName: match.awayTeam.shortName,
      crest: match.awayTeam.crest,
    },
    utcDate: new Date(match.utcDate).toISOString(), // Standardize date format
    status: match.status,
    matchday: match.matchday,
    competition: {
      id: match.competition.id,
      name: match.competition.name,
      emblem: match.competition.emblem,
    },
  }));
};


export const knockoutsApi = {
  getPairwiseStatistics: (payload: {
    teams: string[],
    no_draw?: boolean,
    previous_matches_count: number,
    models: { [K in ModelType]?: Model['id'] },
  }): Promise<PairwiseStatistic[]> => api.post("/knockouts/get_pairwise_statistics", payload).then(resp => resp.data),

  getUpcomingMatches: async ({dateFrom, dateTo}: {
    dateFrom?: Date,
    dateTo?: Date
  } = {}): Promise<Match[]> => {
    const today = new Date();
    dateFrom = dateFrom ?? today
    const response = await api.get("/knockouts/get_upcoming_matches", {
      params: {
        date_from: formatDateToYYYYMMDD(dateFrom),
        date_to: formatDateToYYYYMMDD(dateTo ?? getFromDate(dateFrom, DEFAULT_UPCOMING_MATCH_DAYS_END))
      }
    })
    return transformMatchesData(response['data'].matches)
  }
}
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

export const assistantApi = {
  streamChat: async (messages: Message[], onChunk: (chunk: string) => void, signal?: AbortSignal) => {
    const thread_id = await api.post('/assistant/threads/create', {messages}, {signal}).then(resp => resp.data['thread_id']);

    const result = createManagedPromise()
    const eventSource = new EventSource(`${API_BASE_URL}/assistant/threads/${thread_id}/stream`);

    eventSource.addEventListener('message', (event) => {
      const message = event.data.replace(/\\n/g, '\n');
      onChunk(message)
    });

    eventSource.addEventListener('end', () => {
      eventSource.close()
      result.resolve(null)
    })

    eventSource.onerror = function () {
      eventSource.close()
      result.reject("Error occurred");
    }

    return result.promise
  }
}

// Error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
    // You can implement a global error notification system here
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);