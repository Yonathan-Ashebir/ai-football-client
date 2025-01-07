import React from 'react';
import { History, HelpCircle } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const options = [
  { value: 2, label: 'Last 2 Matches' },
  { value: 4, label: 'Last 4 Matches' },
  { value: 6, label: 'Last 6 Matches' },
];

export default function MatchHistorySelector({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-gray-900">Recent Match History</span>
        </div>
        <div className="relative group">
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            Select the number of recent matches to consider for prediction
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}