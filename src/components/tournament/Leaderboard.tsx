import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import type { UserPredictionScore } from '../../types/tournament';

interface Props {
  scores: UserPredictionScore[];
}

export default function Leaderboard({ scores }: Props) {
  const sortedScores = [...scores].sort((a, b) => b.accuracy - a.accuracy);
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Leaderboard</h2>
      
      <div className="space-y-4">
        {sortedScores.map((score, index) => (
          <div
            key={score.userId}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getRankIcon(index)}
              <div>
                <p className="font-medium text-gray-900">{score.username}</p>
                <p className="text-sm text-gray-500">
                  {score.correctPredictions} / {score.totalPredictions} correct
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-emerald-600">
                {(score.accuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}