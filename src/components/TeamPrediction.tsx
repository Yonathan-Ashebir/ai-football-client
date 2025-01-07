import React, { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import ModelSelector from './prediction/ModelSelector';
import MatchHistorySelector from './prediction/MatchHistorySelector';
import AdvancedMetrics from './prediction/AdvancedMetrics';
import TeamSelect from './common/TeamSelect';
import { usePrediction } from '../hooks/usePrediction';
import { demoModels } from '../data/demoModels';
import type { Model } from '../types/model';

export default function TeamPrediction() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [matchHistory, setMatchHistory] = useState<number>(4);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  
  const { loading, error, result, metrics, getPrediction } = usePrediction();

  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      setModelsError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModels(demoModels.filter(m => m.type === 'team-prediction' && m.status === 'completed'));
      } catch (err) {
        setModelsError('Failed to load prediction models');
      } finally {
        setIsLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || homeTeam === awayTeam) return;

    await getPrediction({
      homeTeam,
      awayTeam,
      matchHistory
    });
    setShowResults(true);
  };

  const handleClose = () => {
    setShowResults(false);
    setHomeTeam('');
    setAwayTeam('');
    setSelectedModel(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800">Match Prediction</h2>
          </div>
          {selectedModel && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {!selectedModel ? (
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Prediction Model</h3>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
              isLoading={isLoadingModels}
              error={modelsError}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Team
                </label>
                <TeamSelect
                  value={homeTeam}
                  onChange={setHomeTeam}
                  placeholder="Select Home Team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Away Team
                </label>
                <TeamSelect
                  value={awayTeam}
                  onChange={setAwayTeam}
                  placeholder="Select Away Team"
                />
              </div>
            </div>

            <MatchHistorySelector
              value={matchHistory}
              onChange={setMatchHistory}
            />

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !homeTeam || !awayTeam || homeTeam === awayTeam}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Calculating...
                </>
              ) : (
                'Predict Match'
              )}
            </button>
          </form>
        )}

        {showResults && result && metrics && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Home Win</div>
                <div className="text-lg font-bold text-primary-600">
                  {(result.homeTeamProbability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Draw</div>
                <div className="text-lg font-bold text-gray-600">
                  {(result.drawProbability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Away Win</div>
                <div className="text-lg font-bold text-blue-600">
                  {(result.awayTeamProbability * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <AdvancedMetrics
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              metrics={metrics}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}