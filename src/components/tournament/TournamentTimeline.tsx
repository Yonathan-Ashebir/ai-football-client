import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';

interface Props {
  currentRound: 'quarterfinal' | 'semifinal' | 'final';
  progress: number;
}

export default function TournamentTimeline({ currentRound, progress }: Props) {
  const rounds = [
    { id: 'quarterfinal', name: 'Quarter Finals' },
    { id: 'semifinal', name: 'Semi Finals' },
    { id: 'final', name: 'Final' }
  ];

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md p-6 mt-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {rounds.map((round, index) => (
            <div
              key={round.id}
              className={`flex items-center ${
                index < rounds.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                round.id === currentRound
                  ? 'bg-primary-500'
                  : rounds.indexOf({ id: currentRound, name: '' }) > index
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              }`}>
                {round.id === 'final' ? (
                  <Trophy className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="ml-2">{round.name}</span>
              {index < rounds.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-700">
                  {rounds.indexOf({ id: currentRound, name: '' }) > index && (
                    <div className="h-full bg-green-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex items-center justify-center mt-2 text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Round in progress...</span>
        </div>
      </div>
    </div>
  );
}
