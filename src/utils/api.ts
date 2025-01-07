import axios from 'axios';

const API_BASE_URL = 'https://postman-rest-api-learner.glitch.me';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Datasets
export const datasetsApi = {
  list: () => api.get('/datasets/list'),
  
  preview: (id: string, params: { start_row: number; end_row: number; columns: string }) =>
    api.get(`/datasets/preview/${id}`, { params }),
  
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/datasets/upload_one', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  delete: (id: string) => api.post(`/datasets/delete/${id}`),
  
  download: (id: string) => api.get(`/datasets/download/${id}`, { responseType: 'blob' }),
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