import { Brain, AlertCircle } from 'lucide-react';
import ModelCard from './ModelCard';
import ModelsListSkeleton from './ModelsListSkeleton';
import type { Model } from '../../types/model';

interface Props {
  models: Model[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
  error?: string | null;
  onRetry?: () => void;
}

export default function ModelsList({ models, onDelete, isLoading, searchQuery, error, onRetry }: Props) {
  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.datasets?.some(dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <ModelsListSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Models</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Brain className="mx-auto h-12 w-12 text-gray-400" />
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