import {Brain} from 'lucide-react';
import ModelCard from './ModelCard';
import ModelsListSkeleton from './ModelsListSkeleton';
import type {Model} from '../../types/model';
import ErrorDisplay from "../common/ErrorDisplay.tsx";

interface Props {
  models: Model[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
  error?: string | null;
  onRetry?: () => void;
}

export default function ModelsList({models, onDelete, isLoading, searchQuery, error, onRetry}: Props) {
  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.datasets?.some(dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <ModelsListSkeleton/>;
  }

  if (error) {
    return (
      <ErrorDisplay header={'Error Loading Models'} message={error} onRetry={onRetry}/>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Brain className="mx-auto h-12 w-12 text-gray-400"/>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No models trained yet</h3>
        <p className="mt-1 text-sm text-gray-500">Train your first model to get started.</p>
      </div>
    );
  }

  if (filteredModels.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredModels.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}