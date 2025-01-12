import {useMemo, useState} from 'react';
import {ArrowLeftRight, Check, CheckSquare, Filter, Search, X} from 'lucide-react';
import type {Dataset} from '../../types/dataset';

interface Props {
  dataset: Dataset;
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ColumnSelectorDialog({
  dataset,
  selectedColumns,
  onColumnToggle,
  onClose,
  isOpen
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const columnCategories = useMemo(() => {
    const categories = new Map<string, string[]>();
    
    dataset.columns.forEach(column => {
      const category = column.split('_').slice(0, -1).join('_') || 'Other';
      const existing = categories.get(category) || [];
      categories.set(category, [...existing, column]);
    });
    
    return categories;
  }, [dataset.columns]);

  const filteredColumns = useMemo(() => {
    return dataset.columns.filter(column => {
      const matchesSearch = column.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || column.startsWith(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [dataset.columns, searchQuery, categoryFilter]);

  const handleSelectAll = () => {
    const columnsToSelect = filteredColumns.filter(column => !selectedColumns.includes(column));
    columnsToSelect.forEach(column => onColumnToggle(column));
  };

  const handleInvertSelection = () => {
    filteredColumns.forEach(column => onColumnToggle(column));
  };

  const handleClearSelection = () => {
    selectedColumns.forEach(column => {
      if (filteredColumns.includes(column)) {
        onColumnToggle(column);
      }
    });
  };

  if (!isOpen) return null;

  const filteredSelectedCount = filteredColumns.filter(column => 
    selectedColumns.includes(column)
  ).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Select Training Columns</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {Array.from(columnCategories.keys()).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <CheckSquare className="w-4 h-4" />
                Select All
              </button>
              <button
                onClick={handleInvertSelection}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Invert Selection
              </button>
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <X className="w-4 h-4" />
                Clear Selection
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredSelectedCount} of {filteredColumns.length} filtered columns selected
            </div>
          </div>
        </div>

        {/* Column List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredColumns.map((column) => (
              <button
                key={column}
                onClick={() => onColumnToggle(column)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-colors ${
                  selectedColumns.includes(column)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedColumns.includes(column)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedColumns.includes(column) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="flex-1 truncate" title={column}>
                  {column}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedColumns.length} of {dataset.columns.length} total columns selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}