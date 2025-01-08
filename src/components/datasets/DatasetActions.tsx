import React from 'react';
import { Download, Eye } from 'lucide-react';
import type { Dataset } from '../../types/dataset';

interface Props {
  dataset: Dataset;
  onPreview: () => void;
  onDownload: () => void;
}

export default function DatasetActions({ dataset, onPreview, onDownload }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPreview}
        className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
        title="Preview Dataset"
      >
        <Eye className="w-5 h-5" />
      </button>
      <button
        onClick={onDownload}
        className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
        title="Download Dataset"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
}