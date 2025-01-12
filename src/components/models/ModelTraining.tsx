import {useState} from 'react';
import {ArrowLeft, Brain} from 'lucide-react';
import ModelTypeSelector from './ModelTypeSelector';
import DatasetSelector from './DatasetSelector';
import ColumnSelector from './ColumnSelector';
import {Dataset, DatasetTypes} from '../../types/dataset';
import {useResource} from "../../hooks/useResource.ts";
import {datasetsApi} from "../../utils/api.ts";
import ErrorDisplay from "../common/ErrorDisplay.tsx";

interface Props {
  onTrain: (config: TrainingConfig) => void;
}

interface TrainingConfig {
  modelType: 'match-prediction' | 'player-position' ;
  datasetId: string;
  columns: string[];
  name: string;
}

const getDatasetTypesForModelType = (modelType: string): string[] => {
  switch (modelType) {
    case 'match-prediction':
      return [DatasetTypes.MATCHES]
    default:
      return [DatasetTypes.PLAYER_STATS]
  }
}

export default function ModelTraining({onTrain}: Props) {
  const [step, setStep] = useState<'dataset' | 'name' | 'columns'>('dataset');
  const [modelType, setModelType] = useState<'match-prediction' | 'player-position' >('match-prediction');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [modelName, setModelName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const {
    resource: datasets,
    isLoading,
    reload, error
  } = useResource<Dataset[]>(() => datasetsApi.list(getDatasetTypesForModelType(modelType)), [modelType], {initialValue: []})

  const handleBack = () => {
    switch (step) {
      case 'name':
        setStep('dataset');
        setSelectedDataset(null);
        break;
      case 'columns':
        setStep('name');
        setSelectedColumns([]);
        break;
    }
  };

  const handleModelSelection = (m: 'match-prediction' | 'player-position' ) => {
    if (m !== modelType) {
      setModelType(m);
      setStep('dataset')
    }
  }
  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset(datasetId);
    setStep('name');
  };

  const handleNameSubmit = () => {
    if (modelName.trim()) {
      setStep('columns');
    }
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleSubmit = () => {
    if (!modelType || !selectedDataset || !modelName.trim() || selectedColumns.length === 0) return;

    onTrain({
      modelType,
      datasetId: selectedDataset,
      columns: selectedColumns,
      name: modelName.trim()
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-600"/>
          <h2 className="text-xl font-semibold text-gray-900">Train New Model</h2>
        </div>
        {step !== 'dataset' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4"/>
            Back
          </button>
        )}
      </div>

      <div className="space-y-8">
        <ModelTypeSelector
          selectedType={modelType}
          onSelect={handleModelSelection}
        />

        {step === 'dataset' && !error && (
          <DatasetSelector
            datasets={datasets}
            selectedDataset={selectedDataset}
            onSelect={handleDatasetSelect}
            isLoading={isLoading}
          />
        )}

        {step === 'dataset' && error &&
          <ErrorDisplay message={error.message} onRetry={reload}/>
        }

        {step === 'name' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Name Your Model</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleNameSubmit}
                disabled={!modelName.trim()}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'columns' && (
          <ColumnSelector
            dataset={datasets.find(d => d.id === selectedDataset)!}
            selectedColumns={selectedColumns}
            onColumnToggle={handleColumnToggle}
            isLoading={isLoading}
          />
        )}

        {step === 'columns' && (
          <button
            onClick={handleSubmit}
            disabled={!modelType || !selectedDataset || !modelName.trim() || selectedColumns.length === 0}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Training
          </button>
        )}
      </div>
    </div>
  );
}