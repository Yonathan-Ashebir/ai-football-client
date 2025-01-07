import React, { useState, useEffect } from 'react';
import ModelTraining from '../components/models/ModelTraining';
import ModelsList from '../components/models/ModelsList';
import ModelsHeader from '../components/models/ModelsHeader';
import { demoDatasets } from '../data/demoDatasets';
import { demoModels } from '../data/demoModels';
import type { Model } from '../types/model';

export default function Models() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const loadModels = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setModels(demoModels);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadModels();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleDelete = (id: string) => {
    setModels(current => current.filter(model => model.id !== id));
  };

  const handleRename = (id: string, newName: string) => {
    setModels(current => 
      current.map(model => 
        model.id === id ? { ...model, name: newName } : model
      )
    );
  };

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
            datasets={demoDatasets}
            onTrain={() => {}}
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
            models={models}
            onDelete={handleDelete}
            onRename={handleRename}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}