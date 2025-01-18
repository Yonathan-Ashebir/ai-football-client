import { Calendar, Clock } from 'lucide-react';
import type { Match } from '../../types/matches';
import { formatMatchDate } from '../../utils/dateUtils';
import { motion } from 'framer-motion';

interface Props {
  match: Match;
  onPredict: (match: Match) => void;
  isPredicting?: boolean;
}

export default function MatchCard({ match, onPredict, isPredicting }: Props) {
  const { date, time } = formatMatchDate(match.utcDate);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative bg-white rounded-2xl shadow-lg p-6 group overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50" />

      {/* Content */}
      <div className="relative space-y-6 flex flex-col justify-between h-full">
        {/* Date and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
            <span>{time}</span>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-stretch justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center space-y-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="relative mx-auto w-20 h-20 p-2 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow"
            >
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-primary-600/5 rounded-2xl" />
            </motion.div>
            <div className="text-lg font-bold bg-gradient-to-br from-primary-900 to-primary-700 bg-clip-text text-transparent">
              {match.homeTeam.shortName}
            </div>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 bg-primary-200 rounded-full opacity-20 animate-ping" />
              <div className="relative w-12 h-12 flex items-center justify-center bg-primary-100 rounded-full">
                <span className="text-sm font-bold text-primary-700">VS</span>
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center space-y-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative mx-auto w-20 h-20 p-2 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow"
            >
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-primary-600/5 rounded-2xl" />
            </motion.div>
            <div className="text-lg font-bold bg-gradient-to-br from-primary-900 to-primary-700 bg-clip-text text-transparent">
              {match.awayTeam.shortName}
            </div>
          </div>
        </div>

        {/* Predict Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPredict(match)}
          disabled={isPredicting}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold shadow-md
            transition-all duration-200 mt-auto
            ${isPredicting
            ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-700 to-primary-500 text-white hover:shadow-lg hover:from-primary-600 hover:to-primary-400'
          }
          `}
        >
          {isPredicting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <span>Predicting...</span>
            </div>
          ) : (
            'Predict Match'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}