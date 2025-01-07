import React from 'react';
import { Brain, Search, Loader2 } from 'lucide-react';
import type { Model } from '../../types/model';

interface Props {
  models: Model[];
  selectedModel: Model | null;
  onSelect: (model: Model) => void;
  isLoading: boolean;
  error: string | null;
}

export default function ModelSelector({ models, selectedModel, onSelect, isLoading, error }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    model.type === 'team-prediction' &&
    model.status === 'completed'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-2">
        {filteredModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={`w-full flex items-center p-4 rounded-lg border transition-all ${
              selectedModel?.id === model.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-500'
            }`}
          >
            <Brain className="w-5 h-5 text-primary-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">{model.name}</p>
              <p className="text-sm text-gray-500">
                Accuracy: {(model.accuracy! * 100).toFixed(1)}%
              </p>
            </div>
          </button>
        ))}

        {filteredModels.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No matching models found
          </div>
        )}
      </div>
    </div>
  );
}