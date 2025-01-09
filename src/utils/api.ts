import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type DatasetType = 'Match Results' | 'Player Statistics'
export const datasetTypeMap  = {'Player Statistics': 'player_statistics', 'Match Results': 'match'}

// Datasets
export const datasetsApi = {
  list: (datasetTypes:string[] = []) => api.get('/datasets/list', {
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
            }) =>
    api.get(`/datasets/preview/${id}`, {
      params: {
        start_row,
        end_row,
        columns: columns.join(','),
        sort_columns: sort_columns.join(','),
        sort_orders: sort_orders.join(',')
      }
    }).then(resp => resp.data),

  upload: async (file: File, newName: string, type: DatasetType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('new_name', newName);
    formData.append('type', datasetTypeMap[type]);
    let resp = await api.post('/datasets/upload_one', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return await resp.data;
  },

  delete: (id: string) => api.post(`/datasets/delete/${id}`).then(resp => resp.data),

  download: (id: string) => api.get(`/datasets/download/${id}`, {responseType: 'blob'}).then(resp => resp.data),

  getDownloadLink: (id: string) => `${API_BASE_URL}datasets/download/${id}`,
};

// Models
export const modelsApi = {
  create: (data: {
    datasetId: string;
    modelType: 'match-prediction' | 'player-position';
    parameters?: Record<string, any>;
  }) => api.post('/models/create_one', data),

  /**
   * Fetch the list of models for the current user.
   * @returns {Promise} Resolves with the list of models.
   */
  async list(): Promise<any> {
    let response = await api.get('/models/list');
    return (await response.data)['models'];
  },

  /**
   * Delete a specific model by ID.
   * @param {number} modelId - The ID of the model to delete.
   * @returns {Promise} Resolves with a success message.
   */

  async delete(modelId: string) {
    let response = await api.delete(`/models/delete/${modelId}`);
    return await response.data;
  },

  getModelTeams: async (modelId: string) => {
    const response = await api.get(`/models/get_model_teams/${modelId}`);
    return response.data.teams; // Assuming API response has a "teams" field
  },
};

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


export default api;