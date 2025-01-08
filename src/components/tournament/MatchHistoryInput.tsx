import React from 'react';
import { History, HelpCircle } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function MatchHistoryInput({ value, onChange }: Props) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Match History Range</h3>
        </div>
        <div className="relative group">
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            This number determines how many past matches are used to predict the outcome for the tournament
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="6"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <span className="font-medium text-gray-700 min-w-[4rem] text-center">
            Last {value} {value === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`px-2 py-1 rounded ${
                value === num
                  ? 'bg-primary-100 text-primary-700'
                  : 'hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        Using the last {value} {value === 1 ? 'match' : 'matches'} for tournament predictions
      </p>
    </div>
  );
}