import {useState} from 'react';
import {AlertCircle} from 'lucide-react';
import type {Dataset} from '../../types/dataset';
import DatasetPreview from './DatasetPreview';
import {datasetsApi} from "../../utils/api.ts";
import DatasetCard from './DatasetCard.tsx';

interface Props {
  datasets: Dataset[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export default function DatasetList({datasets, onDelete, isLoading, searchQuery}: Props) {
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"/>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48"/>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"/>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"/>
              </div>
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-full"/>
                ))}
              </div>
            </div>
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"/>
          </div>
        ))}
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400"/>
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
        <DatasetCard dataset={dataset} onDelete={onDelete} getDownloadLink={datasetsApi.getDownloadLink}
                     onPreview={setPreviewDataset}/>
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