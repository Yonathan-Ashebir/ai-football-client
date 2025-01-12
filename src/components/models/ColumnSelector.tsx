import { useState } from 'react';
import { Table, Check, Search } from 'lucide-react';
import type { Dataset } from '../../types/dataset';
import ColumnSelectorDialog from './ColumnSelectorDialog';

interface Props {
  dataset: Dataset;
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
  isLoading: boolean;
}

export default function ColumnSelector({
  dataset,
  selectedColumns,
  onColumnToggle,
  isLoading
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const maxVisibleTags = 5;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Select Training Columns</h3>
        <span className="text-sm text-gray-500">
          {selectedColumns.length} of {dataset.columns.length} selected
        </span>
      </div>

      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 group"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Table className="w-5 h-5 text-primary-600" />
          <span>Choose columns for training</span>
        </div>
        <Search className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
      </button>

      {selectedColumns.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedColumns.slice(0, maxVisibleTags).map(column => (
            <div
              key={column}
              className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
            >
              <Check className="w-4 h-4" />
              <span>{column}</span>
              <button
                onClick={() => onColumnToggle(column)}
                className="ml-1 text-primary-600 hover:text-primary-800"
              >
                ×
              </button>
            </div>
          ))}
          {selectedColumns.length > maxVisibleTags && (
            <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
              +{selectedColumns.length - maxVisibleTags} more
            </div>
          )}
        </div>
      )}

      <ColumnSelectorDialog
        dataset={dataset}
        selectedColumns={selectedColumns}
        onColumnToggle={onColumnToggle}
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
      />
    </div>
  );
}