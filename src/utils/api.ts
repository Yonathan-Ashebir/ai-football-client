import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Datasets
export const datasetsApi = {
  list: () => api.get('/datasets/list'),

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
    }),

  upload: (file: File, newName: string, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('new_name', newName);
    formData.append('type', type);
    return api.post('/datasets/upload_one', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  },

  delete: (id: string) => api.post(`/datasets/delete/${id}`),

  download: (id: string) => api.get(`/datasets/download/${id}`, {responseType: 'blob'}),

  getDownloadLink: (id: string) => `${API_BASE_URL}datasets/download/${id}`,
};

// Models
export const modelsApi = {
  create: (data: {
    datasetId: string;
    modelType: 'team-prediction' | 'player-position';
    parameters?: Record<string, any>;
  }) => api.post('/models/create_one', data),
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