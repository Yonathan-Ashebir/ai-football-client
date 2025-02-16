import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import type {MatchPrediction} from '../../types/tournament';
import MatchCard from './MatchCard';
import {ArrowRight, Loader2, RefreshCw} from "lucide-react";
import TournamentTimeline from "./TournamentTimeline.tsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  matches: MatchPrediction[];
  onMatchClick: (match: MatchPrediction) => void;
  proceedToNextRound: () => Promise<void>;
  currentRound: 'quarterfinal' | 'semifinal' | 'final' | 'results';
  progress: number
}

const roundLabels = {
  quarterfinal: 'Semi Finals',
  semifinal: 'Final',
  final: 'Results'
};

export default function Bracket({ matches, onMatchClick, proceedToNextRound, currentRound, progress,className,  ...rest }: Props) {
  const quarterFinals = matches.filter(m => m.round === 'quarterfinal');
  const semiFinals = matches.filter(m => m.round === 'semifinal');
  const final = matches.find(m => m.round === 'final');
  const [isProceeding, setIsProceeding] = useState(false);
  const [proceedError, setProceedError] = useState<{ message: string } | null>(null);

  const getWinnerClass = (match: MatchPrediction) => {
    return match.winner === match.homeTeam.id ? 'home-winner' : 'away-winner';
  };

  const onProceed = async () => {
    setIsProceeding(true);
    setProceedError(null);
    try {
      await proceedToNextRound();
    } catch (e) {
      setProceedError(e instanceof Error ? e : { message: "Failed to proceed" });
    } finally {
      setIsProceeding(false);
    }
  };

  return (
    <div className={"relative min-h-[800px] flex flex-col justify-between bg-gray-900 rounded-3xl p-8 pb-8 overflow-hidden "+ className} {...rest}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
          Tournament Bracket
        </h2>
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
                className={`relative ${getWinnerClass(match)}`}
              >
                <MatchCard
                  match={match}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => onMatchClick(match)}
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
                className={`relative ${getWinnerClass(match)}`}
              >
                <MatchCard
                  match={match}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => onMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        {/* Final */}
        {final && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 z-10">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative ${getWinnerClass(final)}`}
              >
                <MatchCard
                  match={final}
                  isCurrentRound={final.round === currentRound}
                  onClick={() => onMatchClick(final)}
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
                className={`relative ${getWinnerClass(match)}`}
              >
                <MatchCard
                  match={match}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => onMatchClick(match)}
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
                className={`relative ${getWinnerClass(match)}`}
              >
                <MatchCard
                  match={match}
                  isCurrentRound={match.round === currentRound}
                  onClick={() => onMatchClick(match)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="proceed-button mt-4 bottom-8 left-0 right-0 flex justify-center">
        {currentRound !== 'results' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onProceed}
            disabled={isProceeding}
            className={`
              relative w-48 h-14 flex items-center justify-center
              bg-gradient-to-r from-primary-600 to-primary-500
              hover:from-primary-500 hover:to-primary-400
              text-white rounded-lg font-medium
              shadow-lg hover:shadow-xl
              transform hover:-translate-y-1 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              overflow-hidden
            `}
          >
            <AnimatePresence mode="wait">
              {isProceeding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="w-6 h-6 animate-spin" />
                </motion.div>
              ) : proceedError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                  onClick={() => setProceedError(null)}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </motion.div>
              ) : (
                <motion.div
                  key="proceed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <span>TO</span>
                  <span>{roundLabels[currentRound].toUpperCase()}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      <div className='mt-4'/>
      <TournamentTimeline progress={progress}/>

      <style>{`
        .home-winner::after,
        .away-winner::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          pointer-events: none;
          opacity: 0.15;
          transition: opacity 0.3s ease;
        }
        .home-winner:hover::after,
        .away-winner:hover::after {
          opacity: 0.25;
        }
        .home-winner::after {
          background: linear-gradient(45deg, rgb(16, 185, 129), transparent);
        }
        .away-winner::after {
          background: linear-gradient(-45deg, rgb(59, 130, 246), transparent);
        }
        .proceed-button button{
           border-radius: 1rem;
        }
      `}</style>
    </div>
  );
}