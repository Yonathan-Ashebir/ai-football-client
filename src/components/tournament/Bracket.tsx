import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MatchPrediction } from '../../types/tournament';
import MatchCard from './MatchCard';

interface Props {
  matches: MatchPrediction[];
  matchResults: Record<string, { homeGoals: number; awayGoals: number }>;
  onMatchClick: (match: MatchPrediction) => void;
  onProceed: () => void;
  currentRound: 'quarterfinal' | 'semifinal' | 'final';
}

export default function Bracket({ matches, matchResults, onMatchClick, onProceed, currentRound }: Props) {
  const quarterFinals = matches.filter(m => m.round === 'quarterfinal');
  const semiFinals = matches.filter(m => m.round === 'semifinal');
  const final = matches.find(m => m.round === 'final');

  const currentRoundMatches = matches.filter(m => m.round === currentRound);
  const allCurrentRoundComplete = currentRoundMatches.every(m => matchResults[m.id]);
  console.log(allCurrentRoundComplete)

  const handleMatchClick = (match: MatchPrediction) => {
    // Allow clicks only if the match round is completed
    if (allCurrentRoundComplete && !matchResults[match.id]) {
      onMatchClick(match);
    }
  };

  const getWinnerClass = (match: MatchPrediction) => {
    if (!matchResults[match.id]) return '';
    const result = matchResults[match.id];
    return result.homeGoals > result.awayGoals ? 'home-winner' : 'away-winner';
  };

  return (
    <div className="relative min-h-[800px] bg-gray-900 rounded-xl p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Tournament Bracket</h2>
      </div>

      <div className="flex justify-between relative">
        {/* Quarter Finals - Left Side */}
        <div className="space-y-8 w-64">
          {quarterFinals.slice(0, 2).map((match) => (
            <AnimatePresence key={match.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={getWinnerClass(match)}
              >
                <MatchCard
                  match={match}
                  result={matchResults[match.id]}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => handleMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        {/* Semi Finals - Left Side */}
        <div className="space-y-16 w-64 mt-16">
          {semiFinals.slice(0, 1).map((match) => (
            <AnimatePresence key={match.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={getWinnerClass(match)}
              >
                <MatchCard
                  match={match}
                  result={matchResults[match.id]}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => handleMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        {/* Final */}
        {final && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={getWinnerClass(final)}
              >
                <MatchCard
                  match={final}
                  result={matchResults[final.id]}
                  isCurrentRound={final.round === currentRound}
                  onClick={() => handleMatchClick(final)}
                  isFinal
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Semi Finals - Right Side */}
        <div className="space-y-16 w-64 mt-16">
          {semiFinals.slice(1).map((match) => (
            <AnimatePresence key={match.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={getWinnerClass(match)}
              >
                <MatchCard
                  match={match}
                  result={matchResults[match.id]}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => handleMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        {/* Quarter Finals - Right Side */}
        <div className="space-y-8 w-64">
          {quarterFinals.slice(2).map((match) => (
            <AnimatePresence key={match.id}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={getWinnerClass(match)}
              >
                <MatchCard
                  match={match}
                  result={matchResults[match.id]}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => handleMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {allCurrentRoundComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onProceed}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            Proceed to {currentRound === 'quarterfinal' ? 'Semi Finals' : currentRound === 'semifinal' ? 'Final' : 'Results'}
          </motion.button>
        )}
      </div>

      <style jsx>{`
        .home-winner::after,
        .away-winner::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          pointer-events: none;
        }
        .home-winner::after {
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.2), transparent);
        }
        .away-winner::after {
          background: linear-gradient(-45deg, rgba(59, 130, 246, 0.2), transparent);
        }
      `}</style>
    </div>
  );
}
