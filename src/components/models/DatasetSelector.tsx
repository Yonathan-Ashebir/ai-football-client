import {Database, Loader2} from 'lucide-react';
import {Dataset} from '../../types/dataset';

interface Props {
  datasets: Dataset[];
  selectedDataset: string | null;
  onSelect: (datasetId: string) => void;
  isLoading: boolean;
}

export default function DatasetSelector({ 
  datasets, 
  selectedDataset,
  onSelect,
  isLoading 
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Dataset</h3>
      <div className="space-y-2">
        {datasets.map((dataset) => (
          <button
            key={dataset.id}
            onClick={() => onSelect(dataset.id)}
            className={`w-full flex items-center p-3 rounded-lg border transition-all ${
              selectedDataset === dataset.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-500'
            }`}
          >
            <Database className="w-5 h-5 text-primary-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">{dataset.name}</p>
              <p className="text-sm text-gray-500">{dataset.type_label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}