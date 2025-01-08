import {useEffect, useState} from 'react';
import {datasetsApi} from "../utils/api.ts";
import {useResource} from "./useResource.ts";
import {Dataset} from "../types/dataset.ts";

export function useDatasets() {
  const [{data: datasets}, reload] = useResource(datasetsApi.list,[],{default: {data:[]}, updateInterval: 5000})
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

  const uploadDataset = async (file: File, name: string, type: string): Dataset => {
    try {
      const newDataset = (await datasetsApi.upload(file, name, type)).data['new_dataset']
      fetchDatasets().then()
      return newDataset;
    } catch (err) {
      throw new Error('Failed to upload dataset');
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      await datasetsApi.delete(id);
      fetchDatasets().then()
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