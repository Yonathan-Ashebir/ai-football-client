import { History, Star } from 'lucide-react';
import type { TournamentTeam } from '../../types/tournament';

interface Props {
  matchHistory: number;
  favoriteTeam: string | null;
  teams: TournamentTeam[];
}

export default function TournamentSettings({
  matchHistory,
  favoriteTeam,
  teams
}: Props) {
  const favoriteTeamObj = teams.find(team => team.id === favoriteTeam);

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-primary-500" />
            <h3 className="font-medium">Match History</h3>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Using last {matchHistory} {matchHistory === 1 ? 'match' : 'matches'} for predictions
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Favorite Team</h3>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            {favoriteTeamObj ? (
              <div className="flex items-center gap-3">
                <img 
                  src={favoriteTeamObj.logoUrl} 
                  alt={favoriteTeamObj.name} 
                  className="w-6 h-6"
                />
                <span className="text-gray-300">{favoriteTeamObj.name}</span>
              </div>
            ) : (
              <p className="text-gray-300">No favorite team selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}