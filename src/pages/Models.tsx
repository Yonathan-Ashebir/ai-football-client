import ModelTraining from '../components/models/ModelTraining';
import ModelsList from '../components/models/ModelsList';
import ModelsHeader from '../components/models/ModelsHeader';
import type {Model} from '../types/model';
import {useResource} from "../hooks/useResource.ts";
import {modelsApi} from "../utils/api.ts";
import {useEffect, useState} from "react";

export default function Models() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    resource: models,
    error,
    reload,
    quickUpdate
  } = useResource<Model[]>(modelsApi.list, [], {updateInterval: 5000})

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await reload()
    } finally {
      setIsRefreshing(false)
    }
  };


  const handleDelete = async (id: string) => {
    await modelsApi.delete(id)
    quickUpdate(models!.filter(model => model.id !== id));
  };


  useEffect(() => {
    handleRefresh().then()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Models</h1>
        <p className="mt-2 text-gray-600">
          Train and manage AI models for team predictions and player analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <ModelTraining
            onTrain={() => {
            }}
          />
        </div>
        <div className="lg:col-span-2">
          <ModelsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
          <ModelsList
            models={models ?? []}
            error={error?.message}
            onDelete={handleDelete}
            isLoading={isRefreshing}
            searchQuery={searchQuery}
            onRetry={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}