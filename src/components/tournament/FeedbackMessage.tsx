import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart } from 'lucide-react';
import type { TournamentTeam } from '../../types/tournament';

interface Props {
  team: TournamentTeam;
  isAdvancing: boolean;
  onClose: () => void;
}

export default function FeedbackMessage({ team, isAdvancing, onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          isAdvancing ? 'bg-primary-500' : 'bg-gray-700'
        } text-white max-w-sm`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            isAdvancing ? 'bg-primary-400' : 'bg-gray-600'
          }`}>
            {isAdvancing ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {isAdvancing
                ? `🎉 Congratulations! ${team.name} advanced to the next round!`
                : `😢 Unfortunately, ${team.name} didn't make it. Try again next time!`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}