import {FormEvent, useMemo, useState} from 'react';
import {AlertCircle, Loader2, UserCircle} from 'lucide-react';
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from 'recharts';
import {Model, ModelStatus, ModelTypes} from '../../types/model.ts';
import {useResource} from "../../hooks/useResource.ts";
import {modelsApi, playerStatisticsApi} from "../../utils/api.ts";
import {Feature, PlayerPositionPrediction, positions} from "../../types";
import SingleModelSelector from "../common/SingleModelSelector.tsx";
import {roundToNearest} from "../../utils";
import {PlayerFeatures} from "./PlayerFeatures.tsx";
import {FeatureAnalysis} from "./FeatureAnalytics.tsx";

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
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);


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

          <PlayerFeatures setSelectedFeatures={setAdjustedFeatures} selectedFeatures={adjustedFeatures}
                          selectedModel={selectedModel}
                          setAllNecessaryFeaturesSelected={setAllNecessaryFeaturesSelected}
                          setAllFeatures={setAllFeatures}/>

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
      {/*{allFeatures.map((num) => (*/}
      {/*  <button*/}
      {/*    onClick={() => setSelectedFeature(num)}*/}
      {/*    className={`px-2 py-1 rounded ${*/}
      {/*      selectedFeature === num*/}
      {/*        ? 'bg-primary-100 text-primary-700'*/}
      {/*        : 'hover:bg-gray-200'*/}
      {/*    }`}*/}
      {/*  >*/}
      {/*    {num.name}*/}
      {/*  </button>*/}
      {/*))}*/}
      {/*{position && selectedFeature && (*/}
      {/*  <FeatureAnalysis feature={selectedFeature} allFeatures={allFeatures}/>*/}
      {/*)}*/}
    </div>
  );
}


