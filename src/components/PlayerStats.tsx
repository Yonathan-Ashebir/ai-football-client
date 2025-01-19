import {FormEvent, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {AlertCircle, Check, Loader2, UserCircle, X} from 'lucide-react';
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from 'recharts';
import {Model, ModelTypes} from '../types/model';
import {useResource} from "../hooks/useResource.ts";
import {modelsApi, playerStatisticsApi} from "../utils/api.ts";
import {Feature, PlayerPositionPrediction, positions} from "../types";
import {formatFileSize} from "../utils/formatters.ts";
import ErrorDisplay from "./common/ErrorDisplay.tsx";
import SingleModelSelector from "./common/SingleModelSelector.tsx";
import {roundToNearest} from "../utils";

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
    resource: availableModels,
    isLoading: isLoadingModels,
    error: modelsError,
    reload: reloadModels,
  } = useResource<Model[]>(() => modelsApi.list([ModelTypes.PLAYER_STATISTICS_WITH_SCALER]), [], {
    initialValue: [],
    onReload: () => setSelectedModel(null)
  })


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

  console.log('position', position, 'prediction', prediction);
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
  }, [])

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
            <div key={feature.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    selectedFeatures[feature.id]?.enabled ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {selectedFeatures[feature.id]?.enabled ? (
                    <Check className="w-4 h-4" opacity={feature.optional ? 1 : 0.5}/>
                  ) : (
                    <div className="w-4 h-4 border rounded-sm"/>
                  )}
                  {feature.name}
                  {feature.optional && (
                    <span className="text-xs text-gray-400">(optional)</span>
                  )}
                </button>
                <span className="text-sm text-gray-600">
                          {feature.prefix && feature.prefix}
                  {feature?.isInteger ? selectedFeatures[feature.id]?.value : selectedFeatures[feature.id]?.value?.toFixed(1)}
                  {feature.suffix && feature.suffix}
                        </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={selectedFeatures[feature.id] ? getToProgress(feature)(selectedFeatures[feature.id].value) : 0}
                onChange={(e) => updateFeature(feature, getToValue(feature)(feature?.isInteger ? parseInt(e.target.value, 10) : parseFloat(e.target.value)))}
                disabled={!selectedFeatures[feature.id]?.enabled}
                className="w-full accent-primary-600 disabled:opacity-50 placeholder-primary-300 "
              />
            </div>
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