import React from 'react';
import {motion} from 'framer-motion';
import {Heart, X, Trophy, ArrowRight} from 'lucide-react';
import type {MatchPrediction, TournamentTeam} from '../../types/tournament';

interface Props {
  favoriteTeam: TournamentTeam;
  match: MatchPrediction,
  lastSustainedRound: string
  onClose: () => void;
}

export default function TeamFailedAnimation({
                                              favoriteTeam,
                                              match,
                                              lastSustainedRound,
                                              onClose
                                            }: Props) {
  const winningTeam = match.homeTeam.id === match.winner? match.homeTeam: match.awayTeam
  const losingTeam = match.homeTeam.id === match.winner? match.awayTeam: match.homeTeam
  const probability = losingTeam.stats!.winProbability;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{scale: 0.9, y: 20}}
        animate={{scale: 1, y: 0}}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6"/>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            A Valiant Effort!
          </h2>
          <p className="text-gray-600">
            {favoriteTeam.name} fought bravely to the {lastSustainedRound}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={losingTeam.logoUrl} alt={losingTeam.name} className="w-10 h-10"/>
              <div className="text-xl font-bold">{losingTeam.stats!.goalsScored}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400"/>
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold">{winningTeam.stats?.winProbability}</div>
              <img src={winningTeam.logoUrl} alt={winningTeam.name} className="w-10 h-10"/>
            </div>
          </div>
          <div className="text-sm text-gray-500 text-center">
            {(probability * 100).toFixed(1)}% win probability
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-gray-700">
            Despite the odds, your team showed incredible spirit and determination.
          </p>
          <p className="text-gray-700">
            Remember, champions are built through challenges. {favoriteTeam.name} will come back stronger!
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Watching
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}