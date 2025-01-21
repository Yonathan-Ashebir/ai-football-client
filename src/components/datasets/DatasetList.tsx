import {useState} from 'react';
import {AlertCircle, Trash2Icon} from 'lucide-react';
import type {Dataset} from '../../types/dataset';
import DatasetPreview from './DatasetPreview';
import {datasetsApi} from "../../utils/api.ts";
import DatasetCard from './DatasetCard.tsx';
import DatasetCardSkeleton from "./DatasetCardSkeleton.tsx";
import {GeneralModal} from "../common/GeneralModal.tsx";

interface Props {
  datasets: Dataset[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export default function DatasetList({datasets, onDelete, isLoading, searchQuery}: Props) {
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
  const [confirmDeletionDataset, setConfirmDeletionDataset] = useState<Dataset | null>(null);
  const [historicalCount, setHistoricalCount] = useState(datasets.length);

  if (datasets.length !== historicalCount) setHistoricalCount(datasets.length);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(historicalCount)].map((_, index) => (
          <DatasetCardSkeleton key={index}/>
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
        <DatasetCard dataset={dataset} onDelete={() => setConfirmDeletionDataset(dataset)}
                     getDownloadLink={datasetsApi.getDownloadLink}
                     onPreview={setPreviewDataset}/>
      ))}

      {previewDataset && (
        <DatasetPreview
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
        />
      )}

      {confirmDeletionDataset && <GeneralModal actions={[{
        onClick: () => setConfirmDeletionDataset(null),
        content: 'Cancel',
        className: 'text-gray-600 hover:bg-gray-100',
      },
        {
          onClick: () => {
            onDelete(confirmDeletionDataset!.id)
            setConfirmDeletionDataset(null);
          },
          content: 'Confirm',
          icon: Trash2Icon,
          className: 'bg-red-600 text-white hover:bg-red-700',
        },]} title={"Confirmation"}> Are you sure you want to
        delete {confirmDeletionDataset.name}</GeneralModal>}
    </div>
  );
}