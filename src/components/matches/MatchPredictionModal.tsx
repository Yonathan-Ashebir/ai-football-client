import { X, Trophy } from 'lucide-react';
import type { Match } from '../../types/matches';
import { formatMatchDate } from '../../utils/dateUtils';

interface Props {
  match: Match;
  onClose: () => void;
  prediction?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  isLoading: boolean;
}

export default function MatchPredictionModal({ match, onClose, prediction, isLoading }: Props) {
  const { date, time } = formatMatchDate(match.utcDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Match Prediction</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">{`${date} at ${time}`}</div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-12 h-12 mx-auto mb-2" />
                <div className="font-semibold">{match.homeTeam.shortName}</div>
              </div>
              <div className="text-sm text-gray-500">vs</div>
              <div className="flex-1">
                <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12 mx-auto mb-2" />
                <div className="font-semibold">{match.awayTeam.shortName}</div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : prediction ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="text-lg font-semibold text-primary-700">
                    {(prediction.homeWin * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Home Win</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-700">
                    {(prediction.draw * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Draw</div>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="text-lg font-semibold text-primary-700">
                    {(prediction.awayWin * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Away Win</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}