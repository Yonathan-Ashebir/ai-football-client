import { useState } from 'react';
import { modelsApi } from '../utils/api';
import type { ModelType } from '../types';

export function useModels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createModel = async (datasetId: string, modelType: ModelType, parameters?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modelsApi.create({
        datasetId,
        modelType,
        parameters,
      });
      return response.data;
    } catch (err) {
      setError('Failed to create model');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createModel,
    loading,
    error,
  };
}