import {useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {Trophy, Circle, Medal} from 'lucide-react';
import {useSound} from "../../hooks/useSound.ts";
/* TODO: fix */
interface Props {
  currentRound: 'quarterfinal' | 'semifinal' | 'final' | 'results' | 'champion';
  progress: number;
}

export default function TournamentTimeline({currentRound, progress}: Props) {
  const playSound = useSound();
  const prevRoundRef = useRef(currentRound);

  const rounds = [
    {id: 'quarterfinal', name: 'Quarter Finals', icon: Circle, frequency: 440},
    {id: 'semifinal', name: 'Semi Finals', icon: Circle, frequency: 523.25},
    {id: 'final', name: 'Final', icon: Medal, frequency: 659.25},
    {id: 'results', name: 'Champion', icon: Trophy, frequency: 783.99}
  ];

  useEffect(() => {
    if (prevRoundRef.current !== currentRound) {
      const round = rounds.find(r => r.id === currentRound);
      if (round) {
        playSound(round.frequency, 0.3);
      }
      prevRoundRef.current = currentRound;
    }
  }, [currentRound, playSound]);

  const getStopColor = (roundId: string) => {
    const roundIndex = rounds.findIndex(r => r.id === roundId);
    const currentIndex = rounds.findIndex(r => r.id === currentRound);

    if (roundIndex <= currentIndex) {
      return 'bg-primary-500 text-gray-900';
    }
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-8">
      <div className="relative">
        {/* Progress Line Container */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-[20px] right-[20px] z-0">
          {/* Background Line */}
          <div className="absolute h-1.5 w-full bg-gray-700 rounded-full"/>
          {/* Progress Line */}
          <motion.div
            className="absolute h-1.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full"
            initial={{width: 0}}
            animate={{width: `${progress}%`}}
            transition={{duration: 0.8, ease: "easeInOut"}}
          />
        </div>

        {/* Stops */}
        <div className="relative flex justify-between mx-5">
          {rounds.map((round, index) => {
            const Icon = round.icon;
            const isActive = rounds.findIndex(r => r.id === currentRound) >= index;

            return (
              <div
                key={round.id}
                className="flex flex-col items-center z-10"
                style={{
                  width: '40px',
                  marginLeft: index === 0 ? '-20px' : 0,
                  marginRight: index === rounds.length - 1 ? '-20px' : 0
                }}
              >
                <motion.div
                  initial={{scale: 0.8, opacity: 0}}
                  animate={{
                    scale: isActive ? 1 : 0.8,
                    opacity: 1
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                      getStopColor(round.id)
                    } ${isActive ? 'shadow-lg shadow-primary-500/20' : ''}`}
                  >
                    <motion.div
                      animate={{
                        rotate: isActive ? 360 : 0,
                        scale: isActive ? 1 : 0.8
                      }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Icon className="w-5 h-5"/>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.span
                  className={`mt-2 text-sm font-medium whitespace-nowrap ${
                    round.id === currentRound ? 'text-primary-500' : 'text-gray-400'
                  }`}
                  initial={{y: 10, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1 + 0.2
                  }}
                >
                  {round.name}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}