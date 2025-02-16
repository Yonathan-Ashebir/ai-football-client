import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Medal, Trophy } from 'lucide-react';
import { useSound } from "../../hooks/useSound.ts";

interface Props {
  progress: number;
}

export default function CurrentTournamentRound({ progress }: Props) {
  const playSound = useSound();
  const prevProgress = useRef(progress);

  const rounds = [
    { id: 'quarterfinal', name: 'Quarter Finals', icon: Circle, frequency: 440, progress: 0 },
    { id: 'semifinal', name: 'Semi Finals', icon: Circle, frequency: 523.25, progress: 33.3 },
    { id: 'final', name: 'Final', icon: Medal, frequency: 659.25, progress: 66.6 },
    { id: 'results', name: 'Champion', icon: Trophy, frequency: 783.99, progress: 100 }
  ] as const;

  const currentRound = rounds.find(r => r.progress === progress) || rounds[0];

  useEffect(() => {
    if (prevProgress.current !== progress) {
      const round = rounds.find(r => r.progress === progress);
      if (round) {
        playSound(round.frequency, 0.3);
      }
      prevProgress.current = progress;
    }
  }, [progress, playSound]);

  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-xl px-6 py-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute -left-2 -right-2 top-1/2 -translate-y-1/2">
          <div className="h-1.5 bg-gray-700/50 rounded-full" />
          <motion.div
            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Current Round Display */}
        <div className="relative flex justify-center py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRound.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="flex flex-col items-center"
            >
              {/* Icon Container with Glow Effect */}
              <div className="relative">
                <div
                  className={`
                    absolute inset-0 blur-xl opacity-40
                    ${currentRound.id === 'results'
                    ? 'bg-yellow-500'
                    : 'bg-primary-500'
                  }
                  `}
                />
                <div
                  className={`
                    relative w-14 h-14 rounded-full 
                    flex items-center justify-center 
                    transition-all duration-300 
                    shadow-lg
                    ${currentRound.id === 'results'
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 shadow-yellow-500/20'
                    : 'bg-gradient-to-br from-primary-400 to-primary-600 text-gray-900 shadow-primary-500/20'
                  }
                  `}
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 0.6, type: "spring", stiffness: 200 },
                      scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    <currentRound.icon className="w-7 h-7" />
                  </motion.div>
                </div>
              </div>

              {/* Round Name with Gradient Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 text-center"
              >
                <span className={`
                  text-base font-semibold bg-clip-text text-transparent
                  ${currentRound.id === 'results'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-r from-primary-400 to-primary-600'
                }
                `}>
                  {currentRound.name}
                </span>
                {/* Progress Indicator */}
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  Tournament Progress: {Math.round(progress)}%
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}