import {motion} from 'framer-motion';
import {Trophy} from 'lucide-react';
import type {TournamentTeam} from '../../types/tournament';

interface Props {
  homeTeam: TournamentTeam;
  awayTeam: TournamentTeam;
  homeGoals: number;
  awayGoals: number;
  onClose: () => void;
}

export default function MatchResult({ homeTeam, awayTeam, homeGoals, awayGoals, onClose }: Props) {
  const winner = homeGoals > awayGoals ? homeTeam : awayTeam;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-2" />
          <h3 className="text-xl font-semibold">Match Result</h3>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-16 h-16 mx-auto mb-2" />
            <div className="font-semibold">{homeTeam.name}</div>
            <div className="text-3xl font-bold text-gray-900">{homeGoals.toFixed(1)}</div>
          </div>
          <div className="text-xl font-bold text-gray-400 px-4">vs</div>
          <div className="text-center flex-1">
            <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-16 h-16 mx-auto mb-2" />
            <div className="font-semibold">{awayTeam.name}</div>
            <div className="text-3xl font-bold text-gray-900">{awayGoals.toFixed(1)}</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-1">Winner</div>
          <div className="text-lg font-bold text-primary-600">{winner.name}</div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}