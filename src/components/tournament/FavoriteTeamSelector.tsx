import { Star } from 'lucide-react';
import type { TournamentTeam } from '../../types/tournament';

interface Props {
  teams: TournamentTeam[];
  selectedTeam: string | null;
  onSelect: (teamId: string) => void;
}

export default function FavoriteTeamSelector({ teams, selectedTeam, onSelect }: Props) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        <h3 className="font-medium text-gray-900">Select Your Favorite Team</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => onSelect(team.id)}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              selectedTeam === team.id
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 border-2 border-transparent hover:border-primary-200'
            }`}
          >
            <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />
            <span className={`text-sm font-medium ${
              selectedTeam === team.id ? 'text-primary-700' : 'text-gray-700'
            }`}>
              {team.name}
            </span>
            {selectedTeam === team.id && (
              <Star className="w-4 h-4 text-yellow-500 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}