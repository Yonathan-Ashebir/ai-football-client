import React from 'react';
import { Brain, Trash2, Clock, Database, LineChart } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { truncateText } from '../../utils/stringUtils';
import ModelStatus from './ModelStatus';
import type { Model } from '../../types/model';

interface Props {
  model: Model;
  onDelete: (id: string) => void;
}

export default function ModelCard({ model, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
          </div>
          <ModelStatus status={model.status} />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Database className="w-4 h-4 mr-2" />
            {model.datasetName}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {formatDistanceToNow(model.createdAt)}
          </div>
          {model.accuracy !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <LineChart className="w-4 h-4 mr-2" />
              Accuracy: {(model.accuracy * 100).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Training Columns</h4>
          <div className="flex flex-wrap gap-1">
            {model.columns.map((column) => (
              <span
                key={column}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700"
                title={column}
              >
                {truncateText(column, 15)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-primary-600">
          {model.type === 'team-prediction' ? 'Team Prediction' : 'Player Position'}
        </span>
        <button
          onClick={() => onDelete(model.id)}
          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {model.status === 'training' && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary-100/20 to-transparent" />
      )}
    </div>
  );
}