import {useState} from 'react';
import DatasetUpload from '../components/datasets/DatasetUpload';
import DatasetList from '../components/datasets/DatasetList';
import DatasetHeader from '../components/datasets/DatasetHeader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import {useDatasets} from '../hooks/useDatasets';

export default function Datasets() {
  const {
    datasets,
    loading,
    error,
    uploadDataset,
    deleteDataset,
    refreshDatasets
  } = useDatasets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDatasets();
    setIsRefreshing(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
        <p className="mt-2 text-gray-600">
          Upload and manage your datasets for training AI models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <DatasetUpload onUpload={uploadDataset}/>
        </div>
        <div className="lg:col-span-2">
          <DatasetHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {error ? (
            <ErrorDisplay
              message={error}
              onRetry={refreshDatasets}
            />
          ) : (
            <DatasetList
              datasets={(datasets ?? []).filter(dataset =>
                dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dataset.type.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              onDelete={deleteDataset}
              isLoading={loading}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
}