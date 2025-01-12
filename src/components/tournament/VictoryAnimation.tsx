import {motion} from 'framer-motion';
import {Trophy, X} from 'lucide-react';
import type {TournamentTeam} from '../../types/tournament';

interface Props {
  winner: TournamentTeam;
  onClose: () => void;
}

export default function VictoryAnimation({winner, onClose}: Props) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <motion.div
        className="bg-white rounded-lg p-8 text-center max-w-md mx-4 relative"
        initial={{scale: 0.8, y: 50}}
        animate={{scale: 1, y: 0}}
        transition={{type: 'spring', damping: 12}}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6"/>
        </button>

        <motion.div
          initial={{rotate: -180, scale: 0}}
          animate={{rotate: 0, scale: 1}}
          transition={{type: 'spring', damping: 10, delay: 0.2}}
        >
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4"/>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tournament Champion!
        </h2>
        <p className="text-xl text-primary-600 font-semibold mb-4">
          {winner.name}
        </p>

        <div className="text-gray-600 mb-6">
          <p>Goals Scored: {winner.stats!.goalsScored!.toFixed(1)}</p>
          {winner.stats?.winProbability && <p>Win Rate: {Math.round(winner.stats.winProbability * 100)}%</p>}
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Close
        </button>

        {/* Confetti effect using multiple small circles */}
        {Array.from({length: 50}).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'][i % 4],
              left: `${Math.random() * 100}%`,
              top: `-20px`,
            }}
            initial={{y: -20}}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}