import { Calendar } from 'lucide-react';
import type { HistoricalMatch } from '../../types';

interface Props {
  matches: HistoricalMatch[];
}

export default function MatchHistory({ matches }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Matches</h3>
      
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">
                  {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(match.date).toLocaleDateString()} • {match.competition}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}