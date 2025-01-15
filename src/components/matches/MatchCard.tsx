import { Calendar, Clock } from 'lucide-react';
import type { Match } from '../../types/matches';
import { formatMatchDate } from '../../utils/dateUtils';

interface Props {
  match: Match;
  onPredict: (match: Match) => void;
  isPredicting?: boolean;
}

export default function MatchCard({ match, onPredict, isPredicting }: Props) {
  const { date, time } = formatMatchDate(match.utcDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-8 h-8" />
          <div className="text-lg font-semibold">{match.homeTeam.shortName}</div>
        </div>
        <div className="text-sm font-medium text-gray-500">vs</div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">{match.awayTeam.shortName}</div>
          <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-8 h-8" />
        </div>
      </div>

      <button
        onClick={() => onPredict(match)}
        disabled={isPredicting}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPredicting ? 'Predicting...' : 'Predict Match'}
      </button>
    </div>
  );
}