import {FormEvent, useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {AlertCircle, Check, Info, Loader2, UserCircle, X, Lock} from 'lucide-react';
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from 'recharts';
import {Model, ModelStatus, ModelTypes} from '../types/model';
import {useResource} from "../hooks/useResource.ts";
import {modelsApi, playerStatisticsApi} from "../utils/api.ts";
import {Feature, PlayerPositionPrediction, positions} from "../types";
import {formatFileSize} from "../utils/formatters.ts";
import ErrorDisplay from "./common/ErrorDisplay.tsx";
import SingleModelSelector from "./common/SingleModelSelector.tsx";
import {roundToNearest} from "../utils";
import {AnimatePresence, motion} from 'framer-motion';

const MAX_PLAYER_MEASUREMENT_SIZE = 10 * 1024

export default function PlayerStats() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PlayerPositionPrediction | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [adjustedFeatures, setAdjustedFeatures] = useState<Record<Feature['id'], {
    value: number,
    enabled: boolean
  }>>({});
  const [allNecessaryFeaturesSelected, setAllNecessaryFeaturesSelected] = useState(false);


  const {
    resource: allModels,
    isLoading: isLoadingModels,
    error: modelsError,
    reload: reloadModels,
  } = useResource<Model[]>(() => modelsApi.list([ModelTypes.PLAYER_STATISTICS_WITH_SCALER]), [], {
    initialValue: [],
    onReload: () => setSelectedModel(null)
  })

  const availableModels = useMemo(() => allModels.filter((model) => model.status === ModelStatus.READY), [allModels])


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allNecessaryFeaturesSelected) return;

    setLoading(true);
    setError(null);

    try {
      const predictions = await playerStatisticsApi.getPlayerBestPosition({
        measurements: Object.fromEntries(Object.keys(adjustedFeatures).filter(id => adjustedFeatures[id].enabled).map(id => [id, adjustedFeatures[id].value])),
        model_id: selectedModel!.id
      });

      const best = Object.keys(predictions).reduce((best, current) => predictions[current as keyof PlayerPositionPrediction] > predictions[best as keyof PlayerPositionPrediction] ? current : best) as keyof PlayerPositionPrediction
      setPosition(positions[best] ? positions[best] : best);
      setPrediction(predictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to predict position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle className="w-6 h-6 text-primary-600"/>
        <h2 className="text-2xl font-bold text-gray-800">Player Position Predictor</h2>
      </div>

      {/* Model Selection */}
      <SingleModelSelector models={availableModels} selectedModel={selectedModel}
                           onSelect={model => setSelectedModel(model)} onRetry={reloadModels} error={modelsError}
                           isLoading={isLoadingModels}/>
      {selectedModel && !modelsError && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          <Features setSelectedFeatures={setAdjustedFeatures} selectedFeatures={adjustedFeatures}
                    selectedModel={selectedModel} setAllNecessaryFeaturesSelected={setAllNecessaryFeaturesSelected}/>

          <button
            type="submit"
            disabled={!allNecessaryFeaturesSelected}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                Analyzing...
              </>
            ) : (
              'Predict Position'
            )}
          </button>
        </form>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5"/>
          <p>{error}</p>
        </div>
      )}
      {position && Object.keys(adjustedFeatures).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">
              Based on the provided stats, this player would be best suited as a
              <span className="font-bold text-primary-600 ml-1">{position}</span>
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={Object.entries(prediction!).map(([subject, value]) => ({
                subject,
                value: roundToNearest(value * 100, 1)
              }))}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="subject"/>
                <PolarRadiusAxis angle={45}
                                 domain={[0, roundToNearest(Math.max(...Object.entries(prediction!).map((_, value) => value)), 1)]}/> {/* TODO improve */}
                <Radar
                  name="Stats"
                  dataKey="value"
                  stroke="#7C3AED"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

const Features = ({selectedModel, selectedFeatures, setSelectedFeatures, setAllNecessaryFeaturesSelected}: {
  selectedModel: Model,
  selectedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>,
  setSelectedFeatures: (updatedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>) => void,
  setAllNecessaryFeaturesSelected: (ready: boolean) => void
}) => {
  const {
    resource: features,
    isLoading: isLoadingFeatures,
    error: featuresError,
    reload: reloadFeatures,
  } = useResource<Feature[]>(() => playerStatisticsApi.getAdjustableFeatures(selectedModel!.id), [selectedModel], {
    initialValue: [],
  })

  const selectedCount = Object.entries(selectedFeatures).filter(([, value]) => value.enabled).length

  const [isExtractingMeasures, setIsExtractingMeasures] = useState(false); // TODO: use
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const updateSelectedFeatures = (updatedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>) => {
    setSelectedFeatures(updatedFeatures);
    setAllNecessaryFeaturesSelected(features.filter(f => !f.optional).every(feature => updatedFeatures[feature.id].enabled));
  }

  const toggleFeature = (feature: Feature) => {
    if (!feature.optional) return
    updateSelectedFeatures({
      ...selectedFeatures,
      [feature.id]: {...selectedFeatures[feature.id], enabled: !selectedFeatures[feature.id]?.enabled}
    });
  }

  const updateFeature = (feature: Feature, value: number) => {
    updateSelectedFeatures({...selectedFeatures, [feature.id]: {...selectedFeatures[feature.id], value}})
  }


  const handleFileDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setFileUploadError('Please upload a CSV or XLSX file');
      return;
    }

    if (file.size > MAX_PLAYER_MEASUREMENT_SIZE) {
      setFileUploadError('File size must be less than ' + formatFileSize(MAX_PLAYER_MEASUREMENT_SIZE));
      return;
    }

    setFileUploadError(null);
    setIsExtractingMeasures(true);
    try {
      const newFeatures = await playerStatisticsApi.extractPlayerMeasurements(file)
      const featuresMap = Object.fromEntries(features.map(f => [f.id, f]))
      const filtered = Object.entries(newFeatures).filter(([id, value]) => id in selectedFeatures && (!featuresMap[id].maximum || value < featuresMap[id].maximum) && (!featuresMap[id].minimum || value > featuresMap[id].minimum)).map(([id, value]) => [id, {
        value,
        enabled: true
      }])
      updateSelectedFeatures({...selectedFeatures, ...Object.fromEntries(filtered)})
    } catch (err) {
      setFileUploadError('Error parsing file. Please check the format.');
    } finally {
      setIsExtractingMeasures(false);
    }
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {
    return () => {
      setSelectedFeatures({})
      setAllNecessaryFeaturesSelected(false)
    }
  }, [selectedModel])

  const getFeatureDefault = (feature: Feature) => (feature.minimum !== undefined && feature.maximum !== undefined) ? (feature.minimum + feature.maximum) / 2 : feature.minimum !== undefined ? feature.minimum : feature.maximum !== undefined ? feature.maximum : 0

  useEffect(() => {
      if (features.some(feature => selectedFeatures[feature.id] === undefined)) {
        updateSelectedFeatures(Object.fromEntries(features.map(feature => [feature.id, {
          value: getFeatureDefault(feature),
          enabled: !feature.optional
        }])))
      }
    }, [features, selectedFeatures]
  )

  const getToProgress = (feature: Feature) => {
    const minimum = feature.minimum ?? 0
    const maximum = feature.maximum ?? 100
    return (value: number) => (value - minimum) * 100 / (maximum - minimum)
  }

  const getToValue = (feature: Feature) => {
    const minimum = feature.minimum ?? 0
    const maximum = feature.maximum ?? 100
    return (progress: number) => minimum + (maximum - minimum) * progress / 100
  }

  return isLoadingFeatures ? (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin"/>
      <span className="ml-3 text-gray-600">Loading model features...</span>
    </div>
  ) : featuresError ? (
    <ErrorDisplay message={featuresError.message} onRetry={reloadFeatures}/>
  ) : (
    <div {...getRootProps()} className="relative">
      <input {...getInputProps()} className="hidden"/>
      <div
        className={`absolute inset-0 -m-4 rounded-lg border-2 border-dashed transition-colors pointer-events-none ${
          isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-transparent'
        }`}/>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">Model Features</h3>
            <div className="text-sm text-gray-500">
              Drag & drop a CSV/XLSX file or adjust manually
            </div>
          </div>
          <span className="text-sm text-gray-500">
                    {selectedCount} of {features.length} selected
                  </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <FeatureController feature={feature} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature}
                               updateFeature={updateFeature} getToProgress={getToProgress} getToValue={getToValue}/>
          ))}
        </div>
      </div>
      {isExtractingMeasures &&
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
        </div>
      }
      {fileUploadError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5"/>
            <p>{fileUploadError}</p>
          </div>
          <button
            onClick={() => setFileUploadError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>
      )}
    </div>
  )
}


