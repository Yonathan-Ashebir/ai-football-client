import {useState} from 'react';
import {ArrowLeft, Brain, Loader2} from 'lucide-react';
import ModelTypeSelector from './ModelTypeSelector';
import DatasetSelector from './DatasetSelector';
import ColumnSelector from './ColumnSelector';
import {Dataset, DatasetTypes} from '../../types/dataset';
import {useResource} from "../../hooks/useResource.ts";
import {datasetsApi} from "../../utils/api.ts";
import ErrorDisplay from "../common/ErrorDisplay.tsx";
import {useManaged} from "../../hooks/useManaged.ts";
import {ModelType} from "../../types/model.ts";

interface Props {
  onTrain: (config: TrainingConfig) => Promise<void>;
}

type TrainingType = 'match-prediction' | 'player-position'

interface TrainingConfig {
  modelType: ModelType;
  datasets: string[];
  columns: string[];
  name: string;
}

const getCorrespondingModelType = (t: 'match-prediction' | 'player-position'): ModelType => {
  switch (t) {
    case 'match-prediction':
      return 'match_winner_with_scaler'
    case 'player-position':
      return 'player_statistics_with_scaler'
    default:
      throw new Error(`Unknown training type ${t}`);
  }
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
  const [trainingType, setTrainingType] = useState<TrainingType>('match-prediction');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [modelName, setModelName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const [traingingStartError, setTraingingStartError] = useState<string | null>(null);
  const [isStartingTraining, setIsStartingTraining] = useState<boolean>(false);

  const {
    resource: datasets,
    isLoading,
    reload, error
  } = useResource<Dataset[]>(() => datasetsApi.list(getDatasetTypesForModelType(trainingType)), [trainingType], {initialValue: []})


  const {
    value: columns,
    error: columnsError,
    isLoading: areColumnsLoading
  } = useManaged<string[]>(() => (selectedDataset ? [[], datasetsApi.getViableInputColumns([selectedDataset], getCorrespondingModelType(trainingType))] : []), [selectedDataset])

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

  const handleModelSelection = (m: 'match-prediction' | 'player-position') => {
    if (m !== trainingType) {
      setTrainingType(m);
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

  const handleSubmit = async () => {
    if (!trainingType || !selectedDataset || !modelName.trim() || selectedColumns.length === 0 || isStartingTraining) return;
    try {
      setTraingingStartError(null)
      setIsStartingTraining(true);
      await onTrain({
        modelType: getCorrespondingModelType(trainingType),
        datasets: [selectedDataset],
        columns: selectedColumns,
        name: modelName.trim()
      });
      setStep('dataset');
      setSelectedDataset(null);
      setSelectedColumns([])
    } catch (error) {
      setTraingingStartError(error instanceof Error ? error.message : "Could not start training");
    } finally {
      setIsStartingTraining(false);
    }
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
          selectedType={trainingType}
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 placeholder-primary-300"
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
            columns={columns!}
            selectedColumns={selectedColumns}
            onColumnToggle={handleColumnToggle}
            isLoading={areColumnsLoading}
            error={columnsError}
          />
        )}

        {step === 'columns' && (
          !isStartingTraining ? (
            <>
              <button
                onClick={handleSubmit}
                disabled={!trainingType || !selectedDataset || !modelName.trim() || selectedColumns.length === 0}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Training
              </button>
              {traingingStartError &&
                <ErrorDisplay message={traingingStartError} onDismiss={() => setTraingingStartError(null)}/>}
            </>
          ) : (
            <div className="flex items-center justify-center py-2 px-4">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
            </div>
          )

        )}
      </div>
    </div>
  );
}