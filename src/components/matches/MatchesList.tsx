import { Loader2, Trophy } from 'lucide-react';
import MatchCard from './MatchCard';
import MatchCardLoader from './MatchCardLoader.tsx';
import type { Match } from '../../types/matches';

interface Props {
  matches: Match[];
  onPredict: (match: Match) => void;
  isLoading: boolean;
  isPredicting: boolean;
  selectedMatch: Match | null;
}

export default function MatchesList({ matches, onPredict, isLoading, isPredicting, selectedMatch }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Trophy className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No upcoming matches</h3>
        <p className="mt-1 text-sm text-gray-500">Check back later for new fixtures</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="relative overflow-hidden">
            <MatchCardLoader />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onPredict={onPredict}
          isPredicting={isPredicting && selectedMatch?.id === match.id}
        />
      ))}
    </div>
  );
}