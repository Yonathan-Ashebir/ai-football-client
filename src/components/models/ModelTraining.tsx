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
import {Layer} from "../../types";
import ANNParams from "./ANNParams.tsx";
import RandomForestParams from "./RandomForestParams.tsx";
import {motion} from 'framer-motion';
import XGBoostParams from "./XGBoostParams.tsx";

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

const MathPredictionModelTypes = {ANN: "ANN", RANDOM_FOREST: "Random Forest", XG_BOOST: "XgBoost"} as const
type MathPredictionModelType = typeof MathPredictionModelTypes[keyof typeof MathPredictionModelTypes]

const PlayerPositionModelTypes = {ANN: "ANN", RANDOM_FOREST: "Random Forest"} as const
type PlayerPositionModelType = typeof PlayerPositionModelTypes[keyof typeof PlayerPositionModelTypes]


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
  const [step, setStep] = useState<'dataset' | 'name' | 'configure'>('dataset');
  const [trainingType, setTrainingType] = useState<TrainingType>('match-prediction');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [modelName, setModelName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const [traingingStartError, setTraingingStartError] = useState<string | null>(null);
  const [isStartingTraining, setIsStartingTraining] = useState<boolean>(false);

  const [modelType, setModelType] = useState<MathPredictionModelType | PlayerPositionModelType>(MathPredictionModelTypes.ANN)
  const [layers, setLayers] = useState<Layer[]>([]);
  const [epochs, setEpochs] = useState<number>(10);
  const [learningRate, setLearningRate] = useState<number>(0.01);

  const [numTrees, setNumTrees] = useState(100);
  const [maxDepth, setMaxDepth] = useState(10);
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [minSamplesLeaf, setMinSamplesLeaf] = useState(1);

  const [xgbNumTrees, setXgbNumTrees] = useState(100);
  const [xgbMaxDepth, setXgbMaxDepth] = useState(6);
  const [xgbLearningRate, setXgbLearningRate] = useState(0.1);
  const [xgbMinChildWeight, setXgbMinChildWeight] = useState(1);
  const [xgbSubsample, setXgbSubsample] = useState(1);
  const [xgbColsampleByTree, setXgbColsampleByTree] = useState(1);

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
      case 'configure':
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
      setStep('configure');
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


        {step === 'configure' && (
          <ColumnSelector
            columns={columns!}
            selectedColumns={selectedColumns}
            onColumnToggle={handleColumnToggle}
            isLoading={areColumnsLoading}
            error={columnsError}
          />
        )}


        {step === 'configure' && <div className="flex flex-wrap gap-3">
          {Object.values(trainingType === 'match-prediction' ? MathPredictionModelTypes : PlayerPositionModelTypes).map((m) => (
            <motion.button
              key={m}
              onClick={() => setModelType(m)}
              className={`
        relative px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${m === modelType
                ? 'text-primary-900 shadow-lg shadow-primary-100'
                : 'text-gray-600 hover:text-gray-900'
              }
      `}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              {/* Background with gradient and hover effect */}
              <div
                className={`
          absolute inset-0 rounded-lg transition-all duration-200
          ${m === modelType
                  ? 'bg-gradient-to-r from-primary-100 to-primary-50 opacity-100'
                  : 'bg-gray-100 opacity-0 hover:opacity-100'
                }
        `}
              />

              {/* Content with icon */}
              <div className="relative flex items-center gap-2">
                {m === modelType ? (
                  <motion.div
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    className="w-2 h-2 rounded-full bg-primary-500"
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-transparent"/>
                )}
                <span>{m}</span>
              </div>

              {/* Active indicator dot */}
              {m === modelType && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -right-1 -top-1 w-3 h-3 bg-primary-500 rounded-full"
                  transition={{type: "spring", stiffness: 300, damping: 30}}
                />
              )}
            </motion.button>
          ))}
        </div>
        }

        {step === 'configure' && modelType == MathPredictionModelTypes.ANN && (
          <ANNParams epochs={epochs} onEpochsChange={setEpochs} learningRate={learningRate}
                     onLearningRateChange={setLearningRate} layers={layers} onLayersChange={setLayers}
          />
        )}

        {step === 'configure' && modelType == MathPredictionModelTypes.RANDOM_FOREST && (
          <RandomForestParams maxDepth={maxDepth} onMaxDepthChange={setMaxDepth} minSamplesLeaf={minSamplesLeaf}
                              onMinSamplesLeafChange={setMinSamplesLeaf} numTrees={numTrees}
                              onNumTreesChange={setNumTrees} minSamplesSplit={minSamplesSplit}
                              onMinSamplesSplitChange={setMinSamplesSplit}
          />
        )}

        {step === 'configure' && modelType == MathPredictionModelTypes.XG_BOOST && (
          <XGBoostParams
            numTrees={xgbNumTrees}
            maxDepth={xgbMaxDepth}
            learningRate={xgbLearningRate}
            minChildWeight={xgbMinChildWeight}
            subsample={xgbSubsample}
            colsampleByTree={xgbColsampleByTree}
            onNumTreesChange={setXgbNumTrees}
            onMaxDepthChange={setXgbMaxDepth}
            onLearningRateChange={setXgbLearningRate}
            onMinChildWeightChange={setXgbMinChildWeight}
            onSubsampleChange={setXgbSubsample}
            onColsampleByTreeChange={setXgbColsampleByTree}
          />
        )}


        {step === 'configure' && (
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