interface FeatureContollerProps {
  feature: Feature;
  selectedFeatures: Record<string, { enabled: boolean; value: number }>;
  toggleFeature: (feature: Feature) => void;
  updateFeature: (feature: Feature, value: number) => void;
  getToProgress: (feature: Feature) => (value: number) => number;
  getToValue: (feature: Feature) => (progress: number) => number;
}

function FeatureController({
                             feature,
                             selectedFeatures,
                             toggleFeature,
                             updateFeature,
                             getToProgress,
                             getToValue
                           }: FeatureContollerProps) {
  const isEnabled = selectedFeatures[feature.id]?.enabled;
  const currentValue = selectedFeatures[feature.id]?.value;

  const getProgressPercentage = () => {
    if (!currentValue) return 0;
    return getToProgress(feature)(currentValue);
  };

  return (
    <div className="relative group">
      <div className={`p-4 rounded-xl transition-all duration-200 ${
        isEnabled
          ? 'bg-primary-50 ring-2 ring-primary shadow-sm'
          : 'bg-white hover:bg-gray-50 ring-1 ring-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => toggleFeature(feature)}
              disabled={!feature.optional}
              className={`relative group/checkbox ${!feature.optional ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                isEnabled
                  ? 'bg-primary text-white ring-2 ring-primary-300'
                  : 'bg-white ring-2 ring-gray-300'
              }`}>
                <AnimatePresence>
                  {isEnabled && (
                    <motion.div
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      exit={{scale: 0}}
                    >
                      <Check className="w-3 h-3"/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!feature.optional && (
                <Lock className="absolute -top-1 -right-1 w-3 h-3 text-gray-400"/>
              )}
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium transition-colors ${
                  isEnabled ? 'text-primary' : 'text-gray-700'
                }`}>
                  {feature.name}
                </span>
                {feature.optional && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                    Optional
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div
            animate={{
              scale: isEnabled ? 1 : 0.95,
              opacity: isEnabled ? 1 : 0.7
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isEnabled
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {feature.prefix}{feature.isInteger ? currentValue : currentValue?.toFixed(1)}{feature.suffix}
          </motion.div>
        </div>

        {/* Slider */}
        <div className="relative px-1">
          <div className="relative h-14 flex items-center">
            <div className="absolute inset-0 flex items-center">
              {/* Track Background */}
              <div className={`w-full h-3 rounded-full ${
                isEnabled ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                {/* Filled Track */}
                <motion.div
                  className={`h-full rounded-full ${
                    isEnabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  style={{width: `${getProgressPercentage()}%`}}
                  initial={false}
                  animate={{opacity: isEnabled ? 0.3 : 0.1}}
                  transition={{duration: 0.2}}
                />
              </div>
            </div>

            {/* Range Input */}
            <input
              type="range"
              min={0}
              max={100}
              value={getProgressPercentage()}
              onChange={(e) => {
                const progress = parseFloat(e.target.value);
                const value = getToValue(feature)(feature.isInteger ? Math.round(progress) : progress);
                updateFeature(feature, value);
              }}
              disabled={!isEnabled}
              className={`
                absolute inset-0 w-full appearance-none bg-transparent
                cursor-pointer disabled:cursor-not-allowed
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-xl
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:active:scale-95
                [&::-webkit-slider-thumb]:border-4
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:relative
                [&::-webkit-slider-thumb]:z-10
                ${isEnabled
                ? '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:hover:shadow-primary-200'
                : '[&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:hover:shadow-gray-200'
              }
              `}
            />
          </div>

          {/* Min/Max Labels */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-xs text-gray-500">
              {feature.prefix}{(feature.isInteger ? feature.minimum : feature.minimum?.toFixed(1)) || 0}{feature.suffix}
            </span>
            <span className="text-xs text-gray-500">
              {feature.prefix}{(feature.isInteger ? feature.maximum : feature.maximum?.toFixed(1)) || 100}{feature.suffix}
            </span>
          </div>
        </div>
      </div>

      {/* Info Tooltip */}
      <div className="absolute -top-1 -right-1">
        <div className="relative group/tooltip">
          <div className="p-1 rounded-full bg-primary-100">
            <Info className="w-3 h-3 text-primary"/>
          </div>
          <motion.div
            initial={{opacity: 0, y: -5}}
            whileHover={{opacity: 1, y: 0}}
            className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none"
          >
            Adjust {feature.name.toLowerCase()} within the range
            of {feature.minimum || 0}{feature.suffix} to {feature.maximum || 100}{feature.suffix}
            <div className="absolute bottom-0 right-4 -mb-1 w-2 h-2 bg-gray-900 transform rotate-45"/>
          </motion.div>
        </div>
      </div>
    </div>
  );
}