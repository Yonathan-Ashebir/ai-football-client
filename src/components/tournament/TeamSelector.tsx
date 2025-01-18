import {AlertCircle, Users} from 'lucide-react';
import MatchHistoryInput from './MatchHistoryInput';
import FavoriteTeamSelector from './FavoriteTeamSelector';
import type {TournamentTeam} from '../../types/tournament';
import {Model} from "../../types/model.ts";
import {useResource} from "../../hooks/useResource.ts";
import {modelsApi} from "../../utils/api.ts";
import {useState} from "react";
import TeamSearch from "./TeamSearch.tsx";
import {getRandomElements} from "../../utils";

interface Props {
  selectedModel: Model
  selectedTeams: TournamentTeam[];
  matchHistory: number;
  favoriteTeam: string | null;
  onMatchHistoryChange: (value: number) => void;
  onTeamSelect: (team: TournamentTeam) => void;
  onTeamRemove: (teamId: string) => void;
  onFavoriteTeamSelect: (teamId: string) => void;
}

export default function TeamSelector({
                                       selectedModel,
                                       selectedTeams,
                                       matchHistory,
                                       favoriteTeam,
                                       onMatchHistoryChange,
                                       onTeamSelect,
                                       onTeamRemove,
                                       onFavoriteTeamSelect,
                                     }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    resource: allTeams,
    reload: handleRetryTeams,
    error: teamsError,
    isLoading: isLoadingTeams
  } = useResource<TournamentTeam[]>(async () => modelsApi.getModelTeams(selectedModel.id), [selectedModel], {initialValue: []});

  const handleTeamSelect = (team: TournamentTeam) => {
    if (selectedTeams.length < 8) {
      onTeamSelect(team);
    }
  };

  const availableTeams = allTeams.filter(
    team => !selectedTeams.find(selected => selected.id === team.id)
  );

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRandomSelect = () => {
    const remainingTeams = 8 - selectedTeams.length
    if (remainingTeams == 0) {
       selectedTeams.forEach(team => onTeamRemove(team.id));
      const randomTeams = getRandomElements(selectedTeams, 8);
      randomTeams.forEach(onTeamSelect)
    } else {
      const randomTeams = getRandomElements(availableTeams, remainingTeams);
      randomTeams.forEach(onTeamSelect)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary-600"/>
        <h2 className="text-lg font-semibold">Select Teams</h2>
      </div>
      <div className="space-y-4">
        <MatchHistoryInput
          value={matchHistory}
          onChange={onMatchHistoryChange}
        />

        <TeamSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRandomSelect={onRandomSelect}/>
        {allTeams.length > 0 &&
          <div className="grid grid-cols-2 gap-2">
            {selectedTeams.map(team => (
              <div
                key={team.id}
                className="flex items-center justify-between p-2 bg-primary-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <img src={team.logoUrl} alt={team.name} className="w-6 h-6"/>
                  <span className="text-sm font-medium text-primary-700">{team.name}</span>
                </div>
                <button
                  onClick={() => onTeamRemove(team.id)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        }

        {allTeams.length === 0 && isLoadingTeams && (
          <div className="flex items-center justify-center py-8">
            <div
              className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"/>
          </div>
        )}

        {!isLoadingTeams && teamsError &&
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5"/>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading teams</h3>
                <p className="mt-1 text-sm text-red-700">{teamsError.message}</p>
                <button
                  onClick={handleRetryTeams}
                  className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        }

        {selectedTeams.length === 8 && (
          <FavoriteTeamSelector
            teams={selectedTeams}
            selectedTeam={favoriteTeam}
            onSelect={onFavoriteTeamSelect}
          />
        )}

        {selectedTeams.length < 8 && (
          <div className="mt-4 space-y-1">
            {filteredTeams.map(team => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
              >
                <img src={team.logoUrl} alt={team.name} className="w-6 h-6"/>
                <span>{team.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}