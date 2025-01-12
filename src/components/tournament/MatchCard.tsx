import {Trophy} from 'lucide-react';
import type {MatchPrediction} from '../../types/tournament';

interface Props {
  match: MatchPrediction;
  result?: { homeGoals: number; awayGoals: number };
  isCurrentRound: boolean;
  isFinal?: boolean;
  onClick?: () => void;
}

export default function MatchCard({match, isCurrentRound, isFinal, onClick}: Props) {
  const getTeamClasses = (isHome: boolean) => {
    const baseClasses = 'flex items-center gap-2 p-3 rounded-lg transition-all';

    if (isCurrentRound) return `${baseClasses} text-gray-400`;

    const isWinner = (match.winner == match.homeTeam.id) == isHome
    return `${baseClasses} ${isWinner ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300'}`; //todo: add is favourite color

    // return `${baseClasses} hover:bg-gray-700 cursor-pointer text-gray-300`;
  };

  return (
    <div
      onClick={isCurrentRound ? undefined : onClick}
      className={`bg-gray-800 rounded-xl p-4 ${
        isFinal ? 'border-2 border-yellow-500' : ''
      } ${isCurrentRound && !isFinal ? 'ring-2 ring-primary-500' : ''} ${
        !isCurrentRound ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      }`}
    >
      <div className="text-sm font-medium text-gray-400 mb-2">
        {isFinal ? (
          <div className="flex items-center gap-1 text-yellow-500">
            <Trophy className="w-4 h-4"/>
            Final
          </div>
        ) : (
          match.round.charAt(0).toUpperCase() + match.round.slice(1)
        )}
      </div>

      <div className="space-y-2">
        <div className={getTeamClasses(true)}>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <img
              src={match.homeTeam.logoUrl}
              alt={match.homeTeam.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex-1 font-medium">{match.homeTeam.name}</span>
          {!isCurrentRound && <span className="text-xl font-bold">{match.homeTeam.stats?.goalsScored?.toFixed(1)}</span>}
        </div>

        <div className={getTeamClasses(false)}>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <img
              src={match.awayTeam.logoUrl}
              alt={match.awayTeam.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex-1 font-medium">{match.awayTeam.name}</span>
          {!isCurrentRound && <span className="text-xl font-bold">{match.awayTeam.stats?.goalsScored?.toFixed(1)}</span>}
        </div>
      </div>
    </div>
  );
}