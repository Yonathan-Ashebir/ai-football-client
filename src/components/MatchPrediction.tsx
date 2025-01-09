import React, {useEffect, useState} from 'react';
import {AlertCircle, Brain, HelpCircle, Loader2, Trophy, X} from 'lucide-react';
import ModelSelector from './prediction/ModelSelector';
import MatchHistorySelector from './prediction/MatchHistorySelector';
import AdvancedMetrics from './prediction/AdvancedMetrics';
import TeamSelect from './common/TeamSelect';
import {usePrediction} from '../hooks/usePrediction';
import {Model, ModelTypes} from '../types/model';
import {useResource} from "../hooks/useResource.ts";
import {modelsApi} from "../utils/api.ts";
import {findIntersection} from "../utils";
import ErrorDisplay from "./common/ErrorDisplay.tsx";
import {TournamentTeam} from "../types/tournament.ts";

const REQUIRED_MODEL_TYPES = [
  {
    id: ModelTypes.MATCH_WINNER_WITH_SCALER,
    label: 'Win Probability',
    description: 'Predicts the winning team based on historical performance'
  },
  {
    id: ModelTypes.NUMBER_OF_GOALS_WITH_SCALER,
    label: 'Expected Goals',
    description: 'Predicts expected goals for both teams'
  },
  {
    id: ModelTypes.BOTH_TEAMS_TO_SCORE_WITH_SCALER,
    label: 'Both Teams To Score',
    description: 'Analyzes the chances both teams have to score on each other'
  }
] as const;

type ModelSelections = {
  [K in typeof REQUIRED_MODEL_TYPES[number]['id']]?: string;
};

export default function MatchPrediction() {
  const [selectedModels, setSelectedModels] = useState<ModelSelections>({});
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [matchHistory, setMatchHistory] = useState<number>(2);
  const [showResults, setShowResults] = useState(false);


  const {loading, error, result, metrics, getPrediction} = usePrediction();

  const {
    resource: models,
    isLoading: isLoadingModels,
    error: modelsError,
    reload: reloadModels,
  } = useResource<Model[]>(modelsApi.list, [], {initialValue: []})

  const {
    resource: teams,
    reload: handleRetryTeams,
    error: teamsError,
    isLoading: isLoadingTeams,
    quickUpdate: setTeams
  } = useResource<TournamentTeam[]>(async () => {
    let requests = []
    for (let key in selectedModels) {
      const modelId = selectedModels[key];
      requests.push(modelsApi.getModelTeams(modelId!))
    }
    const groupsOfTeams = await Promise.all(requests)

    return findIntersection(groupsOfTeams, (t1, t2) => t1.id == t2.id);
  }, [selectedModels], {initialValue: [], lazy: Object.keys(selectedModels).length != REQUIRED_MODEL_TYPES.length});


  const handleModelSelect = (type: typeof REQUIRED_MODEL_TYPES[number]['id'], modelId: string) => {
    if (selectedModels[type] !== modelId) {
      setSelectedModels({
        ...selectedModels,
        [type]: modelId
      });
      setTeams([])
    }
  };

  const isModelSelectionComplete = REQUIRED_MODEL_TYPES.every(
    type => selectedModels[type.id] !== undefined
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await getPrediction({
      homeTeam,
      awayTeam,
      matchHistory,
      models: selectedModels
    });
    setShowResults(true);
  };


  const handleClose = () => {
    setShowResults(false);
    setSelectedModels({});
    setTeams([])
    setHomeTeam('')
    setAwayTeam('')
  };

  useEffect(() => { //TODO: when is better nessecary?
    if(teams.length ===0){
      setHomeTeam('')
      setAwayTeam('')
    }
  }, [teams]);

  useEffect(() => {
    if(homeTeam === '' || awayTeam === '') setShowResults(false);
  }, [homeTeam, awayTeam]);


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary-600"/>
            <h2 className="text-2xl font-bold text-gray-800">Match Prediction</h2>
          </div>
          {Object.keys(selectedModels).length > 0 && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6"/>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REQUIRED_MODEL_TYPES.map(type => (
              <div key={type.id} className="relative group">
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help"/>
                    <div
                      className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {type.description}
                    </div>
                  </div>
                </div>
                {!isLoadingModels && !modelsError &&
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary-600"/>
                      <h3 className="text-sm font-medium text-gray-900">{type.label}</h3>
                    </div>
                    <ModelSelector
                      models={models.filter(m => m.type === type.id)}
                      selectedModel={models.find(m => m.id === selectedModels[type.id])}
                      onSelect={(model) => handleModelSelect(type.id, model.id)}
                    />
                  </div>
                }
                {isLoadingModels &&
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
                  </div>
                }
                {modelsError &&
                  <ErrorDisplay message={modelsError.message} onRetry={reloadModels}/>
                }
              </div>
            ))}
          </div>

          {isModelSelectionComplete && (
            <>
              {isLoadingTeams ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
                  <span className="ml-2 text-gray-600">Loading teams...</span>
                </div>
              ) : teamsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5"/>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Loading Teams</h3>
                      <p className="mt-1 text-sm text-red-700">{teamsError}</p>
                      <button
                        onClick={handleRetryTeams}
                        className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Team
                      </label>
                      <TeamSelect
                        value={homeTeam}
                        onChange={setHomeTeam}
                        placeholder="Select Home Team"
                        teams={teams.filter(t => t.id !== awayTeam)}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Away Team
                      </label>
                      <TeamSelect
                        value={awayTeam}
                        onChange={setAwayTeam}
                        placeholder="Select Away Team"
                        teams={teams.filter(t => t.id !== homeTeam)}
                      />
                    </div>
                  </div>

                  <MatchHistorySelector
                    value={matchHistory}
                    onChange={setMatchHistory}
                  />

                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
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
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"/>
                        Calculating...
                      </>
                    ) : (
                      'Predict Match'
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </form>

        {showResults && result && metrics && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Home Win</div>
                <div className="text-lg font-bold text-primary-600">
                  {(result.homeTeamProbability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Draw</div>
                <div className="text-lg font-bold text-gray-600">
                  {(result.drawProbability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
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