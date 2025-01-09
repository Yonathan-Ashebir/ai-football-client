import {useEffect, useState} from 'react';
import {datasetsApi, DatasetType} from "../utils/api.ts";
import {useResource} from "./useResource.ts";
import {Dataset} from "../types/dataset.ts";

export function useDatasets() {
  const {resource: datasets, reload, quickUpdate} = useResource<Array<Dataset>>(datasetsApi.list,[],{initialValue: [], updateInterval: 5000})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      await reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDataset = async (file: File, name: string, type: DatasetType) => {
    try {
      const newDataset = (await datasetsApi.upload(file, name, type))['new_dataset']
      quickUpdate([...(datasets || []),newDataset])
    } catch (err) {
      throw new Error('Failed to upload dataset');
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      await datasetsApi.delete(id);
      quickUpdate(datasets!.filter(item => item.id !== id))
    } catch (err) {
      throw new Error('Failed to delete dataset');
    }
  };

  useEffect(() => {
    fetchDatasets().then();
  }, []);

  return {
    datasets,
    loading: loading,
    error,
    uploadDataset,
    deleteDataset,
    refreshDatasets: fetchDatasets,
  };
}