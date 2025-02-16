import {useEffect, useRef, useState} from 'react';
import {Loader2, Trophy} from 'lucide-react';
import TeamSelector from '../components/tournament/TeamSelector';
import TournamentSettings from '../components/tournament/TournamentSettings';
import VictoryAnimation from '../components/tournament/VictoryAnimation';
import FeedbackMessage from '../components/tournament/FeedbackMessage';
import MatchResult from '../components/tournament/MatchResult';
import {useTournament} from '../hooks/useTournament';
import type {MatchPrediction, TournamentTeam} from '../types/tournament';
import {Model, ModelStatus, ModelTypes} from '../types/model';
import TeamFailedAnimation from "../components/tournament/TeamFailedAnimation.tsx";
import {modelsApi} from "../utils/api.ts";
import ErrorDisplay from "../components/common/ErrorDisplay.tsx";
import SingleModelSelector from "../components/common/SingleModelSelector.tsx";
import BracketMobile from "../components/tournament/BrackerMobile.tsx";
import Bracket from "../components/tournament/Bracket.tsx";

export default function Tournament() {
  const [selectedTeams, setSelectedTeams] = useState<TournamentTeam[]>([]);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [matchHistory, setMatchHistory] = useState(3);
  const [feedback, setFeedback] = useState<{
    team: TournamentTeam;
    isAdvancing: boolean;
  } | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchPrediction | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [startTournamentError, setStartTournamentError] = useState<string | null>(null);
  const [isStartingTournament, setIsStartingTournament] = useState<boolean>(false);

  const availableModels = models.filter(model =>
    model.type === ModelTypes.NUMBER_OF_GOALS_WITH_SCALER &&
    model.status === ModelStatus.READY
  );

  const loadModels = async () => {
    setIsLoadingModels(true);
    setModelsError(null);
    try {
      setModels((await modelsApi.list(["number_of_goals_with_scaler"])).filter(model => model.status === ModelStatus.READY));
    } catch {
      setModelsError('Failed to load prediction models. Please try again.');
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const {
    matches,
    winner,
    currentRound,
    progress,
    createQuarterFinals,
    proceedToNextRound,
    resetTournament,
    favoriteTeam,
    setFavoriteTeam,
    loosingMatch
  } = useTournament();

  const handleTeamSelect = (team: TournamentTeam) => {
    setSelectedTeams(prev => [...prev, team]);
  };

  const handleTeamRemove = (teamId: string) => {
    setSelectedTeams(prev => prev.filter(team => team.id !== teamId));
    if (favoriteTeam === teamId) {
      setFavoriteTeam(null);
    }
  };

  const startTournament = async () => {
    if (selectedTeams.length === 8 && selectedModel && favoriteTeam) {
      try {
        setStartTournamentError(null);
        setIsStartingTournament(true)
        await createQuarterFinals(selectedTeams, selectedModel, matchHistory);
        setStartTournamentError(null);
        setTournamentStarted(true);
      } catch (error) {
        setStartTournamentError(error instanceof Error ? error.message : "Could not start to tournament");
      } finally {
        setIsStartingTournament(false)
      }
    }
  };

  const handleMatchClick = async (match: MatchPrediction) => {
    setSelectedMatch(match);
  };

  const handleClose = () => {
    resetTournament();
    setTournamentStarted(false);
    setFeedback(null);
    setFavoriteTeam(null);
    setSelectedTeams([]);
    setSelectedModel(null);
  };

  const handleRetryModels = () => {
    setModels([]);
    setSelectedModel(null);
    setModelsError(null);
    loadModels();
  };


  useEffect(() => {
    if (currentRound == 'results' || currentRound == 'quarterfinal') return
    setFeedback({team: selectedTeams.find(t => t.id === favoriteTeam)!, isAdvancing: true})
    return () => setFeedback(null)
  }, [currentRound])

  const lastNonResultRound = useRef(currentRound)
  if (currentRound !== 'results') lastNonResultRound.current = currentRound;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 pb-32">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary-600"/>
          Tournament Predictor
        </h1>
        <p className="mt-2 text-gray-600">
          Select a model and 8 teams to predict the tournament outcome
        </p>
      </div>

      {!tournamentStarted ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Model Selection */}
            <SingleModelSelector models={availableModels} selectedModel={selectedModel}
                                 onSelect={model => setSelectedModel(model)} onRetry={handleRetryModels}
                                 error={modelsError ? new Error(modelsError) : null} isLoading={isLoadingModels}/>
            <div className="mt-4"></div>
            {selectedModel &&
              <TeamSelector
                selectedModel={selectedModel}
                selectedTeams={selectedTeams}
                matchHistory={matchHistory}
                favoriteTeam={favoriteTeam}
                onMatchHistoryChange={setMatchHistory}
                onTeamSelect={handleTeamSelect}
                onTeamRemove={handleTeamRemove}
                onFavoriteTeamSelect={setFavoriteTeam}
              />}


            <button
              onClick={startTournament}
              disabled={selectedTeams.length !== 8 || !favoriteTeam}
              className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Tournament
            </button>

            {isStartingTournament &&
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
              </div>
            }

            {startTournamentError &&
              <ErrorDisplay message={startTournamentError}/>}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <TournamentSettings
            matchHistory={matchHistory}
            favoriteTeam={favoriteTeam}
            teams={selectedTeams}
          />
          <BracketMobile
            className={'lg:hidden'}
            matches={matches}
            onMatchClick={handleMatchClick}
            proceedToNextRound={() => proceedToNextRound(selectedModel!, matchHistory)}
            currentRound={currentRound}
            progress={progress}
          />
          <Bracket
            className={'hidden lg:block'}
            matches={matches}
            onMatchClick={handleMatchClick}
            proceedToNextRound={() => proceedToNextRound(selectedModel!, matchHistory)}
            currentRound={currentRound}
            progress={progress}
          />
        </div>
      )}

      {winner && <VictoryAnimation winner={winner} onClose={handleClose}/>}
      {loosingMatch && favoriteTeam &&
        <TeamFailedAnimation favoriteTeam={selectedTeams.find(t => t.id === favoriteTeam)!} match={loosingMatch!}
                             lastSustainedRound={lastNonResultRound.current}
                             onClose={handleClose}/>}

      {feedback && (
        <FeedbackMessage key={currentRound}
                         team={feedback.team}
                         isAdvancing={feedback.isAdvancing}
                         onClose={() => setFeedback(null)}
        />
      )}

      {selectedMatch && (
        <MatchResult
          homeTeam={selectedMatch.homeTeam}
          awayTeam={selectedMatch.awayTeam}
          homeGoals={selectedMatch.homeTeam.stats!.goalsScored!}
          awayGoals={selectedMatch.awayTeam.stats!.goalsScored!}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
