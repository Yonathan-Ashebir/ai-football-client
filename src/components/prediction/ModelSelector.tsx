import React from 'react';
import { Brain, Search, Loader2 } from 'lucide-react';
import {Model, ModelStatus} from '../../types/model';

interface Props {
  models: Model[];
  selectedModel: Model | undefined;
  onSelect: (model: Model) => void;
}

export default function ModelSelector({ models, selectedModel, onSelect}: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    model.status === ModelStatus.READY
  );

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
            type="button"
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