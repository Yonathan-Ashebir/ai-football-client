import React from 'react';
import {Search} from 'lucide-react';
import MatchHistoryInput from './MatchHistoryInput';
import FavoriteTeamSelector from './FavoriteTeamSelector';
import type {TournamentTeam} from '../../types/tournament';

interface Props {
  allTeams: TournamentTeam[];
  selectedTeams: TournamentTeam[];
  matchHistory: number;
  favoriteTeam: string | null;
  onMatchHistoryChange: (value: number) => void;
  onTeamSelect: (team: TournamentTeam) => void;
  onTeamRemove: (teamId: string) => void;
  onFavoriteTeamSelect: (teamId: string) => void;
}

export default function TeamSelector({
                                       allTeams,
                                       selectedTeams,
                                       matchHistory,
                                       favoriteTeam,
                                       onMatchHistoryChange,
                                       onTeamSelect,
                                       onTeamRemove,
                                       onFavoriteTeamSelect
                                     }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const availableTeams = allTeams.filter(
    team => !selectedTeams.find(selected => selected.id === team.id)
  );

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamSelect = (team: TournamentTeam) => {
    if (selectedTeams.length < 8) {
      onTeamSelect(team);
    }
  };

  return (
    <div className="space-y-4">
      <MatchHistoryInput
        value={matchHistory}
        onChange={onMatchHistoryChange}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

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
  );
}