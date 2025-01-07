import { useState, useEffect } from 'react';
import { demoDatasets } from '../data/demoDatasets';
import type { Dataset } from '../types';

export function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDatasets(demoDatasets);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDataset = async (file: File, name: string) => {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDataset: Dataset = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        size: file.size,
        type: 'Custom Dataset',
        columns: [],
        uploadDate: new Date().toISOString()
      };
      setDatasets(prev => [newDataset, ...prev]);
      return { data: newDataset };
    } catch (err) {
      throw new Error('Failed to upload dataset');
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      // Simulate deletion delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setDatasets(prev => prev.filter(dataset => dataset.id !== id));
    } catch (err) {
      throw new Error('Failed to delete dataset');
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return {
    datasets,
    loading,
    error,
    uploadDataset,
    deleteDataset,
    refreshDatasets: fetchDatasets,
  };
}