import React, { useState } from 'react';
import { FileText, Trash2, AlertCircle, Download, Eye } from 'lucide-react';
import type { Dataset } from '../../types/dataset';
import DatasetPreview from './DatasetPreview';
import { formatFileSize } from '../../utils/formatters';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface Props {
  datasets: Dataset[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export default function DatasetList({ datasets, onDelete, isLoading, searchQuery }: Props) {
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-full" />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        ))}
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No datasets</h3>
        <p className="mt-1 text-sm text-gray-500">Upload your first dataset to get started.</p>
      </div>
    );
  }

  if (searchQuery && datasets.length === 0) {
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
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-medium text-gray-900">{dataset.name}</h3>
              </div>
              <span className="text-sm text-gray-500">{formatFileSize(dataset.size)}</span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">
                Type: <span className="font-medium">{dataset.type}</span>
              </div>
              <div className="text-sm text-gray-600">
                Uploaded {formatDistanceToNow(dataset.uploadDate)}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Columns</h4>
              <div className="flex flex-wrap gap-1">
                {dataset.columns.slice(0, 5).map((column) => (
                  <span
                    key={column}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {column}
                  </span>
                ))}
                {dataset.columns.length > 5 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    +{dataset.columns.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDataset(dataset)}
                className="text-gray-600 hover:text-emerald-600 transition-colors"
                title="Preview Dataset"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="text-gray-600 hover:text-emerald-600 transition-colors"
                title="Download Dataset"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => onDelete(dataset.id)}
              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {previewDataset && (
        <DatasetPreview
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
        />
      )}
    </div>
  );
}