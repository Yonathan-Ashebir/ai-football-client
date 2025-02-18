import {motion} from 'framer-motion';
import {Heart, Trophy, X} from 'lucide-react';
import type {MatchPrediction, TournamentTeam} from '../../types/tournament';
import {roundGoals} from "../../utils";

interface Props {
  favoriteTeam: TournamentTeam;
  match: MatchPrediction;
  lastSustainedRound: string;
  onClose: () => void;
}

export default function TeamFailedAnimation({
                                              favoriteTeam,
                                              match,
                                              lastSustainedRound,
                                              onClose
                                            }: Props) {
  const winningTeam = match.homeTeam.id === match.winner ? match.homeTeam : match.awayTeam;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{scale: 0.9, y: 50, opacity: 0}}
        animate={{scale: 1, y: 0, opacity: 1}}
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.3
        }}
        className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-red-500/5"
          style={{pointerEvents: 'none'}}
          initial={{opacity: 0}}
          animate={{opacity: [0, 1, 0]}}
          transition={{duration: 2, repeat: Infinity, repeatDelay: 1}}
        />

        <motion.button
          whileHover={{scale: 1.1, rotate: 90}}
          whileTap={{scale: 0.9}}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6"/>
        </motion.button>

        <motion.div
          className="text-center mb-8"
          initial={{y: -20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.2}}
        >
          <motion.div
            className="w-20 h-20 -bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Heart className="w-10 h-10 text-red-500"/>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
          >
            Defeat in the {lastSustainedRound}
          </motion.h2>
        </motion.div>

        <motion.div
          className="backdrop-blur rounded-lg p-6 mb-8"
          initial={{opacity: 0, x: -50}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: 0.4}}
        >
          <div className="text-center space-y-4">
            <motion.div
              className="flex items-center justify-center gap-6"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
            >
              <motion.img
                src={favoriteTeam.logoUrl}
                alt={favoriteTeam.name}
                className="w-16 h-16 rounded-lg shadow-md"
                whileHover={{scale: 1.1, rotate: -5}}
              />
              <motion.div
                className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent"
                initial={{scale: 0.5}}
                animate={{scale: 1}}
                transition={{delay: 0.6, type: "spring"}}
              >
                {roundGoals(favoriteTeam.stats?.goalsScored)} - {roundGoals(winningTeam.stats?.goalsScored)}
              </motion.div>
              <motion.img
                src={winningTeam.logoUrl}
                alt={winningTeam.name}
                className="w-16 h-16 rounded-lg shadow-md"
                whileHover={{scale: 1.1, rotate: 5}}
              />
            </motion.div>
            <motion.p
              className="text-lg text-gray-700 font-medium"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.7}}
            >
              Your team was defeated by {winningTeam.name}
            </motion.p>
            {favoriteTeam.stats?.winProbability &&
              <motion.div
                className="inline-block px-4 py-2 bg-gray-100 rounded-full"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.8}}
              >
                <p className="text-sm text-gray-600 font-medium">
                  Win probability: <span className="text-red-500 font-bold">{(favoriteTeam.stats.winProbability * 100).toFixed(1)}%</span>
                </p>
              </motion.div>
            }
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.9}}
        >
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2 group"
          >
            <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}