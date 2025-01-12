import { useState } from 'react';
import { Calendar } from 'lucide-react';
import MatchesList from '../components/matches/MatchesList';
import MatchesHeader from '../components/matches/MatchesHeader';
import MatchPredictionModal from '../components/matches/MatchPredictionModal';
import { useMatches } from '../hooks/useMatches';
import type { Match } from '../types/matches';

export default function UpcomingMatches() {
  const {
    matches,
    loading,
    error,
    predictMatch,
    refreshMatches
  } = useMatches();

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = async (match: Match) => {
    setSelectedMatch(match);
    setIsPredicting(true);
    try {
      const result = await predictMatch(match);
      setPrediction(result);
    } catch (error) {
      console.error('Failed to predict match:', error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-primary-600" />
          Upcoming Matches
        </h1>
        <p className="mt-2 text-gray-600">
          View and predict upcoming Premier League fixtures
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <MatchesHeader
          onRefresh={refreshMatches}
          isLoading={loading}
          totalMatches={matches.length}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <MatchesList
          matches={matches}
          onPredict={handlePredict}
          isLoading={loading}
        />

        {selectedMatch && (
          <MatchPredictionModal
            match={selectedMatch}
            onClose={() => {
              setSelectedMatch(null);
              setPrediction(null);
            }}
            prediction={prediction}
            isLoading={isPredicting}
          />
        )}
      </div>
    </div>
  );
}